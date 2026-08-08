"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, type PanInfo } from "motion/react";
import { Link } from "@/i18n/navigation";
import { CaseArt, hasCaseArt } from "@/components/CaseArt";
import { AnimatedNumber } from "@/components/CountUp";
import { pausePageScroll, resumePageScroll } from "@/lib/smoothScroll";

/* ────────────────────────────────────────────────────────────────────────
   Case carousel. A transform-driven track instead of a native scroll rail:
   one motion value owns the position, so drag, wheel, arrows, dots and the
   keyboard all land on the same spring and the thing never fights the page's
   smooth-scroll. Cards peek on both sides; the centred one is at full
   strength while its neighbours sit back a step.
   ──────────────────────────────────────────────────────────────────────── */

export type HighlightItem = {
  key: string;
  slug: string;
  industry: string;
  title: string;
  tagline: string;
  metricValue: string;
  metricLabel: string;
  results: string[];
  image: { src: string; alt: string };
};

const GAP = 20;
/** Share of a card you have to drag past to commit without a flick. */
const COMMIT = 0.2;
/** Same, for a trackpad swipe — lower, because a card is nearly a viewport wide
    and an unhurried two-finger swipe never covers a fifth of one. */
const COMMIT_WHEEL = 0.1;
/** px/s past which a flick counts as intent even on a short drag. */
const FLICK = 380;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function CaseHighlights({ items, ctaLabel }: { items: HighlightItem[]; ctaLabel: string }) {
  const n = items.length;
  const reduce = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [active, setActive] = useState(0);
  const [metrics, setMetrics] = useState({ card: 0, step: 0, pad: 0 });
  const activeRef = useRef(0);
  const dragFromRef = useRef(0);
  const movedRef = useRef(0);
  /** The settle animation, so a new gesture can cut it off mid-flight. */
  const runningRef = useRef<{ stop: () => void } | null>(null);

  activeRef.current = active;

  /* Card width follows the viewport so neighbours always peek by the same
     amount, whatever the breakpoint. */
  const measure = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const w = vp.clientWidth;
    const ratio = w < 640 ? 0.86 : w < 1024 ? 0.74 : 0.64;
    const card = Math.round(w * ratio);
    setMetrics({ card, step: card + GAP, pad: Math.round((w - card) / 2) });
  }, []);

  useIsoLayoutEffect(() => {
    measure();
    const vp = viewportRef.current;
    if (!vp || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    return () => ro.disconnect();
  }, [measure]);

  /* Every input funnels through here. The settle is a fixed ease-out, not a
     spring fed by gesture velocity — a hard flick used to inject its momentum
     into the spring and sail several cards past the target before crawling
     back. Distance only stretches the duration a little. */
  const goTo = useCallback(
    (i: number, instant?: boolean) => {
      const clamped = Math.max(0, Math.min(n - 1, i));
      setActive(clamped);
      activeRef.current = clamped;
      const target = -clamped * metrics.step;
      runningRef.current?.stop();
      runningRef.current = null;
      if (instant || reduce || !metrics.step) {
        x.set(target);
        return;
      }
      const distance = Math.abs(x.get() - target) / metrics.step;
      runningRef.current = animate(x, target, {
        duration: Math.min(0.72, 0.4 + distance * 0.09),
        ease: EASE_OUT,
      });
    },
    [metrics.step, n, reduce, x],
  );

  // Keep the track pinned to the active card through resizes.
  useEffect(() => {
    if (!metrics.step) return;
    runningRef.current?.stop();
    x.set(-activeRef.current * metrics.step);
  }, [metrics.step, x]);

  const onDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const { step } = metrics;
      if (!step) return;
      // One card per gesture, measured from where the drag started — never from
      // wherever the track happens to sit mid-animation.
      const from = dragFromRef.current;
      const dir = info.offset.x < 0 ? 1 : -1;
      const travelled = Math.abs(info.offset.x) > step * COMMIT;
      const flicked = Math.abs(info.velocity.x) > FLICK && Math.abs(info.offset.x) > 12;
      goTo(travelled || flicked ? from + dir : from);
    },
    [goTo, metrics],
  );

  /* Trackpad. Two rules, and everything else follows from them.

     1. The axis is locked once per gesture and held until the gesture goes
        quiet. It is decided on accumulated delta, not on the first event: a
        two-finger swipe opens with tiny, noisy deltas, so judging one event
        sent most horizontal swipes down the vertical path — the rail felt dead
        and the page jerked. Below the threshold we stay out of the way, and a
        tie still goes to the page.
     2. A horizontal gesture scrubs the track 1:1 and snaps when it stops — the
        same contract as a native scroll-snap rail, momentum tail included.
        "One card per gesture" was the other half of the problem: the rail went
        unresponsive while the tail was still firing.

     The one place we don't follow the native rail: a card is most of the
     viewport wide, so an unhurried swipe never covers half of one and would
     always fall back to where it started. Any gesture that clears a fraction of
     a card commits to the next one. */
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || !metrics.step) return;
    const limit = metrics.step * (n - 1);
    const LOCK_AT = 5; // px of accumulated travel before we commit to an axis
    let axis: "x" | "y" | null = null;
    let holdsPage = false;
    let accX = 0;
    let accY = 0;
    let from = 0;
    let travelled = 0;
    let idle = 0;

    const release = () => {
      if (axis === "x") {
        let target = Math.round(-x.get() / metrics.step);
        if (target === from && Math.abs(travelled) > metrics.step * COMMIT_WHEEL) {
          target = from + (travelled > 0 ? 1 : -1);
        }
        goTo(target);
      }
      if (holdsPage) {
        holdsPage = false;
        resumePageScroll();
      }
      axis = null;
      accX = 0;
      accY = 0;
      travelled = 0;
    };

    const onWheel = (e: WheelEvent) => {
      const dx = e.deltaX;
      const dy = e.deltaY;
      window.clearTimeout(idle);
      idle = window.setTimeout(release, 120);

      // A push clearly across the locked axis ends the gesture on the spot.
      // A macOS momentum tail can run for a second after your fingers leave the
      // pad, and without this the stale lock swallows whatever you do next —
      // which is exactly the "swipe sideways, then the page won't scroll" hang.
      if (axis) {
        const along = axis === "x" ? dx : dy;
        const across = axis === "x" ? dy : dx;
        if (Math.abs(across) > Math.abs(along) * 2 && Math.abs(across) > 4) release();
      }

      let travel = dx;
      if (axis === null) {
        accX += dx;
        accY += dy;
        if (Math.abs(accX) < LOCK_AT && Math.abs(accY) < LOCK_AT) return;
        axis = Math.abs(accX) > Math.abs(accY) * 1.15 ? "x" : "y";
        if (axis === "y") return; // the page owns this gesture, hands off
        travel = accX; // replay what the gesture covered before we recognised it
        from = Math.max(0, Math.min(n - 1, Math.round(-x.get() / metrics.step)));
        travelled = 0;
        // Park the page's inertia. Lenis is still gliding from whatever scroll
        // brought you here, and a rail moving over a drifting page is the two
        // scrolls at once.
        holdsPage = true;
        pausePageScroll();
      } else if (axis === "y") {
        return;
      }

      // Own it outright: also stops macOS turning the swipe into a back-nav.
      e.preventDefault();
      e.stopPropagation();
      runningRef.current?.stop();
      runningRef.current = null;

      travelled += travel;
      const next = Math.max(-limit, Math.min(0, x.get() - travel));
      x.set(next);
      const i = Math.max(0, Math.min(n - 1, Math.round(-next / metrics.step)));
      if (i !== activeRef.current) {
        activeRef.current = i;
        setActive(i);
      }
    };

    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      vp.removeEventListener("wheel", onWheel);
      window.clearTimeout(idle);
      if (holdsPage) resumePageScroll(); // never leave the page frozen
    };
  }, [goTo, metrics.step, n, x]);

  useEffect(() => () => runningRef.current?.stop(), []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(active - 1);
    }
  };

  const maxDrag = metrics.step * (n - 1);

  return (
    <div className="relative mt-10 md:mt-14">
      <div
        ref={viewportRef}
        role="group"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative overflow-hidden outline-none"
        style={{
          // Full-bleed so the peeking neighbours have room outside the column.
          marginInline: "calc(50% - 50vw)",
          paddingBlock: "2px",
          ["--fade" as string]: "clamp(20px, 5vw, 96px)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, #000 var(--fade), #000 calc(100% - var(--fade)), transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0, #000 var(--fade), #000 calc(100% - var(--fade)), transparent 100%)",
        }}
      >
        <motion.ul
          className="flex touch-pan-y will-change-transform"
          style={{ x, gap: GAP, paddingInline: metrics.pad }}
          drag={metrics.step ? "x" : false}
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.08}
          dragMomentum={false}
          onPointerDownCapture={() => {
            movedRef.current = 0;
            // Grabbing mid-settle: freeze where it is and treat the nearest card
            // as the origin, so the gesture can't compound with the animation.
            runningRef.current?.stop();
            runningRef.current = null;
            dragFromRef.current = metrics.step
              ? Math.max(0, Math.min(n - 1, Math.round(-x.get() / metrics.step)))
              : activeRef.current;
          }}
          onDrag={(_, info) => {
            movedRef.current = Math.abs(info.offset.x);
          }}
          onDragEnd={onDragEnd}
        >
          {items.map((it, i) => {
            const isActive = i === active;
            return (
              <li
                key={it.key}
                className="shrink-0"
                style={{ width: metrics.card || undefined }}
              >
                <Link
                  href={{ pathname: "/work/[slug]", params: { slug: it.slug } }}
                  aria-label={it.title}
                  draggable={false}
                  tabIndex={isActive ? 0 : -1}
                  data-active={isActive}
                  onClick={(e) => {
                    // A drag that ends on a card shouldn't navigate.
                    if (movedRef.current > 8) e.preventDefault();
                  }}
                  className="group relative block h-[clamp(440px,62vh,660px)] select-none overflow-hidden rounded-[26px] bg-black ring-1 ring-white/[0.06] transition-[transform,opacity,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] data-[active=false]:scale-[0.955] data-[active=false]:opacity-90 data-[active=true]:ring-[color:color-mix(in_srgb,var(--c-accent)_28%,transparent)] data-[active=true]:shadow-[0_44px_100px_-34px_rgba(255,122,45,0.5)] sm:rounded-[30px]"
                >
                  {/* Cover: code-drawn product scene when we have one, photo otherwise */}
                  {hasCaseArt(it.key) ? (
                    <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]">
                      <CaseArt caseKey={it.key} />
                    </div>
                  ) : (
                    <div
                      role="img"
                      aria-label={it.image.alt}
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                      style={{ backgroundImage: `url(${it.image.src})` }}
                    />
                  )}
                  {/* Scrims — the art scenes are already dark, so they get a lighter grade */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background: hasCaseArt(it.key)
                        ? "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 26%, rgba(0,0,0,0.22) 48%, transparent 70%)"
                        : "linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.8) 26%, rgba(0,0,0,0.5) 48%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.06) 100%)",
                    }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background: hasCaseArt(it.key)
                        ? "linear-gradient(to right, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.08) 42%, transparent 62%)"
                        : "linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 45%, transparent 68%)",
                    }}
                  />

                  {/* Neighbours recede a touch — enough to read as depth, not as a broken tile */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-black/20 opacity-100 transition-opacity duration-500 group-data-[active=true]:opacity-0"
                  />
                  {/* Accent hairline crowns the active card */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-data-[active=true]:opacity-100"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,122,45,0.75) 50%, transparent)" }}
                  />

                  {/* Copy */}
                  <div className="absolute inset-0 flex items-end">
                    <div className="w-full max-w-[620px] p-6 sm:p-9 lg:p-12">
                      <span className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] sm:text-[12px]" style={{ color: "var(--c-accent)" }}>
                        <span
                          aria-hidden
                          className="h-px w-6 shrink-0"
                          style={{ background: "linear-gradient(90deg, var(--c-accent), transparent)" }}
                        />
                        {it.industry}
                      </span>
                      <h3
                        className="mt-3 font-semibold leading-[0.96] tracking-[-0.035em] text-white"
                        style={{ fontSize: "clamp(32px, 4.6vw, 72px)" }}
                      >
                        {it.title}
                      </h3>
                      <p className="mt-3 max-w-[440px] text-[14.5px] leading-[1.5] text-white/75 sm:text-[16px]">
                        {it.tagline}
                      </p>

                      <div className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2.5 backdrop-blur-md">
                        <span
                          aria-hidden
                          className="h-9 w-[3px] shrink-0 rounded-full"
                          style={{ background: "var(--c-accent)", boxShadow: "0 0 14px rgba(255,122,45,0.65)" }}
                        />
                        <span className="leading-none">
                          <AnimatedNumber
                            text={it.metricValue}
                            className="block text-[clamp(24px,2.6vw,34px)] font-semibold leading-none tracking-[-0.02em] text-white"
                          />
                          <span className="mt-1.5 block text-[10.5px] uppercase tracking-wider text-white/60">{it.metricLabel}</span>
                        </span>
                      </div>

                      <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-white">
                        {ctaLabel}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform duration-200 group-hover:translate-x-1" style={{ color: "var(--c-accent)" }}>
                          <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </motion.ul>
      </div>

      {/* Controls — below the track, never over the cards */}
      <div className="relative mt-7 flex items-center justify-center gap-5">
        <span
          aria-hidden
          className="absolute left-0 hidden font-mono text-[13px] tabular-nums text-[color:var(--color-text-3)] sm:block"
        >
          <span className="text-[color:var(--color-text)]">{String(active + 1).padStart(2, "0")}</span>
          <span className="mx-1.5 opacity-40">/</span>
          {String(n).padStart(2, "0")}
        </span>
        <NavButton dir="prev" disabled={active === 0} onClick={() => goTo(active - 1)} />

        <div className="flex items-center gap-2.5">
          {items.map((it, i) => (
            <button
              key={it.key}
              type="button"
              onClick={() => goTo(i)}
              aria-label={it.title}
              aria-current={i === active}
              className="grid h-9 place-items-center px-0.5"
            >
              <span
                className="block h-2.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  width: i === active ? 30 : 9,
                  background:
                    i === active ? "var(--c-accent)" : "color-mix(in srgb, var(--color-text-3) 45%, transparent)",
                }}
              />
            </button>
          ))}
        </div>

        <NavButton dir="next" disabled={active === n - 1} onClick={() => goTo(active + 1)} />
      </div>
    </div>
  );
}

function NavButton({
  dir,
  disabled,
  onClick,
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous case" : "Next case"}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] text-[color:var(--color-text)] shadow-[var(--shadow-card)] transition-all duration-200 ease-[cubic-bezier(0.28,0.11,0.32,1)] hover:-translate-y-0.5 hover:border-[color:var(--c-accent)] hover:text-[color:var(--c-accent)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-25 disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:border-[color:var(--color-divider)] disabled:hover:text-[color:var(--color-text)]"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

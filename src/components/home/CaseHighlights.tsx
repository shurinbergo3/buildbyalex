"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { CaseArt, hasCaseArt } from "@/components/CaseArt";

/* ────────────────────────────────────────────────────────────────────────
   Cinematic case carousel. A peeking, scroll-snap track of full-photo cards —
   you always see slivers of the neighbouring cases. Swipe on touch, arrows /
   dots on desktop. The whole card is a link to the case study; the active
   card sits full-strength while neighbours dim back for depth.
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

export function CaseHighlights({ items, ctaLabel }: { items: HighlightItem[]; ctaLabel: string }) {
  const n = items.length;
  const trackRef = useRef<HTMLUListElement>(null);
  const rafRef = useRef(0);
  const [active, setActive] = useState(0);

  // rAF-throttled so the scroll listener never does layout-reading work more
  // than once per frame — kills the jitter when swiping the rail sideways.
  const sync = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const track = trackRef.current;
      if (!track) return;
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      Array.from(track.children).forEach((ch, i) => {
        const el = ch as HTMLElement;
        const c = el.offsetLeft + el.clientWidth / 2;
        const d = Math.abs(c - center);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setActive(best);
    });
  }, []);

  const stepTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(track.children.length - 1, i));
    const el = track.children[clamped] as HTMLElement | undefined;
    if (!el) return;
    track.scrollTo({
      left: el.offsetLeft - (track.clientWidth - el.clientWidth) / 2,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    sync();
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);

    // Horizontal wheel / trackpad swipe drives the rail directly. We own the
    // scroll (preventDefault + stopPropagation) so Lenis never sees it — its
    // own preventDefault would otherwise kill the native horizontal scroll,
    // which is what made "scroll back" flaky. Vertical-dominant gestures are
    // left completely untouched, so Lenis still smooth-scrolls the page even
    // while the cursor sits over the rail (data-lenis-prevent broke that).
    //
    // Snap is switched off for the duration of the gesture so mandatory snap
    // can't fight the manual scroll, then we ease onto the nearest card once
    // the wheel goes quiet.
    let snapTimer = 0;
    const settle = () => {
      track.style.scrollSnapType = "";
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      Array.from(track.children).forEach((ch, i) => {
        const el = ch as HTMLElement;
        const c = el.offsetLeft + el.clientWidth / 2;
        const d = Math.abs(c - center);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      stepTo(best);
    };
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // vertical → let the page scroll
      e.preventDefault();
      e.stopPropagation();
      track.style.scrollSnapType = "none";
      track.scrollLeft += e.deltaX;
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = window.setTimeout(settle, 140);
    };
    track.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      track.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      track.removeEventListener("wheel", onWheel);
      if (snapTimer) clearTimeout(snapTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [sync, stepTo]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      stepTo(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      stepTo(active - 1);
    }
  };

  return (
    <div className="relative mt-10 md:mt-14">
      <ul
        ref={trackRef}
        role="group"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-1 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5"
        style={{
          scrollPaddingInline: "0px",
          // Full-bleed: escape the container so neighbouring cards have room to
          // breathe instead of being chopped at the content edge.
          marginInline: "calc(50% - 50vw)",
          paddingInline: "max(1.5rem, calc(50vw - 50%))",
          // Soft edge-fade so the peeking neighbours dissolve into the page
          // rather than ending on a hard vertical cut.
          ["--fade" as string]: "clamp(28px, 7vw, 120px)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, #000 var(--fade), #000 calc(100% - var(--fade)), transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0, #000 var(--fade), #000 calc(100% - var(--fade)), transparent 100%)",
        }}
      >
        {items.map((it, i) => {
          const isActive = i === active;
          return (
            <li
              key={it.key}
              className="shrink-0 basis-[86%] snap-center sm:basis-[72%] lg:basis-[64%]"
            >
              <Link
                href={{ pathname: "/work/[slug]", params: { slug: it.slug } }}
                aria-label={it.title}
                data-active={isActive}
                className="group relative block h-[clamp(440px,62vh,660px)] overflow-hidden rounded-[26px] bg-black opacity-100 transition-[transform,opacity] duration-500 data-[active=false]:scale-[0.965] data-[active=false]:opacity-[0.72] sm:rounded-[30px]"
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
                      : "linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.86) 26%, rgba(0,0,0,0.6) 48%, rgba(0,0,0,0.28) 70%, rgba(0,0,0,0.14) 100%)",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background: hasCaseArt(it.key)
                      ? "linear-gradient(to right, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.08) 42%, transparent 62%)"
                      : "linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.12) 45%, transparent 68%)",
                  }}
                />

                {/* Copy */}
                <div className="absolute inset-0 flex items-end">
                  <div className="w-full max-w-[620px] p-6 sm:p-9 lg:p-12">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] sm:text-[12px]" style={{ color: "var(--c-accent)" }}>
                      {it.industry}
                    </p>
                    <h3
                      className="mt-3 font-semibold leading-[0.96] tracking-[-0.035em] text-white"
                      style={{ fontSize: "clamp(32px, 4.6vw, 72px)" }}
                    >
                      {it.title}
                    </h3>
                    <p className="mt-3 max-w-[440px] text-[14.5px] leading-[1.5] text-white/75 sm:text-[16px]">
                      {it.tagline}
                    </p>

                    <div className="mt-5 flex items-end gap-7">
                      <div>
                        <div className="text-[clamp(26px,3vw,40px)] font-semibold leading-none tracking-[-0.02em] text-white">
                          {it.metricValue}
                        </div>
                        <div className="mt-1.5 text-[11.5px] uppercase tracking-wider text-white/55">{it.metricLabel}</div>
                      </div>
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
      </ul>

      {/* Controls — below the track, never over the cards */}
      <div className="mt-7 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() => stepTo(active - 1)}
          disabled={active === 0}
          aria-label="Previous case"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] text-[color:var(--color-text)] shadow-[var(--shadow-card)] transition-all duration-200 ease-[cubic-bezier(0.28,0.11,0.32,1)] hover:-translate-y-0.5 hover:border-[color:var(--c-accent)] hover:text-[color:var(--c-accent)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-25 disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:border-[color:var(--color-divider)] disabled:hover:text-[color:var(--color-text)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          {items.map((it, i) => (
            <button
              key={it.key}
              type="button"
              onClick={() => stepTo(i)}
              aria-label={it.title}
              aria-current={i === active}
              className="h-2.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                width: i === active ? 30 : 9,
                background:
                  i === active ? "var(--c-accent)" : "color-mix(in srgb, var(--color-text-3) 45%, transparent)",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => stepTo(active + 1)}
          disabled={active === n - 1}
          aria-label="Next case"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] text-[color:var(--color-text)] shadow-[var(--shadow-card)] transition-all duration-200 ease-[cubic-bezier(0.28,0.11,0.32,1)] hover:-translate-y-0.5 hover:border-[color:var(--c-accent)] hover:text-[color:var(--c-accent)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-25 disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:border-[color:var(--color-divider)] disabled:hover:text-[color:var(--color-text)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

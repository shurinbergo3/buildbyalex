"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link } from "@/i18n/navigation";

/* ────────────────────────────────────────────────────────────────────────
   Cinematic case gallery — Apple "Get the highlights" style. A single
   contained, rounded media panel cross-fades between cases; each slide is the
   case photo + scrim + overlay copy (title, metric, results, CTA). A floating
   glass control (progress dots + play/pause) drives autoplay. Not full-bleed.
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

const EASE = [0.16, 1, 0.3, 1] as const;
const GLASS = {
  background: "rgba(0,0,0,0.34)",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "0 8px 30px -8px rgba(0,0,0,0.5)",
} as const;

export function CaseHighlights({ items, ctaLabel }: { items: HighlightItem[]; ctaLabel: string }) {
  const reduce = useReducedMotion();
  const n = items.length;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  const go = (i: number) => setActive(((i % n) + n) % n);
  // Manual paging pauses autoplay so browsing isn't interrupted.
  const nav = (i: number) => {
    setPlaying(false);
    go(i);
  };
  const item = items[active];
  const autoplay = playing && !reduce;

  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 44) nav(active + (dx < 0 ? 1 : -1));
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nav(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nav(active - 1);
    }
  };

  return (
    <div className="relative mt-10 md:mt-14">
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label={`${active + 1} / ${n}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative h-[clamp(440px,70vh,760px)] overflow-hidden rounded-[26px] bg-black shadow-[0_50px_140px_-50px_rgba(0,0,0,0.55)] outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--c-accent)] sm:rounded-[30px]"
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={item.key}
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
          >
            {/* Photo with slow ken-burns */}
            <div
              role="img"
              aria-label={item.image.alt}
              className={`absolute inset-0 bg-cover bg-center ${reduce ? "" : "ch-ken"}`}
              style={{ backgroundImage: `url(${item.image.src})` }}
            />
            {/* Cinematic scrims */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 38%, rgba(0,0,0,0.12) 68%, rgba(0,0,0,0.34) 100%)",
              }}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 58%)" }}
            />

            {/* Copy */}
            <div className="absolute inset-0 flex items-end">
              <motion.div
                className="w-full max-w-[680px] p-7 sm:p-10 lg:p-14"
                initial={reduce ? false : { opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] sm:text-[12px]" style={{ color: "var(--c-accent)" }}>
                  {item.industry}
                </p>
                <h3
                  className="mt-3 font-semibold leading-[0.95] tracking-[-0.035em] text-white"
                  style={{ fontSize: "clamp(38px, 5.6vw, 84px)" }}
                >
                  {item.title}
                </h3>
                <p className="mt-3.5 max-w-[480px] text-[15px] leading-[1.5] text-white/75 sm:text-[17px]">
                  {item.tagline}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <div>
                    <div className="text-[clamp(28px,3.2vw,42px)] font-semibold leading-none tracking-[-0.02em] text-white">
                      {item.metricValue}
                    </div>
                    <div className="mt-1.5 text-[12px] uppercase tracking-wider text-white/55">{item.metricLabel}</div>
                  </div>
                  <ul className="hidden flex-col gap-2 sm:flex">
                    {item.results.slice(0, 2).map((r) => (
                      <li key={r} className="flex items-center gap-2.5 text-[13.5px] text-white/75">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
                          <path d="M5 13l4 4L19 7" stroke="var(--c-accent)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={{ pathname: "/work/[slug]", params: { slug: item.slug } }}
                  className="group mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-black transition-transform duration-200 hover:scale-[1.03]"
                  style={{ background: "var(--c-accent)" }}
                >
                  {ctaLabel}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform duration-200 group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Floating control — prev · dots · next · play, flip through every case */}
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
          <button
            type="button"
            onClick={() => nav(active - 1)}
            aria-label="Previous case"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white backdrop-blur-md transition-transform duration-200 hover:scale-105"
            style={GLASS}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center gap-2 rounded-full px-3.5 py-2.5 backdrop-blur-md" style={GLASS}>
            {items.map((it, i) => {
              const isActive = i === active;
              return (
                <button
                  key={it.key}
                  type="button"
                  onClick={() => nav(i)}
                  aria-label={it.title}
                  aria-current={isActive}
                  className="relative h-1.5 overflow-hidden rounded-full transition-[width] duration-300"
                  style={{
                    width: isActive ? 30 : 6,
                    background: isActive ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.45)",
                  }}
                >
                  {isActive && (
                    <span
                      key={active}
                      className="ch-adv absolute inset-0 origin-left rounded-full bg-white"
                      style={{ animationPlayState: autoplay ? "running" : "paused" }}
                      onAnimationEnd={() => go(active + 1)}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => nav(active + 1)}
            aria-label="Next case"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white backdrop-blur-md transition-transform duration-200 hover:scale-105"
            style={GLASS}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white backdrop-blur-md transition-transform duration-200 hover:scale-105"
            style={GLASS}
          >
            {playing ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1.2" />
                <rect x="14" y="5" width="4" height="14" rx="1.2" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 5l12 7-12 7V5z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <style>{`
        .ch-ken { animation: chKen 7.5s ease-out forwards; will-change: transform; }
        @keyframes chKen { from { transform: scale(1.05); } to { transform: scale(1.13); } }
        .ch-adv { transform: scaleX(0); animation: chAdv 6s linear forwards; }
        @keyframes chAdv { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @media (prefers-reduced-motion: reduce) {
          .ch-ken { animation: none; }
        }
      `}</style>
    </div>
  );
}

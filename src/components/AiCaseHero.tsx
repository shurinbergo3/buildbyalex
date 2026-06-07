"use client";

import { Reveal } from "@/components/Reveal";

/* ────────────────────────────────────────────────────────────────────────
   AiCaseHero — a cinematic dark hero stage shared by the two AI cases
   (ИИ-менеджер для продаж / CRM Bot). Replaces the flat metric-slab cover:
   left = case copy on a near-black stage, right = a bespoke live product mock.

   The stage layers — warm-orange aurora, masked dot-grid floor, film grain,
   top edge-light — are the "expensive" cues: localized light over espresso
   black, never a flat gradient. One accent (the brand amber), used sparingly.
   ──────────────────────────────────────────────────────────────────────── */

export const HERO_ACCENT = "#FF7A2D";
export const HERO_ACCENT_HI = "#FFB386";
export const HERO_TEAL = "#36D8C4"; // cool counter-light, used sparingly

// Self-contained film grain — kills the plasticky default-gradient smoothness.
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

type Metric = { value: string; label: string };

export function AiCaseHero({
  industry,
  title,
  tagline,
  metrics,
  stack,
  ndaLabel,
  liveLabel,
  children,
}: {
  industry: string;
  title: string;
  tagline: string;
  metrics: Metric[];
  stack: string[];
  ndaLabel: string;
  liveLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[26px] bg-[#0A0A0C] px-6 py-12 shadow-[0_50px_140px_-50px_rgba(0,0,0,0.85),inset_0_0_0_1px_rgba(255,255,255,0.055)] sm:rounded-[36px] sm:px-10 sm:py-14 md:px-14 md:py-16">
      {/* Aurora — warm light blooming from the upper-centre, a faint teal
          counter-light from the far corner. Localized lamps, not a wash. */}
      <div
        aria-hidden="true"
        className="ai-hero-aurora pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(46% 42% at 30% -4%, rgba(255,122,45,0.30), transparent 66%), radial-gradient(40% 38% at 86% 6%, rgba(255,150,80,0.16), transparent 70%), radial-gradient(50% 60% at 100% 100%, rgba(54,216,196,0.10), transparent 68%)",
        }}
      />
      {/* Masked dot-grid floor — depth + engineered-system cue. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          WebkitMaskImage:
            "radial-gradient(120% 92% at 50% 0%, #000 24%, transparent 80%)",
          maskImage:
            "radial-gradient(120% 92% at 50% 0%, #000 24%, transparent 80%)",
          opacity: 0.55,
        }}
      />
      {/* Top edge-light hairline. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[8%] top-0 -z-10 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,170,110,0.7), transparent)",
        }}
      />
      {/* Film grain. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: GRAIN, backgroundSize: "160px 160px" }}
      />

      <div className="relative grid items-center gap-12 md:grid-cols-[0.96fr_1.04fr] md:gap-12 lg:gap-16">
        {/* ── Copy ── */}
        <Reveal>
          <div>
            <p
              className="t-eyebrow"
              style={{ color: HERO_ACCENT }}
            >
              {industry}
            </p>
            <h1 className="mt-4 text-[clamp(40px,5vw+8px,68px)] font-semibold leading-[1.05] tracking-[-0.032em] text-white">
              {title}
            </h1>
            <p className="mt-5 max-w-[540px] text-[clamp(16px,1.1vw+12px,20px)] leading-[1.5] tracking-[-0.012em] text-white/65">
              {tagline}
            </p>

            <dl className="mt-8 flex flex-wrap gap-x-9 gap-y-5">
              {metrics.map((m) => (
                <div key={m.label}>
                  <dt
                    className="text-[clamp(26px,2vw+18px,38px)] font-semibold leading-none tracking-[-0.02em]"
                    style={{ color: HERO_ACCENT_HI }}
                  >
                    {m.value}
                  </dt>
                  <dd className="mt-2 max-w-[160px] text-[12.5px] leading-snug text-white/45">
                    {m.label}
                  </dd>
                </div>
              ))}
            </dl>

            {stack.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2">
                {stack.slice(0, 5).map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1 text-[12.5px] font-medium text-white/65 backdrop-blur-sm"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.04] py-2 pl-3 pr-4 text-[13px] font-medium text-white/70 backdrop-blur-sm">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="text-white/45"
              >
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              {ndaLabel}
              <span className="h-3 w-px bg-white/15" />
              <span className="inline-flex items-center gap-1.5">
                <span className="relative grid h-1.5 w-1.5 place-items-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2ECC71] opacity-70" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-[#2ECC71]" />
                </span>
                {liveLabel}
              </span>
            </div>
          </div>
        </Reveal>

        {/* ── Bespoke mock ── */}
        <Reveal delay={150}>
          <div className="relative">{children}</div>
        </Reveal>
      </div>
    </div>
  );
}

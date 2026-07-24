"use client";

import { Reveal } from "@/components/Reveal";
import { HeroWindow } from "@/components/HeroWindow";
import { Link } from "@/i18n/navigation";

/* ────────────────────────────────────────────────────────────────────────
   AiCaseHero — the AI cases (ИИ-менеджер для продаж / CRM Bot) on the shared
   glass HeroWindow: left = case copy, right = a bespoke live product mock.
   The window chrome carries the NDA label + "all in production" live state;
   the "ai" contour field (neural net, robot, Telegram, CRM glyphs) drifts
   behind. One accent — the brand amber — used sparingly.
   ──────────────────────────────────────────────────────────────────────── */

export const HERO_ACCENT = "#FF7A2D";
export const HERO_ACCENT_HI = "#FFB386";
export const HERO_TEAL = "#36D8C4"; // cool counter-light, used sparingly

type Metric = { value: string; label: string };

export function AiCaseHero({
  industry,
  titleTop,
  titleAccent,
  tagline,
  metrics,
  stack,
  ndaLabel,
  liveLabel,
  wantLabel,
  children,
}: {
  industry: string;
  /** Kept for the props spread from the case components; not rendered. */
  title?: string;
  titleTop: string;
  titleAccent: string;
  tagline: string;
  metrics: Metric[];
  stack: string[];
  ndaLabel: string;
  liveLabel: string;
  wantLabel: string;
  contours?: "leadbot" | "crmbot";
  children: React.ReactNode;
}) {
  return (
    <HeroWindow theme="ai" accent={HERO_ACCENT} label={ndaLabel} live={liveLabel} icon="lock">
      <div className="grid items-center gap-12 md:grid-cols-[0.96fr_1.04fr] md:gap-12 lg:gap-16">
        {/* ── Copy ── */}
        <Reveal>
          <div>
            <p className="t-eyebrow" style={{ color: HERO_ACCENT }}>
              {industry}
            </p>
            <h1 className="mt-4 text-[clamp(38px,5vw+8px,64px)] font-semibold leading-[1.04] tracking-[-0.032em] text-white">
              {titleTop}
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(96deg, ${HERO_ACCENT_HI}, ${HERO_ACCENT})` }}
              >
                {titleAccent}
              </span>
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

            <div className="mt-8">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold text-[#1a1206] shadow-[0_16px_40px_-14px_rgba(255,122,45,0.5)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${HERO_ACCENT_HI}, ${HERO_ACCENT})` }}
              >
                {wantLabel}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </Reveal>

        {/* ── Bespoke mock ── */}
        <Reveal delay={150}>
          <div className="relative">{children}</div>
        </Reveal>
      </div>
    </HeroWindow>
  );
}

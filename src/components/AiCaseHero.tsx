"use client";

import { Reveal } from "@/components/Reveal";
import { HeroWindow } from "@/components/HeroWindow";

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

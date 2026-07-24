"use client";

import { motion, useReducedMotion } from "motion/react";
import { HeroWindow } from "@/components/HeroWindow";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import type { ContourTheme } from "@/components/heroGlyphs";

/* ────────────────────────────────────────────────────────────────────────
   CaseHeroKit — the shared marketing-hero shell every case now builds on, so
   the quality never drifts between cases. Left column sells the outcome
   (keyword eyebrow → punchy headline → subhead → metrics → optional channel
   pills → "want this" CTA + live link). Right column is the case's device mock
   wrapped in up-to-three floating liquid-glass proof cards that dramatise the
   funnel; on mobile the cards collapse into a clean inline stack so the story
   survives the small screen. Colours/copy/cards are per-case; layout is shared.
   ──────────────────────────────────────────────────────────────────────── */

type Metric = { value: string; label: string };
type Channel = { icon?: React.ReactNode; label: string };

// Default corner slots for up to three proof cards around the device duo.
// Pinned to the outer corners and kept compact so the device stays readable
// and the cards read as three distinct floats rather than one jumble.
const CARD_SLOTS = [
  "absolute left-[-6%] top-[-3%] w-[40%] max-w-[196px]",
  "absolute right-[-6%] top-[3%] w-[44%] max-w-[214px]",
  "absolute bottom-[6%] left-[-5%] w-[41%] max-w-[202px]",
];

export function MarketingCaseHero({
  accent,
  accentHi,
  ink = "#1a1206",
  theme,
  icon = "globe",
  url,
  liveLabel,
  eyebrow,
  titleTop,
  titleAccent,
  subhead,
  metrics,
  channels,
  wantLabel,
  deviceMock,
  proofCards,
}: {
  accent: string;
  accentHi: string;
  ink?: string;
  theme: ContourTheme;
  icon?: "globe" | "lock";
  url: string;
  liveLabel: string;
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  subhead: string;
  metrics: Metric[];
  channels?: Channel[];
  wantLabel: string;
  deviceMock: React.ReactNode;
  proofCards: React.ReactNode[];
}) {
  const reduce = useReducedMotion();
  const domain = url.replace(/^https?:\/\//, "");

  return (
    <HeroWindow theme={theme} accent={accent} label={domain} live={liveLabel} icon={icon}>
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-10 lg:gap-14">
        {/* ── Pitch ── */}
        <Reveal className="min-w-0">
          <div>
            <p className="t-eyebrow" style={{ color: accent }}>
              {eyebrow}
            </p>

            <h1 className="mt-4 text-[clamp(38px,5vw+8px,66px)] font-semibold leading-[1.04] tracking-[-0.032em] text-white">
              {titleTop}
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(96deg, ${accentHi}, ${accent})` }}
              >
                {titleAccent}
              </span>
            </h1>

            <p className="mt-5 max-w-[540px] text-[clamp(16px,1.1vw+12px,20px)] leading-[1.5] tracking-[-0.012em] text-white/68">
              {subhead}
            </p>

            {channels && channels.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {channels.map((c) => (
                  <span
                    key={c.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] py-1.5 pl-2 pr-3.5 text-[13px] font-medium text-white/78 backdrop-blur-sm"
                  >
                    {c.icon && <span className="grid h-5 w-5 shrink-0 place-items-center">{c.icon}</span>}
                    {c.label}
                  </span>
                ))}
              </div>
            )}

            <dl className="mt-8 flex flex-wrap gap-x-9 gap-y-5">
              {metrics.map((m) => (
                <div key={m.label}>
                  <dt
                    className="text-[clamp(26px,2vw+18px,38px)] font-semibold leading-none tracking-[-0.02em]"
                    style={{ color: accentHi }}
                  >
                    {m.value}
                  </dt>
                  <dd className="mt-2 max-w-[150px] text-[12.5px] leading-snug text-white/45">
                    {m.label}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold shadow-[0_16px_40px_-14px_rgba(0,0,0,0.5)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${accentHi}, ${accent})`, color: ink }}
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

              <a
                href={`https://${domain}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] py-2.5 pl-3.5 pr-4 text-[14px] font-medium text-white/85 backdrop-blur-sm transition-colors hover:border-white/40 hover:text-white"
              >
                <span className="relative grid h-2 w-2 place-items-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: accent }} />
                  <span className="relative h-1.5 w-1.5 rounded-full" style={{ background: accent }} />
                </span>
                {liveLabel} · {domain}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            </div>
          </div>
        </Reveal>

        {/* ── Proof stage ── */}
        <Reveal delay={150} className="min-w-0">
          <div className="relative">
            {deviceMock}

            {/* desktop: floating proof cards pinned to the corners */}
            <div className="pointer-events-none absolute inset-0 z-30 hidden md:block">
              {proofCards.slice(0, 3).map((card, i) => (
                <FloatCard key={i} reduce={!!reduce} delay={i * 1.1} className={CARD_SLOTS[i]}>
                  {card}
                </FloatCard>
              ))}
            </div>

            {/* mobile: same proof, clean inline stack */}
            <div className="mt-6 grid gap-2.5 md:hidden">
              {proofCards.slice(0, 3).map((card, i) => (
                <div key={i}>{card}</div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </HeroWindow>
  );
}

/* ─────────────────────────── building blocks ─────────────────────────── */

export function FloatCard({
  className,
  delay,
  reduce,
  children,
}: {
  className?: string;
  delay: number;
  reduce: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={reduce ? undefined : { y: [0, -9, 0] }}
      transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

export function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[15px] border border-white/[0.12] bg-[rgba(17,19,26,0.72)] shadow-[0_26px_60px_-24px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
      {children}
    </div>
  );
}

export function CardHeader({
  glyph,
  label,
  right,
}: {
  glyph: React.ReactNode;
  label: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
      <span className="shrink-0">{glyph}</span>
      <span className="min-w-0 truncate text-[10.5px] font-medium uppercase tracking-[0.08em] text-white/45">{label}</span>
      {right && <span className="ml-auto shrink-0">{right}</span>}
    </div>
  );
}

export function RankBadge({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span className="whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: bg, color }}>
      {children}
    </span>
  );
}

/* ─────────────────────────── brand marks ─────────────────────────── */

/** Google "G" on a white plate — the plate gives the multicolour mark its
    counters back on a dark surface. */
export function GoogleGChip({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-white ${className}`}>
      <GoogleG className="h-3 w-3" />
    </span>
  );
}

export function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

/** Official ChatGPT / OpenAI mark (six-fold blossom). Default renders the green
    app-icon tile; `plain` renders the monochrome blossom in currentColor. */
export function ChatGptLogo({ className, plain }: { className?: string; plain?: boolean }) {
  const petal =
    "M1107.3 299.1c-197.999 0-373.9 127.3-435.2 315.3L650 743.5v427.9c0 21.4 11 40.4 29.4 51.4l344.5 198.515V833.3h.1v-27.9L1372.7 604c33.715-19.52 70.44-32.857 108.47-39.828L1447.6 450.3C1361 353.5 1237.1 298.5 1107.3 299.1zm0 117.5-.6.6c79.699 0 156.3 27.5 217.6 78.4-2.5 1.2-7.4 4.3-11 6.1L952.8 709.3c-18.4 10.4-29.4 30-29.4 51.4V1248l-155.1-89.4V755.8c-.1-187.099 151.601-338.9 339-339.2z";
  return (
    <svg viewBox="0 0 2406 2406" className={className} aria-hidden="true">
      {!plain && (
        <path
          d="M1 578.4C1 259.5 259.5 1 578.4 1h1249.1c319 0 577.5 258.5 577.5 577.4V2406H578.4C259.5 2406 1 2147.5 1 1828.6V578.4z"
          fill="#10a37f"
        />
      )}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <path key={a} d={petal} fill={plain ? "currentColor" : "#fff"} transform={a ? `rotate(${a} 1203 1203)` : undefined} />
      ))}
    </svg>
  );
}

export function TelegramMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#2AABEE" />
      <path fill="#fff" d="M5.6 11.8 16.5 7.6c.5-.18.95.12.79.88l-1.86 8.76c-.13.6-.5.75-1 .47l-2.76-2.04-1.33 1.28c-.15.15-.27.27-.55.27l.2-2.8 5.1-4.6c.22-.2-.05-.31-.34-.12l-6.3 3.97-2.72-.85c-.6-.19-.6-.6.13-.88z" />
    </svg>
  );
}

export function Stars({ className, color = "#E8C879" }: { className?: string; color?: string }) {
  return (
    <span className={`inline-flex items-center gap-[1px] ${className ?? ""}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 16 16" className="h-full w-auto" fill={color}>
          <path d="M8 1.3l1.9 4.1 4.5.5-3.4 3.1.9 4.4L8 11.4 4.1 13.4l.9-4.4L1.6 5.9l4.5-.5L8 1.3z" />
        </svg>
      ))}
    </span>
  );
}

export function CheckDot({ color = "#34d17f" }: { color?: string }) {
  return (
    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full" style={{ background: `${color}29` }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

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
  contours,
  children,
}: {
  industry: string;
  title: string;
  tagline: string;
  metrics: Metric[];
  stack: string[];
  ndaLabel: string;
  liveLabel: string;
  contours?: "donbrava" | "crmbot";
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate overflow-hidden rounded-[26px] bg-[#0A0A0C] px-6 py-12 shadow-[0_50px_140px_-50px_rgba(0,0,0,0.85),inset_0_0_0_1px_rgba(255,255,255,0.055)] sm:rounded-[36px] sm:px-10 sm:py-14 md:px-14 md:py-16">
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
      {/* Thematic line-art contours — neural net + Telegram/robot (donbrava)
          or popular-CRM glyphs (crmbot) — scattered like a faint engineered
          watermark, masked away from the text so contrast stays clean. */}
      {contours && <HeroContours variant={contours} />}

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

/* ─────────────────── Background line-art contours ───────────────────
   Faint outlined glyphs scattered behind the stage. Masked toward the mock
   side so they barely touch the headline. Two themed sets per case. */

function HeroContours({ variant }: { variant: "donbrava" | "crmbot" }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{
        // Soft transparent hole over the left copy column so the line-art
        // never competes with the headline; shows everywhere else.
        WebkitMaskImage:
          "radial-gradient(58% 70% at 22% 46%, transparent 16%, rgba(0,0,0,0.5) 46%, #000 74%)",
        maskImage:
          "radial-gradient(58% 70% at 22% 46%, transparent 16%, rgba(0,0,0,0.5) 46%, #000 74%)",
      }}
    >
      {variant === "donbrava" ? (
        <>
          <NeuralNet className="absolute right-[13%] top-[5%] h-[clamp(210px,31vw,360px)] w-[clamp(210px,31vw,360px)]" style={{ color: HERO_ACCENT, opacity: 0.16 }} />
          <TelegramMark className="absolute left-[44%] top-[9%] h-[clamp(64px,7vw,104px)] w-[clamp(64px,7vw,104px)]" style={{ color: HERO_ACCENT, opacity: 0.18 }} />
          <RobotHead className="absolute right-[6%] bottom-[6%] h-[clamp(118px,15vw,184px)] w-[clamp(118px,15vw,184px)]" style={{ color: "#ffffff", opacity: 0.12 }} />
          <NeuralNet className="absolute left-[3%] bottom-[13%] h-[clamp(104px,12vw,150px)] w-[clamp(104px,12vw,150px)]" style={{ color: HERO_ACCENT, opacity: 0.12 }} />
        </>
      ) : (
        <>
          <NeuralNet className="absolute right-[13%] top-[5%] h-[clamp(210px,31vw,360px)] w-[clamp(210px,31vw,360px)]" style={{ color: HERO_ACCENT, opacity: 0.16 }} />
          <CrmCloud className="absolute left-[45%] top-[8%] h-[clamp(64px,7vw,108px)] w-[clamp(64px,7vw,108px)]" style={{ color: HERO_ACCENT, opacity: 0.18 }} />
          <CrmSprocket className="absolute right-[7%] bottom-[7%] h-[clamp(108px,14vw,172px)] w-[clamp(108px,14vw,172px)]" style={{ color: "#ffffff", opacity: 0.12 }} />
          <CrmKanban className="absolute left-[3%] bottom-[13%] h-[clamp(100px,12vw,150px)] w-[clamp(100px,12vw,150px)]" style={{ color: HERO_ACCENT, opacity: 0.12 }} />
        </>
      )}
    </div>
  );
}

type GlyphProps = { className?: string; style?: React.CSSProperties };

function NeuralNet({ className, style }: GlyphProps) {
  // Three layers of nodes, fully connected — a clean "neural network" contour.
  const L1 = [40, 100, 160];
  const L2 = [30, 90, 150, 188];
  const L3 = [70, 130];
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} style={style}>
      <g stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.85">
        {L1.map((y1, i) =>
          L2.map((y2, j) => <line key={`a${i}-${j}`} x1={26} y1={y1} x2={100} y2={y2} />),
        )}
        {L2.map((y2, i) =>
          L3.map((y3, j) => <line key={`b${i}-${j}`} x1={100} y1={y2} x2={174} y2={y3} />),
        )}
      </g>
      <g stroke="currentColor" strokeWidth="2.2" fill="none">
        {L1.map((y) => <circle key={`n1${y}`} cx={26} cy={y} r={7} />)}
        {L2.map((y) => <circle key={`n2${y}`} cx={100} cy={y} r={7} />)}
        {L3.map((y) => <circle key={`n3${y}`} cx={174} cy={y} r={7} />)}
      </g>
    </svg>
  );
}

function TelegramMark({ className, style }: GlyphProps) {
  // Paper-plane inside a ring — reads as Telegram.
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.5" />
      <path
        d="M17.6 7.3 6.2 11.8c-.7.27-.69 1.27.02 1.49l2.86.85.9 3.4c.13.5.78.62 1.1.21l1.46-1.84 2.86 2.1c.4.3.98.08 1.08-.41l1.9-9.2c.12-.56-.43-1.03-.98-.8z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="m9.1 14.1 6.3-4.3-4.9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RobotHead({ className, style }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v2.4" />
      <circle cx="12" cy="2.2" r="1" />
      <rect x="4.5" y="7" width="15" height="11" rx="3.4" />
      <path d="M2.6 11.5v3M21.4 11.5v3" />
      <circle cx="9" cy="12.4" r="1.5" />
      <circle cx="15" cy="12.4" r="1.5" />
      <path d="M9.5 15.6h5" />
    </svg>
  );
}

function CrmCloud({ className, style }: GlyphProps) {
  // Salesforce-style cloud outline.
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 18.5a4 4 0 0 0 .3-8 5.5 5.5 0 0 0-10.5-1.2A3.8 3.8 0 0 0 6.5 18.5z" />
    </svg>
  );
}

function CrmSprocket({ className, style }: GlyphProps) {
  // HubSpot-style sprocket: a hub linked to three orbiting nodes.
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} stroke="currentColor" strokeWidth="1.9">
      <line x1="12" y1="6" x2="12" y2="10.2" />
      <line x1="7.6" y1="16.4" x2="10.4" y2="13.4" />
      <line x1="16.4" y1="16.4" x2="13.6" y2="13.4" />
      <circle cx="12" cy="12.4" r="2.4" />
      <circle cx="12" cy="4.2" r="2.1" />
      <circle cx="5.6" cy="18" r="2.1" />
      <circle cx="18.4" cy="18" r="2.1" />
    </svg>
  );
}

function CrmKanban({ className, style }: GlyphProps) {
  // Pipeline / kanban columns — the CRM board.
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="4.6" height="14" rx="1.4" />
      <rect x="9.7" y="5" width="4.6" height="9.5" rx="1.4" />
      <rect x="16.4" y="5" width="4.6" height="11.5" rx="1.4" />
    </svg>
  );
}

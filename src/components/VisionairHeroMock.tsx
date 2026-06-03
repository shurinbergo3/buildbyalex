"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

/* VisionAir case hero — a faithful recreation of the live site (visionair.biz.pl)
   shown as a MacBook + iPhone duo on a cinematic stage. The laptop renders the
   desktop hero; the phone renders the mobile layout and slowly auto-scrolls
   through it. Both faux UIs are sized in container-query units (cqw) so they
   scale exactly with their device at every breakpoint — no vw drift, no overlap.

   All copy is localized under work.caseShowcase.visionair.macbook. The cinematic
   backdrop is the same drone-over-forest shot the real site uses; a second aerial
   frame fills the mobile portfolio grid. */

const GOLD = "#CBA45C";
const GOLD_HI = "#E6CB87";
const INK = "#1a160c";

// The live site's own hero image (a DJI drone over forest) — kept distinct from
// the buildbyalex case-card cover so the laptop mirrors visionair.biz.pl exactly.
const SITE_IMG =
  "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1400&q=80";
// A cinematic top-down aerial — the kind of footage the service delivers — used
// as a portfolio tile inside the phone.
const AERIAL_IMG =
  "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=900&q=80";

type Stat = { k: string; v: string };

type Copy = {
  headline: string;
  accent: string;
  lead: string;
  ctaGhost: string;
  nav: string[];
  stats: Stat[];
  services: string[];
};

const CINEMA_GRADE =
  "linear-gradient(102deg, rgba(8,10,15,0.94) 0%, rgba(8,10,15,0.72) 40%, rgba(8,10,15,0.34) 72%, rgba(8,10,15,0.6) 100%)";
const GOLD_BLOOM =
  "radial-gradient(120% 80% at 80% 34%, rgba(203,164,92,0.22) 0%, transparent 56%)";

export function VisionairHeroMock({ url }: { url: string }) {
  const t = useTranslations("work.caseShowcase.visionair.macbook");
  const reduce = useReducedMotion();
  const copy: Copy = {
    headline: t("headline"),
    accent: t("accent"),
    lead: t("lead"),
    ctaGhost: t("ctaGhost"),
    nav: t.raw("nav") as string[],
    stats: t.raw("stats") as Stat[],
    services: t.raw("services") as string[],
  };
  const domain = url.replace(/^https?:\/\//, "");

  return (
    <div className="relative mx-auto w-full max-w-[600px] pb-[12%] pt-[3%] [perspective:2200px]">
      {/* cinematic glow tying the dark devices into the warm page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-14%] top-[2%] -z-10 h-[82%]"
        style={{ background: "radial-gradient(58% 54% at 60% 38%, rgba(203,164,92,0.26), transparent 72%)" }}
      />
      {/* soft floor shadow grounding the laptop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[5%] bottom-[6%] -z-10 h-[15%] rounded-[50%]"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(18,16,12,0.36), transparent 72%)", filter: "blur(10px)" }}
      />

      {/* MacBook — left-weighted so the phone has room to overlap */}
      <div className="w-[87%] [transform:rotateX(2.5deg)] [transform-style:preserve-3d]">
        <Laptop copy={copy} domain={domain} />
      </div>

      {/* iPhone — overlaps the laptop's lower-right, auto-scrolls the mobile site */}
      <Phone copy={copy} reduce={!!reduce} />
    </div>
  );
}

/* ─────────────────────────── MacBook ─────────────────────────── */

function Laptop({ copy, domain }: { copy: Copy; domain: string }) {
  return (
    <div>
      {/* lid */}
      <div className="relative rounded-[14px] border-[3px] border-[#2b2c2f] bg-[#0c0c0e] p-[8px] shadow-[0_44px_72px_-30px_rgba(14,18,28,0.6),0_0_0_1px_rgba(0,0,0,0.16)]">
        {/* camera */}
        <div className="absolute left-1/2 top-[3px] z-10 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#26272a] ring-1 ring-black/40" />
        {/* screen — container for cqw-based faux site */}
        <div
          className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-[#0a0c11]"
          style={{ containerType: "inline-size" }}
        >
          <DesktopSite copy={copy} />
          {/* glass glare */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(122deg, rgba(255,255,255,0.10) 0%, transparent 24%, transparent 100%)" }}
          />
        </div>
      </div>

      {/* base / hinge */}
      <div className="relative mx-auto -mt-px h-[clamp(8px,1.5cqw,13px)] w-[106%] -translate-x-[2.83%]">
        <div
          className="h-full w-full rounded-b-[11px] rounded-t-[2px]"
          style={{
            background: "linear-gradient(180deg, #d2d5d9 0%, #b8bbc0 42%, #999ca1 76%, #7d8085 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55), 0 16px 22px -16px rgba(14,18,28,0.5)",
          }}
        />
        <div
          className="absolute left-1/2 top-0 h-[34%] w-[14%] -translate-x-1/2 rounded-b-[5px]"
          style={{ background: "linear-gradient(180deg, #8a8d92, #b3b6bb)" }}
        />
      </div>

      <p className="mt-4 text-center font-mono text-[12px] tracking-[0.02em] text-[color:var(--color-text-3)]">
        {domain}
      </p>
    </div>
  );
}

function DesktopSite({ copy }: { copy: Copy }) {
  return (
    <div className="absolute inset-0 text-white">
      <Image src={SITE_IMG} alt="" aria-hidden="true" fill sizes="(max-width:768px) 90vw, 540px" className="scale-[1.06] object-cover" />
      <div className="absolute inset-0" style={{ background: CINEMA_GRADE }} />
      <div className="absolute inset-0" style={{ background: GOLD_BLOOM }} />

      <div className="relative flex h-full flex-col px-[5.6cqw] pb-[4.6cqw] pt-[4cqw]">
        {/* top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[1.8cqw]">
            <Aperture className="h-[4.2cqw] w-[4.2cqw]" />
            <div className="leading-none">
              <div className="text-[2.7cqw] font-semibold tracking-[0.16em]">VISIONAIR</div>
              <div className="mt-[0.7cqw] text-[1.35cqw] tracking-[0.3em]" style={{ color: `${GOLD}cc` }}>
                WARSAW · AERIAL CINEMA
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-[2.8cqw] text-[1.7cqw] tracking-[0.12em] text-white/70 @[420px]:flex">
            {copy.nav.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </nav>

          <div className="flex items-center gap-[1.8cqw]">
            <span className="hidden items-center gap-[0.8cqw] text-[1.5cqw] tracking-[0.1em] text-white/55 @[420px]:inline-flex">
              <Globe className="h-[2cqw] w-[2cqw]" /> RU
            </span>
            <span
              className="rounded-full px-[2.8cqw] py-[1.3cqw] text-[1.6cqw] font-semibold tracking-[0.1em]"
              style={{ background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})`, color: INK }}
            >
              НАЧАТЬ ПРОЕКТ
            </span>
          </div>
        </div>

        {/* hero copy */}
        <div className="mt-auto max-w-[80cqw]">
          <div className="flex items-center gap-[1.4cqw] text-[1.55cqw] font-medium tracking-[0.26em]" style={{ color: GOLD }}>
            <span className="inline-block h-[0.9cqw] w-[0.9cqw] rounded-full" style={{ background: GOLD }} />
            WARSAW · EUROPE · WORLDWIDE
          </div>

          <h3 className="mt-[2.4cqw] text-[6.7cqw] font-extrabold uppercase leading-[0.92] tracking-[-0.01em]">
            {copy.headline}
          </h3>
          <p className="mt-[1cqw] font-serif text-[4.4cqw] italic leading-none" style={{ color: GOLD_HI }}>
            {copy.accent}
          </p>

          <p className="mt-[2.4cqw] max-w-[60cqw] text-[1.9cqw] leading-[1.45] text-white/65">{copy.lead}</p>

          <div className="mt-[2.8cqw] flex items-center gap-[2.6cqw]">
            <span
              className="inline-flex items-center gap-[1cqw] rounded-full px-[3.2cqw] py-[1.7cqw] text-[1.85cqw] font-semibold tracking-[0.08em]"
              style={{ background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})`, color: INK }}
            >
              НАЧАТЬ ПРОЕКТ
              <Arrow className="h-[1.9cqw] w-[1.9cqw]" />
            </span>
            <span className="inline-flex items-center gap-[1cqw] text-[1.85cqw] font-medium tracking-[0.06em] text-white/85">
              <Play className="h-[2.1cqw] w-[2.1cqw]" />
              {copy.ctaGhost}
            </span>
          </div>

          <div className="mt-[3cqw] flex items-center gap-[5cqw] border-t border-white/12 pt-[2.4cqw]">
            {copy.stats.map((s) => (
              <div key={s.k} className="leading-tight">
                <div className="text-[1.35cqw] uppercase tracking-[0.18em] text-white/40">{s.k}</div>
                <div className="mt-[0.6cqw] text-[2.1cqw] font-semibold">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── iPhone ─────────────────────────── */

function Phone({ copy, reduce }: { copy: Copy; reduce: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute bottom-[3%] right-0 z-20 w-[30%] min-w-[140px] max-w-[178px]"
      initial={false}
      animate={reduce ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="relative rounded-[15%/7.4%] border-[5px] border-[#15161a] bg-[#15161a] shadow-[0_34px_54px_-20px_rgba(14,18,28,0.66),0_0_0_1px_rgba(0,0,0,0.28)]">
        {/* screen — own cqw container */}
        <div
          className="relative aspect-[9/19] overflow-hidden rounded-[13%/6.4%] bg-[#0a0c11]"
          style={{ containerType: "inline-size" }}
        >
          {/* notch */}
          <div className="absolute left-1/2 top-[3cqw] z-30 h-[5cqw] w-[30cqw] -translate-x-1/2 rounded-full bg-black" />

          <motion.div
            className="absolute inset-x-0 top-0"
            initial={false}
            animate={reduce ? undefined : { y: ["0%", "0%", "-57%", "-57%", "0%"] }}
            transition={{ duration: 19, times: [0, 0.08, 0.46, 0.56, 1], repeat: Infinity, ease: "easeInOut" }}
          >
            <MobileSite copy={copy} />
          </motion.div>

          {/* fixed status time + bottom home bar overlay (don't scroll) */}
          <span className="absolute left-[7cqw] top-[2.6cqw] z-30 text-[3.1cqw] font-semibold tabular-nums text-white">9:41</span>
          <span className="absolute right-[7cqw] top-[3cqw] z-30 h-[2.6cqw] w-[4.2cqw] rounded-[0.8cqw] border border-white/55" />
          <span className="absolute bottom-[1.6cqw] left-1/2 z-30 h-[1.1cqw] w-[32cqw] -translate-x-1/2 rounded-full bg-white/55" />
        </div>
      </div>
    </motion.div>
  );
}

function MobileSite({ copy }: { copy: Copy }) {
  return (
    <div className="flex flex-col text-white">
      {/* hero — one screenful */}
      <section className="relative aspect-[9/19] overflow-hidden">
        <Image src={SITE_IMG} alt="" aria-hidden="true" fill sizes="180px" className="scale-[1.08] object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,10,15,0.78) 0%, rgba(8,10,15,0.42) 40%, rgba(8,10,15,0.92) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(90% 50% at 70% 16%, rgba(203,164,92,0.24), transparent 60%)" }} />

        <div className="relative flex h-full flex-col px-[7cqw] pb-[8cqw] pt-[9.5cqw]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[2.4cqw]">
              <Aperture className="h-[6cqw] w-[6cqw]" />
              <span className="text-[3.7cqw] font-semibold tracking-[0.14em]">VISIONAIR</span>
            </div>
            <Burger className="h-[5cqw] w-[5cqw]" />
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-[2cqw] text-[2.8cqw] font-medium tracking-[0.22em]" style={{ color: GOLD }}>
              <span className="inline-block h-[1.4cqw] w-[1.4cqw] rounded-full" style={{ background: GOLD }} />
              WARSAW · EUROPE
            </div>
            <h4 className="mt-[3cqw] text-[10.5cqw] font-extrabold uppercase leading-[0.94]">{copy.headline}</h4>
            <p className="mt-[1.6cqw] font-serif text-[7cqw] italic leading-none" style={{ color: GOLD_HI }}>
              {copy.accent}
            </p>
            <div
              className="mt-[5cqw] inline-flex w-full items-center justify-center gap-[1.8cqw] rounded-full py-[3.4cqw] text-[3.3cqw] font-semibold tracking-[0.08em]"
              style={{ background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})`, color: INK }}
            >
              НАЧАТЬ ПРОЕКТ
              <Arrow className="h-[3.4cqw] w-[3.4cqw]" />
            </div>
            <div className="mt-[3cqw] flex items-center justify-center gap-[2cqw] text-[3.1cqw] font-medium text-white/80">
              <Play className="h-[3.4cqw] w-[3.4cqw]" />
              {copy.ctaGhost}
            </div>
          </div>
        </div>
      </section>

      {/* services */}
      <section className="bg-[#0b0d12] px-[7cqw] pb-[7cqw] pt-[8cqw]">
        <div className="text-[2.9cqw] font-semibold tracking-[0.22em]" style={{ color: GOLD }}>
          {copy.nav[0]}
        </div>
        <div className="mt-[4cqw] grid grid-cols-2 gap-[3cqw]">
          {copy.services.map((s, i) => (
            <div key={s} className="rounded-[3.4cqw] border border-white/10 bg-white/[0.04] p-[3.6cqw]">
              <span className="grid h-[8cqw] w-[8cqw] place-items-center rounded-[2.4cqw]" style={{ background: "rgba(203,164,92,0.16)" }}>
                <ServiceGlyph i={i} className="h-[4.4cqw] w-[4.4cqw]" />
              </span>
              <div className="mt-[2.8cqw] text-[3.2cqw] font-medium leading-tight">{s}</div>
              <div className="mt-[1.4cqw] h-[1cqw] w-[60%] rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </section>

      {/* portfolio */}
      <section className="bg-[#0b0d12] px-[7cqw] pb-[10cqw]">
        <div className="text-[2.9cqw] font-semibold tracking-[0.22em]" style={{ color: GOLD }}>
          {copy.nav[1]}
        </div>
        <div className="mt-[4cqw] grid grid-cols-2 gap-[3cqw]">
          {[SITE_IMG, AERIAL_IMG, AERIAL_IMG, SITE_IMG].map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-[3cqw]"
              style={{ aspectRatio: i % 3 === 0 ? "4 / 5" : "4 / 3" }}
            >
              <Image src={src} alt="" aria-hidden="true" fill sizes="90px" className="object-cover" style={{ objectPosition: i % 2 ? "70% 40%" : "30% 50%" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <span className="absolute bottom-[2cqw] left-[2.4cqw] text-[2.4cqw] font-semibold tracking-[0.12em] text-white/85">4K</span>
            </div>
          ))}
        </div>

        {/* footer band */}
        <div className="mt-[7cqw] flex items-center justify-between rounded-[4cqw] px-[5cqw] py-[5cqw]" style={{ background: `linear-gradient(120deg, ${GOLD}, ${GOLD_HI})` }}>
          <div className="leading-tight" style={{ color: INK }}>
            <div className="text-[3.6cqw] font-extrabold tracking-[0.12em]">VISIONAIR</div>
            <div className="mt-[1cqw] text-[2.5cqw] font-medium opacity-80">warsaw · aerial cinema</div>
          </div>
          <span className="grid h-[9cqw] w-[9cqw] place-items-center rounded-full bg-black/85">
            <Arrow className="h-[4cqw] w-[4cqw]" style={{ color: GOLD_HI }} />
          </span>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────────────── glyphs ─────────────────────────── */

function Aperture({ className }: { className?: string }) {
  return (
    <span className={`grid place-items-center rounded-[1.2cqw] border ${className ?? ""}`} style={{ borderColor: `${GOLD}88` }}>
      <svg viewBox="0 0 24 24" width="58%" height="58%" fill="none" stroke={GOLD} strokeWidth="1.8">
        <circle cx="12" cy="12" r="2.4" />
        <path d="M12 9.6V4M12 14.4V20M9.6 12H4M14.4 12H20" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Globe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.4 2.5 15.6 0 18M12 3c-2.5 2.4-2.5 15.6 0 18" strokeLinecap="round" />
    </svg>
  );
}

function Arrow({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function Play({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5-11-6.5z" />
    </svg>
  );
}

function Burger({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function ServiceGlyph({ i, className }: { i: number; className?: string }) {
  const paths = [
    // weddings — heart
    "M12 20s-7-4.6-7-9.4A3.6 3.6 0 0 1 12 8a3.6 3.6 0 0 1 7 2.6C19 15.4 12 20 12 20z",
    // real estate — building
    "M4 20V8l8-4 8 4v12M9 20v-5h6v5",
    // inspection — magnifier
    "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
    // advertising — megaphone
    "M4 10v4l9 4V6l-9 4zM13 7l5-2v14l-5-2",
  ];
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={GOLD_HI} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[i % paths.length]} />
    </svg>
  );
}

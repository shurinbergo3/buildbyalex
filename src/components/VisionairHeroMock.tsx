"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

/* VisionAir case hero — a faithful recreation of the live site (visionair.biz.pl)
   shown as a MacBook + iPhone duo on a cinematic stage. The laptop renders the
   real desktop hero (Warsaw skyline at night, a drone tracked by a gold radar
   reticle with HUD telemetry, a 4.9★ rating); the phone renders the mobile
   layout and slowly auto-scrolls through it.

   Faux UIs are sized in container-query units (cqw) so they scale exactly with
   their device at every breakpoint — no vw drift, no overlap. Copy is localized
   under work.caseShowcase.visionair.macbook; technical HUD labels match the live
   site verbatim (English on every locale, as on the real site). */

const GOLD = "#CBA45C";
const GOLD_HI = "#E6CB87";
const INK = "#1a160c";

// The hero backdrop — a real top-down aerial frame from the drone operator.
const DRONE_IMG = "/cases/visionair-drone.jpg";
// Warsaw skyline — kept for the mobile portfolio grid.
const WARSAW_IMG =
  "https://images.unsplash.com/photo-1519197924294-4ba991a11128?auto=format&fit=crop&w=1600&q=80";
// A cinematic top-down aerial — the footage the service delivers — for the
// phone's portfolio grid.
const AERIAL_IMG =
  "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=900&q=80";

const HUD_LABELS = ["4K CINEMATIC", "DJI MINI 4 PRO", "EASA CERTIFIED"];
const TELEMETRY = ["52.2297° N", "21.0122° E", "ALT 120m AGL"];

type Stat = { k: string; v: string };

type Copy = {
  headline: string;
  accent: string;
  lead: string;
  ctaGhost: string;
  nav: string[];
  stats: Stat[];
  services: string[];
  ratingCount: string;
};

const CINEMA_GRADE =
  "linear-gradient(96deg, rgba(8,10,15,0.92) 0%, rgba(8,10,15,0.62) 42%, rgba(8,10,15,0.3) 70%, rgba(8,10,15,0.52) 100%)";
const FLOOR_GRADE = "linear-gradient(0deg, rgba(6,8,12,0.88) 0%, rgba(6,8,12,0.1) 44%, transparent 64%)";
const GOLD_BLOOM = "radial-gradient(64% 58% at 75% 46%, rgba(203,164,92,0.26) 0%, transparent 60%)";

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
    ratingCount: t("ratingCount"),
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
        <Laptop copy={copy} domain={domain} reduce={!!reduce} />
      </div>

      {/* iPhone — overlaps the laptop's lower-right, auto-scrolls the mobile site */}
      <Phone copy={copy} reduce={!!reduce} />
    </div>
  );
}

/* ─────────────────────────── MacBook ─────────────────────────── */

function Laptop({ copy, domain, reduce }: { copy: Copy; domain: string; reduce: boolean }) {
  return (
    <div>
      <div className="relative rounded-[14px] border-[3px] border-[#2b2c2f] bg-[#0c0c0e] p-[8px] shadow-[0_44px_72px_-30px_rgba(14,18,28,0.6),0_0_0_1px_rgba(0,0,0,0.16)]">
        <div className="absolute left-1/2 top-[3px] z-10 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#26272a] ring-1 ring-black/40" />
        <div
          className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-[#0a0c11]"
          style={{ containerType: "inline-size" }}
        >
          <DesktopSite copy={copy} reduce={reduce} />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(122deg, rgba(255,255,255,0.08) 0%, transparent 24%, transparent 100%)" }}
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

function DesktopSite({ copy, reduce }: { copy: Copy; reduce: boolean }) {
  return (
    <div className="absolute inset-0 text-white">
      <Image src={DRONE_IMG} alt="" aria-hidden="true" fill sizes="(max-width:768px) 90vw, 540px" className="scale-[1.05] object-cover" />
      <div className="absolute inset-0" style={{ background: CINEMA_GRADE }} />
      <div className="absolute inset-0" style={{ background: FLOOR_GRADE }} />
      <div className="absolute inset-0" style={{ background: GOLD_BLOOM }} />

      {/* corner brackets */}
      <Bracket className="left-[2.6cqw] top-[2.6cqw]" />
      <Bracket className="right-[2.6cqw] bottom-[2.6cqw] rotate-180" />

      {/* telemetry */}
      <div className="absolute right-[5cqw] top-[10.5cqw] text-right font-mono text-[1.25cqw] leading-[1.5] tracking-[0.08em]" style={{ color: `${GOLD}cc` }}>
        {TELEMETRY.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>

      {/* drone reticle cluster */}
      <DroneCluster reduce={reduce} />

      <div className="relative flex h-full flex-col px-[5.2cqw] pb-[3.4cqw] pt-[3.6cqw]">
        {/* top bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-[1.8cqw]">
            <Logo className="h-[4.4cqw] w-[4.4cqw]" />
            <div className="leading-none">
              <div className="text-[2.6cqw] font-semibold tracking-[0.18em]">VISIONAIR</div>
              <div className="mt-[0.7cqw] text-[1.3cqw] tracking-[0.28em]" style={{ color: `${GOLD}cc` }}>
                WARSAW · AERIAL CINEMA
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-[2.4cqw] text-[1.5cqw] tracking-[0.1em] text-white/72 @[440px]:flex">
            <span className="inline-flex items-center gap-[0.5cqw]">
              {copy.nav[0]}
              <Caret className="h-[1.3cqw] w-[1.3cqw]" />
            </span>
            {copy.nav.slice(1).map((n) => (
              <span key={n}>{n}</span>
            ))}
          </nav>

          <div className="flex items-center gap-[1.6cqw]">
            <LangPills className="hidden @[440px]:flex" />
            <span
              className="inline-flex items-center gap-[0.9cqw] rounded-full px-[2.6cqw] py-[1.3cqw] text-[1.5cqw] font-semibold tracking-[0.08em]"
              style={{ background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})`, color: INK }}
            >
              НАЧАТЬ ПРОЕКТ
              <Arrow className="h-[1.6cqw] w-[1.6cqw]" />
            </span>
          </div>
        </div>

        {/* hero copy */}
        <div className="relative z-10 mt-auto max-w-[88cqw]">
          <div className="flex items-center gap-[1.4cqw] text-[1.5cqw] font-medium tracking-[0.26em]" style={{ color: GOLD }}>
            <span className="inline-block h-[0.9cqw] w-[0.9cqw] rounded-full" style={{ background: GOLD }} />
            WARSAW · EUROPE · WORLDWIDE
          </div>

          <h3 className="mt-[1.8cqw] max-w-[72cqw] text-[6.3cqw] font-extrabold uppercase leading-[0.9] tracking-[-0.01em] drop-shadow-[0_3px_18px_rgba(0,0,0,0.4)]">
            {copy.headline}
          </h3>
          <p className="mt-[0.6cqw] font-serif text-[4cqw] italic leading-none" style={{ color: GOLD_HI }}>
            {copy.accent}
          </p>

          <p className="mt-[1.8cqw] line-clamp-2 max-w-[46cqw] text-[1.62cqw] leading-[1.46] text-white/68">{copy.lead}</p>

          <div className="mt-[2cqw] flex items-center gap-[2.2cqw]">
            <span
              className="inline-flex items-center gap-[1cqw] rounded-full px-[3cqw] py-[1.5cqw] text-[1.75cqw] font-semibold tracking-[0.08em]"
              style={{ background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})`, color: INK }}
            >
              НАЧАТЬ ПРОЕКТ
              <Arrow className="h-[1.75cqw] w-[1.75cqw]" />
            </span>
            <span className="inline-flex items-center gap-[1cqw] text-[1.65cqw] font-medium tracking-[0.08em] text-white/85">
              <Play className="h-[1.9cqw] w-[1.9cqw]" />
              СМОТРЕТЬ КЕЙСЫ
            </span>
          </div>

          <RatingPill count={copy.ratingCount} className="mt-[2cqw]" />

          <div className="mt-[1.8cqw] flex items-center gap-[5cqw] border-t border-white/12 pt-[1.8cqw]">
            {copy.stats.map((s) => (
              <div key={s.k} className="leading-tight">
                <div className="text-[1.3cqw] uppercase tracking-[0.18em] text-white/40">{s.k}</div>
                <div className="mt-[0.6cqw] text-[2cqw] font-semibold">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-[3cqw] left-1/2 flex -translate-x-1/2 flex-col items-center gap-[1cqw]">
        <span className="font-mono text-[1.1cqw] tracking-[0.3em] text-white/45">SCROLL</span>
        <span className="h-[3.4cqw] w-px bg-gradient-to-b from-white/45 to-transparent" />
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
        <div
          className="relative aspect-[9/19] overflow-hidden rounded-[13%/6.4%] bg-[#0a0c11]"
          style={{ containerType: "inline-size" }}
        >
          <div className="absolute left-1/2 top-[3cqw] z-30 h-[5cqw] w-[30cqw] -translate-x-1/2 rounded-full bg-black" />

          <motion.div
            className="absolute inset-x-0 top-0"
            initial={false}
            animate={reduce ? undefined : { y: ["0%", "0%", "-57%", "-57%", "0%"] }}
            transition={{ duration: 19, times: [0, 0.08, 0.46, 0.56, 1], repeat: Infinity, ease: "easeInOut" }}
          >
            <MobileSite copy={copy} />
          </motion.div>

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
        <Image src={DRONE_IMG} alt="" aria-hidden="true" fill sizes="180px" className="scale-[1.08] object-cover" style={{ objectPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,10,15,0.72) 0%, rgba(8,10,15,0.4) 36%, rgba(8,10,15,0.94) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(88% 46% at 72% 18%, rgba(203,164,92,0.26), transparent 60%)" }} />

        {/* mini reticle + drone, upper-right */}
        <div className="absolute right-[6cqw] top-[20cqw] h-[34cqw] w-[34cqw]">
          <OrbitRings className="absolute inset-0" reduce />
          <Drone className="absolute left-1/2 top-1/2 h-[20cqw] w-[20cqw] -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative flex h-full flex-col px-[7cqw] pb-[8cqw] pt-[9.5cqw]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[2.4cqw]">
              <Logo className="h-[6.4cqw] w-[6.4cqw]" />
              <span className="text-[3.6cqw] font-semibold tracking-[0.14em]">VISIONAIR</span>
            </div>
            <Burger className="h-[5cqw] w-[5cqw]" />
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-[2cqw] text-[2.7cqw] font-medium tracking-[0.22em]" style={{ color: GOLD }}>
              <span className="inline-block h-[1.4cqw] w-[1.4cqw] rounded-full" style={{ background: GOLD }} />
              WARSAW · EUROPE
            </div>
            <h4 className="mt-[3cqw] text-[10cqw] font-extrabold uppercase leading-[0.92]">{copy.headline}</h4>
            <p className="mt-[1.6cqw] font-serif text-[6.6cqw] italic leading-none" style={{ color: GOLD_HI }}>
              {copy.accent}
            </p>
            <div
              className="mt-[4.6cqw] inline-flex w-full items-center justify-center gap-[1.8cqw] rounded-full py-[3.4cqw] text-[3.3cqw] font-semibold tracking-[0.08em]"
              style={{ background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})`, color: INK }}
            >
              НАЧАТЬ ПРОЕКТ
              <Arrow className="h-[3.4cqw] w-[3.4cqw]" />
            </div>
            <div className="mt-[3.4cqw] flex items-center justify-center gap-[1.6cqw]">
              <Stars className="h-[3.2cqw]" />
              <span className="text-[2.8cqw] font-semibold tabular-nums">4.9</span>
              <span className="text-[2.6cqw] text-white/55">· {copy.ratingCount}</span>
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
          {[AERIAL_IMG, WARSAW_IMG, WARSAW_IMG, AERIAL_IMG].map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-[3cqw]"
              style={{ aspectRatio: i % 3 === 0 ? "4 / 5" : "4 / 3" }}
            >
              <Image src={src} alt="" aria-hidden="true" fill sizes="90px" className="object-cover" style={{ objectPosition: i % 2 ? "70% 40%" : "40% 50%" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
              <span className="absolute bottom-[2cqw] left-[2.4cqw] text-[2.4cqw] font-semibold tracking-[0.12em] text-white/85">4K</span>
            </div>
          ))}
        </div>

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

/* ──────────────────── drone reticle + HUD ──────────────────── */

function DroneCluster({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute right-[6cqw] top-[11cqw] h-[40cqw] w-[40cqw]">
      <OrbitRings className="absolute inset-0" reduce={reduce} />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[24cqw] w-[24cqw] -translate-x-1/2 -translate-y-1/2"
        initial={false}
        animate={reduce ? undefined : { y: ["-4%", "4%", "-4%"] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Drone className="h-full w-full drop-shadow-[0_8cqw_10cqw_rgba(0,0,0,0.45)]" />
      </motion.div>

      {/* HUD chips anchored around the reticle */}
      <HudChip label={HUD_LABELS[0]} className="left-[64%] top-[6%]" />
      <HudChip label={HUD_LABELS[1]} className="left-[-22%] top-[58%]" />
      <HudChip label={HUD_LABELS[2]} className="left-[62%] top-[88%]" />
    </div>
  );
}

function OrbitRings({ className, reduce }: { className?: string; reduce: boolean }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <circle cx="100" cy="100" r="96" stroke={GOLD} strokeOpacity="0.16" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="70" stroke={GOLD} strokeOpacity="0.26" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="44" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.8" />
      <motion.circle
        cx="100" cy="100" r="84"
        stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.9"
        strokeDasharray="2 5"
        style={{ transformOrigin: "100px 100px" }}
        initial={false}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      {/* crosshair ticks */}
      <path d="M100 4v12M100 184v12M4 100h12M184 100h12" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1" />
      {/* lock corners */}
      {[
        "M58 58h-8v8", "M142 58h8v8", "M58 142h-8v-8", "M142 142h8v-8",
      ].map((d) => (
        <path key={d} d={d} stroke={GOLD} strokeOpacity="0.7" strokeWidth="1.4" />
      ))}
      <circle cx="100" cy="100" r="1.6" fill={GOLD} />
    </svg>
  );
}

function Drone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      <defs>
        <linearGradient id="va-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1f2f4" />
          <stop offset="0.55" stopColor="#cfd1d6" />
          <stop offset="1" stopColor="#9a9da3" />
        </linearGradient>
        <radialGradient id="va-prop" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.9" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* arms */}
      <g stroke="#3a3b3f" strokeWidth="9" strokeLinecap="round">
        <path d="M100 100 56 56M100 100 144 56M100 100 56 144M100 100 144 144" />
      </g>

      {/* prop discs + motors */}
      {[[56, 56], [144, 56], [56, 144], [144, 144]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="30" fill="url(#va-prop)" />
          <circle cx={x} cy={y} r="30" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="0.8" />
          <line x1={x - 27} y1={y} x2={x + 27} y2={y} stroke="#ffffff" strokeOpacity="0.32" strokeWidth="1.4" />
          <line x1={x} y1={y - 27} x2={x} y2={y + 27} stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.4" />
          <circle cx={x} cy={y} r="8" fill="#2c2d31" />
          <circle cx={x} cy={y} r="3" fill="#5a5b60" />
        </g>
      ))}

      {/* status LEDs — front gold, rear red */}
      <circle cx="56" cy="56" r="4.4" fill={GOLD_HI} />
      <circle cx="144" cy="56" r="4.4" fill={GOLD_HI} />
      <circle cx="56" cy="144" r="4.4" fill="#ff5a52" />
      <circle cx="144" cy="144" r="4.4" fill="#ff5a52" />

      {/* body */}
      <rect x="72" y="70" width="56" height="60" rx="16" fill="url(#va-body)" stroke="#7d8085" strokeWidth="1" />
      <rect x="80" y="78" width="40" height="14" rx="6" fill="#ffffff" fillOpacity="0.5" />
      {/* gimbal camera */}
      <rect x="86" y="124" width="28" height="20" rx="7" fill="#1d1e22" />
      <circle cx="100" cy="134" r="7" fill="#0c0c0e" stroke={GOLD} strokeWidth="1.4" />
      <circle cx="100" cy="134" r="2.6" fill="#2b2c30" />
    </svg>
  );
}

function HudChip({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`absolute flex items-center gap-[0.9cqw] ${className ?? ""}`}>
      <span className="h-[1.1cqw] w-[1.1cqw] rounded-full" style={{ background: GOLD, boxShadow: `0 0 0 0.5cqw rgba(203,164,92,0.25)` }} />
      <span className="whitespace-nowrap font-mono text-[1.15cqw] tracking-[0.14em] text-white/80">{label}</span>
    </div>
  );
}

function RatingPill({ count, className }: { count: string; className?: string }) {
  return (
    <div className={`inline-flex items-center gap-[1.4cqw] rounded-full border border-white/14 bg-white/[0.06] py-[1cqw] pl-[1.8cqw] pr-[2.4cqw] ${className ?? ""}`}>
      <Stars className="h-[1.6cqw]" />
      <span className="text-[1.55cqw] font-semibold tabular-nums">
        4.9<span className="text-white/45">/5</span>
      </span>
      <span className="h-[1.6cqw] w-px bg-white/15" />
      <span className="font-mono text-[1.2cqw] uppercase tracking-[0.12em] text-white/55">{count}</span>
    </div>
  );
}

/* ─────────────────────────── glyphs ─────────────────────────── */

function Logo({ className }: { className?: string }) {
  return (
    <span className={`grid place-items-center rounded-[1.4cqw] border ${className ?? ""}`} style={{ borderColor: `${GOLD}99`, background: "rgba(203,164,92,0.1)" }}>
      <svg viewBox="0 0 24 24" width="62%" height="62%" fill="none" stroke={GOLD} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 5l14 14M19 5L5 19" strokeOpacity="0.55" />
        <circle cx="5" cy="5" r="2.1" fill={GOLD} stroke="none" />
        <circle cx="19" cy="5" r="2.1" fill={GOLD} stroke="none" />
        <circle cx="5" cy="19" r="2.1" fill={GOLD} stroke="none" />
        <circle cx="19" cy="19" r="2.1" fill={GOLD} stroke="none" />
        <circle cx="12" cy="12" r="2.6" />
      </svg>
    </span>
  );
}

function LangPills({ className }: { className?: string }) {
  const langs = ["RU", "PL", "EN", "UA"];
  return (
    <div className={`items-center rounded-full border border-white/15 p-[0.5cqw] ${className ?? ""}`}>
      {langs.map((l) => (
        <span
          key={l}
          className="rounded-full px-[1.4cqw] py-[0.7cqw] text-[1.25cqw] font-semibold tracking-[0.06em]"
          style={l === "RU" ? { background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})`, color: INK } : { color: "rgba(255,255,255,0.55)" }}
        >
          {l}
        </span>
      ))}
    </div>
  );
}

function Stars({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[0.4cqw] ${className ?? ""}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 16 16" className="h-full w-auto" fill={GOLD_HI} aria-hidden="true">
          <path d="M8 1.3l1.9 4.1 4.5.5-3.4 3.1.9 4.4L8 11.4 4.1 13.4l.9-4.4L1.6 5.9l4.5-.5L8 1.3z" />
        </svg>
      ))}
    </span>
  );
}

function Bracket({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`absolute h-[3.4cqw] w-[3.4cqw] ${className ?? ""}`} fill="none" stroke={GOLD} strokeOpacity="0.6" strokeWidth="1.4">
      <path d="M2 9V2h7" strokeLinecap="round" />
    </svg>
  );
}

function Caret({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
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
    "M12 20s-7-4.6-7-9.4A3.6 3.6 0 0 1 12 8a3.6 3.6 0 0 1 7 2.6C19 15.4 12 20 12 20z",
    "M4 20V8l8-4 8 4v12M9 20v-5h6v5",
    "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
    "M4 10v4l9 4V6l-9 4zM13 7l5-2v14l-5-2",
  ];
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={GOLD_HI} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[i % paths.length]} />
    </svg>
  );
}

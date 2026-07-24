"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

/* LegalWin case hero — a faithful recreation of the live site (legalwin.pl/en)
   shown as a MacBook + iPhone duo on a cinematic stage, mirroring the VisionAir
   hero. The laptop renders the real desktop hero (Warsaw skyline at golden hour,
   a gilded "LW" crest, the SEO-driven serif headline — Karta pobytu · residence
   · PR in Poland — gold scales of justice and a 4.9★ rating); the phone renders
   the mobile layout and slowly auto-scrolls through hero → services.

   Faux UIs are sized in container-query units (cqw) so they scale exactly with
   their device at every breakpoint. Copy comes from home.legalwinShowcase.site
   (localised); chrome details that are English on the live /en page (status,
   coordinates) are rendered verbatim. */

const GOLD = "#D6B060";
const GOLD_HI = "#E8C879";
const INK = "#1a1408";
const HERO_IMG = "/cases/legalwin-skyline.webp";

const LANGS = ["UK", "RU", "PL", "EN", "TR"];

type Copy = {
  badge: string;
  nav: string[];
  consult: string;
  title: string;
  titleAccent: string;
  subhead: string;
  rating: string;
  ratingLabel: string;
  ctaPrimary: string;
  ctaSecondary: string;
  servicesLabel: string;
  services: string[];
};

const CINEMA_GRADE =
  "radial-gradient(120% 90% at 86% -8%, rgba(214,176,96,0.16) 0%, transparent 46%), linear-gradient(104deg, rgba(7,8,12,0.95) 0%, rgba(7,8,12,0.78) 42%, rgba(7,8,12,0.58) 72%, rgba(7,8,12,0.6) 100%)";
const FLOOR_GRADE = "linear-gradient(0deg, rgba(6,6,9,0.85) 0%, rgba(6,6,9,0.08) 42%, transparent 64%)";

export function LegalwinHeroMock() {
  const t = useTranslations("home.legalwinShowcase.site");
  const reduce = useReducedMotion();
  const copy: Copy = {
    badge: t("badge"),
    nav: t.raw("nav") as string[],
    consult: t("consult"),
    title: t("title"),
    titleAccent: t("titleAccent"),
    subhead: t("subhead"),
    rating: t("rating"),
    ratingLabel: t("ratingLabel"),
    ctaPrimary: t("ctaPrimary"),
    ctaSecondary: t("ctaSecondary"),
    servicesLabel: t("servicesLabel"),
    services: t.raw("services") as string[],
  };

  return (
    <div className="relative mx-auto w-full max-w-[600px] pb-[12%] pt-[3%] [perspective:2200px]">
      {/* warm bloom tying the dark devices into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-14%] top-[2%] -z-10 h-[82%]"
        style={{ background: "radial-gradient(58% 54% at 58% 38%, rgba(214,176,96,0.26), transparent 72%)" }}
      />
      {/* soft floor shadow grounding the laptop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[5%] bottom-[6%] -z-10 h-[15%] rounded-[50%]"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(16,13,8,0.4), transparent 72%)", filter: "blur(10px)" }}
      />

      {/* MacBook — left-weighted so the phone has room to overlap */}
      <div className="w-[87%] [transform:rotateX(2.5deg)] [transform-style:preserve-3d]">
        <Laptop copy={copy} reduce={!!reduce} />
      </div>

      {/* iPhone — overlaps the laptop's lower-right, auto-scrolls the mobile site */}
      <Phone copy={copy} reduce={!!reduce} />
    </div>
  );
}

/* ─────────────────────────── MacBook ─────────────────────────── */

function Laptop({ copy, reduce }: { copy: Copy; reduce: boolean }) {
  return (
    <div>
      <div className="relative rounded-[14px] border-[3px] border-[#2b2c2f] bg-[#0c0c0e] p-[8px] shadow-[0_44px_72px_-30px_rgba(12,12,16,0.62),0_0_0_1px_rgba(0,0,0,0.16)]">
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
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55), 0 16px 22px -16px rgba(12,12,16,0.5)",
          }}
        />
        <div
          className="absolute left-1/2 top-0 h-[34%] w-[14%] -translate-x-1/2 rounded-b-[5px]"
          style={{ background: "linear-gradient(180deg, #8a8d92, #b3b6bb)" }}
        />
      </div>

      <a
        href="https://legalwin.pl/en"
        target="_blank"
        rel="noreferrer noopener"
        className="mx-auto mt-4 flex w-fit items-center gap-1.5 font-mono text-[12px] tracking-[0.02em] text-[color:var(--color-text-3)] transition-colors hover:text-[color:var(--c-accent-ink)] dark:hover:text-[color:var(--c-accent)]"
      >
        legalwin.pl/en
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      </a>
    </div>
  );
}

function DesktopSite({ copy, reduce }: { copy: Copy; reduce: boolean }) {
  return (
    <div className="absolute inset-0 text-white">
      {/* skyline — blurred so the photo's own baked headline never doubles ours */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${HERO_IMG})`, filter: "blur(4px) saturate(0.92)", transform: "scale(1.12)" }}
      />
      <div className="absolute inset-0" style={{ background: CINEMA_GRADE }} />
      <div className="absolute inset-0" style={{ background: FLOOR_GRADE }} />

      {/* gold scales of justice on the right, like the live site */}
      <Scales reduce={reduce} className="absolute right-[5cqw] top-[24cqw] h-[34cqw] w-[34cqw] opacity-[0.55]" />

      <div className="relative flex h-full flex-col px-[5.2cqw] pb-[3.4cqw] pt-[3.4cqw]">
        {/* top bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-[1.6cqw]">
            <Crest className="h-[5.4cqw] w-[4.4cqw]" />
            <div className="leading-none">
              <div className="text-[2cqw] font-semibold tracking-[0.26em]">LEGALWIN</div>
              <div className="mt-[0.7cqw] text-[1.05cqw] tracking-[0.3em]" style={{ color: `${GOLD}cc` }}>
                WARSZAWA · POLSKA
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-[2cqw] text-[1.45cqw] tracking-[0.02em] text-white/72 @[440px]:flex">
            {copy.nav.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </nav>

          <div className="flex items-center gap-[1.4cqw]">
            <div className="hidden items-center rounded-full border border-white/15 p-[0.5cqw] @[440px]:flex">
              {LANGS.map((l) => (
                <span
                  key={l}
                  className="rounded-full px-[1.2cqw] py-[0.6cqw] text-[1.15cqw] font-semibold tracking-[0.04em]"
                  style={l === "EN" ? { background: "#fff", color: INK } : { color: "rgba(255,255,255,0.55)" }}
                >
                  {l}
                </span>
              ))}
            </div>
            <span
              className="inline-flex items-center gap-[0.8cqw] rounded-full px-[2.4cqw] py-[1.2cqw] text-[1.45cqw] font-semibold"
              style={{ background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})`, color: INK }}
            >
              {copy.consult}
              <Arrow className="h-[1.5cqw] w-[1.5cqw]" />
            </span>
          </div>
        </div>

        {/* status pill */}
        <div className="relative z-10 mt-[1.8cqw] flex justify-end">
          <span className="inline-flex items-center gap-[1cqw] rounded-full border border-white/12 bg-black/35 px-[2cqw] py-[1cqw] text-[1.2cqw] text-white/72 backdrop-blur-sm">
            <span className="h-[1cqw] w-[1cqw] rounded-full bg-[#27c93f]" />
            Reply within an hour · Open today until 7 PM
          </span>
        </div>

        {/* hero copy */}
        <div className="relative z-10 mt-auto max-w-[62cqw]">
          <p className="flex items-center gap-[1.4cqw] text-[1.35cqw] font-semibold uppercase tracking-[0.24em]" style={{ color: GOLD }}>
            <span className="h-px w-[4cqw]" style={{ background: `${GOLD}b3` }} />
            {copy.badge}
          </p>

          <h3 className="mt-[1.6cqw] font-serif text-[5.2cqw] font-semibold leading-[1.03] tracking-[-0.012em] drop-shadow-[0_3px_18px_rgba(0,0,0,0.45)]">
            {copy.title}
          </h3>
          <p className="mt-[0.8cqw] font-serif text-[3.7cqw] italic leading-[1.06]" style={{ color: GOLD_HI }}>
            {copy.titleAccent}
          </p>

          <p className="mt-[1.8cqw] line-clamp-2 max-w-[46cqw] text-[1.6cqw] leading-[1.46] text-white/68">{copy.subhead}</p>

          <div className="mt-[2cqw] flex items-center gap-[1.6cqw]">
            <span className="inline-flex items-center gap-[1cqw] rounded-full border border-white/14 bg-white/[0.06] py-[1cqw] pl-[1.8cqw] pr-[2.2cqw] backdrop-blur-sm">
              <Stars className="h-[1.7cqw]" />
              <span className="text-[1.6cqw] font-semibold tabular-nums">{copy.rating}</span>
            </span>
            <span className="text-[1.2cqw] uppercase tracking-[0.18em] text-white/45">/ {copy.ratingLabel} · 5★</span>
          </div>

          <div className="mt-[2.2cqw] flex items-center gap-[1.8cqw]">
            <span
              className="inline-flex items-center gap-[1cqw] rounded-full px-[3cqw] py-[1.5cqw] text-[1.7cqw] font-semibold"
              style={{ background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})`, color: INK }}
            >
              {copy.ctaPrimary}
              <Arrow className="h-[1.7cqw] w-[1.7cqw]" />
            </span>
            <span className="inline-flex items-center rounded-full border border-white/20 px-[2.6cqw] py-[1.5cqw] text-[1.6cqw] font-medium text-white/85">
              {copy.ctaSecondary}
            </span>
          </div>
        </div>

        {/* coordinates footer */}
        <div className="relative z-10 mt-[2cqw] font-mono text-[1.1cqw] uppercase tracking-[0.2em] text-white/35">
          52.2297° N · 21.0122° E · Pałac Kultury · Warszawa
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
      <div className="relative rounded-[15%/7.4%] border-[5px] border-[#15161a] bg-[#15161a] shadow-[0_34px_54px_-20px_rgba(12,12,16,0.66),0_0_0_1px_rgba(0,0,0,0.28)]">
        <div
          className="relative aspect-[9/19] overflow-hidden rounded-[13%/6.4%] bg-[#0a0c11]"
          style={{ containerType: "inline-size" }}
        >
          <div className="absolute left-1/2 top-[3cqw] z-30 h-[5cqw] w-[30cqw] -translate-x-1/2 rounded-full bg-black" />

          <motion.div
            className="absolute inset-x-0 top-0"
            initial={false}
            animate={reduce ? undefined : { y: ["0%", "0%", "-50%", "-50%", "0%"] }}
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
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-bottom"
          style={{ backgroundImage: `url(${HERO_IMG})`, filter: "blur(3px) saturate(0.92)", transform: "scale(1.16)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(7,8,12,0.78) 0%, rgba(7,8,12,0.46) 34%, rgba(7,8,12,0.95) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(86% 44% at 74% 16%, rgba(214,176,96,0.24), transparent 60%)" }} />

        <Scales reduce className="absolute right-[6cqw] top-[24cqw] h-[30cqw] w-[30cqw] opacity-[0.5]" />

        <div className="relative flex h-full flex-col px-[7cqw] pb-[8cqw] pt-[9.5cqw]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[2.4cqw]">
              <Crest className="h-[8cqw] w-[6.4cqw]" />
              <span className="text-[3.4cqw] font-semibold tracking-[0.16em]">LEGALWIN</span>
            </div>
            <Burger className="h-[5cqw] w-[5cqw]" />
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-[2cqw] text-[2.6cqw] font-semibold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
              <span className="h-px w-[5cqw]" style={{ background: `${GOLD}b3` }} />
              {copy.badge}
            </div>
            <h4 className="mt-[3cqw] font-serif text-[8.6cqw] font-semibold leading-[1.02]">{copy.title}</h4>
            <p className="mt-[1.6cqw] font-serif text-[6cqw] italic leading-[1.05]" style={{ color: GOLD_HI }}>
              {copy.titleAccent}
            </p>
            <div
              className="mt-[4.6cqw] inline-flex w-full items-center justify-center gap-[1.8cqw] rounded-full py-[3.4cqw] text-[3.3cqw] font-semibold"
              style={{ background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})`, color: INK }}
            >
              {copy.ctaPrimary}
              <Arrow className="h-[3.4cqw] w-[3.4cqw]" />
            </div>
            <div className="mt-[3.4cqw] flex items-center justify-center gap-[1.6cqw]">
              <Stars className="h-[3.2cqw]" />
              <span className="text-[2.8cqw] font-semibold tabular-nums">{copy.rating}</span>
              <span className="text-[2.6cqw] text-white/55">· {copy.ratingLabel}</span>
            </div>
          </div>
        </div>
      </section>

      {/* services */}
      <section className="bg-[#0b0d12] px-[7cqw] pb-[9cqw] pt-[8cqw]">
        <div className="flex items-center gap-[2cqw] text-[2.8cqw] font-semibold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
          <span className="h-px w-[5cqw]" style={{ background: `${GOLD}b3` }} />
          {copy.servicesLabel}
        </div>
        <div className="mt-[4cqw] grid grid-cols-2 gap-[3cqw]">
          {copy.services.map((s, i) => (
            <div key={s} className="rounded-[3.4cqw] border border-white/10 bg-white/[0.04] p-[3.6cqw]">
              <span className="grid h-[8cqw] w-[8cqw] place-items-center rounded-[2.4cqw]" style={{ background: "rgba(214,176,96,0.16)" }}>
                <ServiceGlyph i={i} className="h-[4.4cqw] w-[4.4cqw]" />
              </span>
              <div className="mt-[2.8cqw] text-[3cqw] font-medium leading-tight">{s}</div>
            </div>
          ))}
        </div>

        <div className="mt-[6cqw] flex items-center justify-between rounded-[4cqw] px-[5cqw] py-[5cqw]" style={{ background: `linear-gradient(120deg, ${GOLD}, ${GOLD_HI})` }}>
          <div className="leading-tight" style={{ color: INK }}>
            <div className="text-[3.4cqw] font-bold tracking-[0.12em]">LEGALWIN</div>
            <div className="mt-[1cqw] text-[2.4cqw] font-medium opacity-80">warszawa · since 2019</div>
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

function Crest({ className }: { className?: string }) {
  return (
    <span className={`relative grid place-items-center ${className ?? ""}`}>
      <svg viewBox="0 0 44 54" className="absolute inset-0 h-full w-full" fill="none">
        <defs>
          <linearGradient id="lw-crest" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={GOLD_HI} />
            <stop offset="1" stopColor="#9c7a2e" />
          </linearGradient>
        </defs>
        <path d="M2 4h40v28c0 11-9 17-20 22C11 49 2 43 2 32V4z" fill="rgba(20,16,8,0.55)" stroke="url(#lw-crest)" strokeWidth="1.6" />
        <path d="M8 10h28v20c0 8-6.6 12.6-14 16-7.4-3.4-14-8-14-16V10z" stroke={`${GOLD}66`} strokeWidth="1" fill="none" />
      </svg>
      <span className="relative text-[1.7cqw] font-bold tracking-[0.04em]" style={{ color: GOLD_HI }}>
        LW
      </span>
    </span>
  );
}

function Scales({ className, reduce }: { className?: string; reduce: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      stroke={GOLD}
      aria-hidden="true"
      initial={false}
      animate={reduce ? undefined : { rotate: [-1.6, 1.6, -1.6] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "100px 30px" }}
    >
      <g strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.85">
        <path d="M100 24v140" />
        <path d="M70 170h60" />
        <path d="M40 60h120" />
        <path d="M100 38a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" strokeOpacity="0.9" />
        <path d="M40 60 22 104M40 60 58 104" />
        <path d="M16 104a24 24 0 0 0 48 0z" />
        <path d="M160 60 142 104M160 60 178 104" />
        <path d="M136 104a24 24 0 0 0 48 0z" />
      </g>
    </motion.svg>
  );
}

function Arrow({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
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

function Burger({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function ServiceGlyph({ i, className }: { i: number; className?: string }) {
  const paths = [
    // id card
    "M3 6h18v12H3zM7 10h4M7 14h7M16 9.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z",
    // home / residence
    "M4 11l8-6 8 6M6 10v9h12v-9M10 19v-5h4v5",
    // passport / citizenship
    "M5 3h11l3 3v15H5zM9 9a3 3 0 1 0 6 0 3 3 0 0 0-6 0zM9 16h6",
    // steering wheel / licence
    "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 12h5M15 12h5M12 15v5",
    // truck / Kod 95
    "M3 7h11v8H3zM14 10h4l3 3v2h-7M6.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM17.5 15a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z",
    // stamp / legalisation
    "M9 3h6v5l1 3H8l1-3V3zM5 16h14M7 16v3h10v-3",
  ];
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={GOLD_HI} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[i % paths.length]} />
    </svg>
  );
}

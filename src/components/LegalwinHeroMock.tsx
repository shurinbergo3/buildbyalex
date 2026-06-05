"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

/* LegalWin case hero — a faithful recreation of the live desktop site
   (legalwin.pl/en) framed inside a floating browser window. The screen renders
   the real hero: a Warsaw skyline at golden hour, a gilded "LW" crest, the
   SEO-driven serif headline (Karta Pobytu · TRC · PR in Poland), a 4.9★ rating
   and the immigration-consultancy CTAs. A gold "View the live site" button sits
   under the window.

   Everything inside the frame is sized in container-query units (cqw) so the
   whole page scales as one piece at every breakpoint — no clipping, no drift.
   Copy comes from home.legalwinShowcase.site (localised); site-chrome details
   that are English on the live /en page (phone, coordinates, status, language
   pills) are rendered verbatim, exactly as VisionAir's HUD labels are. */

const GOLD = "#D6B060";
const GOLD_HI = "#E8C879";
const INK = "#1a1408";
const HERO_IMG = "/cases/legalwin-hero.jpg";

const LANGS = ["UK", "RU", "PL", "EN", "TR"];
const PHONE = "+48 506 55 07 21";

export function LegalwinHeroMock() {
  const t = useTranslations("home.legalwinShowcase.site");
  const reduce = useReducedMotion();
  const nav = t.raw("nav") as string[];

  return (
    <div className="relative mx-auto w-full max-w-[1080px] [perspective:2200px]">
      {/* warm bloom tying the dark window into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-10%] -top-[6%] -z-10 h-[80%]"
        style={{ background: "radial-gradient(56% 56% at 60% 30%, rgba(214,176,96,0.22), transparent 72%)" }}
      />
      {/* floor shadow grounding the window */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[6%] bottom-[16%] -z-10 h-[16%] rounded-[50%]"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(12,10,6,0.4), transparent 72%)", filter: "blur(14px)" }}
      />

      <motion.div
        initial={false}
        animate={reduce ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        className="[transform:rotateX(1.4deg)] [transform-style:preserve-3d]"
      >
        {/* ── Browser window ── */}
        <div className="overflow-hidden rounded-[16px] border border-white/10 bg-[#0b0d12] shadow-[0_60px_140px_-44px_rgba(8,10,16,0.85),0_0_0_1px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)] sm:rounded-[20px]">
          {/* Chrome bar */}
          <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#15171c] px-4 py-2.5 sm:px-5">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="mx-auto flex max-w-[320px] flex-1 items-center justify-center gap-2 rounded-full bg-black/40 px-3.5 py-1.5 text-[12px] text-white/65">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-[#27c93f]">
                <path d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 1 1 6 0v3H9z" />
              </svg>
              <span className="truncate font-medium tracking-[0.01em]">legalwin.pl/en</span>
            </div>
            <div className="hidden items-center gap-1.5 sm:flex">
              <span className="relative grid h-1.5 w-1.5 place-items-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#27c93f] opacity-70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-[#27c93f]" />
              </span>
              <span className="text-[10.5px] font-medium uppercase tracking-[0.12em] text-white/45">LIVE</span>
            </div>
          </div>

          {/* ── Recreated legalwin.pl/en hero ── */}
          <div className="relative aspect-[16/10] overflow-hidden bg-[#0a0c11]" style={{ containerType: "inline-size" }}>
            {/* Warsaw skyline at golden hour — blurred so the photo's own baked-in
                headline never doubles the live copy we render on top */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-bottom"
              style={{ backgroundImage: `url(${HERO_IMG})`, filter: "blur(5px) saturate(0.92)", transform: "scale(1.14)" }}
            />
            {/* legibility washes + gold bloom */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 86% -8%, rgba(214,176,96,0.16) 0%, transparent 46%), linear-gradient(104deg, rgba(7,8,12,0.95) 0%, rgba(7,8,12,0.78) 42%, rgba(7,8,12,0.6) 72%, rgba(7,8,12,0.62) 100%)",
              }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(7,8,12,0.5) 0%, transparent 30%, rgba(7,8,12,0.58) 100%)" }}
            />

            {/* Decorative gold scales-of-justice on the right, like the live site */}
            <Scales className="absolute right-[5cqw] top-[26cqw] h-[34cqw] w-[34cqw] opacity-[0.5]" />

            <div className="relative flex h-full flex-col px-[5.2cqw] pb-[3.4cqw] pt-[3.2cqw] text-white">
              {/* Top bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[1.6cqw]">
                  <Crest className="h-[5.4cqw] w-[4.4cqw]" />
                  <div className="leading-none">
                    <div className="text-[2cqw] font-semibold tracking-[0.26em]">LEGALWIN</div>
                    <div className="mt-[0.7cqw] text-[1.05cqw] tracking-[0.3em]" style={{ color: `${GOLD}cc` }}>
                      WARSZAWA · POLSKA
                    </div>
                  </div>
                </div>

                <nav className="hidden items-center gap-[2.2cqw] text-[1.45cqw] tracking-[0.02em] text-white/72 @[560px]:flex">
                  {nav.map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </nav>

                <div className="flex items-center gap-[1.4cqw]">
                  <div className="hidden items-center rounded-full border border-white/15 p-[0.5cqw] @[560px]:flex">
                    {LANGS.map((l) => (
                      <span
                        key={l}
                        className="rounded-full px-[1.3cqw] py-[0.6cqw] text-[1.2cqw] font-semibold tracking-[0.04em]"
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
                    {t("consult")}
                    <Arrow className="h-[1.5cqw] w-[1.5cqw]" />
                  </span>
                </div>
              </div>

              {/* Status pill, upper-right under nav */}
              <div className="mt-[2cqw] flex justify-end">
                <span className="inline-flex items-center gap-[1cqw] rounded-full border border-white/12 bg-black/35 px-[2cqw] py-[1cqw] text-[1.25cqw] text-white/72 backdrop-blur-sm">
                  <span className="h-[1cqw] w-[1cqw] rounded-full bg-[#27c93f]" />
                  Reply within an hour · Open today until 7 PM
                </span>
              </div>

              {/* Hero copy */}
              <div className="relative z-10 mt-auto max-w-[64cqw]">
                <p className="flex items-center gap-[1.4cqw] text-[1.35cqw] font-semibold uppercase tracking-[0.24em]" style={{ color: GOLD }}>
                  <span className="h-px w-[4cqw]" style={{ background: `${GOLD}b3` }} />
                  {t("badge")}
                </p>

                <h3 className="mt-[1.8cqw] font-serif text-[5.4cqw] font-semibold leading-[1.03] tracking-[-0.012em] drop-shadow-[0_3px_18px_rgba(0,0,0,0.45)]">
                  {t("title")}
                </h3>
                <p className="mt-[0.8cqw] font-serif text-[3.9cqw] italic leading-[1.06]" style={{ color: GOLD_HI }}>
                  {t("titleAccent")}
                </p>

                <p className="mt-[2cqw] max-w-[48cqw] text-[1.62cqw] leading-[1.5] text-white/68">{t("subhead")}</p>

                <div className="mt-[2.4cqw] flex items-center gap-[1.6cqw]">
                  <span className="inline-flex items-center gap-[1cqw] rounded-full border border-white/14 bg-white/[0.06] py-[1cqw] pl-[1.8cqw] pr-[2.2cqw] backdrop-blur-sm">
                    <Stars className="h-[1.7cqw]" />
                    <span className="text-[1.6cqw] font-semibold tabular-nums">{t("rating")}</span>
                  </span>
                  <span className="text-[1.25cqw] uppercase tracking-[0.18em] text-white/45">/ {t("ratingLabel")} · 5★</span>
                </div>

                <div className="mt-[2.6cqw] flex flex-wrap items-center gap-[1.8cqw]">
                  <span
                    className="inline-flex items-center gap-[1cqw] rounded-full px-[3cqw] py-[1.5cqw] text-[1.7cqw] font-semibold"
                    style={{ background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})`, color: INK }}
                  >
                    {t("ctaPrimary")}
                    <Arrow className="h-[1.7cqw] w-[1.7cqw]" />
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/20 px-[2.8cqw] py-[1.5cqw] text-[1.6cqw] font-medium text-white/85">
                    {t("ctaSecondary")}
                  </span>
                  <span className="inline-flex items-center gap-[1cqw] text-[1.55cqw] font-medium tracking-[0.02em] text-white/80">
                    <Phone className="h-[1.7cqw] w-[1.7cqw]" />
                    {PHONE}
                  </span>
                </div>
              </div>

              {/* Coordinates footer */}
              <div className="mt-[2.4cqw] font-mono text-[1.15cqw] uppercase tracking-[0.2em] text-white/35">
                52.2297° N · 21.0122° E · Pałac Kultury · Warszawa
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── View the live site ── */}
      <div className="mt-8 flex justify-center sm:mt-10">
        <a
          href="https://legalwin.pl/en"
          target="_blank"
          rel="noreferrer noopener"
          className="group/site relative inline-flex items-center gap-3 overflow-hidden rounded-full px-6 py-3 text-[15px] font-semibold tracking-[0.01em] shadow-[0_18px_44px_-16px_rgba(214,176,96,0.6)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_24px_56px_-16px_rgba(214,176,96,0.7)]"
          style={{ background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})`, color: INK }}
        >
          {/* sheen sweep on hover */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-700 ease-out group-hover/site:translate-x-full"
            style={{ background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.45) 50%, transparent 62%)" }}
          />
          <span className="relative grid h-2 w-2 place-items-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1a1408]/40" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-[#1a1408]" />
          </span>
          {t("viewSite")}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="transition-transform duration-300 group-hover/site:translate-x-0.5"
          >
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
      </div>
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
        <path
          d="M2 4h40v28c0 11-9 17-20 22C11 49 2 43 2 32V4z"
          fill="rgba(20,16,8,0.55)"
          stroke="url(#lw-crest)"
          strokeWidth="1.6"
        />
        <path d="M8 10h28v20c0 8-6.6 12.6-14 16-7.4-3.4-14-8-14-16V10z" stroke={`${GOLD}66`} strokeWidth="1" fill="none" />
      </svg>
      <span className="relative text-[1.8cqw] font-bold tracking-[0.04em]" style={{ color: GOLD_HI }}>
        LW
      </span>
    </span>
  );
}

function Scales({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" stroke={GOLD} aria-hidden="true">
      <g strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.85">
        <path d="M100 24v140" />
        <path d="M70 170h60" />
        <path d="M40 60h120" />
        <path d="M100 38a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" strokeOpacity="0.9" />
        {/* left pan */}
        <path d="M40 60 22 104M40 60 58 104" />
        <path d="M16 104a24 24 0 0 0 48 0z" />
        {/* right pan */}
        <path d="M160 60 142 104M160 60 178 104" />
        <path d="M136 104a24 24 0 0 0 48 0z" />
      </g>
    </svg>
  );
}

function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function Phone({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke={GOLD_HI} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L20 13l-1 4a2 2 0 0 1-2 1.6A14 14 0 0 1 3.4 6 2 2 0 0 1 5 4z" />
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

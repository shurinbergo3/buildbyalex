"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

/* Loading race: a museum-grade 2009 site against a real one. The left card
   slowly assembles a garish table-era homepage (blue header, marquee, visitor
   counter, broken image) — the visitor bails before it finishes. The right
   card is a live, scaled iframe of an actual client site that paints in 0.8s
   and stacks up proof chips: #1 on Google, Lighthouse 100, a fresh lead.
   The iframe stays mounted across replays; only the animation layers remount. */

type Metric = { v: string; l: string };

const AMBER = "#FF7A2D";
const GREEN = "#34d27b";
const RED = "#FF5F57";

// Same live site as ResponsiveSiteMock further down the page.
const SITE_BASE = "https://visionair.biz.pl";
const SITE_PATH: Record<string, string> = { ru: "", pl: "/pl/", en: "/en/", ua: "/uk/" };
const FRAME_W = 1440;
const FRAME_H = 900;

function MetricsRow({ metrics, accent, muted }: { metrics: Metric[]; accent: string; muted?: boolean }) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-3">
      {metrics.map((m, i) => (
        <div key={i}>
          <p
            className="text-[clamp(17px,1.3vw+10px,22px)] font-semibold leading-none tracking-[-0.02em] tabular-nums"
            style={
              muted
                ? { color: "rgba(255,255,255,0.45)" }
                : { background: `linear-gradient(165deg, #fff, ${accent})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
            }
          >
            {m.v}
          </p>
          <p className="mt-1.5 text-[10.5px] font-medium uppercase tracking-[0.06em] text-white/40">{m.l}</p>
        </div>
      ))}
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="13" height="13" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.3C39.7 35.4 44 30.2 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

/* ── Left: the 2009 fossil, assembling itself piece by painful piece ── */

const SERIF = 'Georgia, "Times New Roman", serif';

function OldSite({ started, reduce, t }: { started: boolean; reduce: boolean; t: ReturnType<typeof useTranslations> }) {
  const nav = t.raw("old.nav") as string[];
  const chunk = (delay: number) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0 },
    animate: started ? { opacity: 1 } : undefined,
    transition: { delay: reduce ? 0 : delay, duration: 0.25 },
  });

  return (
    <div className="flex h-full min-h-[320px] flex-col overflow-hidden bg-[#EFEFEA] text-[#1a1a1a]">
      {/* blue gradient header */}
      <motion.div
        {...chunk(1.2)}
        className="px-4 py-2.5"
        style={{ background: "linear-gradient(180deg, #4A7DC4, #2B5697)" }}
      >
        <p className="text-[14px] font-bold leading-tight text-white" style={{ fontFamily: SERIF }}>
          {t("old.logo")}
        </p>
        <p className="text-[9px] italic text-[#cfe0f5]" style={{ fontFamily: SERIF }}>
          {t("old.tagline")}
        </p>
      </motion.div>

      {/* link-soup nav */}
      <motion.div {...chunk(1.8)} className="flex flex-wrap gap-x-2 gap-y-0.5 border-b border-[#b9b9b0] bg-[#DDDDD4] px-3 py-1.5">
        {nav.map((n, i) => (
          <span key={n} className="flex items-center gap-2 text-[9.5px]" style={{ fontFamily: SERIF }}>
            <span className="text-[#1543C7] underline">{n}</span>
            {i < nav.length - 1 && <span className="text-[#8a8a80]">|</span>}
          </span>
        ))}
      </motion.div>

      {/* marquee */}
      <motion.div {...chunk(2.4)} className="max-w-full overflow-hidden border-b border-[#d8c02a] bg-[#FFF06A] py-1">
        <motion.p
          className="whitespace-nowrap text-[9.5px] font-bold text-[#C40000]"
          animate={reduce ? undefined : { x: ["100%", "-100%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        >
          {t("old.marquee")}
        </motion.p>
      </motion.div>

      {/* body */}
      <div className="flex-1 px-4 py-3">
        <motion.div {...chunk(3.0)}>
          <p className="text-[12.5px] font-bold" style={{ fontFamily: SERIF }}>
            {t("old.welcome")}
          </p>
          <p className="mt-1.5 text-justify text-[9px] leading-[1.45] text-[#3d3d3d]" style={{ fontFamily: SERIF }}>
            {t("old.p1")}
          </p>
        </motion.div>

        <motion.div {...chunk(3.7)} className="mt-2.5 flex items-start gap-3">
          {/* broken image */}
          <span className="flex h-[52px] w-[68px] flex-none flex-col items-center justify-center gap-1 border border-[#a9a9a0] bg-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a9a90" strokeWidth="1.6" aria-hidden>
              <rect x="3" y="4" width="18" height="16" />
              <circle cx="9" cy="10" r="1.6" />
              <path d="M3 17l5-4 4 3 4-5 5 6" />
              <path d="M4 3L21 21" stroke="#C40000" strokeWidth="1.8" />
            </svg>
            <span className="px-1 text-center text-[6.5px] leading-tight text-[#8a8a80]" style={{ fontFamily: SERIF }}>
              {t("old.imgAlt")}
            </span>
          </span>
          <span
            className="mt-1 inline-block bg-[#D6D6CD] px-3 py-1 text-[9.5px] font-bold text-[#2c2c2c]"
            style={{ fontFamily: SERIF, border: "2px outset #f5f5f0" }}
          >
            {t("old.more")}
          </span>
        </motion.div>
      </div>

      {/* footer: visitor counter */}
      <motion.div {...chunk(4.2)} className="flex items-center justify-between border-t border-[#b9b9b0] bg-[#DDDDD4] px-3 py-1.5">
        <span className="bg-[#101810] px-1.5 py-0.5 font-mono text-[8.5px] font-bold tracking-[0.08em] text-[#39E058]">
          {t("old.counter")}
        </span>
        <span className="text-[8px] italic text-[#7a7a70]" style={{ fontFamily: SERIF }}>
          {t("old.updated")}
        </span>
      </motion.div>
    </div>
  );
}

function SlowCard({ started, reduce, metrics, t }: {
  started: boolean;
  reduce: boolean;
  metrics: Metric[];
  t: ReturnType<typeof useTranslations>;
}) {
  return (
    <div className="relative flex h-full min-w-0 flex-col">
      <p className="mb-3 flex items-center gap-2 text-[12.5px] font-medium text-white/55">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: RED }} />
        {t("oldLabel")}
      </p>

      <motion.div
        animate={started && !reduce ? { opacity: [1, 1, 0.6] } : { opacity: reduce ? 0.6 : 1 }}
        transition={{ duration: 3.5, times: [0, 0.92, 1], ease: "easeOut" }}
        className="relative flex-1"
      >
        <div
          className="flex h-full flex-col overflow-hidden rounded-[20px] border border-white/10"
          style={{ boxShadow: "0 30px 70px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)" }}
        >
          {/* chrome */}
          <header className="flex items-center gap-2 border-b border-white/[0.07] bg-[#16161a] px-4 py-2.5">
            <span className="flex gap-1.5">
              <span className="h-[8px] w-[8px] rounded-full bg-[#FF5F57]" />
              <span className="h-[8px] w-[8px] rounded-full bg-[#FEBC2E]" />
              <span className="h-[8px] w-[8px] rounded-full bg-[#28C840]" />
            </span>
            <span className="ml-1 truncate text-[11px] font-medium text-white/50">{t("oldUrl")}</span>
            <span className="ml-auto flex items-center gap-1.5 text-[10px] text-white/35">
              <span className="h-2.5 w-2.5 animate-spin rounded-full border border-white/30 border-t-transparent" />
              {t("loading")}
            </span>
          </header>
          {/* stuck progress */}
          <div className="h-[3px] w-full bg-white/[0.06]">
            <motion.div
              className="h-full"
              style={{ background: RED, opacity: 0.85 }}
              initial={{ width: reduce ? "62%" : "0%" }}
              animate={started ? { width: "62%" } : undefined}
              transition={{ duration: 5, ease: [0.1, 0.6, 0.3, 1] }}
            />
          </div>
          <OldSite started={started} reduce={reduce} t={t} />
        </div>

        {/* visitor bails */}
        <motion.div
          className="absolute -right-2 top-8 z-10 md:-right-3"
          initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
          animate={started ? { opacity: 1, scale: 1 } : undefined}
          transition={{ delay: reduce ? 0 : 3.2, duration: 0.35, ease: "backOut" }}
        >
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)]"
            style={{ background: "rgba(20,10,10,0.94)", borderColor: "rgba(255,95,87,0.45)" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.4" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            {t("bounce")}
          </span>
        </motion.div>
      </motion.div>

      <MetricsRow metrics={metrics} accent={RED} muted />
    </div>
  );
}

/* ── Right: the real thing, live in an iframe ── */

function FastCard({ started, reduce, run, metrics, t, serp, score, url }: {
  started: boolean;
  reduce: boolean;
  run: number;
  metrics: Metric[];
  t: ReturnType<typeof useTranslations>;
  serp: string;
  score: string;
  url: string;
}) {
  const locale = useLocale();
  const href = SITE_BASE + (SITE_PATH[locale] ?? "");

  // Scale the live homepage to whatever width the card gets.
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(560 / FRAME_W);
  useEffect(() => {
    const el = frameRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / FRAME_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const chip = (delay: number, pop = false) => ({
    initial: reduce ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: pop ? 8 : 0 },
    animate: started ? { opacity: 1, scale: 1, y: 0 } : undefined,
    transition: pop
      ? { delay: reduce ? 0 : delay, type: "spring" as const, stiffness: 320, damping: 20 }
      : { delay: reduce ? 0 : delay, duration: 0.35, ease: "backOut" as const },
  });

  return (
    <div className="relative flex h-full min-w-0 flex-col">
      <p className="mb-3 flex items-center gap-2 text-[12.5px] font-medium text-white/85">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} />
        {t("newLabel")}
      </p>

      <div className="relative">
        <div
          className="flex h-full flex-col overflow-hidden rounded-[20px] border border-white/10"
          style={{ boxShadow: "0 30px 70px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)" }}
        >
          {/* chrome */}
          <header className="flex items-center gap-2 border-b border-white/[0.07] bg-[#16161a] px-4 py-2.5">
            <span className="flex gap-1.5">
              <span className="h-[8px] w-[8px] rounded-full bg-[#FF5F57]" />
              <span className="h-[8px] w-[8px] rounded-full bg-[#FEBC2E]" />
              <span className="h-[8px] w-[8px] rounded-full bg-[#28C840]" />
            </span>
            <span className="ml-1 flex items-center gap-1.5 truncate text-[11px] font-medium text-white/60">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 1 1 6 0v3H9z" fill="currentColor" />
              </svg>
              {url}
            </span>
          </header>
          {/* instant progress */}
          <div className="h-[3px] w-full bg-white/[0.06]">
            <motion.div
              key={run}
              className="h-full"
              style={{ background: `linear-gradient(90deg, ${AMBER}, ${GREEN})` }}
              initial={{ width: reduce ? "100%" : "0%" }}
              animate={started ? { width: "100%" } : undefined}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          {/* live homepage, scaled; stays mounted across replays */}
          <div ref={frameRef} className="relative w-full overflow-hidden bg-[#0A0A0A]" style={{ height: FRAME_H * scale }}>
            <iframe
              src={href}
              title={url}
              loading="lazy"
              tabIndex={-1}
              className="pointer-events-none origin-top-left border-0"
              style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${scale})` }}
            />
            {/* paint-in cover */}
            <motion.div
              key={run}
              className="pointer-events-none absolute inset-0 bg-[#0c0c0f]"
              initial={{ opacity: reduce ? 0 : 1 }}
              animate={started ? { opacity: 0 } : undefined}
              transition={{ delay: reduce ? 0 : 0.55, duration: 0.45, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* proof chips */}
        <motion.div {...chip(1.7)} className="absolute -left-2 -top-3 z-10 md:-left-3" key={`serp-${run}`}>
          <span className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-md" style={{ background: "rgba(12,12,15,0.92)", borderColor: "rgba(255,122,45,0.35)" }}>
            <GoogleG />
            {serp}
          </span>
        </motion.div>

        <motion.div {...chip(2.2)} className="absolute -bottom-3 left-3 z-10" key={`lh-${run}`}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 px-2.5 py-1.5 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-md" style={{ background: "rgba(12,12,15,0.92)" }}>
            <span
              className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold"
              style={{ background: `conic-gradient(${GREEN} 0 100%, #1d1d20 0)`, boxShadow: "inset 0 0 0 2.5px #0c0c0f" }}
            >
              <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-[#0c0c0f] text-white">100</span>
            </span>
            <span className="text-[11px] leading-tight text-white/70">{score}</span>
          </span>
        </motion.div>

        <motion.div {...chip(2.8, true)} className="absolute -bottom-3 right-3 z-10" key={`lead-${run}`}>
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)]"
            style={{ background: "rgba(10,18,12,0.94)", borderColor: "rgba(52,210,123,0.45)" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ background: GREEN }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} />
            </span>
            {t("lead")}
          </span>
        </motion.div>
      </div>

      <div className="mt-auto">
        <MetricsRow metrics={metrics} accent={AMBER} />
      </div>
    </div>
  );
}

export function SlowVsFastRace() {
  const t = useTranslations("services.websites.pain.vs");
  const th = useTranslations("services.websites.hero.mock");
  const ts = useTranslations("services.websites.demo.site");
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0);

  const oldMetrics = t.raw("oldMetrics") as Metric[];
  const newMetrics = t.raw("newMetrics") as Metric[];

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setStarted(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0A0A0B] p-5 pb-7 pt-14 md:p-8 md:pb-9 md:pt-8"
    >
      {/* amber aurora + dot grid, matching the case-cover stage */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 44% at 78% 0%, rgba(255,122,45,0.14), transparent 70%), radial-gradient(40% 34% at 12% 100%, rgba(255,122,45,0.08), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative grid gap-9 md:grid-cols-2 md:gap-6 lg:gap-8">
        <div key={`slow-${run}`} className="contents">
          <SlowCard started={started} reduce={reduce} metrics={oldMetrics} t={t} />
        </div>
        <FastCard
          started={started}
          reduce={reduce}
          run={run}
          metrics={newMetrics}
          t={t}
          serp={th("serp")}
          score={th("score")}
          url={ts("url")}
        />
      </div>

      {!reduce && (
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="absolute right-4 top-4 z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[11.5px] font-medium text-white/60 transition-colors hover:text-white md:right-5 md:top-5"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 12a9 9 0 1 1-2.6-6.4" />
            <path d="M21 3v6h-6" />
          </svg>
          {t("replay")}
        </button>
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

/* Side-by-side loading race: a typical slow site against ours. The slow one
   never finishes — the visitor bails at ~3s; the fast one paints in 0.8s and
   catches a lead. Restarts via the replay button (remount by key). */

type Metric = { v: string; l: string };

const AMBER = "#FF7A2D";
const GREEN = "#34d27b";
const RED = "#FF5F57";

function Chrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-[20px] border border-white/10"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015))",
        boxShadow: "0 30px 70px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <header className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-[8px] w-[8px] rounded-full bg-[#FF5F57]" />
          <span className="h-[8px] w-[8px] rounded-full bg-[#FEBC2E]" />
          <span className="h-[8px] w-[8px] rounded-full bg-[#28C840]" />
        </span>
        <span className="ml-1 truncate text-[11px] font-medium text-white/50">{url}</span>
      </header>
      {children}
    </div>
  );
}

function SkeletonRow({ w, h = 8 }: { w: string; h?: number }) {
  return (
    <span
      className="block animate-pulse rounded-full bg-white/[0.09]"
      style={{ width: w, height: h }}
    />
  );
}

function SlowCard({ label, url, metrics, bounce, loading, started, reduce }: {
  label: string;
  url: string;
  metrics: Metric[];
  bounce: string;
  loading: string;
  started: boolean;
  reduce: boolean;
}) {
  const gone = { opacity: 1, scale: 1 };
  return (
    <div className="relative flex h-full flex-col">
      <p className="mb-3 flex items-center gap-2 text-[12.5px] font-medium text-white/55">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: RED }} />
        {label}
      </p>
      <motion.div
        animate={started && !reduce ? { opacity: [1, 1, 0.55] } : { opacity: reduce ? 0.55 : 1 }}
        transition={{ duration: 3.4, times: [0, 0.9, 1], ease: "easeOut" }}
        className="flex-1"
      >
        <Chrome url={url}>
          {/* stuck progress bar */}
          <div className="h-[3px] w-full bg-white/[0.06]">
            <motion.div
              className="h-full"
              style={{ background: RED, opacity: 0.8 }}
              initial={{ width: reduce ? "58%" : "0%" }}
              animate={started ? { width: "58%" } : undefined}
              transition={{ duration: 4.6, ease: [0.1, 0.6, 0.3, 1] }}
            />
          </div>
          {/* skeleton that never resolves */}
          <div className="flex-1 space-y-3 p-5">
            <div className="flex items-center gap-2.5">
              <span className="h-6 w-6 animate-pulse rounded-lg bg-white/[0.09]" />
              <SkeletonRow w="34%" h={7} />
            </div>
            <div className="pt-3">
              <SkeletonRow w="76%" h={11} />
              <div className="mt-2.5"><SkeletonRow w="52%" h={11} /></div>
              <div className="mt-4 space-y-2">
                <SkeletonRow w="88%" h={6} />
                <SkeletonRow w="64%" h={6} />
              </div>
              <span className="mt-5 block h-8 w-28 animate-pulse rounded-full bg-white/[0.09]" />
            </div>
            <p className="flex items-center gap-2 pt-2 text-[11px] text-white/35">
              <span className="h-3 w-3 animate-spin rounded-full border border-white/25 border-t-transparent" />
              {loading}
            </p>
          </div>
        </Chrome>
      </motion.div>

      {/* visitor bails */}
      <motion.div
        className="absolute right-3 top-11 z-10"
        initial={reduce ? gone : { opacity: 0, scale: 0.85 }}
        animate={started ? gone : undefined}
        transition={{ delay: reduce ? 0 : 3.1, duration: 0.35, ease: "backOut" }}
      >
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)]"
          style={{ background: "rgba(20,10,10,0.92)", borderColor: "rgba(255,95,87,0.45)" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
          {bounce}
        </span>
      </motion.div>

      <MetricsRow metrics={metrics} accent={RED} muted />
    </div>
  );
}

function FastCard({ label, url, metrics, lead, started, reduce }: {
  label: string;
  url: string;
  metrics: Metric[];
  lead: string;
  started: boolean;
  reduce: boolean;
}) {
  const show = (delay: number) => ({
    initial: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 7 },
    animate: started ? { opacity: 1, y: 0 } : undefined,
    transition: { delay: reduce ? 0 : delay, duration: 0.4, ease: "easeOut" as const },
  });
  return (
    <div className="relative flex h-full flex-col">
      <p className="mb-3 flex items-center gap-2 text-[12.5px] font-medium text-white/85">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} />
        {label}
      </p>
      <div className="relative flex-1">
        <Chrome url={url}>
          <div className="h-[3px] w-full bg-white/[0.06]">
            <motion.div
              className="h-full"
              style={{ background: `linear-gradient(90deg, ${AMBER}, ${GREEN})` }}
              initial={{ width: reduce ? "100%" : "0%" }}
              animate={started ? { width: "100%" } : undefined}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <div className="flex-1 p-5">
            <motion.div {...show(0.5)} className="flex items-center gap-2.5">
              <span className="grid h-6 w-6 place-items-center rounded-lg text-[11px] font-bold text-[#0a0a0a]" style={{ background: AMBER }}>
                A
              </span>
              <span className="h-[7px] w-[34%] rounded-full bg-white/30" />
              <span className="ml-auto h-6 w-16 rounded-full" style={{ background: AMBER, opacity: 0.9 }} />
            </motion.div>
            <motion.div {...show(0.72)} className="pt-6">
              <span className="block h-[11px] w-[78%] rounded-full bg-white/90" />
              <span className="mt-2.5 block h-[11px] w-[50%] rounded-full bg-white/60" />
              <span className="mt-4 block h-[6px] w-[86%] rounded-full bg-white/[0.18]" />
              <span className="mt-2 block h-[6px] w-[62%] rounded-full bg-white/[0.18]" />
            </motion.div>
            <motion.div {...show(0.9)} className="mt-5 flex items-center gap-3">
              <span className="grid h-8 w-28 place-items-center rounded-full text-[11px] font-semibold text-white" style={{ background: `linear-gradient(160deg, ${AMBER}, #E8590C)` }} />
              <span className="h-8 w-20 rounded-full border border-white/15" />
            </motion.div>
          </div>
        </Chrome>

        {/* lead comes in */}
        <motion.div
          className="absolute -bottom-3 right-3 z-10"
          initial={reduce ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 8 }}
          animate={started ? { opacity: 1, scale: 1, y: 0 } : undefined}
          transition={{ delay: reduce ? 0 : 2, type: "spring", stiffness: 320, damping: 20 }}
        >
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8)]"
            style={{ background: "rgba(10,18,12,0.92)", borderColor: "rgba(52,210,123,0.45)" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ background: GREEN }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} />
            </span>
            {lead}
          </span>
        </motion.div>
      </div>

      <MetricsRow metrics={metrics} accent={AMBER} />
    </div>
  );
}

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

export function SlowVsFastRace() {
  const t = useTranslations("services.websites.pain.vs");
  const tRaw = useTranslations("services.websites.pain");
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);
  const [run, setRun] = useState(0);

  const oldMetrics = tRaw.raw("vs.oldMetrics") as Metric[];
  const newMetrics = tRaw.raw("vs.newMetrics") as Metric[];

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
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0A0A0B] p-5 pb-7 md:p-8 md:pb-9"
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

      <div key={run} className="relative grid gap-8 md:grid-cols-2 md:gap-6 lg:gap-8">
        <SlowCard
          label={t("oldLabel")}
          url={t("oldUrl")}
          metrics={oldMetrics}
          bounce={t("bounce")}
          loading={t("loading")}
          started={started}
          reduce={reduce}
        />
        <FastCard
          label={t("newLabel")}
          url={t("newUrl")}
          metrics={newMetrics}
          lead={t("lead")}
          started={started}
          reduce={reduce}
        />
      </div>

      {!reduce && (
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="absolute right-5 top-5 z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-3 py-1.5 text-[11.5px] font-medium text-white/60 transition-colors hover:text-white"
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

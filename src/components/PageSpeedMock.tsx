"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";

type PageBlock = {
  url: string;
  label: string;
  metrics: { fcp: string; lcp: string; tbt: string; cls: string; si: string };
};

const HOLD_PAGE_MS = 4200;

export function PageSpeedMock() {
  const t = useTranslations("work.caseShowcase.visionair.speed");
  const pages = useMemo(() => t.raw("pages") as PageBlock[], [t]);
  const tabs = t.raw("tabs") as { mobile: string; desktop: string };
  const categories = t.raw("categories") as {
    performance: string;
    accessibility: string;
    bestPractices: string;
    seo: string;
  };
  const metricLabels = t.raw("metricLabels") as {
    fcp: string;
    lcp: string;
    tbt: string;
    cls: string;
    si: string;
  };
  const metricsHeading = t("metricsHeading");
  const caption = t("captionTemplate");

  const [pageIndex, setPageIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      setPageIndex((i) => (i + 1) % pages.length);
      setCycle((c) => c + 1);
    }, HOLD_PAGE_MS);
    return () => clearTimeout(id);
  }, [pageIndex, pages.length]);

  const page = pages[pageIndex];

  return (
    <div
      className="relative mx-auto w-full max-w-[860px] overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgba(20,30,50,0.35),0_0_0_1px_rgba(0,0,0,0.06)]"
      style={{ background: "#ffffff" }}
    >
      {/* Browser frame */}
      <div
        className="flex items-center gap-3 border-b border-black/5 px-4 py-3"
        style={{ background: "#f1f3f4" }}
      >
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="mx-auto flex max-w-[420px] flex-1 items-center gap-2 rounded-full bg-white px-3 py-1 text-[12px] text-[#5f6368]">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 1 1 6 0v3H9z"
              fill="currentColor"
            />
          </svg>
          <span className="truncate">pagespeed.web.dev</span>
        </div>
        <div className="w-12" />
      </div>

      {/* PageSpeed header */}
      <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
        <div className="flex items-center gap-3">
          <PageSpeedLogo />
          <div>
            <div className="text-[15px] font-medium text-[#202124]">
              PageSpeed Insights
            </div>
            <div className="text-[12px] text-[#5f6368]">{page.url}</div>
          </div>
        </div>
        <div className="hidden items-center gap-1 rounded-full bg-[#f1f3f4] p-1 text-[12px] sm:flex">
          <TabPill label={tabs.mobile} active />
          <TabPill label={tabs.desktop} />
        </div>
      </div>

      {/* Page label strip */}
      <div className="border-b border-black/5 bg-[#fafbfc] px-6 py-2.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={pageIndex}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 text-[12.5px]"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#0cce6b]/15 text-[#0a8a4d]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="font-medium text-[#202124]">{page.label}</span>
            <span className="text-[#70757a]">— {caption.replace("{url}", page.url)}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scores */}
      <div className="px-6 py-7">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <ScoreGauge label={categories.performance} value={100} cycle={cycle} />
          <ScoreGauge label={categories.accessibility} value={100} cycle={cycle} />
          <ScoreGauge label={categories.bestPractices} value={100} cycle={cycle} />
          <ScoreGauge label={categories.seo} value={100} cycle={cycle} />
        </div>

        <div className="mt-8 border-t border-black/5 pt-6">
          <div className="text-[13px] font-medium uppercase tracking-wider text-[#5f6368]">
            {metricsHeading}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-5">
            <Metric label={metricLabels.fcp} value={page.metrics.fcp} cycle={cycle} delay={0} />
            <Metric label={metricLabels.lcp} value={page.metrics.lcp} cycle={cycle} delay={80} highlight />
            <Metric label={metricLabels.tbt} value={page.metrics.tbt} cycle={cycle} delay={160} />
            <Metric label={metricLabels.cls} value={page.metrics.cls} cycle={cycle} delay={240} />
            <Metric label={metricLabels.si} value={page.metrics.si} cycle={cycle} delay={320} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreGauge({
  label,
  value,
  cycle,
}: {
  label: string;
  value: number;
  cycle: number;
}) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    setAnimated(0);
    const start = performance.now();
    const dur = 1100;
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, cycle]);

  const r = 32;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - animated / 100);
  const tone =
    animated >= 90 ? "#0cce6b" : animated >= 50 ? "#ffa400" : "#ff4e42";

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative h-[88px] w-[88px]">
        <svg width="88" height="88" viewBox="0 0 80 80" className="-rotate-90">
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={`${tone}1a`}
            strokeWidth="6"
          />
          <circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={tone}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 60ms linear" }}
          />
        </svg>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[22px] font-medium tabular-nums" style={{ color: tone }}>
          {animated}
        </div>
      </div>
      <div className="mt-2 text-[13px] font-medium text-[#202124]">{label}</div>
    </div>
  );
}

function Metric({
  label,
  value,
  cycle,
  delay,
  highlight,
}: {
  label: string;
  value: string;
  cycle: number;
  delay: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      key={cycle}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      className={`flex flex-col gap-1 rounded-lg border p-3 ${
        highlight ? "border-[#0cce6b]/40 bg-[#0cce6b]/[0.04]" : "border-black/5 bg-white"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className="block h-2 w-2 rounded-full bg-[#0cce6b]" />
        <span className="text-[11px] uppercase tracking-wider text-[#5f6368]">
          {label}
        </span>
      </div>
      <div className="text-[18px] font-semibold tabular-nums text-[#202124]">
        {value}
      </div>
    </motion.div>
  );
}

function TabPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 ${
        active ? "bg-white text-[#202124] shadow-sm" : "text-[#5f6368]"
      }`}
    >
      {label}
    </span>
  );
}

function PageSpeedLogo() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "linear-gradient(135deg, #0cce6b 0%, #0a8a4d 100%)" }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2a10 10 0 1 0 10 10"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M12 12L16 8"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="12" cy="12" r="1.5" fill="white" />
      </svg>
    </div>
  );
}

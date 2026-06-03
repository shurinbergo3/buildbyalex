"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/* Advertising service demo. A faux Google Ads / Meta Ads "cabinet": KPI tiles,
   a campaign table, and a live feed of incoming leads streaming in — the visual
   answer to "where does every euro go and how many leads does it bring". Owns
   its own Section/heading so the service template can drop it in as one node. */

type Platform = "google" | "meta";

type Campaign = { name: string; spend: string; leads: string; cpl: string };
type PlatformData = {
  kpis: { spend: string; leads: string; cpl: string; roas: string };
  campaigns: Campaign[];
};
type FeedItem = { name: string; source: string; value: string };

const PLATFORM_TONE: Record<Platform, { dot: string; soft: string; ring: string }> = {
  google: { dot: "#4285F4", soft: "rgba(66,133,244,0.14)", ring: "rgba(66,133,244,0.45)" },
  meta: { dot: "#0866FF", soft: "rgba(8,102,255,0.14)", ring: "rgba(8,102,255,0.45)" },
};

const PLATFORM_HOLD_MS = 6400;
const LEAD_INTERVAL_MS = 2400;

export function AdsShowcase() {
  const t = useTranslations("services.ads.demo");
  const reduce = useReducedMotion();

  const tabs = t.raw("tabs") as Record<Platform, string>;
  const kpiLabels = t.raw("kpis") as { spend: string; leads: string; cpl: string; roas: string };
  const columns = t.raw("columns") as { campaign: string; spend: string; leads: string; cpl: string };
  const google = t.raw("google") as PlatformData;
  const meta = t.raw("meta") as PlatformData;
  const feed = t.raw("feed") as FeedItem[];
  const data: Record<Platform, PlatformData> = { google, meta };

  const [platform, setPlatform] = useState<Platform>("google");
  const [feedItems, setFeedItems] = useState<FeedItem[]>(() => feed.slice(0, 3));
  const [leadCount, setLeadCount] = useState(31);
  const feedCursor = useRef(3);

  // Auto-cycle the active platform tab (mouse/keyboard can still override).
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      setPlatform((p) => (p === "google" ? "meta" : "google"));
    }, PLATFORM_HOLD_MS);
    return () => clearInterval(id);
  }, [reduce]);

  // Stream new leads into the feed and tick the "leads today" counter.
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => {
      const next = feed[feedCursor.current % feed.length];
      feedCursor.current += 1;
      setFeedItems((prev) => [next, ...prev].slice(0, 4));
      setLeadCount((c) => c + 1);
    }, LEAD_INTERVAL_MS);
    return () => clearInterval(id);
  }, [feed, reduce]);

  const tone = PLATFORM_TONE[platform];
  const active = data[platform];

  return (
    <Section pad="default" tone="alt">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">
              {t("headline").split("\n").map((l, i) => (
                <span key={i} className="block">{l}</span>
              ))}
            </h2>
            <p className="mx-auto mt-5 max-w-[600px] t-body-lg">{t("subhead")}</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12 md:mt-16">
            <div
              className="relative mx-auto w-full max-w-[960px] overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.04)]"
              style={{ background: "#0f1620" }}
            >
              {/* Title bar + platform tabs */}
              <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3" style={{ background: "#161e2a" }}>
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="ml-2 flex items-center gap-1 rounded-lg bg-black/30 p-1">
                  {(["google", "meta"] as Platform[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPlatform(p)}
                      aria-pressed={platform === p}
                      className="relative rounded-md px-3 py-1 text-[12px] font-medium transition-colors"
                      style={{ color: platform === p ? "#fff" : "rgba(255,255,255,0.5)" }}
                    >
                      {platform === p && (
                        <motion.span
                          layoutId="ads-tab"
                          className="absolute inset-0 rounded-md"
                          style={{ background: PLATFORM_TONE[p].soft, boxShadow: `inset 0 0 0 1px ${PLATFORM_TONE[p].ring}` }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        />
                      )}
                      <span className="relative flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: PLATFORM_TONE[p].dot }} />
                        {tabs[p]}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-[11px] text-white/55">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34d399] opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34d399]" />
                  </span>
                  {t("liveLabel")}
                </div>
              </div>

              <div className="grid gap-0 md:grid-cols-[1fr_240px]">
                {/* Left: KPIs + campaign table */}
                <div className="min-w-0 p-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={platform}
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* KPI tiles */}
                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                        <Kpi label={kpiLabels.spend} value={active.kpis.spend} />
                        <Kpi label={kpiLabels.leads} value={active.kpis.leads} accent={tone.dot} />
                        <Kpi label={kpiLabels.cpl} value={active.kpis.cpl} />
                        <Kpi label={kpiLabels.roas} value={active.kpis.roas} accent="#34d399" />
                      </div>

                      {/* Campaign table */}
                      <div className="mt-5 overflow-hidden rounded-xl border border-white/5">
                        <div
                          className="grid grid-cols-[1fr_64px_56px_56px] gap-2 px-3.5 py-2 text-[10.5px] font-medium uppercase tracking-wider text-white/40"
                          style={{ background: "rgba(255,255,255,0.02)" }}
                        >
                          <span>{columns.campaign}</span>
                          <span className="text-right">{columns.spend}</span>
                          <span className="text-right">{columns.leads}</span>
                          <span className="text-right">{columns.cpl}</span>
                        </div>
                        {active.campaigns.map((c) => (
                          <div
                            key={c.name}
                            className="grid grid-cols-[1fr_64px_56px_56px] items-center gap-2 border-t border-white/5 px-3.5 py-2.5 text-[12.5px]"
                          >
                            <span className="flex min-w-0 items-center gap-2 text-white/85">
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: tone.dot }} />
                              <span className="truncate">{c.name}</span>
                            </span>
                            <span className="text-right tabular-nums text-white/60">{c.spend}</span>
                            <span className="text-right tabular-nums font-medium text-white">{c.leads}</span>
                            <span className="text-right tabular-nums text-white/60">{c.cpl}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Right: live lead feed */}
                <div className="border-t border-white/5 p-5 md:border-l md:border-t-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-white/45">
                      {t("feedLabel")}
                    </span>
                    <span className="rounded-full bg-[#34d399]/15 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-[#34d399]">
                      {leadCount}
                    </span>
                  </div>
                  <ul className="mt-3 flex flex-col gap-2">
                    <AnimatePresence initial={false} mode="popLayout">
                      {feedItems.map((item, i) => (
                        <motion.li
                          key={`${item.name}-${leadCount - i}`}
                          layout
                          initial={reduce ? false : { opacity: 0, x: 16, scale: 0.96 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                          transition={{ type: "spring", stiffness: 320, damping: 28 }}
                          className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-[12.5px] font-medium text-white/90">{item.name}</span>
                            <span className="shrink-0 text-[11.5px] font-semibold tabular-nums text-[#34d399]">{item.value}</span>
                          </div>
                          <div className="mt-0.5 truncate text-[11px] text-white/45">{item.source}</div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
      <div className="text-[10.5px] uppercase tracking-wider text-white/40">{label}</div>
      <div
        className="mt-1 text-[19px] font-semibold tabular-nums tracking-[-0.01em]"
        style={{ color: accent ?? "#fff" }}
      >
        {value}
      </div>
    </div>
  );
}

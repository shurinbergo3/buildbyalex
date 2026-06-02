"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";

const STAGE_HOLD_MS = 1600;
const LOOP_PAUSE_MS = 1800;

const STAGE_TONES = [
  { dot: "#94a3b8", bar: "#475569" }, // slate — new lead
  { dot: "#60a5fa", bar: "#2563eb" }, // blue — qualifying
  { dot: "#a78bfa", bar: "#7c3aed" }, // violet — call booked
  { dot: "#fbbf24", bar: "#d97706" }, // amber — proposal
  { dot: "#34d399", bar: "#059669" }, // emerald — won
];

const STATIC_CARDS: { stage: number; name: string; amount: string }[] = [
  { stage: 0, name: "Igor R.", amount: "€1.2k" },
  { stage: 0, name: "Anna T.", amount: "€3.5k" },
  { stage: 1, name: "Pavel S.", amount: "€900" },
  { stage: 2, name: "Lena V.", amount: "€4.8k" },
  { stage: 3, name: "Tomek W.", amount: "€2.1k" },
  { stage: 4, name: "Olga D.", amount: "€5.6k" },
  { stage: 4, name: "Mark B.", amount: "€1.9k" },
];

export function CRMFunnelMock() {
  const t = useTranslations("home.crmFunnel");
  const stages = t.raw("stages") as string[];
  const browserTitle = t("browserTitle");
  const dealName = t("deal.name");
  const dealAmount = t("deal.amount");
  const dealTag = t("deal.tag");

  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(() => !cancelled && fn(), delay);
      timers.push(id);
    };

    const run = () => {
      setActiveStage(0);
      stages.forEach((_, i) => {
        if (i === 0) return;
        schedule(() => setActiveStage(i), i * STAGE_HOLD_MS);
      });
      schedule(run, stages.length * STAGE_HOLD_MS + LOOP_PAUSE_MS);
    };
    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [stages]);

  return (
    <div className="relative mx-auto w-full max-w-[940px]">
      {/* Browser frame */}
      <div
        className="relative overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.04)]"
        style={{
          background: "#0f1620",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-3 border-b border-white/5 px-4 py-3"
          style={{ background: "#161e2a" }}
        >
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <div
            className="mx-auto flex max-w-[420px] flex-1 items-center gap-2 rounded-md px-3 py-1 text-[12px] text-white/60"
            style={{ background: "#0c121a" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 1 1 6 0v3H9z"
                fill="currentColor"
              />
            </svg>
            <span className="truncate">{browserTitle}</span>
          </div>
          <div className="w-12" />
        </div>

        {/* CRM toolbar */}
        <div
          className="flex items-center justify-between border-b border-white/5 px-5 py-3"
          style={{ background: "#0f1620" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#3b82f6] to-[#1e40af] text-[11px] font-bold text-white">
              A
            </div>
            <span className="text-[13px] font-medium text-white/90">
              {browserTitle.split("·")[1]?.trim() || "Pipeline"}
            </span>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <div className="h-6 w-32 rounded-md bg-white/[0.04]" />
            <div className="h-6 w-6 rounded-md bg-white/[0.04]" />
            <div className="h-6 w-6 rounded-md bg-white/[0.04]" />
          </div>
        </div>

        {/* Kanban */}
        <div
          className="relative overflow-x-auto px-3 py-4 sm:px-4"
          style={{
            background:
              "linear-gradient(180deg, #0f1620 0%, #0b1018 100%)",
            scrollSnapType: "x mandatory",
          }}
        >
          <div
            className="grid gap-2 sm:gap-3"
            style={{
              gridTemplateColumns: `repeat(${stages.length}, minmax(132px, 1fr))`,
            }}
          >
            {stages.map((stage, i) => {
              const tone = STAGE_TONES[i] ?? STAGE_TONES[0];
              const isActive = activeStage === i;
              return (
                <div
                  key={stage}
                  className="flex min-w-0 flex-col gap-2.5"
                  style={{ scrollSnapAlign: "start" }}
                >
                  {/* Column header */}
                  <div className="flex flex-col gap-2 px-1">
                    <div
                      className="h-[3px] w-full rounded-full transition-colors duration-500"
                      style={{
                        background: isActive ? tone.bar : `${tone.bar}55`,
                      }}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ background: tone.dot }}
                        />
                        <span className="truncate text-[11px] font-medium uppercase tracking-wider text-white/70">
                          {stage}
                        </span>
                      </div>
                      <span className="text-[10px] tabular-nums text-white/40">
                        {countForStage(i, isActive)}
                      </span>
                    </div>
                  </div>

                  {/* Column body — relative so the floating active card can sit inside.
                      Fixed min height holds the tallest possible stack (2 static + 1 active)
                      so the kanban doesn't jump as the active card moves. */}
                  <div className="relative flex min-h-[252px] flex-col gap-2">
                    {STATIC_CARDS.filter((c) => c.stage === i).map((c, idx) => (
                      <StaticCard
                        key={`${stage}-${idx}`}
                        name={c.name}
                        amount={c.amount}
                      />
                    ))}

                    {isActive && (
                      <motion.div
                        layoutId="active-deal"
                        transition={{
                          duration: 0.7,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="relative"
                      >
                        <ActiveCard
                          name={dealName}
                          amount={dealAmount}
                          tag={dealTag}
                          tone={tone}
                          stageIndex={i}
                          totalStages={stages.length}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function countForStage(i: number, isActive: boolean) {
  const base = STATIC_CARDS.filter((c) => c.stage === i).length;
  return base + (isActive ? 1 : 0);
}

function StaticCard({ name, amount }: { name: string; amount: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.025] p-2.5">
      <div className="text-[11.5px] font-medium text-white/70">{name}</div>
      <div className="mt-1 text-[10.5px] tabular-nums text-white/40">
        {amount}
      </div>
    </div>
  );
}

function ActiveCard({
  name,
  amount,
  tag,
  tone,
  stageIndex,
  totalStages,
}: {
  name: string;
  amount: string;
  tag: string;
  tone: { dot: string; bar: string };
  stageIndex: number;
  totalStages: number;
}) {
  const progress = ((stageIndex + 1) / totalStages) * 100;
  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0.6 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-lg border p-2.5"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        borderColor: `${tone.bar}80`,
        boxShadow: `0 0 0 1px ${tone.bar}30, 0 6px 24px -8px ${tone.bar}66`,
      }}
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-lg opacity-60"
        style={{
          background: `radial-gradient(60% 80% at 50% 0%, ${tone.dot}26, transparent 70%)`,
        }}
      />
      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-semibold text-white">
            {name}
          </div>
          <div className="mt-0.5 text-[11px] tabular-nums text-white/70">
            {amount}
          </div>
        </div>
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
          style={{ background: `${tone.bar}30` }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18l6-6-6-6"
              stroke={tone.dot}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <div className="relative mt-2 flex items-center gap-1.5">
        <span
          className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider"
          style={{
            background: `${tone.bar}1f`,
            color: tone.dot,
          }}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
            <path d="m3 11 18-7-3 17-6-4-2 5-2-7-5-4Z" />
          </svg>
          {tag}
        </span>
      </div>
      <div className="relative mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{ background: tone.bar }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

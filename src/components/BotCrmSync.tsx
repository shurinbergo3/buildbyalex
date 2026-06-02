"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";

/* ────────────────────────────────────────────────────────────────────────
   Unified live demo: the bot qualifies a lead in Telegram (left) and, in
   lockstep, the deal advances through the AmoCRM pipeline while every answer
   auto-fills a CRM field (right). One timeline drives both panels, loops.
   ──────────────────────────────────────────────────────────────────────── */

type Sender = "bot" | "prospect";
type FieldKey = "source" | "revenue" | "crm" | "fit";

/** Per-message pacing + the CRM side-effect that fires the moment it lands. */
type Step = {
  typingMs: number;
  pauseMs: number;
  stage?: number; // advance the active deal to this pipeline stage
  field?: FieldKey; // capture this CRM field
};

const STEPS: Step[] = [
  { typingMs: 800, pauseMs: 950 }, //  0 bot — greeting (deal already in "New lead")
  { typingMs: 650, pauseMs: 650 }, //  1 prospect — "sure"
  { typingMs: 850, pauseMs: 750 }, //  2 bot — asks revenue
  { typingMs: 1100, pauseMs: 950, stage: 1, field: "revenue" }, // 3 prospect — answers
  { typingMs: 850, pauseMs: 750 }, //  4 bot — asks about CRM
  { typingMs: 1000, pauseMs: 900, field: "crm" }, // 5 prospect — "HubSpot"
  { typingMs: 1300, pauseMs: 950, stage: 2 }, // 6 bot — sends Calendly → Call booked
  { typingMs: 650, pauseMs: 1300, stage: 3, field: "fit" }, // 7 prospect — thanks → Proposal
];

const FINAL_STAGE_DELAY = 1300; // beat before the deal lands in "Won"
const LOOP_PAUSE_MS = 3200;

/** Demo data — values the bot extracts from the conversation. */
const FIELD_VALUES: Record<FieldKey, string> = {
  source: "Telegram",
  revenue: "$40k/mo",
  crm: "HubSpot",
  fit: "", // filled from translations (fitValue)
};

const FIELD_ORDER: FieldKey[] = ["source", "revenue", "crm", "fit"];

/** Background deals, so the board reads like a real, populated pipeline. */
const STATIC_CARDS: { stage: number; name: string; amount: string }[] = [
  { stage: 0, name: "Igor R.", amount: "$1.2k" },
  { stage: 1, name: "Pavel S.", amount: "$900" },
  { stage: 2, name: "Lena V.", amount: "$4.8k" },
  { stage: 3, name: "Tomek W.", amount: "$2.1k" },
  { stage: 4, name: "Olga D.", amount: "$5.6k" },
];

export function BotCrmSync() {
  const t = useTranslations("home.botSync");
  const tChat = useTranslations("home.botDemo");
  const tCrm = useTranslations("home.crmFunnel");

  const messages = useMemo(() => tChat.raw("messages") as string[], [tChat]);
  const stages = useMemo(() => tCrm.raw("stages") as string[], [tCrm]);
  const dealName = tCrm("deal.name");
  const dealAmount = tCrm("deal.amount");

  const fieldLabels: Record<FieldKey, string> = {
    source: t("fields.source"),
    revenue: t("fields.revenue"),
    crm: t("fields.crm"),
    fit: t("fields.fit"),
  };
  const fieldValues: Record<FieldKey, string> = { ...FIELD_VALUES, fit: t("fitValue") };

  const [visibleCount, setVisibleCount] = useState(0);
  const [typingFor, setTypingFor] = useState<Sender | null>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [captured, setCaptured] = useState<FieldKey[]>(["source"]);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (delay: number, fn: () => void) => {
      timers.push(setTimeout(() => !cancelled && fn(), delay));
    };

    // reset for this cycle
    setVisibleCount(0);
    setTypingFor(null);
    setActiveStage(0);
    setCaptured(["source"]);

    let cursor = 500;
    STEPS.forEach((step, i) => {
      const sender: Sender = i % 2 === 0 ? "bot" : "prospect";
      at(cursor, () => setTypingFor(sender));
      cursor += step.typingMs;
      at(cursor, () => {
        setTypingFor(null);
        setVisibleCount(i + 1);
        if (step.stage !== undefined) setActiveStage(step.stage);
        if (step.field) setCaptured((prev) => (prev.includes(step.field!) ? prev : [...prev, step.field!]));
      });
      cursor += step.pauseMs;
    });

    at(cursor + FINAL_STAGE_DELAY, () => setActiveStage(stages.length - 1));
    at(cursor + FINAL_STAGE_DELAY + LOOP_PAUSE_MS, () => setCycle((c) => c + 1));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [cycle, stages.length]);

  return (
    <div className="relative mx-auto w-full max-w-[1100px]">
      {/* Product stage */}
      <div
        className="relative overflow-hidden rounded-[28px] border border-white/10 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)]"
        style={{ background: "#0B0E13" }}
      >
        {/* Window chrome */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3" style={{ background: "#11151c" }}>
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="mx-auto flex items-center gap-2 rounded-full border border-white/[0.06] px-3 py-1 text-[11px] font-medium text-white/55" style={{ background: "#0b0e13" }}>
            <span>{t("chatLabel")}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[color:var(--c-accent)]">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{t("crmLabel")}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400/90">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Live
          </span>
        </div>

        {/* Two synced panels */}
        <div className="grid gap-px bg-white/[0.06] md:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <ChatPanel
            messages={messages}
            visibleCount={visibleCount}
            typingFor={typingFor}
            cycle={cycle}
            headerName={tChat("header.name")}
            headerStatus={tChat("header.status")}
          />
          <CrmPanel
            stages={stages}
            activeStage={activeStage}
            dealName={dealName}
            dealAmount={dealAmount}
            captured={captured}
            fieldLabels={fieldLabels}
            fieldValues={fieldValues}
            capturedLabel={t("captured")}
          />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── CHAT PANEL ───────────────────────── */

function ChatPanel({
  messages,
  visibleCount,
  typingFor,
  cycle,
  headerName,
  headerStatus,
}: {
  messages: string[];
  visibleCount: number;
  typingFor: Sender | null;
  cycle: number;
  headerName: string;
  headerStatus: string;
}) {
  return (
    <div className="flex min-w-0 flex-col" style={{ background: "#0e1621" }}>
      {/* Telegram header */}
      <div className="flex items-center gap-3 border-b border-black/40 px-4 py-3" style={{ background: "#17212b" }}>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #2ea6ea 0%, #1e88c8 100%)" }}
        >
          {headerName.replace(/[^A-Za-zА-Яа-яІіЇїЄєҐґ]/g, "").slice(0, 2).toUpperCase() || "CB"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-medium text-white">{headerName}</div>
          <div className="truncate text-[12px] text-[#7d8e9c]">{headerStatus}</div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="relative h-[360px] overflow-hidden px-3 py-3 md:h-[440px]"
        style={{ background: "radial-gradient(ellipse at top, rgba(46,87,121,0.18) 0%, transparent 55%), #0e1621" }}
      >
        <div className="flex h-full flex-col justify-end gap-1.5">
          <AnimatePresence initial={false}>
            {messages.slice(0, visibleCount).map((text, i) => (
              <Bubble key={`${cycle}-${i}`} sender={i % 2 === 0 ? "bot" : "prospect"} text={text} />
            ))}
            {typingFor && <TypingBubble key={`${cycle}-typing`} sender={typingFor} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Bubble({ sender, text }: { sender: Sender; text: string }) {
  const isBot = sender === "bot";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${isBot ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[82%] rounded-2xl px-3 py-1.5 text-[13.5px] leading-[1.35] text-white shadow-sm ${
          isBot ? "rounded-bl-[6px]" : "rounded-br-[6px]"
        }`}
        style={{ background: isBot ? "#182533" : "#2b5278" }}
      >
        {text}
      </div>
    </motion.div>
  );
}

function TypingBubble({ sender }: { sender: Sender }) {
  const isBot = sender === "bot";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isBot ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`flex items-center gap-1 rounded-2xl px-3 py-2 ${isBot ? "rounded-bl-[6px]" : "rounded-br-[6px]"}`}
        style={{ background: isBot ? "#182533" : "#2b5278" }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-white/65"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ───────────────────────── CRM PANEL ───────────────────────── */

function CrmPanel({
  stages,
  activeStage,
  dealName,
  dealAmount,
  captured,
  fieldLabels,
  fieldValues,
  capturedLabel,
}: {
  stages: string[];
  activeStage: number;
  dealName: string;
  dealAmount: string;
  captured: FieldKey[];
  fieldLabels: Record<FieldKey, string>;
  fieldValues: Record<FieldKey, string>;
  capturedLabel: string;
}) {
  return (
    <div className="flex min-w-0 flex-col" style={{ background: "#0B0E13" }}>
      {/* CRM header */}
      <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md" style={{ background: "rgba(255,122,45,0.16)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[color:var(--c-accent)]">
            <rect x="3" y="4" width="5" height="16" rx="1.4" fill="currentColor" opacity="0.9" />
            <rect x="9.5" y="4" width="5" height="11" rx="1.4" fill="currentColor" opacity="0.6" />
            <rect x="16" y="4" width="5" height="7" rx="1.4" fill="currentColor" opacity="0.35" />
          </svg>
        </div>
        <span className="text-[13px] font-medium text-white/85">CRM</span>
        <span className="text-white/25">·</span>
        <span className="text-[12px] text-white/45">Sales pipeline</span>
      </div>

      {/* Kanban */}
      <div className="relative flex-1 overflow-x-auto px-3 py-4" style={{ scrollSnapType: "x mandatory" }}>
        <div className="grid h-full gap-2 sm:gap-2.5" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(124px, 1fr))` }}>
          {stages.map((stage, i) => {
            const isActive = activeStage === i;
            const staticHere = STATIC_CARDS.filter((c) => c.stage === i);
            return (
              <div key={stage} className="flex min-w-0 flex-col gap-2.5" style={{ scrollSnapAlign: "start" }}>
                {/* Column header */}
                <div className="flex flex-col gap-2 px-0.5">
                  <div
                    className="h-[3px] w-full rounded-full transition-colors duration-500"
                    style={{ background: isActive ? "var(--c-accent)" : "rgba(255,255,255,0.10)" }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="truncate text-[10.5px] font-medium uppercase tracking-wider text-white/55">{stage}</span>
                    <span className="text-[10px] tabular-nums text-white/30">{staticHere.length + (isActive ? 1 : 0)}</span>
                  </div>
                </div>

                {/* Column body */}
                <div className="relative flex min-h-[300px] flex-col gap-2">
                  {staticHere.map((c, idx) => (
                    <div key={idx} className="rounded-lg border border-white/[0.05] bg-white/[0.025] p-2.5">
                      <div className="text-[11.5px] font-medium text-white/55">{c.name}</div>
                      <div className="mt-1 text-[10.5px] tabular-nums text-white/30">{c.amount}</div>
                    </div>
                  ))}

                  {isActive && (
                    <motion.div layout layoutId="sync-deal" transition={{ type: "spring", stiffness: 90, damping: 18 }}>
                      <ActiveDeal
                        name={dealName}
                        amount={dealAmount}
                        captured={captured}
                        fieldLabels={fieldLabels}
                        fieldValues={fieldValues}
                        capturedLabel={capturedLabel}
                        progress={((i + 1) / stages.length) * 100}
                        won={i === stages.length - 1}
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
  );
}

function ActiveDeal({
  name,
  amount,
  captured,
  fieldLabels,
  fieldValues,
  capturedLabel,
  progress,
  won,
}: {
  name: string;
  amount: string;
  captured: FieldKey[];
  fieldLabels: Record<FieldKey, string>;
  fieldValues: Record<FieldKey, string>;
  capturedLabel: string;
  progress: number;
  won: boolean;
}) {
  return (
    <motion.div
      className="relative overflow-hidden rounded-xl border p-3"
      style={{
        background: "linear-gradient(180deg, rgba(255,122,45,0.10) 0%, rgba(255,122,45,0.03) 100%)",
        borderColor: "rgba(255,122,45,0.45)",
        boxShadow: "0 0 0 1px rgba(255,122,45,0.18), 0 10px 30px -10px rgba(255,122,45,0.40)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12.5px] font-semibold text-white">{name}</div>
          <div className="mt-0.5 text-[11px] tabular-nums text-white/65">{amount}</div>
        </div>
        {won ? (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#34d399" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        ) : (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: "rgba(255,122,45,0.20)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="var(--c-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>

      {/* Captured fields — fill in as the conversation hits each one */}
      <div className="mt-2.5 flex flex-col gap-1.5">
        <AnimatePresence initial={false}>
          {FIELD_ORDER.filter((k) => captured.includes(k)).map((k) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-between gap-2 overflow-hidden"
            >
              <span className="flex items-center gap-1.5 text-[10.5px] text-white/45">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="shrink-0">
                  <path d="M5 13l4 4L19 7" stroke="var(--c-accent)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {fieldLabels[k]}
              </span>
              <span className="truncate text-[11px] font-medium text-white/85">{fieldValues[k]}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Source pill + progress */}
      <div className="mt-2.5 flex items-center gap-1.5">
        <span
          className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider"
          style={{ background: "rgba(255,122,45,0.14)", color: "var(--c-accent)" }}
        >
          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
            <path d="m3 11 18-7-3 17-6-4-2 5-2-7-5-4Z" />
          </svg>
          {capturedLabel}
        </span>
      </div>
      <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: won ? "#34d399" : "var(--c-accent)" }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

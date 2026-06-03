"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Container } from "@/components/Container";

/* ────────────────────────────────────────────────────────────────────────
   Scroll-driven "how we work" story. A tall section pins a device to the
   centre of the viewport; as you scroll, three chapters advance in lockstep —
   the chat fills, the CRM deal climbs the pipeline, fields capture themselves.
   Same visual language as BotCrmSync, but the timeline is your scroll wheel.
   ──────────────────────────────────────────────────────────────────────── */

type Chapter = { kicker: string; title: string; body: string };
type FieldKey = "source" | "revenue" | "crm" | "fit";

/** What the device shows at each chapter. */
const SCENES: { msgCount: number; stage: number; fields: FieldKey[] }[] = [
  { msgCount: 2, stage: 0, fields: ["source"] },
  { msgCount: 6, stage: 2, fields: ["source", "revenue", "crm"] },
  { msgCount: 8, stage: 4, fields: ["source", "revenue", "crm", "fit"] },
];

const FIELD_ORDER: FieldKey[] = ["source", "revenue", "crm", "fit"];
const RAW_VALUES: Record<Exclude<FieldKey, "fit">, string> = {
  source: "Telegram",
  revenue: "€40k/mo",
  crm: "HubSpot",
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function ScrollStory() {
  const tStory = useTranslations("home.scrollStory");
  const tDemo = useTranslations("home.botDemo");
  const tCrm = useTranslations("home.crmFunnel");
  const tSync = useTranslations("home.botSync");

  const chapters = tStory.raw("chapters") as Chapter[];
  const messages = tDemo.raw("messages") as string[];
  const stages = tCrm.raw("stages") as string[];
  const dealName = tCrm("deal.name");
  const dealAmount = tCrm("deal.amount");

  const fieldLabels: Record<FieldKey, string> = {
    source: tSync("fields.source"),
    revenue: tSync("fields.revenue"),
    crm: tSync("fields.crm"),
    fit: tSync("fields.fit"),
  };
  const fieldValues: Record<FieldKey, string> = { ...RAW_VALUES, fit: tSync("fitValue") };

  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.max(0, Math.min(chapters.length - 1, Math.floor(v * chapters.length)));
    setActive((cur) => (cur === idx ? cur : idx));
  });

  // Subtle scrubbed entrance — the device settles into place as the section locks.
  const deviceScale = useTransform(scrollYProgress, [0, 0.1], [0.95, 1]);
  const deviceOpacity = useTransform(scrollYProgress, [0, 0.06], [0.5, 1]);

  const scene = SCENES[active];
  const chapter = chapters[active];

  return (
    <section
      ref={ref}
      className="relative bg-[#08090c] text-white"
      style={{ height: `${chapters.length * 100 + 20}vh` }}
      aria-label={tStory("eyebrow")}
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* Ambient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[10%] top-1/2 h-[680px] w-[680px] -translate-y-1/2 rounded-full opacity-60 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(255,122,45,0.16) 0%, transparent 70%)" }}
        />

        <Container className="relative">
          <div className="grid items-center gap-7 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-16">
            {/* ── Chapter copy ── */}
            <div className="relative">
              <p className="t-eyebrow" style={{ color: "var(--c-accent)" }}>
                {tStory("eyebrow")}
              </p>

              <div className="relative mt-5 min-h-[150px] sm:mt-6 lg:min-h-[240px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      {chapter.kicker}
                    </span>
                    <h2 className="mt-3 text-[clamp(30px,3.4vw+14px,52px)] font-semibold leading-[1.05] tracking-[-0.025em]">
                      {chapter.title}
                    </h2>
                    <p className="mt-5 max-w-[420px] text-[17px] leading-[1.55] text-white/65">
                      {chapter.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress rail */}
              <div className="mt-8 flex items-center gap-3">
                {chapters.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${i + 1}`}
                    aria-current={i === active}
                    className="group relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/12"
                  >
                    <motion.span
                      className="absolute inset-0 origin-left rounded-full"
                      style={{ background: "var(--c-accent)" }}
                      initial={false}
                      animate={{ scaleX: i <= active ? 1 : 0, opacity: i <= active ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* ── Pinned device ── */}
            <motion.div
              style={reduce ? undefined : { scale: deviceScale, opacity: deviceOpacity }}
              className="will-change-transform"
            >
              <DeviceStage
                messages={messages}
                stages={stages}
                scene={scene}
                dealName={dealName}
                dealAmount={dealAmount}
                fieldLabels={fieldLabels}
                fieldValues={fieldValues}
                chatLabel={tSync("chatLabel")}
                crmLabel={tSync("crmLabel")}
                capturedLabel={tSync("captured")}
              />
            </motion.div>
          </div>
        </Container>
      </div>
    </section>
  );
}

/* ───────────────────────── DEVICE ───────────────────────── */

function DeviceStage({
  messages,
  stages,
  scene,
  dealName,
  dealAmount,
  fieldLabels,
  fieldValues,
  chatLabel,
  crmLabel,
  capturedLabel,
}: {
  messages: string[];
  stages: string[];
  scene: { msgCount: number; stage: number; fields: FieldKey[] };
  dealName: string;
  dealAmount: string;
  fieldLabels: Record<FieldKey, string>;
  fieldValues: Record<FieldKey, string>;
  chatLabel: string;
  crmLabel: string;
  capturedLabel: string;
}) {
  return (
    <div
      className="relative mx-auto w-full max-w-[680px] overflow-hidden rounded-[26px] border border-white/10 shadow-[0_50px_140px_-50px_rgba(0,0,0,0.85)]"
      style={{ background: "#0B0E13" }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3"
        style={{ background: "#11151c" }}
      >
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
        <div
          className="mx-auto flex items-center gap-2 rounded-full border border-white/[0.06] px-3 py-1 text-[11px] font-medium text-white/55"
          style={{ background: "#0b0e13" }}
        >
          <span>{chatLabel}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "var(--c-accent)" }}>
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{crmLabel}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400/90">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Live
        </span>
      </div>

      <div className="grid gap-px bg-white/[0.06] sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ChatPanel messages={messages} count={scene.msgCount} />
        <CrmPanel
          stages={stages}
          activeStage={scene.stage}
          fields={scene.fields}
          dealName={dealName}
          dealAmount={dealAmount}
          fieldLabels={fieldLabels}
          fieldValues={fieldValues}
          capturedLabel={capturedLabel}
        />
      </div>
    </div>
  );
}

/* ───────────────────────── CHAT ───────────────────────── */

function ChatPanel({ messages, count }: { messages: string[]; count: number }) {
  const shown = messages.slice(0, count);
  return (
    <div className="flex min-w-0 flex-col" style={{ background: "#0e1621" }}>
      <div
        className="relative h-[210px] overflow-hidden px-3 py-3 sm:h-[360px]"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(46,87,121,0.18) 0%, transparent 55%), #0e1621",
        }}
      >
        <div className="flex h-full flex-col justify-end gap-1.5">
          <AnimatePresence initial={false}>
            {shown.map((text, i) => (
              <Bubble key={i} bot={i % 2 === 0} text={text} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Bubble({ bot, text }: { bot: boolean; text: string }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, ease: EASE }}
      className={`flex ${bot ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[84%] rounded-2xl px-3 py-1.5 text-[13px] leading-[1.4] text-white shadow-sm ${
          bot ? "rounded-bl-[6px]" : "rounded-br-[6px]"
        }`}
        style={{ background: bot ? "#182533" : "#2b5278" }}
      >
        {text}
      </div>
    </motion.div>
  );
}

/* ───────────────────────── CRM ───────────────────────── */

function CrmPanel({
  stages,
  activeStage,
  fields,
  dealName,
  dealAmount,
  fieldLabels,
  fieldValues,
  capturedLabel,
}: {
  stages: string[];
  activeStage: number;
  fields: FieldKey[];
  dealName: string;
  dealAmount: string;
  fieldLabels: Record<FieldKey, string>;
  fieldValues: Record<FieldKey, string>;
  capturedLabel: string;
}) {
  const won = activeStage === stages.length - 1;
  const progress = ((activeStage + 1) / stages.length) * 100;

  return (
    <div className="flex min-w-0 flex-col" style={{ background: "#0B0E13" }}>
      <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-md" style={{ background: "rgba(255,122,45,0.16)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "var(--c-accent)" }}>
            <rect x="3" y="4" width="5" height="16" rx="1.4" fill="currentColor" opacity="0.9" />
            <rect x="9.5" y="4" width="5" height="11" rx="1.4" fill="currentColor" opacity="0.6" />
            <rect x="16" y="4" width="5" height="7" rx="1.4" fill="currentColor" opacity="0.35" />
          </svg>
        </div>
        <span className="text-[13px] font-medium text-white/85">CRM</span>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        {/* Pipeline rail */}
        <div className="flex flex-col gap-2">
          {stages.map((stage, i) => {
            const done = i < activeStage;
            const isActive = i === activeStage;
            return (
              <div key={stage} className="flex items-center gap-2.5">
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-500"
                  style={{
                    background: done || isActive ? "var(--c-accent)" : "rgba(255,255,255,0.10)",
                  }}
                >
                  {done && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="#0B0E13" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span
                  className="text-[11.5px] font-medium uppercase tracking-wider transition-colors duration-500"
                  style={{ color: isActive ? "#fff" : done ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)" }}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>

        {/* Deal card */}
        <div
          className="relative mt-auto overflow-hidden rounded-xl border p-3"
          style={{
            background: "linear-gradient(180deg, rgba(255,122,45,0.10) 0%, rgba(255,122,45,0.03) 100%)",
            borderColor: "rgba(255,122,45,0.45)",
            boxShadow: "0 0 0 1px rgba(255,122,45,0.18), 0 10px 30px -10px rgba(255,122,45,0.40)",
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-semibold text-white">{dealName}</div>
              <div className="mt-0.5 text-[11px] tabular-nums text-white/65">{dealAmount}</div>
            </div>
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
              style={{ background: won ? "rgba(52,211,153,0.20)" : "rgba(255,122,45,0.20)" }}
            >
              {won ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#34d399" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="var(--c-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </div>

          <div className="mt-2.5 flex flex-col gap-1.5">
            <AnimatePresence initial={false}>
              {FIELD_ORDER.filter((k) => fields.includes(k)).map((k) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, height: 0, y: -4 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.34, ease: EASE }}
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
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

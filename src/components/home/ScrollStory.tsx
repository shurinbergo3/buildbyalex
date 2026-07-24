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

const MSG_TIMES = ["12:04", "12:04", "12:05", "12:05", "12:06", "12:06", "12:07", "12:08"];

const EASE = [0.16, 1, 0.3, 1] as const;

const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")";

/** Ambient light mix per chapter: Telegram-blue → accent-orange → deal-green. */
const AMBIENT: { blue: number; orange: number; green: number }[] = [
  { blue: 0.9, orange: 0.45, green: 0 },
  { blue: 0.35, orange: 1, green: 0 },
  { blue: 0.2, orange: 0.5, green: 0.85 },
];

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
  const headerName = tDemo("header.name");
  const headerStatus = tDemo("header.status");
  const todayLabel = tDemo("today");

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
      data-cv-off=""
      className="relative bg-[#08090c] text-white"
      style={{ height: `${chapters.length * 100 + 20}vh` }}
      aria-label={tStory("eyebrow")}
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        {/* Atmosphere */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* Vignetted base — lifts the centre off pure black */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 55% 42%, #0c0f15 0%, #08090c 55%, #050609 100%)",
            }}
          />

          {/* Faint cinematic backdrop — barely-there warm haze, blends into the black */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.22] mix-blend-screen"
            style={{
              backgroundImage: "url(/scroll-story-bg.webp)",
              maskImage:
                "radial-gradient(115% 100% at 62% 48%, #000 20%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(115% 100% at 62% 48%, #000 20%, transparent 100%)",
            }}
          />

          {/* Fine blueprint grid, fading out towards the edges */}
          <div
            className="absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage: "radial-gradient(70% 60% at 55% 45%, #000 0%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(70% 60% at 55% 45%, #000 0%, transparent 100%)",
            }}
          />

          {/* Chapter-reactive light fields */}
          <motion.div
            className="ss-drift absolute -left-[12%] top-[8%] h-[560px] w-[560px] rounded-full blur-[130px]"
            style={{ background: "radial-gradient(circle, rgba(46,166,234,0.11) 0%, transparent 70%)" }}
            initial={false}
            animate={{ opacity: AMBIENT[active].blue }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
          <motion.div
            className="ss-drift-slow absolute -right-[10%] top-[calc(50%-340px)] h-[680px] w-[680px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, rgba(255,122,45,0.17) 0%, transparent 70%)" }}
            initial={false}
            animate={{ opacity: AMBIENT[active].orange }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />
          <motion.div
            className="ss-drift absolute bottom-[-18%] right-[18%] h-[520px] w-[520px] rounded-full blur-[130px]"
            style={{ background: "radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 70%)" }}
            initial={false}
            animate={{ opacity: AMBIENT[active].green }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          />

          {/* Horizon beam behind the device */}
          <div
            className="absolute right-[4%] top-1/2 h-px w-[52%] -translate-y-1/2 blur-[1px]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,122,45,0.22) 45%, rgba(255,190,140,0.34) 60%, transparent 100%)",
            }}
          />

          {/* Grain */}
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{ backgroundImage: NOISE_BG }}
          />
        </div>

        <Container className="relative">
          <div className="grid items-center gap-4 sm:gap-7 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-16">
            {/* ── Chapter copy ── */}
            <div className="relative">
              <p className="t-eyebrow" style={{ color: "var(--c-accent)" }}>
                {tStory("eyebrow")}
              </p>
              <p className="mt-3 hidden max-w-[400px] text-[14px] leading-[1.5] text-white/55 sm:block sm:text-[15px]">
                {tStory("lead")}
              </p>

              <div className="relative mt-4 min-h-[118px] sm:mt-6 sm:min-h-[140px] lg:min-h-[230px]">
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
                    <h2 className="mt-2.5 text-[clamp(26px,3.4vw+14px,52px)] font-semibold leading-[1.05] tracking-[-0.025em] sm:mt-3">
                      {chapter.title}
                    </h2>
                    <p className="mt-3.5 max-w-[420px] text-[15px] leading-[1.5] text-white/65 sm:mt-5 sm:text-[17px] sm:leading-[1.55]">
                      {chapter.body}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress rail */}
              <div className="mt-5 flex items-center gap-3 sm:mt-8">
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
                headerName={headerName}
                headerStatus={headerStatus}
                todayLabel={todayLabel}
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
  headerName,
  headerStatus,
  todayLabel,
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
  headerName: string;
  headerStatus: string;
  todayLabel: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      {/* Halo under the device */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -bottom-14 top-1/3 blur-[90px]"
        style={{ background: "radial-gradient(55% 65% at 50% 85%, rgba(255,122,45,0.14) 0%, transparent 70%)" }}
      />

      {/* Bevel frame */}
      <div
        className="relative rounded-[28px] p-px"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.05) 32%, rgba(255,122,45,0.14) 100%)",
        }}
      >
        <div
          className="relative overflow-hidden rounded-[27px]"
          style={{
            background: "#0B0E13",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06), 0 60px 150px -50px rgba(0,0,0,0.9), 0 40px 110px -55px rgba(255,122,45,0.22)",
          }}
        >
          {/* Window chrome */}
          <div
            className="relative flex items-center gap-3 border-b border-white/[0.06] px-3.5 py-2.5 sm:px-4 sm:py-3"
            style={{ background: "linear-gradient(180deg, #131822 0%, #10141c 100%)" }}
          >
            <div className="flex gap-1.5">
              {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
                <span
                  key={c}
                  className="h-3 w-3 rounded-full"
                  style={{
                    background: c,
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -1px 1px rgba(0,0,0,0.3)",
                  }}
                />
              ))}
            </div>

            {/* Route pill: Telegram → CRM with a data stream */}
            <div
              className="mx-auto flex items-center gap-2 rounded-full border border-white/[0.08] px-2.5 py-1 text-[11px] font-medium text-white/60"
              style={{
                background: "linear-gradient(180deg, #0c0f15 0%, #090c11 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full"
                  style={{ background: "linear-gradient(135deg, #2ea6ea 0%, #1e88c8 100%)" }}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="#fff">
                    <path d="m3 11 18-7-3 17-6-4-2 5-2-7-5-4Z" />
                  </svg>
                </span>
                {chatLabel}
              </span>
              <span aria-hidden className="flex items-center gap-[3px] px-0.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="ss-flow-dot h-[3px] w-[3px] rounded-full"
                    style={{ background: "var(--c-accent)", animationDelay: `${i * 0.22}s` }}
                  />
                ))}
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-[5px]"
                  style={{ background: "rgba(255,122,45,0.18)" }}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" style={{ color: "var(--c-accent)" }}>
                    <rect x="3" y="4" width="5" height="16" rx="1.4" fill="currentColor" opacity="0.9" />
                    <rect x="9.5" y="4" width="5" height="11" rx="1.4" fill="currentColor" opacity="0.6" />
                    <rect x="16" y="4" width="5" height="7" rx="1.4" fill="currentColor" opacity="0.35" />
                  </svg>
                </span>
                {crmLabel}
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2 py-0.5 text-[10px] font-medium text-emerald-300/90">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Live
            </span>
          </div>

          <div className="grid gap-px bg-white/[0.06] sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <ChatPanel
              messages={messages}
              count={scene.msgCount}
              headerName={headerName}
              headerStatus={headerStatus}
              todayLabel={todayLabel}
            />
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

          {/* Glass sheen + grain */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[27px]"
            style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.045) 0%, transparent 28%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[27px] opacity-[0.05] mix-blend-overlay"
            style={{ backgroundImage: NOISE_BG }}
          />
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── CHAT ───────────────────────── */

function ChatPanel({
  messages,
  count,
  headerName,
  headerStatus,
  todayLabel,
}: {
  messages: string[];
  count: number;
  headerName: string;
  headerStatus: string;
  todayLabel: string;
}) {
  const shown = messages.slice(0, count);
  const botTyping = count < messages.length;
  const initials =
    headerName
      .replace(/[^A-Za-zА-Яа-яІіЇїЄєҐґ]/g, "")
      .slice(0, 2)
      .toUpperCase() || "CB";

  return (
    <div className="flex min-w-0 flex-col" style={{ background: "#0e1621" }}>
      {/* Telegram header */}
      <div
        className="flex items-center gap-2.5 border-b border-black/40 px-3.5 py-2.5"
        style={{ background: "linear-gradient(180deg, #1a2531 0%, #17212b 100%)" }}
      >
        <div className="relative shrink-0">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #2ea6ea 0%, #1e88c8 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            {initials}
          </div>
          <span className="absolute -bottom-px -right-px h-2.5 w-2.5 rounded-full border-2 border-[#17212b] bg-emerald-400" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-[13px] font-medium text-white">{headerName}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#2ea6ea" className="shrink-0">
              <path d="M12 2 9.6 4.3l-3.3-.4-.4 3.3L3.6 9.6 5 12l-1.4 2.4 2.3 2.4.4 3.3 3.3-.4L12 22l2.4-2.3 3.3.4.4-3.3 2.3-2.4L19 12l1.4-2.4-2.3-2.4-.4-3.3-3.3.4L12 2Zm-1.2 13.6-3-3 1.2-1.2 1.8 1.8 4.2-4.2 1.2 1.2-5.4 5.4Z" />
            </svg>
          </div>
          <div className="truncate text-[11px] text-[#5fa9d0]" style={{ color: "#6ab3f3" }}>
            {headerStatus}
          </div>
        </div>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/25">
          <circle cx="12" cy="5" r="1.7" fill="currentColor" />
          <circle cx="12" cy="12" r="1.7" fill="currentColor" />
          <circle cx="12" cy="19" r="1.7" fill="currentColor" />
        </svg>
      </div>

      {/* Messages */}
      <div
        className="relative h-[168px] overflow-hidden px-3 py-3 sm:h-[360px]"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(46,87,121,0.20) 0%, transparent 55%), #0e1621",
        }}
      >
        {/* Telegram-style pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.055) 1px, transparent 1.3px)",
            backgroundSize: "20px 20px",
            maskImage: "linear-gradient(180deg, transparent, #000 30%)",
            WebkitMaskImage: "linear-gradient(180deg, transparent, #000 30%)",
          }}
        />
        <div className="relative flex h-full flex-col justify-end gap-1.5">
          <div className="mb-1 flex justify-center">
            <span className="rounded-full bg-black/25 px-2.5 py-0.5 text-[10px] font-medium text-white/45">
              {todayLabel}
            </span>
          </div>
          <AnimatePresence initial={false}>
            {shown.map((text, i) => (
              <Bubble
                key={i}
                bot={i % 2 === 0}
                text={text}
                time={MSG_TIMES[i] ?? "12:08"}
                read={i < count - 1 || i % 2 !== 0}
              />
            ))}
            {botTyping && <TypingBubble key={`typing-${count}`} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex justify-start"
    >
      <div
        className="flex items-center gap-1 rounded-2xl rounded-bl-[6px] px-3 py-2"
        style={{
          background: "linear-gradient(180deg, #1d2c3c 0%, #17232f 100%)",
          border: "1px solid rgba(255,255,255,0.045)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-white/60"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function Bubble({ bot, text, time, read }: { bot: boolean; text: string; time: string; read: boolean }) {
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
        className={`max-w-[84%] rounded-2xl px-3 py-1.5 text-[13.5px] leading-[1.42] text-white sm:text-[13px] ${
          bot ? "rounded-bl-[6px]" : "rounded-br-[6px]"
        }`}
        style={
          bot
            ? {
                background: "linear-gradient(180deg, #1d2c3c 0%, #17232f 100%)",
                border: "1px solid rgba(255,255,255,0.045)",
                boxShadow: "0 2px 8px -2px rgba(0,0,0,0.35)",
              }
            : {
                background: "linear-gradient(135deg, #38689a 0%, #2b5278 100%)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 2px 10px -2px rgba(0,0,0,0.4)",
              }
        }
      >
        {text}
        <span className="float-right ml-2 mt-[8px] flex items-center gap-[3px] text-[9.5px] leading-none text-white/40">
          {time}
          {!bot && (
            <svg width="13" height="9" viewBox="0 0 18 12" fill="none" className="shrink-0">
              <path
                d="M1 6.5 4.2 10 11 2.5"
                stroke={read ? "#7fc4ef" : "rgba(255,255,255,0.4)"}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="m8 8.6 1.2 1.4L16 2.5"
                stroke={read ? "#7fc4ef" : "rgba(255,255,255,0.4)"}
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
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
  const railFrac = stages.length > 1 ? activeStage / (stages.length - 1) : 0;
  const initials = dealName
    .split(/[\s·.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

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
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-white/45">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="ss-spin" style={{ color: "var(--c-accent)" }}>
            <path
              d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Auto-sync
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-4 py-3 sm:gap-4 sm:py-4">
        {/* Pipeline — compact horizontal steps on phones, vertical rail from sm up */}
        <div className="sm:hidden">
          <div className="flex items-center">
            {stages.map((stage, i) => {
              const done = i < activeStage;
              const isActive = i === activeStage;
              return (
                <div key={stage} className={`flex items-center ${i < stages.length - 1 ? "flex-1" : ""}`}>
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${
                      isActive ? "ss-ring" : ""
                    }`}
                    style={{
                      background: done || isActive ? "var(--c-accent)" : "rgba(255,255,255,0.07)",
                      border: done || isActive ? "none" : "1px solid rgba(255,255,255,0.12)",
                      boxShadow: isActive ? "0 0 12px rgba(255,122,45,0.55)" : undefined,
                    }}
                  >
                    {done && (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13l4 4L19 7" stroke="#0B0E13" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </span>
                  {i < stages.length - 1 && (
                    <span
                      className="mx-1 h-px flex-1 transition-colors duration-500"
                      style={{
                        background: i < activeStage ? "rgba(255,122,45,0.7)" : "rgba(255,255,255,0.1)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div
            className="mt-2 text-[11.5px] font-medium uppercase tracking-wider text-white"
            style={{ textShadow: "0 0 18px rgba(255,140,70,0.45)" }}
          >
            {stages[activeStage]}
          </div>
        </div>

        <div className="relative hidden flex-col gap-2 sm:flex">
          <span aria-hidden className="absolute bottom-2 left-[7.5px] top-2 w-px bg-white/[0.08]" />
          <span
            aria-hidden
            className="absolute left-[7.5px] top-2 w-px transition-[height] duration-700 ease-out"
            style={{
              height: `calc((100% - 16px) * ${railFrac})`,
              background: "linear-gradient(180deg, rgba(255,150,80,0.9) 0%, rgba(255,122,45,0.35) 100%)",
            }}
          />
          {stages.map((stage, i) => {
            const done = i < activeStage;
            const isActive = i === activeStage;
            return (
              <div key={stage} className="relative flex items-center gap-2.5">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${
                    isActive ? "ss-ring" : ""
                  }`}
                  style={{
                    background: done || isActive ? "var(--c-accent)" : "rgba(255,255,255,0.07)",
                    border: done || isActive ? "none" : "1px solid rgba(255,255,255,0.12)",
                    boxShadow: isActive ? "0 0 12px rgba(255,122,45,0.55)" : undefined,
                  }}
                >
                  {done && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="#0B0E13" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                <span
                  className="text-[11.5px] font-medium uppercase tracking-wider transition-colors duration-500"
                  style={{
                    color: isActive ? "#fff" : done ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.28)",
                    textShadow: isActive ? "0 0 18px rgba(255,140,70,0.45)" : undefined,
                  }}
                >
                  {stage}
                </span>
              </div>
            );
          })}
        </div>

        {/* Deal card */}
        <div
          className="relative mt-auto overflow-hidden rounded-2xl border p-3 sm:p-3.5"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,122,45,0.12) 0%, rgba(255,122,45,0.03) 55%, rgba(255,255,255,0.01) 100%)",
            borderColor: "rgba(255,122,45,0.38)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(255,122,45,0.12), 0 18px 44px -18px rgba(255,122,45,0.5)",
          }}
        >
          <span
            aria-hidden
            className="absolute inset-x-5 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,190,140,0.55), transparent)" }}
          />

          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[11px] font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #ff8a3d 0%, #e05f10 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 10px -3px rgba(255,122,45,0.5)",
              }}
            >
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] font-semibold text-white">{dealName}</div>
              <div className="mt-0.5 text-[11px] tabular-nums text-white/60">{dealAmount}</div>
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

          <div className="mt-2.5 flex flex-col gap-[5px] sm:mt-3 sm:gap-[7px]">
            <AnimatePresence initial={false}>
              {FIELD_ORDER.filter((k) => fields.includes(k)).map((k) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, height: 0, y: -4 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.34, ease: EASE }}
                  className="flex items-baseline gap-1.5 overflow-hidden"
                >
                  <span className="flex shrink-0 items-center gap-1.5 text-[10.5px] text-white/45">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="shrink-0">
                      <path d="M5 13l4 4L19 7" stroke="var(--c-accent)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {fieldLabels[k]}
                  </span>
                  <span aria-hidden className="min-w-3 flex-1 -translate-y-[3px] border-b border-dotted border-white/[0.14]" />
                  <span className="truncate text-[11px] font-medium text-white/90">{fieldValues[k]}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 sm:mt-3">
            <span
              className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider"
              style={{
                background: "rgba(255,122,45,0.14)",
                color: "var(--c-accent)",
                boxShadow: "inset 0 0 0 1px rgba(255,122,45,0.22)",
              }}
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                <path d="m3 11 18-7-3 17-6-4-2 5-2-7-5-4Z" />
              </svg>
              {capturedLabel}
            </span>
          </div>
          <div className="relative mt-2 h-[4px] w-full overflow-hidden rounded-full bg-white/[0.07]">
            <motion.div
              className="relative h-full overflow-hidden rounded-full"
              style={{
                background: won
                  ? "linear-gradient(90deg, #2fbf8f 0%, #34d399 100%)"
                  : "linear-gradient(90deg, #ff7a2d 0%, #ffb37a 100%)",
              }}
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span
                aria-hidden
                className="ss-shimmer absolute inset-y-0 left-0 w-1/2"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)" }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

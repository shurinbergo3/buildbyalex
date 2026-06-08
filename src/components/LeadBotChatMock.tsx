"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";

type Sender = "bot" | "client";

type ScriptMessage = {
  sender: Sender;
  text: string;
  /** When this message lands, advance the events log to this cumulative count. */
  eventsTotal?: number;
};

type EventLogEntry = {
  time: string;
  label: string;
  detail?: string;
  tone?: "info" | "success" | "alert";
};

const TYPING_MS = 1400;
const SHORT_TYPING_MS = 1000;
const PAUSE_MS = 850;
const FIRST_PAUSE_MS = 1600;
const LOOP_PAUSE_MS = 7000;

function formatTime(offsetSeconds: number) {
  const base = new Date();
  base.setSeconds(base.getSeconds() + offsetSeconds);
  return base.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function LeadBotChatMock() {
  const t = useTranslations("work.caseShowcase.leadbot.chat.mock");

  const header = t.raw("header") as { name: string; status: string };
  const inputPlaceholder = t("input");
  const eventsTitle = t("eventsTitle");
  const eventsSubtitle = t("eventsSubtitle");

  const rawMessages = useMemo(
    () => t.raw("messages") as ScriptMessage[],
    [t],
  );
  const rawEvents = useMemo(
    () => t.raw("events") as EventLogEntry[],
    [t],
  );

  const [visibleCount, setVisibleCount] = useState(0);
  const [typingFor, setTypingFor] = useState<Sender | null>(null);
  const [visibleEvents, setVisibleEvents] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(() => !cancelled && fn(), delay);
      timers.push(id);
    };

    setVisibleCount(0);
    setTypingFor(null);
    setVisibleEvents(0);

    let cursor = 400;
    rawMessages.forEach((msg, i) => {
      const typingMs = i === 0 ? FIRST_PAUSE_MS : msg.sender === "bot" ? TYPING_MS : SHORT_TYPING_MS;
      schedule(() => setTypingFor(msg.sender), cursor);
      cursor += typingMs;
      schedule(() => {
        setTypingFor(null);
        setVisibleCount(i + 1);
      }, cursor);
      cursor += PAUSE_MS;

      if (typeof msg.eventsTotal === "number") {
        const target = Math.min(msg.eventsTotal, rawEvents.length);
        schedule(() => setVisibleEvents(target), cursor - 200);
      }
    });

    schedule(() => setVisibleEvents(rawEvents.length), cursor + 200);

    schedule(() => setCycle((c) => c + 1), cursor + LOOP_PAUSE_MS);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [cycle, rawMessages, rawEvents]);

  return (
    <div className="relative mx-auto w-full max-w-[1060px]">
      <div className="grid items-start gap-8 md:grid-cols-[360px_1fr] md:gap-10">
        {/* Telegram-style phone mock */}
        <div className="mx-auto w-full max-w-[360px]">
          <div
            className="relative rounded-[44px] p-[10px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]"
            style={{
              background:
                "linear-gradient(160deg, #1a1d24 0%, #0c0e12 55%, #1a1d24 100%)",
            }}
          >
            <div
              className="relative overflow-hidden rounded-[36px]"
              style={{
                height: 660,
                background:
                  "linear-gradient(180deg, #17212b 0%, #0e1621 100%)",
              }}
            >
              {/* Notch */}
              <div className="pointer-events-none absolute left-1/2 top-2 z-30 flex h-6 w-[110px] -translate-x-1/2 items-center justify-center rounded-b-2xl bg-black">
                <div className="h-1.5 w-12 rounded-full bg-[#2a2d33]" />
              </div>

              {/* Status bar */}
              <div className="relative z-20 flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-medium text-white/90">
                <span>{formatTime(0)}</span>
                <div className="flex items-center gap-1.5">
                  <SignalIcon />
                  <WifiIcon />
                  <BatteryIcon />
                </div>
              </div>

              {/* Header */}
              <div
                className="relative z-10 flex items-center gap-3 border-b border-black/40 px-3 py-2.5"
                style={{ background: "#17212b" }}
              >
                <button className="p-1 text-[#6ab3f3]" aria-label="Back">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #2ea6ea 0%, #1e88c8 100%)",
                  }}
                >
                  М
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[15px] font-medium text-white">
                      {header.name}
                    </span>
                  </div>
                  <div className="truncate text-[12px] text-[#7d8e9c]">
                    {typingFor === "bot" ? t("typingStatus") : header.status}
                  </div>
                </div>
                <button className="p-1.5 text-[#6ab3f3]" aria-label="Call">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                  </svg>
                </button>
              </div>

              {/* Chat area */}
              <div
                className="relative h-[482px] overflow-y-auto px-3 py-3"
                style={{
                  background:
                    "radial-gradient(ellipse at top, rgba(46,87,121,0.18) 0%, transparent 55%), #0e1621",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 14px), repeating-linear-gradient(-45deg, #fff 0 1px, transparent 1px 14px)",
                  }}
                  aria-hidden="true"
                />

                <div className="relative flex flex-col gap-1.5 pb-2">
                  <AnimatePresence initial={false}>
                    {rawMessages.slice(0, visibleCount).map((msg, i) => (
                      <Bubble
                        key={`${cycle}-${i}`}
                        sender={msg.sender}
                        text={msg.text}
                      />
                    ))}
                    {typingFor && (
                      <TypingBubble key={`${cycle}-typing`} sender={typingFor} />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Input bar */}
              <div
                className="relative z-10 flex items-center gap-2 border-t border-black/40 px-3 py-2.5"
                style={{ background: "#17212b" }}
              >
                <button className="p-1 text-[#7d8e9c]" aria-label="Attach">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 6v11.5a4 4 0 1 1-8 0V5a2.5 2.5 0 1 1 5 0v10.5a1 1 0 1 1-2 0V6H10v9.5a2.5 2.5 0 0 0 5 0V5a4 4 0 1 0-8 0v12.5a5.5 5.5 0 0 0 11 0V6h-1.5z" />
                  </svg>
                </button>
                <div className="flex-1 rounded-2xl bg-[#242f3d] px-3 py-1.5 text-[14px] text-[#7d8e9c]">
                  {inputPlaceholder}
                </div>
                <button className="p-1 text-[#7d8e9c]" aria-label="Voice">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z" />
                  </svg>
                </button>
              </div>

              {/* Home indicator */}
              <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-30 h-1 w-28 -translate-x-1/2 rounded-full bg-white/40" />
            </div>
          </div>
        </div>

        {/* Engine / event log */}
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-2xl border p-6 md:p-7"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background:
                "linear-gradient(180deg, #0c0e12 0%, #14181f 100%)",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[12px] uppercase tracking-[0.14em] text-[#ff8c3a]">
                  {eventsTitle}
                </div>
                <p className="mt-1.5 text-[13.5px] leading-snug text-white/55">
                  {eventsSubtitle}
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/65">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0cce6b] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0cce6b]" />
                </span>
                live
              </div>
            </div>

            {/* A hidden "ghost" of the full event list reserves the panel height up
                front, so it opens at its maximum size and never grows as events stream
                in — keeping the rest of the page from jumping while it animates. */}
            <div className="relative mt-6 grid">
              <ol aria-hidden className="invisible space-y-3.5 [grid-area:1/1]">
                {rawEvents.map((event, i) => (
                  <li
                    key={`ghost-evt-${i}`}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-3"
                  >
                    <EventDot tone={event.tone ?? "info"} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-3">
                        <span className="text-[13.5px] font-medium text-white">
                          {event.label}
                        </span>
                        <span className="ml-auto shrink-0 text-[11px] tabular-nums text-white/40">
                          {event.time}
                        </span>
                      </div>
                      {event.detail && (
                        <div className="mt-1 text-[12.5px] leading-snug text-white/55">
                          {event.detail}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              <ol className="space-y-3.5 [grid-area:1/1]">
                <AnimatePresence initial={false}>
                  {rawEvents.slice(0, visibleEvents).map((event, i) => (
                    <motion.li
                      key={`${cycle}-evt-${i}`}
                      layout
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-3"
                    >
                      <EventDot tone={event.tone ?? "info"} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline gap-3">
                          <span className="text-[13.5px] font-medium text-white">
                            {event.label}
                          </span>
                          <span className="ml-auto shrink-0 text-[11px] tabular-nums text-white/40">
                            {event.time}
                          </span>
                        </div>
                        {event.detail && (
                          <div className="mt-1 text-[12.5px] leading-snug text-white/55">
                            {event.detail}
                          </div>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>

                {visibleEvents === 0 && (
                  <li className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-center text-[12.5px] text-white/35">
                    {t("eventsIdle")}
                  </li>
                )}
              </ol>
            </div>
          </div>
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
        className={`relative max-w-[78%] whitespace-pre-line rounded-2xl px-3 py-1.5 text-[14.5px] leading-[1.4] text-white shadow-sm ${
          isBot ? "rounded-bl-[6px]" : "rounded-br-[6px]"
        }`}
        style={{
          background: isBot ? "#182533" : "#2b5278",
        }}
      >
        <span>{text}</span>
        <span className="ml-2 inline-flex translate-y-[2px] items-center gap-0.5 text-[10px] text-white/55">
          {formatTime(0)}
          {!isBot && (
            <svg width="14" height="10" viewBox="0 0 16 11" fill="none" className="text-[#6ab3f3]">
              <path d="M1 5.5L4 8.5L9.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6.5 8.5L15 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
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
        className={`flex items-center gap-1 rounded-2xl px-3 py-2 ${
          isBot ? "rounded-bl-[6px]" : "rounded-br-[6px]"
        }`}
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

function EventDot({ tone }: { tone: "info" | "success" | "alert" }) {
  const color =
    tone === "success" ? "#0cce6b" : tone === "alert" ? "#ff8c3a" : "#6ab3f3";
  return (
    <div className="relative mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
      <span
        className="absolute inset-0 rounded-full opacity-25"
        style={{ background: color }}
      />
      <span
        className="relative h-2 w-2 rounded-full"
        style={{ background: color, boxShadow: `0 0 12px ${color}` }}
      />
    </div>
  );
}

function SignalIcon() {
  return (
    <svg width="16" height="10" viewBox="0 0 18 10" fill="currentColor">
      <rect x="0" y="7" width="3" height="3" rx="0.5" />
      <rect x="5" y="5" width="3" height="5" rx="0.5" />
      <rect x="10" y="2" width="3" height="8" rx="0.5" />
      <rect x="15" y="0" width="3" height="10" rx="0.5" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="14" height="10" viewBox="0 0 16 11" fill="currentColor">
      <path d="M8 11a1.2 1.2 0 1 0 0-2.4A1.2 1.2 0 0 0 8 11zm-3.5-3.6l1.4 1.4a3 3 0 0 1 4.2 0l1.4-1.4a5 5 0 0 0-7 0zm-2.8-2.8L3.1 6a7 7 0 0 1 9.8 0l1.4-1.4a9 9 0 0 0-12.6 0z" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="24" height="11" viewBox="0 0 26 12" fill="none">
      <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" strokeOpacity="0.5" />
      <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" />
      <rect x="23.5" y="3.5" width="2" height="5" rx="1" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

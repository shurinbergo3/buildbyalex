"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";

type Sender = "bot" | "prospect";

type Message = {
  sender: Sender;
  text: string;
  /** ms to show typing indicator before this message appears */
  typingMs: number;
  /** ms to wait after this message before moving on */
  pauseMs: number;
};

const PACING: Pick<Message, "typingMs" | "pauseMs">[] = [
  { typingMs: 900, pauseMs: 1100 },
  { typingMs: 1100, pauseMs: 700 },
  { typingMs: 1000, pauseMs: 900 },
  { typingMs: 1600, pauseMs: 800 },
  { typingMs: 1200, pauseMs: 1000 },
  { typingMs: 1500, pauseMs: 800 },
  { typingMs: 1400, pauseMs: 1100 },
  { typingMs: 900, pauseMs: 1800 },
];

const LOOP_PAUSE_MS = 8000;

function formatTime(offsetSeconds: number) {
  const base = new Date();
  base.setSeconds(base.getSeconds() + offsetSeconds);
  return base.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function TelegramChatMock() {
  const t = useTranslations("home.botDemo");
  const headerName = t("header.name");
  const headerStatus = t("header.status");
  const inputPlaceholder = t("input");

  const script = useMemo<Message[]>(() => {
    const raw = t.raw("messages") as string[];
    return raw.map((text, i) => ({
      sender: (i % 2 === 0 ? "bot" : "prospect") as Sender,
      text,
      typingMs: PACING[i]?.typingMs ?? 1100,
      pauseMs: PACING[i]?.pauseMs ?? 900,
    }));
  }, [t]);

  const [visibleCount, setVisibleCount] = useState(0);
  const [typingFor, setTypingFor] = useState<Sender | null>(null);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
      timers.push(id);
    };

    setVisibleCount(0);
    setTypingFor(null);

    let cursor = 250;
    script.forEach((msg, i) => {
      schedule(() => setTypingFor(msg.sender), cursor);
      cursor += msg.typingMs;
      schedule(() => {
        setTypingFor(null);
        setVisibleCount(i + 1);
      }, cursor);
      cursor += msg.pauseMs;
    });

    schedule(() => setCycle((c) => c + 1), cursor + LOOP_PAUSE_MS);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [cycle, script]);

  return (
    <div className="relative mx-auto" style={{ width: 340 }}>
      {/* Phone frame */}
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
            height: 680,
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

          {/* Telegram header */}
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
              {headerName.replace(/[^A-Za-zА-Яа-яІіЇїЄєҐґ]/g, "").slice(0, 2).toUpperCase() || "CB"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-[15px] font-medium text-white">
                  {headerName}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="#6ab3f3"
                  aria-label="verified"
                >
                  <path d="M12 2l2.39 1.73 2.95-.18 1.13 2.73 2.45 1.66-.87 2.83.87 2.83-2.45 1.66-1.13 2.73-2.95-.18L12 22l-2.39-1.73-2.95.18-1.13-2.73-2.45-1.66.87-2.83-.87-2.83 2.45-1.66 1.13-2.73 2.95.18L12 2z" />
                  <path
                    d="M8.5 12.5l2.5 2.5 4.5-5"
                    stroke="#17212b"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="truncate text-[12px] text-[#7d8e9c]">
                {headerStatus}
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
            className="relative h-[502px] overflow-hidden px-3 py-3"
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

            <div className="relative flex h-full flex-col justify-end gap-1.5">
              <AnimatePresence initial={false}>
                {script.slice(0, visibleCount).map((msg, i) => (
                  <Bubble key={`${cycle}-${i}`} sender={msg.sender} text={msg.text} />
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
        className={`relative max-w-[78%] rounded-2xl px-3 py-1.5 text-[14.5px] leading-[1.35] text-white shadow-sm ${
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
            <svg
              width="14"
              height="10"
              viewBox="0 0 16 11"
              fill="none"
              className="text-[#6ab3f3]"
            >
              <path
                d="M1 5.5L4 8.5L9.5 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.5 8.5L15 2"
                stroke="currentColor"
                strokeWidth="1.5"
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
        style={{
          background: isBot ? "#182533" : "#2b5278",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-white/65"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
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
      <rect
        x="0.5"
        y="0.5"
        width="22"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeOpacity="0.5"
      />
      <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" />
      <rect x="23.5" y="3.5" width="2" height="5" rx="1" fill="currentColor" fillOpacity="0.5" />
    </svg>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AiCaseHero, HERO_ACCENT, HERO_ACCENT_HI } from "@/components/AiCaseHero";

/* ────────────────────────────────────────────────────────────────────────
   Donbrava hero — "Клиент не понимает, что это ИИ". A flat-on Telegram phone
   running a live qualify-to-payment loop from the owner's REAL account, ringed
   by glass telemetry chips that sell the human-mimicry (style mirrored, human
   pause, 24/7). The typing dots pulse amber — the product's signature beat.
   Chat copy is reused from the already-localized chat mock; chips from .hero.
   ──────────────────────────────────────────────────────────────────────── */

type Sender = "bot" | "client";
type ScriptMessage = { sender: Sender; text: string };
type Chip = { k: string; v: string };

const TYPING_BOT = 1300;
const TYPING_CLIENT = 950;
const PAUSE = 750;
const FIRST = 700;
const LOOP_PAUSE = 4200;
const MAX_MESSAGES = 5;

type HeroCopy = {
  industry: string;
  title: string;
  tagline: string;
  metrics: { value: string; label: string }[];
  stack: string[];
  ndaLabel: string;
  liveLabel: string;
};

export function DonbravaCaseHero(props: HeroCopy) {
  return (
    <AiCaseHero {...props}>
      <DonbravaPhone />
    </AiCaseHero>
  );
}

function DonbravaPhone() {
  const t = useTranslations("work.caseShowcase.donbrava");
  const tm = useTranslations("work.caseShowcase.donbrava.chat.mock");
  const reduce = useReducedMotion();

  const header = tm.raw("header") as { name: string; status: string };
  const typingStatus = tm("typingStatus");
  const account = t("hero.account");
  const payoff = t("hero.payoff");
  const chips = t.raw("hero.chips") as Chip[];

  const messages = useMemo(
    () => (tm.raw("messages") as ScriptMessage[]).slice(0, MAX_MESSAGES),
    [tm],
  );

  const [visible, setVisible] = useState(reduce ? messages.length : 0);
  const [typingFor, setTypingFor] = useState<Sender | null>(null);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduce) {
      setVisible(messages.length);
      return;
    }
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (d: number, fn: () => void) =>
      timers.push(setTimeout(() => !cancelled && fn(), d));

    setVisible(0);
    setTypingFor(null);

    let cursor = 400;
    messages.forEach((msg, i) => {
      const typing = i === 0 ? FIRST : msg.sender === "bot" ? TYPING_BOT : TYPING_CLIENT;
      at(cursor, () => setTypingFor(msg.sender));
      cursor += typing;
      at(cursor, () => {
        setTypingFor(null);
        setVisible(i + 1);
      });
      cursor += PAUSE;
    });
    at(cursor + LOOP_PAUSE, () => setCycle((c) => c + 1));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [cycle, messages, reduce]);

  return (
    <div className="relative mx-auto w-full max-w-[330px] pb-2 sm:max-w-[360px]">
      {/* warm floor glow grounding the phone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[6%] bottom-[2%] -z-10 h-[26%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(255,122,45,0.30), transparent 72%)",
          filter: "blur(14px)",
        }}
      />

      {/* floating telemetry chips */}
      <TelemetryChip
        chip={chips[0]}
        pulse
        className="-left-3 top-[16%] hidden sm:flex md:-left-8"
      />
      <TelemetryChip
        chip={chips[1]}
        className="-right-3 top-[40%] hidden sm:flex md:-right-9"
      />
      <TelemetryChip
        chip={chips[2]}
        className="-left-2 bottom-[20%] hidden sm:flex md:-left-7"
      />

      {/* phone */}
      <motion.div
        initial={false}
        animate={reduce ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-[40px] p-[9px] shadow-[0_40px_90px_-26px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.05)]"
        style={{
          background: "linear-gradient(160deg, #20242c 0%, #0c0e12 55%, #20242c 100%)",
        }}
      >
        <div
          className="relative overflow-hidden rounded-[32px]"
          style={{ height: 470, background: "linear-gradient(180deg, #17212b 0%, #0e1621 100%)" }}
        >
          {/* notch */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-30 flex h-5 w-[96px] -translate-x-1/2 items-center justify-center rounded-b-2xl bg-black">
            <div className="h-1.5 w-10 rounded-full bg-[#2a2d33]" />
          </div>

          {/* account pill */}
          <div className="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2 py-1 text-[9.5px] font-medium text-white/70 backdrop-blur-sm">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: HERO_ACCENT, boxShadow: `0 0 8px ${HERO_ACCENT}` }}
            />
            {account}
          </div>

          {/* header */}
          <div
            className="relative z-10 flex items-center gap-2.5 border-b border-black/40 px-3 pb-2.5 pt-9"
            style={{ background: "#17212b" }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #2ea6ea 0%, #1e88c8 100%)" }}
            >
              Б
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13.5px] font-medium text-white">{header.name}</div>
              <div
                className="truncate text-[11.5px]"
                style={{ color: typingFor === "bot" ? HERO_ACCENT_HI : "#7d8e9c" }}
              >
                {typingFor === "bot" ? typingStatus : header.status}
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#6ab3f3]">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
            </svg>
          </div>

          {/* chat */}
          <div
            className="relative h-[336px] overflow-hidden px-3 py-3"
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
                {messages.slice(0, visible).map((msg, i) => (
                  <Bubble key={`${cycle}-${i}`} sender={msg.sender} text={msg.text} />
                ))}
                {typingFor && <TypingBubble key={`${cycle}-typing`} sender={typingFor} />}
              </AnimatePresence>
            </div>
          </div>

          {/* input */}
          <div
            className="relative z-10 flex items-center gap-2 border-t border-black/40 px-3 py-2.5"
            style={{ background: "#17212b" }}
          >
            <div className="flex-1 rounded-2xl bg-[#242f3d] px-3 py-1.5 text-[12.5px] text-[#7d8e9c]">
              {tm("input")}
            </div>
            <span
              className="grid h-7 w-7 place-items-center rounded-full"
              style={{ background: `linear-gradient(135deg, ${HERO_ACCENT_HI}, ${HERO_ACCENT})` }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a160c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </span>
          </div>

          {/* home indicator */}
          <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-30 h-1 w-24 -translate-x-1/2 rounded-full bg-white/40" />
        </div>
      </motion.div>

      {/* payoff caption */}
      <p className="mt-5 text-center text-[12.5px] leading-snug text-white/45">
        {payoff}
      </p>
    </div>
  );
}

function TelemetryChip({ chip, pulse, className }: { chip: Chip; pulse?: boolean; className?: string }) {
  if (!chip) return null;
  return (
    <div
      className={`absolute z-20 flex items-center gap-2.5 rounded-2xl border border-white/[0.1] bg-white/[0.06] px-3 py-2 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md ${className ?? ""}`}
    >
      <span className="relative grid h-2 w-2 place-items-center">
        {pulse && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
            style={{ background: HERO_ACCENT }}
          />
        )}
        <span className="relative h-2 w-2 rounded-full" style={{ background: HERO_ACCENT, boxShadow: `0 0 8px ${HERO_ACCENT}` }} />
      </span>
      <span className="leading-tight">
        <span className="block text-[9.5px] uppercase tracking-[0.1em] text-white/45">{chip.k}</span>
        <span className="block text-[12px] font-semibold text-white">{chip.v}</span>
      </span>
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
        className={`max-w-[80%] whitespace-pre-line rounded-2xl px-3 py-1.5 text-[13px] leading-[1.38] text-white shadow-sm ${
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
            className="block h-1.5 w-1.5 rounded-full"
            style={{ background: isBot ? HERO_ACCENT_HI : "rgba(255,255,255,0.65)" }}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
          />
        ))}
      </div>
    </motion.div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";

type BotBubble = {
  type: "bot";
  intro: string;
  bullets?: string[];
  outro?: string;
  cta?: string;
};
type UserBubble = { type: "user"; text: string };
type Bubble = BotBubble | UserBubble;
type Scenario = { topic: string; exchanges: Bubble[] };

const USER_DELAY = 1500;
const BOT_TYPING_HOLD = 750;
const BOT_RESPONSE_HOLD = 1500;
const BOT_BULLET_EXTRA = 130;
const SCENARIO_HOLD = 5800;

export function LegalwinSiteChatMock() {
  const t = useTranslations("work.caseShowcase.legalwin.siteChat.widget");
  const scenarios = useMemo(
    () => t.raw("scenarios") as Scenario[],
    [t],
  );

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [botTyping, setBotTyping] = useState(false);

  const scenario = scenarios[scenarioIdx];
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages on every reveal
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [revealed, botTyping]);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => !cancelled && fn(), ms);
      timers.push(id);
    };

    setRevealed(0);
    setBotTyping(false);

    let cursor = 1100;
    for (let i = 0; i < scenario.exchanges.length; i++) {
      const b = scenario.exchanges[i];
      if (b.type === "user") {
        cursor += USER_DELAY;
        const target = i + 1;
        schedule(() => setRevealed(target), cursor);
      } else {
        cursor += 600;
        schedule(() => setBotTyping(true), cursor);
        cursor +=
          BOT_TYPING_HOLD +
          BOT_RESPONSE_HOLD +
          (b.bullets ? b.bullets.length * BOT_BULLET_EXTRA : 0);
        const target = i + 1;
        schedule(() => {
          setBotTyping(false);
          setRevealed(target);
        }, cursor);
      }
    }

    cursor += SCENARIO_HOLD;
    schedule(
      () => setScenarioIdx((idx) => (idx + 1) % scenarios.length),
      cursor,
    );

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [scenarioIdx, scenario, scenarios.length]);

  const visible = scenario.exchanges.slice(0, revealed);

  return (
    <div className="relative mx-auto w-full max-w-[1040px]">
      {/* ── Faux website backdrop ─────────────────────── */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0c1828] via-[#0a1422] to-[#101e2f] p-5 md:p-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]">
        <FauxWebsiteBackdrop />

        {/* ── Layout: faint editorial column + floating widget ── */}
        <div className="relative grid gap-6 md:grid-cols-[1fr_400px] md:gap-10">
          {/* Editorial faux column — hidden on mobile */}
          <div className="hidden md:flex flex-col justify-center pl-2">
            <p className="text-[11px] font-medium tracking-[0.18em] text-[#caa467]/80 uppercase">
              LegalWin · Warszawa
            </p>
            <h3
              className="mt-4 text-[clamp(40px,4vw+8px,64px)] font-semibold leading-[1.04] tracking-[-0.024em]"
              style={{
                fontFamily:
                  'ui-serif, "Iowan Old Style", "New York", Georgia, serif',
                background:
                  "linear-gradient(180deg, #f6e1b3 0%, #caa467 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
            >
              Karta pobytu.
              <br />
              Bez stresu.
            </h3>
            <p className="mt-6 max-w-[28ch] text-[14px] leading-[1.55] text-white/45">
              {t("backdrop")}
            </p>
            <div className="mt-8 flex items-center gap-2 text-[11.5px] text-white/35">
              <span className="h-1 w-1 rounded-full bg-[#caa467]" />
              ul. Marszałkowska 142 · Warszawa
            </div>
          </div>

          {/* Floating widget */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0e1929]/95 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl"
            >
              {/* Widget header */}
              <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
                <MilaAvatar size={36} ring />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-semibold leading-none text-white">
                      {t("name")}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#34c759]" />
                  </div>
                  <div className="mt-1 truncate text-[11.5px] leading-tight text-white/50">
                    {t("status")}
                  </div>
                </div>
                <button
                  aria-label="Close"
                  className="grid h-7 w-7 place-items-center rounded-full text-white/40 hover:bg-white/[0.06] hover:text-white/70"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M3 3l6 6M9 3l-6 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div
                ref={scrollRef}
                aria-live="polite"
                className="custom-scroll min-h-[420px] max-h-[480px] overflow-y-auto px-4 py-5"
              >
                <div className="flex flex-col gap-3.5">
                  {/* Static greeting */}
                  <BubbleBot>
                    <p className="leading-[1.5]">{t("greeting")}</p>
                  </BubbleBot>

                  <AnimatePresence initial={false}>
                    {visible.map((b, i) =>
                      b.type === "user" ? (
                        <BubbleUser key={`${scenarioIdx}-${i}`}>
                          {b.text}
                        </BubbleUser>
                      ) : (
                        <BubbleBot key={`${scenarioIdx}-${i}`}>
                          <p className="leading-[1.5]">{b.intro}</p>
                          {b.bullets && (
                            <ul className="mt-2 space-y-1">
                              {b.bullets.map((bullet, bi) => (
                                <motion.li
                                  key={bi}
                                  initial={{ opacity: 0, x: -4 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    delay: 0.15 + bi * 0.085,
                                    duration: 0.3,
                                    ease: [0.16, 1, 0.3, 1],
                                  }}
                                  className="flex gap-2 text-[13.5px] leading-[1.5] text-white/80"
                                >
                                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#caa467]" />
                                  <span>{bullet}</span>
                                </motion.li>
                              ))}
                            </ul>
                          )}
                          {b.outro && (
                            <p className="mt-2.5 leading-[1.5]">{b.outro}</p>
                          )}
                          {b.cta && (
                            <motion.button
                              type="button"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay:
                                  0.2 +
                                  (b.bullets ? b.bullets.length * 0.085 : 0),
                                duration: 0.35,
                              }}
                              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#caa467] px-3.5 py-2 text-[12.5px] font-medium leading-none text-[#0e1929] transition-transform hover:-translate-y-px"
                            >
                              {b.cta}
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 14 14"
                                aria-hidden="true"
                              >
                                <path
                                  d="M5 3l4 4-4 4"
                                  stroke="currentColor"
                                  strokeWidth="1.7"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  fill="none"
                                />
                              </svg>
                            </motion.button>
                          )}
                        </BubbleBot>
                      ),
                    )}
                  </AnimatePresence>

                  {botTyping && (
                    <motion.div
                      key={`typing-${scenarioIdx}-${revealed}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-end gap-2"
                    >
                      <MilaAvatar size={22} />
                      <div className="rounded-[16px] rounded-bl-[6px] bg-white/[0.05] px-3.5 py-2.5">
                        <TypingDots />
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Input bar */}
              <div className="border-t border-white/[0.06] px-3 py-3">
                <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-4 py-2">
                  <span className="flex-1 truncate text-[13px] text-white/35">
                    {t("inputPlaceholder")}
                  </span>
                  <button
                    aria-label="Send"
                    className="grid h-7 w-7 place-items-center rounded-full bg-[#caa467] text-[#0e1929] transition-transform hover:scale-[1.04]"
                  >
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M2 7L12 2L9 12L7 8L2 7Z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="px-4 pb-4 pt-1 text-[11px] leading-[1.55] text-white/35">
                {t("disclaimer")}
              </p>
            </motion.div>

            {/* Scenario chip (above widget header on desktop) */}
            <div className="absolute -top-3 left-4 z-10 hidden md:block">
              <AnimatePresence mode="wait">
                <motion.span
                  key={scenarioIdx}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#caa467] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#0e1929] shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                >
                  <span className="h-1 w-1 rounded-full bg-[#0e1929]/70" />
                  {scenario.topic}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.08);
          border-radius: 9999px;
        }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────── */

function BubbleBot({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-end gap-2"
    >
      <MilaAvatar size={22} />
      <div className="max-w-[88%] rounded-[16px] rounded-bl-[6px] bg-white/[0.06] px-3.5 py-2.5 text-[13.5px] text-white/90">
        {children}
      </div>
    </motion.div>
  );
}

function BubbleUser({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex justify-end"
    >
      <div className="max-w-[80%] rounded-[16px] rounded-br-[6px] bg-[#caa467]/[0.18] px-3.5 py-2.5 text-[13.5px] leading-[1.5] text-white/95 ring-1 ring-inset ring-[#caa467]/25">
        {children}
      </div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-white/50"
          style={{
            animation: `mlBlink 1.1s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes mlBlink {
          0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
          40% { opacity: 1; transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}

function MilaAvatar({
  size = 28,
  ring = false,
}: {
  size?: number;
  ring?: boolean;
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${
        ring ? "ring-2 ring-[#caa467]/30" : ""
      }`}
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(140deg, #d9b076 0%, #a87a3a 55%, #5b3c1a 100%)",
      }}
      aria-label="Mila"
    >
      <span
        className="font-semibold text-[#0e1929]"
        style={{
          fontSize: Math.round(size * 0.42),
          letterSpacing: "-0.02em",
        }}
      >
        M
      </span>
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1/2"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.18), transparent)",
        }}
      />
    </span>
  );
}

function FauxWebsiteBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* warm spotlight */}
      <div
        className="absolute -top-1/3 left-1/2 h-[80%] w-[80%] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(202,164,103,0.14), transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      {/* faint top bar */}
      <div className="absolute left-6 right-6 top-4 hidden h-px bg-white/[0.06] md:block" />
      {/* huge faint serif word */}
      <div
        className="absolute -bottom-10 right-[-4%] select-none whitespace-nowrap text-[180px] font-bold leading-none tracking-[-0.04em] text-white/[0.022] md:text-[260px]"
        style={{ fontFamily: 'ui-serif, "New York", Georgia, serif' }}
      >
        LegalWin
      </div>
      {/* nav dot row */}
      <div className="absolute right-8 top-4 hidden gap-2 md:flex">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-1 w-6 rounded-full bg-white/[0.05]" />
        ))}
      </div>
      {/* subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
    </div>
  );
}

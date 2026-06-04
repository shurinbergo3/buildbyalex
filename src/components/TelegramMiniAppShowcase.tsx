"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/* Telegram bots / Mini Apps service demo. A Telegram phone cycles through
   bot chat → Mini App catalog → in-app payment (Stars), while the copy narrates
   "lives inside Telegram → no install → pay without leaving the chat". Models
   the MobileAppShowcase scene-cycle pattern. Reduced-motion pauses the cycle. */

const SCENE_HOLD = 4200;
type Scene = { tag: string; title: string; desc: string };
type AppItem = { name: string; price: string };

export function TelegramMiniAppShowcase() {
  const t = useTranslations("services.telegram.demo");
  const reduce = useReducedMotion();
  const scenes = useMemo(() => t.raw("scenes") as Scene[], [t]);
  const items = useMemo(() => t.raw("app.items") as AppItem[], [t]);
  const chips = useMemo(() => t.raw("chips") as string[], [t]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setActive((i) => (i + 1) % scenes.length), SCENE_HOLD);
    return () => clearInterval(id);
  }, [scenes.length, reduce]);

  const scene = scenes[active];

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
            <div className="relative overflow-hidden rounded-[32px] bg-[#0A0A0A] p-7 md:p-12 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-1/3 left-1/2 h-[120%] w-[120%] -translate-x-1/2"
                style={{ background: "radial-gradient(ellipse 45% 38% at 50% 0%, rgba(42,166,234,0.20), transparent 70%)" }}
              />
              <div className="relative grid items-center gap-10 md:grid-cols-2 md:gap-14">
                {/* Narration + capability chips */}
                <div className="order-2 md:order-1">
                  <div className="flex gap-2">
                    {scenes.map((_, i) => (
                      <span
                        key={i}
                        className="h-1 w-8 rounded-full transition-colors duration-500"
                        style={{ background: i === active ? "#2ea6ea" : "rgba(255,255,255,0.14)" }}
                      />
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-6"
                    >
                      <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#5fb8ef]">{scene.tag}</p>
                      <h3 className="mt-3 text-[clamp(22px,2vw+14px,30px)] font-semibold leading-[1.12] tracking-[-0.02em] text-white">
                        {scene.title}
                      </h3>
                      <p className="mt-3 max-w-[420px] text-[15px] leading-[1.55] text-white/65">{scene.desc}</p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-8 flex flex-wrap items-center gap-2.5">
                    {chips.map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-2 text-[12.5px] font-medium text-white/85"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#2ea6ea]" aria-hidden="true" />
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Phone */}
                <div className="order-1 flex justify-center md:order-2">
                  <Phone active={active} t={t} items={items} reduce={!!reduce} />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

type T = ReturnType<typeof useTranslations>;

function Phone({ active, t, items, reduce }: { active: number; t: T; items: AppItem[]; reduce: boolean }) {
  const sheetUp = active >= 1;
  return (
    <div className="relative w-[220px] shrink-0">
      <div className="overflow-hidden rounded-[40px] border-[7px] border-[#1c1c1f] bg-black shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]">
        {/* status bar + notch */}
        <div className="relative flex items-center justify-between px-5 pt-2.5 pb-1 text-[10px] font-medium text-white/80">
          <span className="tabular-nums">9:41</span>
          <span className="absolute left-1/2 top-1.5 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
          <span className="h-2.5 w-4 rounded-sm border border-white/40" />
        </div>

        {/* Telegram header */}
        <div className="flex items-center gap-2.5 border-b border-black/40 px-3 py-2" style={{ background: "#17212b" }}>
          <div
            className="grid h-8 w-8 place-items-center rounded-full text-[12px] font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #2ea6ea 0%, #1e88c8 100%)" }}
          >
            {t("botName").replace(/[^A-Za-zА-Яа-яІіЇїЄєҐґ]/g, "").slice(0, 2).toUpperCase() || "TG"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-white">{t("botName")}</div>
            <div className="truncate text-[11px] text-[#7d8e9c]">{t("botStatus")}</div>
          </div>
        </div>

        {/* Chat + Mini App sheet */}
        <div
          className="relative h-[430px] overflow-hidden"
          style={{ background: "radial-gradient(ellipse at top, rgba(46,87,121,0.18) 0%, transparent 55%), #0e1621" }}
        >
          {/* Chat layer (dimmed while the sheet is up) */}
          <div
            className="flex h-full flex-col justify-end gap-2 px-3 py-3 transition-[filter,opacity] duration-500"
            style={{ filter: sheetUp ? "brightness(0.5)" : "none", opacity: sheetUp ? 0.7 : 1 }}
          >
            <ChatBubble>{t("chat.greeting")}</ChatBubble>
            {/* Inline keyboard "Open app" button */}
            <div className="mt-0.5 flex">
              <div
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-semibold text-white"
                style={{ background: "#2b5278" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="4" y="3" width="16" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
                  <path d="M9 8h6M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {t("chat.openApp")}
              </div>
            </div>
            {active === 2 && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <ChatBubble>{t("chat.done")}</ChatBubble>
              </motion.div>
            )}
          </div>

          {/* Mini App bottom sheet */}
          <motion.div
            aria-hidden={!sheetUp}
            initial={false}
            animate={reduce ? { y: sheetUp ? "8%" : "100%" } : { y: sheetUp ? "8%" : "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 bottom-0 top-0 flex flex-col rounded-t-[20px] bg-white"
          >
            {/* grabber + app header */}
            <div className="flex flex-col items-center pt-2">
              <span className="h-1 w-9 rounded-full bg-black/15" />
            </div>
            <div className="flex items-center justify-between px-4 pb-3 pt-3">
              <div>
                <div className="text-[14px] font-semibold tracking-[-0.01em] text-[#0e1621]">{t("app.title")}</div>
                <div className="text-[11.5px] text-[#8a95a1]">{t("app.subtitle")}</div>
              </div>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-black/[0.06] text-[#8a95a1]">
                <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </div>

            <AnimatePresence mode="wait">
              {active < 2 ? (
                <motion.div
                  key="catalog"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-1 flex-col px-3"
                >
                  <div className="flex-1 space-y-2">
                    {items.map((it, i) => {
                      const selected = i === 0;
                      return (
                        <div
                          key={it.name}
                          className="flex items-center gap-3 rounded-2xl border px-3 py-2.5"
                          style={{
                            borderColor: selected ? "#2ea6ea" : "rgba(14,22,33,0.08)",
                            background: selected ? "rgba(46,166,234,0.06)" : "#fff",
                          }}
                        >
                          <span
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-xl text-[14px]"
                            style={{ background: "rgba(46,166,234,0.10)" }}
                            aria-hidden="true"
                          >
                            <span className="h-3.5 w-3.5 rounded-md" style={{ background: "#2ea6ea", opacity: 0.5 + i * 0.2 }} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[12.5px] font-medium text-[#0e1621]">{it.name}</span>
                          </span>
                          <span className="text-[12.5px] font-semibold tabular-nums text-[#0e1621]">{it.price}</span>
                          <span
                            className="grid h-4 w-4 place-items-center rounded-full border"
                            style={{ borderColor: selected ? "#2ea6ea" : "rgba(14,22,33,0.2)", background: selected ? "#2ea6ea" : "transparent" }}
                          >
                            {selected && (
                              <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden="true">
                                <path d="M2.5 6.5L5 9l4.5-5.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                              </svg>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Telegram main button — pay with Stars */}
                  <motion.div
                    animate={active === 1 && !reduce ? { scale: [1, 0.97, 1] } : {}}
                    transition={{ duration: 0.9, repeat: active === 1 ? Infinity : 0, repeatDelay: 0.6 }}
                    className="my-3 flex items-center justify-center gap-1.5 rounded-xl py-3 text-[13.5px] font-semibold text-white"
                    style={{ background: "#2ea6ea" }}
                  >
                    {t("app.pay")}
                    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M8 1l1.96 4.27 4.7.55-3.5 3.2.96 4.62L8 11.4l-4.12 2.24.96-4.62-3.5-3.2 4.7-.55L8 1z" fill="#FFC83D" />
                    </svg>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="paid"
                  initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-1 flex-col items-center justify-center px-5 text-center"
                >
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-[#34d399]/15">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-[#34d399]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-5 text-[15px] font-semibold tracking-[-0.01em] text-[#0e1621]">{t("app.paid")}</div>
                  <div className="mt-1.5 text-[12px] text-[#8a95a1]">{t("app.paidSub")}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-start">
      <div
        className="max-w-[82%] rounded-2xl rounded-bl-[6px] px-3 py-1.5 text-[12.5px] leading-[1.35] text-white"
        style={{ background: "#182533" }}
      >
        {children}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/* Mobile apps service demo. A phone cycles through onboarding → home → success
   while the copy narrates "one codebase → native feel → store-ready". Models
   the BodyForge scene-cycle pattern, trimmed. Reduced-motion pauses the cycle. */

const SCENE_HOLD = 4600;
type Scene = { tag: string; title: string; desc: string };

export function MobileAppShowcase() {
  const t = useTranslations("services.mobile.demo");
  const reduce = useReducedMotion();
  const scenes = useMemo(() => t.raw("scenes") as Scene[], [t]);
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
            <div className="relative overflow-hidden rounded-[32px] border border-[color:var(--color-divider)] bg-[color:var(--color-bg-alt)] p-7 md:p-12 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_56px_-20px_rgba(16,24,40,0.16)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-1/3 left-1/2 h-[120%] w-[120%] -translate-x-1/2"
                style={{ background: "radial-gradient(ellipse 45% 38% at 50% 0%, rgba(255,107,26,0.10), transparent 70%)" }}
              />
              <div className="relative grid items-center gap-10 md:grid-cols-2 md:gap-14">
                {/* Narration + store proof */}
                <div className="order-2 md:order-1">
                  <div className="flex gap-2">
                    {scenes.map((_, i) => (
                      <span
                        key={i}
                        className="h-1 w-8 rounded-full transition-colors duration-500"
                        style={{ background: i === active ? "var(--c-accent)" : "rgba(16,24,40,0.12)" }}
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
                      <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-[color:var(--c-accent)]">{scene.tag}</p>
                      <h3 className="mt-3 text-[clamp(22px,2vw+14px,30px)] font-semibold leading-[1.12] tracking-[-0.02em] text-[color:var(--color-text)]">
                        {scene.title}
                      </h3>
                      <p className="mt-3 max-w-[420px] text-[15px] leading-[1.55] text-[color:var(--color-text-2)]">{scene.desc}</p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-8 flex flex-wrap items-center gap-2.5">
                    <StoreBadge platform="ios" label={t("stores.ios")} />
                    <StoreBadge platform="android" label={t("stores.android")} />
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] px-3 py-2 text-[12.5px] text-[color:var(--color-text-2)]">
                      <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M8 1.5l1.96 4.27 4.7.55-3.5 3.2.96 4.62L8 11.9l-4.12 2.24.96-4.62-3.5-3.2 4.7-.55L8 1.5z" fill="#FFB84D" />
                      </svg>
                      <span className="font-semibold tabular-nums text-[color:var(--color-text)]">{t("storeRating")}</span>
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="order-1 flex justify-center md:order-2">
                  <Phone active={active} appName={t("appName")} cta={t("ctaLabel")} successTitle={t("successTitle")} successSub={t("successSub")} homeTitle={t("homeTitle")} reduce={!!reduce} />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

function StoreBadge({ platform, label }: { platform: "ios" | "android"; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] px-3 py-2 text-[12.5px] font-medium text-[color:var(--color-text-2)]">
      {platform === "ios" ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M16.4 12.7c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-2.9-.8-1.5 0-2.9.9-3.6 2.2-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.7 2.2 1.1 0 1.5-.7 2.8-.7s1.7.7 2.9.7c1.2 0 2-1.1 2.7-2.1.9-1.3 1.2-2.5 1.2-2.6 0 0-2.3-.9-2.9-3.7zM14.3 6c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6 1 .1 2-.5 2.5-1.2z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3 20.5V3.5c0-.4.2-.7.5-.9L13.8 12 3.5 21.4c-.3-.2-.5-.5-.5-.9zM16.8 9.2l-2.3 2.3-9-9 11.3 6.7zM16.8 14.8l-11.3 6.7 9-9 2.3 2.3zM20.5 11.2c.6.4.6 1.2 0 1.6l-2.4 1.4-2.6-2.2 2.6-2.2 2.4 1.4z" />
        </svg>
      )}
      {label}
    </span>
  );
}

function Phone({
  active,
  appName,
  cta,
  successTitle,
  successSub,
  homeTitle,
  reduce,
}: {
  active: number;
  appName: string;
  cta: string;
  successTitle: string;
  successSub: string;
  homeTitle: string;
  reduce: boolean;
}) {
  return (
    <div className="relative w-[212px] shrink-0">
      <div className="overflow-hidden rounded-[38px] border-[6px] border-[#1c1c1f] bg-black shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]">
        {/* status bar + notch */}
        <div className="relative flex items-center justify-between px-5 pt-2.5 pb-1 text-[10px] font-medium text-white/70">
          <span className="tabular-nums">9:41</span>
          <span className="absolute left-1/2 top-1.5 h-4 w-16 -translate-x-1/2 rounded-full bg-[#1c1c1f]" />
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-4 rounded-sm border border-white/40" />
          </span>
        </div>

        <div className="relative h-[420px] bg-gradient-to-b from-[#101015] to-[#08080b]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 px-4 pt-3"
            >
              {active === 0 && <OnboardingScreen appName={appName} cta={cta} />}
              {active === 1 && <HomeScreen title={homeTitle} />}
              {active === 2 && <SuccessScreen title={successTitle} sub={successSub} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function OnboardingScreen({ appName, cta }: { appName: string; cta: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[color:var(--c-accent)] shadow-[0_12px_30px_-8px_rgba(255,107,26,0.6)]">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="mt-5 text-[20px] font-semibold tracking-[-0.02em] text-white">{appName}</div>
      <div className="mt-2 h-1.5 w-28 rounded-full bg-white/10" />
      <div className="mt-1.5 h-1.5 w-20 rounded-full bg-white/[0.07]" />
      <div className="mt-8 w-full">
        <div className="rounded-full bg-[color:var(--c-accent)] py-3 text-center text-[13px] font-semibold text-white">{cta}</div>
        <div className="mt-3 rounded-full border border-white/12 py-3 text-center text-[12px] text-white/55">Google · Apple</div>
      </div>
    </div>
  );
}

function HomeScreen({ title }: { title: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div className="text-[15px] font-semibold tracking-[-0.01em] text-white">{title}</div>
        <span className="h-8 w-8 rounded-full bg-white/10" />
      </div>
      <div className="mt-3 rounded-2xl bg-gradient-to-br from-[color:var(--c-accent)] to-[#c4470a] p-3.5">
        <div className="h-1.5 w-12 rounded-full bg-white/40" />
        <div className="mt-2 text-[22px] font-semibold tabular-nums text-white">€2,480</div>
        <div className="mt-3 flex gap-2">
          <span className="h-6 flex-1 rounded-lg bg-white/20" />
          <span className="h-6 flex-1 rounded-lg bg-white/15" />
        </div>
      </div>
      <div className="mt-4 space-y-2.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="h-9 w-9 shrink-0 rounded-xl bg-white/[0.07]" />
            <span className="flex-1">
              <span className="block h-2 w-2/3 rounded-full bg-white/15" />
              <span className="mt-1.5 block h-2 w-1/3 rounded-full bg-white/[0.08]" />
            </span>
            <span className="h-2 w-8 rounded-full bg-white/12" />
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-around border-t border-white/[0.06] pt-3">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-5 w-5 rounded-lg" style={{ background: i === 0 ? "var(--c-accent)" : "rgba(255,255,255,0.12)" }} />
        ))}
      </div>
    </div>
  );
}

function SuccessScreen({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-[#34d399]/15">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[#34d399]">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="#08080b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="mt-6 text-[18px] font-semibold tracking-[-0.01em] text-white">{title}</div>
      <div className="mt-2 text-[13px] text-white/55">{sub}</div>
      <div className="mt-6 flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 1.5l1.96 4.27 4.7.55-3.5 3.2.96 4.62L8 11.9l-4.12 2.24.96-4.62-3.5-3.2 4.7-.55L8 1.5z" fill="#FFB84D" />
          </svg>
        ))}
      </div>
    </div>
  );
}

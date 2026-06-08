"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

const SCENE_HOLD = 5200;
const ACCENT = "#C8FF00";
const ACCENT_DIM = "rgba(200, 255, 0, 0.18)";
// Readable lime-on-light for text/borders in the (now light) stage panel.
const ACCENT_INK = "#586d00";
const ACCENT_INK_DIM = "rgba(88, 109, 0, 0.10)";

type Scene = { tag: string; title: string; desc: string };

type PhoneCopy = {
  appName: string;
  streakValue: string;
  streakLabel: string;
  streakSub: string;
  weekLabel: string;
  weekValue: string;
  weekdays: string[];
  todayLabel: string;
  todayTitle: string;
  exercisesValue: string;
  exercisesLabel: string;
  setsValue: string;
  setsLabel: string;
  minValue: string;
  minLabel: string;
  startBtn: string;
  coachTitle: string;
  coachSub: string;
  analysisLabel: string;
  analysisText: string;
  workoutTitle: string;
  restLabel: string;
  restValue: string;
  exerciseName: string;
  lastSessionLabel: string;
  prevSets: string[];
  weightLabel: string;
  weightValue: string;
  repsLabel: string;
  repsValue: string;
  statsTitle: string;
  growthLabel: string;
  growthSubtitle: string;
  growthBadge: string;
  moveValue: string;
  moveUnit: string;
  moveLabel: string;
  exValue: string;
  exUnit: string;
  exLabel: string;
  warmupValue: string;
  warmupUnit: string;
  warmupLabel: string;
  heartLabel: string;
  restingLabel: string;
  restingValue: string;
  restingUnit: string;
  workoutBpmLabel: string;
  workoutBpmValue: string;
  workoutBpmUnit: string;
  weightStatLabel: string;
  weightStatValue: string;
  weightStatUnit: string;
  heightStatLabel: string;
  heightStatValue: string;
  heightStatUnit: string;
  programsTitle: string;
  activeProgramLabel: string;
  activeProgramTitle: string;
  activeProgramDesc: string;
  programEdit: string;
  programDays: string;
  programsAll: string;
  secondProgramTitle: string;
  secondProgramDesc: string;
  secondProgramCta: string;
  tabs: string[];
};

export function BodyForgeShowcase() {
  const t = useTranslations("work.caseShowcase.bodyforge");
  const scenes = useMemo(() => t.raw("scenes") as Scene[], [t]);
  const phone = useMemo(() => t.raw("phone") as PhoneCopy, [t]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % scenes.length),
      SCENE_HOLD,
    );
    return () => clearInterval(id);
  }, [scenes.length]);

  return (
    <Section pad="default" tone="alt">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("hero.eyebrow")}</p>
            <h2 className="mt-3 text-[clamp(28px,3vw+12px,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-[color:var(--color-text-1)]">
              {t("hero.headline")}
            </h2>
            <p className="mx-auto mt-5 max-w-[580px] text-[17px] leading-[1.55] text-[color:var(--color-text-2)]">
              {t("hero.subhead")}
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mt-14 md:mt-20">
            {/* Stage backdrop */}
            <div className="relative overflow-hidden rounded-[32px] border border-[color:var(--color-divider)] bg-[color:var(--color-bg-alt)] p-6 md:p-12 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_56px_-20px_rgba(16,24,40,0.16)]">
              <StageBackdrop active={active} />

              <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
                {/* Side copy */}
                <div className="order-2 md:order-1">
                  <div className="flex flex-col gap-6">
                    {/* Scene chips */}
                    <div className="flex flex-wrap gap-2">
                      {scenes.map((s, i) => (
                        <button
                          key={s.tag}
                          type="button"
                          onClick={() => setActive(i)}
                          className="group/chip relative rounded-full border px-3.5 py-1.5 text-[11.5px] font-medium uppercase tracking-[0.12em] transition-colors"
                          style={{
                            borderColor:
                              i === active
                                ? ACCENT_INK
                                : "var(--color-divider)",
                            color:
                              i === active
                                ? ACCENT_INK
                                : "var(--color-text-3)",
                            background:
                              i === active
                                ? ACCENT_INK_DIM
                                : "transparent",
                          }}
                        >
                          {s.tag}
                        </button>
                      ))}
                    </div>

                    <div className="min-h-[180px]">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={active}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <h3
                            className="text-[clamp(22px,2vw+12px,30px)] font-semibold leading-[1.18] tracking-[-0.014em] text-[color:var(--color-text)]"
                          >
                            {scenes[active].title}
                          </h3>
                          <p className="mt-4 max-w-[44ch] text-[15.5px] leading-[1.6] text-[color:var(--color-text-2)]">
                            {scenes[active].desc}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2 pt-2">
                      {scenes.map((_, i) => (
                        <div
                          key={i}
                          className="h-[3px] flex-1 overflow-hidden rounded-full bg-[color:var(--color-divider)]"
                        >
                          <motion.div
                            key={`${active}-${i}`}
                            className="h-full origin-left"
                            style={{ background: ACCENT_INK }}
                            initial={{ scaleX: i < active ? 1 : 0 }}
                            animate={{
                              scaleX:
                                i < active
                                  ? 1
                                  : i === active
                                    ? 1
                                    : 0,
                            }}
                            transition={{
                              duration:
                                i === active ? SCENE_HOLD / 1000 : 0,
                              ease: "linear",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="order-1 md:order-2 flex justify-center">
                  <Phone>
                    <AnimatePresence mode="wait">
                      {active === 0 && (
                        <motion.div
                          key="home"
                          {...sceneAnim}
                          className="h-full w-full"
                        >
                          <HomeScreen phone={phone} />
                        </motion.div>
                      )}
                      {active === 1 && (
                        <motion.div
                          key="workout"
                          {...sceneAnim}
                          className="h-full w-full"
                        >
                          <WorkoutScreen phone={phone} />
                        </motion.div>
                      )}
                      {active === 2 && (
                        <motion.div
                          key="coach"
                          {...sceneAnim}
                          className="h-full w-full"
                        >
                          <CoachScreen phone={phone} />
                        </motion.div>
                      )}
                      {active === 3 && (
                        <motion.div
                          key="programs"
                          {...sceneAnim}
                          className="h-full w-full"
                        >
                          <ProgramsScreen phone={phone} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Phone>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

/* ─────────────────── Phone frame ─────────────────── */

const sceneAnim = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* glow */}
      <div
        aria-hidden
        className="absolute -inset-12 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(200,255,0,0.18) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="relative mx-auto h-[640px] w-[315px] rounded-[52px] bg-[#0a0a0a] p-[10px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_0_0_2px_rgba(0,0,0,1)]"
      >
        {/* side highlights */}
        <span
          aria-hidden
          className="absolute -left-[2px] top-24 h-16 w-[3px] rounded-r-full bg-white/[0.06]"
        />
        <span
          aria-hidden
          className="absolute -right-[2px] top-32 h-24 w-[3px] rounded-l-full bg-white/[0.06]"
        />

        <div className="relative h-full w-full overflow-hidden rounded-[44px] bg-black">
          {/* status bar + dynamic island */}
          <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-7 pt-3 text-[11px] font-semibold text-white">
            <span>15:07</span>
            <span className="absolute left-1/2 top-2 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/[0.04]" />
            <span className="flex items-center gap-1.5">
              <span aria-hidden className="inline-block">
                <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                  <path
                    d="M0 5h2v3H0zM4 3h2v5H4zM8 1h2v7H8zM12 0h2v8h-2z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span aria-hidden>
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path
                    d="M7 9.5A6.5 6.5 0 0113.5 3L13 2.5A6.7 6.7 0 007 1a6.7 6.7 0 00-6 1.5L0.5 3A6.5 6.5 0 017 9.5z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                </svg>
              </span>
              <span
                aria-hidden
                className="ml-0.5 inline-block h-[10px] w-[22px] rounded-[3px] border border-white/70 p-[1.5px]"
              >
                <span className="block h-full w-[80%] rounded-[1.5px] bg-white" />
              </span>
            </span>
          </div>

          <div className="absolute inset-0 pt-[44px]">{children}</div>

          {/* home indicator */}
          <div className="pointer-events-none absolute inset-x-0 bottom-[6px] flex justify-center">
            <div className="h-[4px] w-[110px] rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Stage backdrop ─────────────────── */

function StageBackdrop({ active }: { active: number }) {
  const accents = [
    "rgba(200,255,0,0.12)",
    "rgba(120,255,180,0.10)",
    "rgba(255,210,80,0.10)",
    "rgba(170,255,80,0.12)",
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-[40%] left-1/2 h-[120%] w-[120%] -translate-x-1/2"
        animate={{ background: `radial-gradient(ellipse 50% 45% at 50% 30%, ${accents[active]}, transparent 70%)` }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-10 right-[-4%] select-none whitespace-nowrap text-[150px] font-bold leading-none tracking-[-0.04em] text-black/[0.03] md:text-[220px]"
        style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, "SF Pro Display", "Inter", sans-serif' }}
      >
        Body Forge
      </div>
    </div>
  );
}

/* ─────────────────── Screens ─────────────────── */

function HomeScreen({ phone }: { phone: PhoneCopy }) {
  return (
    <div className="flex h-full flex-col bg-black px-3 pt-2 text-white">
      {/* Top nav */}
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-7" />
        <span className="text-[13.5px] font-semibold">{phone.appName}</span>
        <Avatar />
      </div>

      {/* Streak card */}
      <div className="mt-2 rounded-[20px] border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span
              className="grid h-9 w-9 place-items-center rounded-full"
              style={{ background: ACCENT_DIM, color: ACCENT }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" />
              </svg>
            </span>
            <div>
              <div className="text-[15px] font-semibold leading-none">
                <span style={{ color: ACCENT }}>{phone.streakValue}</span>{" "}
                {phone.streakLabel}
              </div>
              <div className="mt-1 text-[9px] tracking-[0.12em] text-white/40">
                {phone.streakSub}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[15px] font-semibold leading-none" style={{ color: ACCENT }}>
              {phone.weekValue}
            </div>
            <div className="mt-1 text-[9px] tracking-[0.12em] text-white/40">
              {phone.weekLabel}
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {phone.weekdays.map((d, i) => (
            <div key={d} className="flex flex-col items-center gap-1.5">
              <span className="text-[8.5px] tracking-[0.08em] text-white/45">
                {d}
              </span>
              <span
                className="block h-3 w-3 rounded-full"
                style={{
                  border:
                    i === 5
                      ? `1.5px solid ${ACCENT}`
                      : "1px solid rgba(255,255,255,0.08)",
                  background:
                    i === 5 ? ACCENT_DIM : "rgba(255,255,255,0.03)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Today's plan */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-3 overflow-hidden rounded-[20px] border p-3"
        style={{ borderColor: "rgba(200,255,0,0.18)", background: "rgba(200,255,0,0.04)" }}
      >
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.12em]"
            style={{ color: ACCENT }}
          >
            <span className="h-1 w-1 rounded-full" style={{ background: ACCENT }} />
            {phone.todayLabel}
          </span>
          <span
            className="grid h-7 w-7 place-items-center rounded-full"
            style={{ background: ACCENT_DIM, color: ACCENT }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M4 6h16M4 12h16M4 18h12" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <div className="mt-2 text-[26px] font-bold leading-tight">
          {phone.todayTitle}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Pill icon="dumbbell">
            <span className="font-semibold">{phone.exercisesValue}</span>{" "}
            <span className="text-white/60">{phone.exercisesLabel}</span>
          </Pill>
          <Pill icon="list" tone="cyan">
            <span className="font-semibold">{phone.setsValue}</span>{" "}
            <span className="text-white/60">{phone.setsLabel}</span>
          </Pill>
          <Pill icon="clock" tone="amber">
            <span className="font-semibold">{phone.minValue}</span>{" "}
            <span className="text-white/60">{phone.minLabel}</span>
          </Pill>
        </div>
        <button
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[12px] font-bold tracking-wide text-black"
          style={{ background: ACCENT, boxShadow: `0 0 0 1px ${ACCENT}, 0 12px 28px -8px rgba(200,255,0,0.5)` }}
        >
          <span className="grid h-5 w-5 place-items-center rounded-full bg-black/15">
            <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor">
              <path d="M3 1l8 5-8 5V1z" />
            </svg>
          </span>
          {phone.startBtn}
        </button>
      </motion.div>

      {/* AI Coach */}
      <div className="mt-3 flex-1 overflow-hidden rounded-[18px] border border-white/[0.06] bg-white/[0.03] p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="grid h-7 w-7 place-items-center rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(200,255,0,0.25), rgba(120,255,180,0.18))",
                color: ACCENT,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
              </svg>
            </span>
            <div>
              <div className="text-[11.5px] font-semibold leading-none">
                {phone.coachTitle}
              </div>
              <div className="mt-1 text-[8.5px] tracking-[0.1em] text-white/40">
                {phone.coachSub}
              </div>
            </div>
          </div>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path
              d="M4 2l4 4-4 4"
              stroke="currentColor"
              strokeOpacity="0.5"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span
          className="mt-2 inline-flex items-center gap-1 text-[8.5px] font-semibold tracking-[0.14em]"
          style={{ color: ACCENT }}
        >
          <span className="h-1 w-1 rounded-full" style={{ background: ACCENT }} />
          {phone.analysisLabel}
        </span>
        <p className="mt-1.5 text-[10.5px] leading-[1.45] text-white/80 line-clamp-4">
          {phone.analysisText}
        </p>
      </div>

      <TabBar tabs={phone.tabs} active={0} />
    </div>
  );
}

function WorkoutScreen({ phone }: { phone: PhoneCopy }) {
  return (
    <div className="flex h-full flex-col bg-black px-3 pt-2 text-white">
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-7" />
        <span className="text-[13.5px] font-semibold">{phone.workoutTitle}</span>
        <div className="flex items-center gap-1.5">
          <Avatar size={22} />
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ff3b30]">
            <svg width="9" height="9" viewBox="0 0 12 12">
              <path
                d="M3 3l6 6M9 3l-6 6"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Rest timer */}
      <div
        className="mt-2 flex items-center justify-between rounded-[16px] border px-3 py-2"
        style={{ borderColor: "rgba(200,255,0,0.4)" }}
      >
        <div className="flex items-center gap-2">
          <span style={{ color: ACCENT }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a3 3 0 013 3v1a8 8 0 11-6 0V5a3 3 0 013-3z" />
            </svg>
          </span>
          <span className="text-[12px] font-medium">{phone.restLabel}</span>
        </div>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.06] text-[14px] leading-none">−</span>
        <CountdownTimer initial={phone.restValue} />
        <span className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.06] text-[14px] leading-none">+</span>
        <div className="flex items-center gap-1">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.06]">
            <svg width="9" height="9" viewBox="0 0 12 12" fill="white">
              <rect x="3" y="2" width="2" height="8" rx="0.5" />
              <rect x="7" y="2" width="2" height="8" rx="0.5" />
            </svg>
          </span>
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.06]">
            <svg width="9" height="9" viewBox="0 0 12 12" fill="white">
              <path d="M2 2l5 4-5 4V2z" />
              <rect x="8.5" y="2" width="1.5" height="8" rx="0.5" />
            </svg>
          </span>
        </div>
      </div>

      {/* Exercise card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-2 flex-1 rounded-[18px] border border-white/[0.06] bg-white/[0.02] p-3"
      >
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[14px] font-bold leading-tight">
            {phone.exerciseName}
          </h4>
          <div className="flex items-center gap-1">
            <span style={{ color: ACCENT }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 110 20 10 10 0 010-20zm0 5v5l4 2" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
            <span className="grid h-4 w-4 place-items-center rounded-full text-[8px] text-white/40 ring-1 ring-white/15">
              i
            </span>
            <span className="text-white/40">···</span>
          </div>
        </div>
        <div className="mt-2 flex gap-1.5">
          {["1", "2", "3"].map((n, i) => (
            <span
              key={n}
              className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold"
              style={{
                background:
                  i === 0 ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.04)",
                color: i === 0 ? "white" : "rgba(255,255,255,0.4)",
              }}
            >
              {n}
            </span>
          ))}
        </div>

        <div className="mt-2.5">
          <div className="text-[9px] tracking-[0.08em] text-white/40">
            {phone.lastSessionLabel}
          </div>
          <ul className="mt-1 space-y-0.5">
            {phone.prevSets.map((s) => (
              <li
                key={s}
                className="font-mono text-[10px] leading-relaxed text-white/55"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Field label={phone.weightLabel} value={phone.weightValue} />
          <Field label={phone.repsLabel} value={phone.repsValue} />
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] text-white/40">Заметка</span>
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="grid h-9 w-9 place-items-center rounded-full text-black"
            style={{ background: ACCENT, boxShadow: `0 8px 20px -6px rgba(200,255,0,0.5)` }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      <TabBar tabs={phone.tabs} active={0} />
    </div>
  );
}

function CoachScreen({ phone }: { phone: PhoneCopy }) {
  // simulate typewriter on analysisText
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = setInterval(() => {
      setN((v) => {
        if (v >= phone.analysisText.length) {
          clearInterval(id);
          return v;
        }
        return v + 2;
      });
    }, 25);
    return () => clearInterval(id);
  }, [phone.analysisText]);

  return (
    <div className="flex h-full flex-col bg-black px-3 pt-2 text-white">
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-7" />
        <span className="text-[13.5px] font-semibold">{phone.appName}</span>
        <Avatar />
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-[16px] border border-white/[0.06] bg-white/[0.03] p-2.5">
        <span
          className="grid h-9 w-9 place-items-center rounded-full"
          style={{
            background:
              "linear-gradient(135deg, rgba(200,255,0,0.3), rgba(120,255,180,0.2))",
            color: ACCENT,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
          </svg>
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[12.5px] font-semibold leading-none">
              {phone.coachTitle}
            </span>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: ACCENT }}
            />
          </div>
          <div className="mt-1 text-[9px] tracking-[0.1em] text-white/40">
            {phone.coachSub}
          </div>
        </div>
      </div>

      <div className="mt-2 flex-1 overflow-hidden rounded-[18px] border border-white/[0.06] bg-white/[0.02] p-3">
        <span
          className="inline-flex items-center gap-1 text-[9px] font-semibold tracking-[0.14em]"
          style={{ color: ACCENT }}
        >
          <span className="h-1 w-1 rounded-full" style={{ background: ACCENT }} />
          {phone.analysisLabel}
        </span>
        <p className="mt-2 text-[11.5px] leading-[1.55] text-white/85">
          {phone.analysisText.slice(0, n)}
          {n < phone.analysisText.length && (
            <span
              className="ml-0.5 inline-block h-3 w-[6px] align-middle"
              style={{ background: ACCENT, animation: "blink 1s steps(1) infinite" }}
            />
          )}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-[9px] tracking-[0.1em] text-white/35">GPT-4o</div>
          <div className="flex gap-1">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.06] text-white/60">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 11l5-5 5 5M12 6v12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/[0.06] text-white/60">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h12l4 4v12H4z" />
                <path d="M8 4v6h8V4M8 20v-6h8v6" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      <TabBar tabs={phone.tabs} active={0} />

      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

function ProgramsScreen({ phone }: { phone: PhoneCopy }) {
  return (
    <div className="flex h-full flex-col bg-black px-3 pt-2 text-white">
      <div className="flex items-center justify-end px-2 py-2">
        <Avatar />
      </div>
      <h2 className="px-2 text-[20px] font-bold leading-tight">
        {phone.programsTitle}
      </h2>

      <div className="mt-3 flex items-center gap-1.5 text-[9px] font-semibold tracking-[0.12em]" style={{ color: ACCENT }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" />
        </svg>
        {phone.activeProgramLabel}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-2 rounded-[18px] border border-white/[0.06] bg-white/[0.03] p-3"
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="max-w-[160px] text-[14px] font-bold leading-snug">
            {phone.activeProgramTitle}
          </h3>
          <span
            className="grid h-7 w-7 place-items-center rounded-full"
            style={{ background: ACCENT, color: "black" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <p className="mt-1.5 text-[10.5px] leading-[1.45] text-white/55">
          {phone.activeProgramDesc}
        </p>
        <div className="mt-2 flex items-center justify-between border-t border-white/[0.05] pt-2 text-[10px]">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 10h2v10H4zM10 6h2v14h-2zM16 12h2v8h-2z" />
            </svg>
            <span className="font-semibold text-white/80">2</span>
          </span>
          <span className="flex items-center gap-1.5 text-white/60">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round" />
            </svg>
            <span className="text-white/70">{phone.programDays}</span>
          </span>
        </div>
        <button
          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-[10.5px] font-semibold"
          style={{ background: ACCENT_DIM, color: ACCENT }}
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
          {phone.programEdit}
        </button>
      </motion.div>

      <div className="mt-3 flex items-center justify-between text-[9px] font-semibold tracking-[0.12em] text-white/50">
        <span className="flex items-center gap-1.5">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="3" width="12" height="18" rx="1.5" />
            <rect x="9" y="1.5" width="6" height="2.5" rx="1" fill="black" />
          </svg>
          {phone.programsAll}
        </span>
        <span className="text-white/30">11</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-2 flex-1 rounded-[18px] border border-white/[0.06] bg-white/[0.02] p-3"
      >
        <h3 className="text-[13px] font-bold leading-tight">
          {phone.secondProgramTitle}
        </h3>
        <p className="mt-1.5 text-[10px] leading-[1.45] text-white/55 line-clamp-2">
          {phone.secondProgramDesc}
        </p>
        <div className="mt-2 flex items-center justify-between border-t border-white/[0.05] pt-2 text-[10px]">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 10h2v10H4zM10 6h2v14h-2zM16 12h2v8h-2z" />
            </svg>
            <span className="font-semibold text-white/80">2</span>
          </span>
          <span className="text-white/70">{phone.programDays}</span>
        </div>
        <button
          className="mt-2.5 flex items-center gap-1.5 rounded-full py-1.5 px-3 text-[10.5px] font-semibold"
          style={{ background: ACCENT_DIM, color: ACCENT }}
        >
          <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor">
            <path d="M3 1l8 5-8 5V1z" />
          </svg>
          {phone.secondProgramCta}
        </button>
      </motion.div>

      <TabBar tabs={phone.tabs} active={1} />
    </div>
  );
}

/* ─────────────────── Atoms ─────────────────── */

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] bg-white/[0.04] px-2.5 py-2 text-center">
      <div className="text-[8.5px] tracking-[0.12em] text-white/40">{label}</div>
      <div className="mt-1 text-[22px] font-bold leading-none">{value}</div>
    </div>
  );
}

function Pill({
  children,
  icon,
  tone = "lime",
}: {
  children: React.ReactNode;
  icon: "dumbbell" | "list" | "clock";
  tone?: "lime" | "cyan" | "amber";
}) {
  const toneColors: Record<string, string> = {
    lime: ACCENT,
    cyan: "#5ac8fa",
    amber: "#ff9500",
  };
  const c = toneColors[tone];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px]"
      style={{
        background: "rgba(255,255,255,0.04)",
        color: "white",
      }}
    >
      <span style={{ color: c }}>
        {icon === "dumbbell" && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 10h2v4H4zM2 11h2v2H2zM18 10h2v4h-2zM20 11h2v2h-2zM6 9h12v6H6z" />
          </svg>
        )}
        {icon === "list" && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="5" width="14" height="2" rx="1" />
            <rect x="4" y="11" width="14" height="2" rx="1" />
            <rect x="4" y="17" width="14" height="2" rx="1" />
          </svg>
        )}
        {icon === "clock" && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" strokeLinecap="round" />
          </svg>
        )}
      </span>
      {children}
    </span>
  );
}

function Avatar({ size = 26 }: { size?: number }) {
  return (
    <span
      className="grid place-items-center overflow-hidden rounded-full text-[10px] font-bold text-white"
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 60%), linear-gradient(135deg, #2a2a2a, #050505)",
        border: `1.5px solid ${ACCENT}`,
      }}
    >
      S
    </span>
  );
}

function TabBar({ tabs, active }: { tabs: string[]; active: number }) {
  const icons = [
    // workout
    <svg key="w" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 10h2v4H4zM2 11h2v2H2zM18 10h2v4h-2zM20 11h2v2h-2zM6 9h12v6H6z" />
    </svg>,
    // program
    <svg key="p" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="3" width="12" height="18" rx="1.5" />
      <rect x="9" y="1.5" width="6" height="2.5" rx="1" fill="black" />
    </svg>,
    // library
    <svg key="l" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h7v16H4zM13 4h7v16h-7z" />
    </svg>,
    // stats
    <svg key="s" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 18l5-5 4 4 7-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 8h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>,
  ];
  return (
    <div className="mt-2 mb-6 flex items-center justify-around rounded-[20px] border border-white/[0.05] bg-black/60 px-2 py-2 backdrop-blur">
      {tabs.map((label, i) => (
        <div
          key={label}
          className="flex flex-col items-center gap-0.5"
          style={{ color: i === active ? ACCENT : "rgba(255,255,255,0.5)" }}
        >
          {icons[i]}
          <span className="text-[8.5px] font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}

function CountdownTimer({ initial }: { initial: string }) {
  // parse mm:ss
  const parse = (s: string) => {
    const [m, sec] = s.split(":").map((x) => parseInt(x, 10));
    return (isNaN(m) ? 2 : m) * 60 + (isNaN(sec) ? 55 : sec);
  };
  const total = useMemo(() => parse(initial), [initial]);
  const [t, setT] = useState(total);

  useEffect(() => {
    setT(total);
    const id = setInterval(() => {
      setT((v) => (v <= 0 ? total : v - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [total]);

  const m = Math.floor(t / 60);
  const s = t % 60;
  return (
    <span className="font-mono text-[22px] font-bold leading-none">
      {m}:{s.toString().padStart(2, "0")}
    </span>
  );
}

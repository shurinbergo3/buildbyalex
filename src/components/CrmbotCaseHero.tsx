"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AiCaseHero, HERO_ACCENT, HERO_ACCENT_HI, HERO_TEAL } from "@/components/AiCaseHero";

/* ────────────────────────────────────────────────────────────────────────
   CRM Bot hero — "AI-агент первого контакта" shown as a working system, not a
   screenshot. A glass agent console streams live function calls (Gemini 2.0
   Flash + function calling), and each call drives a compact pipeline: the deal
   marches New lead → … → Qualified in lockstep. The function-call ticker is the
   differentiator — it shows the agent *acting on the CRM*, not just chatting.
   Stage + field copy is reused from the already-localized home demo strings.
   ──────────────────────────────────────────────────────────────────────── */

type TickerStep = {
  fn: string;
  arg?: string;
  stage?: number; // advance pipeline to this stage when this line lands
  ok?: boolean; // final success line
};

const LINE_IN = 720; // time a line takes to "run" before the next appears
const LOOP_PAUSE = 3600;

type HeroCopy = {
  industry: string;
  title: string;
  tagline: string;
  metrics: { value: string; label: string }[];
  stack: string[];
  ndaLabel: string;
  liveLabel: string;
};

export function CrmbotCaseHero(props: HeroCopy) {
  return (
    <AiCaseHero {...props} contours="crmbot">
      <CrmbotConsole />
    </AiCaseHero>
  );
}

function CrmbotConsole() {
  const t = useTranslations("work.caseShowcase.crmbot");
  const tCrm = useTranslations("home.crmFunnel");
  const tSync = useTranslations("home.botSync");
  const reduce = useReducedMotion();

  const stages = useMemo(() => tCrm.raw("stages") as string[], [tCrm]);
  const fields = useMemo(
    () => tSync.raw("fields") as Record<string, string>,
    [tSync],
  );
  const fitValue = tSync("fitValue");
  const system = t("hero.system");
  const chips = t.raw("hero.chips") as { k: string; v: string }[];

  // Function-call program — code-English fn names (universal, B2B-credible),
  // localized arguments. Each line that carries `stage` advances the pipeline.
  const steps: TickerStep[] = useMemo(
    () => [
      { fn: "read_inbox", arg: "AmoCRM", stage: 0 },
      { fn: "classify_lead", arg: "ICP-fit" },
      { fn: "ask", arg: `"${fields.revenue}?"` },
      { fn: "update_field", arg: `${fields.revenue}: €40k/mo`, stage: 1 },
      { fn: "qualify", arg: "6 × criteria" },
      { fn: "move_stage", arg: stages[1] ?? "Qualified", stage: 1 },
      { fn: "notify_owner", arg: fitValue, stage: 1, ok: true },
    ],
    [fields, stages, fitValue],
  );

  const [visible, setVisible] = useState(reduce ? steps.length : 0);
  const [stage, setStage] = useState(reduce ? 1 : 0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduce) {
      setVisible(steps.length);
      setStage(1);
      return;
    }
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (d: number, fn: () => void) =>
      timers.push(setTimeout(() => !cancelled && fn(), d));

    setVisible(0);
    setStage(0);

    let cursor = 500;
    steps.forEach((s, i) => {
      at(cursor, () => {
        setVisible(i + 1);
        if (typeof s.stage === "number") setStage(s.stage);
      });
      cursor += LINE_IN;
    });
    at(cursor + LOOP_PAUSE, () => setCycle((c) => c + 1));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [cycle, steps, reduce]);

  // Pipeline visual: 4 compact columns mapped from the funnel stages.
  const pipe = [stages[0], stages[1], stages[3], stages[4]].filter(Boolean);
  // dealAt: how far the deal has travelled (0..pipe.length-1)
  const dealAt = stage >= 1 ? 1 : 0;

  return (
    <div className="relative mx-auto w-full max-w-[440px]">
      {/* floor glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[8%] bottom-[2%] -z-10 h-[24%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(255,122,45,0.26), transparent 72%)",
          filter: "blur(14px)",
        }}
      />

      {/* floating success chip */}
      <div className="absolute -right-2 top-[6%] z-20 hidden items-center gap-2 rounded-2xl border border-white/[0.1] bg-white/[0.06] px-3 py-2 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md sm:flex md:-right-7">
        <span className="grid h-5 w-5 place-items-center rounded-full" style={{ background: "rgba(54,216,196,0.18)" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4 4L19 7" stroke={HERO_TEAL} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="leading-tight">
          <span className="block text-[9.5px] uppercase tracking-[0.1em] text-white/45">{chips[2]?.k}</span>
          <span className="block text-[12px] font-semibold text-white">{chips[2]?.v}</span>
        </span>
      </div>

      {/* console */}
      <motion.div
        initial={false}
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative overflow-hidden rounded-[22px] border border-white/[0.1] shadow-[0_44px_110px_-40px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.08)]"
        style={{ background: "linear-gradient(180deg, #11151c 0%, #0b0e13 100%)" }}
      >
        {/* header */}
        <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-4 py-3" style={{ background: "#0e1218" }}>
          <span
            className="grid h-7 w-7 place-items-center rounded-[9px]"
            style={{ background: `linear-gradient(135deg, ${HERO_ACCENT_HI}, ${HERO_ACCENT})` }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1a160c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="7" width="16" height="12" rx="3" />
              <path d="M12 7V4M9 13h.01M15 13h.01" />
            </svg>
          </span>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-[13px] font-semibold text-white">CRM Bot</div>
            <div className="truncate text-[10.5px] text-white/45">{system}</div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-1 font-mono text-[10px] font-medium text-white/65">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Gemini 2.0 Flash
          </span>
        </div>

        {/* function-call ticker */}
        <div className="relative px-4 py-4" style={{ background: "radial-gradient(120% 80% at 50% -10%, rgba(255,122,45,0.06), transparent 60%)" }}>
          <div className="mb-2.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 9l3 3-3 3M13 15h3" />
            </svg>
            {t("hero.ticker")}
          </div>

          {/* fixed-height stack so it never reflows the page as lines stream */}
          <div className="grid">
            {/* ghost reserves height */}
            <ol aria-hidden className="invisible space-y-1.5 [grid-area:1/1]">
              {steps.map((s, i) => (
                <li key={`g-${i}`} className="font-mono text-[12px]">{s.fn}()</li>
              ))}
            </ol>
            <ol className="space-y-1.5 [grid-area:1/1]">
              <AnimatePresence initial={false}>
                {steps.slice(0, visible).map((s, i) => (
                  <motion.li
                    key={`${cycle}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-2 font-mono text-[12px] leading-none"
                  >
                    <span className="text-white/25">{i === visible - 1 ? "▸" : "·"}</span>
                    <span style={{ color: s.ok ? HERO_TEAL : HERO_ACCENT_HI }}>{s.fn}</span>
                    <span className="text-white/30">(</span>
                    {s.arg && <span className="truncate text-white/75">{s.arg}</span>}
                    <span className="text-white/30">)</span>
                    {s.ok && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="ml-auto shrink-0">
                        <path d="M5 13l4 4L19 7" stroke={HERO_TEAL} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
          </div>
        </div>

        {/* pipeline */}
        <div className="border-t border-white/[0.06] px-4 py-4">
          <div className="grid grid-cols-4 gap-1.5">
            {pipe.map((label, i) => {
              const reached = i <= dealAt;
              const isDeal = i === dealAt;
              const isWon = i === pipe.length - 1 && dealAt >= pipe.length - 1;
              return (
                <div key={label ?? i} className="min-w-0">
                  <div
                    className="h-[3px] w-full rounded-full transition-colors duration-500"
                    style={{
                      background: isWon
                        ? HERO_TEAL
                        : reached
                          ? HERO_ACCENT
                          : "rgba(255,255,255,0.1)",
                    }}
                  />
                  <div className="mt-2 flex items-center gap-1">
                    {isDeal ? (
                      <motion.span
                        layoutId={`crm-deal-${cycle}`}
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: isWon ? HERO_TEAL : HERO_ACCENT, boxShadow: `0 0 8px ${isWon ? HERO_TEAL : HERO_ACCENT}` }}
                        transition={{ type: "spring", stiffness: 90, damping: 18 }}
                      />
                    ) : (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/15" />
                    )}
                    <span
                      className="truncate text-[10px] font-medium tracking-tight transition-colors duration-500"
                      style={{ color: reached ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)" }}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* stat strip */}
        <div className="grid grid-cols-2 gap-px border-t border-white/[0.06] bg-white/[0.04] sm:grid-cols-2">
          {chips.slice(0, 2).map((c) => (
            <div key={c.k} className="px-4 py-3" style={{ background: "#0b0e13" }}>
              <div className="text-[9.5px] uppercase tracking-[0.1em] text-white/40">{c.k}</div>
              <div className="mt-1 truncate font-mono text-[12px] font-medium text-white/85">{c.v}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

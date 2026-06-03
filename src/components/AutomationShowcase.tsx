"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/* Automation service demo.
   A self-running "flow" canvas: a trigger fires, a data packet travels through
   the processing steps, each lighting up as the packet reaches it, then fans
   out to the destinations. Loops. Pure presentation — labels come from
   services.automation.demo. Matches the other self-contained service demos. */

type Step = { title: string; meta: string };
type Stat = { value: string; label: string };

const GLYPHS = [
  // classify
  <svg key="c" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-full w-full">
    <path d="M4 7h16M4 12h10M4 17h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>,
  // enrich
  <svg key="e" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-full w-full">
    <path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
  </svg>,
  // route to CRM
  <svg key="r" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-full w-full">
    <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
    <path d="M3 9h18M8 13h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>,
  // notify
  <svg key="n" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-full w-full">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.5 21a2 2 0 0 0 3 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>,
];

function StepNode({ step, i, active, done }: { step: Step; i: number; active: boolean; done: boolean }) {
  return (
    <div className="relative flex flex-1 flex-col items-center text-center">
      <motion.div
        animate={{
          scale: active ? 1.06 : 1,
          borderColor: active || done ? "var(--c-accent)" : "var(--color-divider)",
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="grid h-14 w-14 place-items-center rounded-2xl border bg-[color:var(--color-bg-elev)]"
        style={{ boxShadow: active ? "0 10px 30px -12px color-mix(in srgb, var(--c-accent) 55%, transparent)" : "none" }}
      >
        <motion.span
          animate={{ color: active || done ? "var(--c-accent)" : "var(--color-text-3)" }}
          transition={{ duration: 0.35 }}
          className="h-6 w-6"
        >
          {GLYPHS[i % GLYPHS.length]}
        </motion.span>
      </motion.div>
      <p className="mt-3 text-[13.5px] font-semibold tracking-[-0.011em] text-[color:var(--color-text)]">{step.title}</p>
      <p className="mt-0.5 text-[12px] leading-[1.35] text-[color:var(--color-text-3)]">{step.meta}</p>
    </div>
  );
}

function Connector({ filled }: { filled: boolean }) {
  return (
    <div className="relative mx-1 hidden h-[2px] flex-1 self-start md:mt-7 md:block">
      <div className="absolute inset-0 rounded-full bg-[color:var(--color-divider)]" />
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-[color:var(--c-accent)]"
        animate={{ width: filled ? "100%" : "0%" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

export function AutomationShowcase() {
  const t = useTranslations("services.automation");
  const reduce = useReducedMotion();
  const steps = t.raw("demo.steps") as Step[];
  const stats = t.raw("demo.stats") as Stat[];
  const headlineLines = t("demo.headline").split("\n");

  // active === -1 → trigger lit; 0..n-1 → that step; n → all destinations done
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (reduce) {
      setActive(steps.length);
      return;
    }
    const id = setInterval(() => {
      setActive((a) => (a >= steps.length ? -1 : a + 1));
    }, 1100);
    return () => clearInterval(id);
  }, [reduce, steps.length]);

  const triggerLive = active >= -1;

  return (
    <Section pad="default" tone="alt">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("demoEyebrow")}</p>
            <h2 className="mt-3 t-h2">
              {headlineLines.map((l, i) => (
                <span key={i} className="block">{l}</span>
              ))}
            </h2>
            <p className="mx-auto mt-5 max-w-[600px] t-body-lg">{t("demo.subhead")}</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mx-auto mt-12 max-w-[920px] rounded-[28px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg)] p-6 shadow-[var(--shadow-card)] md:mt-16 md:p-10">
            {/* Trigger */}
            <div className="flex items-center gap-3">
              <motion.span
                animate={{ scale: triggerLive ? [1, 1.5, 1] : 1, opacity: triggerLive ? 1 : 0.4 }}
                transition={{ duration: 1, repeat: reduce ? 0 : Infinity, ease: "easeInOut" }}
                className="h-2.5 w-2.5 rounded-full bg-[color:var(--c-accent)]"
              />
              <div>
                <p className="text-[14px] font-semibold tracking-[-0.011em] text-[color:var(--color-text)]">
                  {t("demo.trigger.title")}
                </p>
                <p className="text-[12.5px] text-[color:var(--color-text-3)]">{t("demo.trigger.meta")}</p>
              </div>
              <span className="ml-auto rounded-full border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.06em] text-[color:var(--color-text-3)]">
                {t("demo.badge")}
              </span>
            </div>

            <div className="my-7 h-px bg-[color:var(--c-hairline)]" />

            {/* Flow */}
            <div className="flex flex-col items-stretch gap-6 md:flex-row md:items-start md:gap-0">
              {steps.map((step, i) => (
                <div key={step.title} className="flex flex-1 items-center md:contents">
                  <StepNode step={step} i={i} active={active === i} done={active > i} />
                  {i < steps.length - 1 && <Connector filled={active > i} />}
                </div>
              ))}
            </div>

            <div className="my-7 h-px bg-[color:var(--c-hairline)]" />

            {/* Outcome stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-[clamp(20px,2.6vw,30px)] font-semibold tracking-[-0.02em] text-[color:var(--color-text)]">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[12px] leading-[1.35] text-[color:var(--color-text-3)]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

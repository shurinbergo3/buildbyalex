"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

type TypeKey = "website" | "ai" | "mobile" | "other";
const TYPE_KEYS: TypeKey[] = ["website", "ai", "mobile", "other"];

type Step = { title: string; body: string };

/* Phases drive the little "your request travels and lands on Alex's phone"
   sequence — the signature on-brand payoff that mirrors what Alex builds. */
type Phase = "sending" | "delivered";

export function ThankYouExperience({
  name: rawName = "",
  type: typeParam = "",
}: {
  name?: string;
  type?: string;
}) {
  const t = useTranslations("thankYou");
  const tForm = useTranslations("contact.form");

  const name = rawName.trim() ? rawName.trim().split(/\s+/)[0].slice(0, 28) : "";
  const typeKey = TYPE_KEYS.includes(typeParam as TypeKey)
    ? (typeParam as TypeKey)
    : null;
  const projectLabel = typeKey
    ? tForm(`typeOptions.${typeKey}`)
    : t("phone.fallbackProject");

  const steps = t.raw("steps") as Step[];

  const [phase, setPhase] = useState<Phase>("sending");
  const [confetti, setConfetti] = useState(false);
  // Show the visitor's own device time on the mock phone. Seeded with a stable
  // value so SSR and first client render match, then set to the real time.
  const [clock, setClock] = useState("9:41");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    setClock(fmt());
    const id = setInterval(() => setClock(fmt()), 30_000);
    return () => clearInterval(id);
  }, []);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setPhase("delivered");
      return;
    }
    const t1 = setTimeout(() => setPhase("delivered"), 1150);
    const t2 = setTimeout(() => setConfetti(true), 1150);
    const t3 = setTimeout(() => setConfetti(false), 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [reduceMotion]);

  const delivered = phase === "delivered";

  return (
    <section className="relative overflow-hidden">
      {/* Ambient warm glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in srgb, var(--c-accent) 14%, transparent), transparent 70%)",
        }}
      />

      {confetti && !reduceMotion && <Confetti />}

      <Container size="md" className="py-20 text-center md:py-28">
        {/* Success seal — radiating rings + drawn checkmark */}
        <div className="relative mx-auto mb-8 grid h-20 w-20 place-items-center">
          <span className="ty-seal-ring" aria-hidden />
          <span className="ty-seal-ring ty-seal-ring--2" aria-hidden />
          <span
            className="relative grid h-20 w-20 place-items-center rounded-full text-white"
            style={{
              background:
                "linear-gradient(150deg, var(--c-accent-hover) 0%, var(--c-accent) 55%, var(--c-accent-ink) 100%)",
              boxShadow:
                "0 18px 40px -12px color-mix(in srgb, var(--c-accent) 60%, transparent), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            <svg
              width="38"
              height="38"
              viewBox="0 0 28 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path className="ty-check" d="M6 14.5l5.5 5.5L23 8.5" />
            </svg>
          </span>
        </div>

        <p className="t-eyebrow">{t("eyebrow")}</p>
        <h1 className="mt-3 t-h1">
          {name ? (
            <>
              {t("headlineLead")}{" "}
              <span className="hl-accent">{name}</span>
              {t("headlineTail")}
            </>
          ) : (
            t("headline")
          )}
        </h1>
        <p className="mx-auto mt-5 max-w-[520px] t-body-lg">{t("lead")}</p>

        {/* ETA chip */}
        <div className="mt-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] px-4 py-2 text-[13.5px] shadow-[var(--shadow-card)]">
            <ClockIcon />
            <span className="text-[color:var(--color-text-2)]">{t("eta.label")}</span>
            <span className="font-semibold text-[color:var(--color-text)]">{t("eta.value")}</span>
          </span>
        </div>

        {/* Signal → phone: the on-brand payoff */}
        <div className="mx-auto mt-14 max-w-[340px]">
          <Beam delivered={delivered} reduceMotion={reduceMotion} />
          <PhoneCard
            delivered={delivered}
            time={clock}
            name={name || t("phone.fallbackName")}
            project={projectLabel}
            app={t("phone.app")}
            now={t("phone.now")}
            preview={t("phone.preview")}
          />
          <p className="mt-5 inline-flex items-center gap-2 text-[13px] text-[color:var(--color-text-3)]">
            <span className="ty-live-dot" aria-hidden />
            {t("delivered")}
          </p>
        </div>

        {/* What happens next */}
        <div className="mx-auto mt-20 max-w-[760px] text-left">
          <h2 className="text-center t-h3">{t("stepsTitle")}</h2>
          <ol className="mt-8 grid gap-px overflow-hidden rounded-[var(--r-xl)] border border-[color:var(--c-hairline)] bg-[color:var(--c-hairline)] sm:grid-cols-3">
            {steps.map((step, i) => (
              <li
                key={i}
                className="flex flex-col gap-3 bg-[color:var(--color-bg-elev)] p-6"
              >
                <span
                  className={
                    "grid h-9 w-9 place-items-center rounded-full text-[14px] font-semibold tabular-nums " +
                    (i === 0
                      ? "bg-[color:var(--c-accent)] text-white"
                      : "border border-[color:var(--c-hairline)] text-[color:var(--color-text-3)]")
                  }
                >
                  {i === 0 ? <CheckMini /> : <span className="ty-step-pulse">{i + 1}</span>}
                </span>
                <p className="text-[15.5px] font-semibold text-[color:var(--color-text)]">
                  {step.title}
                </p>
                <p className="text-[14px] leading-[1.55] text-[color:var(--color-text-2)]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Meanwhile */}
        <div className="mt-16">
          <p className="text-[13px] uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">
            {t("meanwhileTitle")}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button href="/work" variant="secondary" size="lg">
              {t("meanwhile.work")}
            </Button>
            <Button href="/services" variant="ghost" size="lg">
              {t("meanwhile.services")}
            </Button>
            <Button href="/" variant="ghost" size="lg">
              {t("back")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Beam: a pulse that races down into the phone, settles once delivered ── */
function Beam({ delivered, reduceMotion }: { delivered: boolean; reduceMotion: boolean }) {
  return (
    <div className="relative mx-auto mb-3 h-12 w-px overflow-hidden">
      <span
        className="absolute inset-0"
        style={{
          background: delivered
            ? "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--c-accent) 40%, transparent))"
            : "color-mix(in srgb, var(--c-accent) 22%, transparent)",
        }}
      />
      {!reduceMotion && !delivered && (
        <motion.span
          className="absolute left-1/2 top-0 h-5 w-[3px] -translate-x-1/2 rounded-full"
          style={{
            background: "var(--c-accent)",
            boxShadow: "0 0 12px var(--c-accent)",
          }}
          initial={{ y: -20 }}
          animate={{ y: 48 }}
          transition={{ duration: 0.55, ease: "easeIn", repeat: Infinity }}
        />
      )}
    </div>
  );
}

/* ── PhoneCard: lock screen with the freshly arrived request notification ── */
function PhoneCard({
  delivered,
  time,
  name,
  project,
  app,
  now,
  preview,
}: {
  delivered: boolean;
  time: string;
  name: string;
  project: string;
  app: string;
  now: string;
  preview: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 40%, rgba(255,122,45,0.18), transparent 70%)",
          filter: "blur(28px)",
        }}
      />
      <div
        className="relative overflow-hidden rounded-[44px] p-[3px] shadow-[0_40px_90px_-25px_rgba(0,0,0,0.7)]"
        style={{
          background:
            "linear-gradient(150deg, #3a3a3d 0%, #161617 35%, #161617 65%, #4a4a4d 100%)",
        }}
      >
        <div className="relative aspect-[300/560] overflow-hidden rounded-[41px] bg-[#0a0a0b]">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 0%, #1c1408 0%, #0d0a06 38%, #08080a 100%)",
            }}
          />
          {/* status bar */}
          <div className="relative flex items-center justify-between px-7 pt-3 text-[12px] font-semibold text-white">
            <span className="tracking-[-0.02em] tabular-nums">{time}</span>
            <span className="flex items-center gap-1.5" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            </span>
          </div>
          {/* dynamic island */}
          <div className="absolute left-1/2 top-2.5 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />
          {/* clock */}
          <div className="relative mt-7 text-center text-white">
            <p className="text-[60px] font-semibold leading-none tracking-[-0.03em] tabular-nums">{time}</p>
          </div>

          {/* notification */}
          <div className="relative mt-8 px-3">
            <AnimatePresence>
              {delivered && (
                <motion.div
                  initial={{ opacity: 0, y: -22, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="overflow-hidden rounded-[20px] border border-white/[0.1] bg-white/[0.08] px-3 py-2.5 backdrop-blur-xl"
                  style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)" }}
                >
                  <div className="flex items-center gap-2">
                    <AppIcon />
                    <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/55">
                      {app}
                    </span>
                    <span className="ml-auto text-[10.5px] font-medium text-white/40">
                      {now}
                    </span>
                  </div>
                  <div className="mt-1.5 text-[13px] font-semibold leading-none text-white">
                    {name}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#ff7a2d]/15 px-1.5 py-0.5 text-[10px] font-medium leading-none text-[#ffae7e]">
                      <span className="h-1 w-1 rounded-full bg-[#ff9a5a]" />
                      {project}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-[1.45] text-white/75">
                    {preview}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute inset-x-0 bottom-2 flex justify-center">
            <span className="h-[5px] w-[110px] rounded-full bg-white/35" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AppIcon() {
  return (
    <span
      className="relative grid h-[18px] w-[18px] place-items-center rounded-[6px] font-semibold leading-none tracking-[-0.04em] text-white"
      style={{
        background: "linear-gradient(150deg, #ffb56b 0%, #ff7a2d 55%, #e8590c 100%)",
        boxShadow: "0 1px 3px rgba(232,89,12,0.4), inset 0 1px 0 rgba(255,255,255,0.35)",
        fontSize: "12px",
      }}
      aria-hidden
    >
      b
      {/* signature amber/white dot from the buildbyalex wordmark */}
      <span className="absolute bottom-[3.5px] right-[3px] h-[2.5px] w-[2.5px] rounded-full bg-white" />
    </span>
  );
}

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-[color:var(--c-accent)]" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckMini() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

/* ── One-shot amber confetti burst from the top of the page ── */
function Confetti() {
  const pieces = useMemo(() => {
    const colors = ["#FF6B1A", "#FF7C36", "#FFB386", "#FFD27A", "#FFFFFF"];
    return Array.from({ length: 34 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2.4 + Math.random() * 1.4,
      rotate: Math.random() * 360,
      size: 6 + Math.random() * 6,
      color: colors[i % colors.length],
      drift: (Math.random() - 0.5) * 120,
      round: Math.random() > 0.6,
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="ty-confetti absolute top-[-24px]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.4,
            background: p.color,
            borderRadius: p.round ? "9999px" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--cf-drift" as string]: `${p.drift}px`,
            ["--cf-rot" as string]: `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}

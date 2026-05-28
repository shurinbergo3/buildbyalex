"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";

type Lead = {
  name: string;
  phone: string;
  service: string;
  date: string;
  preview: string;
  elapsed: string;
};

type Phase = "idle" | "typing-name" | "typing-phone" | "typing-service" | "typing-date" | "submitting" | "delivered" | "resting";

const FIELD_SEQUENCE: { key: keyof Pick<Lead, "name" | "phone" | "service" | "date">; phase: Extract<Phase, `typing-${string}`> }[] = [
  { key: "name", phase: "typing-name" },
  { key: "phone", phase: "typing-phone" },
  { key: "service", phase: "typing-service" },
  { key: "date", phase: "typing-date" },
];

const CHAR_DELAY_MS = 35;
const FIELD_PAUSE_MS = 350;
const SUBMIT_HOLD_MS = 900;
const DELIVERED_HOLD_MS = 3200;
const REST_MS = 800;

export function InstantLeadMock() {
  const t = useTranslations("work.caseShowcase.visionair.lead");
  const leads = useMemo(() => t.raw("leads") as Lead[], [t]);
  const form = t.raw("form") as {
    title: string;
    subtitle: string;
    fields: { name: string; phone: string; service: string; date: string };
    submit: string;
    sending: string;
    sent: string;
  };
  const phone = t.raw("phone") as {
    lockTime: string;
    app: string;
    elapsedLabel: string;
    tag: string;
  };

  const [leadIndex, setLeadIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState<{ name: string; phone: string; service: string; date: string }>({
    name: "",
    phone: "",
    service: "",
    date: "",
  });
  const [elapsedTick, setElapsedTick] = useState(0);

  const lead = leads[leadIndex];

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(() => !cancelled && fn(), ms);
      timers.push(id);
    };

    setTyped({ name: "", phone: "", service: "", date: "" });
    setPhase("idle");
    setElapsedTick(0);

    let cursor = 500;
    for (const { key, phase: ph } of FIELD_SEQUENCE) {
      schedule(() => setPhase(ph), cursor);
      const text = lead[key];
      for (let i = 1; i <= text.length; i++) {
        const slice = text.slice(0, i);
        schedule(() => setTyped((prev) => ({ ...prev, [key]: slice })), cursor);
        cursor += CHAR_DELAY_MS;
      }
      cursor += FIELD_PAUSE_MS;
    }

    schedule(() => setPhase("submitting"), cursor);
    cursor += 200;

    // Timer counter while submitting
    const submitStart = cursor;
    const targetMs = parseElapsedMs(lead.elapsed);
    const tickStep = 40;
    for (let t = tickStep; t <= targetMs; t += tickStep) {
      schedule(() => setElapsedTick(t), submitStart + t);
    }
    cursor = submitStart + targetMs;

    schedule(() => {
      setElapsedTick(targetMs);
      setPhase("delivered");
    }, cursor);

    cursor += DELIVERED_HOLD_MS;
    schedule(() => setPhase("resting"), cursor);
    cursor += REST_MS;
    schedule(() => setLeadIndex((i) => (i + 1) % leads.length), cursor);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [leadIndex, leads, lead]);

  return (
    <div className="relative mx-auto w-full max-w-[960px]">
      <div className="grid items-stretch gap-8 md:grid-cols-[1fr_auto_320px] md:gap-10">
        {/* Form (browser frame) */}
        <div
          className="relative overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgba(20,30,50,0.35),0_0_0_1px_rgba(0,0,0,0.06)]"
          style={{ background: "#ffffff" }}
        >
          <div
            className="flex items-center gap-3 border-b border-black/5 px-4 py-3"
            style={{ background: "#f5f5f7" }}
          >
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="mx-auto flex max-w-[360px] flex-1 items-center gap-2 rounded-full bg-white px-3 py-1 text-[12px] text-[#5f6368]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 1 1 6 0v3H9z"
                  fill="currentColor"
                />
              </svg>
              <span className="truncate">visionair.biz.pl</span>
            </div>
            <div className="w-12" />
          </div>

          <div className="px-7 py-7">
            <div className="text-[20px] font-semibold leading-tight text-[#0e1117]">
              {form.title}
            </div>
            <p className="mt-1.5 text-[13.5px] text-[#5f6368]">{form.subtitle}</p>

            <div className="mt-6 space-y-3.5">
              <Field
                label={form.fields.name}
                value={typed.name}
                active={phase === "typing-name"}
              />
              <Field
                label={form.fields.phone}
                value={typed.phone}
                active={phase === "typing-phone"}
              />
              <Field
                label={form.fields.service}
                value={typed.service}
                active={phase === "typing-service"}
              />
              <Field
                label={form.fields.date}
                value={typed.date}
                active={phase === "typing-date"}
              />
            </div>

            <button
              className={`mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-[14.5px] font-medium text-white transition-colors ${
                phase === "submitting"
                  ? "bg-[#ff8c3a]"
                  : phase === "delivered" || phase === "resting"
                  ? "bg-[#0cce6b]"
                  : "bg-[#ff6b1a]"
              }`}
              style={{
                boxShadow: phase === "typing-date" || phase === "submitting" ? "0 0 0 4px rgba(255,107,26,0.18)" : "none",
                transition: "box-shadow 200ms ease",
              }}
            >
              {phase === "submitting" ? (
                <>
                  <Spinner />
                  <span>{form.sending}</span>
                </>
              ) : phase === "delivered" || phase === "resting" ? (
                <span>{form.sent}</span>
              ) : (
                <span>{form.submit}</span>
              )}
            </button>
          </div>
        </div>

        {/* Connector */}
        <div className="relative hidden flex-col items-center justify-center md:flex">
          <Connector phase={phase} elapsedMs={elapsedTick} elapsedLabel={phone.elapsedLabel} />
        </div>

        {/* Phone */}
        <div className="relative mx-auto w-full max-w-[300px] md:mx-0">
          <Phone
            phase={phase}
            lead={lead}
            lockTime={phone.lockTime}
            app={phone.app}
            tag={phone.tag}
          />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-white px-3.5 py-2.5 transition-all ${
        active
          ? "border-[#ff6b1a] shadow-[0_0_0_3px_rgba(255,107,26,0.12)]"
          : value
          ? "border-[#0cce6b]/40"
          : "border-black/10"
      }`}
    >
      <div className="text-[10.5px] uppercase tracking-wider text-[#5f6368]">
        {label}
      </div>
      <div className="flex items-center text-[14px] text-[#0e1117]">
        <span>{value || " "}</span>
        {active && (
          <span className="ml-0.5 inline-block h-[14px] w-[1.5px] bg-[#ff6b1a]" style={{ animation: "ilBlink 850ms steps(2) infinite" }} />
        )}
      </div>
      <style>{`@keyframes ilBlink { 50% { opacity: 0; } }`}</style>
    </div>
  );
}

function Connector({
  phase,
  elapsedMs,
  elapsedLabel,
}: {
  phase: Phase;
  elapsedMs: number;
  elapsedLabel: string;
}) {
  const sending = phase === "submitting";
  const delivered = phase === "delivered" || phase === "resting";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-[140px] w-px overflow-hidden">
        <span
          className={`absolute inset-x-0 top-0 h-full ${
            delivered ? "bg-[#0cce6b]/50" : "bg-[#ff6b1a]/30"
          }`}
        />
        {(sending || delivered) && (
          <motion.span
            key={`${phase}-${elapsedMs}`}
            className="absolute left-1/2 top-0 h-6 w-[3px] -translate-x-1/2 rounded-full"
            style={{
              background: delivered ? "#0cce6b" : "#ff6b1a",
              boxShadow: `0 0 12px ${delivered ? "#0cce6b" : "#ff6b1a"}`,
            }}
            initial={{ y: -24 }}
            animate={{ y: 140 }}
            transition={{ duration: 0.7, ease: "easeIn", repeat: sending ? Infinity : 0 }}
          />
        )}
      </div>

      <div
        className={`flex flex-col items-center rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors ${
          delivered
            ? "bg-[#0cce6b]/10 text-[#0a8a4d]"
            : sending
            ? "bg-[#ff6b1a]/10 text-[#c44a00]"
            : "bg-black/5 text-[#5f6368]"
        }`}
      >
        <span>{elapsedLabel}</span>
        <span className="text-[16px] font-semibold tabular-nums">
          {formatElapsed(elapsedMs)}
        </span>
      </div>
    </div>
  );
}

function Phone({
  phase,
  lead,
  lockTime,
  app,
  tag,
}: {
  phase: Phase;
  lead: Lead;
  lockTime: string;
  app: string;
  tag: string;
}) {
  const showNotification = phase === "delivered" || phase === "resting";

  return (
    <div
      className="relative rounded-[42px] p-[8px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.04)]"
      style={{
        background: "linear-gradient(160deg, #1a1d24 0%, #0c0e12 55%, #1a1d24 100%)",
      }}
    >
      <div
        className="relative overflow-hidden rounded-[34px]"
        style={{
          height: 540,
          background:
            "linear-gradient(180deg, #0a0c12 0%, #1a1f2e 35%, #2a3b52 70%, #1a3050 100%)",
        }}
      >
        {/* Notch */}
        <div className="pointer-events-none absolute left-1/2 top-2 z-30 flex h-6 w-[100px] -translate-x-1/2 items-center justify-center rounded-b-2xl bg-black">
          <div className="h-1.5 w-10 rounded-full bg-[#2a2d33]" />
        </div>

        {/* Status bar */}
        <div className="relative z-20 flex items-center justify-between px-5 pt-3 pb-1 text-[10.5px] font-medium text-white/90">
          <span>{lockTime}</span>
          <div className="flex items-center gap-1">
            <svg width="14" height="9" viewBox="0 0 18 10" fill="currentColor">
              <rect x="0" y="7" width="3" height="3" rx="0.5" />
              <rect x="5" y="5" width="3" height="5" rx="0.5" />
              <rect x="10" y="2" width="3" height="8" rx="0.5" />
              <rect x="15" y="0" width="3" height="10" rx="0.5" />
            </svg>
            <svg width="20" height="9" viewBox="0 0 26 12" fill="none">
              <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" strokeOpacity="0.5" />
              <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Lock screen time */}
        <div className="relative z-10 flex flex-col items-center pt-12 text-white">
          <div className="text-[14px] font-medium tracking-wider opacity-80">
            {weekdayLabel(lockTime)}
          </div>
          <div className="mt-1 text-[72px] font-extralight leading-none tabular-nums">
            {lockTime}
          </div>
        </div>

        {/* Notification slot */}
        <div className="absolute inset-x-3 top-[200px] z-20">
          <AnimatePresence>
            {showNotification && (
              <motion.div
                key={lead.name}
                initial={{ y: -120, opacity: 0, scale: 0.94 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="rounded-2xl border border-white/10 px-3 py-2.5 backdrop-blur-md"
                style={{ background: "rgba(28,30,38,0.72)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[#2ea6ea] to-[#1e88c8]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="m3 11 18-7-3 17-6-4-2 5-2-7-5-4Z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="truncate text-[12px] font-semibold text-white">
                        {app}
                      </span>
                      <span className="text-[10px] text-white/60">now</span>
                    </div>
                    <div className="text-[10.5px] text-white/55">{tag}</div>
                  </div>
                </div>
                <div className="mt-1.5 text-[12.5px] font-semibold text-white">
                  {lead.name} · {lead.service}
                </div>
                <div className="mt-0.5 text-[11.5px] leading-snug text-white/75 line-clamp-3">
                  {lead.preview}
                </div>
                <div className="mt-1.5 flex items-center gap-3 text-[10.5px] text-white/60">
                  <span>{lead.phone}</span>
                  <span>·</span>
                  <span>{lead.date}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Home indicator */}
        <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-30 h-1 w-24 -translate-x-1/2 rounded-full bg-white/40" />
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function parseElapsedMs(elapsed: string): number {
  const m = elapsed.match(/([\d.,]+)\s*s/);
  if (!m) return 1400;
  const v = parseFloat(m[1].replace(",", "."));
  return Math.round(v * 1000);
}

function formatElapsed(ms: number): string {
  const s = ms / 1000;
  return `${s.toFixed(1).replace(".", ",")} s`;
}

function weekdayLabel(_lockTime: string): string {
  return new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
}

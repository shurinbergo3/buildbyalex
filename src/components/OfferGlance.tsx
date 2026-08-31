"use client";

import { motion, useReducedMotion } from "motion/react";

/* ─────────────────────────────────────────────────────────────────────────
   Hero glance for a fixed-price offer — a finished deliverable, not a teaser.
   Every offer hands the client the same artifact: a verdict sheet. Findings on
   the left, the state on the right, one number that decides whether to act at
   the bottom. Copy comes from messages so each offer fills it with its own real
   rows (processes and their leak, documents and their route, AI Act articles
   and their status, prompts and who the model names instead of you).
   ───────────────────────────────────────────────────────────────────────── */

export type GlanceState = "ok" | "warn" | "bad";

export type GlanceRow = {
  label: string;
  value: string;
  state: GlanceState;
  /** Optional second line under the label — the concrete detail behind a verdict. */
  detail?: string;
};

export type GlanceData = {
  title: string;
  caption: string;
  rows: GlanceRow[];
  totalLabel: string;
  totalValue: string;
  note: string;
};

const TONE: Record<GlanceState, { dot: string; text: string; bg: string; border: string }> = {
  ok: { dot: "#34d27b", text: "#7fe3a6", bg: "rgba(52,210,123,0.10)", border: "rgba(52,210,123,0.28)" },
  warn: { dot: "#FFB020", text: "#ffcd75", bg: "rgba(255,176,32,0.10)", border: "rgba(255,176,32,0.28)" },
  bad: { dot: "#FF6B4A", text: "#ffab93", bg: "rgba(255,107,74,0.10)", border: "rgba(255,107,74,0.30)" },
};

export function OfferGlance({ data }: { data: GlanceData }) {
  const reduce = useReducedMotion();

  return (
    <div
      className="relative overflow-hidden rounded-[22px] border border-white/10 backdrop-blur-xl"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.02))",
        boxShadow: "0 34px 80px -34px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-white/[0.07] px-4 py-3.5">
        <span className="truncate text-[12.5px] font-semibold tracking-[-0.01em] text-white/85">
          {data.title}
        </span>
        <span className="flex-none text-[10.5px] uppercase tracking-[0.09em] text-white/40">
          {data.caption}
        </span>
      </header>

      <ul className="divide-y divide-white/[0.055] px-4">
        {data.rows.map((row, i) => {
          const tone = TONE[row.state];
          return (
            <motion.li
              key={row.label}
              className="flex items-start gap-3 py-3"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: reduce ? 0 : i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="mt-[7px] h-[7px] w-[7px] flex-none rounded-full"
                style={{ background: tone.dot, boxShadow: `0 0 0 3px ${tone.bg}` }}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-medium leading-[1.35] text-white/85">{row.label}</span>
                {row.detail && (
                  <span className="mt-0.5 block text-[11px] leading-[1.4] text-white/45">{row.detail}</span>
                )}
              </span>
              <span
                className="flex-none rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums"
                style={{ color: tone.text, background: tone.bg, border: `1px solid ${tone.border}` }}
              >
                {row.value}
              </span>
            </motion.li>
          );
        })}
      </ul>

      <div className="mx-4 flex items-baseline justify-between gap-3 border-t border-white/[0.09] py-3.5">
        <span className="text-[11.5px] text-white/55">{data.totalLabel}</span>
        <span
          className="text-[19px] font-semibold tracking-[-0.03em] tabular-nums"
          style={{
            background: "linear-gradient(165deg,#fff,#ffb487)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {data.totalValue}
        </span>
      </div>

      <p className="border-t border-white/[0.055] px-4 py-3 text-[11px] leading-[1.45] text-white/45">
        {data.note}
      </p>
    </div>
  );
}

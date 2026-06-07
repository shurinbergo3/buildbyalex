"use client";

import type { ReactNode } from "react";
import { useMessages, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "./Container";
import { Section } from "./Section";
import { Button } from "./Button";

/* ─────────────────────────────────────────────────────────────────────────
   Service hero — cinematic "key-art" stage shared by all six service pages.
   A dark, contained panel (matching the case-cover aesthetic: amber aurora,
   dot-grid, specular edge, faux chrome) with the selling copy on the left and
   a live, per-branch product glance on the right. The glance is deliberately
   a *teaser* — a compact, distinct surface — so it doesn't duplicate the full
   animated showcase that follows lower on the page.
   ───────────────────────────────────────────────────────────────────────── */

type Branch = "websites" | "ai" | "automation" | "mobile" | "telegram" | "ads";
type Metric = { v: string; l: string };

type HeroShape = {
  services: Record<
    Branch,
    {
      eyebrow: string;
      headline: string;
      lead: string;
      from: string;
      primaryCta: string;
      stack: { items: string[] };
      hero: { badge: string; metrics: Metric[]; mock: Record<string, unknown> };
    }
  >;
};

const AMBER = "#FF7A2D";

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 / 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M8 1.5l1.96 4.27 4.7.55-3.5 3.2.96 4.62L8 11.9l-4.12 2.24.96-4.62-3.5-3.2 4.7-.55L8 1.5z"
            fill={AMBER}
          />
        </svg>
      ))}
    </div>
  );
}

/* ── Shared glass surface for the right-side glance ── */
function Glass({
  label,
  live,
  children,
}: {
  label: ReactNode;
  live?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[22px] border border-white/10 backdrop-blur-xl"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.02))",
        boxShadow:
          "0 34px 80px -34px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
    >
      <header className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-[9px] w-[9px] rounded-full bg-[#FF5F57]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[#FEBC2E]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[#28C840]" />
        </span>
        <span className="ml-1.5 truncate text-[11.5px] font-medium tracking-[-0.01em] text-white/55">
          {label}
        </span>
        {live && (
          <span className="ml-auto flex items-center gap-1.5 text-[10.5px] font-medium text-[#7CE2A6]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34d27b] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34d27b]" />
            </span>
            live
          </span>
        )}
      </header>
      <div className="relative p-4">{children}</div>
    </div>
  );
}

function Chip({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0c0c0f]/85 px-3 py-1.5 text-[12px] font-medium text-white/85 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/* ════════════════════ Per-branch glances ════════════════════ */

function WebsitesMock({ m }: { m: Record<string, unknown> }) {
  const features = (m.features as string[]) ?? [];
  return (
    <div className="relative pb-6 pl-6 pt-7">
      <Glass label={m.url as string}>
        <div className="rounded-xl bg-gradient-to-b from-white/[0.04] to-transparent p-3.5">
          {/* faux nav */}
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: AMBER }} />
            <span className="h-1.5 w-12 rounded-full bg-white/25" />
            <span className="ml-auto flex gap-2">
              <span className="h-1.5 w-7 rounded-full bg-white/12" />
              <span className="h-1.5 w-7 rounded-full bg-white/12" />
              <span className="h-4 w-12 rounded-full" style={{ background: AMBER, opacity: 0.85 }} />
            </span>
          </div>
          {/* hero block */}
          <div className="mt-5">
            <span className="block h-3 w-[78%] rounded-full bg-white/85" />
            <span className="mt-2 block h-3 w-[56%] rounded-full bg-white/55" />
            <span className="mt-3 block h-1.5 w-[68%] rounded-full bg-white/20" />
            <span className="mt-1.5 block h-1.5 w-[48%] rounded-full bg-white/20" />
            <span
              className="mt-4 inline-block h-6 w-24 rounded-full"
              style={{ background: AMBER }}
            />
          </div>
          {/* feature row */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {features.map((f, i) => (
              <div key={i} className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
                <span className="block h-1.5 w-5 rounded-full" style={{ background: AMBER, opacity: 0.7 }} />
                <span className="mt-1.5 block text-[8.5px] font-medium leading-tight text-white/55">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </Glass>

      {/* floating proof chips */}
      <Chip className="absolute left-0 top-1" style={{ borderColor: "rgba(255,122,45,0.3)" }}>
        <GoogleG />
        <span className="font-semibold text-white">{m.serp as string}</span>
      </Chip>
      <Chip className="absolute -bottom-1 right-2 !px-3.5 !py-2">
        <span
          className="grid h-8 w-8 place-items-center rounded-full text-[13px] font-bold text-[#0a0a0a]"
          style={{ background: "conic-gradient(#34d27b 0 100%, #1d1d20 0)", boxShadow: "inset 0 0 0 3px #0c0c0f" }}
        >
          <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-[#0c0c0f] text-white">100</span>
        </span>
        <span className="text-[11px] leading-tight text-white/70">{m.score as string}</span>
      </Chip>
    </div>
  );
}

function AiMock({ m }: { m: Record<string, unknown> }) {
  return (
    <Glass label={m.agent as string} live>
      <div className="flex flex-col gap-2.5">
        {/* incoming */}
        <div className="max-w-[82%] self-start rounded-2xl rounded-tl-md bg-white/[0.08] px-3.5 py-2.5 text-[12.5px] leading-[1.4] text-white/85">
          {m.q as string}
        </div>
        {/* outgoing (agent) */}
        <div
          className="max-w-[86%] self-end rounded-2xl rounded-tr-md px-3.5 py-2.5 text-[12.5px] leading-[1.4] text-white"
          style={{ background: "linear-gradient(160deg, #FF7A2D, #E8590C)" }}
        >
          {m.a as string}
        </div>
        {/* outcome */}
        <div className="self-end inline-flex items-center gap-1.5 rounded-full border border-[#34d27b]/25 bg-[#34d27b]/10 px-2.5 py-1 text-[11px] font-medium text-[#9beabf]">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4 4 10-10" stroke="#34d27b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {m.outcome as string}
        </div>
        {/* typing */}
        <div className="mt-0.5 inline-flex items-center gap-1 self-start rounded-full bg-white/[0.06] px-3 py-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-white/45"
              style={{ animation: `aiTyping 1.2s ${i * 0.18}s ease-in-out infinite` }}
            />
          ))}
        </div>
      </div>
    </Glass>
  );
}

function AutomationMock({ m }: { m: Record<string, unknown> }) {
  const nodes = (m.nodes as string[]) ?? [];
  return (
    <Glass label={m.flow as string} live>
      <div className="relative pl-1">
        {nodes.map((n, i) => (
          <div key={i} className="relative flex items-center gap-3 pb-3 last:pb-0">
            {/* connector */}
            {i < nodes.length - 1 && (
              <span className="absolute left-[13px] top-7 h-[calc(100%-12px)] w-px bg-gradient-to-b from-[#FF7A2D]/60 to-white/10" />
            )}
            <span
              className="relative z-10 grid h-[26px] w-[26px] flex-none place-items-center rounded-lg border text-[11px] font-semibold"
              style={
                i === nodes.length - 1
                  ? { background: "rgba(52,210,123,0.14)", borderColor: "rgba(52,210,123,0.4)", color: "#9beabf" }
                  : { background: "rgba(255,122,45,0.12)", borderColor: "rgba(255,122,45,0.35)", color: "#ffb487" }
              }
            >
              {i + 1}
            </span>
            <div className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[12.5px] font-medium text-white/85">
              {n}
            </div>
          </div>
        ))}
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#34d27b]/25 bg-[#34d27b]/10 px-3 py-1.5 text-[11.5px] font-medium text-[#9beabf]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4 4 10-10" stroke="#34d27b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {m.done as string}
        </div>
      </div>
    </Glass>
  );
}

/* Apple + Android glyphs — reused as big outline marks and small badge logos */
const APPLE_PATH =
  "M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z";
const ANDROID_PATH =
  "M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993s-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993s-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396";
const PLAY_PATH =
  "M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.808 1.626L15.39 12l2.508-2.492zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z";

function StoreBadge({ kind, sub, name }: { kind: "apple" | "play"; sub: string; name: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-[#0b0b0e]/80 px-3 py-1.5 shadow-[0_14px_34px_-16px_rgba(0,0,0,0.85)] backdrop-blur-md">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden className="flex-none">
        <path d={kind === "apple" ? APPLE_PATH : PLAY_PATH} />
      </svg>
      <span className="text-left leading-none">
        <span className="block text-[7.5px] font-medium uppercase tracking-[0.08em] text-white/50">{sub}</span>
        <span className="mt-0.5 block text-[12px] font-semibold tracking-[-0.01em] text-white">{name}</span>
      </span>
    </div>
  );
}

function MobileMock({ m }: { m: Record<string, unknown> }) {
  return (
    <div className="relative px-4 py-5">
      {/* big outline platform marks — decorative contours behind the device */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute -left-3 -top-1 h-32 w-32 -rotate-[14deg] text-white/[0.09] sm:h-40 sm:w-40"
        fill="none"
        stroke="currentColor"
        strokeWidth={0.45}
        strokeLinejoin="round"
      >
        <path d={APPLE_PATH} />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="pointer-events-none absolute -right-4 bottom-3 h-36 w-36 rotate-[14deg] text-white/[0.09] sm:h-44 sm:w-44"
        fill="none"
        stroke="currentColor"
        strokeWidth={0.4}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d={ANDROID_PATH} />
      </svg>

      <div className="relative mx-auto w-full max-w-[228px]">
        {/* titanium frame */}
        <div
          className="relative overflow-hidden rounded-[38px] p-[3px]"
          style={{
            background: "linear-gradient(150deg, #3a3a3d, #161617 35%, #161617 65%, #4a4a4d)",
            boxShadow: "0 40px 90px -30px rgba(0,0,0,0.8)",
          }}
        >
          <div className="relative aspect-[228/470] overflow-hidden rounded-[35px] bg-[#0a0a0b]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "radial-gradient(120% 80% at 50% 0%, #1c1408, #0d0a06 38%, #08080a)" }}
            />
            {/* status bar */}
            <div className="relative flex items-center justify-between px-5 pt-2.5 text-[10px] font-semibold text-white">
              <span>9:41</span>
              <span className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-white/70" />
                <span className="h-2 w-2 rounded-full bg-white/40" />
              </span>
            </div>
            <div className="absolute left-1/2 top-2 h-[20px] w-[68px] -translate-x-1/2 rounded-full bg-black" />
            {/* app header */}
            <div className="relative mt-5 px-4">
              <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#ffae7e]">
                {m.appName as string}
              </p>
              <p className="mt-1 text-[16px] font-semibold leading-tight text-white">{m.cardTitle as string}</p>
              <p className="mt-1 text-[10.5px] leading-snug text-white/55">{m.cardSub as string}</p>
            </div>
            {/* card */}
            <div className="relative mx-4 mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.05] p-3">
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-lg" style={{ background: "linear-gradient(150deg,#FF7A2D,#E8590C)" }} />
                <span className="flex-1">
                  <span className="block h-1.5 w-16 rounded-full bg-white/45" />
                  <span className="mt-1 block h-1.5 w-10 rounded-full bg-white/20" />
                </span>
              </div>
              <span className="mt-3 block h-1.5 w-full rounded-full bg-white/12" />
              <span className="mt-1.5 block h-1.5 w-3/5 rounded-full bg-white/12" />
            </div>
            {/* CTA */}
            <div className="absolute inset-x-4 bottom-7">
              <div
                className="grid h-9 place-items-center rounded-full text-[12px] font-semibold text-white"
                style={{ background: "linear-gradient(160deg,#FF7A2D,#E8590C)" }}
              >
                {m.cta as string}
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-1.5 flex justify-center">
              <span className="h-[4px] w-[88px] rounded-full bg-white/35" />
            </div>
          </div>
        </div>
      </div>
      <Chip className="absolute right-0 top-3" style={{ borderColor: "rgba(255,122,45,0.3)" }}>
        <span style={{ color: AMBER }}>★</span>
        <span className="font-semibold text-white">{m.rating as string}</span>
      </Chip>

      {/* store badges */}
      <div className="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-2.5">
        <StoreBadge kind="apple" sub="Download on the" name="App Store" />
        <StoreBadge kind="play" sub="Get it on" name="Google Play" />
      </div>
    </div>
  );
}

function TelegramMock({ m }: { m: Record<string, unknown> }) {
  const buttons = (m.buttons as string[]) ?? [];
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#0e1621] backdrop-blur-xl shadow-[0_34px_80px_-34px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)]">
      {/* telegram header */}
      <header className="flex items-center gap-2.5 border-b border-white/[0.06] bg-[#17212b] px-4 py-3">
        <span className="grid h-8 w-8 place-items-center rounded-full" style={{ background: "linear-gradient(160deg,#2AABEE,#229ED9)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M21.9 4.3 18.7 19.5c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9 9-8.1c.4-.3-.1-.5-.6-.2L6.3 13.4l-4.8-1.5c-1-.3-1-1 .2-1.5l18.7-7.2c.9-.3 1.6.2 1.3 1.6Z"/></svg>
        </span>
        <div className="leading-tight">
          <p className="text-[12.5px] font-semibold text-white">{m.bot as string}</p>
          <p className="flex items-center gap-1 text-[10.5px] text-[#7CE2A6]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34d27b]" /> bot · online
          </p>
        </div>
      </header>
      <div className="space-y-2.5 px-3.5 py-4" style={{ background: "linear-gradient(180deg,#0e1621,#0b1219)" }}>
        {/* bot bubble */}
        <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-[#182531] px-3.5 py-2.5 text-[12.5px] leading-[1.4] text-white/90">
          {m.botMsg as string}
        </div>
        {/* inline buttons */}
        <div className="grid grid-cols-2 gap-2">
          {buttons.map((b, i) => (
            <span key={i} className="grid place-items-center rounded-lg bg-[#202b36] px-2 py-2 text-center text-[11px] font-medium text-[#5fc3f2]">
              {b}
            </span>
          ))}
        </div>
        {/* mini-app card */}
        <div className="mt-1 rounded-2xl border border-white/[0.08] bg-[#141d27] p-3">
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-xl" style={{ background: "linear-gradient(150deg,#FF7A2D,#E8590C)" }} />
            <div className="flex-1 leading-tight">
              <p className="text-[12px] font-semibold text-white">{m.appTitle as string}</p>
              <span className="mt-1 block h-1.5 w-16 rounded-full bg-white/20" />
            </div>
          </div>
          <div className="mt-3 grid h-8 place-items-center rounded-lg text-[12px] font-semibold text-white" style={{ background: "linear-gradient(160deg,#FF7A2D,#E8590C)" }}>
            {m.pay as string}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdsMock({ m }: { m: Record<string, unknown> }) {
  const tabs = (m.tabs as string[]) ?? [];
  const kpis = (m.kpis as Metric[]) ?? [];
  const bars = [38, 52, 44, 66, 58, 80, 96];
  return (
    <Glass label={m.dash as string} live>
      {/* tabs */}
      <div className="flex gap-2">
        {tabs.map((tab, i) => (
          <span
            key={i}
            className="rounded-full px-3 py-1 text-[11px] font-medium"
            style={
              i === 0
                ? { background: "rgba(255,122,45,0.16)", color: "#ffb487", border: "1px solid rgba(255,122,45,0.3)" }
                : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }
            }
          >
            {tab}
          </span>
        ))}
      </div>
      {/* ROAS */}
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/45">{m.roasLabel as string}</p>
          <p
            className="mt-1 text-[40px] font-semibold leading-none tracking-[-0.03em]"
            style={{
              background: "linear-gradient(170deg,#fff,#ffb487)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {m.roas as string}
          </p>
        </div>
        {/* mini bar chart */}
        <div className="flex h-14 items-end gap-1.5">
          {bars.map((h, i) => (
            <span
              key={i}
              className="w-2 rounded-t-[3px]"
              style={{
                height: `${h}%`,
                background: i === bars.length - 1 ? AMBER : "rgba(255,122,45,0.32)",
              }}
            />
          ))}
        </div>
      </div>
      {/* KPIs */}
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/[0.07] pt-3">
        {kpis.map((k, i) => (
          <div key={i}>
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-white">{k.v}</p>
            <p className="text-[10px] uppercase tracking-[0.08em] text-white/45">{k.l}</p>
          </div>
        ))}
      </div>
    </Glass>
  );
}

const MOCKS: Record<Branch, (p: { m: Record<string, unknown> }) => ReactNode> = {
  websites: WebsitesMock,
  ai: AiMock,
  automation: AutomationMock,
  mobile: MobileMock,
  telegram: TelegramMock,
  ads: AdsMock,
};

function GoogleG() {
  return (
    <svg width="13" height="13" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.3C39.7 35.4 44 30.2 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

export function ServiceHero({ branch }: { branch: Branch }) {
  const t = useTranslations(`services.${branch}`);
  const tr = useTranslations("home.testimonials");
  const messages = useMessages() as unknown as HeroShape;
  const svc = messages.services[branch];
  const metrics = svc.hero.metrics ?? [];
  const mock = svc.hero.mock ?? {};
  const headlineLines = t("headline").split("\n");
  const stack = svc.stack.items.slice(0, 6);
  const Mock = MOCKS[branch];
  const reduce = useReducedMotion();

  return (
    <Section pad="tight" tone="default" className="!pt-10 md:!pt-14">
      <Container size="default">
        <div
          className="relative isolate overflow-hidden rounded-[26px] px-6 py-9 sm:px-10 sm:py-12 md:rounded-[40px] md:px-14 md:py-16"
          style={{
            background: "#09090B",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 50px 120px -55px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* key-art layers (reused from the case-cover system) */}
          <div aria-hidden className="case-cover-aurora" />
          <div aria-hidden className="case-cover-grid" />
          <div aria-hidden className="case-cover-edge" />

          {/* live badge */}
          <div className="case-cta-chip absolute right-5 top-5 z-20 hidden sm:inline-flex">
            <span className="case-cta-chip-dot" />
            {svc.hero.badge}
          </div>

          <div className="relative z-10 grid items-center gap-10 md:grid-cols-12 md:gap-10 lg:gap-14">
            {/* ── copy ── */}
            <div className="md:col-span-6">
              <p
                className="text-[12px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: AMBER, fontFamily: "var(--font-mono), monospace" }}
              >
                {t("eyebrow")}
              </p>
              <h1 className="mt-4 text-[clamp(34px,4.4vw+10px,60px)] font-semibold leading-[1.05] tracking-[-0.032em] text-white">
                {headlineLines.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>
              <p className="mt-5 max-w-[480px] text-[clamp(15px,0.7vw+13px,18px)] leading-[1.55] tracking-[-0.012em] text-white/65">
                {t("lead")}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Button href="/contact" size="lg">{t("primaryCta")}</Button>
                <span className="text-[14.5px] text-white/55">{t("from")}</span>
              </div>

              <div className="mt-6 flex items-center gap-2.5">
                <Stars />
                <span className="text-[13px] text-white/55">
                  <span className="font-semibold text-white">{tr("rating")}</span> · {tr("count")}
                </span>
              </div>

              {/* metrics */}
              <div className="mt-8 grid max-w-[480px] grid-cols-3 gap-3 border-t border-white/[0.08] pt-6">
                {metrics.map((mt, i) => (
                  <div key={i}>
                    <p
                      className="text-[clamp(20px,1.6vw+12px,26px)] font-semibold leading-none tracking-[-0.03em]"
                      style={{
                        background: "linear-gradient(165deg,#fff,#ffb487)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {mt.v}
                    </p>
                    <p className="mt-1.5 text-[10.5px] font-medium uppercase leading-tight tracking-[0.06em] text-white/45">
                      {mt.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── glance ── */}
            <div className="md:col-span-6">
              <motion.div
                className="relative mx-auto w-full max-w-[420px]"
                animate={reduce ? undefined : { y: [0, -9, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* ambient screen glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-8 -z-10"
                  style={{
                    background: "radial-gradient(ellipse 60% 50% at 55% 45%, rgba(255,122,45,0.22), transparent 70%)",
                    filter: "blur(30px)",
                  }}
                />
                <Mock m={mock} />
              </motion.div>
            </div>
          </div>

          {/* stack strip */}
          <div className="relative z-10 mt-10 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-6">
            {stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-white/55"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

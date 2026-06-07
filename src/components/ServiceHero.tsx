"use client";

import { useState, type ReactNode } from "react";
import { useMessages, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
const META_BLUE = "#0A84FF";

/* Brand glyph contours (single-path, 24×24) — reused as the big outlined
   marks behind the ads stage and as tiny tab/list badges. */
const GOOGLE_PATH =
  "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z";
const META_PATH =
  "M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.157-2.602zm-10.201.553c1.043 0 1.97.502 2.973 1.638.502.569 1.004 1.25 1.5 2.011-.521.797-1.045 1.66-1.564 2.51-1.4 2.287-1.85 2.973-2.722 3.835-.852.842-1.394 1.027-1.857 1.027-.589 0-1.176-.295-1.563-.84-.397-.563-.612-1.376-.612-2.46 0-1.95.59-4.124 1.493-5.633.628-1.044 1.397-1.738 2.354-1.738z";
const FACEBOOK_PATH =
  "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z";
const INSTAGRAM_PATH =
  "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z";

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

type Campaign = { n: string; v: string; on: boolean };

/* iOS-style pill toggle used for each campaign row */
function Switch({ on, accent }: { on: boolean; accent: string }) {
  return (
    <span
      aria-hidden
      className="relative inline-flex h-[18px] w-[31px] flex-none items-center rounded-full transition-colors duration-300"
      style={{ background: on ? accent : "rgba(255,255,255,0.14)" }}
    >
      <span
        className="absolute left-0 h-[14px] w-[14px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out"
        style={{ transform: on ? "translateX(15px)" : "translateX(2px)" }}
      />
    </span>
  );
}

/* Interactive ads-account glance: switch between the Google Ads and Meta Ads
   "rooms", flip individual campaigns on/off, watch the chart re-draw. */
function AdsMock({ m }: { m: Record<string, unknown> }) {
  const reduce = useReducedMotion();
  const tabs = (m.tabs as string[]) ?? ["Google Ads", "Meta Ads"];
  const panels = [m.google, m.meta].map((p) => (p ?? {}) as Record<string, unknown>);

  const [tab, setTab] = useState(0);
  const [on, setOn] = useState<boolean[][]>(() =>
    panels.map((p) => ((p.campaigns as Campaign[]) ?? []).map((c) => !!c.on)),
  );

  const data = panels[tab];
  const campaigns = (data.campaigns as Campaign[]) ?? [];
  const kpis = (data.kpis as Metric[]) ?? [];

  const isMeta = tab === 1;
  const accent = isMeta ? META_BLUE : AMBER;
  const accentSoft = isMeta ? "rgba(10,132,255,0.30)" : "rgba(255,122,45,0.32)";
  const numGrad = isMeta ? "linear-gradient(170deg,#fff,#8fc4ff)" : "linear-gradient(170deg,#fff,#ffb487)";
  const bars = isMeta ? [44, 40, 58, 52, 72, 64, 90] : [38, 52, 44, 66, 58, 80, 96];

  const toggle = (i: number) =>
    setOn((prev) => prev.map((arr, t) => (t === tab ? arr.map((v, j) => (j === i ? !v : v)) : arr)));

  return (
    <Glass label={m.dash as string} live>
      {/* tab switcher — two ad accounts */}
      <div className="flex gap-2">
        {tabs.map((label, i) => {
          const active = i === tab;
          const meta = i === 1;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setTab(i)}
              aria-pressed={active}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition-colors"
              style={
                active
                  ? meta
                    ? { background: "rgba(10,132,255,0.16)", color: "#8fc4ff", border: "1px solid rgba(10,132,255,0.34)" }
                    : { background: "rgba(255,122,45,0.16)", color: "#ffb487", border: "1px solid rgba(255,122,45,0.3)" }
                  : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              {meta ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d={META_PATH} />
                </svg>
              ) : (
                <GoogleG />
              )}
              {label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.26, ease: "easeOut" }}
        >
          {/* ROAS + animated bar chart */}
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/45">
                {data.roasLabel as string}
              </p>
              <div className="mt-1 flex items-end gap-2">
                <p
                  className="text-[40px] font-semibold leading-none tracking-[-0.03em]"
                  style={{ background: numGrad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
                >
                  {data.roas as string}
                </p>
                {typeof data.delta === "string" && (
                  <span className="mb-1 inline-flex items-center gap-0.5 rounded-full bg-[#34d27b]/12 px-1.5 py-[3px] text-[10px] font-semibold text-[#7fe3a6]">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M12 19V5M5 12l7-7 7 7" stroke="#34d27b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {data.delta}
                  </span>
                )}
              </div>
            </div>
            <div className="flex h-14 items-end gap-1.5">
              {bars.map((h, i) => (
                <motion.span
                  key={i}
                  className="w-2 origin-bottom rounded-t-[3px]"
                  style={{ height: `${h}%`, background: i === bars.length - 1 ? accent : accentSoft }}
                  initial={reduce ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </div>
          </div>

          {/* campaign rows with live toggles */}
          <div className="mt-4 space-y-1.5">
            {campaigns.map((c, i) => {
              const isOn = on[tab]?.[i] ?? c.on;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggle(i)}
                  aria-pressed={isOn}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-2.5 py-2 text-left transition-colors hover:bg-white/[0.06]"
                >
                  <span
                    className="h-1.5 w-1.5 flex-none rounded-full transition-colors"
                    style={{ background: isOn ? accent : "rgba(255,255,255,0.25)" }}
                  />
                  <span className="min-w-0 flex-1 truncate text-[11.5px] font-medium text-white/80">{c.n}</span>
                  <span
                    className="flex-none text-[11px] font-semibold tabular-nums transition-colors"
                    style={{ color: isOn ? "#fff" : "rgba(255,255,255,0.35)" }}
                  >
                    {c.v}
                  </span>
                  <Switch on={isOn} accent={accent} />
                </button>
              );
            })}
          </div>

          {/* KPI grid */}
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/[0.07] pt-3">
            {kpis.map((k, i) => (
              <div key={i}>
                <p className="text-[15px] font-semibold tracking-[-0.02em] text-white tabular-nums">{k.v}</p>
                <p className="text-[10px] uppercase tracking-[0.08em] text-white/45">{k.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
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

/* Big outlined platform logos scattered across the mobile-hero stage — purely
   decorative iOS / Android / App Store / Google Play / Xcode contours. */
function MobileBackdrop() {
  const ink = "rgba(255,255,255,0.07)";
  const amber = "rgba(255,122,45,0.15)";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        WebkitMaskImage: "radial-gradient(125% 105% at 50% 38%, #000 52%, transparent 92%)",
        maskImage: "radial-gradient(125% 105% at 50% 38%, #000 52%, transparent 92%)",
      }}
    >
      {/* Apple — large, top-left, amber */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={amber}
        strokeWidth={0.45}
        strokeLinejoin="round"
        className="absolute -left-10 -top-12 h-60 w-60 -rotate-[10deg] md:h-80 md:w-80"
      >
        <path d={APPLE_PATH} />
      </svg>
      {/* Android — large, bottom, left-of-centre */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={ink}
        strokeWidth={0.4}
        strokeLinejoin="round"
        strokeLinecap="round"
        className="absolute -bottom-14 left-[16%] h-52 w-52 rotate-[8deg] md:h-72 md:w-72"
      >
        <path d={ANDROID_PATH} />
      </svg>
      {/* App Store squircle + A — upper right */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={ink}
        strokeWidth={0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute right-[5%] top-[7%] hidden h-40 w-40 rotate-[6deg] sm:block md:h-48 md:w-48"
      >
        <rect x="2" y="2" width="20" height="20" rx="5.2" />
        <path d="M7.2 16.4 12 7.4l4.8 9" />
        <path d="M9.5 13.1h5" />
      </svg>
      {/* Google Play triangle — lower right, amber */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={amber}
        strokeWidth={0.5}
        strokeLinejoin="round"
        className="absolute bottom-[9%] right-[11%] h-44 w-44 md:h-56 md:w-56"
      >
        <path d={PLAY_PATH} />
      </svg>
      {/* Xcode hammer — small accent, mid-left */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={ink}
        strokeWidth={0.85}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute left-[4%] top-[44%] hidden h-24 w-24 -rotate-[12deg] lg:block"
      >
        <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0a2.12 2.12 0 0 1 0-3L12 9" />
        <path d="M17.64 15 22 10.64" />
        <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h.86c.85 0 1.65.33 2.25.93l1.25 1.25" />
      </svg>
    </div>
  );
}

/* Big outlined Google / Meta / Facebook / Instagram contours scattered across
   the ads stage — masked toward the right so the left-hand copy stays crisp. */
function AdsBackdrop() {
  const ink = "rgba(255,255,255,0.08)";
  const amber = "rgba(255,122,45,0.20)";
  const blue = "rgba(56,135,255,0.17)";
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        WebkitMaskImage: "radial-gradient(140% 120% at 80% 48%, #000 28%, transparent 80%)",
        maskImage: "radial-gradient(140% 120% at 80% 48%, #000 28%, transparent 80%)",
      }}
    >
      {/* Google G — huge, top-right, amber */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={amber}
        strokeWidth={0.4}
        strokeLinejoin="round"
        className="absolute -right-14 -top-20 h-72 w-72 rotate-[8deg] md:h-[26rem] md:w-[26rem]"
      >
        <path d={GOOGLE_PATH} />
      </svg>
      {/* Meta infinity — large, bottom-right, blue */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={blue}
        strokeWidth={0.35}
        strokeLinejoin="round"
        strokeLinecap="round"
        className="absolute -bottom-20 right-[6%] h-64 w-64 -rotate-[6deg] md:h-[22rem] md:w-[22rem]"
      >
        <path d={META_PATH} />
      </svg>
      {/* Facebook f — mid stage, ink */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={ink}
        strokeWidth={0.45}
        strokeLinejoin="round"
        className="absolute right-[42%] top-[10%] hidden h-44 w-44 -rotate-[10deg] md:h-56 md:w-56 lg:block"
      >
        <path d={FACEBOOK_PATH} />
      </svg>
      {/* Instagram — lower-mid, amber */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={amber}
        strokeWidth={0.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        className="absolute bottom-[7%] right-[46%] hidden h-40 w-40 rotate-[7deg] sm:block md:h-48 md:w-48"
      >
        <path d={INSTAGRAM_PATH} />
      </svg>
    </div>
  );
}

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

          {/* big outlined platform logos — per branch */}
          {branch === "mobile" && <MobileBackdrop />}
          {branch === "ads" && <AdsBackdrop />}

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

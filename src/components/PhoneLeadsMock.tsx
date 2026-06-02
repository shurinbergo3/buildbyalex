"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";

type Lead = {
  code: FlagCode;
  country: string;
  topic: string;
  name: string;
  message: string;
  ago: string;
};

const ARRIVE_INTERVAL = 2600;
const MAX_VISIBLE = 4;

// next-intl uses "ua" for Ukrainian; Intl expects the ISO "uk".
const INTL_LOCALE: Record<string, string> = { ua: "uk" };

export function PhoneLeadsMock() {
  const t = useTranslations("home.legalwinShowcase.phone");
  const locale = useLocale();
  const leads = useMemo(() => t.raw("leads") as Lead[], [t]);
  const nowLabel = t("now");

  // Live clock — mirrors the visitor's own device time. Seeds from the
  // translated fallback so SSR and the first client render match (no hydration
  // mismatch), then swaps to the real local time once mounted.
  const [clock, setClock] = useState({ time: t("time"), date: t("date") });
  useEffect(() => {
    const intlLocale = INTL_LOCALE[locale] ?? locale;
    const update = () => {
      const d = new Date();
      const time = new Intl.DateTimeFormat(intlLocale, {
        hour: "numeric",
        minute: "2-digit",
        hourCycle: "h23",
      }).format(d);
      const raw = new Intl.DateTimeFormat(intlLocale, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(d);
      setClock({ time, date: raw.charAt(0).toUpperCase() + raw.slice(1) });
    };
    update();
    const id = setInterval(update, 15000);
    return () => clearInterval(id);
  }, [locale]);

  // Pre-seed the stack so the phone never opens empty, then stream new
  // requests in on top — oldest falls off the bottom (iOS-style grouping).
  const [items, setItems] = useState<{ id: number; lead: Lead }[]>(() =>
    [2, 1, 0].map((leadIdx, i) => ({ id: i, lead: leads[leadIdx % leads.length] })),
  );
  const cursor = useRef({ id: 3, leadIdx: 3 });

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      const { id, leadIdx } = cursor.current;
      const lead = leads[leadIdx % leads.length];
      cursor.current = { id: id + 1, leadIdx: leadIdx + 1 };
      setItems((prev) => [{ id, lead }, ...prev].slice(0, MAX_VISIBLE));
      timer = setTimeout(tick, ARRIVE_INTERVAL);
    };

    timer = setTimeout(tick, ARRIVE_INTERVAL);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [leads]);

  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      {/* Ambient screen glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 38%, rgba(255,122,45,0.16), transparent 70%)",
          filter: "blur(28px)",
        }}
      />

      {/* Titanium frame */}
      <div
        className="relative overflow-hidden rounded-[46px] p-[3px] shadow-[0_40px_90px_-25px_rgba(0,0,0,0.75)]"
        style={{
          background:
            "linear-gradient(150deg, #3a3a3d 0%, #161617 35%, #161617 65%, #4a4a4d 100%)",
        }}
      >
        {/* Screen */}
        <div className="relative aspect-[296/620] overflow-hidden rounded-[43px] bg-[#0a0a0b]">
          {/* Wallpaper */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 0%, #1c1408 0%, #0d0a06 38%, #08080a 100%)",
            }}
          />

          {/* Status bar */}
          <div className="relative flex items-center justify-between px-7 pt-3 text-[12px] font-semibold text-white">
            <span className="tracking-[-0.02em]">{clock.time}</span>
            <StatusIcons />
          </div>

          {/* Dynamic island */}
          <div className="absolute left-1/2 top-2.5 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-black" />

          {/* Lock-screen clock */}
          <div className="relative mt-5 text-center text-white">
            <p className="text-[12.5px] font-medium tracking-[-0.01em] text-white/65">
              {clock.date}
            </p>
            <p className="mt-0.5 text-[60px] font-semibold leading-none tracking-[-0.03em]">
              {clock.time}
            </p>
          </div>

          {/* Notification stack */}
          <div className="relative mt-6 flex flex-col gap-2.5 px-3 pb-6">
            <div className="mb-0.5 flex items-center justify-between px-1.5">
              <span className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-white/40">
                {t("center")}
              </span>
              <span className="flex items-center gap-1.5 text-[10.5px] font-medium text-[#ff9a5a]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff9a5a] opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ff9a5a]" />
                </span>
                {t("live")}
              </span>
            </div>

            <AnimatePresence initial={false} mode="popLayout">
              {items.map((it, i) => (
                <NotificationCard
                  key={it.id}
                  lead={it.lead}
                  newest={i === 0}
                  nowLabel={nowLabel}
                  appLabel={t("appName")}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Bottom home indicator */}
          <div className="absolute inset-x-0 bottom-2 flex justify-center">
            <span className="h-[5px] w-[110px] rounded-full bg-white/35" />
          </div>
        </div>
      </div>
    </div>
  );
}

const NotificationCard = memo(function NotificationCard({
  lead,
  newest,
  nowLabel,
  appLabel,
}: {
  lead: Lead;
  newest: boolean;
  nowLabel: string;
  appLabel: string;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="overflow-hidden rounded-[20px] border border-white/[0.09] bg-white/[0.07] px-3 py-2.5 backdrop-blur-xl"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }}
    >
      {/* App row */}
      <div className="flex items-center gap-2">
        <AppIcon />
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-white/55">
          {appLabel}
        </span>
        <span className="ml-auto text-[10.5px] font-medium text-white/40">
          {newest ? nowLabel : lead.ago}
        </span>
      </div>

      {/* Title row */}
      <div className="mt-1.5 flex items-center gap-1.5">
        <Flag code={lead.code} />
        <span className="text-[13px] font-semibold leading-none text-white">
          {lead.name}
        </span>
        <span className="text-[11px] leading-none text-white/45">·</span>
        <span className="truncate text-[11px] leading-none text-white/55">
          {lead.country}
        </span>
      </div>

      {/* Topic + message */}
      <div className="mt-2 flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-md bg-[#ff7a2d]/15 px-1.5 py-0.5 text-[10px] font-medium leading-none text-[#ffae7e]">
          <span className="h-1 w-1 rounded-full bg-[#ff9a5a]" />
          {lead.topic}
        </span>
      </div>
      <p className="mt-1.5 line-clamp-2 text-[12px] leading-[1.45] text-white/75">
        {lead.message}
      </p>
    </motion.div>
  );
});

function AppIcon() {
  return (
    <span
      className="grid h-[18px] w-[18px] place-items-center rounded-[6px] text-[8px] font-bold text-[#1a0f05]"
      style={{
        background: "linear-gradient(150deg, #ffb56b 0%, #ff7a2d 55%, #e8590c 100%)",
        boxShadow: "0 1px 3px rgba(232,89,12,0.4)",
      }}
      aria-hidden
    >
      {/* Scales-of-justice mark */}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3v17M6 20h12M5 7h14M9 7l-3.5 6.5h7L9 7zm6 0l-3.5 6.5h7L15 7z"
          stroke="#1a0f05"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="5" r="1.5" fill="#1a0f05" />
      </svg>
    </span>
  );
}

function StatusIcons() {
  return (
    <span className="flex items-center gap-1.5" aria-hidden>
      {/* signal */}
      <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
        <rect x="0" y="7" width="3" height="4" rx="1" />
        <rect x="4.5" y="5" width="3" height="6" rx="1" />
        <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
        <rect x="13.5" y="0" width="3" height="11" rx="1" opacity="0.4" />
      </svg>
      {/* wifi */}
      <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
        <path d="M7.5 2.2c2.4 0 4.6.9 6.2 2.4l-1.3 1.4A7 7 0 0 0 7.5 4.1 7 7 0 0 0 2.6 6L1.3 4.6A9 9 0 0 1 7.5 2.2Z" />
        <path d="M7.5 5.6c1.3 0 2.5.5 3.4 1.3L9.6 8.3a3.2 3.2 0 0 0-4.2 0L4.1 6.9A5 5 0 0 1 7.5 5.6Z" />
        <circle cx="7.5" cy="9.4" r="1.4" />
      </svg>
      {/* battery */}
      <span className="flex items-center gap-0.5">
        <span className="relative h-[11px] w-[22px] rounded-[3px] border border-white/55 p-[1.5px]">
          <span className="block h-full w-[80%] rounded-[1.5px] bg-current" />
        </span>
        <span className="h-[4px] w-[1.5px] rounded-r bg-white/55" />
      </span>
    </span>
  );
}

/* ── Simplified, recognizable flag chips (no emoji per design system) ── */

type FlagCode = "ua" | "by" | "kz" | "am" | "ge";

function Flag({ code }: { code: FlagCode }) {
  return (
    <span className="inline-block h-[12px] w-[17px] shrink-0 overflow-hidden rounded-[2.5px] ring-1 ring-black/30">
      <FlagSvg code={code} />
    </span>
  );
}

function FlagSvg({ code }: { code: FlagCode }) {
  switch (code) {
    case "ua":
      return (
        <svg viewBox="0 0 3 2" className="h-full w-full" preserveAspectRatio="none">
          <rect width="3" height="1" fill="#0057B7" />
          <rect y="1" width="3" height="1" fill="#FFD700" />
        </svg>
      );
    case "am":
      return (
        <svg viewBox="0 0 3 3" className="h-full w-full" preserveAspectRatio="none">
          <rect width="3" height="1" fill="#D90012" />
          <rect y="1" width="3" height="1" fill="#0033A0" />
          <rect y="2" width="3" height="1" fill="#F2A800" />
        </svg>
      );
    case "by":
      return (
        <svg viewBox="0 0 30 20" className="h-full w-full" preserveAspectRatio="none">
          <rect width="30" height="13.3" fill="#C8313E" />
          <rect y="13.3" width="30" height="6.7" fill="#4AA657" />
          <rect width="6" height="20" fill="#fff" />
          <rect x="1.5" y="2" width="1.4" height="1.4" fill="#C8313E" transform="rotate(45 2.2 2.7)" />
          <rect x="3.2" y="5" width="1.4" height="1.4" fill="#C8313E" transform="rotate(45 3.9 5.7)" />
          <rect x="1.5" y="8" width="1.4" height="1.4" fill="#C8313E" transform="rotate(45 2.2 8.7)" />
        </svg>
      );
    case "kz":
      return (
        <svg viewBox="0 0 30 20" className="h-full w-full" preserveAspectRatio="none">
          <rect width="30" height="20" fill="#00AFCA" />
          <circle cx="15" cy="9" r="3.4" fill="#FEC50C" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={15 + Math.cos(a) * 4}
                y1={9 + Math.sin(a) * 4}
                x2={15 + Math.cos(a) * 5.2}
                y2={9 + Math.sin(a) * 5.2}
                stroke="#FEC50C"
                strokeWidth="0.7"
              />
            );
          })}
        </svg>
      );
    case "ge":
      return (
        <svg viewBox="0 0 30 20" className="h-full w-full" preserveAspectRatio="none">
          <rect width="30" height="20" fill="#fff" />
          <rect x="12.5" width="5" height="20" fill="#FF0000" />
          <rect y="7.5" width="30" height="5" fill="#FF0000" />
          {[
            [6, 3.75],
            [24, 3.75],
            [6, 16.25],
            [24, 16.25],
          ].map(([cx, cy], i) => (
            <g key={i} fill="#FF0000">
              <rect x={cx - 1.6} y={cy - 0.5} width="3.2" height="1" />
              <rect x={cx - 0.5} y={cy - 1.6} width="1" height="3.2" />
            </g>
          ))}
        </svg>
      );
  }
}

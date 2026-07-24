"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { HeroWindow } from "@/components/HeroWindow";
import { Reveal } from "@/components/Reveal";
import { LegalwinHeroMock } from "@/components/LegalwinHeroMock";
import { Link } from "@/i18n/navigation";

/* ────────────────────────────────────────────────────────────────────────
   LegalWin case hero — the marketing-first cut. The pitch leads with the one
   thing no other case can claim: the site is found in *both* classic Google
   and ChatGPT, worldwide, turning organic discovery into daily leads at zero
   ad spend. The device duo (MacBook + iPhone, reused as-is) anchors the stage;
   three floating liquid-glass proof cards dramatise the funnel top→bottom —
   Google #1 → ChatGPT names it → a live lead lands. On desktop the cards float
   around the devices; on mobile they collapse into a clean inline stack so the
   whole story survives the small screen.
   ──────────────────────────────────────────────────────────────────────── */

const ACCENT = "#FF7A2D";
const ACCENT_HI = "#FFB386";
const GOLD = "#E8C879";

type Proof = {
  googleLabel: string;
  googleQuery: string;
  googleRank: string;
  googleMeta: string;
  chatgptLabel: string;
  chatgptQuote: string;
  chatgptMeta: string;
  leadLabel: string;
  leadTopic: string;
  leadWhen: string;
};

export function LegalwinCaseHero({
  url,
  liveLabel,
}: {
  url: string;
  liveLabel: string;
}) {
  const t = useTranslations("work.caseShowcase.legalwin.hero");
  const tShow = useTranslations("home.legalwinShowcase");
  const reduce = useReducedMotion();

  const metrics = tShow.raw("metrics") as { value: string; label: string }[];
  const channels = t.raw("channels") as { google: string; chatgpt: string };
  const proof = t.raw("proof") as Proof;

  return (
    <HeroWindow theme="web" accent={ACCENT} label={url} live={liveLabel}>
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-10 lg:gap-14">
        {/* ── Pitch ── */}
        <Reveal className="min-w-0">
          <div>
            <p className="t-eyebrow" style={{ color: ACCENT }}>
              {t("eyebrow")}
            </p>

            <h1 className="mt-4 text-[clamp(38px,5vw+8px,66px)] font-semibold leading-[1.04] tracking-[-0.032em] text-white">
              {t("titleTop")}
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(96deg, ${ACCENT_HI}, ${GOLD})` }}
              >
                {t("titleAccent")}
              </span>
            </h1>

            <p className="mt-5 max-w-[540px] text-[clamp(16px,1.1vw+12px,20px)] leading-[1.5] tracking-[-0.012em] text-white/68">
              {t("subhead")}
            </p>

            {/* dual-channel proof pills */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <ChannelPill icon="google">{channels.google}</ChannelPill>
              <ChannelPill icon="chatgpt">{channels.chatgpt}</ChannelPill>
            </div>

            {/* metrics */}
            <dl className="mt-8 flex flex-wrap gap-x-9 gap-y-5">
              {metrics.map((m) => (
                <div key={m.label}>
                  <dt
                    className="text-[clamp(26px,2vw+18px,38px)] font-semibold leading-none tracking-[-0.02em]"
                    style={{ color: ACCENT_HI }}
                  >
                    {m.value}
                  </dt>
                  <dd className="mt-2 max-w-[150px] text-[12.5px] leading-snug text-white/45">
                    {m.label}
                  </dd>
                </div>
              ))}
            </dl>

            {/* CTAs */}
            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold text-[#1a1206] shadow-[0_16px_40px_-14px_rgba(255,122,45,0.65)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg, ${ACCENT_HI}, ${ACCENT})` }}
              >
                {t("want")}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>

              <a
                href={`https://${url.replace(/^https?:\/\//, "")}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] py-2.5 pl-3.5 pr-4 text-[14px] font-medium text-white/85 backdrop-blur-sm transition-colors hover:border-[color:var(--c-accent)] hover:text-white"
              >
                <span className="relative grid h-2 w-2 place-items-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--c-accent)] opacity-75" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]" />
                </span>
                {liveLabel} · {url}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            </div>
          </div>
        </Reveal>

        {/* ── Proof stage ── */}
        <Reveal delay={150} className="min-w-0">
          <div className="relative">
            <LegalwinHeroMock />

            {/* desktop: floating proof cards pinned to the corners */}
            <div className="pointer-events-none absolute inset-0 z-30 hidden md:block">
              <FloatCard
                reduce={!!reduce}
                delay={0}
                className="absolute left-[-5%] top-[-2%] w-[43%] max-w-[206px]"
              >
                <GoogleCard proof={proof} />
              </FloatCard>

              <FloatCard
                reduce={!!reduce}
                delay={1.1}
                className="absolute right-[-5%] top-[5%] w-[49%] max-w-[230px]"
              >
                <ChatGptCard proof={proof} />
              </FloatCard>

              <FloatCard
                reduce={!!reduce}
                delay={2.1}
                className="absolute bottom-[3%] left-[-4%] w-[45%] max-w-[216px]"
              >
                <LeadCard proof={proof} />
              </FloatCard>
            </div>

            {/* mobile: same proof, clean inline stack */}
            <div className="mt-6 grid gap-2.5 md:hidden">
              <GoogleCard proof={proof} />
              <ChatGptCard proof={proof} />
              <LeadCard proof={proof} />
            </div>
          </div>
        </Reveal>
      </div>
    </HeroWindow>
  );
}

/* ─────────────────────────── channel pill ─────────────────────────── */

function ChannelPill({
  icon,
  children,
}: {
  icon: "google" | "chatgpt";
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] py-1.5 pl-2.5 pr-3.5 text-[13px] font-medium text-white/78 backdrop-blur-sm">
      <span className="grid h-5 w-5 place-items-center rounded-full bg-white/95">
        {icon === "google" ? <GoogleG className="h-3 w-3" /> : <ChatGptMark className="h-3 w-3" dark />}
      </span>
      {children}
    </span>
  );
}

/* ─────────────────────────── float wrapper ─────────────────────────── */

function FloatCard({
  className,
  delay,
  reduce,
  children,
}: {
  className?: string;
  delay: number;
  reduce: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={reduce ? undefined : { y: [0, -9, 0] }}
      transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────── proof cards ─────────────────────────── */

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[15px] border border-white/[0.12] bg-[rgba(17,19,26,0.72)] shadow-[0_26px_60px_-24px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
      {children}
    </div>
  );
}

function GoogleCard({ proof }: { proof: Proof }) {
  return (
    <CardShell>
      <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-3 py-2">
        <span className="inline-flex items-center gap-1.5">
          <GoogleG className="h-3.5 w-3.5" />
          <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-white/45">
            {proof.googleLabel}
          </span>
        </span>
        <span
          className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
          style={{ background: "rgba(255,122,45,0.16)", color: ACCENT_HI }}
        >
          {proof.googleRank}
        </span>
      </div>
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-1.5 rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-white/60">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="truncate">{proof.googleQuery}</span>
        </div>
        <div className="mt-2 text-[12px] font-medium leading-tight" style={{ color: "#8ab4f8" }}>
          legalwin.pl
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-white/55">
          <Stars className="h-2.5" />
          <span>{proof.googleMeta}</span>
        </div>
      </div>
    </CardShell>
  );
}

function ChatGptCard({ proof }: { proof: Proof }) {
  return (
    <CardShell>
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-black/50 ring-1 ring-white/10">
          <ChatGptMark className="h-3 w-3" />
        </span>
        <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-white/45">
          {proof.chatgptLabel}
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-white/45">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          GPT-5
        </span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[12.5px] leading-[1.45] text-white/85">
          <ChatGptSplit quote={proof.chatgptQuote} />
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 text-[11px]">
          <span style={{ color: "#8ab4f8" }}>legalwin.pl</span>
          <span className="text-white/30">·</span>
          <span className="inline-flex items-center gap-1 text-white/55">
            <Stars className="h-2.5" />
            4.9
          </span>
        </div>
      </div>
    </CardShell>
  );
}

/* Bolds the LegalWin brand token inside the AI quote, whatever the locale. */
function ChatGptSplit({ quote }: { quote: string }) {
  const idx = quote.indexOf("LegalWin");
  if (idx === -1) return <>{quote}</>;
  return (
    <>
      {quote.slice(0, idx)}
      <strong className="font-semibold" style={{ color: "#fff" }}>
        LegalWin
      </strong>
      {quote.slice(idx + "LegalWin".length)}
    </>
  );
}

function LeadCard({ proof }: { proof: Proof }) {
  return (
    <CardShell>
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#FFB386] to-[#FF7A2D] text-[13px] font-bold text-[#1a1206]">
          LW
          <span className="absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-[#11131a] text-[8px]">
            🇺🇦
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-semibold text-white">{proof.leadLabel}</span>
            <span className="shrink-0 text-[10px] text-white/40">{proof.leadWhen}</span>
          </div>
          <div className="mt-0.5 truncate text-[11.5px] text-white/55">{proof.leadTopic}</div>
        </div>
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full" style={{ background: "rgba(46,204,113,0.16)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13l4 4L19 7" stroke="#34d17f" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </CardShell>
  );
}

/* ─────────────────────────── glyphs ─────────────────────────── */

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

function ChatGptMark({ className, dark }: { className?: string; dark?: boolean }) {
  const c = dark ? "#111318" : "#ffffff";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"
        stroke={c}
        strokeOpacity={dark ? 0.9 : 0.75}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.6" fill={c} fillOpacity={dark ? 1 : 0.9} />
    </svg>
  );
}

function Stars({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[1px] ${className ?? ""}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 16 16" className="h-full w-auto" fill={GOLD}>
          <path d="M8 1.3l1.9 4.1 4.5.5-3.4 3.1.9 4.4L8 11.4 4.1 13.4l.9-4.4L1.6 5.9l4.5-.5L8 1.3z" />
        </svg>
      ))}
    </span>
  );
}

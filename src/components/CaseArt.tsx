"use client";

/* ────────────────────────────────────────────────────────────────────────
   Code-drawn case covers. Each scene is a miniature of the actual product
   (SERP domination, live pipeline, Telegram chat, workout HUD) instead of
   a stock photo — the covers sell what was built, not a mood. Pure CSS
   animation, keyframes live in globals.css under "case-art".
   ──────────────────────────────────────────────────────────────────────── */

const ART_KEYS = new Set(["legalwin", "crmbot", "leadbot", "bodyforge"]);

export function hasCaseArt(key: string): boolean {
  return ART_KEYS.has(key);
}

export function CaseArt({ caseKey }: { caseKey: string }) {
  switch (caseKey) {
    case "legalwin":
      return <LegalwinArt />;
    case "crmbot":
      return <CrmbotArt />;
    case "leadbot":
      return <LeadbotArt />;
    case "bodyforge":
      return <BodyforgeArt />;
    default:
      return null;
  }
}

/* ── shared bits ────────────────────────────────────────────────────── */

function Noise() {
  return <span aria-hidden="true" className="ca-noise" />;
}

function PulseDot({ color = "#FF7A2D", size = 7 }: { color?: string; size?: number }) {
  return (
    <span className="relative grid place-items-center" style={{ width: size, height: size }}>
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
        style={{ background: color }}
      />
      <span
        className="relative rounded-full"
        style={{ width: size, height: size, background: color, boxShadow: `0 0 8px ${color}` }}
      />
    </span>
  );
}

function TypingDots({ color = "#FFB386" }: { color?: string }) {
  return (
    <span className="inline-flex items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="ca-dot block h-[5px] w-[5px] rounded-full"
          style={{ background: color, animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

/* ── LegalWin — Google SERP the client actually owns ─────────────────── */

function LegalwinArt() {
  return (
    <div
      className="case-art"
      aria-hidden="true"
      style={{ background: "linear-gradient(128deg, #0C1424 0%, #0A101D 52%, #13223C 100%)" }}
    >
      <span
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(56% 68% at 84% 8%, rgba(255,122,45,0.15), transparent 64%), radial-gradient(48% 62% at 6% 96%, rgba(43,82,120,0.4), transparent 70%)",
        }}
      />
      <span
        className="absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(72% 72% at 62% 38%, #000 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(72% 72% at 62% 38%, #000 30%, transparent 100%)",
        }}
      />
      {/* passport-stamp ring, barely-there immigration motif */}
      <span
        className="absolute rounded-full"
        style={{
          width: 210,
          height: 210,
          left: "-4%",
          top: "-10%",
          border: "1.5px dashed rgba(255,255,255,0.07)",
          transform: "rotate(-14deg)",
        }}
      />

      {/* SERP panel */}
      <div className="ca-panel" style={{ width: "clamp(248px, 46cqw, 400px)" }}>
        <div className="ca-glass relative overflow-hidden p-3.5 sm:p-4">
          <span className="ca-sheen" aria-hidden="true" />

          {/* search bar */}
          <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-3 py-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white/55">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="truncate text-[11.5px] font-medium text-white/85">
              adwokat imigracyjny warszawa
            </span>
            <span className="ca-caret h-[13px] w-[1.5px] shrink-0 bg-white/80" />
          </div>

          {/* result rows */}
          <div className="mt-3 space-y-2">
            <div
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2"
              style={{
                background: "linear-gradient(90deg, rgba(255,122,45,0.16), rgba(255,122,45,0.04) 70%)",
                border: "1px solid rgba(255,122,45,0.35)",
              }}
            >
              <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10.5px] font-bold"
                style={{ background: "#FF7A2D", color: "#1c0e02", boxShadow: "0 0 14px rgba(255,122,45,0.55)" }}
              >
                1
              </span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-[11.5px] font-semibold text-white">
                  LegalWin · Legalizacja pobytu i pracy
                </span>
                <span className="block text-[10px] font-medium" style={{ color: "#7BD88F" }}>
                  legalwin.pl
                </span>
              </span>
            </div>

            {[2, 3].map((n) => (
              <div key={n} className="flex items-center gap-2.5 px-2.5 py-1" style={{ opacity: n === 2 ? 0.75 : 0.5 }}>
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-white/25 text-[10px] font-semibold text-white/60">
                  {n}
                </span>
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block h-[7px] rounded bg-white/20" style={{ width: n === 2 ? "76%" : "62%" }} />
                  <span className="mt-1.5 block h-[5px] w-[34%] rounded bg-white/10" />
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* multilingual AI consultant chip */}
        <div className="ca-float absolute -bottom-4 -right-3 flex items-center gap-2 rounded-full border border-white/12 bg-[#101825]/90 px-3 py-1.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md">
          <PulseDot />
          <span className="whitespace-nowrap text-[10.5px] font-semibold text-white">
            AI-konsultant · PL EN RU UA
          </span>
        </div>
      </div>

      <Noise />
    </div>
  );
}

/* ── CRM Bot — the pipeline runs itself ──────────────────────────────── */

function CrmbotArt() {
  const cols: { name: string; count: number; cards: ("skeleton" | "hero")[] }[] = [
    { name: "Inbox", count: 14, cards: ["skeleton", "skeleton", "skeleton"] },
    { name: "Qualified", count: 6, cards: ["hero", "skeleton"] },
    { name: "Meeting", count: 3, cards: ["skeleton"] },
  ];

  return (
    <div
      className="case-art"
      aria-hidden="true"
      style={{ background: "linear-gradient(135deg, #0B0C10 0%, #0E1016 55%, #151A26 100%)" }}
    >
      <span
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(52% 64% at 88% 12%, rgba(255,122,45,0.14), transparent 62%), radial-gradient(46% 60% at 4% 88%, rgba(64,110,180,0.22), transparent 70%)",
        }}
      />
      <span
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(70% 70% at 60% 40%, #000 25%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(70% 70% at 60% 40%, #000 25%, transparent 100%)",
        }}
      />

      <div className="ca-panel" style={{ width: "clamp(280px, 54cqw, 440px)" }}>
        <div className="ca-glass relative overflow-hidden p-3.5 sm:p-4">
          <span className="ca-sheen" aria-hidden="true" />

          <div className="flex items-center justify-between">
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-white/45">
              Sales pipeline
            </span>
            <span className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-white/70">
              <PulseDot size={6} />
              auto
            </span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {cols.map((col) => (
              <div key={col.name} className="rounded-xl border border-white/8 bg-white/[0.04] p-1.5">
                <div className="flex items-baseline justify-between gap-1 px-1 pb-1.5">
                  <span className="truncate text-[8px] font-semibold uppercase tracking-[0.05em] text-white/45">
                    {col.name}
                  </span>
                  <span className="shrink-0 font-mono text-[8px] tabular-nums text-white/35">{col.count}</span>
                </div>
                <div className="space-y-1.5">
                  {col.cards.map((kind, i) =>
                    kind === "hero" ? (
                      <div
                        key={i}
                        className="ca-hot rounded-lg px-2 py-1.5"
                        style={{
                          background: "linear-gradient(135deg, rgba(255,122,45,0.2), rgba(255,122,45,0.06))",
                          border: "1px solid rgba(255,122,45,0.5)",
                        }}
                      >
                        <span className="block truncate text-[10px] font-semibold text-white">TechFlow</span>
                        <span className="mt-0.5 block whitespace-nowrap text-[8.5px] font-medium" style={{ color: "#FFB386" }}>
                          AI · 00:42
                        </span>
                      </div>
                    ) : (
                      <div key={i} className="rounded-lg border border-white/6 bg-white/[0.05] px-2 py-1.5">
                        <span className="block h-[6px] w-[72%] rounded bg-white/18" />
                        <span className="mt-1 block h-[5px] w-[46%] rounded bg-white/9" />
                      </div>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* flow rail: first touch → meeting */}
          <div className="mt-3.5 px-1">
            <div className="relative h-px bg-white/12">
              <span className="ca-spark" />
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[8.5px] text-white/35">
              <span>first touch</span>
              <span>meeting booked</span>
            </div>
          </div>
        </div>
      </div>

      <Noise />
    </div>
  );
}

/* ── LeadBot — Telegram chat where nobody suspects the AI ────────────── */

function LeadbotArt() {
  return (
    <div
      className="case-art"
      aria-hidden="true"
      style={{ background: "linear-gradient(150deg, #101B26 0%, #0C141D 58%, #10202F 100%)" }}
    >
      <span
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(54% 66% at 86% 6%, rgba(255,122,45,0.13), transparent 62%), radial-gradient(50% 62% at 8% 94%, rgba(46,166,234,0.14), transparent 68%)",
        }}
      />
      <span
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0 1px, transparent 1px 16px), repeating-linear-gradient(-45deg, #fff 0 1px, transparent 1px 16px)",
        }}
      />

      <div className="ca-panel" style={{ width: "clamp(250px, 44cqw, 380px)" }}>
        <div className="relative overflow-hidden rounded-[18px] border border-white/12 shadow-[0_34px_70px_-26px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]">
          {/* header */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5" style={{ background: "#17212b" }}>
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-semibold text-white"
              style={{ background: "linear-gradient(135deg, #2ea6ea 0%, #1e88c8 100%)" }}
            >
              М
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-[12.5px] font-semibold text-white">Максим</span>
              <span className="flex items-center gap-1.5 text-[10.5px] font-medium" style={{ color: "#FFB386" }}>
                печатает
                <TypingDots />
              </span>
            </span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-[#6ab3f3]">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
            </svg>
          </div>

          {/* chat */}
          <div className="space-y-1.5 px-3 py-3" style={{ background: "#0e1621" }}>
            <div className="ca-narrow-hide flex justify-end">
              <span
                className="max-w-[82%] rounded-2xl rounded-br-[6px] px-3 py-1.5 text-[11.5px] leading-[1.4] text-white"
                style={{ background: "#2b5278" }}
              >
                Здравствуйте! Сколько стоит ВНЖ под ключ?
              </span>
            </div>
            <div className="flex justify-start">
              <span className="flex items-center rounded-2xl rounded-bl-[6px] px-3 py-2.5" style={{ background: "#182533" }}>
                <TypingDots />
              </span>
            </div>
          </div>
        </div>

        {/* the differentiator, off the device */}
        <div className="ca-float absolute -top-5 -left-5 flex items-center gap-2 rounded-full border border-white/12 bg-[#101a25]/90 px-3 py-1.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md">
          <PulseDot />
          <span className="whitespace-nowrap text-[10.5px] font-semibold text-white">
            Реальный аккаунт · 24/7
          </span>
        </div>
      </div>

      <Noise />
    </div>
  );
}

/* ── Body Forge — workout HUD with rest timer ────────────────────────── */

const BF_LIME = "#C8FF00";

function BodyforgeArt() {
  const R = 46;
  const C = 2 * Math.PI * R;

  return (
    <div
      className="case-art"
      aria-hidden="true"
      style={{ background: "linear-gradient(140deg, #0B0C0A 0%, #0A0A0A 58%, #11140A 100%)" }}
    >
      <span
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(56% 70% at 84% 10%, rgba(200,255,0,0.11), transparent 62%), radial-gradient(44% 58% at 6% 92%, rgba(255,122,45,0.1), transparent 68%)",
        }}
      />
      <span
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "100% 34px",
          maskImage: "radial-gradient(75% 75% at 60% 40%, #000 25%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(75% 75% at 60% 40%, #000 25%, transparent 100%)",
        }}
      />

      <div className="ca-panel flex items-center gap-4 sm:gap-5">
        {/* rest-timer ring */}
        <div className="ca-breathe relative grid shrink-0 place-items-center" style={{ width: 118, height: 118 }}>
          <svg width="118" height="118" viewBox="0 0 118 118" className="-rotate-90">
            <circle cx="59" cy="59" r={R} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="7" />
            <circle
              cx="59"
              cy="59"
              r={R}
              fill="none"
              stroke={BF_LIME}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * 0.34}
              style={{ filter: `drop-shadow(0 0 10px ${BF_LIME}66)` }}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center">
            <span className="text-center leading-none">
              <span className="block font-mono text-[22px] font-semibold tabular-nums text-white">00:47</span>
              <span className="mt-1.5 block text-[8.5px] font-semibold uppercase tracking-[0.22em] text-white/45">
                отдых
              </span>
            </span>
          </span>
        </div>

        {/* set log */}
        <div className="ca-glass relative overflow-hidden p-3" style={{ width: "clamp(168px, 32cqw, 216px)" }}>
          <span className="ca-sheen" aria-hidden="true" />
          <div className="flex items-baseline justify-between">
            <span className="text-[11.5px] font-semibold text-white">Жим лёжа</span>
            <span className="font-mono text-[9.5px] tabular-nums" style={{ color: BF_LIME }}>
              3/4
            </span>
          </div>
          <div className="mt-2 space-y-1.5">
            {[
              { w: "8 × 80 кг", done: true },
              { w: "8 × 80 кг", done: true },
              { w: "6 × 82.5 кг", done: false },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-white/7 bg-white/[0.05] px-2 py-1.5"
                style={s.done ? undefined : { borderColor: "rgba(200,255,0,0.4)" }}
              >
                <span className="font-mono text-[10px] tabular-nums text-white/80">{s.w}</span>
                {s.done ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ color: BF_LIME }}>
                    <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="ca-dot h-[7px] w-[7px] rounded-full" style={{ background: BF_LIME }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="ca-float absolute -bottom-4 -right-2 rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: BF_LIME, color: "#0c0f02", boxShadow: "0 10px 26px -8px rgba(200,255,0,0.55)" }}>
          +28 XP
        </div>
      </div>

      <Noise />
    </div>
  );
}

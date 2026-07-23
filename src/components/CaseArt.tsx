"use client";

/* ────────────────────────────────────────────────────────────────────────
   Code-drawn case covers. Each scene is a miniature of the actual product
   (SERP domination, live pipeline, Telegram chat, workout HUD) instead of
   a stock photo — the covers sell what was built, not a mood. Pure CSS
   animation, keyframes live in globals.css under "case-art".
   ──────────────────────────────────────────────────────────────────────── */

// Gallery covers now use real screenshots/photos (see caseImages in cases.ts);
// the code-drawn scenes below are kept but disabled. Re-add a key here to bring
// its animated cover back for that case.
const ART_KEYS = new Set<string>([]);

export function hasCaseArt(key: string): boolean {
  return ART_KEYS.has(key);
}

export function CaseArt({ caseKey }: { caseKey: string }) {
  switch (caseKey) {
    case "legalwin":
      return <LegalwinArt />;
    case "visionair":
      return <VisionairArt />;
    case "bodyforgesite":
      return <BodyforgesiteArt />;
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
              className="ca-hot flex items-center gap-2.5 rounded-xl px-2.5 py-2"
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

/* ── VisionAir — the operator's viewfinder locked on a drone over Warsaw ─ */

const VA_GOLD = "#CBA45C";
const VA_GOLD_HI = "#E6CB87";

function VisionairArt() {
  return (
    <div
      className="case-art"
      aria-hidden="true"
      style={{ background: "linear-gradient(138deg, #0A0F18 0%, #0B1220 54%, #16233A 100%)" }}
    >
      <span
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(54% 66% at 82% 10%, rgba(203,164,92,0.16), transparent 62%), radial-gradient(46% 58% at 8% 92%, rgba(38,64,110,0.35), transparent 70%)",
        }}
      />
      <span
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(72% 72% at 60% 38%, #000 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(72% 72% at 60% 38%, #000 30%, transparent 100%)",
        }}
      />
      {/* Warsaw skyline silhouette along the floor */}
      <svg
        className="absolute bottom-0 left-0 w-full opacity-[0.5]"
        viewBox="0 0 400 60"
        preserveAspectRatio="none"
        style={{ height: "18%" }}
      >
        <path
          d="M0 60V44h14v-9h8v9h12V30h10v14h9v-6h13v6h10V22l7-8 7 8v22h12v-12h11v12h10V36h9V18h4l3-14 3 14h4v18h10v8h12V32h10v12h14v-8h11v8h13V26h9v18h12v-9h10v9h14V38h12v22z"
          fill="#060B14"
        />
      </svg>

      <div className="ca-panel" style={{ width: "clamp(252px, 46cqw, 392px)" }}>
        <div className="ca-glass relative overflow-hidden p-3.5 sm:p-4">
          <span className="ca-sheen" aria-hidden="true" />

          {/* viewfinder header */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-white/75">
              <span
                className="ca-dot h-[7px] w-[7px] rounded-full"
                style={{ background: "#FF4B4B", boxShadow: "0 0 8px rgba(255,75,75,0.8)" }}
              />
              REC
            </span>
            <span className="font-mono text-[9px] tracking-[0.1em] text-white/45">4K · 60 FPS · DJI</span>
          </div>

          {/* viewfinder stage */}
          <div
            className="relative mt-3 h-[124px] overflow-hidden rounded-xl border border-white/10"
            style={{ background: "linear-gradient(180deg, #0C1524 0%, #0A111D 100%)" }}
          >
            {/* corner brackets */}
            {(
              [
                { l: 6, t: 6, bw: "2px 0 0 2px" },
                { r: 6, t: 6, bw: "2px 2px 0 0" },
                { l: 6, b: 6, bw: "0 0 2px 2px" },
                { r: 6, b: 6, bw: "0 2px 2px 0" },
              ] as { l?: number; r?: number; t?: number; b?: number; bw: string }[]
            ).map((c, i) => (
              <span
                key={i}
                className="absolute h-3.5 w-3.5"
                style={{
                  left: c.l,
                  right: c.r,
                  top: c.t,
                  bottom: c.b,
                  borderStyle: "solid",
                  borderColor: "rgba(255,255,255,0.35)",
                  borderWidth: c.bw,
                }}
              />
            ))}

            {/* tracking reticle with radar sweep */}
            <span
              className="absolute left-1/2 top-1/2 h-[92px] w-[92px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full"
              style={{ border: `1px solid ${VA_GOLD}66`, boxShadow: `0 0 24px ${VA_GOLD}22` }}
            >
              <span
                className="ca-rotate absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(from 0deg, ${VA_GOLD}59 0deg, transparent 78deg, transparent 360deg)`,
                }}
              />
              <span
                className="absolute left-1/2 top-1/2 h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ border: `1px dashed ${VA_GOLD}4D` }}
              />
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2" style={{ background: `${VA_GOLD}33` }} />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2" style={{ background: `${VA_GOLD}33` }} />
            </span>

            {/* the drone, locked */}
            <span className="absolute" style={{ left: "58%", top: "34%" }}>
              <svg width="26" height="16" viewBox="0 0 26 16" fill="none">
                <ellipse cx="4.5" cy="3" rx="4" ry="1.6" stroke={VA_GOLD_HI} strokeWidth="0.9" opacity="0.85" />
                <ellipse cx="21.5" cy="3" rx="4" ry="1.6" stroke={VA_GOLD_HI} strokeWidth="0.9" opacity="0.85" />
                <path d="M6 4.5l5 3.5h4l5-3.5" stroke={VA_GOLD_HI} strokeWidth="1.1" strokeLinecap="round" />
                <rect x="10.5" y="7.5" width="5" height="3.4" rx="1.4" fill={VA_GOLD_HI} />
                <path d="M12 11l1 3.4M14 11l-1 3.4" stroke={VA_GOLD_HI} strokeWidth="0.8" opacity="0.6" />
              </svg>
              <span className="absolute -right-1 -top-1">
                <PulseDot color={VA_GOLD} size={5} />
              </span>
            </span>

            {/* lock chip */}
            <span
              className="absolute bottom-2 left-2 rounded-md px-1.5 py-0.5 font-mono text-[8px] font-semibold tracking-[0.08em]"
              style={{ background: `${VA_GOLD}26`, color: VA_GOLD_HI, border: `1px solid ${VA_GOLD}59` }}
            >
              TARGET LOCK
            </span>
            <span className="absolute bottom-2 right-2 font-mono text-[8px] tracking-[0.08em] text-white/45">
              WARSZAWA · NIGHT
            </span>
          </div>

          {/* telemetry */}
          <div className="mt-2.5 flex items-center justify-between font-mono text-[8.5px] tracking-[0.04em] text-white/40">
            <span>52.2297° N</span>
            <span>21.0122° E</span>
            <span style={{ color: VA_GOLD }}>ALT 120M AGL</span>
          </div>
        </div>

        {/* the pipeline in one chip: site visitor → operator's Telegram */}
        <div className="ca-float absolute -bottom-4 -right-3 flex items-center gap-2 rounded-full border border-white/12 bg-[#0E1622]/90 px-3 py-1.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#2EA6EA">
            <path d="M21.9 3.4L2.7 10.8c-1 .4-1 1.4-.2 1.7l4.9 1.5 1.9 5.8c.2.7 1.1.9 1.6.4l2.7-2.6 5 3.7c.6.4 1.4.1 1.6-.6l3.1-15.9c.2-.9-.6-1.7-1.4-1.4z" />
          </svg>
          <span className="whitespace-nowrap text-[10.5px] font-semibold text-white">
            Lead → Telegram · <span className="font-mono" style={{ color: VA_GOLD_HI }}>1.8 s</span>
          </span>
        </div>
      </div>

      <Noise />
    </div>
  );
}

/* ── Body Forge site — the dark/lime landing in a live browser ────────── */

function BodyforgesiteArt() {
  return (
    <div
      className="case-art"
      aria-hidden="true"
      style={{ background: "linear-gradient(142deg, #0A0B09 0%, #0B0B0D 56%, #10130B 100%)" }}
    >
      <span
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(54% 68% at 84% 8%, rgba(200,255,0,0.1), transparent 62%), radial-gradient(44% 56% at 6% 94%, rgba(255,255,255,0.05), transparent 68%)",
        }}
      />
      <span
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(70% 70% at 62% 38%, #000 25%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(70% 70% at 62% 38%, #000 25%, transparent 100%)",
        }}
      />

      <div className="ca-panel" style={{ width: "clamp(262px, 50cqw, 420px)" }}>
        {/* browser window */}
        <div className="relative overflow-hidden rounded-[16px] border border-white/12 shadow-[0_34px_70px_-26px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]">
          {/* chrome bar with the bilingual toggle */}
          <div className="flex items-center gap-2.5 border-b border-white/[0.06] px-3 py-2" style={{ background: "#141416" }}>
            <span className="flex shrink-0 gap-1.5">
              <span className="h-[8px] w-[8px] rounded-full bg-[#FF5F57]" />
              <span className="h-[8px] w-[8px] rounded-full bg-[#FEBC2E]" />
              <span className="h-[8px] w-[8px] rounded-full bg-[#28C840]" />
            </span>
            <span className="flex min-w-0 items-center gap-1.5 rounded-md bg-white/[0.06] px-2.5 py-1 text-[9.5px] font-medium text-white/60">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              bodyforges.com
            </span>
          </div>

          {/* hero */}
          <div className="relative px-3.5 pb-3.5 pt-3" style={{ background: "linear-gradient(175deg, #0B0B0D 0%, #0D1108 100%)" }}>
            <span
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(200,255,0,0.14), transparent 68%)" }}
            />
            <span className="flex items-center justify-between">
              <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.22em]" style={{ color: BF_LIME }}>
                iOS · Fitness
              </span>
              <span className="flex gap-1 font-mono text-[8px] font-semibold">
                <span className="rounded px-1.5 py-0.5" style={{ background: "rgba(200,255,0,0.16)", color: BF_LIME }}>
                  RU
                </span>
                <span className="rounded px-1.5 py-0.5 text-white/35">EN</span>
              </span>
            </span>
            <span className="mt-1.5 block text-[21px] font-bold leading-[0.95] tracking-[-0.03em]">
              <span className="text-white">BODY</span>{" "}
              <span style={{ color: BF_LIME, textShadow: "0 0 22px rgba(200,255,0,0.4)" }}>FORGE</span>
            </span>
            <span className="mt-2 block h-[6px] w-[64%] rounded bg-white/16" />
            <span className="mt-1.5 block h-[6px] w-[42%] rounded bg-white/9" />

            <div className="mt-3 flex items-center gap-2">
              {/* App Store badge */}
              <span className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-[9.5px] font-semibold text-black">
                <svg width="11" height="13" viewBox="0 0 384 512" fill="currentColor">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                App Store
              </span>
              <span className="rounded-lg border border-white/15 px-2.5 py-1.5 text-[9.5px] font-medium text-white/60">
                4.8 ★
              </span>
            </div>
          </div>
        </div>

        {/* speed chip — the sub-second first paint */}
        <div className="ca-float absolute -bottom-4 -left-4 flex items-center gap-2 rounded-full border border-white/12 bg-[#101208]/90 px-3 py-1.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md">
          <PulseDot color={BF_LIME} />
          <span className="whitespace-nowrap text-[10.5px] font-semibold text-white">
            LCP <span className="font-mono" style={{ color: BF_LIME }}>0.7 s</span>
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

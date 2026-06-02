"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

/* Floating "pieces of the page" that drifted off when it broke. */
const FRAGMENTS = [
  { left: "8%", top: "22%", delay: "0s", dur: "7s", node: <ChipButton /> },
  { left: "78%", top: "16%", delay: "1.1s", dur: "8.5s", node: <ChipCode /> },
  { left: "14%", top: "68%", delay: "0.6s", dur: "9s", node: <ChipImage /> },
  { left: "72%", top: "70%", delay: "1.8s", dur: "7.6s", node: <ChipCursor /> },
  { left: "44%", top: "10%", delay: "2.3s", dur: "10s", node: <ChipToggle /> },
];

export function NotFoundExperience() {
  const t = useTranslations("notFound");
  const pathname = usePathname();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [spot, setSpot] = useState(false);

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in srgb, var(--c-accent) 12%, transparent), transparent 70%)",
        }}
      />

      <Container size="md" className="py-16 md:py-24">
        {/* Crashed browser-window mockup */}
        <div
          ref={frameRef}
          onPointerMove={onMove}
          onPointerEnter={() => setSpot(true)}
          onPointerLeave={() => setSpot(false)}
          data-spot={spot ? "on" : "off"}
          className="nf-frame relative mx-auto max-w-[860px] overflow-hidden rounded-[var(--r-xl)] border border-[color:var(--c-hairline)] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.5)]"
        >
          {/* Chrome bar */}
          <div className="relative z-20 flex items-center gap-3 border-b border-white/[0.06] bg-[rgba(20,20,22,0.9)] px-4 py-3">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="mx-auto flex w-full max-w-[420px] items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5">
              <WarnIcon />
              <span className="truncate font-mono text-[12px] text-white/55">
                buildbyalex.com<span className="text-[#ff8e4d]">{pathname}</span>
              </span>
            </div>
            <div className="w-12 shrink-0" />
          </div>

          {/* Dark stage */}
          <div className="relative h-[340px] overflow-hidden bg-[#0a0a0c] md:h-[420px]">
            {/* radar scan */}
            <div className="nf-scan" aria-hidden />
            {/* faint grid */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.5]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
                maskImage:
                  "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 75%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 75%)",
              }}
            />

            {/* floating fragments */}
            {FRAGMENTS.map((f, i) => (
              <span
                key={i}
                className="nf-fragment absolute"
                style={{
                  left: f.left,
                  top: f.top,
                  animationDelay: f.delay,
                  animationDuration: f.dur,
                }}
                aria-hidden
              >
                {f.node}
              </span>
            ))}

            {/* Giant glitch 404 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="nf-glitch select-none font-mono font-bold leading-none text-white"
                data-text={t("code")}
                style={{ fontSize: "clamp(86px, 18vw, 168px)", letterSpacing: "-0.04em" }}
              >
                {t("code")}
              </span>
              <span className="mt-2 flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-[#ff8e4d]">
                <span className="nf-blink h-1.5 w-1.5 rounded-full bg-[#ff8e4d]" />
                {t("status")}
              </span>
            </div>

            {/* Spotlight mask + warm glow that follow the cursor */}
            <div className="nf-spot" aria-hidden />
            <div className="nf-spot-glow" aria-hidden />

            {/* Hint */}
            <p className="absolute inset-x-0 bottom-4 z-30 text-center font-mono text-[11.5px] text-white/35">
              {t("hint")}
            </p>
          </div>
        </div>

        {/* Copy + recovery links */}
        <div className="mx-auto mt-12 max-w-[560px] text-center">
          <h1 className="t-h1">{t("headline")}</h1>
          <p className="mx-auto mt-5 max-w-[460px] t-body-lg">{t("lead")}</p>

          <p className="mt-10 text-[13px] uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">
            {t("linksTitle")}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button href="/">{t("home")}</Button>
            <Button href="/work" variant="ghost">{t("links.work")}</Button>
            <Button href="/services" variant="ghost">{t("links.services")}</Button>
            <Button href="/blog" variant="ghost">{t("blog")}</Button>
            <Button href="/contact" variant="ghost">{t("links.contact")}</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Fragment chips: tiny pieces of UI that floated off the broken page ── */
function ChipButton() {
  return (
    <span className="inline-flex h-7 items-center rounded-full bg-[color:var(--c-accent)]/90 px-3.5 text-[11px] font-medium text-white shadow-lg">
      Get a quote
    </span>
  );
}
function ChipCode() {
  return (
    <span className="inline-flex h-8 items-center rounded-lg border border-white/10 bg-white/[0.06] px-2.5 font-mono text-[12px] text-white/60 backdrop-blur-sm">
      &lt;/&gt;
    </span>
  );
}
function ChipImage() {
  return (
    <span className="grid h-10 w-14 place-items-center rounded-lg border border-white/10 bg-white/[0.05] backdrop-blur-sm">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.6">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.6" />
        <path d="M21 16l-5-5L5 20" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
function ChipCursor() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="white" className="drop-shadow-lg" style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }}>
      <path d="M5 3l14 7-6 2.2L9.8 19 5 3z" stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" />
    </svg>
  );
}
function ChipToggle() {
  return (
    <span className="inline-flex h-6 w-11 items-center rounded-full bg-[color:var(--c-accent)]/80 p-0.5">
      <span className="ml-auto h-5 w-5 rounded-full bg-white shadow" />
    </span>
  );
}

function WarnIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ff8e4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

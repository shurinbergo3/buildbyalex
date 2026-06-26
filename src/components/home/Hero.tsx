"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { Link } from "@/i18n/navigation";
import { HeroCodeSurface } from "@/components/home/HeroCodeSurface";

export function Hero() {
  const t = useTranslations("home.hero");
  const locale = useLocale();
  const headlineLines = t("headline").split("\n");

  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const chromeRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const hoverRaf = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let running = false;
    let currentP = 0;
    let targetP = 0;

    const computeTarget = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollZone = Math.max(1, rect.height - vh);
      const raw = reduced ? 0 : Math.min(1, Math.max(0, -rect.top / scrollZone));
      targetP = raw * raw * (3 - 2 * raw);
    };

    const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const smooth = (v: number) => v * v * (3 - 2 * v);

    const apply = (p: number) => {
      const frame = frameRef.current;
      const video = videoRef.current;
      const content = contentRef.current;
      const chrome = chromeRef.current;
      const ring = ringRef.current;
      const badge = badgeRef.current;
      const cta = ctaRef.current;
      if (!frame || !content) return;

      const w = window.innerWidth;
      const isMobile = w < 768;
      // Collapse to a smaller card so the window top bar (traffic lights +
      // URL) clears the nav and stays clearly visible at the end of scroll.
      const maxTop = isMobile ? 96 : 132;
      const maxX = isMobile ? 22 : Math.min(220, w * 0.105);
      const maxBottom = isMobile ? 104 : 150;
      const maxRadius = isMobile ? 22 : 28;

      // Window-collapse runs on a compressed progress so the frame finishes
      // folding early in the scroll — independent of the video scrub below.
      const morphEnd = 0.62;
      const mp = clamp01(p / morphEnd);

      frame.style.top = `${mp * maxTop}px`;
      frame.style.left = `${mp * maxX}px`;
      frame.style.right = `${mp * maxX}px`;
      frame.style.bottom = `${mp * maxBottom}px`;
      frame.style.borderRadius = `${mp * maxRadius}px`;

      // Logo-reveal video: scrubbed by scroll. The code wall hands off to the
      // warp-zoom that resolves into the buildbyalex wordmark by the time the
      // window has finished collapsing.
      if (video) {
        // Eases in from the very first scroll (smoothstep, so no pop) and
        // scrubs across almost the whole section — by the time it's visible
        // it's already in motion, never a hard cut to a mid frame.
        const fade = smooth(clamp01(p / 0.16));
        video.style.opacity = String(fade);
        const dur = video.duration || 8.067;
        const scrub = smooth(clamp01(p / 0.62)); // 0→1, logo settled by p≈0.62 (snappier)
        const time = scrub * (dur - 0.001);
        if (Math.abs(video.currentTime - time) > 0.012) {
          try {
            video.currentTime = time;
          } catch {
            /* seek not ready yet — next tick retries */
          }
        }
      }

      // Headline clears out fast — the reveal video opens on the same hero,
      // so the foreground copy must be gone before that frame shows or the
      // two stack into a ghosted double.
      const contentFade = clamp01(p / 0.12);
      const scale = 1 - p * 0.18;
      const opacity = (1 - p * 0.25) * (1 - contentFade);
      const ty = p * -10 - contentFade * 24;
      content.style.opacity = String(opacity);
      content.style.transform = `translate3d(0, ${ty}px, 0) scale(${scale})`;

      if (chrome) {
        const ch = Math.max(0, Math.min(1, (p - 0.45) / 0.4));
        chrome.style.opacity = String(ch);
        chrome.style.transform = `translate3d(0, ${(1 - ch) * -12}px, 0)`;
      }
      if (ring) {
        ring.style.opacity = String(mp * 0.9);
      }
      // Live badge: pops in late, with a small rise-and-scale
      if (badge) {
        const bp = Math.max(0, Math.min(1, (p - 0.6) / 0.3));
        const eb = bp * bp * (3 - 2 * bp);
        badge.style.opacity = String(eb);
        badge.style.transform = `translate3d(0, ${(1 - eb) * 14}px, 0) scale(${0.86 + eb * 0.14})`;
      }
      // Primary CTA pulse: starts once the morph has settled — drives conversion
      if (cta) {
        if (p > 0.82) cta.dataset.glow = "on";
        else delete cta.dataset.glow;
      }
    };

    // Spring/lerp loop — animation eases toward target even if user scroll-blasts past
    const tick = () => {
      computeTarget();
      const diff = targetP - currentP;
      if (Math.abs(diff) < 0.0008) {
        currentP = targetP;
        apply(currentP);
        running = false;
        return;
      }
      currentP += diff * 0.12;
      apply(currentP);
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      computeTarget();
      currentP = targetP;
      apply(currentP);
    };

    // Use the international clip for every locale — it warps straight into the
    // wordmark, so the path to real content stays short. Pick a lighter encode
    // on phones, then prime it so the first scroll-seek is instant.
    //
    // The clip (~1.8 MB) is only ever used once the user scrolls, so we keep it
    // off the critical load path: fetch it during idle time, or the moment the
    // user first scrolls/moves the pointer — whichever comes first. apply()
    // already tolerates seeks before the file is ready, so this is invisible.
    const video = videoRef.current;
    const idle = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const isMobileV = window.matchMedia("(max-width: 767px)").matches;
    // Skip the idle pre-warm on phones / metered or slow links: there the
    // 1.8 MB clip dominates the payload, so we only pull it once the user
    // actually starts scrolling into the reveal. On desktop with a fast line
    // we pre-warm during idle so the first scroll-seek is instant.
    const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const slowNet = !!conn && (conn.saveData === true || /(^|-)2g|3g/.test(conn.effectiveType ?? ""));
    const prewarmOk = !isMobileV && !slowNet;
    let idleId = 0;
    let videoLoaded = false;
    const loadVideo = () => {
      if (videoLoaded || !video || reduced) return;
      videoLoaded = true;
      const base = "/hero-reveal-intl";
      video.src = isMobileV ? `${base}-mobile.mp4` : `${base}.mp4`;
      video.load();
      const prime = () => {
        video.play().then(() => video.pause()).catch(() => {});
      };
      if (video.readyState >= 1) prime();
      else video.addEventListener("loadedmetadata", prime, { once: true });
    };
    const interactionEvents = ["scroll", "pointerdown", "touchstart", "wheel", "keydown"];
    if (video && !reduced) {
      if (prewarmOk) {
        idleId = idle.requestIdleCallback
          ? idle.requestIdleCallback(loadVideo, { timeout: 2500 })
          : window.setTimeout(loadVideo, 1500);
      }
      interactionEvents.forEach((ev) =>
        window.addEventListener(ev, loadVideo, { once: true, passive: true }),
      );
    }

    // Initial paint — snap to current scroll position, no easing
    computeTarget();
    currentP = targetP;
    apply(currentP);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      if (idleId && idle.cancelIdleCallback) idle.cancelIdleCallback(idleId);
      else if (idleId) window.clearTimeout(idleId);
      interactionEvents.forEach((ev) => window.removeEventListener(ev, loadVideo));
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [locale]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cx = e.clientX;
    const cy = e.clientY;
    if (hoverRaf.current) return;
    hoverRaf.current = requestAnimationFrame(() => {
      hoverRaf.current = 0;
      const el = frameRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((cx - rect.left) / rect.width) * 100;
      const y = ((cy - rect.top) / rect.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
      el.dataset.spot = "on";
    });
  };
  const onLeave = () => {
    const el = frameRef.current;
    if (!el) return;
    el.dataset.spot = "off";
  };

  return (
    <section ref={sectionRef} className="hero-scroll">
      <div className="hero-sticky">
        <div className="hero-stage" onMouseMove={onMove} onMouseLeave={onLeave}>
          <div ref={frameRef} className="hero-frame">
            <HeroCodeSurface />
            <video
              ref={videoRef}
              className="hero-reveal-video"
              poster="/hero-reveal-poster.webp"
              muted
              playsInline
              preload="none"
              aria-hidden="true"
            />
            <div className="hero-frame-tint" aria-hidden="true" />
            <div className="hero-flashlight" aria-hidden="true" />
            <div className="hero-glow" aria-hidden="true" />
            <div ref={ringRef} className="hero-frame-ring" aria-hidden="true" />
            <div ref={chromeRef} className="hero-chrome" aria-hidden="true">
              <span className="hero-chrome-dot hero-chrome-dot--r" />
              <span className="hero-chrome-dot hero-chrome-dot--y" />
              <span className="hero-chrome-dot hero-chrome-dot--g" />
              <span className="hero-chrome-url">buildbyalex.com</span>
            </div>
            <div ref={badgeRef} className="hero-badge" aria-hidden="true">
              <span className="hero-badge-dot" />
              <span className="hero-badge-text">Live · Warsaw</span>
            </div>
          </div>

          <div ref={contentRef} className="hero-content">
            <Container size="default">
              <div className="mx-auto max-w-[920px] text-center">
                <p
                  className="t-eyebrow hero-eyebrow animate-[fadeUp_700ms_cubic-bezier(0.16,1,0.3,1)_both]"
                  style={{ animationDelay: "60ms" }}
                >
                  {t("eyebrow")}
                </p>

                <h1
                  className="mt-4 sm:mt-5 t-hero hero-headline animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
                  style={{ animationDelay: "160ms" }}
                >
                  {headlineLines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                  <span className="hero-kicker hl-accent">{t("kicker")}</span>
                </h1>

                <p
                  className="mx-auto mt-4 sm:mt-6 max-w-[640px] text-[clamp(15.5px,1.4vw+13px,22px)] leading-[1.45] tracking-[-0.013em] hero-sub animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
                  style={{ animationDelay: "260ms" }}
                >
                  {t("subhead")}
                </p>

                <div
                  ref={ctaRef}
                  className="hero-cta mt-7 sm:mt-10 flex flex-wrap items-center justify-center gap-3 animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
                  style={{ animationDelay: "380ms" }}
                >
                  <Button href="/contact" size="lg">
                    {t("primaryCta")}
                  </Button>
                  <Button href="/work" variant="ghost" size="lg" className="hero-ghost">
                    {t("secondaryCta")}
                  </Button>
                </div>

                <Link
                  href={{ pathname: "/", hash: "reviews" }}
                  aria-label={t("reviews")}
                  className="group mt-6 sm:mt-9 inline-flex items-center justify-center gap-3 rounded-full transition-opacity hover:opacity-90 animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
                  style={{ animationDelay: "440ms" }}
                >
                  <div className="flex -space-x-2.5" aria-hidden="true">
                    {[
                      { bg: "#F4E4D7", fg: "#B45309", t: "MW" },
                      { bg: "#DCEFE8", fg: "#0F766E", t: "AK" },
                      { bg: "#E5EAF4", fg: "#1D4ED8", t: "OH" },
                      { bg: "#F0E5DC", fg: "#9A3412", t: "MK" },
                    ].map((a) => (
                      <span
                        key={a.t}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold ring-2 ring-white/80"
                        style={{ background: a.bg, color: a.fg }}
                      >
                        {a.t}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                          <path
                            d="M8 1.5l1.96 4.27 4.7.55-3.5 3.2.96 4.62L8 11.9l-4.12 2.24.96-4.62-3.5-3.2 4.7-.55L8 1.5z"
                            fill="var(--c-accent)"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="mt-1 text-[12.5px] font-medium text-white/80 underline decoration-white/20 decoration-from-font underline-offset-[3px] transition-colors group-hover:text-white group-hover:decoration-white/50">
                      {t("reviews")}
                    </span>
                  </div>
                </Link>

                <p
                  className="mt-6 sm:mt-8 text-[13px] tracking-[0.04em] hero-trust animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
                  style={{ animationDelay: "560ms" }}
                >
                  {t("trustLine")}
                </p>
              </div>
            </Container>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*='animate-'] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </section>
  );
}

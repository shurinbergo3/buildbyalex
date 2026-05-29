"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=2400&q=85";

export function Hero() {
  const t = useTranslations("home.hero");
  const headlineLines = t("headline").split("\n");
  const last = headlineLines.length - 1;

  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
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

    const apply = (p: number) => {
      const frame = frameRef.current;
      const content = contentRef.current;
      const chrome = chromeRef.current;
      const ring = ringRef.current;
      const badge = badgeRef.current;
      const cta = ctaRef.current;
      if (!frame || !content) return;

      const w = window.innerWidth;
      const isMobile = w < 768;
      const maxTop = isMobile ? 56 : 80;
      const maxX = isMobile ? 14 : Math.min(160, w * 0.08);
      const maxBottom = isMobile ? 72 : 120;
      const maxRadius = isMobile ? 20 : 28;

      frame.style.top = `${p * maxTop}px`;
      frame.style.left = `${p * maxX}px`;
      frame.style.right = `${p * maxX}px`;
      frame.style.bottom = `${p * maxBottom}px`;
      frame.style.borderRadius = `${p * maxRadius}px`;

      // Content stays visible — scales down, dims only slightly
      const scale = 1 - p * 0.18;
      const opacity = 1 - p * 0.25;
      const ty = p * -10;
      content.style.opacity = String(opacity);
      content.style.transform = `translate3d(0, ${ty}px, 0) scale(${scale})`;

      if (chrome) {
        const ch = Math.max(0, Math.min(1, (p - 0.45) / 0.4));
        chrome.style.opacity = String(ch);
        chrome.style.transform = `translate3d(0, ${(1 - ch) * -12}px, 0)`;
      }
      if (ring) {
        ring.style.opacity = String(p * 0.9);
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

    // Initial paint — snap to current scroll position, no easing
    computeTarget();
    currentP = targetP;
    apply(currentP);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

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
            <Image
              src={HERO_IMAGE_URL}
              alt=""
              fill
              priority
              sizes="100vw"
              className="hero-frame-img"
              draggable={false}
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
                  className="mt-5 t-hero hero-headline animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
                  style={{ animationDelay: "160ms" }}
                >
                  {headlineLines.map((line, i) => (
                    <span key={i} className="block">
                      {i === last ? <span className="hl-accent">{line}</span> : line}
                    </span>
                  ))}
                </h1>

                <p
                  className="mx-auto mt-6 max-w-[640px] text-[clamp(17px,1.4vw+13px,22px)] leading-[1.45] tracking-[-0.013em] hero-sub animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
                  style={{ animationDelay: "260ms" }}
                >
                  {t("subhead")}
                </p>

                <div
                  ref={ctaRef}
                  className="hero-cta mt-10 flex flex-wrap items-center justify-center gap-3 animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
                  style={{ animationDelay: "380ms" }}
                >
                  <Button href="/contact" size="lg">
                    {t("primaryCta")}
                  </Button>
                  <Button href="/work" variant="ghost" size="lg" className="hero-ghost">
                    {t("secondaryCta")}
                  </Button>
                </div>

                <p
                  className="mt-12 text-[13px] tracking-[0.04em] hero-trust animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
                  style={{ animationDelay: "500ms" }}
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

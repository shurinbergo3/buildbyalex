"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

export function Hero() {
  const t = useTranslations("home.hero");
  const headlineLines = t("headline").split("\n");
  const last = headlineLines.length - 1;

  const sectionRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const auroraRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    let pending = false;

    const tick = () => {
      pending = false;
      const section = sectionRef.current;
      const content = contentRef.current;
      const aurora = auroraRef.current;
      const grid = gridRef.current;
      if (!section || !content) return;

      const rect = section.getBoundingClientRect();
      const h = rect.height || 1;
      // progress: 0 at top of viewport, 1 when scrolled by section height
      const p = Math.min(1, Math.max(0, -rect.top / h));

      // Headline: gentle lift + scale, fade as it leaves
      const ty = p * -60; // px
      const scale = 1 - p * 0.04;
      const opacity = 1 - p * 0.85;
      content.style.transform = `translate3d(0, ${ty}px, 0) scale(${scale})`;
      content.style.opacity = String(opacity);

      // Aurora: deeper parallax up
      if (aurora) {
        aurora.style.transform = `translate3d(0, ${p * -90}px, 0)`;
      }
      // Grid: opposite, very slow drift down — adds depth
      if (grid) {
        grid.style.transform = `translate3d(0, ${p * 30}px, 0)`;
        grid.style.opacity = String(1 - p * 0.6);
      }
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-shell relative overflow-hidden pt-24 pb-28 md:pt-36 md:pb-40"
    >
      {/* Layer 1: drifting aurora orbs */}
      <div ref={auroraRef} className="hero-aurora" aria-hidden="true">
        <span className="hero-orb hero-orb--a" />
        <span className="hero-orb hero-orb--b" />
        <span className="hero-orb hero-orb--c" />
      </div>

      {/* Layer 2: fine architectural grid */}
      <div ref={gridRef} className="hero-grid" aria-hidden="true" />

      {/* Layer 3: subtle grain (kept from previous design) */}
      <div className="hero-grain" aria-hidden="true" />

      {/* Layer 4: bottom fade into next section for Apple-style continuity */}
      <div className="hero-fade" aria-hidden="true" />

      <Container size="default" className="relative z-10">
        <div ref={contentRef} className="mx-auto max-w-[920px] text-center will-change-transform">
          <p
            className="t-eyebrow animate-[fadeUp_700ms_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: "60ms" }}
          >
            {t("eyebrow")}
          </p>

          <h1
            className="mt-5 t-hero animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: "160ms" }}
          >
            {headlineLines.map((line, i) => (
              <span key={i} className="block">
                {i === last ? <span className="hl-accent">{line}</span> : line}
              </span>
            ))}
          </h1>

          <p
            className="mx-auto mt-6 max-w-[640px] text-[clamp(17px,1.4vw+13px,22px)] leading-[1.45] tracking-[-0.013em] text-[color:var(--color-text-2)] animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: "260ms" }}
          >
            {t("subhead")}
          </p>

          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: "380ms" }}
          >
            <Button href="/contact" size="lg">
              {t("primaryCta")}
            </Button>
            <Button href="/work" variant="ghost" size="lg">
              {t("secondaryCta")}
            </Button>
          </div>

          <p
            className="mt-12 text-[13px] tracking-[0.04em] text-[color:var(--color-text-3)] animate-[fadeUp_900ms_cubic-bezier(0.16,1,0.3,1)_both]"
            style={{ animationDelay: "500ms" }}
          >
            {t("trustLine")}
          </p>
        </div>
      </Container>

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

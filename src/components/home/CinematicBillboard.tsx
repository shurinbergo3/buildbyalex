"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Container } from "@/components/Container";

/* ────────────────────────────────────────────────────────────────────────
   Cinematic billboard — the Apple "M5 Pro" moment, code-style. A giant two-
   line statement pinned to the viewport; a liquid amber sheen flows through
   the letters (CSS background-clip:text) while scroll scrubs the type in and
   out. No video, no images — pure type + light, in the brand's dark palette.
   ──────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;

export function CinematicBillboard() {
  const t = useTranslations("home.billboard");
  const reduce = useReducedMotion();

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Scrub the type in as it enters, hold, drift out as it leaves.
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.28, 0.82, 1], [1.12, 1, 1, 1.05]);
  const blur = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [16, 0, 0, 12]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  // Lines drift in from opposite sides.
  const x1 = useTransform(scrollYProgress, [0, 0.3], [-60, 0]);
  const x2 = useTransform(scrollYProgress, [0, 0.3], [60, 0]);
  // Kicker + caption fade slightly after the headline.
  const metaOpacity = useTransform(scrollYProgress, [0.12, 0.32, 0.8, 0.95], [0, 1, 1, 0]);
  const metaY = useTransform(scrollYProgress, [0.12, 0.32], [24, 0]);

  const motionStyle = reduce ? {} : { opacity, scale, filter };

  return (
    <section ref={ref} className="cb-section relative bg-[#08090c] text-white" aria-label={t("kicker")}>
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden">
        {/* Ambient glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[760px] w-[1100px] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[130px]"
          style={{ background: "radial-gradient(ellipse, rgba(255,122,45,0.14) 0%, transparent 65%)" }}
        />
        {/* Faint grid for code-surface depth */}
        <div aria-hidden className="cb-grid pointer-events-none absolute inset-0 opacity-[0.05]" />

        <Container className="relative text-center">
          <motion.p
            className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/45 sm:text-[13px]"
            style={reduce ? {} : { opacity: metaOpacity, y: metaY }}
          >
            {t("kicker")}
          </motion.p>

          <motion.h2
            className="cb-type mt-5 font-semibold leading-[0.96] tracking-[-0.04em] sm:mt-7"
            style={motionStyle}
          >
            <motion.span className="block" style={reduce ? {} : { x: x1 }}>
              {t("line1")}
            </motion.span>
            <motion.span className="block" style={reduce ? {} : { x: x2 }}>
              {t("line2")}
            </motion.span>
          </motion.h2>

          <motion.p
            className="mx-auto mt-7 max-w-[560px] text-[16px] leading-[1.55] text-white/55 sm:mt-9 sm:text-[18px]"
            style={reduce ? {} : { opacity: metaOpacity, y: metaY }}
          >
            {t("caption")}
          </motion.p>
        </Container>
      </div>

      <style>{`
        .cb-section { height: 200vh; }
        @media (max-width: 768px) { .cb-section { height: 180vh; } }

        .cb-type {
          font-size: clamp(46px, 11vw, 150px);
          background-image: linear-gradient(
            100deg,
            #b8540f 0%,
            #ff7a2d 26%,
            #ffd9b8 44%,
            #ffffff 50%,
            #ffd9b8 56%,
            #ff7a2d 74%,
            #b8540f 100%
          );
          background-size: 250% 100%;
          background-position: 0% 50%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: cbSheen 7s linear infinite;
        }
        @keyframes cbSheen {
          to { background-position: -250% 50%; }
        }

        .cb-grid {
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 75%);
        }

        @media (prefers-reduced-motion: reduce) {
          .cb-type { animation: none; background-position: 50% 50%; }
        }
      `}</style>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { caseImages, caseKeyToSlug, type CaseKey } from "@/lib/cases";

/* ────────────────────────────────────────────────────────────────────────
   Cinematic case "cover" — a magazine spread for the flagship project. The
   hero photo drifts behind a dark scrim (parallax), and the title, metric and
   results rise into place as you scroll past. One strong beat before the
   browsable work carousel. Featured case: VisionAir.
   ──────────────────────────────────────────────────────────────────────── */

const FEATURED: CaseKey = "visionair";

export function CinematicCaseReveal() {
  const t = useTranslations(`work.cases.${FEATURED}`);
  const tr = useTranslations("home.caseReveal");

  const industry = t("industry");
  const title = t("title");
  const tagline = t("tagline");
  const metricValue = t("metric.value");
  const metricLabel = t("metric.label");
  const results = (t.raw("results") as string[]).slice(0, 2);
  const img = caseImages[FEATURED].src;
  const slug = caseKeyToSlug[FEATURED];

  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Background drifts slowly — the signature parallax.
  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.22, 1.16, 1.24]);

  // Copy rises in, holds, drifts out.
  const contentY = useTransform(scrollYProgress, [0.1, 0.36, 0.82, 1], [70, 0, 0, -50]);
  const contentOpacity = useTransform(scrollYProgress, [0.08, 0.3, 0.82, 0.98], [0, 1, 1, 0]);
  const titleY = useTransform(scrollYProgress, [0.1, 0.42], [44, 0]);

  return (
    <section ref={ref} className="ccr-section relative bg-black text-white">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Parallax photo */}
        <motion.div
          aria-hidden
          className="absolute -inset-[8%] bg-cover bg-center will-change-transform"
          style={
            reduce
              ? { backgroundImage: `url(${img})` }
              : { backgroundImage: `url(${img})`, y: bgY, scale: bgScale }
          }
        />
        {/* Cinematic scrim — dark at the bottom for legible copy, vignette on the left */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.58) 34%, rgba(0,0,0,0.20) 66%, rgba(0,0,0,0.42) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 55%)" }}
        />

        {/* Copy — magazine cover, bottom-left */}
        <div className="absolute inset-0 flex items-end">
          <Container className="pb-[11vh] sm:pb-[13vh]">
            <motion.div
              className="max-w-[820px]"
              style={reduce ? {} : { opacity: contentOpacity, y: contentY }}
            >
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] sm:text-[13px]" style={{ color: "var(--c-accent)" }}>
                {tr("eyebrow")} · {industry}
              </p>

              <motion.h2
                className="mt-4 font-semibold leading-[0.9] tracking-[-0.04em]"
                style={{
                  fontSize: "clamp(56px, 9.5vw, 132px)",
                  ...(reduce ? {} : { y: titleY }),
                }}
              >
                {title}
              </motion.h2>

              <p className="mt-5 max-w-[560px] text-[17px] leading-[1.5] text-white/75 sm:text-[19px]">
                {tagline}
              </p>

              {/* Metric + results */}
              <div className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-5">
                <div>
                  <div className="text-[clamp(34px,4vw,52px)] font-semibold leading-none tracking-[-0.02em]">
                    {metricValue}
                  </div>
                  <div className="mt-1.5 text-[13px] uppercase tracking-wider text-white/55">{metricLabel}</div>
                </div>

                <ul className="flex flex-col gap-2">
                  {results.map((r) => (
                    <li key={r} className="flex items-center gap-2.5 text-[14px] text-white/75">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0">
                        <path d="M5 13l4 4L19 7" stroke="var(--c-accent)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={{ pathname: "/work/[slug]", params: { slug } }}
                className="group mt-9 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold text-black transition-transform duration-200 hover:scale-[1.03]"
                style={{ background: "var(--c-accent)" }}
              >
                {tr("cta")}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform duration-200 group-hover:translate-x-0.5">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
          </Container>
        </div>
      </div>

      <style>{`
        .ccr-section { height: 175vh; }
        @media (max-width: 768px) { .ccr-section { height: 150vh; } }
      `}</style>
    </section>
  );
}

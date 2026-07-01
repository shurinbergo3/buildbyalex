"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

/* Body Forge landing (bodyforges.com) showcase — the case's centrepiece. One
   segmented control flips the whole stage between the RU and EN builds (the two
   languages the site actually ships), proving the bilingual/responsive story: a
   browser window + phone swap in sync, then three real scroll-sections follow.
   Every frame is an actual screenshot of the shipped site. */

const ACCENT = "#C8FF00";
const ACCENT_INK = "#586d00";

type Lang = "ru" | "en";

type Highlight = { tag: string; title: string; desc: string };
type Scene = { tag: string; title: string; desc: string; img: "loop" | "logset" | "analyze" };

const SCENE_IMG: Record<Scene["img"], string> = {
  loop: "bodyforge-site-loop",
  logset: "bodyforge-site-logset",
  analyze: "bodyforge-site-analyze",
};

function img(base: string, lang: Lang) {
  // EN screenshots have no suffix; RU builds carry `-ru`.
  return `/cases/${base}${lang === "ru" ? "-ru" : ""}.webp`;
}

export function BodyForgeSiteShowcase() {
  const t = useTranslations("work.caseShowcase.bodyforgesite");
  const locale = useLocale();

  const highlights = useMemo(() => t.raw("highlights") as Highlight[], [t]);
  const scenes = useMemo(() => t.raw("scenes") as Scene[], [t]);

  const [lang, setLang] = useState<Lang>(locale === "ru" ? "ru" : "en");

  // hero/mobile shots are stored with an explicit -en/-ru suffix.
  const desktop = `/cases/bodyforge-site-hero-${lang}.webp`;
  const mobile = `/cases/bodyforge-site-mobile-${lang}.webp`;

  return (
    <Section pad="default" tone="alt">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow" style={{ color: ACCENT_INK }}>
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 text-[clamp(28px,3vw+12px,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-[color:var(--color-text-1)]">
              {t("headline")}
            </h2>
            <p className="mx-auto mt-5 max-w-[580px] text-[17px] leading-[1.55] text-[color:var(--color-text-2)]">
              {t("subhead")}
            </p>
          </div>
        </Reveal>

        {/* Language toggle */}
        <Reveal delay={80}>
          <div className="mt-10 flex items-center justify-center gap-3">
            <span className="text-[13px] text-[color:var(--color-text-3)]">{t("langHint")}</span>
            <div
              className="relative inline-flex rounded-full border border-[color:var(--color-divider)] bg-[color:var(--color-bg)] p-1"
              role="group"
              aria-label={t("langHint")}
            >
              {(["ru", "en"] as Lang[]).map((l) => {
                const on = lang === l;
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLang(l)}
                    aria-pressed={on}
                    className="relative z-10 rounded-full px-5 py-1.5 text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors"
                    style={{ color: on ? "#0a0a0a" : "var(--color-text-3)" }}
                  >
                    {on && (
                      <motion.span
                        layoutId="bf-site-lang"
                        className="absolute inset-0 -z-10 rounded-full"
                        style={{ background: ACCENT }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {l.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Stage: browser + phone, both swap with language */}
        <Reveal delay={120}>
          <div className="relative mt-12 overflow-hidden rounded-[32px] border border-[color:var(--color-divider)] bg-[#08080a] p-6 md:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(60% 50% at 50% 0%, rgba(200,255,0,0.10), transparent 68%)" }}
            />
            <div className="relative mx-auto max-w-[720px] pb-[13%]">
              {/* Browser */}
              <div className="w-[90%]">
                <div className="relative overflow-hidden rounded-[13px] border border-white/[0.08] bg-[#0b0b0d] shadow-[0_40px_72px_-30px_rgba(0,0,0,0.7)]">
                  <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#111113] px-4 py-2.5">
                    <span className="flex gap-1.5">
                      <span className="h-[9px] w-[9px] rounded-full bg-[#ff5f57]" />
                      <span className="h-[9px] w-[9px] rounded-full bg-[#febc2e]" />
                      <span className="h-[9px] w-[9px] rounded-full bg-[#28c840]" />
                    </span>
                    <span className="mx-auto rounded-md bg-white/[0.05] px-3 py-1 text-[12px] text-white/55">
                      bodyforges.com/{lang}
                    </span>
                    <span className="w-6" />
                  </div>
                  <div className="relative aspect-[1440/900] overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={lang}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0"
                      >
                        <Image src={desktop} alt={`bodyforges.com — ${lang.toUpperCase()}`} fill sizes="(max-width: 768px) 88vw, 650px" className="object-cover object-top" />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="absolute bottom-0 right-0 z-20 w-[28%] min-w-[120px] max-w-[176px]">
                <div className="relative rounded-[15%/7.2%] border-[5px] border-[#141416] bg-[#141416] shadow-[0_30px_50px_-22px_rgba(0,0,0,0.7)]">
                  <div className="relative aspect-[1170/2532] overflow-hidden rounded-[12%/5.8%] bg-black">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={lang}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0"
                      >
                        <Image src={mobile} alt="" aria-hidden="true" fill sizes="176px" className="object-cover object-top" />
                      </motion.div>
                    </AnimatePresence>
                    <span className="absolute left-1/2 top-[3%] h-[3%] w-[26%] -translate-x-1/2 rounded-full bg-black" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Highlights */}
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-3">
          {highlights.map((h, i) => (
            <Reveal key={h.title} delay={i * 90}>
              <div className="h-full rounded-[22px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg)] p-6">
                <span
                  className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
                  style={{ background: "rgba(200,255,0,0.12)", color: ACCENT_INK }}
                >
                  {h.tag}
                </span>
                <h3 className="mt-4 text-[19px] font-semibold tracking-[-0.014em] text-[color:var(--color-text-1)]">
                  {h.title}
                </h3>
                <p className="mt-2 text-[15px] leading-[1.55] text-[color:var(--color-text-2)]">{h.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Scroll sections gallery */}
        <div className="mt-16 space-y-6">
          {scenes.map((s, i) => (
            <Reveal key={s.title} delay={40}>
              <div className={`grid items-center gap-6 md:grid-cols-2 md:gap-12 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                <div className="relative overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#0b0b0d] shadow-[0_30px_60px_-34px_rgba(0,0,0,0.7)]">
                  <div className="flex items-center gap-1.5 border-b border-white/[0.06] bg-[#111113] px-3.5 py-2">
                    <span className="h-[8px] w-[8px] rounded-full bg-[#ff5f57]" />
                    <span className="h-[8px] w-[8px] rounded-full bg-[#febc2e]" />
                    <span className="h-[8px] w-[8px] rounded-full bg-[#28c840]" />
                  </div>
                  <div className="relative aspect-[1600/1000] overflow-hidden">
                    <Image
                      src={img(SCENE_IMG[s.img], lang)}
                      alt={s.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 540px"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
                <div>
                  <p className="t-eyebrow" style={{ color: ACCENT_INK }}>
                    {s.tag}
                  </p>
                  <h3 className="mt-3 text-[clamp(20px,1.6vw+12px,28px)] font-semibold leading-[1.2] tracking-[-0.016em] text-[color:var(--color-text-1)]">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-[15.5px] leading-[1.6] text-[color:var(--color-text-2)]">
                    {s.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "motion/react";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";
import { TELEGRAM_URL } from "@/lib/contacts";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
      <path
        d="M3 8.4l3.1 3.1L13 4.6"
        stroke="var(--c-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Cross() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
      <path
        d="M4.5 4.5l7 7M11.5 4.5l-7 7"
        stroke="var(--color-text-3)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Column({
  title,
  items,
  tone,
  delay,
}: {
  title: string;
  items: string[];
  tone: "yes" | "no";
  delay: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const yes = tone === "yes";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={cn(
        "relative overflow-hidden rounded-[22px] border p-6 sm:p-7",
        yes
          ? "border-[color:var(--c-accent)]/30 bg-[color:var(--color-bg-elev)] shadow-card"
          : "border-[color:var(--c-hairline)] bg-transparent",
      )}
    >
      {yes && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, var(--c-accent), transparent)",
          }}
        />
      )}

      <h3
        className={cn(
          "text-[15px] font-semibold tracking-[-0.011em]",
          yes ? "text-[color:var(--color-text)]" : "text-[color:var(--color-text-3)]",
        )}
      >
        {title}
      </h3>

      <ul className="mt-5 space-y-4">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: delay + 0.1 + i * 0.08, ease: EASE }}
            className="flex gap-3"
          >
            {yes ? <Check /> : <Cross />}
            <span
              className={cn(
                "text-[15px] leading-[1.55]",
                yes ? "text-[color:var(--color-text-2)]" : "text-[color:var(--color-text-3)]",
              )}
            >
              {item}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export function FitCheck() {
  const t = useTranslations("home.fit");
  const yes = t.raw("yes") as string[];
  const no = t.raw("no") as string[];

  return (
    <Section tone="alt" pad="loose">
      <Container>
        <div className="max-w-[620px]">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="mt-4 t-h2 text-balance">{t("headline")}</h2>
          <p className="mt-4 text-[16.5px] leading-[1.6] text-[color:var(--color-text-2)]">
            {t("lead")}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 md:gap-6">
          <Column title={t("yesTitle")} items={yes} tone="yes" delay={0} />
          <Column title={t("noTitle")} items={no} tone="no" delay={0.12} />
        </div>

        <div className="mt-10 flex flex-col items-start gap-5 rounded-[22px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] p-6 sm:p-7 md:flex-row md:items-center md:justify-between">
          <div className="max-w-[520px]">
            <p className="text-[17px] font-semibold tracking-[-0.014em]">{t("ctaTitle")}</p>
            <p className="mt-2 text-[15px] leading-[1.55] text-[color:var(--color-text-2)]">
              {t("ctaBody")}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3">
            <Button href="/contact" size="md">
              {t("ctaPrimary")}
            </Button>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[14.5px] font-medium text-[color:var(--c-accent-ink)] underline-offset-4 hover:underline dark:text-[color:var(--c-accent)]"
            >
              {t("ctaTelegram")} ↗
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}

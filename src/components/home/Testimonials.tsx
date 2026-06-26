"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { GoogleG } from "@/components/GoogleG";
import { ReviewForm } from "./ReviewForm";

type Review = { name: string; role: string; date: string; quote: string; rating?: number; publishAt?: string };

const COLLAPSED_COUNT = 6;

/* Muted, identity-style avatar tints — not UI accents. */
const AVATAR_TINTS = [
  { bg: "#F4E4D7", fg: "#B45309" },
  { bg: "#E2E8F0", fg: "#475569" },
  { bg: "#DCEFE8", fg: "#0F766E" },
  { bg: "#EAE2F2", fg: "#6D28D9" },
  { bg: "#F3E3E3", fg: "#B91C1C" },
  { bg: "#E5EAF4", fg: "#1D4ED8" },
  { bg: "#F4EAD7", fg: "#92750E" },
  { bg: "#E2ECE0", fg: "#3F6212" },
  { bg: "#F0E5DC", fg: "#9A3412" },
  { bg: "#E8E4DD", fg: "#57534E" },
  { bg: "#DEE9EC", fg: "#0E7490" },
  { bg: "#EFE6D8", fg: "#854D0E" },
];

function StarRow({ value = 5, size = 15 }: { value?: number; size?: number }) {
  const full = Math.floor(value);
  const frac = value - full;
  return (
    <div className="flex gap-0.5" aria-label={`${value} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = i < full ? 1 : i === full ? frac : 0;
        const id = `star-${size}-${i}-${Math.round(fill * 100)}`;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
            {fill > 0 && fill < 1 && (
              <defs>
                <linearGradient id={id}>
                  <stop offset={`${fill * 100}%`} stopColor="var(--c-accent)" />
                  <stop offset={`${fill * 100}%`} stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <path
              d="M8 1.5l1.96 4.27 4.7.55-3.5 3.2.96 4.62L8 11.9l-4.12 2.24.96-4.62-3.5-3.2 4.7-.55L8 1.5z"
              fill={fill >= 1 ? "var(--c-accent)" : fill > 0 ? `url(#${id})` : "transparent"}
              stroke={fill >= 1 ? "var(--c-accent)" : "color-mix(in srgb, var(--color-text-3) 55%, transparent)"}
              strokeWidth="0.9"
              strokeLinejoin="round"
            />
          </svg>
        );
      })}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function ReviewCard({ r, i }: { r: Review; i: number }) {
  const tint = AVATAR_TINTS[i % AVATAR_TINTS.length];
  return (
    <figure className="flex h-full flex-col rounded-[20px] border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] p-6 transition-[border-color,box-shadow] duration-300 hover:border-[color:var(--color-text-3)]/30 hover:shadow-[0_12px_30px_-18px_rgba(10,10,10,0.18)]">
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold"
          style={{ background: tint.bg, color: tint.fg }}
          aria-hidden="true"
        >
          {initials(r.name)}
        </span>
        <div className="min-w-0 flex-1">
          <figcaption className="flex items-center gap-1.5">
            <span className="truncate text-[14.5px] font-semibold tracking-[-0.011em] text-[color:var(--color-text)]">
              {r.name}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-label="verified" className="shrink-0">
              <circle cx="12" cy="12" r="9" fill="#3897F0" />
              <path d="M8.5 12.3l2.3 2.3 4.7-5.1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </figcaption>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <StarRow value={r.rating ?? 5} />
        <span className="text-[12px] text-[color:var(--color-text-3)]">{r.date}</span>
      </div>

      <blockquote className="mt-3 text-[15px] leading-[1.55] text-[color:var(--color-text-2)]">
        {r.quote}
      </blockquote>
    </figure>
  );
}

export function Testimonials() {
  const t = useTranslations("home.testimonials");
  const all = t.raw("list") as Review[];
  const rating = t("rating");
  const [expanded, setExpanded] = useState(false);

  // Reveal scheduled reviews gradually: only those whose publishAt has arrived.
  // Gate on mount so SSR and first client render match (no hydration drift).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const list = mounted
    ? all.filter((r) => !r.publishAt || new Date(r.publishAt).getTime() <= Date.now())
    : all.filter((r) => !r.publishAt);

  // Count + histogram derive from the currently-visible reviews, so the "N Google
  // reviews" label and the 5★→1★ breakdown grow automatically as scheduled ones land.
  const count = t("count");
  const distribution = [5, 4, 3, 2, 1].map((s) => list.filter((r) => (r.rating ?? 5) === s).length);
  const total = list.length;
  const hasMore = list.length > COLLAPSED_COUNT;
  const visible = list.slice(0, COLLAPSED_COUNT);
  const hidden = list.slice(COLLAPSED_COUNT);

  return (
    <Section id="reviews" tone="alt" pad="default" className="scroll-mt-20">
      <Container>
        <Reveal>
          <div className="max-w-[620px]">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
            <p className="mt-4 t-body-lg text-[color:var(--color-text-2)]">{t("subhead")}</p>
          </div>
        </Reveal>

        {/* Google-style rating summary: big score + distribution histogram */}
        <Reveal delay={80}>
          <div className="mt-9 grid gap-6 rounded-[22px] border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10 sm:p-8 md:mt-12">
            <div className="flex flex-col items-center gap-1.5 border-b border-[color:var(--color-divider)] pb-6 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-10">
              <span className="text-[52px] font-semibold leading-none tracking-[-0.04em] text-[color:var(--color-text)]">
                {rating}
              </span>
              <StarRow value={Number(rating.replace(",", "."))} size={17} />
              <span className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-[color:var(--color-text-3)]">
                <GoogleG />
                {total} {count}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              {distribution.map((n, idx) => {
                const star = 5 - idx;
                const pct = total ? (n / total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-3 shrink-0 text-right text-[12.5px] tabular-nums text-[color:var(--color-text-3)]">
                      {star}
                    </span>
                    <div className="h-[7px] flex-1 overflow-hidden rounded-full bg-[color:var(--c-hairline)]">
                      <motion.div
                        className="h-full rounded-full bg-[color:var(--c-accent)]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                        transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <span className="w-7 shrink-0 text-right text-[12px] tabular-nums text-[color:var(--color-text-3)]">
                      {n}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Reviews grid */}
        <div className="relative mt-10 md:mt-12">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((r, i) => (
              <Reveal key={r.name} delay={(i % 3) * 80}>
                <ReviewCard r={r} i={i} />
              </Reveal>
            ))}
          </div>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="more"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                {hidden.length > 0 && (
                  <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {hidden.map((r, i) => (
                      <motion.div
                        key={r.name}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <ReviewCard r={r} i={i + COLLAPSED_COUNT} />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Leave a review — revealed together with the full list */}
                <div className="mx-auto mt-16 max-w-[680px] md:mt-20">
                  <ReviewForm />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fade veil over the last collapsed row */}
          {hasMore && !expanded && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[color:var(--color-bg-alt)] to-transparent"
            />
          )}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] px-5 py-2.5 text-[14.5px] font-medium tracking-[-0.011em] text-[color:var(--color-text)] transition-[background,border-color,transform] duration-200 hover:bg-[color:var(--color-bg-alt)] active:translate-y-[1px]"
            >
              {expanded ? t("showLess") : t("showAll", { count: list.length })}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                aria-hidden="true"
                className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              >
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </Container>
    </Section>
  );
}

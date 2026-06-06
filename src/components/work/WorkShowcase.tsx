"use client";

import { memo, useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import type { CaseCategory } from "@/lib/cases";

export type GalleryCase = {
  key: string;
  slug: string;
  category: CaseCategory;
  industry: string;
  title: string;
  tagline: string;
  metricValue: string;
  metricLabel: string;
  imageSrc: string;
  imageAlt: string;
};

type FilterKey = "all" | CaseCategory;
const FILTER_ORDER: FilterKey[] = ["all", "web", "ai", "mobile"];

const PILL_SPRING = { type: "spring" as const, stiffness: 420, damping: 36 };

export function WorkShowcase({
  cases,
  labels,
  filters,
}: {
  cases: GalleryCase[];
  labels: { eyebrow: string; headline: string; subhead: string; cta: string; live: string };
  filters: Record<FilterKey, string>;
}) {
  const [active, setActive] = useState<FilterKey>("all");
  const reduce = useReducedMotion();

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = { all: cases.length, web: 0, ai: 0, mobile: 0 };
    for (const item of cases) c[item.category] += 1;
    return c;
  }, [cases]);

  const visible = useMemo(
    () => (active === "all" ? cases : cases.filter((c) => c.category === active)),
    [active, cases],
  );

  return (
    <>
      {/* ───────── Header ───────── */}
      <header className="relative overflow-hidden pt-16 pb-9 md:pt-24 md:pb-12">
        {/* twin accent auroras for an editorial, Apple-keynote backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-28 -z-10 h-[520px]"
          style={{
            background:
              "radial-gradient(ellipse 50% 64% at 16% 0%, color-mix(in srgb, var(--c-accent) 18%, transparent), transparent 68%), radial-gradient(ellipse 44% 56% at 92% 6%, color-mix(in srgb, var(--c-accent) 10%, transparent), transparent 70%)",
          }}
        />
        <Container>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="t-eyebrow text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
              {labels.eyebrow}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] px-3 py-1 text-[12px] font-medium text-[color:var(--color-text-2)] shadow-[var(--shadow-card)]">
              <span className="work-live-dot" aria-hidden="true" />
              {labels.live}
            </span>
          </div>

          <h1 className="mt-5 max-w-[16ch] text-[clamp(42px,5.8vw+8px,82px)] font-semibold leading-[1.02] tracking-[-0.036em]">
            {labels.headline}
          </h1>
          <p className="mt-6 max-w-[560px] text-[clamp(17px,1.2vw+13px,21px)] leading-[1.5] tracking-[-0.013em] text-[color:var(--color-text-2)]">
            {labels.subhead}
          </p>

          {/* Filter bar */}
          <div
            className="mt-9 flex flex-wrap items-center gap-2"
            role="tablist"
            aria-label={labels.eyebrow}
          >
            {FILTER_ORDER.map((f) => {
              const isActive = active === f;
              return (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(f)}
                  className={`relative inline-flex h-9 items-center rounded-full px-4 text-[14px] font-medium transition-[color,transform] duration-200 active:translate-y-[1px] ${
                    isActive
                      ? "text-[color:var(--color-bg)]"
                      : "text-[color:var(--color-text-2)] hover:text-[color:var(--color-text)]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="work-filter-pill"
                      className="absolute inset-0 rounded-full bg-[color:var(--color-text)]"
                      transition={PILL_SPRING}
                    />
                  )}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-full border border-[color:var(--c-hairline)]" />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {filters[f]}
                    <span className="font-mono text-[11px] tabular-nums opacity-55">
                      {counts[f]}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </header>

      {/* ───────── Gallery ───────── */}
      <section className="pb-20 md:pb-28">
        <Container>
          <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12 lg:gap-6">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((c, i) => (
                <CaseCard
                  key={c.key}
                  data={c}
                  index={i}
                  featured={i === 0}
                  cta={labels.cta}
                  categoryLabel={filters[c.category]}
                  reduce={!!reduce}
                />
              ))}
            </AnimatePresence>
          </div>
        </Container>
      </section>
    </>
  );
}

/* ─────────────────────────── Card ───────────────────────────
   Image-forward, cinematic overlay cards — the whole tile is the
   photograph, with a graded scrim carrying white type at the foot.
   The lead case spans the full width as a wide banner; the rest sit
   two-up. Cards tilt toward the cursor and light a luminous edge. */

const CaseCard = memo(function CaseCard({
  data,
  index,
  featured,
  cta,
  categoryLabel,
  reduce,
}: {
  data: GalleryCase;
  index: number;
  featured: boolean;
  cta: string;
  categoryLabel: string;
  reduce: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18, mass: 0.4 });
  const tilt = featured ? 2.5 : 4;
  const rotateX = useTransform(srx, [-0.5, 0.5], [tilt, -tilt]);
  const rotateY = useTransform(sry, [-0.5, 0.5], [-tilt, tilt]);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      if (!reduce) {
        rx.set(py - 0.5);
        ry.set(px - 0.5);
      }
    },
    [rx, ry, reduce],
  );

  const onLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
  }, [rx, ry]);

  return (
    <motion.article
      layout
      initial={reduce ? false : { opacity: 0, y: 18, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 30,
        mass: 0.6,
        delay: reduce ? 0 : Math.min(index * 0.05, 0.25),
      }}
      className={featured ? "lg:col-span-12" : "lg:col-span-6"}
    >
      <Link
        ref={ref}
        href={{ pathname: "/work/[slug]", params: { slug: data.slug } }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="work-card group relative block h-full"
        aria-label={`${data.title} — ${data.industry}`}
      >
        <motion.div
          style={{ rotateX, rotateY, transformPerspective: 1100 }}
          className={`relative flex h-full transform-gpu flex-col justify-end overflow-hidden rounded-[24px] border border-[color:var(--c-hairline)] bg-[#0b0b0c] shadow-[var(--shadow-card)] transition-[box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[var(--shadow-card-hover)] md:rounded-[30px] ${
            featured
              ? "aspect-[16/12] sm:aspect-[16/9] lg:aspect-[21/8]"
              : "aspect-[16/12] sm:aspect-[4/3]"
          }`}
        >
          {/* Photograph — slow cinematic zoom on hover */}
          <Image
            src={data.imageSrc}
            alt={data.imageAlt}
            fill
            sizes={featured ? "(max-width: 1024px) 100vw, 1180px" : "(max-width: 1024px) 100vw, 50vw"}
            className="absolute inset-0 object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />

          {/* Graded scrim — guarantees white type legibility over any photo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: featured
                ? "linear-gradient(90deg, rgba(6,7,9,0.86) 0%, rgba(6,7,9,0.52) 38%, rgba(6,7,9,0.08) 64%, transparent 100%), linear-gradient(0deg, rgba(6,7,9,0.78) 0%, transparent 46%)"
                : "linear-gradient(0deg, rgba(6,7,9,0.90) 2%, rgba(6,7,9,0.42) 42%, rgba(6,7,9,0.04) 72%, transparent 100%)",
            }}
          />

          {/* ── Top meta row ── */}
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-5 md:p-6">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-black/25 px-2.5 py-1 font-mono text-[11px] tabular-nums text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/15 bg-black/25 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-white/85 backdrop-blur-md">
              {categoryLabel}
            </span>
          </div>

          {/* ── Foot content ── */}
          <div
            className={`relative z-10 flex flex-col p-5 md:p-7 ${
              featured ? "gap-3.5 md:max-w-[60%] md:p-9 lg:p-11" : "gap-2.5"
            }`}
          >
            <span className="inline-flex w-fit items-center gap-2 text-[12px] font-medium uppercase tracking-[0.05em] text-white/65">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]" aria-hidden="true" />
              {data.industry}
            </span>

            <h2
              className={`font-semibold leading-[1.05] tracking-[-0.028em] text-white ${
                featured
                  ? "text-[clamp(30px,3.4vw+10px,54px)]"
                  : "text-[clamp(22px,1.4vw+15px,30px)]"
              }`}
            >
              {data.title}
            </h2>

            <p
              className={`text-white/72 ${
                featured
                  ? "max-w-[46ch] text-[16.5px] leading-[1.5]"
                  : "line-clamp-2 text-[14.5px] leading-[1.45]"
              }`}
            >
              {data.tagline}
            </p>

            {/* metric + CTA row */}
            <div className={`mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-3 ${featured ? "md:mt-3" : ""}`}>
              <div className="flex items-baseline gap-2">
                <span
                  className={`font-mono font-semibold tabular-nums tracking-tight text-[color:var(--c-accent)] ${
                    featured ? "text-[30px] md:text-[38px]" : "text-[24px]"
                  }`}
                >
                  {data.metricValue}
                </span>
                <span className="max-w-[16ch] text-[12px] leading-[1.2] text-white/55">
                  {data.metricLabel}
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-white transition-colors">
                {cta}
                <span className="grid h-6 w-6 place-items-center rounded-full border border-white/25 bg-white/[0.08] transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:border-[color:var(--c-accent)] group-hover:bg-[color:var(--c-accent)] group-hover:text-black">
                  <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                    <path
                      d="M5 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </span>
              </span>
            </div>
          </div>

          {/* Cursor-following spotlight glow */}
          <span aria-hidden="true" className="work-card__glow" />
          {/* Cursor-following luminous border */}
          <span aria-hidden="true" className="work-card__ring" />
        </motion.div>
      </Link>
    </motion.article>
  );
});

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
      <header className="relative overflow-hidden pt-16 pb-10 md:pt-24 md:pb-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[460px]"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 18% 0%, color-mix(in srgb, var(--c-accent) 16%, transparent), transparent 70%)",
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

          <h1 className="mt-5 max-w-[15ch] text-[clamp(40px,5.5vw+8px,76px)] font-semibold leading-[1.04] tracking-[-0.034em]">
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
          <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-12">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((c, i) => (
                <CaseCard
                  key={c.key}
                  data={c}
                  index={i}
                  featured={i === 0}
                  cta={labels.cta}
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

/* ─────────────────────────── Card ─────────────────────────── */

const CaseCard = memo(function CaseCard({
  data,
  index,
  featured,
  cta,
  reduce,
}: {
  data: GalleryCase;
  index: number;
  featured: boolean;
  cta: string;
  reduce: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 18, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 150, damping: 18, mass: 0.4 });
  const tilt = featured ? 3 : 5;
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
      initial={reduce ? false : { opacity: 0, y: 16, scale: 0.985 }}
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
          style={{ rotateX, rotateY, transformPerspective: 1000 }}
          className={`relative flex h-full transform-gpu overflow-hidden rounded-[24px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] shadow-[var(--shadow-card)] transition-[box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:shadow-[var(--shadow-card-hover)] md:rounded-[28px] ${
            featured ? "flex-col lg:flex-row" : "flex-col"
          }`}
        >
          {/* Image */}
          <div
            className={`relative overflow-hidden ${
              featured
                ? "aspect-[16/10] lg:aspect-auto lg:min-h-[440px] lg:w-[58%]"
                : "aspect-[16/10] w-full"
            }`}
          >
            <Image
              src={data.imageSrc}
              alt={data.imageAlt}
              fill
              sizes={featured ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 100vw, 50vw"}
              className="object-cover transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

            {/* Index chip */}
            <span className="absolute left-4 top-4 inline-flex items-center rounded-full border border-white/25 bg-black/30 px-2.5 py-1 font-mono text-[11px] tabular-nums text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Metric chip — the headline number */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
              <div className="inline-flex items-baseline gap-2 rounded-2xl border border-white/12 bg-black/35 px-3.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-md">
                <span
                  className={`font-mono font-semibold tabular-nums tracking-tight text-white ${
                    featured ? "text-[26px] md:text-[30px]" : "text-[22px]"
                  }`}
                >
                  {data.metricValue}
                </span>
                <span className="max-w-[14ch] text-[12px] leading-[1.25] text-white/72">
                  {data.metricLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            className={`relative flex flex-1 flex-col ${
              featured ? "gap-4 p-7 md:p-10 lg:justify-center" : "gap-3 p-6 md:p-7"
            }`}
          >
            <span className="inline-flex w-fit items-center gap-2 text-[12px] font-medium uppercase tracking-[0.04em] text-[color:var(--color-text-3)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]" aria-hidden="true" />
              {data.industry}
            </span>

            <h2 className={featured ? "t-h2" : "t-h3"}>{data.title}</h2>

            <p
              className={`text-[color:var(--color-text-2)] ${
                featured
                  ? "max-w-[48ch] text-[17px] leading-[1.5]"
                  : "line-clamp-2 text-[15px] leading-[1.5]"
              }`}
            >
              {data.tagline}
            </p>

            <span
              className={`inline-flex items-center gap-1.5 text-[14px] font-medium text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)] ${
                featured ? "pt-2" : "mt-auto pt-3"
              }`}
            >
              {cta}
              <svg
                width="15"
                height="15"
                viewBox="0 0 14 14"
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path
                  d="M5 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </span>
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

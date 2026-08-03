"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Eyebrow } from "@/components/Eyebrow";
import { Button } from "@/components/Button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Live sites behind claim 03 — same slugs the /work gallery uses. */
const LIVE_SITES = [
  { domain: "legalwin.pl", slug: "legalwin" },
  { domain: "visionair.biz.pl", slug: "visionair" },
  { domain: "baltic-dockyard.pl", slug: "baltic-dockyard" },
  { domain: "bodyforges.com", slug: "body-forge-site" },
] as const;

const LIVE_COUNT = 7;
const CONV_BEFORE = 0.8;
const CONV_AFTER = 4.2;

function useCountUp(target: number, active: boolean, decimals = 0, ms = 1100) {
  const reduced = useReducedMotion();
  const locale = useLocale();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      setValue(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, ms, reduced]);

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/** Card shell: cursor spotlight + lift on hover. */
function ProofCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const raf = useRef(0);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const cx = e.clientX;
    const cy = e.clientY;
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((cx - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((cy - r.top) / r.height) * 100}%`);
    });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "group/card relative overflow-hidden rounded-[22px] border border-[color:var(--c-hairline)]",
        "bg-[color:var(--color-bg-elev)] shadow-card transition-[transform,box-shadow] duration-500",
        "ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-card-hover",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--mx, 50%) var(--my, 0%), var(--c-accent-soft), transparent 62%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ── 01 · VisionAir conversion lift ───────────────────────────────── */
function ConversionProof({ active }: { active: boolean }) {
  const t = useTranslations("home.pain.items.speed.proof");
  const reduced = useReducedMotion();
  const after = useCountUp(CONV_AFTER, active, 1);
  const before = useCountUp(CONV_BEFORE, active, 1);

  const bar = (delay: number, accent: boolean) => (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--color-bg-alt)]">
      <motion.div
        className={cn(
          "h-full w-full origin-left rounded-full",
          accent
            ? "bg-[linear-gradient(90deg,var(--c-accent),var(--c-accent-hover))]"
            : "bg-[color:var(--color-text-3)]",
        )}
        initial={reduced ? false : { scaleX: 0 }}
        animate={active || reduced ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1, delay, ease: EASE }}
      />
    </div>
  );

  return (
    <ProofCard className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[12.5px] font-medium text-[color:var(--color-text-2)]">{t("label")}</p>
        <Link
          href={{ pathname: "/work/[slug]", params: { slug: "visionair" } }}
          className="shrink-0 text-[12.5px] font-medium text-[color:var(--c-accent-ink)] underline-offset-4 hover:underline dark:text-[color:var(--c-accent)]"
        >
          {t("link")} ↗
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-[12.5px] text-[color:var(--color-text-3)]">{t("before")}</span>
            <span className="font-mono text-[15px] tabular-nums text-[color:var(--color-text-3)]">
              {before}%
            </span>
          </div>
          <div className="mt-1.5" style={{ width: `${(CONV_BEFORE / CONV_AFTER) * 100}%` }}>
            {bar(0.1, false)}
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <span className="text-[12.5px] font-medium text-[color:var(--color-text)]">
              {t("after")}
            </span>
            <span className="font-mono text-[28px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
              {after}%
            </span>
          </div>
          <div className="mt-2">{bar(0.32, true)}</div>
        </div>
      </div>

      <p className="mt-5 text-[13px] leading-[1.5] text-[color:var(--color-text-3)]">
        {t("caption")}
      </p>
    </ProofCard>
  );
}

/* ── 02 · LegalWin assistant answering ────────────────────────────── */
function ChatProof({ active }: { active: boolean }) {
  const t = useTranslations("home.pain.items.owner.proof");
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setStep(3);
      return;
    }
    const timers = [
      setTimeout(() => setStep(1), 250),
      setTimeout(() => setStep(2), 1150),
      setTimeout(() => setStep(3), 2050),
    ];
    return () => timers.forEach(clearTimeout);
  }, [active, reduced]);

  const bubble = (visible: boolean, mine: boolean, text: string) => (
    <motion.div
      className={cn("flex", mine ? "justify-end" : "justify-start")}
      initial={reduced ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
      animate={
        visible
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 12, filter: "blur(4px)" }
      }
      transition={{ duration: 0.5, ease: EASE }}
    >
      <span
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-[1.45]",
          mine
            ? "rounded-br-md bg-[color:var(--color-bg-alt)] text-[color:var(--color-text)]"
            : "rounded-bl-md bg-[color:var(--c-accent)] text-white",
        )}
      >
        {text}
      </span>
    </motion.div>
  );

  return (
    <ProofCard className="p-5 sm:p-6">
      <p className="text-[12.5px] font-medium text-[color:var(--color-text-2)]">{t("label")}</p>

      <div className="mt-4 space-y-2.5">
        {bubble(step >= 1, true, t("ask"))}
        {bubble(step >= 2, false, t("reply"))}
      </div>

      <motion.div
        className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] px-3.5 py-2.5"
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={step >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <span className="flex items-center gap-2 text-[13px] font-medium text-[color:var(--color-text)]">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3 8.4l3.1 3.1L13 4.6"
              stroke="var(--c-accent)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t("delivered")}
        </span>
        <span className="font-mono text-[13px] tabular-nums text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
          {t("speed")}
        </span>
      </motion.div>

      <p className="mt-5 text-[13px] leading-[1.5] text-[color:var(--color-text-3)]">
        {t("caption")}
      </p>
    </ProofCard>
  );
}

/* ── 03 · What is already running in production ───────────────────── */
function LiveSitesProof({ active }: { active: boolean }) {
  const t = useTranslations("home.pain.items.seo.proof");
  const reduced = useReducedMotion();
  const count = useCountUp(LIVE_COUNT, active, 0, 900);

  return (
    <ProofCard className="p-5 sm:p-6">
      <p className="text-[12.5px] font-medium text-[color:var(--color-text-2)]">{t("label")}</p>

      <ul className="mt-4 grid gap-1 sm:grid-cols-2">
        {LIVE_SITES.map((s, i) => (
          <motion.li
            key={s.domain}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={active || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: 0.08 * i, ease: EASE }}
          >
            <Link
              href={{ pathname: "/work/[slug]", params: { slug: s.slug } }}
              className="group/site flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 font-mono text-[13px] text-[color:var(--color-text-2)] transition-colors hover:bg-[color:var(--c-accent-soft)] hover:text-[color:var(--c-accent-ink)] dark:hover:text-[color:var(--c-accent)]"
            >
              {s.domain}
              <span
                aria-hidden
                className="opacity-0 transition-[transform,opacity] duration-300 group-hover/site:translate-x-0.5 group-hover/site:opacity-100"
              >
                ↗
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>

      <div className="mt-5 flex items-baseline gap-3 border-t border-[color:var(--c-hairline)] pt-4">
        <span className="font-mono text-[32px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
          {count}
        </span>
        <span className="text-[13.5px] text-[color:var(--color-text-2)]">{t("count")}</span>
      </div>

      <p className="mt-4 text-[13px] leading-[1.5] text-[color:var(--color-text-3)]">
        {t("caption")}
      </p>
    </ProofCard>
  );
}

const ITEMS = [
  { key: "speed", Proof: ConversionProof },
  { key: "owner", Proof: ChatProof },
  { key: "seo", Proof: LiveSitesProof },
] as const;

function Claim({
  index,
  itemKey,
  Proof,
  onActive,
  isActive,
}: {
  index: number;
  itemKey: string;
  Proof: (p: { active: boolean }) => React.ReactElement;
  onActive: (i: number) => void;
  isActive: boolean;
}) {
  const t = useTranslations(`home.pain.items.${itemKey}`);
  const ref = useRef<HTMLLIElement | null>(null);
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const seen = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li
      ref={ref}
      id={`pain-${itemKey}`}
      className={cn(
        "relative scroll-mt-28 pl-6 sm:pl-8",
        index > 0 && "mt-14 border-t border-[color:var(--c-hairline)] pt-14 md:mt-16 md:pt-16",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute bottom-0 left-0 w-px rounded-full transition-[background-color,opacity] duration-500",
          index > 0 ? "top-14 md:top-16" : "top-0",
        )}
        style={{
          backgroundColor: isActive ? "var(--c-accent)" : "var(--c-hairline)",
          opacity: isActive ? 1 : 0.7,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <span
          className={cn(
            "font-mono text-[13px] tracking-[0.06em] transition-colors duration-500",
            isActive
              ? "text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]"
              : "text-[color:var(--color-text-3)]",
          )}
        >
          0{index + 1}
        </span>

        <h3 className="mt-3 t-h4 text-balance">{t("title")}</h3>
        <p className="mt-3 max-w-[560px] text-[15.5px] leading-[1.6] text-[color:var(--color-text-2)]">
          {t("body")}
        </p>

        <div className="mt-6 max-w-[560px]">
          <Proof active={seen} />
        </div>
      </motion.div>
    </li>
  );
}

export function PainPoints() {
  const t = useTranslations("home.pain");
  const [active, setActive] = useState(0);
  const onActive = useCallback((i: number) => setActive(i), []);

  return (
    <Section tone="default" pad="loose">
      <Container>
        <div className="grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:gap-20">
          <div className="md:sticky md:top-28 md:self-start">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h2 className="mt-4 t-h2 max-w-[440px] text-balance">{t("headline")}</h2>
            <p className="mt-5 max-w-[400px] text-[15.5px] leading-[1.6] text-[color:var(--color-text-2)]">
              {t("lead")}
            </p>

            <ul className="mt-8 hidden md:block">
              {ITEMS.map((it, i) => (
                <li key={it.key}>
                  <a
                    href={`#pain-${it.key}`}
                    className="group flex items-center gap-3 py-2"
                    aria-current={active === i ? "true" : undefined}
                  >
                    <span className="relative h-6 w-px shrink-0 bg-[color:var(--c-hairline)]">
                      {active === i && (
                        <motion.span
                          layoutId="pain-marker"
                          className="absolute inset-0 rounded-full bg-[color:var(--c-accent)]"
                          transition={{ duration: 0.4, ease: EASE }}
                        />
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-[13.5px] transition-colors duration-300",
                        active === i
                          ? "font-medium text-[color:var(--color-text)]"
                          : "text-[color:var(--color-text-3)] group-hover:text-[color:var(--color-text-2)]",
                      )}
                    >
                      {t(`items.${it.key}.tab`)}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <Button href="/contact" size="md" className="mt-8">
              {t("cta")}
            </Button>
          </div>

          <ul>
            {ITEMS.map((it, i) => (
              <Claim
                key={it.key}
                index={i}
                itemKey={it.key}
                Proof={it.Proof}
                onActive={onActive}
                isActive={active === i}
              />
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

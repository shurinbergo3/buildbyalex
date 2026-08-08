"use client";

import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { BorderBeam } from "@/components/BorderBeam";
import { AnimatedNumber } from "@/components/CountUp";
import type { ServiceHref } from "@/components/serviceGlyphs";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  from: string;
  price: string;
  body: string;
  examples: string;
  badge?: string;
  href: ServiceHref;
  moreLabel: string;
  featured?: boolean;
  children?: React.ReactNode;
  className?: string;
  priceDelay?: number;
};

export function PricingCard({
  title,
  from,
  price,
  body,
  examples,
  badge,
  href,
  moreLabel,
  featured = false,
  children,
  className,
  priceDelay = 0,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const raf = useRef(0);

  // Cursor light. Written to CSS vars outside React so hovering a card never
  // triggers a render; the gradient itself is gated to fine pointers in CSS.
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || raf.current) return;
    const { clientX, clientY } = e;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - r.left}px`);
      el.style.setProperty("--my", `${clientY - r.top}px`);
    });
  };

  const inner = (
    <>
      {badge && (
        <span className="mb-4 inline-flex w-fit items-center rounded-full bg-[color:var(--c-accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
          {badge}
        </span>
      )}
      <h3
        className={cn(
          "text-[15px] font-semibold",
          featured ? "text-white/70" : "text-[color:var(--color-text-2)]",
        )}
      >
        {title}
      </h3>

      <div className="mt-3 flex items-baseline gap-2">
        <span
          className={cn(
            "text-[12px] uppercase tracking-[0.04em]",
            featured ? "text-white/50" : "text-[color:var(--color-text-3)]",
          )}
        >
          {from}
        </span>
        <AnimatedNumber
          text={price}
          delay={priceDelay}
          className={cn(
            "font-semibold tracking-[-0.03em]",
            featured
              ? "text-[clamp(44px,4.2vw,64px)] text-white"
              : "text-[clamp(30px,2.4vw,38px)] text-[color:var(--color-text)]",
          )}
        />
      </div>

      <p
        className={cn(
          "mt-4 leading-[1.55]",
          featured ? "text-[16.5px] text-white/80" : "text-[15px] text-[color:var(--color-text-2)]",
        )}
      >
        {body}
      </p>

      {featured ? (
        <ul className="mt-7 flex flex-col gap-2.5">
          {examples.split("·").map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[15px] text-white/75">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-[3px] shrink-0">
                <path
                  d="M3 8.4l3.1 3.1L13 4.6"
                  stroke="var(--c-accent)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item.trim()}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-[12.5px] tracking-[0.02em] text-[color:var(--color-text-3)]">
          {examples}
        </p>
      )}

      <div className="mt-auto pt-7">
        {children ?? (
          <span className="inline-flex items-center gap-1.5 text-[14.5px] font-medium tracking-[-0.011em] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
            {moreLabel}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              aria-hidden="true"
              className="transition-transform duration-200 ease-[var(--ease-apple)] group-hover:translate-x-1"
            >
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </span>
        )}
      </div>
    </>
  );

  const shell = cn(
    "pricing-card group relative flex h-full flex-col overflow-hidden rounded-[28px] p-7 md:p-8",
    "transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-apple)]",
    featured
      ? "bg-[#0A0A0A] text-white shadow-[var(--shadow-card)]"
      : "border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]",
    className,
  );

  if (featured) {
    return (
      <div ref={ref as React.Ref<HTMLDivElement>} onMouseMove={onMove} className={shell} data-tone="ink">
        <BorderBeam duration={9} size={200} />
        {inner}
      </div>
    );
  }

  return (
    <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} onMouseMove={onMove} className={shell}>
      {inner}
    </Link>
  );
}

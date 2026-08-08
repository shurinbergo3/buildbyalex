"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* Numbers that arrive instead of just appearing. The value is written straight
   to the DOM node from a spring, so the count never re-renders React while it
   runs — a price grid with six of these still costs nothing per frame. */

type Props = {
  value: number;
  /** Everything before the digits: "€", "+", "×". */
  prefix?: string;
  /** Everything after: "k", "%", "/mo". */
  suffix?: string;
  decimals?: number;
  /** Thousands separator. Prices in the pricing grid use a narrow space. */
  separator?: string;
  /** Decimal mark, kept as authored: "5,0" in ru/pl, "5.0" in en. */
  decimalSep?: string;
  delay?: number;
  className?: string;
};

function format(n: number, decimals: number, separator: string, decimalSep: string) {
  const fixed = n.toFixed(decimals);
  const [int, frac] = fixed.split(".");
  const grouped = separator ? int.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : int;
  return frac ? `${grouped}${decimalSep}${frac}` : grouped;
}

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  separator = " ",
  decimalSep = ",",
  delay = 0,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "0px" });

  const mv = useMotionValue(0);

  // The final number is what renders — so crawlers and a JS-less visitor read
  // the real price, and hydration matches. The zero is written imperatively
  // right after mount, before the element has ever been on screen.
  useEffect(() => {
    if (reduced || inView || !ref.current) return;
    ref.current.textContent = format(0, decimals, separator, decimalSep);
  }, [reduced, inView, decimals, separator, decimalSep]);

  // Duration-based, not a spring: a spring only approaches its target, and a
  // price frozen at €496 instead of €500 is worse than no animation at all.
  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(mv, value, {
      duration: 1.1,
      delay: delay / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = format(latest, decimals, separator, decimalSep);
      },
      onComplete: () => {
        if (ref.current) ref.current.textContent = format(value, decimals, separator, decimalSep);
      },
    });
    return () => controls.stop();
  }, [inView, reduced, mv, value, delay, decimals, separator, decimalSep]);

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      <span ref={ref}>{format(value, decimals, separator, decimalSep)}</span>
      {suffix}
    </span>
  );
}

/** Splits "€3 000" / "5.0" / "+180%" into parts CountUp can animate. */
export function AnimatedNumber({
  text,
  delay,
  className,
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const match = text.match(/^(\D*?)(\d+(?:[\s  .,]\d+)*)(.*)$/);
  if (!match) return <span className={className}>{text}</span>;

  const [, prefix, rawNumber, suffix] = match;
  const cleaned = rawNumber.replace(/[\s  ]/g, "").replace(",", ".");
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return <span className={className}>{text}</span>;

  const decimals = cleaned.includes(".") ? cleaned.split(".")[1].length : 0;
  const separator = /[\s  ]/.test(rawNumber) ? " " : "";
  const decimalSep = rawNumber.includes(",") ? "," : ".";

  return (
    <CountUp
      value={value}
      prefix={prefix}
      suffix={suffix}
      decimals={decimals}
      separator={separator}
      decimalSep={decimalSep}
      delay={delay}
      className={className}
    />
  );
}

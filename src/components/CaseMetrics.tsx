"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";

export type CaseMetric = { value: string; label: string };

type Token =
  | { type: "num"; value: number; decimals: number }
  | { type: "str"; value: string };

function parseTokens(s: string): Token[] {
  const tokens: Token[] = [];
  const re = /\d+(?:\.\d+)?/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) tokens.push({ type: "str", value: s.slice(last, m.index) });
    const decimals = m[0].includes(".") ? m[0].split(".")[1].length : 0;
    tokens.push({ type: "num", value: parseFloat(m[0]), decimals });
    last = m.index + m[0].length;
  }
  if (last < s.length) tokens.push({ type: "str", value: s.slice(last) });
  return tokens;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function Counter({ value, started }: { value: string; started: boolean }) {
  const tokens = useMemo(() => parseTokens(value), [value]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!started) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setProgress(1);
      return;
    }
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setProgress(easeOutCubic(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started]);

  const rendered = tokens
    .map((tk) =>
      tk.type === "str" ? tk.value : (tk.value * progress).toFixed(tk.decimals),
    )
    .join("");

  return <span>{rendered}</span>;
}

export function CaseMetrics({ metrics }: { metrics: CaseMetric[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setStarted(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setStarted(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Section pad="default">
      <Container size="md">
        <div
          ref={ref}
          className="relative overflow-hidden rounded-[36px] bg-[#0A0A0A] px-8 py-16 text-white md:px-14 md:py-20"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,107,26,0.18), transparent 70%)",
            }}
          />
          <div className="relative z-10 grid gap-12 sm:grid-cols-3 sm:gap-8 md:gap-10">
            {metrics.map((m, i) => (
              <div key={i} className="text-center sm:text-left">
                <div className="text-[clamp(56px,8vw+12px,112px)] font-semibold leading-[0.95] tracking-[-0.04em] tabular-nums">
                  <Counter value={m.value} started={started} />
                </div>
                <div className="mt-4 text-[12.5px] uppercase tracking-[0.14em] text-white/55">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

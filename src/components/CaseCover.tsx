"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type CoverMetric = { value: string; label: string };

/* ── Animated counter — counts numeric tokens up on first view ── */
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

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

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
    const duration = 1500;
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
    .map((tk) => (tk.type === "str" ? tk.value : (tk.value * progress).toFixed(tk.decimals)))
    .join("");

  return <span>{rendered}</span>;
}

export function CaseCover({
  url,
  liveLabel,
  metrics,
  stack,
}: {
  url: string;
  liveLabel: string;
  metrics: CoverMetric[];
  stack: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
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

  const domain = url.replace(/^https?:\/\//, "");
  const isLink = /\./.test(url) && !/\s/.test(url);
  const chromeLabel = isLink ? domain : url;

  return (
    <div ref={ref} className="case-cover">
      <div className="case-cover-aurora" aria-hidden="true" />
      <div className="case-cover-grid" aria-hidden="true" />
      <div className="case-cover-edge" aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col">
        {/* Faux browser / app chrome */}
        <div className="case-cover-chrome">
          <span className="flex items-center gap-1.5" aria-hidden="true">
            <span className="case-cover-dot" style={{ background: "#FF5F57" }} />
            <span className="case-cover-dot" style={{ background: "#FEBC2E" }} />
            <span className="case-cover-dot" style={{ background: "#28C840" }} />
          </span>

          <span className="case-cover-url">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M7 11V7a5 5 0 0110 0v4M6 11h12v9H6v-9z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {chromeLabel}
          </span>

          <span className="case-cover-live">
            <span className="case-cover-live-dot" aria-hidden="true" />
            {liveLabel}
          </span>
        </div>

        {/* Metric key-art — the numbers are the cover */}
        <div className="case-cover-metrics">
          {metrics.map((m, i) => (
            <div key={i} className="case-cover-metric">
              <div className="case-cover-num">
                <Counter value={m.value} started={started} />
              </div>
              <div className="case-cover-num-label">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Stack chips */}
        {stack.length > 0 && (
          <ul className="case-cover-stack">
            {stack.slice(0, 5).map((tech) => (
              <li key={tech} className="case-cover-chip">
                {tech}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

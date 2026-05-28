"use client";

import { useEffect, useRef, useState } from "react";

type Step = { n: string; title: string; body: string };

const CYCLE_MS = 3200;

export function HowItWorksSteps({ items }: { items: Step[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setInView(e.isIntersecting);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % items.length),
      CYCLE_MS,
    );
    return () => window.clearInterval(id);
  }, [inView, paused, items.length]);

  return (
    <ol
      ref={rootRef}
      className="how-steps mt-14 grid gap-x-6 gap-y-10 md:mt-20 md:grid-cols-4"
      onMouseLeave={() => setPaused(false)}
    >
      {items.map((s, i) => {
        const state = i === active ? "active" : i < active ? "past" : "future";
        return (
          <li
            key={s.n}
            data-state={state}
            className="how-step"
            onMouseEnter={() => {
              setPaused(true);
              setActive(i);
            }}
          >
            <div className="how-step__head">
              <span className="how-step__n">{s.n}</span>
              <span className="how-step__rail" aria-hidden>
                <span
                  key={`${state}-${i}-${active}`}
                  className="how-step__fill"
                  style={
                    state === "active"
                      ? { animationDuration: `${CYCLE_MS}ms` }
                      : undefined
                  }
                />
              </span>
              <span className="how-step__dot" aria-hidden />
            </div>
            <h3 className="how-step__title t-h4">{s.title}</h3>
            <p className="how-step__body">{s.body}</p>
          </li>
        );
      })}
    </ol>
  );
}

"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

/* A grid of cards lit by the cursor. Every card gets the pointer position in
   its own coordinates, so the light also catches the rims of its neighbours.
   The first time the grid comes into view the cards rise in one by one. */
export function SpotlightGrid({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.armed = "";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.shown = "";
        io.disconnect();
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      for (const card of Array.from(ref.current?.children ?? []) as HTMLElement[]) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${clientX - r.left}px`);
        card.style.setProperty("--my", `${clientY - r.top}px`);
      }
    });
  };

  return (
    <div ref={ref} className={className} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}

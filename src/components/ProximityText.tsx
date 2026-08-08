"use client";

import { useEffect, useRef } from "react";

/* Letters thicken as the cursor approaches. Geist is a variable font, so this
   is one axis interpolated per glyph — no swapping of font files, no reflow.

   Everything is written straight to style in a rAF loop: React never re-renders
   while the mouse moves, and the whole effect costs one animation frame. */

const RADIUS = 230; // px — where the pull starts
const BASE = 560; // resting weight
const PEAK = 900; // weight under the cursor

export function ProximityText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const hostRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const letters = Array.from(host.querySelectorAll<HTMLElement>("[data-letter]"));
    const centres = letters.map(() => ({ x: 0, y: 0 }));
    const weights = letters.map(() => BASE);

    const measure = () => {
      letters.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        centres[i] = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };
    measure();

    let mouse = { x: -9999, y: -9999 };
    let raf = 0;
    let idle = 0;
    let lastY = window.scrollY;

    const onMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
      idle = 0;
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      // Lenis drives the page, so a plain scroll listener can lag behind the
      // real position — re-measure whenever the offset actually changed.
      if (window.scrollY !== lastY) {
        lastY = window.scrollY;
        measure();
      }
      let moved = false;

      for (let i = 0; i < letters.length; i++) {
        const d = Math.hypot(mouse.x - centres[i].x, mouse.y - centres[i].y);
        const pull = Math.max(0, 1 - d / RADIUS);
        const target = BASE + (PEAK - BASE) * (pull * (2 - pull));
        const next = weights[i] + (target - weights[i]) * 0.22;

        if (Math.abs(next - weights[i]) > 0.4) {
          weights[i] = next;
          const lift = ((next - BASE) / (PEAK - BASE)) * 3;
          letters[i].style.fontVariationSettings = `"wght" ${Math.round(next)}`;
          letters[i].style.transform = `translateY(${-lift.toFixed(2)}px)`;
          moved = true;
        }
      }

      // nothing changing and no cursor input for a while — stop burning frames
      if (!moved && ++idle > 120) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousemove", wake, { passive: true });
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", measure);
    wake();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <span ref={hostRef} className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          data-letter
          aria-hidden="true"
          style={{ display: "inline-block", fontVariationSettings: `"wght" ${BASE}` }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/* ────────────────────────────────────────────────────────────────────────
   Lenis smooth-scroll. Adds the "oily" inertia that makes the scroll-driven
   scenes feel cinematic. Uses real scroll position, so position:sticky and
   Framer Motion's useScroll keep working. Disabled under reduced-motion and
   left as native on touch (smooth touch feels wrong on phones).
   ──────────────────────────────────────────────────────────────────────── */

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}

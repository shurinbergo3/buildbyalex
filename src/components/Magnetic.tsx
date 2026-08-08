"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/* Pull toward the cursor. Fine pointers only — on touch there is nothing to
   attract and the transform would just eat a tap. Motion values are written
   outside the render cycle, so following the mouse costs no React work. */

export function Magnetic({
  children,
  strength = 0.28,
  radius = 90,
  className,
}: {
  children: React.ReactNode;
  /** How far the element follows, as a share of the cursor offset. */
  strength?: number;
  /** Pixels beyond the element's box where the pull starts. */
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 22, mass: 0.4 });

  if (reduced) return <span className={className}>{children}</span>;

  const onMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const reach = Math.max(r.width, r.height) / 2 + radius;
    const falloff = Math.max(0, 1 - Math.hypot(dx, dy) / reach);
    x.set(dx * strength * falloff);
    y.set(dy * strength * falloff);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={className ?? "inline-flex"}
    >
      {children}
    </motion.span>
  );
}

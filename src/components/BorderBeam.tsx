"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* A light travelling along the card's own border. Sits in the padding box, so
   it inherits the parent's radius and never affects layout or hit testing. */

export function BorderBeam({
  duration = 8,
  delay = 0,
  size = 180,
  width = 1.5,
  className,
}: {
  duration?: number;
  delay?: number;
  size?: number;
  width?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      style={{
        border: `${width}px solid transparent`,
        mask: "linear-gradient(transparent, transparent), linear-gradient(#000, #000)",
        WebkitMask: "linear-gradient(transparent, transparent), linear-gradient(#000, #000)",
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
        maskClip: "padding-box, border-box",
        WebkitMaskClip: "padding-box, border-box",
      }}
    >
      <motion.div
        className={cn(
          "absolute aspect-square bg-[linear-gradient(to_left,var(--c-accent),color-mix(in_srgb,var(--c-accent)_35%,transparent),transparent)]",
          className,
        )}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
        }}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{ repeat: Infinity, ease: "linear", duration, delay }}
      />
    </div>
  );
}

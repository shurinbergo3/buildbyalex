"use client";

import { motion, useScroll, useSpring } from "motion/react";

/* How much of a long read is left. Sits right under the header, one hairline
   tall — enough to sense progress, not enough to notice it. */

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-[var(--header-h)] z-40 h-[2px] origin-left bg-[color:var(--c-accent)]"
    />
  );
}

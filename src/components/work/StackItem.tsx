"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/* One card in the sticky stack. The card pins under the header, the next one
   rides up over it, and the one underneath shrinks and dims a step — so the
   pile reads as depth instead of as cards that simply overlap.

   Only from lg up: on narrow screens the cards stay a plain list, because a
   stack on a phone is just a scroll trap. */

export function StackItem({
  index,
  total,
  children,
}: {
  index: number;
  total: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 12%", "end 30%"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const brightness = useTransform(scrollYProgress, [0, 1], [1, 0.72]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  return (
    <div
      ref={ref}
      className="stack-item"
      style={{ ["--i" as string]: index, zIndex: index + 1 }}
    >
      <motion.div
        style={reduce ? undefined : { scale, filter, transformOrigin: "center top" }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
      {/* last card gets no tail, so the section ends flush */}
      {index < total - 1 && <div aria-hidden="true" className="stack-gap" />}
    </div>
  );
}

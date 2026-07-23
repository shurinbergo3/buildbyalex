"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/* Baltic Dockyard (baltic-dockyard.pl) case hero — the real dark maritime site
   shown inside a browser window, with the mobile layout floating over the
   lower-right corner. Both frames render actual screenshots of the shipped
   PL/EN site. */

const ACCENT = "#33C4E8";

export function BalticDockyardHeroMock() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[620px] pb-[14%] pt-[2%]">
      {/* cyan bloom tying the dark device into the stage */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-12%] top-[-4%] -z-10 h-[86%]"
        style={{ background: "radial-gradient(56% 52% at 58% 40%, rgba(51,196,232,0.20), transparent 72%)" }}
      />
      {/* floor shadow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[6%] bottom-[7%] -z-10 h-[14%] rounded-[50%]"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.5), transparent 72%)", filter: "blur(12px)" }}
      />

      {/* Browser window */}
      <div className="w-[90%]">
        <div className="relative overflow-hidden rounded-[14px] border border-white/[0.08] bg-[#0b0f14] shadow-[0_44px_78px_-32px_rgba(0,0,0,0.72),0_0_0_1px_rgba(0,0,0,0.3)]">
          {/* chrome bar */}
          <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#101620] px-4 py-2.5">
            <span className="flex gap-1.5">
              <span className="h-[10px] w-[10px] rounded-full bg-[#ff5f57]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#febc2e]" />
              <span className="h-[10px] w-[10px] rounded-full bg-[#28c840]" />
            </span>
            <span className="mx-auto flex items-center gap-1.5 rounded-md bg-white/[0.05] px-3 py-1 text-[12px] text-white/55">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              baltic-dockyard.pl
            </span>
            <span className="w-8" />
          </div>

          <div className="relative aspect-[1760/1051] overflow-hidden">
            <Image
              src="/cases/baltic-hero.webp"
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 768px) 92vw, 560px"
              className="object-cover object-top"
              priority
            />
          </div>
        </div>
      </div>

      {/* Floating phone */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 right-0 z-20 w-[30%] min-w-[132px] max-w-[186px]"
        initial={false}
        animate={reduce ? undefined : { y: [0, -9, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative rounded-[15%/7.2%] border-[5px] border-[#141a22] bg-[#141a22] shadow-[0_34px_56px_-22px_rgba(0,0,0,0.7),0_0_0_1px_rgba(0,0,0,0.32)]">
          <div className="relative aspect-[900/1948] overflow-hidden rounded-[12%/5.8%] bg-black">
            <Image src="/cases/baltic-mobile.webp" alt="" aria-hidden="true" fill sizes="180px" className="object-cover object-top" />
            {/* dynamic island */}
            <span className="absolute left-1/2 top-[3%] h-[3%] w-[26%] -translate-x-1/2 rounded-full bg-black" />
          </div>
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-6 -z-10"
          style={{ background: `radial-gradient(ellipse at center, ${ACCENT}22, transparent 62%)`, filter: "blur(18px)" }}
        />
      </motion.div>
    </div>
  );
}

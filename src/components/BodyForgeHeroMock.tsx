"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/* Body Forge case hero — a large iPhone running a real screen-recording of the
   live app (the "Статистика" tab: activity rings, Apple Health sync, recovery
   metrics). The device floats on a lime-glow stage that ties the dark phone
   into the warm page. The frame's Dynamic Island sits on top of the footage to
   mask the recording indicator; the recording's own status bar (time/battery)
   is genuine, so we keep it. Falls back to a static poster when the visitor
   prefers reduced motion. */

const ACCENT = "#C8FF00";
const VIDEO_SRC = "/cases/bodyforge-app.mp4";
const POSTER_SRC = "/cases/bodyforge-app-poster.jpg";

export function BodyForgeHeroMock() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto flex w-full max-w-[420px] justify-center py-[6%]">
      {/* lime bloom tying the dark device into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[-18%] top-[2%] -z-10 h-[88%]"
        style={{ background: "radial-gradient(56% 52% at 50% 40%, rgba(200,255,0,0.30), transparent 72%)" }}
      />
      {/* soft floor shadow grounding the phone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[14%] bottom-[3%] -z-10 h-[12%] rounded-[50%]"
        style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(10,12,8,0.4), transparent 72%)", filter: "blur(12px)" }}
      />

      <motion.div
        initial={false}
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full max-w-[330px]"
      >
        <div className="relative aspect-[315/640] w-full rounded-[16%/7.8%] bg-[#0a0a0a] p-[2.8%] shadow-[0_44px_90px_-28px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_0_0_2px_rgba(0,0,0,1)]">
          {/* side button highlights */}
          <span aria-hidden className="absolute -left-[2px] top-[18%] h-[10%] w-[3px] rounded-r-full bg-white/[0.06]" />
          <span aria-hidden className="absolute -right-[2px] top-[24%] h-[15%] w-[3px] rounded-l-full bg-white/[0.06]" />

          <div className="relative h-full w-full overflow-hidden rounded-[13%/6.4%] bg-black">
            {reduce ? (
              <Image
                src={POSTER_SRC}
                alt="Body Forge — экран статистики с кольцами активности и синхронизацией Apple Health"
                fill
                sizes="330px"
                className="object-cover"
              />
            ) : (
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={POSTER_SRC}
                aria-label="Запись экрана приложения Body Forge"
                className="h-full w-full object-cover"
              >
                <source src={VIDEO_SRC} type="video/mp4" />
              </video>
            )}

            {/* Dynamic Island — masks the recording indicator centred at the top */}
            <span
              aria-hidden
              className="absolute left-1/2 top-[1.8%] z-20 h-[3.6%] w-[29%] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/[0.05]"
            />

            {/* home indicator */}
            <div className="pointer-events-none absolute inset-x-0 bottom-[1%] z-20 flex justify-center">
              <div className="h-[3px] w-[34%] rounded-full bg-white/45" />
            </div>

            {/* subtle screen sheen */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10"
              style={{ background: "linear-gradient(122deg, rgba(255,255,255,0.07) 0%, transparent 22%, transparent 100%)" }}
            />
          </div>
        </div>

        {/* live-app pill anchored to the device */}
        <div className="pointer-events-none absolute -right-[6%] top-[14%] z-30 hidden sm:block">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium tracking-[0.04em] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] backdrop-blur"
            style={{ borderColor: "rgba(200,255,0,0.4)", background: "rgba(12,14,8,0.82)", color: ACCENT }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }} />
            App Store · iOS 17+
          </span>
        </div>
      </motion.div>
    </div>
  );
}

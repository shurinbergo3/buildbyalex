"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { SERVICE_KEYS, serviceGlyph, serviceHref } from "./serviceGlyphs";
import { offerGlyph, offerHref } from "./offerGlyphs";
import { OFFER_KEYS } from "@/lib/offers";

/* Desktop "Услуги" mega-dropdown. Opens on hover (mouse) and on click/Enter
   (keyboard + touch); closes on Escape — returning focus to the trigger —
   click-outside, route change, or item select. Motion is gated by
   prefers-reduced-motion. */
export function NavServices() {
  const t = useTranslations("nav");
  const tm = useTranslations("nav.servicesMenu");
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = pathname === "/services" || pathname?.startsWith("/services/");

  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  // Close when navigating to a new route.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div ref={wrapRef} className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="nav-services-menu"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 text-[14px] font-medium tracking-[-0.011em] text-[color:var(--color-text-2)] transition-colors hover:text-[color:var(--color-text)]",
          (active || open) && "text-[color:var(--color-text)]",
        )}
      >
        {t("services")}
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          aria-hidden="true"
          className={cn("mt-px transition-transform duration-200", open && "rotate-180")}
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-services-menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "top left" }}
            className="absolute left-0 top-[calc(100%+14px)] z-50 w-[clamp(360px,38vw,500px)] rounded-[22px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] p-2.5 shadow-[var(--shadow-card-hover)]"
          >
            <div className="grid grid-cols-2 gap-1">
              {SERVICE_KEYS.map((key) => (
                <Link
                  key={key}
                  href={serviceHref[key]}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-[color:var(--color-bg-alt)]"
                >
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[color:var(--c-accent-soft)] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                    <span className="h-5 w-5">{serviceGlyph[key]}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold tracking-[-0.011em] text-[color:var(--color-text)]">
                      {tm(`${key}.title`)}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] leading-[1.4] text-[color:var(--color-text-3)]">
                      {tm(`${key}.tagline`)}
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            {/* Fixed-price offers — separated because they're bought, not scoped. */}
            <div className="mt-1.5 border-t border-[color:var(--c-hairline)] pt-2.5">
              <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--color-text-3)]">
                {tm("offersLabel")}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {OFFER_KEYS.map((key) => (
                  <Link
                    key={key}
                    href={offerHref[key]}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-[color:var(--color-bg-alt)]"
                  >
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[color:var(--c-accent-soft)] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                      <span className="h-5 w-5">{offerGlyph[key]}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-semibold tracking-[-0.011em] text-[color:var(--color-text)]">
                        {tm(`${key}.title`)}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] leading-[1.4] text-[color:var(--color-text-3)]">
                        {tm(`${key}.tagline`)}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-1.5 border-t border-[color:var(--c-hairline)] pt-1.5">
              <Link
                href="/services"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-3 py-2.5 text-[13.5px] font-medium text-[color:var(--c-accent-ink)] transition-colors hover:bg-[color:var(--color-bg-alt)] dark:text-[color:var(--c-accent)]"
              >
                {tm("label")}
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

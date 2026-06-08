"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

/* Persistent "Поговорим" button pinned to the bottom of the viewport on mobile.
   The desktop header keeps its CTA visible while scrolling; on phones the header
   slips away, so this gives a reader a one-tap path to contact from anywhere.
   It fades in once the hero is behind the user and hides itself on the contact
   page (the form is already there) so it never covers its own destination. */
export function MobileStickyCTA() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 560);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Don't shadow the contact form's own CTA.
  if (pathname === "/contact") return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[140%] bg-gradient-to-t from-[color:var(--color-bg)] via-[color:var(--color-bg)]/80 to-transparent"
      />
      <Link
        href="/contact"
        className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[color:var(--c-accent)] px-6 text-[16px] font-medium tracking-[-0.014em] text-white shadow-[0_10px_30px_-8px_rgba(255,122,45,0.55)] transition-[background,transform] duration-200 active:translate-y-[1px]"
      >
        {t("letsTalk")}
        <svg width="15" height="15" viewBox="0 0 14 14" aria-hidden="true">
          <path
            d="M5 3l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </Link>
    </div>
  );
}

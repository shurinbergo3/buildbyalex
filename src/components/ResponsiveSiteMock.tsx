"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

/* Websites service demo. A real client site (visionair.biz.pl) shown live
   inside a desktop browser chrome, with an overlapping phone running the same
   page in its mobile layout. The desktop frame is interactive; the phone is a
   decorative preview. Both are iframes of the language version matching the
   current locale. Chrome copy (url, langs) comes from
   services.websites.demo.site. */

// Logical viewport each iframe renders at, before it's scaled to fit.
const DESKTOP_W = 1440;
const DESKTOP_H = 900;
const PHONE_W = 390;
const PHONE_H = 844;
const PHONE_RENDER_W = 132; // on-screen width of the phone

// Live site shown in the mock, per locale (ua → the site's Ukrainian version).
const SITE_BASE = "https://visionair.biz.pl";
const SITE_PATH: Record<string, string> = { ru: "", pl: "/pl/", en: "/en/", ua: "/uk/" };

export function ResponsiveSiteMock() {
  const t = useTranslations("services.websites.demo.site");
  const locale = useLocale();
  const reduce = useReducedMotion();

  const url = t("url");
  const langs = t("langs");
  const href = SITE_BASE + (SITE_PATH[locale] ?? "");

  // Scale the desktop iframe to whatever width the browser chrome ends up at.
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(940 / DESKTOP_W); // max-width fallback, avoids a jump
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / DESKTOP_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const phoneScale = PHONE_RENDER_W / PHONE_W;

  return (
    <div className="relative mx-auto w-full max-w-[940px] pb-10 sm:pb-0">
      {/* Desktop browser */}
      <div className="overflow-hidden rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] shadow-[0_30px_80px_-28px_rgba(10,10,10,0.5)]">
        {/* Chrome */}
        <div className="flex items-center gap-3 border-b border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="mx-auto flex max-w-[360px] flex-1 items-center gap-2 rounded-full bg-[color:var(--color-bg-elev)] px-3 py-1 text-[12px] text-[color:var(--color-text-3)]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 1 1 6 0v3H9z" fill="currentColor" />
            </svg>
            <span className="truncate">{url}</span>
          </div>
          <span className="hidden rounded-full border border-[color:var(--c-hairline)] px-2 py-0.5 text-[10.5px] font-medium tabular-nums text-[color:var(--color-text-3)] sm:inline">
            {langs}
          </span>
        </div>

        {/* Live homepage — interactive, scaled to the chrome width */}
        <div
          ref={frameRef}
          className="relative w-full overflow-hidden bg-[#0A0A0A]"
          style={{ height: DESKTOP_H * scale }}
        >
          <iframe
            src={href}
            title={url}
            loading="lazy"
            className="origin-top-left border-0"
            style={{ width: DESKTOP_W, height: DESKTOP_H, transform: `scale(${scale})` }}
          />
        </div>
      </div>

      {/* Overlapping phone — same homepage, mobile layout (decorative) */}
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-2 right-1 hidden sm:block md:right-4"
        style={{ width: PHONE_RENDER_W }}
        initial={false}
        animate={reduce ? undefined : { y: [0, -9, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="overflow-hidden rounded-[22px] border border-black/10 bg-[#0A0A0A] p-1.5 shadow-[0_24px_50px_-18px_rgba(10,10,10,0.6)]">
          <div
            className="relative overflow-hidden rounded-[16px] bg-[#0A0A0A]"
            style={{ height: PHONE_H * phoneScale }}
          >
            <iframe
              src={href}
              title={url}
              loading="lazy"
              tabIndex={-1}
              className="pointer-events-none origin-top-left border-0"
              style={{ width: PHONE_W, height: PHONE_H, transform: `scale(${phoneScale})` }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

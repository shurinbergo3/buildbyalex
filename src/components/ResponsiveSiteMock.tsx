"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

/* Websites service demo. A branded marketing site shown in a desktop browser
   with an overlapping phone — "one site, flawless on every device, in four
   languages". All copy comes from services.websites.demo.site. */

type SiteCopy = {
  brand: string;
  url: string;
  nav: string[];
  heroTitle: string;
  heroSub: string;
  cta: string;
  langs: string;
  badge: string;
  desktopLabel: string;
  mobileLabel: string;
};

export function ResponsiveSiteMock() {
  const t = useTranslations("services.websites.demo.site");
  const reduce = useReducedMotion();
  const site = {
    brand: t("brand"),
    url: t("url"),
    nav: t.raw("nav") as string[],
    heroTitle: t("heroTitle"),
    heroSub: t("heroSub"),
    cta: t("cta"),
    langs: t("langs"),
    badge: t("badge"),
    desktopLabel: t("desktopLabel"),
    mobileLabel: t("mobileLabel"),
  } satisfies SiteCopy;

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
            <span className="truncate">{site.url}</span>
          </div>
          <span className="hidden rounded-full border border-[color:var(--c-hairline)] px-2 py-0.5 text-[10.5px] font-medium tabular-nums text-[color:var(--color-text-3)] sm:inline">
            {site.langs}
          </span>
        </div>

        {/* Faux site — dark brand hero */}
        <div className="bg-[#0A0A0A] text-white">
          <FauxSiteNav brand={site.brand} nav={site.nav} cta={site.cta} />
          <div className="relative overflow-hidden px-6 pb-9 pt-4 md:px-9 md:pb-12 md:pt-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-1/4 right-0 h-[140%] w-[70%]"
              style={{ background: "radial-gradient(ellipse 55% 45% at 80% 10%, rgba(255,107,26,0.22), transparent 70%)" }}
            />
            <div className="relative grid items-center gap-7 md:grid-cols-[1.05fr_0.95fr]">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-medium tracking-[0.02em] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]" />
                  {site.badge}
                </span>
                <h3 className="mt-4 text-[clamp(24px,3.4vw,38px)] font-semibold leading-[1.05] tracking-[-0.028em]">
                  {site.heroTitle}
                </h3>
                <p className="mt-3 max-w-[330px] text-[14px] leading-[1.5] text-white/65">{site.heroSub}</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="rounded-full bg-[color:var(--c-accent)] px-4 py-2 text-[13px] font-medium text-white">
                    {site.cta}
                  </span>
                  <span className="h-9 w-9 rounded-full border border-white/15" />
                </div>
              </div>
              <div className="relative hidden md:block">
                <div className="aspect-[4/3] rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent p-4">
                  <div className="h-2 w-16 rounded-full bg-white/15" />
                  <div className="mt-3 h-2 w-24 rounded-full bg-white/10" />
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="rounded-lg border border-white/10 bg-white/[0.04] p-2">
                        <div className="h-5 w-5 rounded-md bg-[color:var(--c-accent)]/30" />
                        <div className="mt-2 h-1.5 w-full rounded-full bg-white/12" />
                        <div className="mt-1 h-1.5 w-2/3 rounded-full bg-white/8" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlapping phone — same site, mobile layout */}
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-2 right-1 hidden w-[132px] sm:block md:right-4"
        initial={false}
        animate={reduce ? undefined : { y: [0, -9, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="overflow-hidden rounded-[22px] border border-black/10 bg-[#0A0A0A] p-1.5 shadow-[0_24px_50px_-18px_rgba(10,10,10,0.6)]">
          <div className="overflow-hidden rounded-[16px] bg-[#0A0A0A] text-white">
            <div className="flex items-center justify-between px-3 py-2.5">
              <span className="text-[10px] font-semibold tracking-[-0.01em]">{site.brand}</span>
              <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M2 5h12 M2 11h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <div className="relative px-3 pb-4">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 70% 40% at 70% 0%, rgba(255,107,26,0.22), transparent 70%)" }}
              />
              <div className="relative">
                <div className="mt-1 h-2 w-10 rounded-full bg-white/15" />
                <div className="mt-2.5 text-[12px] font-semibold leading-[1.15] tracking-[-0.01em]">{site.heroTitle}</div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/10" />
                <div className="mt-1 h-1.5 w-3/4 rounded-full bg-white/8" />
                <div className="mt-3 inline-block rounded-full bg-[color:var(--c-accent)] px-2.5 py-1 text-[9px] font-medium">
                  {site.cta}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FauxSiteNav({ brand, nav, cta }: { brand: string; nav: string[]; cta: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-3.5 md:px-9">
      <span className="flex items-center gap-1.5 text-[14px] font-semibold tracking-[-0.01em]">
        <span className="h-2 w-2 rounded-full bg-[color:var(--c-accent)]" />
        {brand}
      </span>
      <nav className="hidden items-center gap-5 text-[12.5px] text-white/55 md:flex">
        {nav.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </nav>
      <span className="rounded-full border border-white/15 px-3 py-1 text-[12px] text-white/80">{cta}</span>
    </div>
  );
}

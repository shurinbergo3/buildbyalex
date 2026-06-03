"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "./Button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import { SERVICE_KEYS, serviceGlyph, serviceHref } from "./serviceGlyphs";

const topItems = [
  { href: "/work", key: "work" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

export function MobileMenu() {
  const t = useTranslations("nav");
  const tm = useTranslations("nav.servicesMenu");
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Collapse the services sub-list whenever the whole menu closes.
  useEffect(() => {
    if (!open) setServicesOpen(false);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? t("closeMenu") : t("openMenu")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--c-hairline)] text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-bg-alt)]"
      >
        {open ? (
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M2 2 12 12 M12 2 2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M2 5h12 M2 11h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          </svg>
        )}
      </button>

      {/*
        Portal the overlay to <body>. The header is `position: fixed` with a
        `backdrop-filter` when scrolled, which establishes a containing block for
        fixed descendants — that clamped this `inset-0` overlay to the header's
        height and let the page show through. Rendering at the body root fixes it.
      */}
      {mounted && open && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex flex-col bg-[color:var(--color-bg)]"
        >
          <div className="flex h-[var(--header-h)] items-center justify-between px-5">
            <Link href="/" onClick={close} aria-label="buildbyalex — home">
              <Logo size={20} />
            </Link>
            <button
              type="button"
              aria-label={t("closeMenu")}
              onClick={close}
              className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--c-hairline)] hover:bg-[color:var(--color-bg-alt)]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M2 2 12 12 M12 2 2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-between overflow-y-auto px-6 pb-10 pt-4">
            <ul className="space-y-0.5">
              {/* Работы */}
              <li>
                <Link
                  href="/work"
                  onClick={close}
                  className="block py-2.5 text-[clamp(26px,6.5vw,38px)] font-semibold tracking-[-0.024em] text-[color:var(--color-text)] transition-opacity hover:opacity-70"
                >
                  {t("work")}
                </Link>
              </li>

              {/* Услуги — expandable */}
              <li>
                <button
                  type="button"
                  aria-expanded={servicesOpen}
                  aria-controls="m-services"
                  onClick={() => setServicesOpen((v) => !v)}
                  className="flex w-full items-center justify-between py-2.5 text-left text-[clamp(26px,6.5vw,38px)] font-semibold tracking-[-0.024em] text-[color:var(--color-text)] transition-opacity hover:opacity-70"
                >
                  {t("services")}
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={`shrink-0 text-[color:var(--color-text-3)] transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  id="m-services"
                  data-open={servicesOpen}
                  className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[open=true]:grid-rows-[1fr]"
                >
                  <ul className="overflow-hidden">
                    {SERVICE_KEYS.map((key) => (
                      <li key={key}>
                        <Link
                          href={serviceHref[key]}
                          onClick={close}
                          className="flex items-center gap-3.5 py-2.5 pl-1 transition-opacity hover:opacity-70"
                        >
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[color:var(--c-accent-soft)] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                            <span className="h-5 w-5">{serviceGlyph[key]}</span>
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[17px] font-semibold tracking-[-0.011em] text-[color:var(--color-text)]">
                              {tm(`${key}.title`)}
                            </span>
                            <span className="mt-0.5 block text-[12.5px] leading-[1.35] text-[color:var(--color-text-3)]">
                              {tm(`${key}.tagline`)}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              {/* Блог + Контакты */}
              {topItems
                .filter((i) => i.key !== "work")
                .map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className="block py-2.5 text-[clamp(26px,6.5vw,38px)] font-semibold tracking-[-0.024em] text-[color:var(--color-text)] transition-opacity hover:opacity-70"
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
            </ul>

            <div className="mt-10 flex flex-col gap-5">
              <Button href="/contact" onClick={close} size="lg" className="w-full">
                {t("letsTalk")}
              </Button>
              <div className="flex items-center justify-between">
                <LocaleSwitcher />
                <a
                  href="mailto:alex@buildbyalex.com"
                  className="text-[14px] text-[color:var(--color-text-2)] underline-offset-4 hover:underline"
                >
                  alex@buildbyalex.com
                </a>
              </div>
            </div>
          </nav>
        </div>,
        document.body,
      )}
    </>
  );
}

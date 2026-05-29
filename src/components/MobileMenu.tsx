"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "./Button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";

const items = [
  { href: "/work", key: "work" },
  { href: "/services", key: "services" },
  { href: "/about", key: "about" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

export function MobileMenu() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col bg-[color:var(--color-bg)]"
        >
          <div className="flex h-[var(--header-h)] items-center justify-between px-5">
            <Link href="/" onClick={() => setOpen(false)} aria-label="buildbyalex — home">
              <Logo size={20} />
            </Link>
            <button
              type="button"
              aria-label={t("closeMenu")}
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--c-hairline)] hover:bg-[color:var(--color-bg-alt)]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M2 2 12 12 M12 2 2 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-between px-6 pb-10 pt-6">
            <ul className="space-y-1">
              {items.map((item, i) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-[clamp(28px,7vw,40px)] font-semibold tracking-[-0.024em] text-[color:var(--color-text)] transition-opacity hover:opacity-70"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-5">
              <Button
                href="/contact"
                onClick={() => setOpen(false)}
                size="lg"
                className="w-full"
              >
                {t("letsTalk")}
              </Button>
              <div className="flex justify-between items-center">
                <LocaleSwitcher />
                <a
                  href="mailto:shurinbergo@gmail.com"
                  className="text-[14px] text-[color:var(--color-text-2)] underline-offset-4 hover:underline"
                >
                  shurinbergo@gmail.com
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

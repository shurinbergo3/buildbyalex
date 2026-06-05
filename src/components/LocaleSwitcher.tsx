"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const labels: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
  pl: "PL",
  ua: "UA",
};

const longLabels: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
  pl: "Polski",
  ua: "Українська",
};

type Placement = "bottom-end" | "top-start";

export function LocaleSwitcher({
  minimal = false,
  placement = "bottom-end",
}: {
  minimal?: boolean;
  placement?: Placement;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  function pick(next: Locale) {
    setOpen(false);
    // pathname may include dynamic segments; pair with current params
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace({ pathname, params } as any, { locale: next });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t("switchLanguage")}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full border border-[color:var(--c-hairline)] px-3 text-[13px] font-medium tracking-[-0.011em] text-[color:var(--color-text)] transition-colors duration-200 hover:bg-[color:var(--color-bg-alt)]",
          minimal && "border-transparent",
        )}
      >
        {labels[locale]}
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className={cn(
            "absolute z-50 min-w-[160px] overflow-hidden rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] py-1.5 shadow-[var(--shadow-card)]",
            placement === "bottom-end" && "right-0 mt-2",
            placement === "top-start" && "bottom-full left-0 mb-2",
          )}
        >
          {routing.locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                onClick={() => pick(l)}
                role="option"
                aria-selected={l === locale}
                className={cn(
                  "flex w-full items-center justify-between px-3.5 py-2 text-[14px] tracking-[-0.011em] transition-colors hover:bg-[color:var(--color-bg-alt)]",
                  l === locale && "text-[color:var(--c-accent)]",
                )}
              >
                <span>{longLabels[l]}</span>
                <span className="text-[12px] opacity-60">{labels[l]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const t = useTranslations("nav");
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      aria-label={t("toggleTheme")}
      onClick={toggle}
      className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--c-hairline)] text-[color:var(--color-text)] transition-colors duration-200 hover:bg-[color:var(--color-bg-alt)]"
    >
      <span className="sr-only">{t("toggleTheme")}</span>
      {isDark ? (
        // sun
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
        </svg>
      ) : (
        // moon
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}

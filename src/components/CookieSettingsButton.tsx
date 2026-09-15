"use client";

import { openConsentSettings } from "@/lib/consent";

export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={openConsentSettings}
      className="underline-offset-4 transition-colors hover:text-[color:var(--color-text)] hover:underline"
    >
      {label}
    </button>
  );
}

"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";
import {
  OPEN_EVENT,
  clearTrackingCookies,
  readConsent,
  saveConsent,
  useConsent,
  type Consent,
} from "@/lib/consent";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

export function CookieBanner() {
  const t = useTranslations("consent");
  const privacy = useTranslations("privacy");
  const consent = useConsent();
  const titleId = useId();
  const [reopened, setReopened] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [draft, setDraft] = useState<Consent>({ analytics: false, marketing: false });

  useEffect(() => {
    function onOpen() {
      setDraft(readConsent() ?? { analytics: false, marketing: false });
      setCustomizing(true);
      setReopened(true);
    }
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, []);

  // Anything a beacon managed to leave behind after a withdrawal goes on the next visit.
  // Metrica cookies from before it was removed go for everyone.
  useEffect(() => {
    if (consent && !consent.analytics) clearTrackingCookies();
    else clearTrackingCookies(/^_ym/);
  }, [consent]);

  if (consent === undefined || (consent !== null && !reopened)) return null;

  function decide(next: Consent) {
    setReopened(false);
    setCustomizing(false);
    saveConsent(next);
  }

  return (
    <div
      role="dialog"
      aria-labelledby={titleId}
      className="fixed inset-x-4 bottom-[calc(16px+env(safe-area-inset-bottom))] z-50 md:inset-x-auto md:bottom-6 md:left-6 md:w-[420px]"
    >
      <div className="consent-in rounded-[22px] border border-[color:var(--glass-border)] bg-[rgba(14,14,16,0.86)] p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl md:p-6">
        <h2 id={titleId} className="text-[16px] font-medium tracking-[-0.014em] text-[color:var(--color-text)]">
          {t("title")}
        </h2>
        <p className="mt-2 text-[14px] leading-[1.5] text-[color:var(--color-text-2)]">
          {t("text")}{" "}
          <Link href="/privacy" className="text-[color:var(--color-text)] underline underline-offset-4">
            {privacy("link")}
          </Link>
        </p>

        {customizing && (
          <ul className="mt-4 divide-y divide-[color:var(--c-hairline)] border-y border-[color:var(--c-hairline)]">
            <Category title={t("necessary.title")} description={t("necessary.description")}>
              <span className="text-[12px] text-[color:var(--color-text-3)]">{t("necessary.always")}</span>
            </Category>
            <Category title={t("analytics.title")} description={t("analytics.description")}>
              <Switch
                label={t("analytics.title")}
                checked={draft.analytics}
                onChange={(analytics) => setDraft((d) => ({ ...d, analytics }))}
              />
            </Category>
            <Category title={t("marketing.title")} description={t("marketing.description")}>
              <Switch
                label={t("marketing.title")}
                checked={draft.marketing}
                onChange={(marketing) => setDraft((d) => ({ ...d, marketing }))}
              />
            </Category>
          </ul>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => decide({ analytics: true, marketing: true })}
            className="h-11 grow whitespace-nowrap rounded-full bg-[color:var(--c-accent)] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[color:var(--c-accent-hover)]"
          >
            {t("acceptAll")}
          </button>
          {customizing ? (
            <button
              type="button"
              onClick={() => decide(draft)}
              className="h-11 grow whitespace-nowrap rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-fill)] px-5 text-[14px] font-medium text-[color:var(--color-text)] transition-colors hover:bg-white/10"
            >
              {t("save")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => decide({ analytics: false, marketing: false })}
              className="h-11 grow whitespace-nowrap rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-fill)] px-5 text-[14px] font-medium text-[color:var(--color-text)] transition-colors hover:bg-white/10"
            >
              {t("reject")}
            </button>
          )}
        </div>

        {!customizing && (
          <button
            type="button"
            onClick={() => setCustomizing(true)}
            className="mt-3 w-full text-center text-[13px] text-[color:var(--color-text-2)] underline-offset-4 transition-colors hover:text-[color:var(--color-text)] hover:underline"
          >
            {t("customize")}
          </button>
        )}
      </div>
    </div>
  );
}

function Category({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className="text-[14px] font-medium text-[color:var(--color-text)]">{title}</p>
        <p className="mt-0.5 text-[12.5px] leading-[1.45] text-[color:var(--color-text-3)]">{description}</p>
      </div>
      <div className="shrink-0 pt-0.5">{children}</div>
    </li>
  );
}

function Switch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-10 rounded-full transition-colors",
        checked ? "bg-[color:var(--c-accent)]" : "bg-white/15",
      )}
    >
      <span
        className={cn(
          "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-4",
        )}
      />
    </button>
  );
}

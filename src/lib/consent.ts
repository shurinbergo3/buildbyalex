import { useEffect, useState } from "react";

export type Consent = { analytics: boolean; marketing: boolean };

const KEY = "bba-consent";
// Bump when the list of tools changes: everyone gets asked again.
const VERSION = 1;
// Regulators expect the question to come back, not live forever.
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

const CHANGE_EVENT = "bba:consent-change";
export const OPEN_EVENT = "bba:consent-open";

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.v !== VERSION) return null;
    if (Date.now() - Date.parse(data.at) > MAX_AGE_MS) return null;
    return { analytics: data.analytics === true, marketing: data.marketing === true };
  } catch {
    return null;
  }
}

export function saveConsent(next: Consent) {
  const prev = readConsent();
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: VERSION, ...next, at: new Date().toISOString() }));
  } catch {
    /* private mode: the choice holds for this page view only */
  }

  // GA and Metrica can't be unloaded once running, so a withdrawal wipes
  // their cookies and reloads into a clean page. GA is told first, otherwise
  // its pagehide beacon writes _ga right back.
  const revoked = prev && ((prev.analytics && !next.analytics) || (prev.marketing && !next.marketing));
  if (revoked) {
    window.gtag?.("consent", "update", {
      analytics_storage: next.analytics ? "granted" : "denied",
      ad_storage: next.marketing ? "granted" : "denied",
      ad_user_data: next.marketing ? "granted" : "denied",
      ad_personalization: next.marketing ? "granted" : "denied",
    });
    clearTrackingCookies();
    window.location.reload();
    return;
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function openConsentSettings() {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT));
}

export function clearTrackingCookies() {
  const host = window.location.hostname;
  const apex = host.split(".").slice(-2).join(".");
  const domains = ["", host, `.${host}`, `.${apex}`];
  for (const pair of document.cookie.split(";")) {
    const name = pair.split("=")[0].trim();
    if (!/^(_ga|_gid|_gat|_gcl|_ym)/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

/** undefined until mounted, null when the visitor hasn't chosen yet. */
export function useConsent() {
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);

  useEffect(() => {
    const sync = () => setConsent(readConsent());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return consent;
}

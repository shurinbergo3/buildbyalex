/**
 * Goal tracking for Yandex.Metrika.
 *
 * The counter is loaded by <YandexMetrika /> with `afterInteractive`, so `ym`
 * may not exist yet when a fast visitor submits — every call is guarded and
 * silently no-ops instead of throwing inside a submit handler.
 */

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void;
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Single source of truth — <YandexMetrika /> initialises this same counter. */
export const YM_ID = 109616933;

/**
 * GA4 measurement ID, e.g. "G-XXXXXXXXXX". Empty until it's set in the
 * environment, and every GA call below no-ops while it is — so the site runs
 * unchanged with or without it. Set NEXT_PUBLIC_GA_ID at build time (it has to
 * be inlined into the client bundle, hence the NEXT_PUBLIC_ prefix).
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export type Goal = "quote_submit" | "lead_submit" | "review_submit" | "contact_click";

/**
 * One call, both counters. Metrica gets a goal, GA4 gets an event of the same
 * name — so a conversion is countable in whichever tool is actually being read.
 */
export function trackGoal(goal: Goal, params?: Record<string, string>) {
  if (typeof window === "undefined") return;
  try {
    window.ym?.(YM_ID, "reachGoal", goal, params);
  } catch {
    /* analytics must never break a form submit */
  }
  try {
    if (GA_ID) window.gtag?.("event", goal, params ?? {});
  } catch {
    /* same */
  }
}

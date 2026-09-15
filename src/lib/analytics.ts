/**
 * Goal tracking for GA4.
 *
 * gtag is loaded by <GoogleAnalytics /> only after analytics consent, so it
 * may not exist when a visitor submits. Every call is guarded and silently
 * no-ops instead of throwing inside a submit handler.
 */

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/**
 * GA4 measurement ID. It's public anyway (it ends up in every page), so it lives
 * here; NEXT_PUBLIC_GA_ID at build time overrides it, and setting it to an
 * empty string turns GA off.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-NN2D4W59JH";

export type Goal = "quote_submit" | "lead_submit" | "review_submit" | "contact_click";

export function trackGoal(goal: Goal, params?: Record<string, string>) {
  if (typeof window === "undefined" || !GA_ID) return;
  try {
    window.gtag?.("event", goal, params ?? {});
  } catch {
    /* analytics must never break a form submit */
  }
}

import type { ReactNode } from "react";

/* Single source of truth for the four service icons + their routes.
   Shared by the home ServicesOverview, the desktop nav mega-dropdown and the
   mobile menu accordion so the iconography never drifts between surfaces. */

export type ServiceKey = "websites" | "ai" | "mobile" | "ads";

export type ServiceHref =
  | "/services/websites"
  | "/services/ai-agents"
  | "/services/mobile-apps"
  | "/services/advertising";

export const SERVICE_KEYS: ServiceKey[] = ["websites", "ai", "mobile", "ads"];

export const serviceHref: Record<ServiceKey, ServiceHref> = {
  websites: "/services/websites",
  ai: "/services/ai-agents",
  mobile: "/services/mobile-apps",
  ads: "/services/advertising",
};

export const serviceGlyph: Record<ServiceKey, ReactNode> = {
  websites: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full" aria-hidden="true">
      <rect x="6" y="9" width="36" height="26" rx="4" stroke="currentColor" strokeWidth="2.2" />
      <path d="M6 16h36" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="11" cy="12.5" r="1" fill="currentColor" />
      <circle cx="15" cy="12.5" r="1" fill="currentColor" />
      <path d="M13 23h16M13 28h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full" aria-hidden="true">
      <rect x="12" y="14" width="24" height="20" rx="6" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="19" cy="24" r="2" fill="currentColor" />
      <circle cx="29" cy="24" r="2" fill="currentColor" />
      <path d="M24 8v6M18 34v4M30 34v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="24" cy="7" r="2" fill="currentColor" />
    </svg>
  ),
  mobile: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full" aria-hidden="true">
      <rect x="15" y="6" width="18" height="36" rx="4" stroke="currentColor" strokeWidth="2.2" />
      <path d="M21 9h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="24" cy="37" r="1.4" fill="currentColor" />
    </svg>
  ),
  ads: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full" aria-hidden="true">
      <path d="M8 30V18l22-8v28l-22-8Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M30 16c4 1.5 4 14.5 0 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
};

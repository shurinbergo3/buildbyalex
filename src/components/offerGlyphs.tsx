import type { ReactNode } from "react";
import { OFFER_PATH, type OfferKey, type OfferPath } from "@/lib/offers";

/* Icons for the four fixed-price offers, matching the service glyph line-work
   (48-box, 2.2 stroke) so the menu reads as one set. Each drawing names the
   deliverable, not the topic: a marked-up report, a document changing hands, a
   stamped clause, a search answer with the brand missing from it. */

export const offerHref: Record<OfferKey, OfferPath> = OFFER_PATH;

export const offerGlyph: Record<OfferKey, ReactNode> = {
  aiAudit: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full" aria-hidden="true">
      <path d="M12 6h16l8 8v28a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M28 6v8h8" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M16 24h9M16 30h13M16 36h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="33" cy="30" r="6.5" stroke="currentColor" strokeWidth="2.2" />
      <path d="M37.8 34.8 42 39" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  documents: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full" aria-hidden="true">
      <rect x="6" y="8" width="20" height="26" rx="3" stroke="currentColor" strokeWidth="2.2" />
      <path d="M11 15h10M11 21h10M11 27h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M30 21h10m0 0-4-4m4 4-4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="30" y="30" width="14" height="12" rx="3" stroke="currentColor" strokeWidth="2.2" />
      <path d="M34 36h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  aiAct: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full" aria-hidden="true">
      <path d="M24 5 39 11v13c0 9-6.4 16.2-15 19-8.6-2.8-15-10-15-19V11l15-6Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M17 23.5l5 5 9.5-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  aiVisibility: (
    <svg viewBox="0 0 48 48" fill="none" className="h-full w-full" aria-hidden="true">
      <rect x="6" y="9" width="36" height="30" rx="4" stroke="currentColor" strokeWidth="2.2" />
      <path d="M12 18h13M12 24h20M12 30h9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="33.5" cy="30.5" r="5.5" stroke="currentColor" strokeWidth="2.2" />
      <path d="M31 30.5h5M33.5 28v5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
};

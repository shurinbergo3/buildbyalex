/**
 * Fixed-price products, as opposed to the seven open-ended services.
 *
 * A service page answers "what can you build for me"; these answer "what do I
 * get for this exact amount by this exact date". They share the visual language
 * of the service pages but run on a shorter template (OfferPageTemplate) —
 * scope, deliverable, price, date, form — because that is the whole decision.
 */

export type OfferKey = "aiAudit" | "documents" | "aiAct" | "aiVisibility";

export const OFFER_KEYS: OfferKey[] = ["aiAudit", "documents", "aiAct", "aiVisibility"];

export const OFFER_PATH = {
  aiAudit: "/services/ai-audit",
  documents: "/services/document-automation",
  aiAct: "/services/ai-act-compliance",
  aiVisibility: "/services/ai-visibility",
} as const;

export type OfferPath = (typeof OFFER_PATH)[OfferKey];

/** Which service page each offer graduates into once the fixed-price part ends. */
export const OFFER_NEXT_SERVICE = {
  aiAudit: "/services/ai-agents",
  documents: "/services/automation",
  aiAct: "/services/ai-agents",
  aiVisibility: "/services/websites",
} as const;

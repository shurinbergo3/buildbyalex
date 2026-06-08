export type CaseKey = "legalwin" | "visionair" | "crmbot" | "leadbot" | "bodyforge";

export const caseSlugs: CaseKey[] = ["legalwin", "visionair", "crmbot", "leadbot", "bodyforge"];

/** Discipline each case belongs to — drives the gallery filter. Non-localized. */
export type CaseCategory = "web" | "ai" | "mobile";

export const caseCategory: Record<CaseKey, CaseCategory> = {
  legalwin: "web",
  visionair: "web",
  crmbot: "ai",
  leadbot: "ai",
  bodyforge: "mobile",
};

/** Service branches (mirrors the `Branch` union in ServicePageTemplate). */
export type ServiceBranch = "websites" | "store" | "ai" | "automation" | "mobile" | "telegram" | "ads";

/**
 * Which cases to surface in the "Related work" block on each service page.
 * Order = display order (first one is the headline case). A branch with an
 * empty list renders no block at all. Keep these aligned with `caseCategory`.
 */
export const serviceToCases: Record<ServiceBranch, CaseKey[]> = {
  websites: ["legalwin", "visionair"],
  store: ["visionair", "legalwin"],
  ai: ["crmbot", "leadbot"],
  automation: ["crmbot", "leadbot"],
  mobile: ["bodyforge"],
  telegram: ["leadbot"],
  ads: [],
};

export const caseSlugToKey: Record<string, CaseKey> = {
  legalwin: "legalwin",
  visionair: "visionair",
  "crm-bot": "crmbot",
  leadbot: "leadbot",
  "body-forge": "bodyforge",
};

export const caseKeyToSlug: Record<CaseKey, string> = {
  legalwin: "legalwin",
  visionair: "visionair",
  crmbot: "crm-bot",
  leadbot: "leadbot",
  bodyforge: "body-forge",
};

// Image sources only. The localized alt text lives in messages under
// `work.cases.<key>.imageAlt` so it translates per locale (used in <img>/OG alt).
export const caseImages: Record<CaseKey, { src: string }> = {
  legalwin: { src: "/cases/legalwin-passport.webp" },
  visionair: { src: "/cases/visionair-warsaw.webp" },
  crmbot: { src: "/cases/crm-ai.webp" },
  leadbot: { src: "/cases/leadbot-chat.webp" },
  bodyforge: { src: "/cases/bodyforge-gym.webp" },
};

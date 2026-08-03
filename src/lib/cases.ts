export type CaseKey = "baltic" | "legalwin" | "visionair" | "bodyforgesite" | "crmbot" | "leadbot" | "bodyforge";

export const caseSlugs: CaseKey[] = ["legalwin", "visionair", "bodyforgesite", "crmbot", "leadbot", "bodyforge", "baltic"];

/** Discipline each case belongs to — drives the gallery filter. Non-localized. */
export type CaseCategory = "web" | "ai" | "mobile";

export const caseCategory: Record<CaseKey, CaseCategory> = {
  baltic: "web",
  legalwin: "web",
  visionair: "web",
  bodyforgesite: "web",
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
  websites: ["legalwin", "visionair", "baltic"],
  store: ["baltic"],
  ai: ["crmbot", "leadbot"],
  automation: ["crmbot", "leadbot"],
  // bodyforge itself lives in the MobileCaseProof deep dive on that page.
  mobile: ["bodyforgesite"],
  telegram: ["leadbot"],
  ads: [],
};

export const caseSlugToKey: Record<string, CaseKey> = {
  "baltic-dockyard": "baltic",
  legalwin: "legalwin",
  visionair: "visionair",
  "body-forge-site": "bodyforgesite",
  "crm-bot": "crmbot",
  leadbot: "leadbot",
  "body-forge": "bodyforge",
};

export const caseKeyToSlug: Record<CaseKey, string> = {
  baltic: "baltic-dockyard",
  legalwin: "legalwin",
  visionair: "visionair",
  bodyforgesite: "body-forge-site",
  crmbot: "crm-bot",
  leadbot: "leadbot",
  bodyforge: "body-forge",
};

// Image sources only. The localized alt text lives in messages under
// `work.cases.<key>.imageAlt` so it translates per locale (used in <img>/OG alt).
export const caseImages: Record<CaseKey, { src: string }> = {
  baltic: { src: "/cases/baltic-cover.webp" },
  legalwin: { src: "/cases/legalwin-cover.webp" },
  visionair: { src: "/cases/visionair-cover.webp" },
  bodyforgesite: { src: "/cases/bodyforgesite-cover.webp" },
  crmbot: { src: "/cases/crmbot-cover.webp" },
  leadbot: { src: "/cases/leadbot-cover.webp" },
  bodyforge: { src: "/cases/bodyforge-gym.webp" },
};

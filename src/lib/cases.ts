export type CaseKey = "legalwin" | "visionair" | "crmbot" | "donbrava" | "bodyforge";

export const caseSlugs: CaseKey[] = ["legalwin", "visionair", "crmbot", "donbrava", "bodyforge"];

/** Discipline each case belongs to — drives the gallery filter. Non-localized. */
export type CaseCategory = "web" | "ai" | "mobile";

export const caseCategory: Record<CaseKey, CaseCategory> = {
  legalwin: "web",
  visionair: "web",
  crmbot: "ai",
  donbrava: "ai",
  bodyforge: "mobile",
};

export const caseSlugToKey: Record<string, CaseKey> = {
  legalwin: "legalwin",
  visionair: "visionair",
  "crm-bot": "crmbot",
  donbrava: "donbrava",
  "body-forge": "bodyforge",
};

export const caseKeyToSlug: Record<CaseKey, string> = {
  legalwin: "legalwin",
  visionair: "visionair",
  crmbot: "crm-bot",
  donbrava: "donbrava",
  bodyforge: "body-forge",
};

// Image sources only. The localized alt text lives in messages under
// `work.cases.<key>.imageAlt` so it translates per locale (used in <img>/OG alt).
export const caseImages: Record<CaseKey, { src: string }> = {
  legalwin: { src: "/cases/legalwin-passport.webp" },
  visionair: { src: "/cases/visionair-warsaw.webp" },
  crmbot: { src: "/cases/crm-ai.webp" },
  donbrava: { src: "/cases/donbrava-chat.webp" },
  bodyforge: { src: "/cases/bodyforge-gym.webp" },
};

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

export const caseImages: Record<CaseKey, { src: string; alt: string }> = {
  legalwin: {
    src: "/cases/legalwin-passport.webp",
    alt: "Паспорт у иллюминатора самолёта на закате — иммиграционный кейс LegalWin",
  },
  visionair: {
    src: "/cases/visionair-warsaw.webp",
    alt: "Аэросъёмка центра Варшавы на закате с дрона — кейс VisionAir",
  },
  crmbot: {
    src: "/cases/crm-ai.webp",
    alt: "Синяя сеть из узлов и связей на тёмном фоне — кейс CRM Bot",
  },
  donbrava: {
    src: "/cases/donbrava-chat.webp",
    alt: "Человек переписывается в мессенджере на смартфоне — кейс ИИ-менеджер для продаж",
  },
  bodyforge: {
    src: "/cases/bodyforge-gym.webp",
    alt: "Гантель в драматичном свете тёмного зала — кейс Body Forge",
  },
};

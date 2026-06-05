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
    src: "/cases/legalwin-passport.jpg",
    alt: "Паспорта на фоне европейской площади — иммиграционный кейс LegalWin",
  },
  visionair: {
    src: "/cases/visionair-warsaw.jpg",
    alt: "Аэросъёмка центра Варшавы на закате с дрона — кейс VisionAir",
  },
  crmbot: {
    src: "/cases/crm-ai.jpg",
    alt: "Светящийся силуэт ИИ-нейросети в темноте — кейс CRM Bot",
  },
  donbrava: {
    src: "/cases/donbrava-chat.jpg",
    alt: "Переписка в мессенджере на смартфоне в полумраке — кейс ИИ-менеджер для продаж",
  },
  bodyforge: {
    src: "/cases/bodyforge-gym.jpg",
    alt: "Гантель в драматичном свете тёмного зала — кейс Body Forge",
  },
};

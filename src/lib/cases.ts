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
    src: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=1600&q=80",
    alt: "Современное офисное здание в Варшаве — кейс LegalWin",
  },
  visionair: {
    src: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=1600&q=80",
    alt: "Кинематографичная аэросъёмка побережья с дрона — кейс VisionAir",
  },
  crmbot: {
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
    alt: "Команда продаж за ноутбуками — кейс CRM Bot",
  },
  donbrava: {
    src: "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?auto=format&fit=crop&w=1600&q=80",
    alt: "Переписка с клиентом в мессенджере на смартфоне — кейс ИИ-менеджер для продаж",
  },
  bodyforge: {
    src: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80",
    alt: "Атлет со штангой в стойке для приседаний на закате — кейс Body Forge",
  },
};

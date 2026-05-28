export type CaseKey = "legalwin" | "visionair" | "crmbot";

export const caseSlugs: CaseKey[] = ["legalwin", "visionair", "crmbot"];

export const caseSlugToKey: Record<string, CaseKey> = {
  legalwin: "legalwin",
  visionair: "visionair",
  "crm-bot": "crmbot",
};

export const caseKeyToSlug: Record<CaseKey, string> = {
  legalwin: "legalwin",
  visionair: "visionair",
  crmbot: "crm-bot",
};

export const caseImages: Record<CaseKey, { src: string; alt: string }> = {
  legalwin: {
    src: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=1600&q=80",
    alt: "Современное офисное здание в Варшаве — кейс LegalWin",
  },
  visionair: {
    src: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1600&q=80",
    alt: "Аэросъёмка побережья с дрона — кейс VisionAir",
  },
  crmbot: {
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
    alt: "Команда продаж за ноутбуками — кейс CRM Bot",
  },
};

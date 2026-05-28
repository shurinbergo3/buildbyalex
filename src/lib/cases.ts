export type CaseKey = "legalwin" | "visionair" | "crmbot" | "donbrava";

export const caseSlugs: CaseKey[] = ["legalwin", "visionair", "crmbot", "donbrava"];

export const caseSlugToKey: Record<string, CaseKey> = {
  legalwin: "legalwin",
  visionair: "visionair",
  "crm-bot": "crmbot",
  donbrava: "donbrava",
};

export const caseKeyToSlug: Record<CaseKey, string> = {
  legalwin: "legalwin",
  visionair: "visionair",
  crmbot: "crm-bot",
  donbrava: "donbrava",
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
  donbrava: {
    src: "https://images.unsplash.com/photo-1601933470928-c2adde7838f8?auto=format&fit=crop&w=1600&q=80",
    alt: "Старый город Братиславы, Словакия — кейс Donbrava",
  },
};

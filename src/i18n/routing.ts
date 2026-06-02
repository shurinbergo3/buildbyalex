import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ru", "en", "pl", "ua"] as const,
  defaultLocale: "ru",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/services": {
      ru: "/uslugi",
      en: "/services",
      pl: "/uslugi",
      ua: "/poslugy",
    },
    "/services/websites": {
      ru: "/uslugi/sayty",
      en: "/services/websites",
      pl: "/uslugi/strony-internetowe",
      ua: "/poslugy/sayty",
    },
    "/services/ai-agents": {
      ru: "/uslugi/ai-agenty",
      en: "/services/ai-agents",
      pl: "/uslugi/agenci-ai",
      ua: "/poslugy/ai-agenty",
    },
    "/services/mobile-apps": {
      ru: "/uslugi/mobilnye-prilozheniya",
      en: "/services/mobile-apps",
      pl: "/uslugi/aplikacje-mobilne",
      ua: "/poslugy/mobilni-dodatky",
    },
    "/services/advertising": {
      ru: "/uslugi/reklama",
      en: "/services/advertising",
      pl: "/uslugi/reklama-google-ads",
      ua: "/poslugy/reklama",
    },
    "/work": {
      ru: "/raboty",
      en: "/work",
      pl: "/realizacje",
      ua: "/roboty",
    },
    "/work/[slug]": {
      ru: "/raboty/[slug]",
      en: "/work/[slug]",
      pl: "/realizacje/[slug]",
      ua: "/roboty/[slug]",
    },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/contact": {
      ru: "/kontakty",
      en: "/contact",
      pl: "/kontakt",
      ua: "/kontakt",
    },
    "/contact/thank-you": {
      ru: "/kontakty/spasibo",
      en: "/contact/thank-you",
      pl: "/kontakt/dziekuje",
      ua: "/kontakt/dyakuyu",
    },
  },
});

export type Locale = (typeof routing.locales)[number];

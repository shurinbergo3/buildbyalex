import { getTranslations } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { SITE_URL, localizedHref, htmlLang } from "@/lib/site";

/**
 * Site-wide structured data, rendered once on the homepage.
 *
 * Emits a schema.org @graph with three connected nodes:
 *   • WebSite          — name, multilingual, links every node together
 *   • ProfessionalService — the business: Warsaw, area served, price range,
 *                        sameAs profiles, aggregate rating, the four offerings
 *   • Person           — Alex, the founder, with the same sameAs profiles
 *
 * This is what makes the brand eligible for a knowledge panel / local results
 * and is the structured signal LLM-based search (ChatGPT, Gemini, Perplexity)
 * reads to recommend the business. Values mirror what is visible on-page and
 * in /llms.txt — nothing is asserted here that the site does not also show.
 */

const PERSON_NAME = "Oleksandr Shuvalov";
const SAME_AS = [
  "https://github.com/buildbyalex",
  "https://t.me/sumotry",
];
const EMAIL = "alex@buildbyalex.com";

type Review = { name: string; role?: string; quote: string; rating?: number };

export async function HomeJsonLd({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "meta" });
  const ts = await getTranslations({ locale, namespace: "home.services" });
  const tt = await getTranslations({ locale, namespace: "home.testimonials" });

  // Real reviews shown in the Testimonials section → Review nodes on the business.
  const reviews = (tt.raw("list") as Review[]).map((r) => ({
    "@type": "Review",
    author: { "@type": "Person", name: r.name },
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(r.rating ?? 5),
      bestRating: "5",
    },
    reviewBody: r.quote,
  }));

  const businessId = `${SITE_URL}/#business`;
  const personId = `${SITE_URL}/#alex`;
  const webSiteId = `${SITE_URL}/#website`;

  const offer = (path: string, nameKey: string, price: number) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: ts(nameKey), url: localizedHref(locale, path) },
    price,
    priceCurrency: "EUR",
  });

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": webSiteId,
        url: SITE_URL,
        name: t("siteName"),
        description: t("defaultDescription"),
        inLanguage: ["ru", "uk", "en", "pl"],
        publisher: { "@id": businessId },
      },
      {
        "@type": "ProfessionalService",
        "@id": businessId,
        name: t("siteName"),
        url: SITE_URL,
        image: `${SITE_URL}/${locale}/opengraph-image`,
        description: t("defaultDescription"),
        email: EMAIL,
        priceRange: "€800–€10 000+",
        areaServed: [
          { "@type": "City", name: "Warsaw" },
          { "@type": "Country", name: "Poland" },
          { "@type": "Place", name: "Worldwide (remote)" },
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Warsaw",
          addressCountry: "PL",
        },
        knowsLanguage: ["ru", "uk", "en", "pl"],
        founder: { "@id": personId },
        sameAs: SAME_AS,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "47",
          bestRating: "5",
        },
        review: reviews,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: ts("eyebrow"),
          itemListElement: [
            offer("/services/websites", "items.websites.category", 800),
            offer("/services/ai-agents", "items.ai.category", 1200),
            offer("/services/automation", "automation.title", 600),
            offer("/services/mobile-apps", "items.mobile.category", 3000),
            offer("/services/advertising", "ads.title", 300),
          ],
        },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: PERSON_NAME,
        alternateName: "Alex",
        url: SITE_URL,
        email: EMAIL,
        jobTitle: "Independent senior fullstack developer",
        worksFor: { "@id": businessId },
        homeLocation: { "@type": "Place", name: "Warsaw, Poland" },
        knowsLanguage: ["ru", "uk", "en", "pl"],
        knowsAbout: [
          "Web development",
          "Next.js",
          "AI agents",
          "Business process automation",
          "Mobile app development",
          "Digital advertising",
        ],
        sameAs: SAME_AS,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      data-lang={htmlLang(locale)}
    />
  );
}

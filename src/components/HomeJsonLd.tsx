import { getTranslations } from "next-intl/server";
import { type Locale } from "@/i18n/routing";
import { SITE_URL, localizedHref, localeSegment, htmlLang } from "@/lib/site";
import { isReviewLive } from "@/lib/reviews";
import { jsonLd } from "@/lib/jsonLd";

/**
 * Site-wide structured data, rendered once on the homepage.
 *
 * Emits a schema.org @graph with three connected nodes:
 *   • WebSite          — name, multilingual, links every node together
 *   • ProfessionalService — the business: area served, price range,
 *                        sameAs profiles, aggregate rating, the four offerings
 *   • Person           — Alex, the founder (first name only), with the same sameAs profiles
 *
 * This is what makes the brand eligible for a knowledge panel / local results
 * and is the structured signal LLM-based search (ChatGPT, Gemini, Perplexity)
 * reads to recommend the business. Values mirror what is visible on-page and
 * in /llms.txt — nothing is asserted here that the site does not also show.
 */

const PERSON_NAME = "Alex";
// The canonical identity set. Every one of these must resolve to a profile that
// is actually mine and links back here — `sameAs` is how Google and LLM search
// decide "these are the same entity", so a wrong or dead link merges me with
// someone else. Keep in sync with /llms.txt and the GitHub profile README.
const SAME_AS = [
  "https://github.com/shurinbergo3",
  "https://t.me/sumotry",
  "https://www.linkedin.com/in/oleksandr-shuvalov",
];
const EMAIL = "info@buildbyalex.com";

type Review = { name: string; role?: string; quote: string; rating?: number };

export async function HomeJsonLd({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "meta" });
  const ts = await getTranslations({ locale, namespace: "home.services" });
  const tt = await getTranslations({ locale, namespace: "home.testimonials" });

  // Real reviews shown in the Testimonials section → Review nodes on the business.
  // Same publishAt gate as the on-page list, so structured data never claims a
  // review the visitor can't actually see yet, and the count below always
  // matches what the Testimonials block renders.
  const now = Date.now();
  const liveReviews = (tt.raw("list") as (Review & { publishAt?: string })[]).filter((r) =>
    isReviewLive(r, now),
  );
  const reviews = liveReviews.map((r) => ({
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
        image: `${SITE_URL}${localeSegment(locale)}/opengraph-image`,
        description: t("defaultDescription"),
        email: EMAIL,
        priceRange: "€800–€10 000+",
        areaServed: { "@type": "Place", name: "Worldwide (remote)" },
        serviceType: "Remote software development",
        knowsLanguage: ["ru", "uk", "en", "pl"],
        founder: { "@id": personId },
        sameAs: SAME_AS,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: tt("rating").replace(",", "."),
          reviewCount: String(liveReviews.length),
          bestRating: "5",
        },
        review: reviews,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: ts("eyebrow"),
          itemListElement: [
            offer("/services/websites", "items.websites.category", 800),
            offer("/services/ai-agents", "items.ai.category", 500),
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
        url: SITE_URL,
        email: EMAIL,
        jobTitle: "Independent senior fullstack developer",
        worksFor: { "@id": businessId },
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
      dangerouslySetInnerHTML={{ __html: jsonLd(graph) }}
      data-lang={htmlLang(locale)}
    />
  );
}

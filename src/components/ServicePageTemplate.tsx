import type { ComponentType } from "react";
import { useTranslations, useMessages, useLocale } from "next-intl";
import { SITE_URL, localizedHref } from "@/lib/site";
import { countLiveReviews, type Review } from "@/lib/reviews";
import type { Locale } from "@/i18n/routing";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { FinalCta } from "./FinalCta";
import { ServiceHero } from "./ServiceHero";
import { FAQAccordion, type QA } from "./FAQAccordion";
import { ServicePricing, type PricingTier } from "./ServicePricing";
import { Testimonials } from "./home/Testimonials";
import { AiSyncShowcase } from "./AiSyncShowcase";
import { AdsShowcase } from "./AdsShowcase";
import { WebsiteShowcase } from "./WebsiteShowcase";
import { StoreShowcase } from "./StoreShowcase";
import { MobileAppShowcase } from "./MobileAppShowcase";
import { AutomationShowcase } from "./AutomationShowcase";
import { TelegramMiniAppShowcase } from "./TelegramMiniAppShowcase";
import { ServiceRelatedCases } from "./ServiceRelatedCases";
import { ServicePain } from "./ServicePain";
import { ServiceFormats } from "./ServiceFormats";
import { ServiceGuarantees } from "./ServiceGuarantees";
import { ServiceTimeline } from "./ServiceTimeline";
import { ServiceCompare } from "./ServiceCompare";
import { ServiceResources } from "./ServiceResources";
import { SlowVsFastRace } from "./SlowVsFastRace";
import { WebsitesCaseProof } from "./WebsitesCaseProof";
import { WebsitesLossCalc } from "./WebsitesLossCalc";
import { StoreIntegrations } from "./StoreIntegrations";
import { SectionAtmosphere } from "./SectionAtmosphere";
import { StoreAllegroCalc } from "./StoreAllegroCalc";
import { MobileCaseProof } from "./MobileCaseProof";
import { MobileCostCalc } from "./MobileCostCalc";

type Branch = "websites" | "store" | "ai" | "automation" | "mobile" | "telegram" | "ads";

type ServiceData = {
  eyebrow: string;
  headline: string;
  lead: string;
  from: string;
  primaryCta: string;
  what: { title: string; items: { title: string; body: string }[] };
  stack: { title: string; items: string[] };
  cases: string;
  faq: { title: string; items: QA[] };
  pricing?: {
    eyebrow?: string;
    tiers: PricingTier[];
    caption?: string;
    featuredLabel?: string;
    marketLabel?: string;
  };
};

type Shape = { services: Record<Branch, ServiceData> };

const PRICE_KEY: Record<Branch, "site" | "ai" | "automation" | "mobile" | "telegram" | "ads"> = {
  websites: "site",
  store: "site",
  ai: "ai",
  automation: "automation",
  mobile: "mobile",
  telegram: "telegram",
  ads: "ads",
};

const SERVICE_PATH: Record<Branch, string> = {
  websites: "/services/websites",
  store: "/services/online-store",
  ai: "/services/ai-agents",
  automation: "/services/automation",
  mobile: "/services/mobile-apps",
  telegram: "/services/telegram-bots",
  ads: "/services/advertising",
};

// Per-branch animated demo. Each showcase owns its own Section + heading copy,
// so the template just drops it in as a single node.
const DEMOS: Partial<Record<Branch, ComponentType>> = {
  websites: WebsiteShowcase,
  store: StoreShowcase,
  ai: AiSyncShowcase,
  automation: AutomationShowcase,
  mobile: MobileAppShowcase,
  telegram: TelegramMiniAppShowcase,
  ads: AdsShowcase,
};

export function ServicePageTemplate({ branch }: { branch: Branch }) {
  const t = useTranslations(`services.${branch}`);
  const tr = useTranslations("home.testimonials");
  const tp = useTranslations("home.pricing");
  const tNav = useTranslations("nav");
  const tf = useTranslations("home.finalCta");
  const tl = useTranslations("work.caseLabels");
  const locale = useLocale() as Locale;
  const messages = useMessages() as unknown as Shape;
  const data: ServiceData = messages.services[branch];
  const priceKey = PRICE_KEY[branch];
  const Demo = DEMOS[branch];
  // Every service page carries the decision-stage set (pain, formats,
  // guarantees, week-by-week process, comparison, blog links). On top of that
  // some branches have unique blocks: the loading race and before/after case
  // for websites, the integrations wall and Allegro calc for the store, the
  // Body Forge deep dive and cost configurator for mobile.
  const isWebsites = branch === "websites";
  // Ads has no fixed-price formats — its pricing tiers already carry that job.
  const hasFormats = branch !== "ads";

  // Same source of truth as the homepage — keeps this page's rating badge and
  // structured data in sync with the Testimonials block instead of a stale count.
  const reviewCount = countLiveReviews(tr.raw("list") as Review[], Date.now());

  // A service can ship a multi-tier grid via `services.<branch>.pricing.tiers`.
  // When absent, fall back to the single starting-price card built from
  // `home.pricing.tiers.<priceKey>` so every other service keeps working.
  const pricingTiers: PricingTier[] = data.pricing?.tiers?.length
    ? data.pricing.tiers
    : [
        {
          title: tp(`tiers.${priceKey}.title`),
          from: tp(`tiers.${priceKey}.from`),
          price: tp(`tiers.${priceKey}.price`),
          body: tp(`tiers.${priceKey}.body`),
          examples: tp(`tiers.${priceKey}.examples`),
        },
      ];
  const schemaPrice = Math.min(
    ...pricingTiers.map((tier) => Number(tier.price.replace(/[^\d]/g, "")) || Infinity),
  );

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("meta.title"),
    serviceType: t("eyebrow"),
    description: t("lead"),
    areaServed: { "@type": "Country", name: "Poland" },
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#business`,
      name: "buildbyalex",
      url: SITE_URL,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: tr("rating").replace(",", "."),
        reviewCount: String(reviewCount),
        bestRating: "5",
      },
    },
    url: localizedHref(locale, SERVICE_PATH[branch]),
    offers: {
      "@type": "Offer",
      price: String(Number.isFinite(schemaPrice) ? schemaPrice : ""),
      priceCurrency: "EUR",
      url: localizedHref(locale, "/contact"),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("home"), item: localizedHref(locale, "/") },
      { "@type": "ListItem", position: 2, name: tNav("services"), item: localizedHref(locale, "/services") },
      { "@type": "ListItem", position: 3, name: t("eyebrow"), item: localizedHref(locale, SERVICE_PATH[branch]) },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* ── Hero (cinematic key-art stage) ── */}
      <ServiceHero branch={branch} reviewCount={reviewCount} />

      {/* ── Pain: where the money leaks without this service ── */}
      <ServicePain branch={branch}>
        {isWebsites ? <SlowVsFastRace /> : undefined}
      </ServicePain>

      {/* ── Service demo (per-branch animated showcase; each owns its section) ── */}
      {Demo && <Demo />}

      {/* ── Formats with prices and timelines ── */}
      {hasFormats && <ServiceFormats branch={branch} />}

      {/* ── Payments / delivery / back-office integrations (store only) ── */}
      {branch === "store" && <StoreIntegrations />}

      {/* ── Case deep dives: VisionAir for websites, Body Forge for mobile ── */}
      {isWebsites && <WebsitesCaseProof />}
      {branch === "mobile" && <MobileCaseProof />}

      {/* ── What's included ── */}
      <Section pad="default" tone={Demo ? "default" : "alt"} className="isolate">
        <SectionAtmosphere variant="a" />
        <Container>
          <Reveal>
            <h2 className="t-h2 mb-12 md:mb-16">{t("what.title")}</h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 md:gap-x-12 md:gap-y-12">
            {data.what.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="border-t border-[color:var(--c-hairline)] pt-6">
                  <h3 className="t-h4">{item.title}</h3>
                  <p className="mt-3 text-[15.5px] leading-[1.55] text-[color:var(--color-text-2)]">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Related work (recent case for this service; omitted when none) ── */}
      <ServiceRelatedCases branch={branch} tone={Demo ? "alt" : "default"} />

      {/* ── Contract guarantees ── */}
      <ServiceGuarantees branch={branch} />

      {/* ── Process, week by week ── */}
      <ServiceTimeline branch={branch} />

      {/* ── Pricing for this service (single card, or multi-tier grid) ── */}
      <ServicePricing
        eyebrow={data.pricing?.eyebrow ?? t("startingPrice")}
        tiers={pricingTiers}
        bookCta={t("bookCta")}
        caption={data.pricing?.caption}
        featuredLabel={data.pricing?.featuredLabel}
        marketLabel={data.pricing?.marketLabel}
      />

      {/* ── Honest alternatives table ── */}
      <ServiceCompare branch={branch} />

      {/* ── Cost of inaction / cost configurator ── */}
      {isWebsites && <WebsitesLossCalc />}
      {branch === "store" && <StoreAllegroCalc />}
      {branch === "mobile" && <MobileCostCalc />}

      {/* ── FAQ ── */}
      <Section pad="default" tone="alt" className="isolate">
        <SectionAtmosphere variant="b" />
        <Container size="md">
          <Reveal>
            <h2 className="t-h2 mb-10 md:mb-12 text-center">{t("faq.title")}</h2>
          </Reveal>
          <FAQAccordion items={data.faq.items} />
        </Container>
      </Section>

      {/* ── Blog cluster links ── */}
      <ServiceResources branch={branch} />

      {/* ── Reviews (shared block) ── */}
      <Testimonials />

      {/* ── Final CTA (shared glass-window bookend) ── */}
      <FinalCta
        theme={branch === "websites" || branch === "store" ? "web" : branch}
        eyebrow={tf("eyebrow")}
        title={tf("headline")}
        body={tf("subhead")}
        steps={tl.raw("ctaSteps") as { k: string; v: string }[]}
        available={tl("ctaAvailable")}
        primary={{ label: t("primaryCta"), href: "/contact" }}
        secondary={{ label: tf("email"), href: `mailto:${tf("email")}`, kind: "link" }}
        rating={{ value: tr("rating"), count: `${reviewCount} ${tr("count")}` }}
        note={tl("ctaNote")}
      />
    </>
  );
}

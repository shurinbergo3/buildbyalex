import { useTranslations, useMessages, useLocale } from "next-intl";
import { SITE_URL, localizedHref } from "@/lib/site";
import { countLiveReviews, type Review } from "@/lib/reviews";
import type { Locale } from "@/i18n/routing";
import { OFFER_PATH, OFFER_NEXT_SERVICE, type OfferKey } from "@/lib/offers";
import type { ContourTheme } from "./heroGlyphs";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { Eyebrow } from "./Eyebrow";
import { Button } from "./Button";
import { HeroWindow } from "./HeroWindow";
import { SectionAtmosphere } from "./SectionAtmosphere";
import { FAQAccordion, type QA } from "./FAQAccordion";
import { ServicePricing, type PricingTier } from "./ServicePricing";
import { QuoteForm } from "./QuoteForm";
import { FinalCta } from "./FinalCta";
import { Testimonials } from "./home/Testimonials";
import { OfferGlance, type GlanceData } from "./OfferGlance";
import { Link } from "@/i18n/navigation";
import { jsonLd } from "@/lib/jsonLd";

/* ════════════════════════════════════════════════════════════════════════════
   Fixed-price offer page. Shorter than ServicePageTemplate on purpose: someone
   buying a five-day audit decides on scope, deliverable, date and price, and
   every extra section between those four things costs conversions. Same window
   chrome and section rhythm as the service pages so the site still reads as one
   thing.
   ──────────────────────────────────────────────────────────────────────────── */

const AMBER = "#FF7A2D";

const THEME: Record<OfferKey, ContourTheme> = {
  aiAudit: "ai",
  documents: "automation",
  aiAct: "studio",
  aiVisibility: "ads",
};

type OfferData = {
  eyebrow: string;
  headline: string;
  lead: string;
  from: string;
  primaryCta: string;
  windowLabel: string;
  badge: string;
  metrics: { v: string; l: string }[];
  glance: GlanceData;
  pain: { eyebrow: string; headline: string; sub: string; items: { title: string; body: string }[] };
  deliverables: { eyebrow: string; headline: string; sub: string; items: { title: string; body: string }[] };
  process: { eyebrow: string; headline: string; sub: string; steps: { when: string; title: string; body: string }[] };
  pricing: { eyebrow: string; caption: string; bookCta: string; tiers: PricingTier[] };
  notFor: { title: string; sub: string; items: string[]; instead: string };
  faq: { title: string; items: QA[] };
  resources: { eyebrow: string; headline: string; items: { title: string; href: string }[] };
  schema: { serviceType: string; price: string; currency: string };
};

type Shape = { offers: Record<OfferKey, OfferData> };

export function OfferPageTemplate({ offer }: { offer: OfferKey }) {
  const t = useTranslations(`offers.${offer}`);
  const tr = useTranslations("home.testimonials");
  const tNav = useTranslations("nav");
  const tf = useTranslations("home.finalCta");
  const tl = useTranslations("work.caseLabels");
  const locale = useLocale() as Locale;
  const messages = useMessages() as unknown as Shape;
  const data = messages.offers[offer];
  const theme = THEME[offer];

  const now = Date.now();
  const reviewCount = countLiveReviews(tr.raw("list") as Review[], now);
  const headlineLines = data.headline.split("\n");

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("meta.title"),
    serviceType: data.schema.serviceType,
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
    url: localizedHref(locale, OFFER_PATH[offer]),
    offers: {
      "@type": "Offer",
      price: data.schema.price,
      priceCurrency: data.schema.currency,
      url: localizedHref(locale, "/contact"),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("home"), item: localizedHref(locale, "/") },
      { "@type": "ListItem", position: 2, name: tNav("services"), item: localizedHref(locale, "/services") },
      { "@type": "ListItem", position: 3, name: data.eyebrow, item: localizedHref(locale, OFFER_PATH[offer]) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />

      {/* ── Hero ── */}
      <Section pad="tight" tone="default" className="!pt-10 md:!pt-14">
        <Container size="default">
          <HeroWindow theme={theme} accent={AMBER} label={data.windowLabel} live={data.badge}>
            <div className="relative z-10 grid items-center gap-10 md:grid-cols-12 md:gap-10 lg:gap-14">
              <div className="min-w-0 md:col-span-6">
                <p
                  className="text-[12px] font-semibold uppercase tracking-[0.16em]"
                  style={{ color: AMBER, fontFamily: "var(--font-mono), monospace" }}
                >
                  {data.eyebrow}
                </p>
                <h1 className="mt-4 text-[clamp(32px,4.2vw+10px,56px)] font-semibold leading-[1.06] tracking-[-0.032em] text-white">
                  {headlineLines.map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </h1>
                <p className="mt-5 max-w-[480px] text-[clamp(15px,0.7vw+13px,18px)] leading-[1.55] tracking-[-0.012em] text-white/65">
                  {data.lead}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Button href="/contact" size="lg">{data.primaryCta}</Button>
                  <span className="text-[14.5px] text-white/55">{data.from}</span>
                </div>

                {/* min-w-0 on the cells: a long uppercase label would otherwise set the
                    column's min-content width and stretch the whole hero past the viewport. */}
                <div className="mt-8 grid max-w-[480px] grid-cols-3 gap-3 border-t border-white/[0.08] pt-6">
                  {data.metrics.map((m) => (
                    <div key={m.l} className="min-w-0">
                      <p
                        className="text-[clamp(20px,1.6vw+12px,26px)] font-semibold leading-none tracking-[-0.03em]"
                        style={{
                          background: "linear-gradient(165deg,#fff,#ffb487)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {m.v}
                      </p>
                      <p className="mt-1.5 break-words text-[10.5px] font-medium uppercase leading-tight tracking-[0.06em] text-white/45">
                        {m.l}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-w-0 md:col-span-6">
                <div className="relative mx-auto w-full max-w-[420px]">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-8 -z-10"
                    style={{
                      background:
                        "radial-gradient(ellipse 60% 50% at 55% 45%, rgba(255,122,45,0.22), transparent 70%)",
                      filter: "blur(30px)",
                    }}
                  />
                  <OfferGlance data={data.glance} />
                </div>
              </div>
            </div>
          </HeroWindow>
        </Container>
      </Section>

      {/* ── Why now ── */}
      <Section pad="default" tone="alt" className="isolate">
        <SectionAtmosphere variant="a" />
        <Container>
          <div className="grid gap-10 md:grid-cols-12 md:gap-14">
            <div className="md:col-span-5">
              <Reveal>
                <Eyebrow>{data.pain.eyebrow}</Eyebrow>
                <h2 className="mt-3 t-h2 max-w-[460px] text-balance">{data.pain.headline}</h2>
                <p className="mt-5 max-w-[420px] t-body-lg">{data.pain.sub}</p>
              </Reveal>
            </div>
            <div className="md:col-span-7">
              <ul className="grid gap-6 sm:grid-cols-2">
                {data.pain.items.map((item, i) => (
                  <Reveal key={item.title} delay={i * 60}>
                    <li className="border-t border-[color:var(--c-hairline)] pt-5">
                      <h3 className="t-h4">{item.title}</h3>
                      <p className="mt-2.5 text-[15px] leading-[1.55] text-[color:var(--color-text-2)]">
                        {item.body}
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── What you get ── */}
      <Section pad="default" tone="default">
        <Container>
          <Reveal>
            <Eyebrow align="center">{data.deliverables.eyebrow}</Eyebrow>
            <h2 className="mt-3 t-h2 text-center">{data.deliverables.headline}</h2>
            <p className="mx-auto mt-5 max-w-[600px] text-center t-body-lg">{data.deliverables.sub}</p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-x-12 md:gap-y-10">
            {data.deliverables.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="flex gap-4">
                  <span
                    aria-hidden
                    className="mt-1 grid h-7 w-7 flex-none place-items-center rounded-full bg-[color:var(--c-accent-soft)] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="t-h4">{item.title}</h3>
                    <p className="mt-2 text-[15.5px] leading-[1.55] text-[color:var(--color-text-2)]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Process, day by day ── */}
      <Section pad="default" tone="alt" className="isolate">
        <SectionAtmosphere variant="b" />
        <Container size="md">
          <Reveal>
            <Eyebrow align="center">{data.process.eyebrow}</Eyebrow>
            <h2 className="mt-3 t-h2 text-center">{data.process.headline}</h2>
            <p className="mx-auto mt-5 max-w-[600px] text-center t-body-lg">{data.process.sub}</p>
          </Reveal>
          <ol className="mt-12 border-t border-[color:var(--c-hairline)]">
            {data.process.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 60}>
                <li className="grid gap-2 border-b border-[color:var(--c-hairline)] py-6 md:grid-cols-[150px_1fr] md:gap-8">
                  <span className="text-[12.5px] font-semibold uppercase tracking-[0.1em] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                    {step.when}
                  </span>
                  <div>
                    <h3 className="t-h4">{step.title}</h3>
                    <p className="mt-2 text-[15.5px] leading-[1.55] text-[color:var(--color-text-2)]">
                      {step.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ── Price ── */}
      <ServicePricing
        eyebrow={data.pricing.eyebrow}
        tiers={data.pricing.tiers}
        bookCta={data.pricing.bookCta}
        caption={data.pricing.caption}
      />

      {/* ── When not to buy this ── */}
      <Section pad="tight" tone="alt">
        <Container size="sm">
          <Reveal>
            <h2 className="t-h3">{data.notFor.title}</h2>
            <p className="mt-3 t-body-lg">{data.notFor.sub}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {data.notFor.items.map((item) => (
                <li key={item} className="flex gap-3 text-[15.5px] leading-[1.55] text-[color:var(--color-text-2)]">
                  <span aria-hidden className="mt-2 h-px w-4 flex-none bg-[color:var(--c-accent)]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[15.5px] leading-[1.55] text-[color:var(--color-text-2)]">
              {data.notFor.instead}{" "}
              <Link
                href={OFFER_NEXT_SERVICE[offer]}
                className="font-medium text-[color:var(--c-accent-ink)] underline underline-offset-4 dark:text-[color:var(--c-accent)]"
              >
                {tNav("services")}
              </Link>
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ── Low-friction ask ── */}
      <QuoteForm theme={theme} branch={offer} />

      {/* ── FAQ ── */}
      <Section pad="default" tone="alt" className="isolate">
        <SectionAtmosphere variant="b" />
        <Container size="md">
          <Reveal>
            <h2 className="t-h2 mb-10 text-center md:mb-12">{data.faq.title}</h2>
          </Reveal>
          <FAQAccordion items={data.faq.items} />
        </Container>
      </Section>

      {/* ── Reading around the offer ── */}
      <Section pad="tight" tone="default">
        <Container size="md">
          <Reveal>
            <Eyebrow>{data.resources.eyebrow}</Eyebrow>
            <h2 className="mt-3 t-h3">{data.resources.headline}</h2>
          </Reveal>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--c-hairline)] sm:grid-cols-2">
            {data.resources.items.map((item) => (
              <li key={item.href} className="bg-[color:var(--color-bg)]">
                <a
                  href={item.href}
                  className="flex h-full items-center justify-between gap-3 p-5 text-[15px] font-medium tracking-[-0.011em] text-[color:var(--color-text)] transition-colors hover:bg-[color:var(--color-bg-alt)]"
                >
                  {item.title}
                  <svg width="15" height="15" viewBox="0 0 14 14" aria-hidden className="flex-none text-[color:var(--c-accent)]">
                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Testimonials now={now} />

      <FinalCta
        theme={theme}
        eyebrow={tf("eyebrow")}
        title={tf("headline")}
        body={tf("subhead")}
        steps={tl.raw("ctaSteps") as { k: string; v: string }[]}
        available={tl("ctaAvailable")}
        primary={{ label: data.primaryCta, href: "/contact" }}
        secondary={{ label: tf("email"), href: `mailto:${tf("email")}`, kind: "link" }}
        rating={{ value: tr("rating"), count: `${reviewCount} ${tr("count")}` }}
        note={tl("ctaNote")}
      />
    </>
  );
}

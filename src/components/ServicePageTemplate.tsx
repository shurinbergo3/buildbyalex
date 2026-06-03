import type { ComponentType } from "react";
import { useTranslations, useMessages, useLocale } from "next-intl";
import { SITE_URL, localizedHref } from "@/lib/site";
import type { Locale } from "@/i18n/routing";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { Button } from "./Button";
import { FAQAccordion, type QA } from "./FAQAccordion";
import { HowItWorks } from "./home/HowItWorks";
import { AiSyncShowcase } from "./AiSyncShowcase";
import { AdsShowcase } from "./AdsShowcase";
import { WebsiteShowcase } from "./WebsiteShowcase";
import { MobileAppShowcase } from "./MobileAppShowcase";
import { AutomationShowcase } from "./AutomationShowcase";

type Branch = "websites" | "ai" | "automation" | "mobile" | "ads";

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
};

type Shape = { services: Record<Branch, ServiceData> };

const PRICE_KEY: Record<Branch, "site" | "ai" | "automation" | "mobile" | "ads"> = {
  websites: "site",
  ai: "ai",
  automation: "automation",
  mobile: "mobile",
  ads: "ads",
};

const SERVICE_PATH: Record<Branch, string> = {
  websites: "/services/websites",
  ai: "/services/ai-agents",
  automation: "/services/automation",
  mobile: "/services/mobile-apps",
  ads: "/services/advertising",
};

// Per-branch animated demo. Each showcase owns its own Section + heading copy,
// so the template just drops it in as a single node.
const DEMOS: Partial<Record<Branch, ComponentType>> = {
  websites: WebsiteShowcase,
  ai: AiSyncShowcase,
  automation: AutomationShowcase,
  mobile: MobileAppShowcase,
  ads: AdsShowcase,
};

function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`} aria-label="5 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M8 1.5l1.96 4.27 4.7.55-3.5 3.2.96 4.62L8 11.9l-4.12 2.24.96-4.62-3.5-3.2 4.7-.55L8 1.5z"
            fill="var(--c-accent)"
          />
        </svg>
      ))}
    </div>
  );
}

export function ServicePageTemplate({ branch }: { branch: Branch }) {
  const t = useTranslations(`services.${branch}`);
  const tr = useTranslations("home.testimonials");
  const tp = useTranslations("home.pricing");
  const tNav = useTranslations("nav");
  const locale = useLocale() as Locale;
  const messages = useMessages() as unknown as Shape;
  const data: ServiceData = messages.services[branch];
  const headlineLines = t("headline").split("\n");
  const priceKey = PRICE_KEY[branch];
  const Demo = DEMOS[branch];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("meta.title"),
    serviceType: t("eyebrow"),
    description: t("lead"),
    areaServed: { "@type": "Country", name: "Poland" },
    provider: { "@type": "Organization", name: "buildbyalex", url: SITE_URL },
    url: localizedHref(locale, SERVICE_PATH[branch]),
    offers: {
      "@type": "Offer",
      price: tp(`tiers.${priceKey}.price`).replace(/[^\d]/g, ""),
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
      {/* ── Hero ── */}
      <Section pad="tight" tone="default" className="!pt-16 md:!pt-24">
        <Container size="default">
          <Reveal>
            <div className="grid gap-12 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-7">
                <p className="t-eyebrow">{t("eyebrow")}</p>
                <h1 className="mt-4 text-[clamp(40px,5.5vw+8px,72px)] font-semibold leading-[1.06] tracking-[-0.032em]">
                  {headlineLines.map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </h1>
                <p className="mt-6 text-[clamp(17px,1.2vw+13px,22px)] leading-[1.5] tracking-[-0.013em] text-[color:var(--color-text-2)] max-w-[560px]">
                  {t("lead")}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button href="/contact" size="lg">{t("primaryCta")}</Button>
                  <span className="text-[15px] text-[color:var(--color-text-3)]">{t("from")}</span>
                </div>

                {/* Social proof */}
                <div className="mt-8 flex items-center gap-3">
                  <Stars />
                  <span className="text-[13.5px] text-[color:var(--color-text-2)]">
                    <span className="font-semibold text-[color:var(--color-text)]">{tr("rating")}</span> · {tr("count")}
                  </span>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="rounded-[28px] bg-[color:var(--color-bg-alt)] p-7 md:p-9">
                  <h3 className="t-eyebrow">{t("stack.title")}</h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {data.stack.items.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] px-3 py-1.5 text-[12.5px] font-medium text-[color:var(--color-text-2)]"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── Service demo (per-branch animated showcase; each owns its section) ── */}
      {Demo && <Demo />}

      {/* ── What's included ── */}
      <Section pad="default" tone={Demo ? "default" : "alt"}>
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

      {/* ── Process (shared 4-step) ── */}
      <HowItWorks />

      {/* ── Pricing for this service ── */}
      <Section pad="default" tone="default">
        <Container size="sm">
          <Reveal>
            <div className="relative flex flex-col rounded-[28px] bg-[color:var(--color-bg-alt)] p-8 md:p-10">
              <p className="t-eyebrow">{t("startingPrice")}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-[13px] uppercase tracking-[0.04em] text-[color:var(--color-text-3)]">
                  {tp(`tiers.${priceKey}.from`)}
                </span>
                <span className="text-[clamp(40px,5vw,60px)] font-semibold tracking-[-0.03em] text-[color:var(--color-text)]">
                  {tp(`tiers.${priceKey}.price`)}
                </span>
              </div>
              <p className="mt-4 text-[16px] leading-[1.55] text-[color:var(--color-text-2)]">
                {tp(`tiers.${priceKey}.body`)}
              </p>
              <p className="mt-3 text-[13px] tracking-[0.02em] text-[color:var(--color-text-3)]">
                {tp(`tiers.${priceKey}.examples`)}
              </p>
              <div className="mt-8">
                <Button href="/contact" size="lg" className="w-full sm:w-auto">{t("bookCta")}</Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── FAQ ── */}
      <Section pad="default" tone="alt">
        <Container size="md">
          <Reveal>
            <h2 className="t-h2 mb-10 md:mb-12 text-center">{t("faq.title")}</h2>
          </Reveal>
          <FAQAccordion items={data.faq.items} />
        </Container>
      </Section>

      {/* ── Final CTA ── */}
      <Section pad="default" tone="default">
        <Container size="md">
          <Reveal>
            <div className="relative overflow-hidden rounded-[36px] bg-[#0A0A0A] px-8 py-14 text-center text-white md:px-12 md:py-20">
              <div
                className="pointer-events-none absolute -top-1/3 left-1/2 h-[120%] w-[120%] -translate-x-1/2 opacity-60"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(255,107,26,0.30), transparent 70%)",
                }}
              />
              <div className="relative z-10">
                <h2 className="text-[clamp(28px,3.6vw,42px)] font-semibold leading-[1.1] tracking-[-0.024em]">
                  {t("primaryCta")}
                </h2>
                <div className="mt-5 flex items-center justify-center gap-2.5">
                  <Stars />
                  <span className="text-[13.5px] text-white/70">
                    <span className="font-semibold text-white">{tr("rating")}</span> · {tr("count")}
                  </span>
                </div>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
                  <Button href="/contact" size="lg">
                    {t("primaryCta")}
                  </Button>
                  <a
                    href="mailto:alex@buildbyalex.com"
                    className="text-[14px] text-white/70 underline underline-offset-4 hover:text-white"
                  >
                    alex@buildbyalex.com
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

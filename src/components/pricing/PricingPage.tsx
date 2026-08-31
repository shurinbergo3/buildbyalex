import { useTranslations, useMessages, useLocale } from "next-intl";
import { localizedHref } from "@/lib/site";
import type { Locale } from "@/i18n/routing";
import { countLiveReviews, type Review } from "@/lib/reviews";
import { jsonLd } from "@/lib/jsonLd";
import { Container } from "../Container";
import { Section } from "../Section";
import { Reveal } from "../Reveal";
import { SectionAtmosphere } from "../SectionAtmosphere";
import { FAQAccordion, type QA } from "../FAQAccordion";
import { FinalCta } from "../FinalCta";
import { Link } from "@/i18n/navigation";
import { OFFER_KEYS, OFFER_PATH } from "@/lib/offers";

/* ════════════════════════════════════════════════════════════════════════════
   PricingPage — one page for the whole "cennik / ile kosztuje" cluster, which
   is the single most common modifier in Polish search for every service here.
   Prices are not retyped: the summary reads home.pricing.tiers and the detail
   blocks read services.<branch>.formats, so a price change anywhere lands here
   automatically and this page can never quote a number the site doesn't.
   ──────────────────────────────────────────────────────────────────────────── */

type Format = { title: string; price: string; time: string; desc: string };
type Shape = {
  services: Record<string, { formats?: { items: Format[] }; eyebrow: string }>;
  home: { pricing: { tiers: Record<string, { title: string; price: string; body: string; examples?: string }> } };
  offers: Record<string, { pricing: { tiers: { title: string; price: string; body: string }[] } }>;
};

// Which service page each summary row points at, and which message branch holds
// its formats. Order is by how often people actually ask for it.
// `as const` on purpose: <Link> only accepts pathnames declared in routing.ts,
// so widening these to `string` breaks the type check.
const ROWS = [
  { tier: "site", branch: "websites", path: "/services/websites" },
  { tier: "store", branch: "store", path: "/services/online-store" },
  { tier: "ai", branch: "ai", path: "/services/ai-agents" },
  { tier: "automation", branch: "automation", path: "/services/automation" },
  { tier: "telegram", branch: "telegram", path: "/services/telegram-bots" },
  { tier: "mobile", branch: "mobile", path: "/services/mobile-apps" },
  { tier: "ads", branch: "ads", path: "/services/advertising" },
] as const;

export function PricingPage() {
  const t = useTranslations("pricing");
  const tp = useTranslations("home.pricing");
  const tf = useTranslations("home.finalCta");
  const tl = useTranslations("work.caseLabels");
  const tr = useTranslations("home.testimonials");
  const tNav = useTranslations("nav");
  const locale = useLocale() as Locale;
  const messages = useMessages() as unknown as Shape;

  const faq = t.raw("faq.items") as QA[];
  const factors = t.raw("factors.items") as { title: string; body: string }[];
  const steps = t.raw("process.items") as { title: string; body: string }[];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((qa) => ({
      "@type": "Question",
      name: qa.q,
      acceptedAnswer: { "@type": "Answer", text: qa.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tNav("home"), item: localizedHref(locale, "/") },
      { "@type": "ListItem", position: 2, name: t("eyebrow"), item: localizedHref(locale, "/pricing") },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }} />

      {/* ── Header ── */}
      <Section pad="tight" className="!pt-16 md:!pt-24">
        <Container size="md">
          <Reveal>
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h1 className="mt-4 text-[clamp(36px,4.6vw+8px,60px)] font-semibold leading-[1.07] tracking-[-0.03em]">
              {t("headline")}
            </h1>
            <p className="mt-6 max-w-[640px] text-[clamp(17px,1.1vw+13px,20px)] leading-[1.5] tracking-[-0.012em] text-[color:var(--color-text-2)]">
              {t("lead")}
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* ── Summary table: every service, starting price, what it buys ── */}
      <Section pad="tight" tone="alt" className="isolate">
        <SectionAtmosphere variant="a" />
        <Container size="md">
          <Reveal>
            <h2 className="t-h2 mb-8">{t("table.title")}</h2>
          </Reveal>
          <Reveal delay={60}>
            <div className="overflow-x-auto rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)]">
              <table className="w-full min-w-[540px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[color:var(--c-hairline)]">
                    <th className="px-5 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">
                      {t("table.service")}
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">
                      {t("table.from")}
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">
                      {t("table.what")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map(({ tier, path }) => {
                    const row = messages.home.pricing.tiers[tier];
                    if (!row) return null;
                    return (
                      <tr
                        key={tier}
                        className="border-b border-[color:var(--c-hairline)] last:border-0 transition-colors hover:bg-[color:var(--color-bg-alt)]"
                      >
                        <td className="px-5 py-4 align-top">
                          <Link
                            href={path}
                            className="text-[15.5px] font-medium tracking-[-0.011em] text-[color:var(--color-text)] underline decoration-[color:var(--c-hairline)] underline-offset-4 transition-colors hover:decoration-[color:var(--c-accent)]"
                          >
                            {row.title}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 align-top font-mono text-[15px] font-semibold tabular-nums text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                          {row.price}
                        </td>
                        <td className="px-5 py-4 align-top text-[14.5px] leading-[1.5] text-[color:var(--color-text-2)]">
                          {row.body}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-5 text-[14px] leading-[1.55] text-[color:var(--color-text-3)]">{tp("caption")}</p>
          </Reveal>

          {/* Fixed-price offers sit in their own table: they are bought as-is,
              not scoped, so mixing them into the "from" column above would
              misread as another open-ended starting price. */}
          <Reveal delay={140}>
            <h2 className="t-h3 mb-6 mt-14">{t("offersTable.title")}</h2>
            <div className="overflow-x-auto rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)]">
              <table className="w-full min-w-[540px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[color:var(--c-hairline)]">
                    <th className="px-5 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">
                      {t("table.service")}
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">
                      {t("table.from")}
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">
                      {t("table.what")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {OFFER_KEYS.map((key) => {
                    const tier = messages.offers?.[key]?.pricing?.tiers?.[0];
                    if (!tier) return null;
                    return (
                      <tr
                        key={key}
                        className="border-b border-[color:var(--c-hairline)] last:border-0 transition-colors hover:bg-[color:var(--color-bg-alt)]"
                      >
                        <td className="px-5 py-4 align-top">
                          <Link
                            href={OFFER_PATH[key]}
                            className="text-[15.5px] font-medium tracking-[-0.011em] text-[color:var(--color-text)] underline decoration-[color:var(--c-hairline)] underline-offset-4 transition-colors hover:decoration-[color:var(--c-accent)]"
                          >
                            {tNav(`servicesMenu.${key}.title`)}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 align-top font-mono text-[15px] font-semibold tabular-nums text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                          {tier.price}
                        </td>
                        <td className="px-5 py-4 align-top text-[14.5px] leading-[1.5] text-[color:var(--color-text-2)]">
                          {tier.body}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── Formats per service ── */}
      <Section pad="default">
        <Container size="md">
          <Reveal>
            <h2 className="t-h2 mb-3">{t("formats.title")}</h2>
            <p className="mb-12 max-w-[620px] text-[16px] leading-[1.55] text-[color:var(--color-text-2)]">
              {t("formats.lead")}
            </p>
          </Reveal>

          <div className="space-y-12">
            {ROWS.map(({ tier, branch, path }, bi) => {
              const service = messages.services[branch];
              const items = service?.formats?.items;
              if (!items?.length) return null;
              return (
                <Reveal key={branch} delay={bi * 40}>
                  <div>
                    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-b border-[color:var(--c-hairline)] pb-3">
                      <h3 className="t-h4">{messages.home.pricing.tiers[tier]?.title ?? service.eyebrow}</h3>
                      <Link
                        href={path}
                        className="text-[14px] text-[color:var(--c-accent-ink)] underline underline-offset-4 dark:text-[color:var(--c-accent)]"
                      >
                        {t("formats.more")}
                      </Link>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      {items.slice(0, 3).map((f) => (
                        <div
                          key={f.title}
                          className="rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] p-5"
                        >
                          <p className="text-[14.5px] font-semibold tracking-[-0.011em]">{f.title}</p>
                          <p className="mt-2 font-mono text-[19px] font-semibold tabular-nums tracking-[-0.02em]">
                            {f.price}
                          </p>
                          <p className="mt-1 text-[13px] text-[color:var(--color-text-3)]">{f.time}</p>
                          <p className="mt-3 text-[14px] leading-[1.5] text-[color:var(--color-text-2)]">{f.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ── What moves the price ── */}
      <Section pad="default" tone="alt" className="isolate">
        <SectionAtmosphere variant="b" />
        <Container size="md">
          <Reveal>
            <h2 className="t-h2 mb-10">{t("factors.title")}</h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 md:gap-x-12 md:gap-y-10">
            {factors.map((f, i) => (
              <Reveal key={f.title} delay={i * 50}>
                <div className="border-t border-[color:var(--c-hairline)] pt-5">
                  <h3 className="t-h4">{f.title}</h3>
                  <p className="mt-2.5 text-[15.5px] leading-[1.55] text-[color:var(--color-text-2)]">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── How a quote happens ── */}
      <Section pad="default">
        <Container size="md">
          <Reveal>
            <h2 className="t-h2 mb-10">{t("process.title")}</h2>
          </Reveal>
          <ol className="space-y-6">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 50}>
                <li className="flex gap-5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color:var(--c-accent-soft)] font-mono text-[13px] font-semibold text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[16px] font-semibold tracking-[-0.011em]">{s.title}</p>
                    <p className="mt-1.5 max-w-[620px] text-[15.5px] leading-[1.55] text-[color:var(--color-text-2)]">
                      {s.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* ── FAQ ── */}
      <Section pad="default" tone="alt" className="isolate">
        <SectionAtmosphere variant="c" />
        <Container size="md">
          <Reveal>
            <h2 className="t-h2 mb-10 text-center">{t("faq.title")}</h2>
          </Reveal>
          <FAQAccordion items={faq} />
        </Container>
      </Section>

      <FinalCta
        theme="studio"
        eyebrow={tf("eyebrow")}
        title={t("cta.title")}
        body={t("cta.body")}
        steps={tl.raw("ctaSteps") as { k: string; v: string }[]}
        available={tl("ctaAvailable")}
        primary={{ label: t("cta.button"), href: "/contact" }}
        secondary={{ label: tf("email"), href: `mailto:${tf("email")}`, kind: "link" }}
        rating={{ value: tr("rating"), count: `${countLiveReviews(tr.raw("list") as Review[], Date.now())} ${tr("count")}` }}
        note={tl("ctaNote")}
      />
    </>
  );
}

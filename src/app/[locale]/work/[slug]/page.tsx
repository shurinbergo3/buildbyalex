import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useMessages } from "next-intl";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { FinalCta } from "@/components/FinalCta";
import { CaseCover } from "@/components/CaseCover";
import { LeadBotCaseHero } from "@/components/LeadBotCaseHero";
import { CrmbotCaseHero } from "@/components/CrmbotCaseHero";
import { VisionairCaseHero } from "@/components/VisionairCaseHero";
import { BodyForgeCaseHero } from "@/components/BodyForgeCaseHero";
import { BodyForgeSiteCaseHero } from "@/components/BodyForgeSiteCaseHero";
import { BalticCaseHero } from "@/components/BalticCaseHero";
import { LegalwinCaseHero } from "@/components/LegalwinCaseHero";
import { LegalwinShowcase } from "@/components/LegalwinShowcase";
import { VisionairShowcase } from "@/components/VisionairShowcase";
import { LeadBotShowcase } from "@/components/LeadBotShowcase";
import { BodyForgeShowcase } from "@/components/BodyForgeShowcase";
import { BodyForgeSiteShowcase } from "@/components/BodyForgeSiteShowcase";
import { CrmbotShowcase } from "@/components/CrmbotShowcase";
import { BalticDockyardShowcase } from "@/components/BalticDockyardShowcase";
import { routing, type Locale } from "@/i18n/routing";
import { caseSlugToKey, caseImages, caseCategory, type CaseKey } from "@/lib/cases";
import { SITE_URL, localizedDynamicHref, dynamicLanguageAlternates, htmlLang } from "@/lib/site";

export function generateStaticParams() {
  const slugs = Object.keys(caseSlugToKey);
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const key = caseSlugToKey[slug];
  if (!key) return {};
  const t = await getTranslations({ locale, namespace: `work.cases.${key}` });
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  // The case slug is shared across locales; only the /work segment is localized
  // (ru: /raboty, pl: /realizacje, ua: /roboty). Build canonical + hreflang from
  // the localized path so they match the real public URLs and the sitemap.
  const url = localizedDynamicHref(locale as Locale, "/work/[slug]", slug);
  const languages = dynamicLanguageAlternates("/work/[slug]", () => slug);
  const image = caseImages[key];

  const title = t("title");
  const tagline = t("tagline");
  const industry = t("industry");
  const stack = t.raw("stack") as string[];
  const results = t.raw("results") as string[];
  const siteName = tMeta("siteName");

  // Concise, keyword-rich title (~60 chars) and description (~155 chars).
  const truncate = (s: string, max: number) => {
    const clean = s.replace(/\s+/g, " ").trim();
    if (clean.length <= max) return clean;
    const cut = clean.slice(0, max);
    return `${cut.slice(0, cut.lastIndexOf(" ")).trim()}…`;
  };
  const pageTitle = `${title} — ${industry} · ${siteName}`;
  const description = truncate(
    tagline.length > 110 ? tagline : `${tagline} ${results[0] ?? ""}`,
    158,
  );
  const ogImage = `${SITE_URL}${image.src}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: pageTitle,
    description,
    keywords: [title, industry, ...stack.slice(0, 6)],
    alternates: { canonical: url, languages },
    openGraph: {
      type: "article",
      title: pageTitle,
      description,
      url,
      siteName,
      locale,
      images: [{ url: ogImage, alt: t("imageAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
    },
  };
}

type CaseShape = {
  work: {
    intro: { live: string };
    caseMetrics: Record<CaseKey, { value: string; label: string }[]>;
    cases: Record<
      CaseKey,
      {
        industry: string;
        title: string;
        tagline: string;
        problem: string;
        solution: string;
        results: string[];
        stack: string[];
        url: string;
        quote: string;
        quoteAuthor: string;
      }
    >;
    caseLabels: {
      problem: string;
      solution: string;
      results: string;
      stack: string;
      url: string;
      ctaTitle: string;
      ctaBody: string;
      cta: string;
      more: string;
      ctaEyebrow: string;
      ctaAvailable: string;
      ctaNote: string;
      ctaSteps: { k: string; v: string }[];
    };
  };
};

function CaseContent({ slug, locale }: { slug: string; locale: string }) {
  const key = caseSlugToKey[slug];
  if (!key) notFound();
  const messages = useMessages() as unknown as CaseShape;
  const c = messages.work.cases[key];
  const labels = messages.work.caseLabels;
  const metrics = messages.work.caseMetrics[key];
  const liveLabel = messages.work.intro.live;
  const image = caseImages[key];
  const isLink = /\./.test(c.url) && !/\s/.test(c.url);
  // Final-CTA bookend: same theme/accent as this case's hero.
  const ctaTheme = caseCategory[key];
  const ctaAccent =
    key === "bodyforge" || key === "bodyforgesite"
      ? "#C8FF00"
      : key === "baltic"
        ? "#33C4E8"
        : "#FF7A2D";

  const chapters = [
    { label: labels.problem, body: c.problem },
    { label: labels.solution, body: c.solution },
  ];

  const pageUrl = localizedDynamicHref(locale as Locale, "/work/[slug]", slug);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${c.title} — ${c.tagline}`,
    description: c.tagline,
    image: `${SITE_URL}${image.src}`,
    inLanguage: htmlLang(locale as Locale),
    keywords: [c.industry, ...c.stack].join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    author: {
      "@type": "Person",
      name: "Alex",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "buildbyalex",
      url: SITE_URL,
    },
  };

  return (
    <>
      {/* ── Hero ── */}
      <Section pad="tight" className="!pt-12 md:!pt-20">
        <Container>
          {key === "baltic" ? (
            <BalticCaseHero url={c.url} liveLabel={liveLabel} />
          ) : key === "visionair" ? (
            <VisionairCaseHero url={c.url} liveLabel={liveLabel} />
          ) : key === "bodyforgesite" ? (
            <BodyForgeSiteCaseHero url={c.url} liveLabel={liveLabel} locale={locale} />
          ) : key === "bodyforge" ? (
            <BodyForgeCaseHero url={c.url} liveLabel={liveLabel} />
          ) : key === "legalwin" ? (
            <LegalwinCaseHero url={c.url} liveLabel={liveLabel} />
          ) : key === "leadbot" ? (
            <LeadBotCaseHero
              industry={c.industry}
              title={c.title}
              tagline={c.tagline}
              metrics={metrics}
              stack={c.stack}
              ndaLabel={c.url}
              liveLabel={liveLabel}
            />
          ) : key === "crmbot" ? (
            <CrmbotCaseHero
              industry={c.industry}
              title={c.title}
              tagline={c.tagline}
              metrics={metrics}
              stack={c.stack}
              ndaLabel={c.url}
              liveLabel={liveLabel}
            />
          ) : (
            <>
              <Reveal>
                <p className="t-eyebrow text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                  {c.industry}
                </p>
                <h1 className="mt-4 text-[clamp(40px,5.5vw+8px,72px)] font-semibold leading-[1.06] tracking-[-0.032em]">
                  {c.title}
                </h1>
                <p className="mt-5 max-w-[640px] text-[clamp(17px,1.2vw+13px,22px)] leading-[1.45] tracking-[-0.013em] text-[color:var(--color-text-2)]">
                  {c.tagline}
                </p>
              </Reveal>

              <Reveal delay={150}>
                <div className="mt-12">
                  <CaseCover
                    url={c.url}
                    liveLabel={liveLabel}
                    metrics={metrics}
                    stack={c.stack}
                  />
                </div>
              </Reveal>
            </>
          )}
        </Container>
      </Section>

      {/* ── Story: numbered chapters (Задача → Решение) ── */}
      <Section pad="default" tone="alt">
        <Container size="md">
          <div className="space-y-14 md:space-y-20">
            {chapters.map((ch, i) => (
              <Reveal key={ch.label}>
                <div className="grid gap-3 md:grid-cols-12 md:gap-10">
                  <div className="md:col-span-3">
                    <div className="md:sticky md:top-28">
                      <span className="font-mono text-[13px] tabular-nums text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h2 className="mt-1.5 text-[19px] font-semibold tracking-[-0.014em]">
                        {ch.label}
                      </h2>
                    </div>
                  </div>
                  <div className="md:col-span-9">
                    <p className="max-w-[64ch] text-[clamp(17px,0.5vw+15px,20px)] leading-[1.62] text-[color:var(--color-text)]">
                      {ch.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Results ── */}
      <Section pad="default">
        <Container size="md">
          <Reveal>
            <div className="grid gap-3 md:grid-cols-12 md:gap-10">
              <h2 className="t-eyebrow text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)] md:col-span-3">
                {labels.results}
              </h2>
              <div className="md:col-span-9">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {c.results.map((r) => (
                    <li
                      key={r}
                      className="flex gap-3 rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] p-4 text-[15.5px] leading-[1.5]"
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[color:var(--c-accent)] text-white">
                        <svg width="12" height="12" viewBox="0 0 12 12">
                          <path
                            d="M2 6.5l2.5 2.5L10 3.5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>

                {isLink && (
                  <p className="mt-6 text-[15px] text-[color:var(--color-text-2)]">
                    {labels.url}:{" "}
                    <a
                      href={`https://${c.url.replace(/^https?:\/\//, "")}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-medium text-[color:var(--c-accent-ink)] underline-offset-4 hover:underline dark:text-[color:var(--c-accent)]"
                    >
                      {c.url} ↗
                    </a>
                  </p>
                )}

                {c.quote && (
                  <figure className="mt-10 rounded-[24px] border-l-4 border-[color:var(--c-accent)] bg-[color:var(--color-bg-alt)] px-6 py-7 md:px-8 md:py-9">
                    <blockquote className="text-[18px] leading-[1.55] tracking-[-0.014em]">
                      “{c.quote}”
                    </blockquote>
                    <figcaption className="mt-4 text-[14px] text-[color:var(--color-text-3)]">
                      {c.quoteAuthor}
                    </figcaption>
                  </figure>
                )}
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {key === "baltic" && <BalticDockyardShowcase />}
      {key === "legalwin" && <LegalwinShowcase />}
      {key === "visionair" && <VisionairShowcase />}
      {key === "crmbot" && <CrmbotShowcase />}
      {key === "leadbot" && <LeadBotShowcase />}
      {key === "bodyforge" && <BodyForgeShowcase />}
      {key === "bodyforgesite" && <BodyForgeSiteShowcase />}

      <FinalCta
        theme={ctaTheme}
        accent={ctaAccent}
        eyebrow={labels.ctaEyebrow}
        title={labels.ctaTitle}
        body={labels.ctaBody}
        steps={labels.ctaSteps}
        available={labels.ctaAvailable}
        primary={{ label: labels.cta, href: "/contact" }}
        secondary={{ label: labels.more, href: "/work", kind: "ghost" }}
        note={labels.ctaNote}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!caseSlugToKey[slug]) notFound();
  setRequestLocale(locale);
  return <CaseContent slug={slug} locale={locale} />;
}

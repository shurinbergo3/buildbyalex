import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useMessages } from "next-intl";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { CaseCover } from "@/components/CaseCover";
import { LegalwinShowcase } from "@/components/LegalwinShowcase";
import { VisionairShowcase } from "@/components/VisionairShowcase";
import { DonbravaShowcase } from "@/components/DonbravaShowcase";
import { BodyForgeShowcase } from "@/components/BodyForgeShowcase";
import { CrmbotShowcase } from "@/components/CrmbotShowcase";
import { routing } from "@/i18n/routing";
import { caseSlugToKey, caseImages, type CaseKey } from "@/lib/cases";
import { SITE_URL } from "@/lib/site";

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
  const url = `${SITE_URL}/${locale}/work/${slug}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: `${t("title")} — ${t("tagline")}`,
    description: t("problem"),
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${t("title")} — ${t("tagline")}`,
      description: t("problem"),
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} — ${t("tagline")}`,
      description: t("problem"),
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

  const chapters = [
    { label: labels.problem, body: c.problem },
    { label: labels.solution, body: c.solution },
  ];

  const pageUrl = `${SITE_URL}/${locale}/work/${slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${c.title} — ${c.tagline}`,
    description: c.tagline,
    image: image.src,
    inLanguage: locale,
    keywords: [c.industry, ...c.stack].join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    author: {
      "@type": "Person",
      name: "Oleksandr Shuvalov",
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

      {key === "legalwin" && <LegalwinShowcase />}
      {key === "visionair" && <VisionairShowcase />}
      {key === "crmbot" && <CrmbotShowcase />}
      {key === "donbrava" && <DonbravaShowcase />}
      {key === "bodyforge" && <BodyForgeShowcase />}

      <Section pad="default">
        <Container size="md">
          <Reveal>
            <div className="case-cta-card relative overflow-hidden rounded-[36px] bg-[#0A0A0A] px-6 py-16 text-center text-white sm:px-10 md:px-14 md:py-24">
              <div className="case-cta-aurora" aria-hidden="true" />
              <div className="case-cta-grid" aria-hidden="true" />
              <div className="case-cta-edge" aria-hidden="true" />

              <div className="relative z-10 mx-auto flex max-w-[660px] flex-col items-center">
                <span className="case-cta-chip">
                  <span className="case-cta-chip-dot" aria-hidden="true" />
                  {labels.ctaAvailable}
                </span>

                <span className="case-cta-eyebrow">{labels.ctaEyebrow}</span>

                <h2 className="mt-4 text-[clamp(30px,4vw,50px)] font-semibold leading-[1.05] tracking-[-0.03em]">
                  {labels.ctaTitle}
                </h2>
                <p className="mx-auto mt-4 max-w-[480px] text-[16.5px] leading-[1.55] text-white/65">
                  {labels.ctaBody}
                </p>

                <ol className="case-cta-rail">
                  {labels.ctaSteps.map((s, i) => (
                    <li className="case-cta-step" key={i}>
                      <span className="case-cta-step-k">{s.k}</span>
                      <span className="case-cta-step-v">{s.v}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
                  <Button href="/contact" size="lg" className="case-cta-primary">
                    {labels.cta}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </Button>
                  <Button href="/work" variant="ghost" size="lg" className="!text-white !border-white/20 hover:!bg-white/10">
                    {labels.more}
                  </Button>
                </div>

                <p className="case-cta-note">{labels.ctaNote}</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

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

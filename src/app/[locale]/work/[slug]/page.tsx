import Image from "next/image";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useMessages } from "next-intl";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
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
    };
  };
};

function CaseContent({ slug }: { slug: string }) {
  const key = caseSlugToKey[slug];
  if (!key) notFound();
  const messages = useMessages() as unknown as CaseShape;
  const c = messages.work.cases[key];
  const labels = messages.work.caseLabels;
  const image = caseImages[key];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.title,
    description: c.tagline,
    image: image.src,
    author: {
      "@type": "Person",
      name: "Oleksandr Shuvalov",
      url: "https://buildbyalex.com",
    },
    publisher: {
      "@type": "Organization",
      name: "buildbyalex",
    },
  };

  return (
    <>
      <Section pad="tight" className="!pt-12 md:!pt-20">
        <Container>
          <Reveal>
            <p className="t-eyebrow">{c.industry}</p>
            <h1 className="mt-3 text-[clamp(40px,5.5vw+8px,72px)] font-semibold leading-[1.06] tracking-[-0.032em]">
              {c.title}
            </h1>
            <p className="mt-5 max-w-[640px] text-[clamp(17px,1.2vw+13px,22px)] leading-[1.45] tracking-[-0.013em] text-[color:var(--color-text-2)]">
              {c.tagline}
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-12 overflow-hidden rounded-[28px]">
              <Image
                src={image.src}
                alt={image.alt}
                width={1600}
                height={900}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section pad="default">
        <Container size="md">
          <div className="grid gap-14 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-8 space-y-12">
              <Reveal>
                <div>
                  <h2 className="t-eyebrow text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                    {labels.problem}
                  </h2>
                  <p className="mt-4 text-[17.5px] leading-[1.6] text-[color:var(--color-text)]">
                    {c.problem}
                  </p>
                </div>
              </Reveal>
              <Reveal>
                <div>
                  <h2 className="t-eyebrow text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                    {labels.solution}
                  </h2>
                  <p className="mt-4 text-[17.5px] leading-[1.6] text-[color:var(--color-text)]">
                    {c.solution}
                  </p>
                </div>
              </Reveal>
              <Reveal>
                <div>
                  <h2 className="t-eyebrow text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                    {labels.results}
                  </h2>
                  <ul className="mt-5 space-y-3">
                    {c.results.map((r) => (
                      <li
                        key={r}
                        className="flex gap-3 rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] p-4 text-[16px] leading-[1.5]"
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
                </div>
              </Reveal>

              {c.quote && (
                <Reveal>
                  <figure className="rounded-[24px] border-l-4 border-[color:var(--c-accent)] bg-[color:var(--color-bg-alt)] px-6 py-7 md:px-8 md:py-9">
                    <blockquote className="text-[18px] leading-[1.55] tracking-[-0.014em]">
                      “{c.quote}”
                    </blockquote>
                    <figcaption className="mt-4 text-[14px] text-[color:var(--color-text-3)]">
                      {c.quoteAuthor}
                    </figcaption>
                  </figure>
                </Reveal>
              )}
            </div>

            <aside className="md:col-span-4">
              <Reveal>
                <div className="md:sticky md:top-24 space-y-8">
                  <div>
                    <h3 className="t-eyebrow">{labels.stack}</h3>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {c.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] px-3 py-1.5 text-[12.5px] font-medium text-[color:var(--color-text-2)]"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {c.url && (
                    <div>
                      <h3 className="t-eyebrow">{labels.url}</h3>
                      <p className="mt-3 text-[15.5px]">
                        {c.url.startsWith("http") || c.url.includes(".") ? (
                          <a
                            href={`https://${c.url.replace(/^https?:\/\//, "")}`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="font-medium text-[color:var(--c-accent-ink)] underline-offset-4 hover:underline dark:text-[color:var(--c-accent)]"
                          >
                            {c.url} ↗
                          </a>
                        ) : (
                          <span className="text-[color:var(--color-text-2)]">{c.url}</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </Reveal>
            </aside>
          </div>
        </Container>
      </Section>

      <Section pad="default">
        <Container size="md">
          <Reveal>
            <div className="relative overflow-hidden rounded-[36px] bg-[#0A0A0A] px-8 py-16 text-center text-white md:px-12 md:py-24">
              <div
                className="pointer-events-none absolute -top-1/3 left-1/2 h-[120%] w-[120%] -translate-x-1/2 opacity-60"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(255,107,26,0.35), transparent 70%)",
                }}
              />
              <div className="relative z-10">
                <h2 className="text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.1] tracking-[-0.024em]">
                  {labels.ctaTitle}
                </h2>
                <p className="mx-auto mt-5 max-w-[520px] text-[16.5px] leading-[1.55] text-white/70">
                  {labels.ctaBody}
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Button href="/contact" size="lg">
                    {labels.cta}
                  </Button>
                  <Button href="/work" variant="ghost" size="lg" className="!text-white !border-white/20 hover:!bg-white/10">
                    {labels.more}
                  </Button>
                </div>
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
  return <CaseContent slug={slug} />;
}

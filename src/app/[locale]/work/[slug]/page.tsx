import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useMessages } from "next-intl";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { FinalCta } from "@/components/FinalCta";
import { CaseCover } from "@/components/CaseCover";
import { HeroWindow } from "@/components/HeroWindow";
import { DonbravaCaseHero } from "@/components/DonbravaCaseHero";
import { CrmbotCaseHero } from "@/components/CrmbotCaseHero";
import { VisionairHeroMock } from "@/components/VisionairHeroMock";
import { BodyForgeHeroMock } from "@/components/BodyForgeHeroMock";
import { LegalwinHeroMock } from "@/components/LegalwinHeroMock";
import { LegalwinShowcase } from "@/components/LegalwinShowcase";
import { VisionairShowcase } from "@/components/VisionairShowcase";
import { DonbravaShowcase } from "@/components/DonbravaShowcase";
import { BodyForgeShowcase } from "@/components/BodyForgeShowcase";
import { CrmbotShowcase } from "@/components/CrmbotShowcase";
import { routing, type Locale } from "@/i18n/routing";
import { caseSlugToKey, caseImages, caseCategory, type CaseKey } from "@/lib/cases";
import { SITE_URL, localizedDynamicHref, dynamicLanguageAlternates } from "@/lib/site";

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
  // Window-chrome label: the site host for real links, the verbatim label
  // (e.g. "Под NDA") otherwise.
  const chromeHost = c.url.split("/")[0].replace(/^https?:\/\//, "");
  // Final-CTA bookend: same theme/accent as this case's hero.
  const ctaTheme = caseCategory[key];
  const ctaAccent = key === "bodyforge" ? "#C8FF00" : "#FF7A2D";

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
    image: image.src,
    inLanguage: locale,
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
          {key === "visionair" ? (
            <HeroWindow theme="web" accent="#FF7A2D" label={chromeHost} live={liveLabel}>
              <div className="grid items-center gap-10 md:grid-cols-[0.92fr_1.08fr] md:gap-12 lg:gap-16">
                <Reveal>
                  <div>
                    <p className="t-eyebrow" style={{ color: "#FF7A2D" }}>
                      {c.industry}
                    </p>
                    <h1 className="mt-4 text-[clamp(40px,5.5vw+8px,72px)] font-semibold leading-[1.06] tracking-[-0.032em] text-white">
                      {c.title}
                    </h1>
                    <p className="mt-5 max-w-[520px] text-[clamp(17px,1.2vw+13px,22px)] leading-[1.45] tracking-[-0.013em] text-white/65">
                      {c.tagline}
                    </p>
                    <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
                      {metrics.map((m) => (
                        <div key={m.label}>
                          <dt className="text-[clamp(26px,2vw+18px,36px)] font-semibold leading-none tracking-[-0.02em]" style={{ color: "#FFB386" }}>
                            {m.value}
                          </dt>
                          <dd className="mt-1.5 text-[13px] text-white/45">
                            {m.label}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {isLink && (
                      <a
                        href={`https://${c.url.replace(/^https?:\/\//, "")}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] py-2 pl-3.5 pr-4 text-[14px] font-medium text-white/85 backdrop-blur-sm transition-colors hover:border-[color:var(--c-accent)] hover:text-white"
                      >
                        <span className="relative grid h-2 w-2 place-items-center">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--c-accent)] opacity-75" />
                          <span className="relative h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]" />
                        </span>
                        {liveLabel} · {c.url}
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </a>
                    )}
                  </div>
                </Reveal>

                <Reveal delay={150}>
                  <VisionairHeroMock url={c.url} />
                </Reveal>
              </div>
            </HeroWindow>
          ) : key === "bodyforge" ? (
            <HeroWindow theme="mobile" accent="#C8FF00" label={chromeHost} live={liveLabel}>
              <div className="relative grid items-center gap-10 md:grid-cols-[1.02fr_0.98fr] md:gap-12 lg:gap-16">
                <Reveal>
                  <div>
                    <p className="t-eyebrow" style={{ color: "#C8FF00" }}>
                      {c.industry}
                    </p>
                    <h1 className="mt-4 text-[clamp(40px,5.5vw+8px,72px)] font-semibold leading-[1.06] tracking-[-0.032em] text-white">
                      {c.title}
                    </h1>
                    <p className="mt-5 max-w-[520px] text-[clamp(17px,1.2vw+13px,22px)] leading-[1.45] tracking-[-0.013em] text-white/70">
                      {c.tagline}
                    </p>
                    <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
                      {metrics.map((m) => (
                        <div key={m.label}>
                          <dt
                            className="text-[clamp(26px,2vw+18px,36px)] font-semibold leading-none tracking-[-0.02em]"
                            style={{ color: "#C8FF00" }}
                          >
                            {m.value}
                          </dt>
                          <dd className="mt-1.5 text-[13px] text-white/45">{m.label}</dd>
                        </div>
                      ))}
                    </dl>
                    {c.stack.length > 0 && (
                      <ul className="mt-7 flex flex-wrap gap-2">
                        {c.stack.slice(0, 5).map((tech) => (
                          <li
                            key={tech}
                            className="rounded-full border border-white/[0.12] bg-white/[0.04] px-3 py-1 text-[12.5px] font-medium text-white/65 backdrop-blur-sm"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    )}
                    {isLink && (
                      <a
                        href={`https://${c.url.replace(/^https?:\/\//, "")}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group/store mt-9 inline-flex items-center gap-3.5 rounded-2xl bg-gradient-to-b from-white to-[#ececec] py-2.5 pl-4 pr-5 text-black shadow-[0_12px_34px_-12px_rgba(0,0,0,0.7)] ring-1 ring-black/[0.06] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-12px_rgba(200,255,0,0.4),0_12px_34px_-12px_rgba(0,0,0,0.6)]"
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M16.36 12.79c-.02-2.13 1.74-3.15 1.82-3.2-0.99-1.45-2.53-1.65-3.08-1.67-1.31-.13-2.56.77-3.22.77-.66 0-1.69-.75-2.78-.73-1.43.02-2.75.83-3.48 2.11-1.48 2.57-.38 6.37 1.07 8.45.71 1.02 1.55 2.16 2.66 2.12 1.07-.04 1.47-.69 2.76-.69 1.29 0 1.65.69 2.78.67 1.15-.02 1.87-1.04 2.57-2.06.81-1.18 1.14-2.32 1.16-2.38-.03-.01-2.23-.86-2.26-3.39zM14.23 6.31c.58-.71.98-1.69.87-2.67-.84.03-1.86.56-2.47 1.26-.54.62-1.02 1.62-.89 2.58.94.07 1.9-.47 2.49-1.17z" />
                        </svg>
                        <span className="flex flex-col leading-none">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/50">
                            App Store
                          </span>
                          <span className="mt-1 flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em]">
                            {liveLabel}
                            <span className="relative grid h-1.5 w-1.5 place-items-center">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34c759] opacity-70" />
                              <span className="relative h-1.5 w-1.5 rounded-full bg-[#34c759]" />
                            </span>
                          </span>
                        </span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          className="text-black/35 transition-transform duration-300 group-hover/store:translate-x-0.5"
                        >
                          <path d="M7 17 17 7M9 7h8v8" />
                        </svg>
                      </a>
                    )}
                  </div>
                </Reveal>

                <Reveal delay={150}>
                  <BodyForgeHeroMock />
                </Reveal>
              </div>
            </HeroWindow>
          ) : key === "legalwin" ? (
            <HeroWindow theme="web" accent="#FF7A2D" label={chromeHost} live={liveLabel}>
              <div className="grid items-center gap-10 md:grid-cols-[0.92fr_1.08fr] md:gap-12 lg:gap-16">
              <Reveal>
                <div>
                  <p className="t-eyebrow" style={{ color: "#FF7A2D" }}>
                    {c.industry}
                  </p>
                  <h1 className="mt-4 text-[clamp(40px,5.5vw+8px,72px)] font-semibold leading-[1.06] tracking-[-0.032em] text-white">
                    {c.title}
                  </h1>
                  <p className="mt-5 max-w-[520px] text-[clamp(17px,1.2vw+13px,22px)] leading-[1.45] tracking-[-0.013em] text-white/65">
                    {c.tagline}
                  </p>
                  <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
                    {metrics.map((m) => (
                      <div key={m.label}>
                        <dt className="text-[clamp(26px,2vw+18px,36px)] font-semibold leading-none tracking-[-0.02em]" style={{ color: "#FFB386" }}>
                          {m.value}
                        </dt>
                        <dd className="mt-1.5 text-[13px] text-white/45">
                          {m.label}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {isLink && (
                    <a
                      href={`https://${c.url.replace(/^https?:\/\//, "")}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] py-2 pl-3.5 pr-4 text-[14px] font-medium text-white/85 backdrop-blur-sm transition-colors hover:border-[color:var(--c-accent)] hover:text-white"
                    >
                      <span className="relative grid h-2 w-2 place-items-center">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--c-accent)] opacity-75" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]" />
                      </span>
                      {liveLabel} · {c.url}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </a>
                  )}
                </div>
              </Reveal>

              <Reveal delay={150}>
                <LegalwinHeroMock />
              </Reveal>
              </div>
            </HeroWindow>
          ) : key === "donbrava" ? (
            <DonbravaCaseHero
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

      {key === "legalwin" && <LegalwinShowcase />}
      {key === "visionair" && <VisionairShowcase />}
      {key === "crmbot" && <CrmbotShowcase />}
      {key === "donbrava" && <DonbravaShowcase />}
      {key === "bodyforge" && <BodyForgeShowcase />}

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

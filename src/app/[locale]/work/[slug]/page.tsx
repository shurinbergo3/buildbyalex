import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useMessages } from "next-intl";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { CtaGlassLayers } from "@/components/CtaGlass";
import { CaseCover } from "@/components/CaseCover";
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
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const url = `${SITE_URL}/${locale}/work/${slug}`;
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
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: pageTitle,
      description,
      url,
      siteName,
      locale,
      images: [{ url: ogImage, alt: image.alt }],
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
            <div className="grid items-center gap-10 md:grid-cols-[0.92fr_1.08fr] md:gap-12 lg:gap-16">
              <Reveal>
                <div>
                  <p className="t-eyebrow text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                    {c.industry}
                  </p>
                  <h1 className="mt-4 text-[clamp(40px,5.5vw+8px,72px)] font-semibold leading-[1.06] tracking-[-0.032em]">
                    {c.title}
                  </h1>
                  <p className="mt-5 max-w-[520px] text-[clamp(17px,1.2vw+13px,22px)] leading-[1.45] tracking-[-0.013em] text-[color:var(--color-text-2)]">
                    {c.tagline}
                  </p>
                  <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
                    {metrics.map((m) => (
                      <div key={m.label}>
                        <dt className="text-[clamp(26px,2vw+18px,36px)] font-semibold leading-none tracking-[-0.02em] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                          {m.value}
                        </dt>
                        <dd className="mt-1.5 text-[13px] text-[color:var(--color-text-3)]">
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
                      className="mt-8 inline-flex items-center gap-2 rounded-full border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] py-2 pl-3.5 pr-4 text-[14px] font-medium text-[color:var(--color-text)] transition-colors hover:border-[color:var(--c-accent)] hover:text-[color:var(--c-accent-ink)] dark:hover:text-[color:var(--c-accent)]"
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
          ) : key === "bodyforge" ? (
            <div className="relative overflow-hidden rounded-[26px] bg-[#070a08] px-6 py-12 shadow-[0_40px_120px_-44px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(255,255,255,0.05)] sm:rounded-[36px] sm:px-10 sm:py-14 md:px-14 md:py-16">
              {/* Faint gym photo grounding the dark stage */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-[0.22]"
                style={{ backgroundImage: `url(${image.src})` }}
              />
              {/* Dark wash + lime aurora */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                  background:
                    "radial-gradient(120% 95% at 100% 0%, rgba(200,255,0,0.16), transparent 52%), linear-gradient(115deg, rgba(7,10,8,0.94) 0%, rgba(7,10,8,0.74) 52%, rgba(7,10,8,0.52) 100%)",
                }}
              />
              {/* Hairline grid texture */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
                  backgroundSize: "46px 46px",
                  WebkitMaskImage: "radial-gradient(78% 78% at 50% 28%, #000, transparent 82%)",
                  maskImage: "radial-gradient(78% 78% at 50% 28%, #000, transparent 82%)",
                }}
              />
              {/* Apple-ecosystem contours — outlined Apple / App Store / Swift / Xcode
                  marks scattered across the dark stage, lime-tinted near the aurora
                  and cool-white toward the edges. Native-iOS build cue. */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                {/* huge Apple outline, upper area — peeks out beside the phone */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C8FF00"
                  strokeWidth="0.42"
                  className="absolute right-[30%] -top-8 h-56 w-56 opacity-[0.3] sm:h-72 sm:w-72 md:h-[22rem] md:w-[22rem]"
                >
                  <path d="M16.36 12.79c-.02-2.13 1.74-3.15 1.82-3.2-0.99-1.45-2.53-1.65-3.08-1.67-1.31-.13-2.56.77-3.22.77-.66 0-1.69-.75-2.78-.73-1.43.02-2.75.83-3.48 2.11-1.48 2.57-.38 6.37 1.07 8.45.71 1.02 1.55 2.16 2.66 2.12 1.07-.04 1.47-.69 2.76-.69 1.29 0 1.65.69 2.78.67 1.15-.02 1.87-1.04 2.57-2.06.81-1.18 1.14-2.32 1.16-2.38-.03-.01-2.23-.86-2.26-3.39zM14.23 6.31c.58-.71.98-1.69.87-2.67-.84.03-1.86.56-2.47 1.26-.54.62-1.02 1.62-.89 2.58.94.07 1.9-.47 2.49-1.17z" />
                </svg>
                {/* big Apple outline, bottom-left, cool white */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.5"
                  className="absolute -bottom-12 -left-10 h-44 w-44 opacity-[0.14] sm:h-56 sm:w-56 md:h-72 md:w-72"
                >
                  <path d="M16.36 12.79c-.02-2.13 1.74-3.15 1.82-3.2-0.99-1.45-2.53-1.65-3.08-1.67-1.31-.13-2.56.77-3.22.77-.66 0-1.69-.75-2.78-.73-1.43.02-2.75.83-3.48 2.11-1.48 2.57-.38 6.37 1.07 8.45.71 1.02 1.55 2.16 2.66 2.12 1.07-.04 1.47-.69 2.76-.69 1.29 0 1.65.69 2.78.67 1.15-.02 1.87-1.04 2.57-2.06.81-1.18 1.14-2.32 1.16-2.38-.03-.01-2.23-.86-2.26-3.39zM14.23 6.31c.58-.71.98-1.69.87-2.67-.84.03-1.86.56-2.47 1.26-.54.62-1.02 1.62-.89 2.58.94.07 1.9-.47 2.49-1.17z" />
                </svg>
                {/* App Store squircle + A — mid-left */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.55"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute left-[3%] top-[26%] hidden h-24 w-24 opacity-[0.13] sm:block md:h-28 md:w-28"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5.2" />
                  <path d="M7.2 16.4 12 7.4l4.8 9" />
                  <path d="M9.5 13.1h5" />
                </svg>
                {/* Swift bird — upper-left accent, lime */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C8FF00"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                  className="absolute left-[24%] top-[6%] hidden h-20 w-20 opacity-[0.2] md:block md:h-24 md:w-24"
                >
                  <path d="M7.508 0c-.287 0-.573 0-.86.002-.241.002-.483.003-.724.01-.132.003-.263.009-.395.015A9.154 9.154 0 0 0 4.348.15 5.492 5.492 0 0 0 2.85.645 5.04 5.04 0 0 0 .645 2.848c-.245.48-.4.972-.495 1.5-.093.52-.122 1.05-.136 1.576a35.2 35.2 0 0 0-.012.724C0 6.935 0 7.221 0 7.508v8.984c0 .287 0 .575.002.862.002.24.005.481.012.722.014.526.043 1.057.136 1.576.095.528.25 1.02.495 1.5a5.03 5.03 0 0 0 2.205 2.203c.48.244.97.4 1.498.495.52.093 1.05.124 1.576.138.241.007.483.009.724.01.287.002.573.002.86.002h8.984c.287 0 .573 0 .86-.002.241-.001.483-.003.724-.01a10.523 10.523 0 0 0 1.578-.138 5.322 5.322 0 0 0 1.498-.495 5.035 5.035 0 0 0 2.203-2.203c.245-.48.4-.972.495-1.5.093-.52.124-1.05.138-1.576.007-.241.009-.481.01-.722.002-.287.002-.575.002-.862V7.508c0-.287 0-.573-.002-.86a33.662 33.662 0 0 0-.01-.724 10.5 10.5 0 0 0-.138-1.576 5.328 5.328 0 0 0-.495-1.5A5.039 5.039 0 0 0 21.152.645 5.32 5.32 0 0 0 19.654.15a10.493 10.493 0 0 0-1.578-.138 34.98 34.98 0 0 0-.722-.01C17.067 0 16.779 0 16.492 0H7.508zm6.035 3.41c4.114 2.47 6.545 7.162 5.549 11.131-.024.093-.05.181-.076.272l.002.001c2.062 2.538 1.5 5.258 1.236 4.745-1.072-2.086-3.066-1.568-4.088-1.043a6.803 6.803 0 0 1-.281.158l-.02.012-.002.002c-2.115 1.123-4.957 1.205-7.812-.022a12.568 12.568 0 0 1-5.64-4.838c.649.48 1.35.902 2.097 1.252 3.019 1.414 6.051 1.311 8.197-.002C9.651 12.73 7.101 9.67 5.146 7.191a10.628 10.628 0 0 1-1.005-1.384c2.34 2.142 6.038 4.83 7.365 5.576C8.69 8.408 6.208 4.743 6.324 4.86c4.436 4.47 8.528 6.996 8.528 6.996.154.085.27.154.36.213.085-.215.16-.437.224-.668.708-2.588-.09-5.548-1.893-7.992z" />
                </svg>
                {/* Xcode hammer — bottom accent */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute bottom-[8%] left-[30%] hidden h-20 w-20 -rotate-[10deg] opacity-[0.12] md:block"
                >
                  <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0a2.12 2.12 0 0 1 0-3L12 9" />
                  <path d="M17.64 15 22 10.64" />
                  <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h.86c.85 0 1.65.33 2.25.93l1.25 1.25" />
                </svg>
              </div>

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
            </div>
          ) : key === "legalwin" ? (
            <div className="relative grid items-center gap-10 md:grid-cols-[0.92fr_1.08fr] md:gap-12 lg:gap-16">
              {/* Web-dev constellation — outlined marks of the build stack
                  (React · TypeScript · Tailwind · Vercel · Postgres) plus an AI
                  spark, drifting large & faint behind the case. Accent-tinted,
                  masked away from the headline so the copy stays crisp. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-6 -inset-y-10 -z-10 overflow-hidden [mask-image:radial-gradient(125%_135%_at_78%_42%,#000_0%,#000_34%,transparent_84%)]"
              >
                {/* React atom — large, top-right behind the mock */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="0.4"
                  style={{ stroke: "var(--c-accent)" }}
                  className="absolute right-[3%] -top-6 h-60 w-60 opacity-[0.1] sm:h-72 sm:w-72 md:h-[20rem] md:w-[20rem]"
                >
                  <circle cx="12" cy="12" r="1.7" style={{ fill: "var(--c-accent)" }} stroke="none" />
                  <ellipse cx="12" cy="12" rx="11" ry="4.3" />
                  <ellipse cx="12" cy="12" rx="11" ry="4.3" transform="rotate(60 12 12)" />
                  <ellipse cx="12" cy="12" rx="11" ry="4.3" transform="rotate(120 12 12)" />
                </svg>
                {/* Browser window — center stage, neutral ink */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="0.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ stroke: "var(--color-text)" }}
                  className="absolute left-[42%] top-[8%] hidden h-44 w-44 opacity-[0.06] md:block md:h-56 md:w-56"
                >
                  <rect x="2.5" y="4" width="19" height="16" rx="2.4" />
                  <path d="M2.5 8.6h19" />
                  <circle cx="5.4" cy="6.3" r="0.55" style={{ fill: "var(--color-text)" }} stroke="none" />
                  <circle cx="7.6" cy="6.3" r="0.55" style={{ fill: "var(--color-text)" }} stroke="none" />
                  <circle cx="9.8" cy="6.3" r="0.55" style={{ fill: "var(--color-text)" }} stroke="none" />
                </svg>
                {/* Tailwind waves — bottom-left, neutral */}
                <svg
                  viewBox="0 0 24 18"
                  fill="none"
                  strokeWidth="0.55"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ stroke: "var(--color-text)" }}
                  className="absolute left-[3%] bottom-[8%] hidden h-28 w-36 opacity-[0.07] sm:block md:h-32 md:w-44"
                >
                  <path d="M6 4.5c1.6-3.2 3.6-4.8 6-4.8 3.6 0 4.05 2.4 5.85 3 1.2.4 2.25.15 3.15-.75-1.6 3.2-3.6 4.8-6 4.8-3.6 0-4.05-2.4-5.85-3-1.2-.4-2.25-.15-3.15.75z" />
                  <path d="M0 10.5c1.6-3.2 3.6-4.8 6-4.8 3.6 0 4.05 2.4 5.85 3 1.2.4 2.25.15 3.15-.75-1.6 3.2-3.6 4.8-6 4.8-3.6 0-4.05-2.4-5.85-3-1.2-.4-2.25-.15-3.15.75z" />
                </svg>
                {/* Code brackets </> — mid-left, accent */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ stroke: "var(--c-accent)" }}
                  className="absolute left-[7%] top-[18%] hidden h-24 w-24 opacity-[0.07] md:block md:h-28 md:w-28"
                >
                  <path d="M8 7 3 12l5 5M16 7l5 5-5 5M13.6 4.6l-3.2 14.8" />
                </svg>
                {/* Vercel triangle — upper area, neutral */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="0.6"
                  strokeLinejoin="round"
                  style={{ stroke: "var(--color-text)" }}
                  className="absolute right-[34%] top-[2%] hidden h-24 w-24 opacity-[0.06] md:block"
                >
                  <path d="M12 3.5 22 20.5H2z" />
                </svg>
                {/* Database cylinder (pgvector) — right edge, accent */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="0.65"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ stroke: "var(--c-accent)" }}
                  className="absolute right-[5%] bottom-[10%] hidden h-32 w-32 opacity-[0.08] md:block"
                >
                  <ellipse cx="12" cy="6" rx="7" ry="2.6" />
                  <path d="M5 6v12c0 1.45 3.13 2.6 7 2.6s7-1.15 7-2.6V6" />
                  <path d="M5 12c0 1.45 3.13 2.6 7 2.6s7-1.15 7-2.6" />
                </svg>
                {/* AI spark — small bright accents */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ fill: "var(--c-accent)" }}
                  className="absolute right-[24%] top-[34%] h-12 w-12 opacity-[0.13] md:h-16 md:w-16"
                >
                  <path d="M12 2c.45 4.7 2.6 6.85 7 7-4.4.15-6.55 2.3-7 7-.45-4.7-2.6-6.85-7-7 4.4-.15 6.55-2.3 7-7z" />
                </svg>
                {/* Curly braces {} — bottom accent, neutral */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ stroke: "var(--color-text)" }}
                  className="absolute left-[30%] bottom-[4%] hidden h-20 w-20 opacity-[0.05] lg:block"
                >
                  <path d="M9 4c-2 0-2 1.6-2 3.2 0 2-1 3-2 3 1 0 2 1 2 3 0 1.6 0 3.2 2 3.2M15 4c2 0 2 1.6 2 3.2 0 2 1 3 2 3-1 0-2 1-2 3 0 1.6 0 3.2-2 3.2" />
                </svg>
              </div>

              <Reveal>
                <div>
                  <p className="t-eyebrow text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                    {c.industry}
                  </p>
                  <h1 className="mt-4 text-[clamp(40px,5.5vw+8px,72px)] font-semibold leading-[1.06] tracking-[-0.032em]">
                    {c.title}
                  </h1>
                  <p className="mt-5 max-w-[520px] text-[clamp(17px,1.2vw+13px,22px)] leading-[1.45] tracking-[-0.013em] text-[color:var(--color-text-2)]">
                    {c.tagline}
                  </p>
                  <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
                    {metrics.map((m) => (
                      <div key={m.label}>
                        <dt className="text-[clamp(26px,2vw+18px,36px)] font-semibold leading-none tracking-[-0.02em] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                          {m.value}
                        </dt>
                        <dd className="mt-1.5 text-[13px] text-[color:var(--color-text-3)]">
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
                      className="mt-8 inline-flex items-center gap-2 rounded-full border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] py-2 pl-3.5 pr-4 text-[14px] font-medium text-[color:var(--color-text)] transition-colors hover:border-[color:var(--c-accent)] hover:text-[color:var(--c-accent-ink)] dark:hover:text-[color:var(--c-accent)]"
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

      <Section pad="default">
        <Container size="md">
          <Reveal>
            <div className="cta-glass rounded-[36px] px-6 py-16 text-center text-white sm:px-10 md:px-14 md:py-24">
              <CtaGlassLayers />

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

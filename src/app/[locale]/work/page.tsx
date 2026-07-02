import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { FinalCTA } from "@/components/home/FinalCTA";
import { WorkShowcase, type GalleryCase } from "@/components/work/WorkShowcase";
import { routing, type Locale } from "@/i18n/routing";
import { caseSlugs, caseKeyToSlug, caseImages, caseCategory } from "@/lib/cases";
import { buildLocalizedMetadata } from "@/lib/metadata";
import { getLiveReviewCount } from "@/lib/reviews";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "work.intro" });
  return buildLocalizedMetadata({
    locale: locale as Locale,
    pathname: "/work",
    title: t("headline"),
    description: t("subhead"),
  });
}

export default async function WorkIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const intro = await getTranslations({ locale, namespace: "work.intro" });
  const tCases = await getTranslations({ locale, namespace: "work.cases" });
  const tFilters = await getTranslations({ locale, namespace: "work.filters" });
  const reviewCount = await getLiveReviewCount(locale as Locale);

  const cases: GalleryCase[] = caseSlugs.map((key) => ({
    key,
    slug: caseKeyToSlug[key],
    category: caseCategory[key],
    industry: tCases(`${key}.industry`),
    title: tCases(`${key}.title`),
    tagline: tCases(`${key}.tagline`),
    metricValue: tCases(`${key}.metric.value`),
    metricLabel: tCases(`${key}.metric.label`),
    imageSrc: caseImages[key].src,
    imageAlt: tCases(`${key}.imageAlt`),
  }));

  return (
    <>
      <WorkShowcase
        cases={cases}
        labels={{
          eyebrow: intro("eyebrow"),
          headline: intro("headline"),
          subhead: intro("subhead"),
          cta: intro("cta"),
          live: intro("live"),
        }}
        filters={{
          all: tFilters("all"),
          web: tFilters("web"),
          ai: tFilters("ai"),
          mobile: tFilters("mobile"),
        }}
      />

      <FinalCTA reviewCount={reviewCount} />
    </>
  );
}

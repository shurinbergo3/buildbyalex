import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/PageHeader";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { FinalCTA } from "@/components/home/FinalCTA";
import { routing, type Locale } from "@/i18n/routing";
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
  const t = await getTranslations({ locale, namespace: "services.intro" });
  return buildLocalizedMetadata({
    locale: locale as Locale,
    pathname: "/services",
    title: t("headline"),
    description: t("subhead"),
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services.intro" });
  const reviewCount = await getLiveReviewCount(locale as Locale);

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} headline={t("headline")} lead={t("subhead")} />
      <ServicesOverview />
      <FinalCTA reviewCount={reviewCount} />
    </>
  );
}

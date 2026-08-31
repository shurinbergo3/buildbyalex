import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { OfferPageTemplate } from "@/components/OfferPageTemplate";
import { routing, type Locale } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "offers.documents.meta" });
  return buildLocalizedMetadata({
    locale: locale as Locale,
    pathname: "/services/document-automation",
    title: t("title"),
    description: t("description"),
  });
}

export default async function DocumentAutomationOffer({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OfferPageTemplate offer="documents" />;
}

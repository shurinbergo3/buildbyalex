import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ServicePageTemplate } from "@/components/ServicePageTemplate";
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
  const t = await getTranslations({ locale, namespace: "services.ai.meta" });
  return buildLocalizedMetadata({
    locale: locale as Locale,
    pathname: "/services/ai-agents",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AIService({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicePageTemplate branch="ai" />;
}

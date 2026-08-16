import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";
import { PricingPage } from "@/components/pricing/PricingPage";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) return {};
  const t = await getTranslations({ locale, namespace: "pricing.meta" });
  return buildLocalizedMetadata({
    locale: locale as Locale,
    pathname: "/pricing",
    title: t("title"),
    description: t("description"),
  });
}

export default async function Pricing({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);
  return <PricingPage />;
}

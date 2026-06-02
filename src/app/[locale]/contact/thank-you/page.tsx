import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ThankYouExperience } from "@/components/ThankYouExperience";
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
  const t = await getTranslations({ locale, namespace: "thankYou.meta" });
  return buildLocalizedMetadata({
    locale: locale as Locale,
    pathname: "/contact/thank-you",
    title: t("title"),
    description: t("description"),
    noIndex: true,
  });
}

export default async function ThankYouPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ name?: string; type?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { name, type } = await searchParams;

  return <ThankYouExperience name={name} type={type} />;
}

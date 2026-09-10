import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getLiveReviewCount } from "@/lib/reviews";
import { PromoPage } from "@/components/promo/PromoPage";

// Test run of the Apple-style home page. Russian only for now, and kept out of
// the index until it replaces the real home page.
export function generateStaticParams() {
  return [{ locale: "ru" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "ru") return {};
  // Same title and description as the home page: if this version replaces
  // it, nothing changes for search.
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { absolute: t("defaultTitle") },
    description: t("defaultDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function PromoRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "ru") notFound();
  setRequestLocale(locale);

  const now = Date.now();
  const reviewCount = await getLiveReviewCount(locale as Locale, now);

  return <PromoPage reviewCount={reviewCount} now={now} />;
}

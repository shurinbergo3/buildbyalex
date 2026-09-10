import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getLiveReviewCount } from "@/lib/reviews";
import { HomeJsonLd } from "@/components/HomeJsonLd";
import { ClassicHome } from "@/components/home/ClassicHome";
import { PromoPage } from "@/components/promo/PromoPage";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);

  // Single source of truth for the review count: the hero trust line, the
  // JSON-LD aggregate rating and the reviews block all derive from this
  // same timestamp, so the numbers can never drift apart.
  const now = Date.now();
  const reviewCount = await getLiveReviewCount(locale as Locale, now);

  // The Russian home is the film version since September 2026. The other
  // languages keep the classic page until the film is translated.
  return (
    <>
      <HomeJsonLd locale={locale as Locale} />
      {locale === "ru" ? (
        <PromoPage reviewCount={reviewCount} now={now} />
      ) : (
        <ClassicHome reviewCount={reviewCount} now={now} />
      )}
    </>
  );
}

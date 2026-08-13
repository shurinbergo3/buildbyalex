import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getLiveReviewCount } from "@/lib/reviews";
import { HomeJsonLd } from "@/components/HomeJsonLd";
import { Hero } from "@/components/home/Hero";
import { PainPoints } from "@/components/home/PainPoints";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { LegalwinHomeShowcase } from "@/components/home/LegalwinHomeShowcase";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ScrollStory } from "@/components/home/ScrollStory";
import { Pricing } from "@/components/home/Pricing";
import { FitCheck } from "@/components/home/FitCheck";
import { Testimonials } from "@/components/home/Testimonials";
import { FAQ } from "@/components/home/FAQ";
import { FinalCTA } from "@/components/home/FinalCTA";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);

  // Single source of truth for "how many reviews" — the hero trust line, the
  // JSON-LD aggregate rating and the Testimonials block all derive from this
  // same timestamp, so the numbers can never drift apart.
  const now = Date.now();
  const reviewCount = await getLiveReviewCount(locale as Locale, now);

  return (
    <div className="home-sections">
      <HomeJsonLd locale={locale as Locale} />
      <Hero reviewCount={reviewCount} />
      <PainPoints />
      <ServicesOverview />
      <FeaturedWork />
      <LegalwinHomeShowcase />
      <HowItWorks />
      <ScrollStory />
      <Pricing />
      <FitCheck />
      <Testimonials now={now} />
      <FAQ />
      <FinalCTA reviewCount={reviewCount} />
    </div>
  );
}

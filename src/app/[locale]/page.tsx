import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { HomeJsonLd } from "@/components/HomeJsonLd";
import { Hero } from "@/components/home/Hero";
import { PainPoints } from "@/components/home/PainPoints";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { LegalwinHomeShowcase } from "@/components/home/LegalwinHomeShowcase";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ScrollStory } from "@/components/home/ScrollStory";
import { Numbers } from "@/components/home/Numbers";
import { Pricing } from "@/components/home/Pricing";
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

  return (
    <>
      <HomeJsonLd locale={locale as Locale} />
      <Hero />
      <PainPoints />
      <ServicesOverview />
      <FeaturedWork />
      <LegalwinHomeShowcase />
      <HowItWorks />
      <ScrollStory />
      <Numbers />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}

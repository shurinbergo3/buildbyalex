import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { HomeJsonLd } from "@/components/HomeJsonLd";
import { Hero } from "@/components/home/Hero";
import { PainPoints } from "@/components/home/PainPoints";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { LegalwinHomeShowcase } from "@/components/home/LegalwinHomeShowcase";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { BotCrmSync } from "@/components/BotCrmSync";
import { Reveal } from "@/components/Reveal";
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

  const tSync = await getTranslations("home.botSync");
  const syncHeadline = tSync("headline").split("\n");

  return (
    <>
      <HomeJsonLd locale={locale as Locale} />
      <Hero />
      <PainPoints />
      <ServicesOverview />
      <FeaturedWork />
      <LegalwinHomeShowcase />
      <HowItWorks />
      <Section pad="default">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-[760px] text-center">
              <p className="t-eyebrow">{tSync("eyebrow")}</p>
              <h2 className="mt-3 t-h2">
                {syncHeadline.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h2>
              <p className="mx-auto mt-5 max-w-[600px] t-body-lg">{tSync("subhead")}</p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 md:mt-16">
              <BotCrmSync />
            </div>
          </Reveal>
        </Container>
      </Section>
      <Numbers />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}

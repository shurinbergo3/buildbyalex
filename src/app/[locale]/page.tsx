import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Hero } from "@/components/home/Hero";
import { PainPoints } from "@/components/home/PainPoints";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { TelegramChatMock } from "@/components/TelegramChatMock";
import { CRMFunnelMock } from "@/components/CRMFunnelMock";
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

  const tDemo = await getTranslations("home.botDemo");
  const tFunnel = await getTranslations("home.crmFunnel");

  return (
    <>
      <Hero />
      <PainPoints />
      <ServicesOverview />
      <FeaturedWork />
      <HowItWorks />
      <Section pad="default">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="t-eyebrow">{tDemo("eyebrow")}</p>
              <h2 className="mt-3 text-[clamp(28px,3vw+12px,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-[color:var(--color-text-1)]">
                {tDemo("headline")}
              </h2>
              <p className="mt-5 max-w-[480px] text-[17px] leading-[1.55] text-[color:var(--color-text-2)]">
                {tDemo("subhead")}
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <TelegramChatMock />
            </div>
          </div>
        </Container>
      </Section>
      <Section pad="default">
        <Container>
          <div className="mx-auto max-w-[720px] text-center">
            <p className="t-eyebrow">{tFunnel("eyebrow")}</p>
            <h2 className="mt-3 text-[clamp(28px,3vw+12px,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-[color:var(--color-text-1)]">
              {tFunnel("headline")}
            </h2>
            <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-[1.55] text-[color:var(--color-text-2)]">
              {tFunnel("subhead")}
            </p>
          </div>
          <div className="mt-12 md:mt-16">
            <CRMFunnelMock />
          </div>
        </Container>
      </Section>
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}

import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { PageSpeedMock } from "@/components/PageSpeedMock";
import { InstantLeadMock } from "@/components/InstantLeadMock";
import { GoogleSerpMock } from "@/components/GoogleSerpMock";

export function VisionairShowcase() {
  const t = useTranslations("work.caseShowcase.visionair");

  return (
    <>
      <Section pad="default" tone="alt">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-[720px] text-center">
              <p className="t-eyebrow">{t("serp.eyebrow")}</p>
              <h2 className="mt-3 text-[clamp(28px,3vw+12px,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-[color:var(--color-text-1)]">
                {t("serp.headline")}
              </h2>
              <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-[1.55] text-[color:var(--color-text-2)]">
                {t("serp.subhead")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 md:mt-16">
              <GoogleSerpMock namespace="work.caseShowcase.visionair.serp" />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section pad="default">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-[720px] text-center">
              <p className="t-eyebrow">{t("speed.eyebrow")}</p>
              <h2 className="mt-3 text-[clamp(28px,3vw+12px,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-[color:var(--color-text-1)]">
                {t("speed.headline")}
              </h2>
              <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-[1.55] text-[color:var(--color-text-2)]">
                {t("speed.subhead")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 md:mt-16">
              <PageSpeedMock />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section pad="default" tone="alt">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-[720px] text-center">
              <p className="t-eyebrow">{t("lead.eyebrow")}</p>
              <h2 className="mt-3 text-[clamp(28px,3vw+12px,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-[color:var(--color-text-1)]">
                {t("lead.headline")}
              </h2>
              <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-[1.55] text-[color:var(--color-text-2)]">
                {t("lead.subhead")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 md:mt-16">
              <InstantLeadMock />
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

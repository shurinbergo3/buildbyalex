import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { BotCrmSync } from "@/components/BotCrmSync";

export function CrmbotShowcase() {
  const t = useTranslations("work.caseShowcase.crmbot");

  return (
    <Section pad="default" tone="alt">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[720px] text-center">
            <p className="t-eyebrow">{t("botDemo.eyebrow")}</p>
            <h2 className="mt-3 text-[clamp(28px,3vw+12px,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-[color:var(--color-text-1)]">
              {t("botDemo.headline")}
            </h2>
            <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-[1.55] text-[color:var(--color-text-2)]">
              {t("funnel.subhead")}
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-12 md:mt-16">
            <BotCrmSync />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

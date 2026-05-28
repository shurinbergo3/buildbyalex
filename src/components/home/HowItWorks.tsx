import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { HowItWorksSteps } from "./HowItWorksSteps";

const steps = ["call", "proposal", "build", "launch"] as const;

export function HowItWorks() {
  const t = useTranslations("home.how");
  const items = steps.map((key) => ({
    n: t(`steps.${key}.n`),
    title: t(`steps.${key}.title`),
    body: t(`steps.${key}.body`),
  }));
  return (
    <Section tone="alt" pad="default">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <HowItWorksSteps items={items} />
        </Reveal>
      </Container>
    </Section>
  );
}

import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { BotCrmSync } from "./BotCrmSync";

/* AI service demo. Thin wrapper that gives BotCrmSync its own section copy so
   it matches the other self-contained service demos (ads / websites / mobile).
   Copy reuses the existing services.ai.demoEyebrow + home.botSync keys. */
export function AiSyncShowcase() {
  const t = useTranslations("services.ai");
  const tSync = useTranslations("home.botSync");

  return (
    <Section pad="default" tone="alt">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("demoEyebrow")}</p>
            <h2 className="mt-3 t-h2">
              {tSync("headline").split("\n").map((l, i) => (
                <span key={i} className="block">{l}</span>
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
  );
}

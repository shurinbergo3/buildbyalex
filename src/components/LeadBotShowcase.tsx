import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { LeadBotEmployeeCard } from "@/components/LeadBotEmployeeCard";
import { LeadBotChatMock } from "@/components/LeadBotChatMock";

export function LeadBotShowcase() {
  const t = useTranslations("work.caseShowcase.leadbot");

  return (
    <>
      <Section pad="default" tone="alt">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-[720px] text-center">
              <p className="t-eyebrow">{t("employee.eyebrow")}</p>
              <h2 className="mt-3 text-[clamp(28px,3vw+12px,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-[color:var(--color-text-1)]">
                {t("employee.headline")}
              </h2>
              <p className="mx-auto mt-5 max-w-[600px] text-[17px] leading-[1.55] text-[color:var(--color-text-2)]">
                {t("employee.subhead")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 md:mt-16">
              <LeadBotEmployeeCard />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section pad="default">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-[720px] text-center">
              <p className="t-eyebrow">{t("chat.eyebrow")}</p>
              <h2 className="mt-3 text-[clamp(28px,3vw+12px,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-[color:var(--color-text-1)]">
                {t("chat.headline")}
              </h2>
              <p className="mx-auto mt-5 max-w-[600px] text-[17px] leading-[1.55] text-[color:var(--color-text-2)]">
                {t("chat.subhead")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 md:mt-16">
              <LeadBotChatMock />
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

const steps = ["call", "proposal", "build", "launch"] as const;

export function HowItWorks() {
  const t = useTranslations("home.how");
  return (
    <Section tone="alt" pad="default">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
          </div>
        </Reveal>

        <ol className="mt-14 grid gap-x-6 gap-y-10 md:mt-20 md:grid-cols-4">
          {steps.map((key, i) => (
            <Reveal key={key} delay={i * 80} as="li">
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] tracking-[0.08em] text-[color:var(--color-text-3)]">
                    {t(`steps.${key}.n`)}
                  </span>
                  <span className="h-px flex-1 bg-[color:var(--c-hairline)]" />
                </div>
                <h3 className="t-h4">{t(`steps.${key}.title`)}</h3>
                <p className="text-[15px] leading-[1.55] text-[color:var(--color-text-2)]">
                  {t(`steps.${key}.body`)}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

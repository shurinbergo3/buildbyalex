import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { CtaGlassLayers } from "@/components/CtaGlass";

export function FinalCTA() {
  const t = useTranslations("home.finalCta");
  return (
    <Section tone="default" pad="loose">
      <Container size="md">
        <Reveal>
          <div className="cta-glass rounded-[36px] px-7 py-16 text-center text-white md:px-12 md:py-24">
            <CtaGlassLayers />
            <div className="relative z-10">
              <p className="text-[12px] tracking-[0.08em] uppercase text-white/60">
                {t("eyebrow")}
              </p>
              <h2 className="mt-4 text-[clamp(34px,5vw,56px)] font-semibold leading-[1.05] tracking-[-0.028em]">
                {t("headline")}
              </h2>
              <p className="mx-auto mt-5 max-w-[560px] text-[16.5px] leading-[1.55] text-white/70">
                {t("subhead")}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
                <Button href="/contact" size="lg">
                  {t("primaryCta")}
                </Button>
                <span className="inline-flex items-center gap-2 text-[14px] text-white/60">
                  {t("or")}
                  <a
                    href={`mailto:${t("email")}`}
                    className="text-white underline underline-offset-4 hover:text-[color:var(--c-accent)]"
                  >
                    {t("email")}
                  </a>
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

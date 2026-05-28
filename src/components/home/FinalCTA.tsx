import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";

export function FinalCTA() {
  const t = useTranslations("home.finalCta");
  return (
    <Section tone="default" pad="loose">
      <Container size="md">
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] bg-[#0A0A0A] px-7 py-16 text-center text-white md:px-12 md:py-24">
            <Image
              src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2200&q=85"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 960px"
              className="object-cover opacity-[0.45]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/35 via-[#0A0A0A]/65 to-[#0A0A0A]/95"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -top-1/3 left-1/2 h-[140%] w-[140%] -translate-x-1/2 opacity-70"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(255,107,26,0.45), transparent 70%)",
              }}
            />
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

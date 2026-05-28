import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

const items = ["one", "two", "three"] as const;

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M8 1.5l1.96 4.27 4.7.55-3.5 3.2.96 4.62L8 11.9l-4.12 2.24.96-4.62-3.5-3.2 4.7-.55L8 1.5z"
            fill="var(--c-accent)"
          />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  const t = useTranslations("home.testimonials");
  return (
    <Section tone="alt" pad="default">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-3">
          {items.map((key, i) => (
            <Reveal key={key} delay={i * 90}>
              <figure className="flex h-full flex-col rounded-[24px] bg-[color:var(--color-bg-elev)] p-7 md:p-8">
                <Stars />
                <blockquote className="mt-5 text-[16.5px] leading-[1.5] text-[color:var(--color-text)]">
                  “{t(`items.${key}.quote`)}”
                </blockquote>
                <figcaption className="mt-auto pt-7">
                  <p className="text-[14px] font-semibold tracking-[-0.011em]">
                    {t(`items.${key}.name`)}
                  </p>
                  <p className="text-[13px] text-[color:var(--color-text-3)]">
                    {t(`items.${key}.company`)}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

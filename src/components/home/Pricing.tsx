import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { PricingCard } from "@/components/home/PricingCard";
import { serviceHref, type ServiceKey } from "@/components/serviceGlyphs";

/* Bento pricing: the AI tier owns a 2×2 block, the five others fill the rest of
   the 3×3 grid. Every card links to its service page, so the block doubles as
   navigation instead of six identical CTAs shouting at once. */

const tiers: { key: string; service: ServiceKey; featured?: boolean; span?: string }[] = [
  { key: "ai", service: "ai", featured: true, span: "lg:col-span-2 lg:row-span-2 md:col-span-2" },
  { key: "site", service: "websites" },
  { key: "automation", service: "automation" },
  { key: "telegram", service: "telegram" },
  { key: "ads", service: "ads" },
  { key: "mobile", service: "mobile" },
];

export function Pricing() {
  const t = useTranslations("home.pricing");
  const headlineLines = t("headline").split("\n");

  return (
    <Section tone="default" pad="default">
      <Container>
        <Reveal>
          <div className="max-w-[680px]">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">
              {headlineLines.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h2>
            <p className="mt-5 t-body-lg">{t("subhead")}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid auto-rows-fr gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map(({ key, service, featured, span }, i) => (
            <Reveal key={key} delay={i * 70} className={`h-full ${span ?? ""}`}>
              <PricingCard
                title={t(`tiers.${key}.title`)}
                from={t(`tiers.${key}.from`)}
                price={t(`tiers.${key}.price`)}
                body={t(`tiers.${key}.body`)}
                examples={t(`tiers.${key}.examples`)}
                badge={featured ? t("badge") : undefined}
                href={serviceHref[service]}
                moreLabel={t("moreLabel")}
                featured={featured}
                priceDelay={i * 70 + 120}
              >
                {featured ? (
                  <Button href="/contact" variant="primary" size="md" className="w-full sm:w-auto">
                    {t("ctaLabel")} →
                  </Button>
                ) : undefined}
              </PricingCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280}>
          <p className="mt-9 max-w-[640px] text-[13.5px] leading-[1.5] text-[color:var(--color-text-3)]">
            {t("caption")}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

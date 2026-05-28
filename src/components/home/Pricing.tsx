import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";

const tiers = [
  { key: "site", featured: false },
  { key: "ai", featured: true },
  { key: "mobile", featured: false },
] as const;

export function Pricing() {
  const t = useTranslations("home.pricing");
  const headlineLines = t("headline").split("\n");

  return (
    <Section tone="default" pad="default">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">
              {headlineLines.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h2>
            <p className="mt-5 t-body-lg">{t("subhead")}</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-3">
          {tiers.map(({ key, featured }, i) => (
            <Reveal key={key} delay={i * 90}>
              <article
                className={[
                  "relative flex h-full flex-col rounded-[28px] p-7 md:p-8 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  featured
                    ? "bg-[#0A0A0A] text-white shadow-[var(--shadow-card)]"
                    : "bg-[color:var(--color-bg-alt)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]",
                ].join(" ")}
              >
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--c-accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
                    Most asked
                  </span>
                )}
                <h3 className={`text-[15px] font-semibold ${featured ? "text-white/70" : "text-[color:var(--color-text-2)]"}`}>
                  {t(`tiers.${key}.title`)}
                </h3>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className={`text-[12px] tracking-[0.04em] uppercase ${featured ? "text-white/50" : "text-[color:var(--color-text-3)]"}`}>
                    {t(`tiers.${key}.from`)}
                  </span>
                  <span className={`text-[clamp(36px,3.4vw,52px)] font-semibold tracking-[-0.03em] ${featured ? "text-white" : "text-[color:var(--color-text)]"}`}>
                    {t(`tiers.${key}.price`)}
                  </span>
                </div>

                <p className={`mt-5 text-[15.5px] leading-[1.55] ${featured ? "text-white/80" : "text-[color:var(--color-text-2)]"}`}>
                  {t(`tiers.${key}.body`)}
                </p>

                <p className={`mt-6 text-[12.5px] tracking-[0.02em] ${featured ? "text-white/50" : "text-[color:var(--color-text-3)]"}`}>
                  {t(`tiers.${key}.examples`)}
                </p>

                <div className="mt-auto pt-8">
                  <Button
                    href="/contact"
                    variant={featured ? "primary" : "ghost"}
                    size="md"
                    className="w-full"
                  >
                    {t(`tiers.${key}.title`)} →
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <p className="mx-auto mt-10 max-w-[640px] text-center text-[13.5px] leading-[1.5] text-[color:var(--color-text-3)]">
            {t("caption")}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

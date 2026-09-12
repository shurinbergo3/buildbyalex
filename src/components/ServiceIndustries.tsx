import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { SectionAtmosphere } from "./SectionAtmosphere";

/* Industry verticals for a service. Each card names the business type the way a
   client names it themselves and says what the service actually changes there. */

type Industry = { title: string; body: string };

export function ServiceIndustries({
  branch,
  tone = "alt",
}: {
  branch: "websites" | "store" | "mobile" | "ai" | "automation" | "telegram" | "ads";
  tone?: "default" | "alt";
}) {
  const t = useTranslations(`services.${branch}.industries`);
  if (!t.has("items")) return null;
  const items = t.raw("items") as Industry[];
  if (!items?.length) return null;

  return (
    <Section pad="default" tone={tone} className="isolate">
      <SectionAtmosphere variant="b" />
      <Container>
        <Reveal>
          <div className="max-w-[720px]">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
            <p className="mt-5 max-w-[620px] t-body-lg">{t("sub")}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-x-10 gap-y-8 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 60}>
              <div className="border-t border-[color:var(--c-hairline)] pt-5">
                <h3 className="text-[16px] font-semibold tracking-[-0.014em] md:text-[17px]">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-[1.55] text-[color:var(--color-text-2)]">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {t.has("note") && (
          <Reveal delay={120}>
            <p className="mt-10 max-w-[680px] text-[14px] leading-[1.6] text-[color:var(--color-text-3)]">
              {t("note")}
            </p>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

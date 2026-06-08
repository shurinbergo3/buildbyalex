import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { StoreSiteMock } from "./StoreSiteMock";

/* Online-store service demo. Replaces the generic website preview with a live,
   interactive storefront: browse the catalogue, fill the basket and place a
   courier-delivery order right inside the mock — desktop browser + phone. Copy
   lives under services.store.demo so the template drops it in as one node. */
export function StoreShowcase() {
  const t = useTranslations("services.store.demo");

  return (
    <Section pad="default" tone="alt">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">
              {t("headline").split("\n").map((l, i) => (
                <span key={i} className="block">{l}</span>
              ))}
            </h2>
            <p className="mx-auto mt-5 max-w-[620px] t-body-lg">{t("subhead")}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-12 md:mt-16">
            <StoreSiteMock />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { ResponsiveSiteMock } from "./ResponsiveSiteMock";
import { GoogleSerpMock } from "./GoogleSerpMock";
import { PageSpeedMock } from "./PageSpeedMock";

/* Websites service demo. Tells the "looks sharp → ranks → loads instantly"
   story with three proofs: a responsive branded site, a #1 Google result, and
   a 100/100 Lighthouse score. One alt-tone section so the service template
   drops it in as one node and the page rhythm stays clean. */
export function WebsiteShowcase() {
  const t = useTranslations("services.websites.demo");

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
            <p className="mx-auto mt-5 max-w-[600px] t-body-lg">{t("subhead")}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-12 md:mt-16">
            <ResponsiveSiteMock />
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-20 max-w-[640px] text-center md:mt-28">
            <p className="t-eyebrow">{t("serp.eyebrow")}</p>
            <p className="mx-auto mt-3 max-w-[520px] t-body-lg">{t("serp.caption")}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10 md:mt-12">
            <GoogleSerpMock namespace="services.websites.demo.serp" />
          </div>
        </Reveal>

        <Reveal>
          <div className="mx-auto mt-20 max-w-[640px] text-center md:mt-28">
            <p className="t-eyebrow">{t("speed.eyebrow")}</p>
            <p className="mx-auto mt-3 max-w-[520px] t-body-lg">{t("speed.caption")}</p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="mt-10 md:mt-12">
            <PageSpeedMock namespace="services.websites.demo.speed" />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

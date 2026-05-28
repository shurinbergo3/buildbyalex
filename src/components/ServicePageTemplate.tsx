import { useTranslations, useMessages } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { Button } from "./Button";
import { FAQAccordion, type QA } from "./FAQAccordion";

type Branch = "websites" | "ai" | "mobile";

type ServiceData = {
  eyebrow: string;
  headline: string;
  lead: string;
  from: string;
  primaryCta: string;
  what: { title: string; items: { title: string; body: string }[] };
  stack: { title: string; items: string[] };
  cases: string;
  faq: { title: string; items: QA[] };
};

type Shape = { services: Record<Branch, ServiceData> };

export function ServicePageTemplate({ branch }: { branch: Branch }) {
  const t = useTranslations(`services.${branch}`);
  const messages = useMessages() as unknown as Shape;
  const data: ServiceData = messages.services[branch];
  const headlineLines = t("headline").split("\n");

  return (
    <>
      <Section pad="tight" tone="default" className="!pt-16 md:!pt-24">
        <Container size="default">
          <Reveal>
            <div className="grid gap-12 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-7">
                <p className="t-eyebrow">{t("eyebrow")}</p>
                <h1 className="mt-4 text-[clamp(40px,5.5vw+8px,72px)] font-semibold leading-[1.06] tracking-[-0.032em]">
                  {headlineLines.map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </h1>
                <p className="mt-6 text-[clamp(17px,1.2vw+13px,22px)] leading-[1.5] tracking-[-0.013em] text-[color:var(--color-text-2)] max-w-[560px]">
                  {t("lead")}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button href="/contact" size="lg">{t("primaryCta")}</Button>
                  <span className="text-[15px] text-[color:var(--color-text-3)]">
                    {t("from")}
                  </span>
                </div>
              </div>
              <div className="md:col-span-5">
                <div className="rounded-[28px] bg-[color:var(--color-bg-alt)] p-7 md:p-9">
                  <h3 className="t-eyebrow">{t("stack.title")}</h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {data.stack.items.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] px-3 py-1.5 text-[12.5px] font-medium text-[color:var(--color-text-2)]"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section pad="default" tone="alt">
        <Container>
          <Reveal>
            <h2 className="t-h2 mb-12 md:mb-16">{t("what.title")}</h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 md:gap-x-12 md:gap-y-12">
            {data.what.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="border-t border-[color:var(--c-hairline)] pt-6">
                  <h3 className="t-h4">{item.title}</h3>
                  <p className="mt-3 text-[15.5px] leading-[1.55] text-[color:var(--color-text-2)]">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section pad="default" tone="default">
        <Container size="md">
          <Reveal>
            <h2 className="t-h2 mb-10 md:mb-12 text-center">{t("faq.title")}</h2>
          </Reveal>
          <FAQAccordion items={data.faq.items} />
        </Container>
      </Section>

      <Section pad="default" tone="default">
        <Container size="md">
          <Reveal>
            <div className="relative overflow-hidden rounded-[36px] bg-[#0A0A0A] px-8 py-14 text-center text-white md:px-12 md:py-20">
              <div
                className="pointer-events-none absolute -top-1/3 left-1/2 h-[120%] w-[120%] -translate-x-1/2 opacity-60"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(255,107,26,0.30), transparent 70%)",
                }}
              />
              <div className="relative z-10">
                <h2 className="text-[clamp(28px,3.6vw,42px)] font-semibold leading-[1.1] tracking-[-0.024em]">
                  {t("primaryCta")}
                </h2>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
                  <Button href="/contact" size="lg">
                    {t("primaryCta")}
                  </Button>
                  <a
                    href="mailto:alex@buildbyalex.com"
                    className="text-[14px] text-white/70 underline underline-offset-4 hover:text-white"
                  >
                    alex@buildbyalex.com
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { SectionAtmosphere } from "./SectionAtmosphere";

/* Risk-reversal block: the four contract guarantees, surfaced as cards
   instead of hiding inside the FAQ. Two-tone glyphs (soft fill + accent
   stroke) so they read premium and match the integrations set. */

type Guarantee = { title: string; body: string };

const icons = [
  // fixed quote — signed contract
  <svg key="quote" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3.5h14v17l-3.5-2-3.5 2-3.5-2L5 20.5z" fill="currentColor" fillOpacity="0.14" />
    <path d="M5 3.5h14v17l-3.5-2-3.5 2-3.5-2L5 20.5z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8.5 9h7M8.5 12.5h4.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  // deadline — calendar with check
  <svg key="deadline" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.6" fill="currentColor" fillOpacity="0.14" />
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8.8 14.7l2.1 2.1 4.1-4.3" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  // ownership — key
  <svg key="key" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8.5" cy="14.5" r="4.3" fill="currentColor" fillOpacity="0.14" />
    <circle cx="8.5" cy="14.5" r="4.3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11.6 11.4 20 3M15.4 7.6l2.6 2.6M17.7 5.3l2.6 2.6" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  // 30 days of fixes — wrench
  <svg key="wrench" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.8 6.2a4.5 4.5 0 0 0-6.1 5.9L3 17.8 6.2 21l5.7-5.7a4.5 4.5 0 0 0 5.9-6.1L14.3 12l-2.3-2.3z" fill="currentColor" fillOpacity="0.14" />
    <path d="M14.8 6.2a4.5 4.5 0 0 0-6.1 5.9L3 17.8 6.2 21l5.7-5.7a4.5 4.5 0 0 0 5.9-6.1L14.3 12l-2.3-2.3z" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
];

export function ServiceGuarantees({ branch }: { branch: "websites" | "store" | "mobile" | "ai" | "automation" | "telegram" | "ads" }) {
  const t = useTranslations(`services.${branch}.guarantees`);
  const items = t.raw("items") as Guarantee[];

  return (
    <Section pad="default" tone="default" className="isolate">
      <SectionAtmosphere variant="b" />
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
            <p className="mx-auto mt-5 max-w-[560px] t-body-lg">{t("sub")}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <article className="flex h-full flex-col rounded-[24px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] p-6 md:p-7">
                <span className="grid h-12 w-12 place-items-center rounded-[15px] bg-gradient-to-br from-[color:var(--c-accent-soft)] to-[color:var(--color-bg)] text-[color:var(--c-accent-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_16px_-10px_rgba(255,107,26,0.55)] ring-1 ring-inset ring-[color:var(--c-hairline)] dark:text-[color:var(--c-accent)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_16px_-10px_rgba(255,122,45,0.5)] [&_svg]:h-[24px] [&_svg]:w-[24px]">
                  {icons[i % icons.length]}
                </span>
                <h3 className="mt-5 t-h4">{item.title}</h3>
                <p className="mt-3 text-[14.5px] leading-[1.55] text-[color:var(--color-text-2)]">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

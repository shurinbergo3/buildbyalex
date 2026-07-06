import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/* Risk-reversal block: the four contract guarantees, surfaced as cards
   instead of hiding inside the FAQ. */

type Guarantee = { title: string; body: string };

const icons = [
  // fixed quote
  <svg key="quote" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4h14v16l-3.5-2-3.5 2-3.5-2L5 20V4z" />
    <path d="M9 9h6M9 13h4" />
  </svg>,
  // deadline
  <svg key="deadline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4M9 14.5l2.2 2.2 4-4.4" />
  </svg>,
  // ownership
  <svg key="key" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="14" r="4.5" />
    <path d="M11.5 10.5 20 2M15 7l3 3M17.5 4.5l3 3" />
  </svg>,
  // 30 days of fixes
  <svg key="wrench" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 6.5a4.5 4.5 0 0 0-6 6L3 18l3 3 5.5-5.5a4.5 4.5 0 0 0 6-6L14 13l-3-3 3.5-3.5z" />
  </svg>,
];

export function ServiceGuarantees({ branch }: { branch: "websites" | "store" }) {
  const t = useTranslations(`services.${branch}.guarantees`);
  const items = t.raw("items") as Guarantee[];

  return (
    <Section pad="default" tone="default">
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
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[color:var(--c-accent-soft)] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)] [&_svg]:h-[22px] [&_svg]:w-[22px]">
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

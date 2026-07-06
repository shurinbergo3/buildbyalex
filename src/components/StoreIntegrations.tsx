import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/* The integrations wall: payments, delivery, back office and marketing/legal
   plumbing a Polish store actually needs. Competitors skip this entirely —
   here it doubles as reassurance and as entity-rich copy for search. */

type Group = { title: string; body: string; items: string[] };

const icons = [
  // payments
  <svg key="pay" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
    <path d="M2.5 10h19M6 15h4" />
  </svg>,
  // delivery
  <svg key="ship" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 6.5h11v9h-11z" />
    <path d="M13.5 9.5H17l3.5 3.5v2.5h-7z" />
    <circle cx="6.5" cy="18" r="1.6" />
    <circle cx="17" cy="18" r="1.6" />
  </svg>,
  // back office
  <svg key="ops" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
  </svg>,
  // marketing & legal
  <svg key="mkt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l2.7 5.6 6.3.8-4.6 4.3 1.2 6.1-5.6-3.1-5.6 3.1 1.2-6.1L3 9.4l6.3-.8L12 3z" />
  </svg>,
];

export function StoreIntegrations() {
  const t = useTranslations("services.store.integrations");
  const groups = t.raw("groups") as Group[];

  return (
    <Section pad="default" tone="alt">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
            <p className="mx-auto mt-5 max-w-[620px] t-body-lg">{t("sub")}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
          {groups.map((group, i) => (
            <Reveal key={group.title} delay={i * 80}>
              <article className="flex h-full flex-col rounded-[24px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg)] p-6 md:p-7">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[color:var(--c-accent-soft)] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)] [&_svg]:h-5 [&_svg]:w-5">
                    {icons[i % icons.length]}
                  </span>
                  <h3 className="t-h4">{group.title}</h3>
                </div>
                <p className="mt-3 text-[14.5px] leading-[1.55] text-[color:var(--color-text-2)]">{group.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] px-3 py-1.5 text-[12.5px] font-medium text-[color:var(--color-text-2)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={320}>
          <p className="mx-auto mt-8 max-w-[560px] text-center text-[13.5px] leading-[1.5] text-[color:var(--color-text-3)]">
            {t("note")}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

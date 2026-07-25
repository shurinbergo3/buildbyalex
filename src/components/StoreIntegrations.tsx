import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { SectionAtmosphere } from "./SectionAtmosphere";

/* The integrations wall: payments, delivery, back office and marketing/legal
   plumbing a Polish store actually needs. Competitors skip this entirely —
   here it doubles as reassurance and as entity-rich copy for search. */

type Group = { title: string; body: string; items: string[] };

/* Bespoke two-tone glyphs: a soft amber fill grounds each mark, a crisp accent
   stroke draws it. Single currentColor so both layers follow the tile's theme
   token — no clash with the site's clean vector language. */
const icons = [
  // payments — card + contactless tap
  <svg key="pay" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="6" width="15" height="12" rx="2.6" fill="currentColor" fillOpacity="0.14" />
    <rect x="2.5" y="6" width="15" height="12" rx="2.6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2.5 10h15" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5.5 14.5h3.4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M19.4 9.7c1.4 1.6 1.4 4.9 0 6.6M21.4 8c2.1 2.5 2.1 7.5 0 10" stroke="currentColor" strokeWidth="1.4" />
  </svg>,
  // delivery — van in motion
  <svg key="ship" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 7.5a1.5 1.5 0 0 1 1.5-1.5H12a1.5 1.5 0 0 1 1.5 1.5V16H2z" fill="currentColor" fillOpacity="0.14" />
    <path d="M2 7.5a1.5 1.5 0 0 1 1.5-1.5H12a1.5 1.5 0 0 1 1.5 1.5V16H2z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13.5 9.5h3.1c.5 0 1 .23 1.3.63l2.3 3c.2.27.3.6.3.94V16h-7z" fill="currentColor" fillOpacity="0.14" />
    <path d="M13.5 9.5h3.1c.5 0 1 .23 1.3.63l2.3 3c.2.27.3.6.3.94V16h-7z" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="7" cy="18" r="1.9" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17" cy="18" r="1.9" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
  // back office — inventory cube with sync arrow
  <svg key="ops" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 3.4 18 7v7.5L11 18l-7-3.5V7z" fill="currentColor" fillOpacity="0.14" />
    <path d="M11 3.4 18 7v7.5L11 18l-7-3.5V7z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4 7l7 3.6L18 7M11 10.6V18" stroke="currentColor" strokeWidth="1.5" />
    <path d="M17.5 18.5a3.4 3.4 0 0 1-5.4.9M20 16.6a3.4 3.4 0 0 0-5.5.7" stroke="currentColor" strokeWidth="1.4" />
    <path d="M17.9 18.9v-1.7h-1.7M14.1 16.4v1.7h1.7" stroke="currentColor" strokeWidth="1.4" />
  </svg>,
  // marketing & legal — shield with growth line
  <svg key="mkt" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 19 5.4v5.7c0 4.3-2.9 7.3-7 8.9-4.1-1.6-7-4.6-7-8.9V5.4z" fill="currentColor" fillOpacity="0.14" />
    <path d="M12 3 19 5.4v5.7c0 4.3-2.9 7.3-7 8.9-4.1-1.6-7-4.6-7-8.9V5.4z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8.4 13.6 10.7 11l1.8 1.6 3.1-3.6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14.2 9h1.9v1.9" stroke="currentColor" strokeWidth="1.5" />
  </svg>,
];

export function StoreIntegrations() {
  const t = useTranslations("services.store.integrations");
  const groups = t.raw("groups") as Group[];

  return (
    <Section pad="default" tone="alt" className="isolate">
      <SectionAtmosphere variant="b" />
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
                <div className="flex items-center gap-3.5">
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-[15px] bg-gradient-to-br from-[color:var(--c-accent-soft)] to-[color:var(--color-bg-alt)] text-[color:var(--c-accent-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_16px_-10px_rgba(255,107,26,0.55)] ring-1 ring-inset ring-[color:var(--c-hairline)] dark:text-[color:var(--c-accent)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_6px_16px_-10px_rgba(255,122,45,0.5)] [&_svg]:h-[26px] [&_svg]:w-[26px]">
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

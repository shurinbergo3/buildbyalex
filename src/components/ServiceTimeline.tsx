import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/* Week-by-week launch plan for the websites service: a vertical rail with
   four milestones and an honest "your time" estimate per week. Ships HowTo
   structured data alongside. */

type Week = { n: string; title: string; body: string; time: string };

export function ServiceTimeline({ branch }: { branch: "websites" | "store" }) {
  const t = useTranslations(`services.${branch}.timeline`);
  const weeks = t.raw("weeks") as Week[];

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: t("headline"),
    description: t("sub"),
    step: weeks.map((w, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: w.title,
      text: w.body,
    })),
  };

  return (
    <Section pad="default" tone="alt">
      <Container size="md">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
        <Reveal>
          <div className="mx-auto max-w-[720px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
            <p className="mx-auto mt-5 max-w-[600px] t-body-lg">{t("sub")}</p>
          </div>
        </Reveal>

        <ol className="mx-auto mt-12 max-w-[720px] md:mt-14">
          {weeks.map((week, i) => (
            <Reveal as="li" key={week.n} delay={i * 90} className="relative pl-[64px] sm:pl-[76px]">
              {/* rail */}
              {i < weeks.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[21px] top-[46px] h-[calc(100%-52px)] w-px bg-gradient-to-b from-[color:var(--c-accent)]/50 to-[color:var(--c-hairline)] sm:left-[25px]"
                />
              )}
              <span className="absolute left-0 top-0 grid h-[42px] w-[42px] place-items-center rounded-2xl border border-[color:var(--c-accent)]/30 bg-[color:var(--c-accent-soft)] font-mono text-[14px] font-semibold text-[color:var(--c-accent-ink)] sm:h-[50px] sm:w-[50px] dark:text-[color:var(--c-accent)]">
                {week.n}
              </span>

              <div className={i < weeks.length - 1 ? "pb-10 md:pb-12" : undefined}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="t-h4">{week.title}</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--c-hairline)] px-2.5 py-1 text-[11.5px] font-medium text-[color:var(--color-text-3)]">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3.5 2.2" />
                    </svg>
                    {t("yourTime")}: {week.time}
                  </span>
                </div>
                <p className="mt-3 max-w-[560px] text-[15px] leading-[1.6] text-[color:var(--color-text-2)]">
                  {week.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

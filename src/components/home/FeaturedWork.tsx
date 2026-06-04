import { useTranslations, useMessages } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { CaseHighlights, type HighlightItem } from "@/components/home/CaseHighlights";
import { caseSlugs, caseKeyToSlug, caseImages, type CaseKey } from "@/lib/cases";

type CaseShape = {
  work: {
    cases: Record<
      CaseKey,
      {
        industry: string;
        title: string;
        tagline: string;
        results: string[];
        metric: { value: string; label: string };
      }
    >;
  };
};

export function FeaturedWork() {
  const t = useTranslations("home.work");
  const tReveal = useTranslations("home.caseReveal");
  const messages = useMessages() as unknown as CaseShape;

  const items: HighlightItem[] = caseSlugs.map((key) => {
    const c = messages.work.cases[key];
    return {
      key,
      slug: caseKeyToSlug[key],
      industry: c.industry,
      title: c.title,
      tagline: c.tagline,
      results: c.results,
      metricValue: c.metric.value,
      metricLabel: c.metric.label,
      image: caseImages[key],
    };
  });

  return (
    <Section tone="default" pad="default" id="work">
      <Container>
        <Reveal>
          <div className="max-w-[640px]">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
            <p className="mt-4 t-body-lg">{t("subhead")}</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <CaseHighlights items={items} ctaLabel={tReveal("cta")} />
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10 flex justify-center md:justify-start">
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] px-6 py-3 text-[15px] font-[number:var(--fw-semi)] text-[color:var(--color-text)] shadow-[var(--shadow-card)] transition-all duration-200 ease-[cubic-bezier(0.28,0.11,0.32,1)] hover:-translate-y-0.5 hover:border-[color:var(--c-accent)] hover:text-[color:var(--c-accent-ink)] hover:shadow-[var(--shadow-card-hover)] dark:hover:text-[color:var(--c-accent)]"
            >
              {t("featured.seeAll")}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="text-[color:var(--c-accent)] transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

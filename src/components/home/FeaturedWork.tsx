import { useTranslations, useMessages } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { WorkCarousel, type CarouselItem } from "@/components/home/WorkCarousel";
import { caseSlugs, caseKeyToSlug, type CaseKey } from "@/lib/cases";

type CaseShape = {
  work: {
    cases: Record<
      CaseKey,
      {
        industry: string;
        title: string;
        results: string[];
        metric: { value: string; label: string };
      }
    >;
  };
};

export function FeaturedWork() {
  const t = useTranslations("home.work");
  const messages = useMessages() as unknown as CaseShape;

  const items: CarouselItem[] = caseSlugs.map((key) => {
    const c = messages.work.cases[key];
    return {
      key,
      slug: caseKeyToSlug[key],
      industry: c.industry,
      title: c.title,
      results: c.results,
      metricValue: c.metric.value,
      metricLabel: c.metric.label,
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
          <WorkCarousel items={items} cta={t("cta")} />
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-8 text-center md:text-left">
            <Link
              href="/work"
              className="inline-flex items-center gap-1 text-[14px] font-medium text-[color:var(--color-text-2)] transition-colors duration-200 hover:text-[color:var(--c-accent-ink)] dark:hover:text-[color:var(--c-accent)]"
            >
              {t("featured.seeAll")}
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

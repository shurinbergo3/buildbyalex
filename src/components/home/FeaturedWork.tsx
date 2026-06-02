import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

type WorkItem = { key: "legalwin" | "visionair" | "crmbot"; slug: string };

const items: WorkItem[] = [
  { key: "legalwin", slug: "legalwin" },
  { key: "visionair", slug: "visionair" },
  { key: "crmbot", slug: "crm-bot" },
];

export function FeaturedWork() {
  const t = useTranslations("home.work");

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

        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.key} delay={i * 90}>
              <Link
                href={{ pathname: "/work/[slug]", params: { slug: item.slug } }}
                className="group flex h-full flex-col rounded-[20px] border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] p-7 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
              >
                <span className="inline-flex w-fit items-center gap-2 text-[12px] font-medium uppercase tracking-[0.04em] text-[color:var(--color-text-3)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]" aria-hidden="true" />
                  {t(`items.${item.key}.industry`)}
                </span>

                <h3 className="mt-4 t-h4 font-[number:var(--fw-semi)]">{t(`items.${item.key}.title`)}</h3>

                <ul className="mt-4 space-y-2 text-[14.5px] leading-[1.5] text-[color:var(--color-text-2)]">
                  <li className="flex gap-2.5">
                    <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--c-accent)]" />
                    {t(`items.${item.key}.result1`)}
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--c-accent)]" />
                    {t(`items.${item.key}.result2`)}
                  </li>
                </ul>

                <span className="mt-auto inline-flex items-center gap-1.5 pt-7 text-[14px] font-medium text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                  {t("cta")}
                  <svg width="15" height="15" viewBox="0 0 14 14" className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={280}>
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

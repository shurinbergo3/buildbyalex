import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/* Internal links to the locale's website-related blog cluster — helps the
   undecided reader and passes link equity to the money-adjacent articles. */

type ResourceItem = { slug: string; title: string };

export function WebsitesResources() {
  const t = useTranslations("services.websites.resources");
  const items = t.raw("items") as ResourceItem[];

  return (
    <Section pad="default" tone="default">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[720px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.slug} delay={i * 60}>
              <Link
                href={{ pathname: "/blog/[slug]", params: { slug: item.slug } }}
                className="group flex h-full items-start justify-between gap-4 rounded-[20px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] p-5 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] md:p-6"
              >
                <span className="text-[15px] font-medium leading-[1.4] tracking-[-0.01em] text-[color:var(--color-text)]">
                  {item.title}
                </span>
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[color:var(--c-hairline)] text-[color:var(--color-text-2)] transition-[transform,background-color,border-color,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:border-[color:var(--c-accent)] group-hover:bg-[color:var(--c-accent)] group-hover:text-white">
                  <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

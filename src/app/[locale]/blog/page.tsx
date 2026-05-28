import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { PageHeader } from "@/components/PageHeader";
import { FinalCTA } from "@/components/home/FinalCTA";
import { routing, type Locale } from "@/i18n/routing";
import { getAllPosts } from "@/lib/blog";
import { buildLocalizedMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog.meta" });
  return buildLocalizedMetadata({
    locale: locale as Locale,
    pathname: "/blog",
    title: t("title"),
    description: t("description"),
  });
}

function formatDate(date: string, locale: string) {
  const localeMap: Record<string, string> = { ua: "uk", ru: "ru", en: "en", pl: "pl" };
  return new Intl.DateTimeFormat(localeMap[locale] ?? locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = getAllPosts(locale as Locale);

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} headline={t("headline")} lead={t("subhead")} />

      <Section pad="default" tone="default">
        <Container size="md">
          {posts.length === 0 ? (
            <Reveal>
              <p className="text-center text-[17px] text-[color:var(--color-text-2)]">
                {t("noPosts")}
              </p>
            </Reveal>
          ) : (
            <ul className="divide-y divide-[color:var(--c-hairline)] border-y border-[color:var(--c-hairline)]">
              {posts.map((p, i) => (
                <li key={p.slug}>
                  <Reveal delay={i * 60}>
                    <Link
                      href={{ pathname: "/blog/[slug]", params: { slug: p.slug } }}
                      className="group flex flex-col gap-3 py-7 transition-colors md:flex-row md:items-baseline md:gap-10 md:py-9"
                    >
                      <time
                        dateTime={p.date}
                        className="shrink-0 font-mono text-[12.5px] tracking-[0.04em] text-[color:var(--color-text-3)] md:w-44"
                      >
                        {formatDate(p.date, locale)}
                      </time>
                      <div className="flex-1">
                        <h2 className="text-[clamp(20px,1.6vw+12px,26px)] font-semibold tracking-[-0.018em] leading-[1.25] transition-colors group-hover:text-[color:var(--c-accent-ink)] dark:group-hover:text-[color:var(--c-accent)]">
                          {p.title}
                        </h2>
                        <p className="mt-2 text-[15.5px] leading-[1.55] text-[color:var(--color-text-2)]">
                          {p.description}
                        </p>
                        <p className="mt-3 text-[12.5px] tracking-[0.02em] text-[color:var(--color-text-3)]">
                          {t("readingMinutes", { m: p.readingMinutes })}
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      <FinalCTA />
    </>
  );
}

import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { PageHeader } from "@/components/PageHeader";
import { FinalCTA } from "@/components/home/FinalCTA";
import { BlogList, type BlogListItem } from "@/components/blog/BlogList";
import { routing, type Locale } from "@/i18n/routing";
import { getAllPosts, getPostImage, clusterToService } from "@/lib/blog";
import { buildLocalizedMetadata } from "@/lib/metadata";

const CATEGORY_ORDER = ["websites", "store", "ai", "automation", "mobile", "ads", "telegram"] as const;

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
  const tServices = await getTranslations({ locale, namespace: "nav.servicesMenu" });
  const posts = getAllPosts(locale as Locale);

  const items: BlogListItem[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    dateLabel: formatDate(p.date, locale),
    dateTime: p.date,
    readingLabel: t("readingMinutes", { m: p.readingMinutes }),
    image: getPostImage(p.ogImage),
    category: clusterToService[p.cluster]?.menuKey ?? null,
  }));

  const present = new Set(items.map((i) => i.category).filter(Boolean));
  const categories = CATEGORY_ORDER.filter((k) => present.has(k)).map((k) => ({
    key: k,
    label: tServices(`${k}.title`),
  }));

  return (
    <>
      <PageHeader eyebrow={t("eyebrow")} headline={t("headline")} lead={t("subhead")} />

      <Section pad="default" tone="default">
        <Container size="md">
          {posts.length === 0 ? (
            <p className="text-center text-[17px] text-[color:var(--color-text-2)]">
              {t("noPosts")}
            </p>
          ) : (
            <BlogList
              posts={items}
              categories={categories}
              allLabel={t("filterAll")}
              filterLabel={t("filterLabel")}
            />
          )}
        </Container>
      </Section>

      <FinalCTA />
    </>
  );
}

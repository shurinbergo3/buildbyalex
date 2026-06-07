import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { CtaGlassLayers } from "@/components/CtaGlass";
import { routing, type Locale } from "@/i18n/routing";
import { getAllPostSlugs, getPost, getClusterSlugs } from "@/lib/blog";
import { SITE_URL, htmlLang } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllPostSlugs(locale).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(locale as Locale, slug);
  if (!post) return {};
  const url = `${SITE_URL}/${locale}/blog/${slug}`;

  // hreflang: link every translated variant of this article (same `cluster`).
  // Without this the 4 language versions look unrelated to Google.
  const cluster = getClusterSlugs(post.cluster);
  const languages: Record<string, string> = {};
  for (const [loc, locSlug] of Object.entries(cluster)) {
    languages[htmlLang(loc as Locale)] = `${SITE_URL}/${loc}/blog/${locSlug}`;
  }
  const defaultSlug = cluster[routing.defaultLocale as Locale];
  if (defaultSlug) {
    languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}/blog/${defaultSlug}`;
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(date: string, locale: string) {
  const localeMap: Record<string, string> = { ua: "uk", ru: "ru", en: "en", pl: "pl" };
  return new Intl.DateTimeFormat(localeMap[locale] ?? locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

const proseClasses = [
  "prose prose-lg max-w-none",
  "prose-headings:font-semibold prose-headings:tracking-[-0.022em] prose-headings:text-[color:var(--color-text)]",
  "prose-h2:mt-12 prose-h2:mb-5 prose-h2:text-[clamp(24px,2.2vw+10px,32px)]",
  "prose-h3:mt-9 prose-h3:mb-3 prose-h3:text-[clamp(20px,1.5vw+10px,24px)]",
  "prose-p:text-[color:var(--color-text)] prose-p:leading-[1.7] prose-p:tracking-[-0.011em]",
  "prose-li:text-[color:var(--color-text)] prose-li:leading-[1.6]",
  "prose-a:text-[color:var(--c-accent-ink)] dark:prose-a:text-[color:var(--c-accent)] prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4",
  "prose-strong:text-[color:var(--color-text)] prose-strong:font-semibold",
  "prose-blockquote:border-l-4 prose-blockquote:border-[color:var(--c-accent)] prose-blockquote:bg-[color:var(--color-bg-alt)] prose-blockquote:rounded-r-xl prose-blockquote:px-5 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-[color:var(--color-text-2)]",
  "prose-code:before:hidden prose-code:after:hidden prose-code:rounded prose-code:bg-[color:var(--color-bg-alt)] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:font-medium prose-code:text-[color:var(--c-accent-ink)] dark:prose-code:text-[color:var(--c-accent)]",
  "prose-hr:border-[color:var(--c-hairline)] prose-hr:my-12",
].join(" ");

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPost(locale as Locale, slug);
  if (!post) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: locale === "ua" ? "uk" : locale,
    author: {
      "@type": "Person",
      name: "Alex",
      url: "https://buildbyalex.com",
    },
    publisher: { "@type": "Organization", name: "buildbyalex" },
    keywords: post.keywords?.join(", "),
  };

  return (
    <>
      <Section pad="tight" className="!pt-12 md:!pt-20">
        <Container size="md">
          <Reveal>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[color:var(--color-text-2)] transition-colors hover:text-[color:var(--c-accent)]"
            >
              ← {t("backToBlog")}
            </Link>
            <h1 className="mt-6 text-[clamp(36px,4vw+12px,56px)] font-semibold leading-[1.08] tracking-[-0.03em]">
              {post.title}
            </h1>
            <p className="mt-6 text-[clamp(17px,1vw+13px,21px)] leading-[1.5] tracking-[-0.013em] text-[color:var(--color-text-2)]">
              {post.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] tracking-[0.02em] text-[color:var(--color-text-3)]">
              <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
              <span aria-hidden>·</span>
              <span>{t("readingMinutes", { m: post.readingMinutes })}</span>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section pad="default" className="!pt-4">
        <Container size="md">
          <article className={proseClasses}>
            <MDXRemote source={post.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
          </article>
        </Container>
      </Section>

      <Section pad="default" tone="default">
        <Container size="md">
          <Reveal>
            <div className="cta-glass rounded-[28px] px-7 py-12 text-center text-white md:px-10 md:py-16">
              <CtaGlassLayers />
              <div className="relative z-10">
                <h2 className="text-[clamp(24px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.024em]">
                  {t("ctaTitle")}
                </h2>
                <p className="mx-auto mt-4 max-w-[460px] text-[15.5px] leading-[1.55] text-white/70">
                  {t("ctaBody")}
                </p>
                <div className="mt-7 flex justify-center">
                  <Button href="/contact" size="lg">{t("cta")}</Button>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  );
}

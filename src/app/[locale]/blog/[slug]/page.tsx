import type { Metadata } from "next";
import Image from "next/image";
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
import {
  getAllPostSlugs,
  getPost,
  getClusterSlugs,
  getRelatedPosts,
  getRelatedService,
  getPostImage,
  extractFaq,
} from "@/lib/blog";
import { SITE_URL, htmlLang } from "@/lib/site";

// Re-render hourly so future-dated (queued) posts go live on their day without a redeploy.
export const revalidate = 3600;

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
  const image = getPostImage(post.ogImage);
  const ogImages = image
    ? [{ url: `${SITE_URL}${image}`, width: 1200, height: 630, alt: post.title }]
    : undefined;

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
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: image ? [`${SITE_URL}${image}`] : undefined,
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
  const tServices = await getTranslations({ locale, namespace: "nav.servicesMenu" });

  // Internal linking: same-topic articles + the money page this post feeds.
  // Tightens crawl paths for the blog tail and passes topical relevance.
  const related = getRelatedPosts(locale as Locale, slug, 3);
  const service = getRelatedService(post.cluster);
  const heroImage = getPostImage(post.ogImage);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: heroImage ? `${SITE_URL}${heroImage}` : undefined,
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

  // FAQPage rich-result schema, built from the post's `## FAQ` block (if any).
  const faq = extractFaq(post.content);
  const faqSchema =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: locale === "ua" ? "uk" : locale,
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

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

      {heroImage && (
        <Section pad="tight" className="!pt-8">
          <Container size="md">
            <Reveal>
              <div className="overflow-hidden rounded-[20px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)]">
                <Image
                  src={heroImage}
                  alt={post.title}
                  width={1200}
                  height={630}
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
          </Container>
        </Section>
      )}

      <Section pad="default" className="!pt-4">
        <Container size="md">
          <article className={proseClasses}>
            <MDXRemote source={post.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
          </article>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section pad="default" tone="alt">
          <Container size="md">
            <Reveal>
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h2 className="text-[clamp(22px,2vw+10px,30px)] font-semibold tracking-[-0.022em] text-[color:var(--color-text)]">
                  {t("relatedTitle")}
                </h2>
                {service && (
                  <Link
                    href={service.path}
                    className="shrink-0 text-[13.5px] font-medium text-[color:var(--c-accent-ink)] underline-offset-4 hover:underline dark:text-[color:var(--c-accent)]"
                  >
                    {t("relatedServiceLabel")}: {tServices(`${service.menuKey}.title`)} →
                  </Link>
                )}
              </div>
              <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => {
                  const img = getPostImage(p.ogImage);
                  return (
                  <li key={p.slug}>
                    <Link
                      href={{ pathname: "/blog/[slug]", params: { slug: p.slug } }}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg)] transition-colors hover:border-[color:var(--c-accent)]"
                    >
                      {img && (
                        <div className="overflow-hidden bg-[color:var(--color-bg-alt)]">
                          <Image
                            src={img}
                            alt={p.title}
                            width={1200}
                            height={630}
                            sizes="(max-width: 1024px) 100vw, 360px"
                            className="aspect-[1200/630] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="text-[16.5px] font-semibold leading-[1.3] tracking-[-0.014em] text-[color:var(--color-text)] transition-colors group-hover:text-[color:var(--c-accent)]">
                          {p.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-[13.5px] leading-[1.5] text-[color:var(--color-text-2)]">
                          {p.description}
                        </p>
                        <span className="mt-4 text-[12px] tracking-[0.02em] text-[color:var(--color-text-3)]">
                          {t("readingMinutes", { m: p.readingMinutes })}
                        </span>
                      </div>
                    </Link>
                  </li>
                  );
                })}
              </ul>
            </Reveal>
          </Container>
        </Section>
      )}

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
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}

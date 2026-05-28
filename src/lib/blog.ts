import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Locale } from "@/i18n/routing";

const CONTENT_ROOT = path.join(process.cwd(), "content", "blog");

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  keywords?: string[];
  ogImage?: string;
  /** Stable cross-locale identifier — shared across language variants */
  cluster: string;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  locale: Locale;
  readingMinutes: number;
};

export type Post = PostMeta & {
  content: string;
};

function readPostFile(locale: Locale, slug: string): Post | null {
  const file = path.join(CONTENT_ROOT, locale, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const source = fs.readFileSync(file, "utf8");
  const { data, content } = matter(source);
  const fm = data as PostFrontmatter;
  const rt = readingTime(content);
  return {
    ...fm,
    slug,
    locale,
    readingMinutes: Math.max(1, Math.round(rt.minutes)),
    content,
  };
}

export function getAllPostSlugs(locale: Locale): string[] {
  const dir = path.join(CONTENT_ROOT, locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllPosts(locale: Locale): PostMeta[] {
  return getAllPostSlugs(locale)
    .map((slug) => readPostFile(locale, slug))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content, ...meta }) => {
      void content;
      return meta;
    });
}

export function getPost(locale: Locale, slug: string): Post | null {
  return readPostFile(locale, slug);
}

/**
 * For a given post's `cluster`, return the slug for each locale where a
 * translation exists. Used to render hreflang and a language picker on /blog/[slug].
 */
export function getClusterSlugs(cluster: string): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  const locales: Locale[] = ["ru", "en", "pl", "ua"];
  for (const loc of locales) {
    for (const slug of getAllPostSlugs(loc)) {
      const post = readPostFile(loc, slug);
      if (post?.cluster === cluster) {
        out[loc] = slug;
        break;
      }
    }
  }
  return out;
}

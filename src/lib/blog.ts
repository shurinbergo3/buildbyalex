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

/** servicesMenu keys in messages (`nav.servicesMenu.<key>.title`). */
export type ServiceMenuKey = "websites" | "store" | "ai" | "automation" | "mobile" | "ads" | "telegram";

/** Canonical (non-localized) service pathnames — keys of `routing.pathnames`. */
export type ServicePath =
  | "/services/websites"
  | "/services/online-store"
  | "/services/ai-agents"
  | "/services/automation"
  | "/services/mobile-apps"
  | "/services/advertising"
  | "/services/telegram-bots";

/**
 * Maps a post's content `cluster` → the service it should funnel readers to.
 * Powers the contextual "related service" link on each article: passes topical
 * relevance to the money page and tightens internal linking so Google crawls
 * and indexes the blog tail (and surfaces the service from informational queries).
 */
export const clusterToService: Record<string, { menuKey: ServiceMenuKey; path: ServicePath }> = {
  "ai-agent-for-sales": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-chatbot-cost": { menuKey: "ai", path: "/services/ai-agents" },
  "how-to-implement-ai": { menuKey: "ai", path: "/services/ai-agents" },
  "what-is-ai-agent": { menuKey: "ai", path: "/services/ai-agents" },
  "automation-where-to-start": { menuKey: "automation", path: "/services/automation" },
  "crm-telegram-whatsapp-integration": { menuKey: "automation", path: "/services/automation" },
  "make-vs-n8n-vs-zapier": { menuKey: "automation", path: "/services/automation" },
  "google-ads-vs-meta-ads": { menuKey: "ads", path: "/services/advertising" },
  "mobile-app-cost": { menuKey: "mobile", path: "/services/mobile-apps" },
  "multilingual-site-poland": { menuKey: "websites", path: "/services/websites" },
  "nextjs-vs-wordpress": { menuKey: "websites", path: "/services/websites" },
  "website-cost-poland-2025": { menuKey: "websites", path: "/services/websites" },
  "online-store-cost-poland": { menuKey: "store", path: "/services/online-store" },
  "ecommerce-platform-choice": { menuKey: "store", path: "/services/online-store" },
};

/** The service a post links to, or null if its cluster isn't mapped. */
export function getRelatedService(cluster: string) {
  return clusterToService[cluster] ?? null;
}

/**
 * Related posts for an article: same service group first (a topical cluster
 * Google rewards), then the most-recent remaining posts, excluding the current
 * one. All same-locale so every link resolves.
 */
export function getRelatedPosts(locale: Locale, currentSlug: string, limit = 3): PostMeta[] {
  const current = readPostFile(locale, currentSlug);
  const others = getAllPosts(locale).filter((p) => p.slug !== currentSlug);
  const menuKey = current ? clusterToService[current.cluster]?.menuKey : undefined;
  const sameGroup = menuKey
    ? others.filter((p) => clusterToService[p.cluster]?.menuKey === menuKey)
    : [];
  const rest = others.filter((p) => !sameGroup.includes(p));
  return [...sameGroup, ...rest].slice(0, limit);
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

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

const PUBLIC_ROOT = path.join(process.cwd(), "public");

/**
 * Returns the post's `ogImage` path only if the file actually exists in
 * /public, otherwise null. Lets us wire the image into OG meta and an on-page
 * hero without rendering broken images for posts whose asset isn't in the repo.
 */
export function getPostImage(ogImage?: string): string | null {
  if (!ogImage) return null;
  const rel = ogImage.startsWith("/") ? ogImage.slice(1) : ogImage;
  return fs.existsSync(path.join(PUBLIC_ROOT, rel)) ? ogImage : null;
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
  // Geo-targeted service-intent articles (2026). Unique cluster per locale so each
  // page is self-canonical and ranks independently for its local keyword (no
  // cross-locale hreflang clustering) — but still funnels to its money page.
  "mobile-app-developer-warsaw-en": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mobile-app-developer-warsaw-pl": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mvp-app-development-startup-en": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mvp-app-development-startup-pl": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mvp-app-development-startup-ru": { menuKey: "mobile", path: "/services/mobile-apps" },
  "web-developer-warsaw-pl": { menuKey: "websites", path: "/services/websites" },
  "web-developer-warsaw-en": { menuKey: "websites", path: "/services/websites" },
  "website-for-clinic-pl": { menuKey: "websites", path: "/services/websites" },
  "website-for-clinic-ru": { menuKey: "websites", path: "/services/websites" },
  "online-store-development-warsaw-pl": { menuKey: "store", path: "/services/online-store" },
  "online-store-development-warsaw-ru": { menuKey: "store", path: "/services/online-store" },
  "online-store-development-warsaw-ua": { menuKey: "store", path: "/services/online-store" },
  "shopify-developer-poland-en": { menuKey: "store", path: "/services/online-store" },
  "shopify-developer-poland-pl": { menuKey: "store", path: "/services/online-store" },
  "ai-agent-real-estate-en": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-real-estate-pl": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-real-estate-ru": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-chatbot-ecommerce-pl": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-chatbot-ecommerce-ru": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-customer-support-en": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-customer-support-pl": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-customer-support-ru": { menuKey: "ai", path: "/services/ai-agents" },
  // Geo cluster — Wrocław / Kraków / Gdańsk (2026). Unique cluster per locale so
  // each ranks independently for its local keyword; still funnels to its money page.
  "web-developer-wroclaw-pl": { menuKey: "websites", path: "/services/websites" },
  "web-developer-wroclaw-en": { menuKey: "websites", path: "/services/websites" },
  "web-developer-wroclaw-ru": { menuKey: "websites", path: "/services/websites" },
  "web-developer-wroclaw-ua": { menuKey: "websites", path: "/services/websites" },
  "online-store-development-wroclaw-pl": { menuKey: "store", path: "/services/online-store" },
  "online-store-development-wroclaw-en": { menuKey: "store", path: "/services/online-store" },
  "online-store-development-wroclaw-ru": { menuKey: "store", path: "/services/online-store" },
  "online-store-development-wroclaw-ua": { menuKey: "store", path: "/services/online-store" },
  "web-developer-krakow-pl": { menuKey: "websites", path: "/services/websites" },
  "web-developer-krakow-en": { menuKey: "websites", path: "/services/websites" },
  "web-developer-krakow-ru": { menuKey: "websites", path: "/services/websites" },
  "web-developer-krakow-ua": { menuKey: "websites", path: "/services/websites" },
  "mobile-app-developer-krakow-pl": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mobile-app-developer-krakow-en": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mobile-app-developer-krakow-ru": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mobile-app-developer-krakow-ua": { menuKey: "mobile", path: "/services/mobile-apps" },
  "web-developer-gdansk-pl": { menuKey: "websites", path: "/services/websites" },
  "web-developer-gdansk-en": { menuKey: "websites", path: "/services/websites" },
  "web-developer-gdansk-ru": { menuKey: "websites", path: "/services/websites" },
  "web-developer-gdansk-ua": { menuKey: "websites", path: "/services/websites" },
  "ai-agent-gdansk-pl": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-gdansk-en": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-gdansk-ru": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-gdansk-ua": { menuKey: "ai", path: "/services/ai-agents" },
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
/**
 * Pull the `## FAQ` block out of a post body into question/answer pairs so the
 * page can emit FAQPage JSON-LD (rich results) without duplicating the text in
 * frontmatter. Convention: an `## FAQ` heading, then each Q&A as a `**bold
 * question**` line followed by its answer paragraph(s), ending at the next `##`
 * heading or `---` rule. Returns [] when the post has no FAQ.
 */
export function extractFaq(content: string): { question: string; answer: string }[] {
  const lines = content.split("\n");
  const start = lines.findIndex((l) => /^##\s+FAQ\b/i.test(l));
  if (start === -1) return [];

  const out: { question: string; answer: string }[] = [];
  let question: string | null = null;
  let answer: string[] = [];
  const stripMd = (s: string) =>
    s
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → text
      .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
      .replace(/`([^`]+)`/g, "$1") // inline code
      .trim();
  const flush = () => {
    if (question) out.push({ question: stripMd(question), answer: stripMd(answer.join(" ")) });
    question = null;
    answer = [];
  };

  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s/.test(line) || /^---\s*$/.test(line)) break;
    const q = line.match(/^\*\*(.+?)\*\*\s*$/);
    if (q) {
      flush();
      question = q[1];
      continue;
    }
    if (question && line.trim()) answer.push(line.trim());
  }
  flush();
  return out;
}

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

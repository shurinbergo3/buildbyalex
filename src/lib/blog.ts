import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Locale } from "@/i18n/routing";

const CONTENT_ROOT = path.join(process.cwd(), "content", "blog");

// Posts dated in the future stay hidden until their day — lets us queue a batch
// and have one go live per day. Evaluated at request time thanks to `revalidate`
// on the blog routes, so a scheduled post appears without a redeploy.
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

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

// Content is immutable at runtime in production, and the sitemap + per-post
// metadata re-read every file many times during a build — cache aggressively.
// Disabled in dev so new/edited posts show up without a server restart.
const CACHE_ENABLED = process.env.NODE_ENV === "production";
const postCache = new Map<string, Post | null>();
const slugsCache = new Map<Locale, string[]>();

function readPostFile(locale: Locale, slug: string): Post | null {
  const cacheKey = `${locale}/${slug}`;
  if (CACHE_ENABLED && postCache.has(cacheKey)) return postCache.get(cacheKey)!;
  const post = parsePostFile(locale, slug);
  if (CACHE_ENABLED) postCache.set(cacheKey, post);
  return post;
}

function parsePostFile(locale: Locale, slug: string): Post | null {
  const file = path.join(CONTENT_ROOT, locale, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const source = fs.readFileSync(file, "utf8");
  const { data, content } = matter(source);
  const fm = data as Omit<PostFrontmatter, "date"> & { date?: string | Date };
  // One malformed post must not poison metadata/sitemap output (undefined
  // titles in meta tags, Invalid Date in <lastmod>) — skip it loudly instead.
  if (!fm.title || !fm.description || !fm.date || !fm.cluster) {
    console.warn(`[blog] ${locale}/${slug}.mdx: missing required frontmatter — post skipped`);
    return null;
  }
  // An unquoted YAML date parses as a Date object — normalize to "YYYY-MM-DD".
  const date = fm.date instanceof Date ? fm.date.toISOString().slice(0, 10) : String(fm.date);
  const rt = readingTime(content);
  return {
    ...fm,
    date,
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
  if (CACHE_ENABLED) {
    const cached = slugsCache.get(locale);
    if (cached) return cached;
  }
  const dir = path.join(CONTENT_ROOT, locale);
  const slugs = !fs.existsSync(dir)
    ? []
    : fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => f.replace(/\.mdx$/, ""));
  if (CACHE_ENABLED) slugsCache.set(locale, slugs);
  return slugs;
}

export function getAllPosts(locale: Locale): PostMeta[] {
  const today = todayISO();
  return getAllPostSlugs(locale)
    .map((slug) => readPostFile(locale, slug))
    .filter((p): p is Post => p !== null && p.date <= today)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content, ...meta }) => {
      void content;
      return meta;
    });
}

export function getPost(locale: Locale, slug: string): Post | null {
  const post = readPostFile(locale, slug);
  if (!post || post.date > todayISO()) return null;
  return post;
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
  // Geo clusters (city x service). One shared base cluster across locales so
  // en/pl/ru/ua translations are hreflang-linked; still funnels to its money page.
  "ai-agent-gdansk": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-poznan": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-lublin": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-real-estate": { menuKey: "ai", path: "/services/ai-agents" },
  "auto-rzeszow": { menuKey: "automation", path: "/services/automation" },
  "web-katowice": { menuKey: "websites", path: "/services/websites" },
  "web-poznan": { menuKey: "websites", path: "/services/websites" },
  "web-developer-gdansk": { menuKey: "websites", path: "/services/websites" },
  "web-developer-krakow": { menuKey: "websites", path: "/services/websites" },
  "web-developer-warsaw": { menuKey: "websites", path: "/services/websites" },
  "web-developer-wroclaw": { menuKey: "websites", path: "/services/websites" },
  "website-for-clinic": { menuKey: "websites", path: "/services/websites" },
  "mobile-app-developer-warsaw": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mobile-app-developer-krakow": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mobile-szczecin": { menuKey: "mobile", path: "/services/mobile-apps" },
  "online-store-development-krakow": { menuKey: "store", path: "/services/online-store" },
  "online-store-development-warsaw": { menuKey: "store", path: "/services/online-store" },
  "online-store-development-wroclaw": { menuKey: "store", path: "/services/online-store" },
  "store-lodz": { menuKey: "store", path: "/services/online-store" },
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
  "mvp-app-development-startup-en": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mvp-app-development-startup-pl": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mvp-app-development-startup-ru": { menuKey: "mobile", path: "/services/mobile-apps" },
  "shopify-developer-poland-en": { menuKey: "store", path: "/services/online-store" },
  "shopify-developer-poland-pl": { menuKey: "store", path: "/services/online-store" },
  "ai-chatbot-ecommerce-pl": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-chatbot-ecommerce-ru": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-customer-support-en": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-customer-support-pl": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-customer-support-ru": { menuKey: "ai", path: "/services/ai-agents" },
  // Geo cluster — Wrocław / Kraków / Gdańsk (2026). Unique cluster per locale so
  // each ranks independently for its local keyword; still funnels to its money page.
  // 2026 content batch. Informational topics use a single shared cluster across
  // locales (en/pl/ru/ua are translations → hreflang-linked). Geo-intent topics
  // keep a unique cluster per locale (independent ranking, no cross-locale
  // hreflang) — matching the geo convention above.
  "order-website": { menuKey: "websites", path: "/services/websites" },
  "website-maintenance": { menuKey: "websites", path: "/services/websites" },
  "landing-page-cost": { menuKey: "websites", path: "/services/websites" },
  "corporate-website": { menuKey: "websites", path: "/services/websites" },
  "ios-app-development": { menuKey: "mobile", path: "/services/mobile-apps" },
  "native-vs-crossplatform": { menuKey: "mobile", path: "/services/mobile-apps" },
  "publish-app-store": { menuKey: "mobile", path: "/services/mobile-apps" },
  "how-to-open-store-poland": { menuKey: "store", path: "/services/online-store" },
  "shopify-store": { menuKey: "store", path: "/services/online-store" },
  "ai-agent-crm-integration": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-booking": { menuKey: "ai", path: "/services/ai-agents" },
  "voice-ai-agent": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-chatbot-knowledge-base": { menuKey: "ai", path: "/services/ai-agents" },
  // Geo-intent (per-locale clusters). Warsaw web/mobile already have en/pl above.
  // 2026 SEO/GEO content batch (PL+RU). Informational topics share one cluster
  // across locales (hreflang-linked translations). Pricing hub + spokes, Telegram
  // cluster, contractor-choice cluster, plus AI/automation/mobile spokes.
  "it-project-cost-2026": { menuKey: "websites", path: "/services/websites" },
  "telegram-bot-cost": { menuKey: "telegram", path: "/services/telegram-bots" },
  "automation-cost-n8n": { menuKey: "automation", path: "/services/automation" },
  "freelancer-vs-agency": { menuKey: "websites", path: "/services/websites" },
  "telegram-bot-use-cases": { menuKey: "telegram", path: "/services/telegram-bots" },
  "telegram-bot-orders-payments": { menuKey: "telegram", path: "/services/telegram-bots" },
  "telegram-crm-notifications": { menuKey: "telegram", path: "/services/telegram-bots" },
  "telegram-bot-vs-website-chat": { menuKey: "telegram", path: "/services/telegram-bots" },
  "how-to-choose-web-developer": { menuKey: "websites", path: "/services/websites" },
  "website-brief-checklist": { menuKey: "websites", path: "/services/websites" },
  "red-flags-ordering-website": { menuKey: "websites", path: "/services/websites" },
  "website-timeline-stages": { menuKey: "websites", path: "/services/websites" },
  "ai-funding-poland": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-chatbot-roi": { menuKey: "ai", path: "/services/ai-agents" },
  "chatbot-website-implementation": { menuKey: "ai", path: "/services/ai-agents" },
  "what-to-automate-first": { menuKey: "automation", path: "/services/automation" },
  "mobile-app-vs-pwa": { menuKey: "mobile", path: "/services/mobile-apps" },
  "how-long-to-build-app": { menuKey: "mobile", path: "/services/mobile-apps" },
  // 2026-06 geo content batch (15 cities x 4 locales). Per-locale cluster -> independent ranking.
  "store-gdynia-pl": { menuKey: "store", path: "/services/online-store" },
  "store-gdynia-en": { menuKey: "store", path: "/services/online-store" },
  "store-gdynia-ru": { menuKey: "store", path: "/services/online-store" },
  "store-gdynia-ua": { menuKey: "store", path: "/services/online-store" },
  "mobile-bialystok-pl": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mobile-bialystok-en": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mobile-bialystok-ru": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mobile-bialystok-ua": { menuKey: "mobile", path: "/services/mobile-apps" },
  "web-bydgoszcz-pl": { menuKey: "websites", path: "/services/websites" },
  "web-bydgoszcz-en": { menuKey: "websites", path: "/services/websites" },
  "web-bydgoszcz-ru": { menuKey: "websites", path: "/services/websites" },
  "web-bydgoszcz-ua": { menuKey: "websites", path: "/services/websites" },
  "tg-torun-pl": { menuKey: "telegram", path: "/services/telegram-bots" },
  "tg-torun-en": { menuKey: "telegram", path: "/services/telegram-bots" },
  "tg-torun-ru": { menuKey: "telegram", path: "/services/telegram-bots" },
  "tg-torun-ua": { menuKey: "telegram", path: "/services/telegram-bots" },
  "ai-poznan-pl": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-poznan-en": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-poznan-ru": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-poznan-ua": { menuKey: "ai", path: "/services/ai-agents" },
  "store-szczecin-pl": { menuKey: "store", path: "/services/online-store" },
  "store-szczecin-en": { menuKey: "store", path: "/services/online-store" },
  "store-szczecin-ru": { menuKey: "store", path: "/services/online-store" },
  "store-szczecin-ua": { menuKey: "store", path: "/services/online-store" },
  "web-czestochowa-pl": { menuKey: "websites", path: "/services/websites" },
  "web-czestochowa-en": { menuKey: "websites", path: "/services/websites" },
  "web-czestochowa-ru": { menuKey: "websites", path: "/services/websites" },
  "web-czestochowa-ua": { menuKey: "websites", path: "/services/websites" },
  "auto-lodz-pl": { menuKey: "automation", path: "/services/automation" },
  "auto-lodz-en": { menuKey: "automation", path: "/services/automation" },
  "auto-lodz-ru": { menuKey: "automation", path: "/services/automation" },
  "auto-lodz-ua": { menuKey: "automation", path: "/services/automation" },
  "mobile-lublin-pl": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mobile-lublin-en": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mobile-lublin-ru": { menuKey: "mobile", path: "/services/mobile-apps" },
  "mobile-lublin-ua": { menuKey: "mobile", path: "/services/mobile-apps" },
  // 2026-06 pain-point batch (25 topics x 4 locales). Per-locale cluster
  // (`<slug>-<locale>`) → independent ranking, no cross-locale hreflang. Only
  // the base slug is registered here; the resolver strips the locale suffix.
  "dental-clinic-get-patients-poland": { menuKey: "websites", path: "/services/websites" },
  "beauty-salon-clients-without-booksy": { menuKey: "websites", path: "/services/websites" },
  "construction-company-get-clients-online": { menuKey: "websites", path: "/services/websites" },
  "law-accounting-firm-clients-online": { menuKey: "websites", path: "/services/websites" },
  "auto-repair-shop-local-clients": { menuKey: "websites", path: "/services/websites" },
  "fitness-club-attract-retain-clients": { menuKey: "websites", path: "/services/websites" },
  "why-website-gets-no-leads": { menuKey: "websites", path: "/services/websites" },
  "website-builder-vs-developer": { menuKey: "websites", path: "/services/websites" },
  "landing-page-vs-website": { menuKey: "websites", path: "/services/websites" },
  "do-i-need-website-with-instagram": { menuKey: "websites", path: "/services/websites" },
  "slow-website-core-web-vitals": { menuKey: "websites", path: "/services/websites" },
  "ksef-2026-online-store": { menuKey: "store", path: "/services/online-store" },
  "allegro-vs-own-store": { menuKey: "store", path: "/services/online-store" },
  "migrate-from-shoper-to-woocommerce": { menuKey: "store", path: "/services/online-store" },
  "payment-gateway-poland-blik-przelewy24": { menuKey: "store", path: "/services/online-store" },
  "inpost-paczkomaty-integration": { menuKey: "store", path: "/services/online-store" },
  "recover-abandoned-carts-automation": { menuKey: "automation", path: "/services/automation" },
  "appointment-reminders-no-show": { menuKey: "automation", path: "/services/automation" },
  "ai-intercept-missed-calls": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-lead-qualification": { menuKey: "ai", path: "/services/ai-agents" },
  "reduce-support-costs-ai": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-assistant-telegram": { menuKey: "telegram", path: "/services/telegram-bots" },
  "restaurant-online-ordering-no-commission": { menuKey: "mobile", path: "/services/mobile-apps" },
  "does-business-need-mobile-app": { menuKey: "mobile", path: "/services/mobile-apps" },
  "loyalty-app-cafe-salon": { menuKey: "mobile", path: "/services/mobile-apps" },
  // 2026-07 acquisition/growth batch (18 topics x 4 locales). Informational —
  // shared cluster across locales (hreflang translations, self-canonical). Heavy
  // on the thin "ads" money page + SEO/local/CRM/automation gaps.
  "google-ads-cost": { menuKey: "ads", path: "/services/advertising" },
  "meta-ads-small-business": { menuKey: "ads", path: "/services/advertising" },
  "get-clients-from-internet": { menuKey: "ads", path: "/services/advertising" },
  "landing-page-for-ads": { menuKey: "ads", path: "/services/advertising" },
  "remarketing-retargeting": { menuKey: "ads", path: "/services/advertising" },
  "conversion-tracking-ga4": { menuKey: "ads", path: "/services/advertising" },
  "seo-website-cost": { menuKey: "websites", path: "/services/websites" },
  "google-business-profile-local": { menuKey: "websites", path: "/services/websites" },
  "website-redesign": { menuKey: "websites", path: "/services/websites" },
  "website-security-gdpr": { menuKey: "websites", path: "/services/websites" },
  "online-booking-system": { menuKey: "automation", path: "/services/automation" },
  "crm-for-small-business": { menuKey: "automation", path: "/services/automation" },
  "order-invoicing-automation": { menuKey: "automation", path: "/services/automation" },
  "email-marketing-automation": { menuKey: "automation", path: "/services/automation" },
  "increase-online-store-sales": { menuKey: "store", path: "/services/online-store" },
  "b2b-online-store": { menuKey: "store", path: "/services/online-store" },
  "whatsapp-chatbot-business": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-content-generation": { menuKey: "ai", path: "/services/ai-agents" },
  // 2026-07 selling geo batch (5 dev services x Poland, RU+EN). Per-locale cluster
  // (`<base>-<locale>`) -> independent ranking, no cross-locale hreflang. Only the
  // base slug is registered; the resolver strips the trailing locale suffix.
  "landing-page-development-poland": { menuKey: "websites", path: "/services/websites" },
  "saas-development-poland": { menuKey: "websites", path: "/services/websites" },
  "website-development-poland": { menuKey: "websites", path: "/services/websites" },
  "ecommerce-development-poland": { menuKey: "store", path: "/services/online-store" },
  "mobile-app-development-poland": { menuKey: "mobile", path: "/services/mobile-apps" },
  // 2026-08 AI-search / compliance / vertical batch (25 topics x 4 locales). Informational
  // topics -> one shared cluster across locales (hreflang-linked translations). Five go live
  // immediately, the rest are future-dated and surface one every other day.
  "geo-ai-search-optimization": { menuKey: "websites", path: "/services/websites" },
  "zero-click-search-traffic": { menuKey: "websites", path: "/services/websites" },
  "llms-txt-ai-crawlers": { menuKey: "websites", path: "/services/websites" },
  "schema-markup-2026": { menuKey: "websites", path: "/services/websites" },
  "brand-in-llm-answers": { menuKey: "websites", path: "/services/websites" },
  "ai-generated-website-problems": { menuKey: "websites", path: "/services/websites" },
  "cookie-consent-mode-2026": { menuKey: "websites", path: "/services/websites" },
  "new-website-first-90-days": { menuKey: "websites", path: "/services/websites" },
  "multi-city-local-seo": { menuKey: "websites", path: "/services/websites" },
  "b2b-manufacturer-website": { menuKey: "websites", path: "/services/websites" },
  "agentic-commerce-ai-shopping": { menuKey: "store", path: "/services/online-store" },
  "wcag-eaa-accessibility": { menuKey: "store", path: "/services/online-store" },
  "ecommerce-seo-checklist": { menuKey: "store", path: "/services/online-store" },
  "product-page-conversion": { menuKey: "store", path: "/services/online-store" },
  "cross-border-ecommerce-eu": { menuKey: "store", path: "/services/online-store" },
  "ai-act-chatbot-compliance": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-vs-manager-math": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-chatbot-data-gdpr": { menuKey: "ai", path: "/services/ai-agents" },
  "chatbot-human-handover": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-chatbot-no-leads": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-hotel-apartments": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-logistics": { menuKey: "ai", path: "/services/ai-agents" },
  "ai-agent-education": { menuKey: "ai", path: "/services/ai-agents" },
  "mcp-ai-agent-integrations": { menuKey: "automation", path: "/services/automation" },
  "recruiting-automation-ai": { menuKey: "automation", path: "/services/automation" },
};

/** Resolve a cluster to its service, stripping a trailing locale suffix
 * (`-en|-pl|-ru|-ua`) when the full cluster isn't registered directly. */
function lookupCluster(cluster: string) {
  return clusterToService[cluster] ?? clusterToService[cluster.replace(/-(en|pl|ru|ua)$/, "")];
}

/** The service a post links to, or null if its cluster isn't mapped. */
export function getRelatedService(cluster: string) {
  return lookupCluster(cluster) ?? null;
}

/**
 * Related posts for an article: same service group first (a topical cluster
 * Google rewards), then the most-recent remaining posts, excluding the current
 * one. All same-locale so every link resolves.
 */
export function getRelatedPosts(locale: Locale, currentSlug: string, limit = 3): PostMeta[] {
  const current = readPostFile(locale, currentSlug);
  const others = getAllPosts(locale).filter((p) => p.slug !== currentSlug);
  const menuKey = current ? lookupCluster(current.cluster)?.menuKey : undefined;
  const sameGroup = menuKey
    ? others.filter((p) => lookupCluster(p.cluster)?.menuKey === menuKey)
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

// Drop a trailing locale suffix so the per-locale geo/pain clusters
// (`web-bydgoszcz-pl` … `-en/-ru/-ua`) collapse to one logical article. Those
// keep a unique cluster on purpose — each ranks independently, no cross-locale
// hreflang — but for the language switcher they're still the same article.
function baseCluster(cluster: string): string {
  return cluster.replace(/-(en|pl|ru|ua)$/, "");
}

/**
 * Slug of the same article in every locale that has a *live* translation,
 * matched on the base cluster. Unlike getClusterSlugs (hreflang — exact cluster
 * only) this also links geo/pain posts whose cluster is unique per locale, so
 * switching language never lands on a slug from another language (which 404s).
 */
export function getLocaleSlugMap(cluster: string): Partial<Record<Locale, string>> {
  const base = baseCluster(cluster);
  const today = todayISO();
  const out: Partial<Record<Locale, string>> = {};
  const locales: Locale[] = ["ru", "en", "pl", "ua"];
  for (const loc of locales) {
    for (const slug of getAllPostSlugs(loc)) {
      const post = readPostFile(loc, slug);
      if (post && post.date <= today && baseCluster(post.cluster) === base) {
        out[loc] = slug;
        break;
      }
    }
  }
  return out;
}

/**
 * A slug requested under `wantLocale` where no such post exists there: find the
 * article that owns the slug in another language and return the right slug for
 * `wantLocale` (via the base cluster). null → the slug isn't ours, or that
 * language has no translation. Lets the blog route 301 the old wrong-locale
 * URLs (left over from the pre-fix language switcher) onto the correct article.
 */
export function resolveLocalizedSlug(wantLocale: Locale, slug: string): string | null {
  const locales: Locale[] = ["ru", "en", "pl", "ua"];
  for (const loc of locales) {
    if (loc === wantLocale) continue;
    const owner = readPostFile(loc, slug);
    if (!owner) continue;
    return getLocaleSlugMap(owner.cluster)[wantLocale] ?? null;
  }
  return null;
}

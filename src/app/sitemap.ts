import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import {
  SITE_URL,
  localizedHref,
  localizedDynamicHref,
  dynamicLanguageAlternates,
  localeSegment,
  htmlLang,
} from "@/lib/site";
import { getAllPostSlugs, getPost, getClusterSlugs } from "@/lib/blog";
import { caseKeyToSlug, caseSlugs, type CaseKey } from "@/lib/cases";

// Re-render hourly so the map drops/adds queued posts as they go live by date.
export const revalidate = 3600;

const staticPaths: (keyof typeof routing.pathnames)[] = [
  "/",
  "/services",
  "/services/websites",
  "/services/online-store",
  "/services/ai-agents",
  "/services/automation",
  "/services/mobile-apps",
  "/services/telegram-bots",
  "/services/advertising",
  "/work",
  "/blog",
  "/contact",
];

// All published case studies — derived from the single source of truth in
// cases.ts so new cases appear in the sitemap automatically.
const caseKeys: CaseKey[] = caseSlugs;

// Stable "last meaningful update" for static pages. Using `new Date()` here
// would stamp every page as "changed" on every deploy — Google learns such
// lastmod is noise and stops trusting it. Bump this date only when the static
// pages' content actually changes. (Blog posts carry their own real date.)
const STATIC_LAST_MODIFIED = new Date("2026-06-08");

function buildAlternates(pathname: keyof typeof routing.pathnames) {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[htmlLang(loc as Locale)] = localizedHref(loc as Locale, pathname);
  }
  // Mirror the on-page metadata (buildLocalizedMetadata), which includes
  // x-default → default locale. Identical hreflang sets keep the cluster strong.
  languages["x-default"] = localizedHref(routing.defaultLocale as Locale, pathname);
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];

  // Static pages
  for (const path of staticPaths) {
    for (const loc of routing.locales) {
      out.push({
        url: localizedHref(loc as Locale, path),
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: "monthly",
        priority: path === "/" ? 1 : 0.7,
        alternates: { languages: buildAlternates(path) },
      });
    }
  }

  // Case studies — slug is shared across locales, only the /work prefix is
  // localized. Each entry carries hreflang alternates for all four languages.
  for (const key of caseKeys) {
    const slug = caseKeyToSlug[key];
    const languages = dynamicLanguageAlternates("/work/[slug]", () => slug);
    for (const loc of routing.locales) {
      out.push({
        url: localizedDynamicHref(loc as Locale, "/work/[slug]", slug),
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  // Blog posts (per locale, only where the post exists). hreflang links every
  // translated variant of the same cluster — mirroring the on-page metadata
  // exactly (self-reference + x-default included), since mismatched sets
  // weaken the hreflang cluster signal.
  for (const loc of routing.locales) {
    for (const slug of getAllPostSlugs(loc as Locale)) {
      const post = getPost(loc as Locale, slug);
      if (!post) continue; // future-dated (queued) or malformed — keep it out of the map
      const cluster = getClusterSlugs(post.cluster);
      const languages: Record<string, string> = {};
      for (const [clLoc, clSlug] of Object.entries(cluster)) {
        languages[htmlLang(clLoc as Locale)] = `${SITE_URL}${localeSegment(clLoc as Locale)}/blog/${clSlug}`;
      }
      const defaultSlug = cluster[routing.defaultLocale as Locale];
      if (defaultSlug) {
        languages["x-default"] = `${SITE_URL}${localeSegment(routing.defaultLocale as Locale)}/blog/${defaultSlug}`;
      }
      out.push({
        url: `${SITE_URL}${localeSegment(loc as Locale)}/blog/${slug}`,
        lastModified: post ? new Date(post.date) : STATIC_LAST_MODIFIED,
        changeFrequency: "monthly",
        priority: 0.5,
        ...(Object.keys(languages).length > 0 ? { alternates: { languages } } : {}),
      });
    }
  }

  return out;
}

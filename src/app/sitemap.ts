import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import {
  SITE_URL,
  localizedHref,
  localizedDynamicHref,
  dynamicLanguageAlternates,
  htmlLang,
} from "@/lib/site";
import { getAllPostSlugs, getPost, getClusterSlugs } from "@/lib/blog";
import { caseKeyToSlug, caseSlugs, type CaseKey } from "@/lib/cases";

const staticPaths: (keyof typeof routing.pathnames)[] = [
  "/",
  "/services",
  "/services/websites",
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

function buildAlternates(pathname: keyof typeof routing.pathnames) {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[htmlLang(loc as Locale)] = localizedHref(loc as Locale, pathname);
  }
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const out: MetadataRoute.Sitemap = [];

  // Static pages
  for (const path of staticPaths) {
    for (const loc of routing.locales) {
      out.push({
        url: localizedHref(loc as Locale, path),
        lastModified: now,
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
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  // Blog posts (per locale, only where the post exists). hreflang links every
  // translated variant of the same cluster.
  for (const loc of routing.locales) {
    for (const slug of getAllPostSlugs(loc as Locale)) {
      const post = getPost(loc as Locale, slug);
      const cluster = post ? getClusterSlugs(post.cluster) : {};
      const languages: Record<string, string> = {};
      for (const [clLoc, clSlug] of Object.entries(cluster)) {
        languages[htmlLang(clLoc as Locale)] = `${SITE_URL}/${clLoc}/blog/${clSlug}`;
      }
      out.push({
        url: `${SITE_URL}/${loc}/blog/${slug}`,
        lastModified: post ? new Date(post.date) : now,
        changeFrequency: "monthly",
        priority: 0.5,
        ...(Object.keys(languages).length > 1 ? { alternates: { languages } } : {}),
      });
    }
  }

  return out;
}

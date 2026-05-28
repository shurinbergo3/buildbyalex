import type { MetadataRoute } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL, localizedHref, htmlLang } from "@/lib/site";
import { getAllPostSlugs, getPost } from "@/lib/blog";
import { caseKeyToSlug, type CaseKey } from "@/lib/cases";

const staticPaths: (keyof typeof routing.pathnames)[] = [
  "/",
  "/about",
  "/services",
  "/services/websites",
  "/services/ai-agents",
  "/services/mobile-apps",
  "/work",
  "/blog",
  "/contact",
];

const caseKeys: CaseKey[] = ["legalwin", "visionair", "crmbot"];

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

  // Case studies
  for (const key of caseKeys) {
    const slug = caseKeyToSlug[key];
    for (const loc of routing.locales) {
      // Resolve the localized prefix of /work/[slug] dynamically
      const def = (routing.pathnames as Record<string, unknown>)["/work/[slug]"];
      let pathTemplate: string;
      if (typeof def === "string") pathTemplate = def;
      else if (def && typeof def === "object")
        pathTemplate =
          (def as Record<string, string>)[loc] ??
          (def as Record<string, string>)[routing.defaultLocale] ??
          "/work/[slug]";
      else pathTemplate = "/work/[slug]";
      const url = `${SITE_URL}/${loc}${pathTemplate.replace("[slug]", slug)}`;
      out.push({
        url,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }
  }

  // Blog posts (per locale, only where the post exists)
  for (const loc of routing.locales) {
    for (const slug of getAllPostSlugs(loc as Locale)) {
      const post = getPost(loc as Locale, slug);
      out.push({
        url: `${SITE_URL}/${loc}/blog/${slug}`,
        lastModified: post ? new Date(post.date) : now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return out;
}

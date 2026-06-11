import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL, localizedHref, htmlLang, ogLocale } from "./site";

type PathKey = keyof typeof routing.pathnames;

/**
 * Build a Next.js Metadata object with metadataBase, canonical and hreflang
 * already filled in for a logical pathname like "/about" or "/services/ai-agents".
 * Each page can spread additional fields on top.
 */
export function buildLocalizedMetadata({
  locale,
  pathname,
  title,
  description,
  ogImage,
  type = "website",
  publishedTime,
  noIndex,
}: {
  locale: Locale;
  pathname: PathKey;
  title?: string;
  description?: string;
  ogImage?: string;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
}): Metadata {
  const url = localizedHref(locale, pathname);
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[htmlLang(loc as Locale)] = localizedHref(loc as Locale, pathname);
  }
  languages["x-default"] = localizedHref(routing.defaultLocale as Locale, pathname);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type,
      url,
      title,
      description,
      locale: ogLocale(locale),
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

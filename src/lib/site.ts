import { routing, type Locale } from "@/i18n/routing";

export const SITE_URL = (process.env.SITE_URL ?? "https://buildbyalex.com").replace(/\/$/, "");

export const LOCALES: readonly Locale[] = routing.locales;

/** Map next-intl locale → HTML / hreflang code */
export function htmlLang(locale: Locale): string {
  return locale === "ua" ? "uk" : locale;
}

/**
 * Build the localized URL for a logical pathname.
 * Reads localized slugs from `routing.pathnames`.
 */
export function localizedHref(locale: Locale, pathname: keyof typeof routing.pathnames | string): string {
  const def = (routing.pathnames as Record<string, string | Partial<Record<Locale, string>>>)[pathname];
  let p: string;
  if (typeof def === "string") {
    p = def;
  } else if (def && typeof def === "object") {
    p = def[locale] ?? def[routing.defaultLocale as Locale] ?? "/";
  } else {
    p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  }
  // Strip [slug]-style placeholders — callers should pass the resolved slug instead
  if (p.includes("[")) p = p.replace(/\/\[[^\]]+\]/g, "");
  return `${SITE_URL}/${locale}${p === "/" ? "" : p}`;
}

export function languageAlternates(
  pathname: keyof typeof routing.pathnames,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const loc of LOCALES) {
    out[htmlLang(loc)] = localizedHref(loc, pathname);
  }
  out["x-default"] = localizedHref(routing.defaultLocale as Locale, pathname);
  return out;
}

/**
 * Build the localized URL for a dynamic route, substituting a resolved `slug`
 * into the `[slug]` placeholder. e.g. ("pl", "/work/[slug]", "legalwin")
 * → https://buildbyalex.com/pl/realizacje/legalwin
 *
 * Unlike `localizedHref` (which strips `[slug]`), this keeps the localized
 * path prefix AND the slug, so canonical/hreflang/sitemap all agree.
 */
export function localizedDynamicHref(
  locale: Locale,
  pathname: keyof typeof routing.pathnames,
  slug: string,
): string {
  const def = (routing.pathnames as Record<string, string | Partial<Record<Locale, string>>>)[pathname];
  let p: string;
  if (typeof def === "string") p = def;
  else if (def && typeof def === "object")
    p = def[locale] ?? def[routing.defaultLocale as Locale] ?? String(pathname);
  else p = String(pathname);
  p = p.replace("[slug]", slug);
  return `${SITE_URL}/${locale}${p}`;
}

/**
 * hreflang map for a dynamic route. `slugFor` resolves the slug per locale —
 * pass a constant for routes whose slug is shared (cases), or a lookup for
 * routes whose slug differs per language (blog clusters). Locales for which
 * `slugFor` returns null/undefined are omitted.
 */
export function dynamicLanguageAlternates(
  pathname: keyof typeof routing.pathnames,
  slugFor: (locale: Locale) => string | undefined | null,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const loc of LOCALES) {
    const slug = slugFor(loc);
    if (slug) out[htmlLang(loc)] = localizedDynamicHref(loc, pathname, slug);
  }
  const defaultSlug = slugFor(routing.defaultLocale as Locale);
  if (defaultSlug) {
    out["x-default"] = localizedDynamicHref(routing.defaultLocale as Locale, pathname, defaultSlug);
  }
  return out;
}

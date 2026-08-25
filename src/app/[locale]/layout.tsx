import "../globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL, localizedHref, htmlLang, ogLocale } from "@/lib/site";
import { ThemeProvider, type Theme } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { SmoothScroll } from "@/components/SmoothScroll";
import { YandexMetrika } from "@/components/YandexMetrika";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// Theme is applied by the inline bootstrap below, not on the server. Reading the
// cookie here with `cookies()` opted every page into dynamic rendering, which
// killed the static build and made the whole site respond with `no-store` —
// no CDN cache, a full re-render on every crawler hit. The markup ships with the
// light theme and the script swaps it before first paint.
const DEFAULT_THEME: Theme = "light";

const THEME_BOOTSTRAP = `try{document.documentElement.dataset.theme=/(?:^|;\\s*)theme=dark(?:;|$)/.test(document.cookie)?"dark":"light"}catch(e){}`;

// Every page is prerendered. A few of them still depend on "now" — reviews
// gated by `publishAt`, posts gated by their date — so the whole segment
// re-renders hourly instead of freezing at build time.
export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[htmlLang(loc as Locale)] = localizedHref(loc as Locale, "/");
  }
  languages["x-default"] = localizedHref(routing.defaultLocale as Locale, "/");

  // Search-engine ownership verification. Codes are public (served in HTML);
  // env vars override the defaults so they can be rotated from
  // Dokploy → Application → Environment without touching the code.
  const googleVerification =
    process.env.GOOGLE_SITE_VERIFICATION ?? "dc8BkoAfPhBbulrUzksvL4TGZ3MOinl-0CAT5YwrlIs";
  const bingVerification =
    process.env.BING_SITE_VERIFICATION ?? "874888A481A37085C686C9CE85897BFD";

  const verification: NonNullable<Metadata["verification"]> = {};
  if (googleVerification) verification.google = googleVerification;
  if (process.env.YANDEX_VERIFICATION) verification.yandex = process.env.YANDEX_VERIFICATION;
  if (bingVerification) verification.other = { "msvalidate.01": bingVerification };

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("defaultTitle"), template: `%s — ${t("siteName")}` },
    description: t("defaultDescription"),
    ...(Object.keys(verification).length ? { verification } : {}),
    alternates: {
      canonical: localizedHref(locale as Locale, "/"),
      languages,
    },
    openGraph: {
      type: "website",
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      siteName: t("siteName"),
      locale: ogLocale(locale as Locale),
      url: localizedHref(locale as Locale, "/"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("defaultTitle"),
      description: t("defaultDescription"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={htmlLang(locale as Locale)} data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <SmoothScroll />
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[color:var(--color-text)] focus:px-4 focus:py-2 focus:text-[color:var(--color-bg)]"
            >
              Skip to content
            </a>
            <Header />
            <main id="main" className="pt-[var(--header-h)]">
              {children}
            </main>
            <Footer />
            <MobileStickyCTA />
            <YandexMetrika />
            <GoogleAnalytics />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

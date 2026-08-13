import "../globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL, localizedHref, htmlLang, ogLocale } from "@/lib/site";
import { ThemeProvider, type Theme } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { SmoothScroll } from "@/components/SmoothScroll";
import { YandexMetrika } from "@/components/YandexMetrika";

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
  // env vars override the defaults so they can be rotated without a redeploy
  // (Vercel project → Settings → Environment Variables).
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

  const themeCookie = (await cookies()).get("theme")?.value;
  const initialTheme: Theme = themeCookie === "dark" ? "dark" : "light";
  const messages = await getMessages();

  return (
    <html lang={htmlLang(locale as Locale)} data-theme={initialTheme} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider initialTheme={initialTheme}>
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
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

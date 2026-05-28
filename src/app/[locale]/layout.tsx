import "../globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL, localizedHref, htmlLang } from "@/lib/site";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider, type Theme } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("defaultTitle"), template: `%s — ${t("siteName")}` },
    description: t("defaultDescription"),
    alternates: {
      canonical: localizedHref(locale as Locale, "/"),
      languages,
    },
    openGraph: {
      type: "website",
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      siteName: t("siteName"),
      locale,
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
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

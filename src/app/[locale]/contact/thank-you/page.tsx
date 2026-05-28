import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { routing, type Locale } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "thankYou.meta" });
  return buildLocalizedMetadata({
    locale: locale as Locale,
    pathname: "/contact/thank-you",
    title: t("title"),
    description: t("description"),
    noIndex: true,
  });
}

export default async function ThankYouPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "thankYou" });

  return (
    <Container size="sm" className="py-24 text-center md:py-36">
      <div className="mx-auto mb-7 grid h-16 w-16 place-items-center rounded-full bg-[color:var(--c-accent-soft)] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 14.5l5.5 5.5L23 8.5" />
        </svg>
      </div>
      <p className="t-eyebrow">{t("eyebrow")}</p>
      <h1 className="mt-3 t-h1">{t("headline")}</h1>
      <p className="mx-auto mt-5 max-w-[480px] t-body-lg">{t("lead")}</p>
      <div className="mt-9 flex justify-center">
        <Button href="/" variant="ghost" size="lg">{t("back")}</Button>
      </div>
    </Container>
  );
}

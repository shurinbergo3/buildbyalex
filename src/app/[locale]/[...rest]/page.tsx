import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

// Catch-all so any unmatched path under a locale renders the localized,
// design-rich not-found page (instead of Next's bare default 404).
export default async function CatchAll({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}

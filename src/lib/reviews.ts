import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export type Review = { rating?: number; publishAt?: string };

/** A review counts once its `publishAt` date has arrived (or it has none). */
export function isReviewLive(r: Review, now: number): boolean {
  return !r.publishAt || new Date(r.publishAt).getTime() <= now;
}

/**
 * Single source of truth for "how many reviews does the site currently show".
 * The hero trust line, the JSON-LD aggregate rating and the testimonials
 * block itself all derive from this so the number can never drift apart.
 */
export function countLiveReviews(list: Review[], now: number): number {
  return list.filter((r) => isReviewLive(r, now)).length;
}

/** Server-component convenience wrapper — reads the live count for a page. */
export async function getLiveReviewCount(locale: Locale, now = Date.now()): Promise<number> {
  const t = await getTranslations({ locale, namespace: "home.testimonials" });
  return countLiveReviews(t.raw("list") as Review[], now);
}

/**
 * City posts → the service they sell.
 *
 * These 24 clusters (~95 pages across four languages) are the site's real
 * location landing pages: each one is written for one city and already ranks
 * on its own URL. What they lacked was a price and a way to enquire above the
 * fold — a reader arriving on "tworzenie stron internetowych kraków" had to
 * finish the article before finding either.
 *
 * Keyed by the frontmatter `cluster`, so a post joins simply by using one of
 * these ids. Everything else — price, wording, links — is derived, never
 * duplicated here.
 */

export type GeoBranch = "websites" | "store" | "ai" | "automation" | "mobile" | "telegram";

/** Which starting-price tier (home.pricing.tiers.*) each branch quotes. */
export const BRANCH_TIER: Record<GeoBranch, string> = {
  websites: "site",
  store: "store",
  ai: "ai",
  automation: "automation",
  mobile: "mobile",
  telegram: "telegram",
};

/** Which service page each branch links to. */
export const BRANCH_PATH = {
  websites: "/services/websites",
  store: "/services/online-store",
  ai: "/services/ai-agents",
  automation: "/services/automation",
  mobile: "/services/mobile-apps",
  telegram: "/services/telegram-bots",
} as const;

const GEO_CLUSTERS: Record<string, GeoBranch> = {
  "web-developer-warsaw": "websites",
  "web-developer-krakow": "websites",
  "web-developer-wroclaw": "websites",
  "web-developer-gdansk": "websites",
  "web-poznan": "websites",
  "web-katowice": "websites",
  "web-czestochowa": "websites",
  "online-store-development-warsaw": "store",
  "online-store-development-krakow": "store",
  "online-store-development-wroclaw": "store",
  "store-gdynia": "store",
  "store-lodz": "store",
  "store-szczecin": "store",
  "ai-agent-gdansk": "ai",
  "ai-lublin": "ai",
  "ai-poznan": "ai",
  "auto-lodz": "automation",
  "auto-rzeszow": "automation",
  "mobile-app-developer-warsaw": "mobile",
  "mobile-app-developer-krakow": "mobile",
  "mobile-bialystok": "mobile",
  "mobile-lublin": "mobile",
  "mobile-szczecin": "mobile",
  "tg-torun": "telegram",
};

/** The service a city post sells, or null when the post isn't a city post. */
export function geoBranchFor(cluster: string): GeoBranch | null {
  return GEO_CLUSTERS[cluster] ?? null;
}

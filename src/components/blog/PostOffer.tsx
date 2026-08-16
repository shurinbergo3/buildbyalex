import { useTranslations, useMessages } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BRANCH_PATH, BRANCH_TIER, type GeoBranch } from "@/lib/geoPosts";

/* ════════════════════════════════════════════════════════════════════════════
   PostOffer — the price and the enquiry button, placed directly under the
   headline of a city post instead of at the end of it. Someone who searched
   "tworzenie stron internetowych kraków" has commercial intent before they
   read a word; making them scroll 2 000 words to find a number is where those
   visits were being lost. Price and copy come from the same messages the
   service pages use, so this can never quote a stale figure.
   ──────────────────────────────────────────────────────────────────────────── */

type Tier = { title: string; price: string; from: string; body: string };
type Shape = { home: { pricing: { tiers: Record<string, Tier> } } };

export function PostOffer({ branch }: { branch: GeoBranch }) {
  const t = useTranslations("blog.offer");
  const messages = useMessages() as unknown as Shape;
  const tier = messages.home.pricing.tiers[BRANCH_TIER[branch]];
  if (!tier) return null;

  return (
    <aside className="not-prose my-8 overflow-hidden rounded-[20px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)]">
      <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="min-w-0">
          <p className="text-[12px] font-medium uppercase tracking-[0.09em] text-[color:var(--color-text-3)]">
            {t("eyebrow")}
          </p>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-2 text-[color:var(--color-text)]">
            <span className="text-[17px] font-semibold tracking-[-0.014em]">{tier.title}</span>
            <span className="text-[15px] text-[color:var(--color-text-3)]">{tier.from}</span>
            <span className="font-mono text-[19px] font-semibold tabular-nums tracking-[-0.02em] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
              {tier.price}
            </span>
          </p>
          <p className="mt-2 max-w-[440px] text-[14.5px] leading-[1.5] text-[color:var(--color-text-2)]">
            {t("note")}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row md:flex-col lg:flex-row">
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--c-accent)] px-5 text-[15px] font-medium tracking-[-0.011em] text-white transition-[transform,background] duration-200 active:translate-y-px"
          >
            {t("quote")}
          </Link>
          <Link
            href={BRANCH_PATH[branch]}
            className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] px-5 text-[15px] font-medium tracking-[-0.011em] text-[color:var(--color-text)] transition-colors hover:border-[color:var(--c-accent)]/40"
          >
            {t("details")}
          </Link>
        </div>
      </div>
    </aside>
  );
}

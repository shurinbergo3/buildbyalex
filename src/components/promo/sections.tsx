import type { ReactNode } from "react";
import { useMessages, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { caseImages, caseKeyToSlug, caseSlugs, type CaseKey } from "@/lib/cases";
import { serviceHref, type ServiceKey } from "@/components/serviceGlyphs";
import { isReviewLive } from "@/lib/reviews";
import { TELEGRAM_URL } from "@/lib/contacts";
import { CasesRail, type RailCase } from "./CasesRail";

/* Everything after the film: the same content as the home page (cases,
   services and prices, process, fit, reviews, FAQ), set in the film's
   black-and-amber language. Copy comes from the home namespaces. */

function Head({
  eyebrow,
  title,
  sub,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="pv-head">
      <div>
        <p className="pv-eyebrow">{eyebrow}</p>
        <h2 className="pv-title">{title}</h2>
        {sub && <p className="pv-sub">{sub}</p>}
      </div>
      {aside}
    </div>
  );
}

const em = (chunks: ReactNode) => <em>{chunks}</em>;

type CasesShape = {
  work: {
    cases: Record<
      CaseKey,
      {
        industry: string;
        title: string;
        imageAlt: string;
        tagline: string;
        metric: { value: string; label: string };
      }
    >;
  };
};

export function PromoWork() {
  const t = useTranslations("promo.work");
  const messages = useMessages() as unknown as CasesShape;
  const items: RailCase[] = caseSlugs.map((key) => {
    const c = messages.work.cases[key];
    return {
      slug: caseKeyToSlug[key],
      title: c.title,
      industry: c.industry,
      tagline: c.tagline,
      metricValue: c.metric.value,
      metricLabel: c.metric.label,
      image: { src: caseImages[key].src, alt: c.imageAlt },
    };
  });

  return (
    <section className="pv" id="work">
      <div className="pv-wrap">
        <Head
          eyebrow={t("eyebrow")}
          title={t.rich("title", { em })}
          sub={t("sub")}
          aside={
            <Link href="/work" className="pv-link">
              {t("all")} →
            </Link>
          }
        />
      </div>
      <CasesRail items={items} cta={t("cta")} prevLabel={t("prev")} nextLabel={t("next")} />
    </section>
  );
}

const SERVICES: { key: string; service: ServiceKey; featured?: boolean }[] = [
  { key: "ai", service: "ai", featured: true },
  { key: "site", service: "websites" },
  { key: "store", service: "store" },
  { key: "automation", service: "automation" },
  { key: "mobile", service: "mobile" },
  { key: "telegram", service: "telegram" },
  { key: "ads", service: "ads" },
];

const OFFERS = [
  { key: "aiAudit", href: "/services/ai-audit" },
  { key: "documents", href: "/services/document-automation" },
  { key: "aiAct", href: "/services/ai-act-compliance" },
  { key: "aiVisibility", href: "/services/ai-visibility" },
] as const;

export function PromoServices() {
  const t = useTranslations("promo.services");
  const tp = useTranslations("home.pricing");
  const tn = useTranslations("nav.servicesMenu");

  return (
    <section className="pv" id="services">
      <div className="pv-wrap">
        <Head
          eyebrow={t("eyebrow")}
          title={t.rich("title", { em })}
          sub={t("sub")}
          aside={
            <Link href="/pricing" className="pv-link">
              {t("all")} →
            </Link>
          }
        />

        <div className="pv-services">
          {SERVICES.map(({ key, service, featured }) => (
            <Link
              key={key}
              href={serviceHref[service]}
              className={`pv-svc${featured ? " pv-svc--featured" : ""}`}
            >
              {featured && <span className="pv-svc-badge">{t("featured")}</span>}
              <span className="pv-svc-title">{tp(`tiers.${key}.title`)}</span>
              <span className="pv-svc-price">
                <small>{tp(`tiers.${key}.from`)}</small>
                {tp(`tiers.${key}.price`)}
              </span>
              <span className="pv-svc-body">{tp(`tiers.${key}.body`)}</span>
              <span className="pv-svc-examples">{tp(`tiers.${key}.examples`)}</span>
              <span className="pv-svc-more">{t("more")} →</span>
            </Link>
          ))}
          <Link href="/contact" className="pv-svc pv-svc--custom">
            <span className="pv-svc-title">{t("customTitle")}</span>
            <span className="pv-svc-body">{t("customBody")}</span>
            <span className="pv-svc-more">{t("customCta")} →</span>
          </Link>
        </div>

        <div className="pv-offers">
          <p className="pv-offers-title">{t("offers")}</p>
          <div className="pv-offers-grid">
            {OFFERS.map((o) => (
              <Link key={o.key} href={o.href} className="pv-offer">
                <b>{tn(`${o.key}.title`)}</b>
                <span>{tn(`${o.key}.tagline`)}</span>
              </Link>
            ))}
          </div>
        </div>

        <p className="pv-caption">{tp("caption")}</p>
      </div>
    </section>
  );
}

const STEPS = ["call", "proposal", "build", "launch"] as const;

export function PromoProcess() {
  const t = useTranslations("home.how");
  return (
    <section className="pv">
      <div className="pv-wrap">
        <Head eyebrow={t("eyebrow")} title={t("headline")} />
        <ol className="pv-steps">
          {STEPS.map((k) => (
            <li key={k} className="pv-step">
              <span className="pv-step-n">{t(`steps.${k}.n`)}</span>
              <p className="pv-step-title">{t(`steps.${k}.title`)}</p>
              <p className="pv-step-body">{t(`steps.${k}.body`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const Tick = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 13l4 4L19 7" stroke="#5fd394" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const Cross = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 7l10 10M17 7 7 17" stroke="rgba(255,255,255,0.4)" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export function PromoFit() {
  const t = useTranslations("home.fit");
  const yes = t.raw("yes") as string[];
  const no = t.raw("no") as string[];
  return (
    <section className="pv">
      <div className="pv-wrap">
        <Head eyebrow={t("eyebrow")} title={t("headline")} sub={t("lead")} />
        <div className="pv-fit">
          <div className="pv-fit-col">
            <h3>{t("yesTitle")}</h3>
            <ul>
              {yes.map((s) => (
                <li key={s}>
                  <Tick />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="pv-fit-col">
            <h3>{t("noTitle")}</h3>
            <ul>
              {no.map((s) => (
                <li key={s}>
                  <Cross />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pv-fit-cta">
          <div>
            <b>{t("ctaTitle")}</b>
            <span>{t("ctaBody")}</span>
          </div>
          <div>
            <Link href="/contact" className="pf-btn pf-btn--primary">
              {t("ctaPrimary")}
            </Link>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer noopener" className="pf-btn pf-btn--ghost">
              {t("ctaTelegram")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

type Review = { name: string; role: string; quote: string; rating?: number; publishAt?: string };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export function PromoReviews({ now, reviewCount }: { now: number; reviewCount: number }) {
  const t = useTranslations("home.testimonials");
  const tp = useTranslations("promo.reviews");
  const list = (t.raw("list") as Review[]).filter((r) => isReviewLive(r, now)).slice(0, 9);

  return (
    <section className="pv" id="reviews">
      <div className="pv-wrap">
        <Head
          eyebrow={tp("eyebrow")}
          title={t("headline")}
          sub={t("subhead")}
          aside={
            <div className="pv-rating">
              <b>{t("rating")}</b>
              <span>
                {tp("outOf")} · {reviewCount} {t("count")}
              </span>
            </div>
          }
        />
        <div className="pv-quotes">
          {list.map((r) => (
            <figure key={r.name} className="pv-quote">
              <div className="pv-quote-stars" aria-label={`${r.rating ?? 5} / 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      d="M8 1.5l1.96 4.27 4.7.55-3.5 3.2.96 4.62L8 11.9l-4.12 2.24.96-4.62-3.5-3.2 4.7-.55L8 1.5z"
                      fill={i < (r.rating ?? 5) ? "currentColor" : "rgba(255,255,255,0.14)"}
                    />
                  </svg>
                ))}
              </div>
              <blockquote>
                <p>{r.quote}</p>
              </blockquote>
              <figcaption>
                <span className="pv-quote-avatar">{initials(r.name)}</span>
                <span>
                  <span className="pv-quote-name">{r.name}</span>
                  <span className="pv-quote-role">{r.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PromoFaq() {
  const t = useTranslations("home.faq");
  const items = t.raw("items") as { q: string; a: string }[];
  return (
    <section className="pv" id="faq">
      <div className="pv-wrap pv-faq">
        <div>
          <p className="pv-eyebrow">{t("eyebrow")}</p>
          <h2 className="pv-title">{t("headline")}</h2>
        </div>
        <div className="pv-faq-list">
          {items.map((it, i) => (
            <details key={it.q} open={i === 0}>
              <summary>{it.q}</summary>
              <p>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

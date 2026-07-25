import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { SectionAtmosphere } from "./SectionAtmosphere";

/* Four site formats (landing / corporate / store / redesign) with prices and
   timelines — segmentation for the visitor, OfferCatalog markup for Google. */

type SiteType = {
  title: string;
  price: string;
  time: string;
  desc: string;
  audience: string;
  bullets: string[];
  href?: string;
  linkLabel?: string;
};

function Check() {
  return (
    <svg className="mt-[4px] h-3.5 w-3.5 shrink-0 text-[color:var(--c-accent)]" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ServiceFormats({ branch }: { branch: "websites" | "store" | "mobile" | "ai" | "automation" | "telegram" | "ads" }) {
  const t = useTranslations(`services.${branch}.formats`);
  const items = t.raw("items") as SiteType[];

  const catalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: t("headline"),
    itemListElement: items.map((item, i) => ({
      "@type": "Offer",
      position: i + 1,
      name: item.title,
      description: item.desc,
      price: String(Number(item.price.replace(/[^\d]/g, "")) || ""),
      priceCurrency: "EUR",
    })),
  };

  return (
    <Section pad="default" tone="default" className="isolate">
      <SectionAtmosphere variant="a" />
      <Container>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
        />
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
            <p className="mx-auto mt-5 max-w-[600px] t-body-lg">{t("sub")}</p>
          </div>
        </Reveal>

        <div className={`mt-12 grid gap-5 md:mt-14 md:gap-6 ${items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <article className="flex h-full flex-col rounded-[24px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] p-6 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] md:p-8">
                <h3 className="t-h4">{item.title}</h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--c-accent-soft)] px-3 py-1 text-[12px] font-medium text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3.5 2.2" />
                    </svg>
                    {item.time}
                  </span>
                </div>

                <p className="mt-4 text-[15.5px] leading-[1.55] text-[color:var(--color-text-2)]">{item.desc}</p>
                <p className="mt-2 text-[13px] text-[color:var(--color-text-3)]">{item.audience}</p>

                <ul className="mt-5 space-y-2.5 border-t border-[color:var(--c-hairline)] pt-5">
                  {item.bullets.map((b) => (
                    <li key={b} className="flex gap-2.5 text-[14px] leading-[1.45] text-[color:var(--color-text-2)]">
                      <Check />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {(item.href === "/services/online-store" || item.href === "/services/websites" || item.href === "/services/telegram-bots") && item.linkLabel && (
                  <div className="mt-auto pt-5">
                    <Link
                      href={item.href as "/services/online-store" | "/services/websites" | "/services/telegram-bots"}
                      className="inline-flex items-center gap-1.5 text-[14.5px] font-medium text-[color:var(--c-accent-ink)] underline-offset-4 hover:underline dark:text-[color:var(--c-accent)]"
                    >
                      {item.linkLabel}
                      <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </Link>
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

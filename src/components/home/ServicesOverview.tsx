import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { serviceGlyph, serviceHref, type ServiceKey } from "@/components/serviceGlyphs";

type Item = {
  key: Extract<ServiceKey, "websites" | "ai" | "mobile">;
  href: (typeof serviceHref)[Extract<ServiceKey, "websites" | "ai" | "mobile">];
  featured: boolean;
  glyph: React.ReactNode;
};

const items: Item[] = [
  { key: "websites", href: serviceHref.websites, featured: false, glyph: serviceGlyph.websites },
  { key: "ai", href: serviceHref.ai, featured: true, glyph: serviceGlyph.ai },
  { key: "mobile", href: serviceHref.mobile, featured: false, glyph: serviceGlyph.mobile },
];

export function ServicesOverview() {
  const t = useTranslations("home.services");

  return (
    <Section tone="alt" pad="default" id="services">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[620px]">
              <p className="t-eyebrow">{t("eyebrow")}</p>
              <h2 className="mt-3 t-h2">{t("headline")}</h2>
            </div>
            <p className="t-body-lg max-w-[400px] md:text-right">{t("subhead")}</p>
          </div>
        </Reveal>

        {/* Three service cards — capability-led, prices live in the pricing section */}
        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
          {items.map(({ key, href, featured, glyph }, i) => {
            const bullets = t.raw(`items.${key}.bullets`) as string[];
            return (
              <Reveal key={key} delay={i * 90}>
                <Link
                  href={href}
                  className={[
                    "group relative flex h-full flex-col rounded-[28px] p-7 md:p-8 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    featured
                      ? "bg-[#0A0A0A] text-white shadow-[var(--shadow-card)]"
                      : "bg-[color:var(--color-bg-elev)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]",
                  ].join(" ")}
                >
                  {featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--c-accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
                      {t("badge")}
                    </span>
                  )}

                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-2xl ${
                        featured
                          ? "bg-white/10 text-[color:var(--c-accent)]"
                          : "bg-[color:var(--c-accent-soft)] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]"
                      }`}
                    >
                      <span className="h-6 w-6">{glyph}</span>
                    </span>
                    <p
                      className={`text-[12px] font-semibold uppercase tracking-[0.08em] ${
                        featured ? "text-white/55" : "text-[color:var(--color-text-3)]"
                      }`}
                    >
                      {t(`items.${key}.category`)}
                    </p>
                  </div>

                  <h3
                    className={`mt-5 t-h4 font-[number:var(--fw-semi)] ${
                      featured ? "text-white" : "text-[color:var(--color-text)]"
                    }`}
                  >
                    {t(`items.${key}.title`)}
                  </h3>

                  <p
                    className={`mt-2.5 text-[14.5px] leading-[1.5] ${
                      featured ? "text-white/70" : "text-[color:var(--color-text-2)]"
                    }`}
                  >
                    {t(`items.${key}.desc`)}
                  </p>

                  <ul
                    className={`mt-5 space-y-2.5 border-t pt-5 text-[14.5px] leading-[1.5] ${
                      featured ? "border-white/10 text-white/80" : "border-[color:var(--color-divider)] text-[color:var(--color-text-2)]"
                    }`}
                  >
                    {bullets.map((b, bi) => (
                      <li key={bi} className="flex gap-2.5">
                        <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--c-accent)]" aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <span
                    className={`mt-auto inline-flex items-center gap-1.5 pt-7 text-[14px] font-medium ${
                      featured ? "text-[color:var(--c-accent)]" : "text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]"
                    }`}
                  >
                    {t(`items.${key}.link`)}
                    <svg width="15" height="15" viewBox="0 0 14 14" className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* Automation — full width, the cross-cutting "connect everything" service */}
        <Reveal delay={280}>
          <Link
            href="/services/automation"
            className="group mt-5 flex flex-col gap-4 rounded-[28px] bg-[color:var(--color-bg-elev)] p-7 ring-1 ring-[color:var(--color-divider)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)] md:flex-row md:items-center md:justify-between md:p-8"
          >
            <div className="flex items-start gap-3 md:items-center">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[color:var(--c-accent-soft)] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                <span className="h-6 w-6">{serviceGlyph.automation}</span>
              </span>
              <div className="max-w-[640px]">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">
                  {t("automation.category")}
                </p>
                <h3 className="mt-1 t-h4 font-[number:var(--fw-semi)] text-[color:var(--color-text)]">{t("automation.title")}</h3>
                <p className="mt-1.5 text-[14.5px] leading-[1.5] text-[color:var(--color-text-2)]">{t("automation.body")}</p>
              </div>
            </div>
            <p className="shrink-0 text-[14.5px] font-medium tracking-[-0.01em] text-[color:var(--color-text)] md:text-right">
              {t("automation.price")}
            </p>
          </Link>
        </Reveal>

        {/* Telegram bots & Mini Apps — full width */}
        <Reveal delay={300}>
          <Link
            href="/services/telegram-bots"
            className="group mt-5 flex flex-col gap-4 rounded-[28px] bg-[color:var(--color-bg-elev)] p-7 ring-1 ring-[color:var(--color-divider)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)] md:flex-row md:items-center md:justify-between md:p-8"
          >
            <div className="flex items-start gap-3 md:items-center">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[color:var(--c-accent-soft)] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                <span className="h-6 w-6">{serviceGlyph.telegram}</span>
              </span>
              <div className="max-w-[640px]">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">
                  {t("telegram.category")}
                </p>
                <h3 className="mt-1 t-h4 font-[number:var(--fw-semi)] text-[color:var(--color-text)]">{t("telegram.title")}</h3>
                <p className="mt-1.5 text-[14.5px] leading-[1.5] text-[color:var(--color-text-2)]">{t("telegram.body")}</p>
              </div>
            </div>
            <p className="shrink-0 text-[14.5px] font-medium tracking-[-0.01em] text-[color:var(--color-text)] md:text-right">
              {t("telegram.price")}
            </p>
          </Link>
        </Reveal>

        {/* Advertising — full width */}
        <Reveal delay={360}>
          <Link
            href="/services/advertising"
            className="group mt-5 flex flex-col gap-4 rounded-[28px] bg-[color:var(--color-bg-elev)] p-7 ring-1 ring-[color:var(--color-divider)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)] md:flex-row md:items-center md:justify-between md:p-8"
          >
            <div className="flex items-start gap-3 md:items-center">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[color:var(--c-accent-soft)] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                <span className="h-6 w-6">{serviceGlyph.ads}</span>
              </span>
              <div className="max-w-[640px]">
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">
                  {t("ads.category")}
                </p>
                <h3 className="mt-1 t-h4 font-[number:var(--fw-semi)] text-[color:var(--color-text)]">{t("ads.title")}</h3>
                <p className="mt-1.5 text-[14.5px] leading-[1.5] text-[color:var(--color-text-2)]">{t("ads.body")}</p>
              </div>
            </div>
            <p className="shrink-0 text-[14.5px] font-medium tracking-[-0.01em] text-[color:var(--color-text)] md:text-right">
              {t("ads.price")}
            </p>
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}

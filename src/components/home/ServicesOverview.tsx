import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

type Item = {
  key: "websites" | "ai" | "mobile";
  href: "/services/websites" | "/services/ai-agents" | "/services/mobile-apps";
  featured: boolean;
};

const items: Item[] = [
  { key: "websites", href: "/services/websites", featured: false },
  { key: "ai", href: "/services/ai-agents", featured: true },
  { key: "mobile", href: "/services/mobile-apps", featured: false },
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

        {/* Three service cards — styled to match the pricing section */}
        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
          {items.map(({ key, href, featured }, i) => {
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
                      Most asked
                    </span>
                  )}

                  <p
                    className={`text-[12px] font-semibold uppercase tracking-[0.08em] ${
                      featured ? "text-white/50" : "text-[color:var(--color-text-3)]"
                    }`}
                  >
                    {t(`items.${key}.category`)}
                  </p>

                  <h3
                    className={`mt-3 t-h4 font-[number:var(--fw-semi)] ${
                      featured ? "text-white" : "text-[color:var(--color-text)]"
                    }`}
                  >
                    {t(`items.${key}.title`)}
                  </h3>

                  <ul
                    className={`mt-5 space-y-2.5 text-[15px] leading-[1.5] ${
                      featured ? "text-white/80" : "text-[color:var(--color-text-2)]"
                    }`}
                  >
                    {bullets.map((b, bi) => (
                      <li key={bi} className="flex gap-2.5">
                        <span
                          className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--c-accent)]"
                          aria-hidden="true"
                        />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span
                      className={`text-[12px] uppercase tracking-[0.04em] ${
                        featured ? "text-white/50" : "text-[color:var(--color-text-3)]"
                      }`}
                    >
                      {t("from")}
                    </span>
                    <span
                      className={`text-[clamp(28px,2.4vw,36px)] font-semibold tracking-[-0.03em] ${
                        featured ? "text-white" : "text-[color:var(--color-text)]"
                      }`}
                    >
                      {t(`items.${key}.price`)}
                    </span>
                  </div>

                  <span
                    className={`mt-auto inline-flex items-center gap-1.5 pt-8 text-[14px] font-medium ${
                      featured ? "text-[color:var(--c-accent)]" : "text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]"
                    }`}
                  >
                    {t(`items.${key}.link`)}
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 14 14"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* Fourth card — full width, advertising */}
        <Reveal delay={300}>
          <div className="mt-5 flex flex-col gap-4 rounded-[28px] bg-[color:var(--color-bg-alt)] p-7 ring-1 ring-[color:var(--color-divider)] md:flex-row md:items-center md:justify-between md:p-8">
            <div className="max-w-[640px]">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">
                {t("ads.category")}
              </p>
              <h3 className="mt-2 t-h4 font-[number:var(--fw-semi)] text-[color:var(--color-text)]">
                {t("ads.title")}
              </h3>
              <p className="mt-2 text-[15.5px] leading-[1.5] text-[color:var(--color-text-2)]">
                {t("ads.body")}
              </p>
            </div>
            <p className="shrink-0 text-[15px] font-medium tracking-[-0.01em] text-[color:var(--color-text)] md:text-right">
              {t("ads.price")}
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

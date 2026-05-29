import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

type Item = {
  key: "websites" | "ai" | "mobile";
  href: "/services/websites" | "/services/ai-agents" | "/services/mobile-apps";
  glyph: React.ReactNode;
};

const items: Item[] = [
  {
    key: "websites",
    href: "/services/websites",
    glyph: (
      <svg viewBox="0 0 80 80" fill="none" className="h-full w-full">
        <rect x="10" y="14" width="60" height="42" rx="6" stroke="currentColor" strokeWidth="2" />
        <path d="M10 24h60" stroke="currentColor" strokeWidth="2" />
        <circle cx="16" cy="19" r="1.2" fill="currentColor" />
        <circle cx="20" cy="19" r="1.2" fill="currentColor" />
        <circle cx="24" cy="19" r="1.2" fill="currentColor" />
        <path d="M20 34h28M20 40h36M20 46h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="20" y="58" width="22" height="6" rx="3" fill="currentColor" opacity="0.85" />
      </svg>
    ),
  },
  {
    key: "ai",
    href: "/services/ai-agents",
    glyph: (
      <svg viewBox="0 0 80 80" fill="none" className="h-full w-full">
        <circle cx="40" cy="40" r="22" stroke="currentColor" strokeWidth="2" />
        <circle cx="40" cy="40" r="3.5" fill="currentColor" />
        <path d="M40 18v6M40 56v6M18 40h6M56 40h6M24 24l4 4M52 52l4 4M24 56l4-4M52 28l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "mobile",
    href: "/services/mobile-apps",
    glyph: (
      <svg viewBox="0 0 80 80" fill="none" className="h-full w-full">
        <rect x="26" y="10" width="28" height="60" rx="5" stroke="currentColor" strokeWidth="2" />
        <path d="M36 14h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="32" y="22" width="16" height="22" rx="2" fill="currentColor" opacity="0.85" />
        <circle cx="40" cy="62" r="2.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
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

        <div className="mt-12 overflow-hidden rounded-[28px] bg-[color:var(--color-bg-elev)] shadow-[var(--shadow-card)] md:mt-16">
          {items.map((item, i) => (
            <Reveal key={item.key} delay={i * 80}>
              <Link
                href={item.href}
                className="group relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 gap-y-4 p-7 transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[color:var(--c-accent-soft)] md:grid-cols-[5.5rem_5rem_minmax(0,1fr)_auto] md:items-center md:gap-x-8 md:p-9 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-[color:var(--color-divider)]"
              >
                {/* accent rail that grows on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 bg-[color:var(--c-accent)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
                />

                <span className="font-mono text-[15px] tabular-nums text-[color:var(--color-text-3)] md:text-[17px]">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[color:var(--c-accent-soft)] text-[color:var(--c-accent-ink)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 dark:text-[color:var(--c-accent)] md:h-[68px] md:w-[68px]">
                  <span className="h-8 w-8 md:h-10 md:w-10">{item.glyph}</span>
                </span>

                <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
                  <h3 className="t-h4 font-[number:var(--fw-semi)]">{t(`items.${item.key}.title`)}</h3>
                  <p className="max-w-[52ch] text-[15.5px] leading-[1.5] text-[color:var(--color-text-2)]">
                    {t(`items.${item.key}.body`)}
                  </p>
                  <p className="mt-1 font-mono text-[12px] tracking-[0.01em] text-[color:var(--color-text-3)]">
                    {t(`items.${item.key}.stack`)}
                  </p>
                </div>

                <span className="col-span-2 inline-flex items-center gap-1.5 text-[14px] font-medium text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)] md:col-span-1 md:justify-self-end">
                  {t(`items.${item.key}.link`)}
                  <svg width="15" height="15" viewBox="0 0 14 14" className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

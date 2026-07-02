import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2.2" />
    </svg>
  );
}
function IconPerson() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1.5-3.5 4.2-5 7-5s5.5 1.5 7 5" />
    </svg>
  );
}
function IconRank() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
    </svg>
  );
}

const items = [
  { key: "speed", Icon: IconClock },
  { key: "owner", Icon: IconPerson },
  { key: "seo", Icon: IconRank },
] as const;

export function PainPoints() {
  const t = useTranslations("home.pain");
  return (
    <Section tone="default" pad="default">
      <Container>
        <div className="grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:gap-24">
          <Reveal>
            <div className="md:sticky md:top-28">
              <p className="t-eyebrow">{t("eyebrow")}</p>
              <h2 className="mt-3 t-h2 max-w-[440px] text-balance">{t("headline")}</h2>
            </div>
          </Reveal>

          <ul>
            {items.map(({ key, Icon }, i) => (
              <Reveal
                as="li"
                key={key}
                delay={i * 90}
                className={i > 0 ? "border-t border-[color:var(--c-hairline)]" : undefined}
              >
                <div className={`grid grid-cols-[44px_1fr] gap-x-4 sm:grid-cols-[56px_1fr_auto] sm:gap-x-6 ${i > 0 ? "py-9 md:py-11" : "pb-9 md:pb-11 md:pt-2"}`}>
                  <span className="pt-1 font-mono text-[13px] tracking-[0.06em] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="t-h4">{t(`items.${key}.title`)}</h3>
                    <p className="mt-3 max-w-[520px] text-[15px] leading-[1.55] text-[color:var(--color-text-2)]">
                      {t(`items.${key}.body`)}
                    </p>
                  </div>
                  <span
                    className="hidden h-11 w-11 place-items-center rounded-2xl bg-[color:var(--c-accent-soft)] text-[color:var(--c-accent-ink)] sm:grid dark:text-[color:var(--c-accent)]"
                    aria-hidden="true"
                  >
                    <Icon />
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

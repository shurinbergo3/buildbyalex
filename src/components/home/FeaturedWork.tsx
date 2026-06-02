import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { TelegramChatMock } from "@/components/TelegramChatMock";

export function FeaturedWork() {
  const t = useTranslations("home.work");
  const metrics = t.raw("featured.metrics") as { value: string; label: string }[];

  return (
    <Section tone="default" pad="default" id="work">
      <Container>
        <Reveal>
          <div className="max-w-[640px]">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
            <p className="mt-4 t-body-lg">{t("subhead")}</p>
          </div>
        </Reveal>

        {/* Single featured case — CRM Bot, large horizontal card */}
        <Reveal delay={120}>
          <Link
            href={{ pathname: "/work/[slug]", params: { slug: "crm-bot" } }}
            className="group mt-14 grid items-center gap-10 overflow-hidden rounded-[28px] bg-[color:var(--color-bg-elev)] p-7 shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] md:mt-16 md:grid-cols-2 md:gap-12 md:p-12"
          >
            {/* Left — metrics + description */}
            <div>
              <span className="inline-flex w-fit items-center gap-2 text-[12px] font-medium uppercase tracking-[0.04em] text-[color:var(--color-text-3)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]" aria-hidden="true" />
                {t("items.crmbot.industry")}
              </span>

              <h3 className="mt-4 t-h3">{t("items.crmbot.title")}</h3>

              <dl className="mt-8 space-y-7">
                {metrics.map((m, i) => (
                  <div key={i} className="flex items-baseline gap-4">
                    <dt className="w-[clamp(72px,9vw,108px)] shrink-0 text-[clamp(36px,4vw,52px)] font-semibold leading-none tracking-[-0.03em] text-[color:var(--color-text)]">
                      {m.value}
                    </dt>
                    <dd className="text-[15px] leading-[1.45] text-[color:var(--color-text-2)]">
                      {m.label}
                    </dd>
                  </div>
                ))}
              </dl>

              <span className="mt-9 inline-flex items-center gap-1.5 text-[14px] font-medium text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                {t("cta")}
                <svg width="15" height="15" viewBox="0 0 14 14" className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </span>
            </div>

            {/* Right — animated Telegram chat mockup */}
            <div className="flex justify-center md:justify-end">
              <TelegramChatMock />
            </div>
          </Link>
        </Reveal>

        {/* Link to the full work page */}
        <Reveal delay={200}>
          <div className="mt-8 text-center md:text-left">
            <Link
              href="/work"
              className="inline-flex items-center gap-1 text-[14px] font-medium text-[color:var(--color-text-2)] transition-colors duration-200 hover:text-[color:var(--c-accent-ink)] dark:hover:text-[color:var(--c-accent)]"
            >
              {t("featured.seeAll")}
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

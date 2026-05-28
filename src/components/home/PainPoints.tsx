import Image from "next/image";
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
    <Section tone="default" pad="default" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.06] dark:opacity-[0.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--color-bg)] via-[color:var(--color-bg)]/70 to-[color:var(--color-bg)]" />
      </div>
      <Container className="relative">
        <Reveal>
          <div className="mx-auto max-w-[820px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-3 md:gap-8">
          {items.map(({ key, Icon }, i) => (
            <Reveal key={key} delay={i * 80}>
              <div className="flex flex-col gap-4">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[color:var(--c-accent-soft)] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                  <Icon />
                </div>
                <h3 className="t-h4">{t(`items.${key}.title`)}</h3>
                <p className="text-[15px] leading-[1.55] text-[color:var(--color-text-2)]">
                  {t(`items.${key}.body`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

import Image from "next/image";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { useMessages } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { routing, type Locale } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return buildLocalizedMetadata({
    locale: locale as Locale,
    pathname: "/about",
    title: t("title"),
    description: t("description"),
  });
}

type AboutShape = {
  about: {
    stack: Record<string, { title: string; items: string[] }>;
    languages: { lang: string; level: string }[];
  };
};

function StackGrid() {
  const messages = useMessages() as unknown as AboutShape;
  const entries = Object.entries(messages.about.stack);
  return (
    <div className="grid gap-8 md:grid-cols-3 lg:grid-cols-5">
      {entries.map(([key, block], i) => (
        <Reveal key={key} delay={i * 60}>
          <div className="border-t border-[color:var(--c-hairline)] pt-5">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">
              {block.title}
            </h3>
            <ul className="mt-4 space-y-2 text-[14.5px] text-[color:var(--color-text)]">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function LanguagesList() {
  const messages = useMessages() as unknown as AboutShape;
  const languages = messages.about.languages;
  return (
    <ul className="mt-6 divide-y divide-[color:var(--c-hairline)] border-y border-[color:var(--c-hairline)]">
      {languages.map((l) => (
        <li key={l.lang} className="flex items-baseline justify-between gap-4 py-4">
          <span className="text-[17px] font-medium tracking-[-0.013em]">{l.lang}</span>
          <span className="text-[14px] text-[color:var(--color-text-3)]">{l.level}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const headlineLines = t("headline").split("\n");

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Oleksandr Shuvalov",
    alternateName: "Alex Shuvalov",
    jobTitle: "Independent Senior Fullstack Developer",
    url: "https://buildbyalex.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Warsaw",
      addressCountry: "PL",
    },
    sameAs: [
      "https://www.linkedin.com/in/oleksandr-shuvalov",
      "https://t.me/sumotry",
    ],
    knowsLanguage: ["ru", "uk", "en", "pl"],
    email: "mailto:alex@buildbyalex.com",
    telephone: "+48453474944",
  };

  return (
    <>
      <Section pad="tight" className="!pt-12 md:!pt-20">
        <Container>
          <div className="grid items-start gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-7">
              <Reveal>
                <p className="t-eyebrow">{t("eyebrow")}</p>
                <h1 className="mt-3 text-[clamp(40px,5.5vw+8px,72px)] font-semibold leading-[1.06] tracking-[-0.032em]">
                  {headlineLines.map((line, i) => (
                    <span key={i} className="block">{line}</span>
                  ))}
                </h1>
                <p className="mt-6 max-w-[560px] text-[clamp(17px,1.2vw+13px,22px)] leading-[1.45] tracking-[-0.013em] text-[color:var(--color-text-2)]">
                  {t("lead")}
                </p>
              </Reveal>
            </div>
            <div className="md:col-span-5">
              <Reveal delay={150}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[color:var(--color-bg-alt)]">
                  <Image
                    src="https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1200&q=80"
                    alt="Alex Shuvalov — портрет"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <Section pad="default">
        <Container size="md">
          <div className="space-y-7">
            <Reveal>
              <p className="text-[17.5px] leading-[1.65] text-[color:var(--color-text)]">{t("p1")}</p>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-[17.5px] leading-[1.65] text-[color:var(--color-text)]">{t("p2")}</p>
            </Reveal>
            <Reveal delay={160}>
              <p className="text-[17.5px] leading-[1.65] text-[color:var(--color-text)]">{t("p3")}</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section pad="default" tone="alt">
        <Container>
          <Reveal>
            <h2 className="t-h2 mb-10 md:mb-14">{t("stackTitle")}</h2>
          </Reveal>
          <StackGrid />
        </Container>
      </Section>

      <Section pad="default">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              <div>
                <h2 className="t-h2">{t("languagesTitle")}</h2>
                <LanguagesList />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div>
                <h2 className="t-h2">{t("locationTitle")}</h2>
                <p className="mt-6 text-[17px] leading-[1.55] text-[color:var(--color-text-2)]">
                  {t("location")}
                </p>
                <h2 className="t-h2 mt-12">{t("linksTitle")}</h2>
                <ul className="mt-6 space-y-3 text-[16px]">
                  <li><a href="mailto:alex@buildbyalex.com" className="hover:text-[color:var(--c-accent)]">alex@buildbyalex.com</a></li>
                  <li><a href="https://t.me/sumotry" target="_blank" rel="noreferrer noopener" className="hover:text-[color:var(--c-accent)]">Telegram @sumotry ↗</a></li>
                  <li><a href="https://wa.me/48453474944" target="_blank" rel="noreferrer noopener" className="hover:text-[color:var(--c-accent)]">WhatsApp ↗</a></li>
                  <li><a href="tel:+48453474944" className="hover:text-[color:var(--c-accent)]">+48 453 474 944</a></li>
                  <li><a href="https://www.linkedin.com/in/oleksandr-shuvalov" target="_blank" rel="noreferrer noopener" className="hover:text-[color:var(--c-accent)]">LinkedIn ↗</a></li>
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section pad="default">
        <Container size="md">
          <Reveal>
            <div className="relative overflow-hidden rounded-[36px] bg-[#0A0A0A] px-8 py-14 text-center text-white md:px-12 md:py-20">
              <div
                className="pointer-events-none absolute -top-1/3 left-1/2 h-[120%] w-[120%] -translate-x-1/2 opacity-60"
                aria-hidden="true"
                style={{ background: "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(255,107,26,0.30), transparent 70%)" }}
              />
              <div className="relative z-10">
                <h2 className="text-[clamp(28px,3.6vw,42px)] font-semibold leading-[1.1] tracking-[-0.024em]">
                  {t("ctaTitle")}
                </h2>
                <p className="mx-auto mt-5 max-w-[520px] text-[16.5px] leading-[1.55] text-white/70">
                  {t("ctaBody")}
                </p>
                <div className="mt-8 flex justify-center">
                  <Button href="/contact" size="lg">{t("cta")}</Button>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </>
  );
}

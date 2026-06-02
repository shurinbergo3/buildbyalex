import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";
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
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return buildLocalizedMetadata({
    locale: locale as Locale,
    pathname: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });

  return (
    <Section pad="tight" className="!pt-16 md:!pt-24">
      <Container>
        <div className="grid gap-14 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <Reveal>
              <p className="t-eyebrow">{t("eyebrow")}</p>
              <h1 className="mt-3 text-[clamp(40px,5.5vw+8px,68px)] font-semibold leading-[1.06] tracking-[-0.032em]">
                {t("headline")}
              </h1>
              <p className="mt-5 text-[clamp(17px,1.2vw+13px,21px)] leading-[1.5] tracking-[-0.013em] text-[color:var(--color-text-2)] max-w-[440px]">
                {t("lead")}
              </p>
              <p className="mt-8 text-[13.5px] tracking-[0.02em] text-[color:var(--color-text-3)]">
                {t("responseTime")}
              </p>

              <div className="mt-12">
                <h2 className="t-eyebrow">{t("altTitle")}</h2>
                <ul className="mt-5 space-y-2.5 text-[15.5px]">
                  <li>
                    <a href="mailto:alex@buildbyalex.com" className="font-medium hover:text-[color:var(--c-accent)]">
                      alex@buildbyalex.com
                    </a>
                  </li>
                  <li>
                    <a href="https://t.me/sumotry" target="_blank" rel="noreferrer noopener" className="font-medium hover:text-[color:var(--c-accent)]">
                      Telegram @sumotry ↗
                    </a>
                  </li>
                  <li>
                    <a href="https://wa.me/48453474944" target="_blank" rel="noreferrer noopener" className="font-medium hover:text-[color:var(--c-accent)]">
                      WhatsApp ↗
                    </a>
                  </li>
                  <li>
                    <a href="tel:+48453474944" className="font-medium hover:text-[color:var(--c-accent)]">
                      +48 453 474 944
                    </a>
                  </li>
                  <li>
                    <a href="https://www.linkedin.com/in/oleksandr-shuvalov" target="_blank" rel="noreferrer noopener" className="font-medium hover:text-[color:var(--c-accent)]">
                      LinkedIn ↗
                    </a>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <Reveal delay={100}>
              <div className="rounded-[28px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] p-6 md:p-9">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}

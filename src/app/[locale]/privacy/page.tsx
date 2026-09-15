import type { Metadata } from "next";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { buildLocalizedMetadata } from "@/lib/metadata";
import { PRIVACY_POLICY } from "@/lib/privacy";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/Container";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) return {};
  const t = await getTranslations({ locale, namespace: "privacy.meta" });
  return buildLocalizedMetadata({
    locale: locale as Locale,
    pathname: "/privacy",
    title: t("title"),
    description: t("description"),
  });
}

const LINKABLE = /(https?:\/\/[^\s),]+|[\w.+-]+@[\w-]+\.[\w.]+\w)/g;

function renderText(text: string) {
  const lead = text.match(/^\*\*(.+?)\*\*\s*/);
  if (!lead) return linkify(text);
  return (
    <>
      <strong>{lead[1]}</strong> {linkify(text.slice(lead[0].length))}
    </>
  );
}

function linkify(text: string) {
  return text.split(LINKABLE).map((part, i) => {
    if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
    const href = part.includes("@") ? `mailto:${part}` : part;
    return (
      <a key={i} href={href} rel={part.includes("@") ? undefined : "noreferrer noopener"}>
        {part.replace(/^https:\/\//, "")}
      </a>
    );
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("privacy");
  const sections = PRIVACY_POLICY[locale as Locale];

  return (
    <>
      <PageHeader align="left" eyebrow={t("eyebrow")} headline={t("title")} lead={t("lead")} />
      <Container size="sm" className="pb-24 md:pb-32">
        <p className="text-[14px] text-[color:var(--color-text-3)]">
          {t("updated")}
          {locale !== "pl" && <> · {t("binding")}</>}
        </p>
        <div className="prose mt-10 max-w-none prose-headings:font-semibold prose-headings:tracking-[-0.02em] prose-headings:text-[color:var(--color-text)] prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-[clamp(22px,1.6vw+12px,28px)] prose-p:text-[color:var(--color-text-2)] prose-p:leading-[1.7] prose-li:text-[color:var(--color-text-2)] prose-li:leading-[1.6] prose-a:text-[color:var(--c-accent)] prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4 prose-strong:text-[color:var(--color-text)]">
          {sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.body.map((block, i) =>
                typeof block === "string" ? (
                  <p key={i}>{renderText(block)}</p>
                ) : (
                  <ul key={i}>
                    {block.list.map((item) => (
                      <li key={item}>{renderText(item)}</li>
                    ))}
                  </ul>
                ),
              )}
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}

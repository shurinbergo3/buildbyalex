import Image from "next/image";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { PageHeader } from "@/components/PageHeader";
import { FinalCTA } from "@/components/home/FinalCTA";
import { routing, type Locale } from "@/i18n/routing";
import { caseSlugs, caseKeyToSlug, caseImages } from "@/lib/cases";
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
  const t = await getTranslations({ locale, namespace: "work.intro" });
  return buildLocalizedMetadata({
    locale: locale as Locale,
    pathname: "/work",
    title: t("headline"),
    description: t("subhead"),
  });
}

export default async function WorkIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const intro = await getTranslations({ locale, namespace: "work.intro" });
  const tCases = await getTranslations({ locale, namespace: "work.cases" });

  return (
    <>
      <PageHeader eyebrow={intro("eyebrow")} headline={intro("headline")} lead={intro("subhead")} />

      <section className="pb-20 md:pb-28">
        <Container>
          <div className="grid gap-10 md:gap-12">
            {caseSlugs.map((key, i) => {
              const img = caseImages[key];
              const slug = caseKeyToSlug[key];
              return (
                <Reveal key={key} delay={i * 80}>
                  <Link
                    href={{ pathname: "/work/[slug]", params: { slug } }}
                    className="group grid items-center gap-8 overflow-hidden rounded-[28px] bg-[color:var(--color-bg-alt)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] md:grid-cols-2 md:gap-0"
                  >
                    <div className={`relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[380px] ${i % 2 === 1 ? "md:order-2" : ""}`}>
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="flex flex-col gap-5 p-8 md:p-12">
                      <p className="text-[12px] tracking-[0.04em] uppercase text-[color:var(--color-text-3)]">
                        {tCases(`${key}.industry`)}
                      </p>
                      <h2 className="t-h2">{tCases(`${key}.title`)}</h2>
                      <p className="text-[17px] leading-[1.5] text-[color:var(--color-text-2)] max-w-[44ch]">
                        {tCases(`${key}.tagline`)}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-medium text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                        →
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                          {tCases(`${key}.title`)}
                        </span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}

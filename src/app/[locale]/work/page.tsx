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
          <div className="grid gap-8 md:gap-10">
            {caseSlugs.map((key, i) => {
              const img = caseImages[key];
              const slug = caseKeyToSlug[key];
              return (
                <Reveal key={key} delay={i * 80}>
                  <Link
                    href={{ pathname: "/work/[slug]", params: { slug } }}
                    className="group grid items-stretch overflow-hidden rounded-[28px] bg-[color:var(--color-bg-elev)] shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)] md:grid-cols-2"
                  >
                    <div className={`relative aspect-[4/3] overflow-hidden md:aspect-auto md:h-full md:min-h-[400px] ${i % 2 === 1 ? "md:order-2" : ""}`}>
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                      <span className="absolute left-5 top-5 inline-flex items-center rounded-full border border-white/25 bg-black/30 px-3 py-1 font-mono text-[12px] tabular-nums text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
                        {String(i + 1).padStart(2, "0")} / {String(caseSlugs.length).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex flex-col gap-5 p-8 md:p-12">
                      <span className="inline-flex w-fit items-center gap-2 text-[12px] font-medium uppercase tracking-[0.04em] text-[color:var(--color-text-3)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]" aria-hidden="true" />
                        {tCases(`${key}.industry`)}
                      </span>
                      <h2 className="t-h2">{tCases(`${key}.title`)}</h2>
                      <p className="max-w-[46ch] text-[17px] leading-[1.5] text-[color:var(--color-text-2)]">
                        {tCases(`${key}.tagline`)}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[14px] font-medium text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                        {intro("cta")}
                        <svg width="15" height="15" viewBox="0 0 14 14" className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
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

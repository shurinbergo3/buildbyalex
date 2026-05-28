import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";

type WorkItem = {
  key: "legalwin" | "visionair" | "crmbot";
  slug: string;
  image: string;
  imageAlt: string;
};

const items: WorkItem[] = [
  {
    key: "legalwin",
    slug: "legalwin",
    image:
      "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Modern office building exterior in Warsaw — LegalWin case",
  },
  {
    key: "visionair",
    slug: "visionair",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Aerial drone photography over a coastline — VisionAir case",
  },
  {
    key: "crmbot",
    slug: "crm-bot",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Sales team workspace with laptops — CRM Bot case",
  },
];

export function FeaturedWork() {
  const t = useTranslations("home.work");
  return (
    <Section tone="default" pad="default" id="work">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[640px]">
              <p className="t-eyebrow">{t("eyebrow")}</p>
              <h2 className="mt-3 t-h2">{t("headline")}</h2>
              <p className="mt-4 t-body-lg">{t("subhead")}</p>
            </div>
            <Button href="/work" variant="ghost" size="md">
              {t("viewAll")}
            </Button>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.key} delay={i * 100}>
              <Link
                href={{ pathname: "/work/[slug]", params: { slug: item.slug } }}
                className="group block h-full"
              >
                <article className="flex h-full flex-col overflow-hidden rounded-[24px] bg-[color:var(--color-bg-alt)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
                    <p className="text-[12px] tracking-[0.04em] uppercase text-[color:var(--color-text-3)]">
                      {t(`items.${item.key}.industry`)}
                    </p>
                    <h3 className="t-h3">{t(`items.${item.key}.title`)}</h3>

                    <ul className="space-y-2 text-[14.5px] leading-[1.5] text-[color:var(--color-text-2)]">
                      <li className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--c-accent)]" />
                        {t(`items.${item.key}.result1`)}
                      </li>
                      <li className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--c-accent)]" />
                        {t(`items.${item.key}.result2`)}
                      </li>
                    </ul>

                    <span className="mt-auto inline-flex items-center gap-1 pt-2 text-[14px] font-medium text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                      {t("cta")}
                      <svg width="14" height="14" viewBox="0 0 14 14" className="transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true">
                        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </span>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

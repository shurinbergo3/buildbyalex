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
  const [featured, ...rest] = items;

  const Industry = ({ k }: { k: WorkItem["key"] }) => (
    <span className="inline-flex w-fit items-center gap-2 text-[12px] font-medium uppercase tracking-[0.04em] text-[color:var(--color-text-3)]">
      <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]" aria-hidden="true" />
      {t(`items.${k}.industry`)}
    </span>
  );

  const Cta = () => (
    <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[14px] font-medium text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
      {t("cta")}
      <svg width="15" height="15" viewBox="0 0 14 14" className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </span>
  );

  const indexBadge = (n: number) => (
    <span className="absolute left-5 top-5 inline-flex items-center rounded-full border border-white/25 bg-black/30 px-3 py-1 font-mono text-[12px] tabular-nums text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
      {String(n).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
    </span>
  );

  const cardClass =
    "group flex h-full flex-col overflow-hidden rounded-[24px] bg-[color:var(--color-bg-elev)] shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]";

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

        <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-2 md:items-stretch">
          {/* Featured case — image-led */}
          <Reveal>
            <Link
              href={{ pathname: "/work/[slug]", params: { slug: featured.slug } }}
              className={cardClass}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                {indexBadge(1)}
              </div>
              <div className="flex flex-1 flex-col gap-4 p-7 md:p-8">
                <Industry k={featured.key} />
                <h3 className="t-h3">{t(`items.${featured.key}.title`)}</h3>
                <ul className="space-y-2 text-[15px] leading-[1.5] text-[color:var(--color-text-2)]">
                  <li className="flex gap-2.5">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--c-accent)]" />
                    {t(`items.${featured.key}.result1`)}
                  </li>
                  <li className="flex gap-2.5">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--c-accent)]" />
                    {t(`items.${featured.key}.result2`)}
                  </li>
                </ul>
                <Cta />
              </div>
            </Link>
          </Reveal>

          {/* Two stacked cases — horizontal */}
          <div className="grid gap-6">
            {rest.map((item, i) => (
              <Reveal key={item.key} delay={(i + 1) * 100}>
                <Link
                  href={{ pathname: "/work/[slug]", params: { slug: item.slug } }}
                  className={`${cardClass} sm:flex-row`}
                >
                  <div className="relative aspect-[16/10] shrink-0 overflow-hidden sm:aspect-auto sm:w-[42%]">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                    {indexBadge(i + 2)}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
                    <Industry k={item.key} />
                    <h3 className="t-h4 font-[number:var(--fw-semi)]">{t(`items.${item.key}.title`)}</h3>
                    <ul className="space-y-1.5 text-[14px] leading-[1.45] text-[color:var(--color-text-2)]">
                      <li className="flex gap-2.5">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--c-accent)]" />
                        {t(`items.${item.key}.result1`)}
                      </li>
                      <li className="flex gap-2.5">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--c-accent)]" />
                        {t(`items.${item.key}.result2`)}
                      </li>
                    </ul>
                    <Cta />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

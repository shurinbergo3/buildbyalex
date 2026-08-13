import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  serviceToCases,
  caseKeyToSlug,
  caseImages,
  type ServiceBranch,
} from "@/lib/cases";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/**
 * "Related work" block for a service page — pulls the cases mapped to this
 * branch (see `serviceToCases`) and renders compact, image-forward links to
 * each case study. Renders nothing when the branch has no mapped cases, so
 * services without matching work (e.g. ads) simply omit the section.
 */
export function ServiceRelatedCases({
  branch,
  tone = "alt",
}: {
  branch: ServiceBranch;
  tone?: "default" | "alt";
}) {
  const keys = serviceToCases[branch];
  const t = useTranslations(`services.${branch}`);
  const tCases = useTranslations("work.cases");
  const tIntro = useTranslations("work.intro");

  if (!keys.length) return null;

  return (
    <Section pad="default" tone={tone}>
      <Container>
        <Reveal>
          <h2 className="t-h2 mb-6 md:mb-8">{t("cases")}</h2>
        </Reveal>
        <div
          className={`grid gap-3 sm:gap-4 ${
            keys.length > 1 ? "sm:grid-cols-2" : "max-w-[480px]"
          }`}
        >
          {/* min-w-0 on the grid item: items default to min-width:auto, so the
              card's min-content (fixed-width thumb + nowrap truncated title)
              would push the whole page sideways on narrow phones. */}
          {keys.map((key, i) => (
            <Reveal key={key} delay={i * 70} className="min-w-0">
              <Link
                href={{ pathname: "/work/[slug]", params: { slug: caseKeyToSlug[key] } }}
                aria-label={`${tCases(`${key}.title`)} — ${tCases(`${key}.industry`)}`}
                className="group flex items-stretch overflow-hidden rounded-[18px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[color:color-mix(in_srgb,var(--c-accent)_45%,var(--c-hairline))] hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="relative w-[104px] shrink-0 overflow-hidden sm:w-[124px]">
                  <Image
                    src={caseImages[key].src}
                    alt={tCases(`${key}.imageAlt`)}
                    fill
                    sizes="124px"
                    className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-4 py-3.5 sm:px-5">
                  {/* No w-fit here: fit-content never shrinks below min-content,
                      so with a nowrap label the row stayed wider than the column
                      and the text got cut by the card instead of ellipsized. */}
                  <span className="inline-flex min-w-0 items-center gap-1.5 text-[10.5px] font-medium uppercase tracking-[0.06em] text-[color:var(--color-text-2)]">
                    <span
                      className="h-1 w-1 shrink-0 rounded-full bg-[color:var(--c-accent)]"
                      aria-hidden="true"
                    />
                    {/* min-w-0 so the flex item can shrink and actually
                        ellipsize instead of being clipped by the card. */}
                    <span className="min-w-0 truncate">{tCases(`${key}.industry`)}</span>
                  </span>
                  <h3 className="truncate text-[16px] font-semibold leading-[1.2] tracking-[-0.02em] text-[color:var(--color-text)] sm:text-[17px]">
                    {tCases(`${key}.title`)}
                  </h3>
                  <p className="line-clamp-1 text-[13px] leading-[1.4] text-[color:var(--color-text-2)]">
                    {tCases(`${key}.tagline`)}
                  </p>
                  <div className="mt-1 flex items-center gap-2.5">
                    <span className="inline-flex min-w-0 items-baseline gap-1 text-[13px]">
                      <span className="shrink-0 whitespace-nowrap font-mono font-semibold tabular-nums tracking-tight text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                        {tCases(`${key}.metric.value`)}
                      </span>
                      <span className="truncate text-[11px] text-[color:var(--color-text-2)]">
                        {tCases(`${key}.metric.label`)}
                      </span>
                    </span>
                    {/* On a 390px phone the text column is ~200px wide — the CTA
                        label would wrap and shove the arrow off the card, so
                        below sm only the arrow stays. */}
                    <span className="ml-auto inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[12.5px] font-medium text-[color:var(--color-text)]">
                      <span className="hidden sm:inline">{tIntro("cta")}</span>
                      <span className="grid h-5 w-5 place-items-center rounded-full border border-[color:var(--c-hairline)] transition-[transform,background-color,border-color,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:border-[color:var(--c-accent)] group-hover:bg-[color:var(--c-accent)] group-hover:text-white">
                        <svg width="11" height="11" viewBox="0 0 14 14" aria-hidden="true">
                          <path
                            d="M5 3l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

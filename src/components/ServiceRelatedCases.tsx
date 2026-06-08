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
          <h2 className="t-h2 mb-10 md:mb-12">{t("cases")}</h2>
        </Reveal>
        <div
          className={`grid gap-4 sm:gap-5 ${
            keys.length > 1 ? "md:grid-cols-2 md:gap-6" : ""
          }`}
        >
          {keys.map((key, i) => (
            <Reveal key={key} delay={i * 70}>
              <Link
                href={{ pathname: "/work/[slug]", params: { slug: caseKeyToSlug[key] } }}
                aria-label={`${tCases(`${key}.title`)} — ${tCases(`${key}.industry`)}`}
                className="group relative flex aspect-[16/11] flex-col justify-end overflow-hidden rounded-[24px] border border-[color:var(--c-hairline)] bg-[#0b0b0c] shadow-[var(--shadow-card)] transition-[box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[var(--shadow-card-hover)] md:rounded-[28px]"
              >
                <Image
                  src={caseImages[key].src}
                  alt={tCases(`${key}.imageAlt`)}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="absolute inset-0 object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(6,7,9,0.90) 2%, rgba(6,7,9,0.42) 42%, rgba(6,7,9,0.04) 72%, transparent 100%)",
                  }}
                />
                <div className="relative z-10 flex flex-col gap-2.5 p-5 md:p-7">
                  <span className="inline-flex w-fit items-center gap-2 text-[12px] font-medium uppercase tracking-[0.05em] text-white/65">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]"
                      aria-hidden="true"
                    />
                    {tCases(`${key}.industry`)}
                  </span>
                  <h3 className="text-[clamp(22px,1.4vw+15px,30px)] font-semibold leading-[1.05] tracking-[-0.028em] text-white">
                    {tCases(`${key}.title`)}
                  </h3>
                  <p className="line-clamp-2 max-w-[46ch] text-[14.5px] leading-[1.45] text-white/72">
                    {tCases(`${key}.tagline`)}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[24px] font-semibold tabular-nums tracking-tight text-[color:var(--c-accent)]">
                        {tCases(`${key}.metric.value`)}
                      </span>
                      <span className="max-w-[16ch] text-[12px] leading-[1.2] text-white/55">
                        {tCases(`${key}.metric.label`)}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[14px] font-medium text-white">
                      {tIntro("cta")}
                      <span className="grid h-6 w-6 place-items-center rounded-full border border-white/25 bg-white/[0.08] transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:border-[color:var(--c-accent)] group-hover:bg-[color:var(--c-accent)] group-hover:text-black">
                        <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                          <path
                            d="M5 3l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.7"
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

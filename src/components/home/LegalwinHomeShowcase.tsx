import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { GoogleSerpMock } from "@/components/GoogleSerpMock";
import { ChatGPTRecommendMock } from "@/components/ChatGPTRecommendMock";

export function LegalwinHomeShowcase() {
  const t = useTranslations("home.legalwinShowcase");

  const metrics = [
    { value: t("metrics.0.value"), label: t("metrics.0.label") },
    { value: t("metrics.1.value"), label: t("metrics.1.label") },
    { value: t("metrics.2.value"), label: t("metrics.2.label") },
  ];

  return (
    <Section tone="ink" pad="loose" id="legalwin-showcase">
      <Container>
        {/* ── Editorial header ────────────────────────────── */}
        <Reveal>
          <div className="mx-auto max-w-[820px] text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[color:var(--c-accent)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]" />
              {t("eyebrow")}
            </p>
            <h2 className="mt-6 text-[clamp(36px,5vw+8px,64px)] font-semibold leading-[1.04] tracking-[-0.032em] text-white">
              {t.rich("headline", {
                accent: (chunks) => (
                  <span className="hl-accent">{chunks}</span>
                ),
                br: () => <br />,
              })}
            </h2>
            <p className="mx-auto mt-6 max-w-[640px] text-[17px] leading-[1.55] text-white/65">
              {t("subhead")}
            </p>
          </div>
        </Reveal>

        {/* ── KPI strip ───────────────────────────────────── */}
        <Reveal delay={120}>
          <ul className="mx-auto mt-14 grid max-w-[820px] grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-x-10">
            {metrics.map((m, i) => (
              <li
                key={i}
                className="flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <span
                  className="text-[clamp(40px,4vw+10px,56px)] font-semibold leading-none tracking-[-0.035em] text-white"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, #ffffff 0%, #a1a1a6 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {m.value}
                </span>
                <span className="mt-3 text-[13.5px] leading-[1.4] text-white/55">
                  {m.label}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ── Dual-mock presentation ──────────────────────── */}
        <div className="mt-20 grid gap-12 md:mt-24 md:grid-cols-2 md:gap-8 lg:gap-12">
          <Reveal delay={180}>
            <ShowcaseColumn
              index={t("columns.serp.index")}
              label={t("columns.serp.label")}
              caption={t("columns.serp.caption")}
            >
              <GoogleSerpMock />
            </ShowcaseColumn>
          </Reveal>

          <Reveal delay={260}>
            <ShowcaseColumn
              index={t("columns.chatgpt.index")}
              label={t("columns.chatgpt.label")}
              caption={t("columns.chatgpt.caption")}
            >
              <ChatGPTRecommendMock />
            </ShowcaseColumn>
          </Reveal>
        </div>

        {/* ── CTA ─────────────────────────────────────────── */}
        <Reveal delay={340}>
          <div className="mt-16 flex flex-col items-center gap-4 md:mt-20">
            <p className="text-[14px] text-white/50">{t("cta.tag")}</p>
            <Link
              href={{ pathname: "/work/[slug]", params: { slug: "legalwin" } }}
              className="group inline-flex items-center gap-2 rounded-full bg-white/95 px-6 py-3 text-[15px] font-medium leading-none tracking-[-0.011em] text-[color:#0A0A0A] transition-[transform,background] duration-300 ease-[cubic-bezier(0.28,0.11,0.32,1)] hover:bg-white active:translate-y-[1px]"
            >
              {t("cta.label")}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                aria-hidden="true"
                className="transition-transform duration-300 ease-[cubic-bezier(0.28,0.11,0.32,1)] group-hover:translate-x-1"
              >
                <path
                  d="M5 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </Link>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

function ShowcaseColumn({
  index,
  label,
  caption,
  children,
}: {
  index: string;
  label: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[12px] tracking-[0.08em] text-white/40">
          {index}
        </span>
        <span className="h-px flex-1 bg-white/12" />
        <span className="text-[13px] font-medium tracking-[-0.011em] text-white/80">
          {label}
        </span>
      </div>

      <div className="legalwin-stage">{children}</div>

      <p className="text-[13.5px] leading-[1.5] text-white/55">{caption}</p>
    </div>
  );
}

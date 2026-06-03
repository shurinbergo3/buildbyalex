import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { Link } from "@/i18n/navigation";
import { GoogleSerpMock } from "@/components/GoogleSerpMock";
import { ChatGPTRecommendMock } from "@/components/ChatGPTRecommendMock";
import { PhoneLeadsMock } from "@/components/PhoneLeadsMock";

// Soft elevation used for the mock panels — sits cleanly on the light section.
const PANEL =
  "border border-[color:var(--color-divider)] bg-[color:var(--color-bg-alt)] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_24px_56px_-20px_rgba(16,24,40,0.16)]";

export function LegalwinHomeShowcase() {
  const t = useTranslations("home.legalwinShowcase");

  const metrics = [
    { value: t("metrics.0.value"), label: t("metrics.0.label") },
    { value: t("metrics.1.value"), label: t("metrics.1.label") },
    { value: t("metrics.2.value"), label: t("metrics.2.label") },
  ];

  const flowSteps = [t("flow.steps.0"), t("flow.steps.1"), t("flow.steps.2")];

  const annotations = [
    {
      title: t("result.annotations.0.title"),
      sub: t("result.annotations.0.sub"),
      icon: "bolt" as const,
    },
    {
      title: t("result.annotations.1.title"),
      sub: t("result.annotations.1.sub"),
      icon: "globe" as const,
    },
    {
      title: t("result.annotations.2.title"),
      sub: t("result.annotations.2.sub"),
      icon: "scale" as const,
    },
  ];

  return (
    <Section tone="default" pad="loose" id="legalwin-showcase">
      <Container>
        {/* ── Editorial header ────────────────────────────── */}
        <Reveal>
          <div className="mx-auto max-w-[820px] text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[color:var(--c-accent-ink)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--c-accent)]" />
              {t("eyebrow")}
            </p>
            <h2 className="mt-6 text-[clamp(36px,5vw+8px,64px)] font-semibold leading-[1.04] tracking-[-0.032em] text-[color:var(--color-text)]">
              {t.rich("headline", {
                accent: (chunks) => <span className="hl-accent">{chunks}</span>,
                br: () => <br />,
              })}
            </h2>
            <p className="mx-auto mt-6 max-w-[640px] text-[17px] leading-[1.55] text-[color:var(--color-text-2)]">
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
                  className="text-[clamp(40px,4vw+10px,56px)] font-semibold leading-none tracking-[-0.035em]"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, #1d1d1f 0%, #6e6e73 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {m.value}
                </span>
                <span className="mt-3 text-[13.5px] leading-[1.4] text-[color:var(--color-text-3)]">
                  {m.label}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ── "How it works" flow legend ──────────────────── */}
        <Reveal delay={180}>
          <div className="mx-auto mt-16 max-w-[860px] md:mt-20">
            <p className="text-center text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--color-text-3)]">
              {t("flow.title")}
            </p>
            <ol className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2">
              {flowSteps.map((step, i) => (
                <li key={i} className="flex flex-1 items-center gap-3">
                  <div className="flex flex-1 items-center gap-3 rounded-2xl border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] px-4 py-3.5">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-[color:var(--c-accent)]/50 text-[11px] font-semibold text-[color:var(--c-accent-ink)]">
                      {i + 1}
                    </span>
                    <span className="text-[13px] leading-[1.35] text-[color:var(--color-text-2)]">
                      {step}
                    </span>
                  </div>
                  {i < flowSteps.length - 1 && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      aria-hidden
                      className="hidden shrink-0 text-[color:var(--color-text-3)] sm:block"
                    >
                      <path
                        d="M6 3l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        {/* ── Discovery: stacked, one channel after another ─── */}
        <Reveal delay={220}>
          <div
            className={`mt-16 overflow-hidden rounded-[28px] p-5 sm:p-8 md:mt-20 md:p-10 ${PANEL}`}
          >
            <div className="flex flex-col gap-14 md:gap-20">
              <ShowcaseRow
                index={t("columns.serp.index")}
                label={t("columns.serp.label")}
                caption={t("columns.serp.caption")}
              >
                <GoogleSerpMock />
              </ShowcaseRow>

              {/* sequence connector — same client, the next channel */}
              <div className="flex flex-col items-center -my-6 md:-my-10" aria-hidden="true">
                <span className="h-8 w-px bg-gradient-to-b from-[color:var(--color-divider)] to-transparent md:h-12" />
                <svg width="18" height="18" viewBox="0 0 16 16" className="-mt-1 text-[color:var(--color-text-3)]">
                  <path d="M8 3v8m0 0L4.5 7.5M8 11l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>

              <ShowcaseRow
                index={t("columns.chatgpt.index")}
                label={t("columns.chatgpt.label")}
                caption={t("columns.chatgpt.caption")}
              >
                <ChatGPTRecommendMock />
              </ShowcaseRow>
            </div>
          </div>
        </Reveal>

        {/* ── Connector to the result ─────────────────────── */}
        <Reveal delay={120}>
          <div className="mx-auto mt-16 flex max-w-[520px] flex-col items-center md:mt-20">
            <span className="h-10 w-px bg-gradient-to-b from-transparent to-[color:var(--color-divider)]" />
            <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--c-accent)]/30 bg-[color:var(--c-accent-soft)] px-4 py-1.5 text-[12px] font-medium text-[color:var(--c-accent-ink)]">
              {t("result.connector")}
            </span>
          </div>
        </Reveal>

        {/* ── Result: phone leads ─────────────────────────── */}
        <Reveal delay={160}>
          <div
            className={`mt-10 overflow-hidden rounded-[32px] p-6 sm:p-10 md:mt-12 md:p-14 ${PANEL}`}
          >
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
              {/* Explanation side */}
              <div className="order-2 lg:order-1">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[12px] tracking-[0.08em] text-[color:var(--color-text-3)]">
                    {t("columns.leads.index")}
                  </span>
                  <span className="h-px flex-1 bg-[color:var(--color-divider)]" />
                  <span className="text-[13px] font-medium tracking-[-0.011em] text-[color:var(--color-text)]">
                    {t("columns.leads.label")}
                  </span>
                </div>

                <h3 className="mt-7 text-[clamp(24px,2vw+12px,34px)] font-semibold leading-[1.12] tracking-[-0.022em] text-[color:var(--color-text)]">
                  {t("result.headline")}
                </h3>
                <p className="mt-4 max-w-[440px] text-[15.5px] leading-[1.55] text-[color:var(--color-text-2)]">
                  {t("result.subhead")}
                </p>

                <ul className="mt-8 flex flex-col gap-5">
                  {annotations.map((a, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] text-[color:var(--c-accent-ink)]">
                        <AnnotationIcon name={a.icon} />
                      </span>
                      <div>
                        <p className="text-[14.5px] font-medium leading-snug text-[color:var(--color-text)]">
                          {a.title}
                        </p>
                        <p className="mt-1 text-[13px] leading-[1.5] text-[color:var(--color-text-3)]">
                          {a.sub}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Phone */}
              <div className="order-1 lg:order-2">
                <PhoneLeadsMock />
                <p className="mx-auto mt-6 max-w-[300px] text-center text-[13px] leading-[1.5] text-[color:var(--color-text-3)]">
                  {t("columns.leads.caption")}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ── CTA ─────────────────────────────────────────── */}
        <Reveal delay={120}>
          <div className="mt-16 flex flex-col items-center gap-4 md:mt-20">
            <p className="text-[14px] text-[color:var(--color-text-3)]">
              {t("cta.tag")}
            </p>
            <Link
              href={{ pathname: "/work/[slug]", params: { slug: "legalwin" } }}
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--color-text)] px-6 py-3 text-[15px] font-medium leading-none tracking-[-0.011em] text-[color:var(--color-bg)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.28,0.11,0.32,1)] hover:opacity-90 active:translate-y-[1px]"
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

function ShowcaseRow({
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
    <div className="flex flex-col gap-5">
      {/* label bar — aligned to the mock's natural width so it reads as a titled window */}
      <div className="mx-auto flex w-full max-w-[860px] items-baseline gap-4">
        <span className="font-mono text-[12px] tracking-[0.08em] text-[color:var(--color-text-3)]">
          {index}
        </span>
        <span className="h-px flex-1 bg-[color:var(--color-divider)]" />
        <span className="text-[13.5px] font-medium tracking-[-0.011em] text-[color:var(--color-text)]">
          {label}
        </span>
      </div>

      <div className="legalwin-stage">{children}</div>

      <p className="mx-auto max-w-[620px] text-center text-[13.5px] leading-[1.5] text-[color:var(--color-text-2)]">
        {caption}
      </p>
    </div>
  );
}

function AnnotationIcon({ name }: { name: "bolt" | "globe" | "scale" }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "bolt")
    return (
      <svg {...common}>
        <path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13l0-8z" />
      </svg>
    );
  if (name === "globe")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9.5" />
        <path d="M2.5 12h19M12 2.5c2.8 2.4 4.2 5.9 4.2 9.5S14.8 19.1 12 21.5C9.2 19.1 7.8 15.6 7.8 12S9.2 4.9 12 2.5z" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M12 3v18M6 21h12M5 7h14M9 7l-3.5 6.5h7L9 7zm6 0l-3.5 6.5h7L15 7z" />
      <circle cx="12" cy="4.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

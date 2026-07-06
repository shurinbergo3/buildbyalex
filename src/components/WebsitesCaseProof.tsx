import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/* Before/after deep dive on one real project (VisionAir): hard numbers on a
   dark stage, the x5 headline metric, the client quote and a link to the full
   case study. */

type Row = { label: string; before: string; after: string };

const AMBER = "#FF7A2D";
const GREEN = "#34d27b";

export function WebsitesCaseProof() {
  const t = useTranslations("services.websites.caseProof");
  const rows = t.raw("rows") as Row[];

  return (
    <Section pad="default" tone="alt">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
            <p className="mx-auto mt-5 max-w-[640px] t-body-lg">{t("sub")}</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mt-12 overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0A0A0B] md:mt-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(52% 60% at 18% 0%, rgba(255,122,45,0.15), transparent 70%), radial-gradient(40% 40% at 92% 100%, rgba(255,122,45,0.07), transparent 70%)",
              }}
            />
            <div className="relative grid gap-10 p-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14 md:p-12">
              {/* headline metric + quote */}
              <div className="flex flex-col">
                <p
                  className="text-[clamp(72px,9vw,120px)] font-semibold leading-none tracking-[-0.04em]"
                  style={{
                    background: `linear-gradient(165deg, #fff 30%, ${AMBER})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {t("growth")}
                </p>
                <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.1em] text-white/50">
                  {t("growthLabel")}
                </p>

                <blockquote className="mt-8 border-l-2 pl-4" style={{ borderColor: AMBER }}>
                  <p className="text-[15.5px] leading-[1.6] text-white/80">«{t("quote")}»</p>
                  <footer className="mt-3 text-[13px] text-white/45">{t("quoteAuthor")}</footer>
                </blockquote>

                <div className="mt-auto pt-8">
                  <Link
                    href={{ pathname: "/work/[slug]", params: { slug: "visionair" } }}
                    className="group inline-flex items-center gap-2 text-[15px] font-medium text-white"
                  >
                    {t("cta")}
                    <span className="grid h-6 w-6 place-items-center rounded-full border border-white/25 bg-white/[0.08] transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:border-[color:var(--c-accent)] group-hover:bg-[color:var(--c-accent)] group-hover:text-black">
                      <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>

              {/* before → after rows */}
              <div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto_24px_auto] items-center gap-x-3 pb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-white/40 md:gap-x-5">
                  <span />
                  <span className="text-right">{t("beforeLabel")}</span>
                  <span />
                  <span className="min-w-[64px] text-right">{t("afterLabel")}</span>
                </div>
                <ul>
                  {rows.map((row, i) => (
                    <Reveal as="li" key={row.label} delay={i * 80} className="border-t border-white/[0.08]">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto_24px_auto] items-center gap-x-3 py-4 md:gap-x-5 md:py-5">
                        <span className="text-[14.5px] leading-snug text-white/70">{row.label}</span>
                        <span className="text-right font-mono text-[17px] font-medium tabular-nums text-white/35 line-through decoration-white/25 md:text-[19px]">
                          {row.before}
                        </span>
                        <svg className="justify-self-center" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={AMBER} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <path d="M4 12h15M13 6l6 6-6 6" />
                        </svg>
                        <span
                          className="min-w-[64px] text-right font-mono text-[19px] font-semibold tabular-nums md:text-[22px]"
                          style={{
                            background: `linear-gradient(165deg, #fff, ${AMBER})`,
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                          }}
                        >
                          {row.after}
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </ul>

                <div className="mt-4 inline-flex items-start gap-2 rounded-2xl border border-white/[0.09] bg-white/[0.04] px-4 py-3">
                  <span className="relative mt-[5px] flex h-1.5 w-1.5 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" style={{ background: GREEN }} />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: GREEN }} />
                  </span>
                  <p className="text-[13px] leading-[1.5] text-white/60">{t("note")}</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

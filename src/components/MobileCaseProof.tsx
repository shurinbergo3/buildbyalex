import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { caseKeyToSlug } from "@/lib/cases";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { BodyForgeHeroMock } from "./BodyForgeHeroMock";

/* Body Forge deep dive on the mobile-apps page: the real app running in an
   iPhone frame (same footage as the case study), shipped-to-App-Store proof,
   metrics and the client quote. Copy is pulled straight from the case-study
   messages, so it stays in sync and needs no extra translations. */

const LIME = "#C8FF00";

type Metric = { value: string; label: string };

const APPLE_PATH =
  "M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z";

export function MobileCaseProof() {
  const t = useTranslations("services.mobile.caseProof");
  const tc = useTranslations("work.cases.bodyforge");
  const tm = useTranslations("work.caseMetrics");

  const results = (tc.raw("results") as string[]).slice(0, 3);
  const metrics = tm.raw("bodyforge") as Metric[];
  const appUrl = `https://${tc("url").split("/id")[0]}/id${tc("url").split("/id")[1]}`;

  return (
    <Section pad="default" tone="alt">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
            <p className="mx-auto mt-5 max-w-[620px] t-body-lg">{t("sub")}</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mt-12 overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0A0A0B] md:mt-14">
            {/* lime aurora — Body Forge's own accent, not the site amber */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(50% 58% at 22% 8%, rgba(200,255,0,0.10), transparent 70%), radial-gradient(42% 44% at 90% 96%, rgba(200,255,0,0.06), transparent 70%)",
              }}
            />
            <div className="relative grid items-center gap-4 p-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12 md:p-10">
              {/* the real app, on video */}
              <div className="mx-auto w-full max-w-[340px]">
                <BodyForgeHeroMock />
              </div>

              <div>
                <span className="inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.05em] text-white/60">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: LIME }} />
                  {tc("industry")}
                </span>
                <h3 className="mt-3 text-[clamp(26px,2.2vw+16px,38px)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
                  {tc("title")}
                </h3>
                <p className="mt-4 max-w-[520px] text-[15.5px] leading-[1.6] text-white/70">{tc("tagline")}</p>

                <ul className="mt-6 space-y-2.5">
                  {results.map((r) => (
                    <li key={r} className="flex gap-2.5 text-[14.5px] leading-[1.5] text-white/80">
                      <svg className="mt-[4px] h-3.5 w-3.5 shrink-0" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                        <path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke={LIME} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 grid max-w-[460px] grid-cols-3 gap-3 border-t border-white/[0.08] pt-6">
                  {metrics.map((m) => (
                    <div key={m.label}>
                      <p
                        className="text-[clamp(18px,1.4vw+11px,24px)] font-semibold leading-none tracking-[-0.02em]"
                        style={{
                          background: `linear-gradient(165deg, #fff 40%, ${LIME})`,
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {m.value}
                      </p>
                      <p className="mt-1.5 text-[10.5px] font-medium uppercase leading-tight tracking-[0.06em] text-white/45">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>

                <blockquote className="mt-6 border-l-2 pl-4" style={{ borderColor: LIME }}>
                  <p className="text-[14.5px] leading-[1.6] text-white/75">«{tc("quote")}»</p>
                  <footer className="mt-2 text-[12.5px] text-white/45">{tc("quoteAuthor")}</footer>
                </blockquote>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={{ pathname: "/work/[slug]", params: { slug: caseKeyToSlug.bodyforge } }}
                    className="group inline-flex items-center gap-2 text-[15px] font-medium text-white"
                  >
                    {t("cta")}
                    <span className="grid h-6 w-6 place-items-center rounded-full border border-white/25 bg-white/[0.08] transition-[transform,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:border-[#C8FF00] group-hover:bg-[#C8FF00] group-hover:text-black">
                      <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    </span>
                  </Link>
                  <a
                    href={appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-[#0b0b0e]/80 px-3.5 py-2 shadow-[0_14px_34px_-16px_rgba(0,0,0,0.85)] transition-colors hover:border-white/25"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden className="flex-none">
                      <path d={APPLE_PATH} />
                    </svg>
                    <span className="text-left leading-none">
                      <span className="block text-[7.5px] font-medium uppercase tracking-[0.08em] text-white/50">
                        {t("storeSub")}
                      </span>
                      <span className="mt-0.5 block text-[12px] font-semibold tracking-[-0.01em] text-white">App Store</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

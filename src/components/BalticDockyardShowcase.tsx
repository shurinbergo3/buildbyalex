"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

const ACCENT = "#22B3D6"; // Baltic Dockyard brand cyan, deepened for light-bg legibility

/* Framed browser-window screenshot — a macOS-style chrome bar with the live URL,
   the shipped page rendered inside. Shared across every proof section. */
function Frame({
  src,
  label = "baltic-dockyard.pl",
  ratio = "16 / 10",
  path = "",
}: {
  src: string;
  label?: string;
  ratio?: string;
  path?: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[980px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 opacity-70"
        style={{ background: "radial-gradient(60% 60% at 50% 30%, rgba(34,179,214,0.14), transparent 70%)" }}
      />
      <div className="overflow-hidden rounded-[16px] border border-[color:var(--c-hairline)] bg-[#0b0f14] shadow-[0_40px_80px_-40px_rgba(4,12,20,0.55)]">
        <div className="flex items-center gap-3 border-b border-white/[0.06] bg-[#101620] px-4 py-2.5">
          <span className="flex gap-1.5">
            <span className="h-[10px] w-[10px] rounded-full bg-[#ff5f57]" />
            <span className="h-[10px] w-[10px] rounded-full bg-[#febc2e]" />
            <span className="h-[10px] w-[10px] rounded-full bg-[#28c840]" />
          </span>
          <span className="mx-auto flex items-center gap-1.5 rounded-md bg-white/[0.05] px-3 py-1 text-[12px] text-white/55">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            {label}
            {path && <span className="text-white/35">{path}</span>}
          </span>
          <span className="w-8" />
        </div>
        <div className="relative overflow-hidden" style={{ aspectRatio: ratio }}>
          <Image
            src={src}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 1024px) 92vw, 980px"
            className="object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, headline, subhead }: { eyebrow: string; headline: string; subhead: string }) {
  return (
    <div className="mx-auto max-w-[760px] text-center">
      <p className="t-eyebrow" style={{ color: ACCENT }}>
        {eyebrow}
      </p>
      <h2 className="mt-3 text-[clamp(28px,3vw+12px,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-[color:var(--color-text-1)]">
        {headline}
      </h2>
      <p className="mx-auto mt-5 max-w-[620px] text-[17px] leading-[1.55] text-[color:var(--color-text-2)]">
        {subhead}
      </p>
    </div>
  );
}

/* Icons — inline, single-family (Lucide-style, 1.7 stroke). Order matches the
   five delivered services. */
const ICONS = [
  // site
  <svg key="i0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>,
  // corporate email
  <svg key="i1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
  // lead routing (inbox / arrow-in)
  <svg key="i2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 13v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M4 13l3-8h10l3 8M4 13h4l1.5 3h5l1.5-3h4" /></svg>,
  // SEO (search + trend)
  <svg key="i3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3M8.5 11.5l2 2 3.5-4" /></svg>,
  // articles (file-text)
  <svg key="i4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></svg>,
];

export function BalticDockyardShowcase() {
  const t = useTranslations("work.caseShowcase.baltic");
  const items = t.raw("deliverables.items") as { title: string; desc: string }[];
  const steps = t.raw("inbox.steps") as { k: string; v: string }[];
  const signals = t.raw("seo.signals") as string[];

  return (
    <>
      {/* ── What was delivered ── */}
      <Section pad="default" tone="alt">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-[760px] text-center">
              <p className="t-eyebrow" style={{ color: ACCENT }}>
                {t("deliverables.eyebrow")}
              </p>
              <h2 className="mt-3 text-[clamp(28px,3vw+12px,44px)] font-medium leading-[1.1] tracking-[-0.02em] text-[color:var(--color-text-1)]">
                {t("deliverables.headline")}
              </h2>
              <p className="mx-auto mt-5 max-w-[620px] text-[17px] leading-[1.55] text-[color:var(--color-text-2)]">
                {t("deliverables.subhead")}
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 md:mt-14">
              {items.map((it, i) => (
                <li
                  key={it.title}
                  className="group relative flex flex-col rounded-[20px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] p-5 shadow-[var(--shadow-card)] transition-colors"
                >
                  <span
                    className="grid h-11 w-11 place-items-center rounded-[13px] text-[color:var(--color-bg-elev)]"
                    style={{ background: ACCENT }}
                  >
                    <span className="h-[22px] w-[22px]">{ICONS[i]}</span>
                  </span>
                  <span className="mt-4 flex items-center gap-2 text-[15.5px] font-semibold tracking-[-0.01em] text-[color:var(--color-text-1)]">
                    <span
                      className="font-mono text-[12px] tabular-nums"
                      style={{ color: ACCENT }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {it.title}
                  </span>
                  <span className="mt-1.5 text-[13.5px] leading-[1.5] text-[color:var(--color-text-2)]">
                    {it.desc}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* ── The site + catalog ── */}
      <Section pad="default">
        <Container>
          <Reveal>
            <SectionHead eyebrow={t("site.eyebrow")} headline={t("site.headline")} subhead={t("site.subhead")} />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 md:mt-16">
              <Frame src="/cases/baltic-catalog.webp" path=" /catalog" ratio="1760 / 1100" />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── Corporate email + inbound leads ── */}
      <Section pad="default" tone="alt">
        <Container>
          <Reveal>
            <SectionHead eyebrow={t("inbox.eyebrow")} headline={t("inbox.headline")} subhead={t("inbox.subhead")} />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 md:mt-16">
              <Frame src="/cases/baltic-rfq.webp" path=" /contact" ratio="1760 / 940" />
            </div>
          </Reveal>
          <Reveal delay={180}>
            <ol className="mx-auto mt-10 grid max-w-[880px] gap-4 sm:grid-cols-3">
              {steps.map((s, i) => (
                <li
                  key={s.k}
                  className="relative rounded-[18px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] p-5"
                >
                  <span className="font-mono text-[12px] tabular-nums" style={{ color: ACCENT }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-2 text-[15px] font-semibold tracking-[-0.01em] text-[color:var(--color-text-1)]">
                    {s.k}
                  </p>
                  <p className="mt-1 text-[13.5px] leading-[1.5] text-[color:var(--color-text-2)]">{s.v}</p>
                  {i < steps.length - 1 && (
                    <svg
                      className="absolute -right-3 top-1/2 hidden -translate-y-1/2 sm:block"
                      width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </Section>

      {/* ── SEO ── */}
      <Section pad="default">
        <Container>
          <Reveal>
            <SectionHead eyebrow={t("seo.eyebrow")} headline={t("seo.headline")} subhead={t("seo.subhead")} />
          </Reveal>
          <Reveal delay={100}>
            <ul className="mx-auto mt-8 flex max-w-[820px] flex-wrap justify-center gap-2.5">
              {signals.map((s) => (
                <li
                  key={s}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] px-3.5 py-1.5 text-[13.5px] font-medium text-[color:var(--color-text-2)]"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={140}>
            <div className="mt-12 md:mt-14">
              <Frame src="/cases/baltic-divisions.webp" ratio="1760 / 1309" />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ── SEO content / knowledge base ── */}
      <Section pad="default" tone="alt">
        <Container>
          <Reveal>
            <SectionHead eyebrow={t("content.eyebrow")} headline={t("content.headline")} subhead={t("content.subhead")} />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-12 md:mt-16">
              <Frame src="/cases/baltic-insights.webp" path=" /insights" ratio="1760 / 1100" />
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}

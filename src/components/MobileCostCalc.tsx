"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { Button } from "./Button";

/* Interactive app-cost configurator: MVP base plus toggleable features, live
   price range and timeline. Agencies hide prices behind a sales call — this
   answers the visitor's real first question on the spot. */

const AMBER = "#FF7A2D";
const BASE_PRICE = 3000;
const BASE_WEEKS = 4;

const INTL_LOCALE: Record<string, string> = { ru: "ru-RU", pl: "pl-PL", en: "en-GB", ua: "uk-UA" };

type Feature = { label: string; p: number; w: number };

export function MobileCostCalc() {
  const t = useTranslations("services.mobile.calc");
  const locale = useLocale();
  const nf = new Intl.NumberFormat(INTL_LOCALE[locale] ?? "en-GB", { maximumFractionDigits: 0 });

  const features = t.raw("features") as Feature[];
  const [on, setOn] = useState<boolean[]>(() => features.map(() => false));
  const toggle = (i: number) => setOn((prev) => prev.map((v, j) => (j === i ? !v : v)));

  const extra = features.reduce((sum, f, i) => sum + (on[i] ? f.p : 0), 0);
  const weeks = BASE_WEEKS + features.reduce((sum, f, i) => sum + (on[i] ? f.w : 0), 0);
  const low = BASE_PRICE + extra;
  const high = Math.round((low * 1.2) / 100) * 100;

  return (
    <Section pad="default" tone="default">
      <Container size="md">
        <Reveal>
          <div className="mx-auto max-w-[720px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
            <p className="mx-auto mt-5 max-w-[620px] t-body-lg">{t("sub")}</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mt-12 overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0A0A0B] md:mt-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(56% 52% at 85% 8%, rgba(255,122,45,0.14), transparent 70%), radial-gradient(36% 40% at 8% 96%, rgba(255,122,45,0.07), transparent 70%)",
              }}
            />
            <div className="relative grid gap-10 p-6 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-10 md:p-10">
              <div>
                {/* base — always in */}
                <div className="flex items-start gap-3 rounded-2xl border border-[color:var(--c-accent)]/35 bg-[color:var(--c-accent)]/[0.08] px-4 py-3.5">
                  <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full" style={{ background: AMBER }}>
                    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke="#0a0a0a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>
                    <span className="block text-[14px] font-semibold text-white">
                      {t("baseLabel")}
                      <span className="ml-2 font-mono text-[13px] font-medium text-[#ffb487]">€{nf.format(BASE_PRICE)}</span>
                    </span>
                    <span className="mt-1 block text-[12.5px] leading-[1.5] text-white/55">{t("baseIncludes")}</span>
                  </span>
                </div>

                {/* toggleable features */}
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {features.map((f, i) => {
                    const active = on[i];
                    return (
                      <button
                        key={f.label}
                        type="button"
                        onClick={() => toggle(i)}
                        aria-pressed={active}
                        className="flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left transition-colors"
                        style={
                          active
                            ? { borderColor: "rgba(255,122,45,0.45)", background: "rgba(255,122,45,0.10)" }
                            : { borderColor: "rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.03)" }
                        }
                      >
                        <span
                          className="grid h-[18px] w-[18px] flex-none place-items-center rounded-[6px] border transition-colors"
                          style={
                            active
                              ? { background: AMBER, borderColor: AMBER }
                              : { borderColor: "rgba(255,255,255,0.25)" }
                          }
                        >
                          {active && (
                            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden>
                              <path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke="#0a0a0a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        <span className="min-w-0 flex-1 text-[13px] font-medium leading-snug text-white/85">{f.label}</span>
                        <span className="flex-none font-mono text-[12px] tabular-nums" style={{ color: active ? "#ffb487" : "rgba(255,255,255,0.4)" }}>
                          +€{nf.format(f.p)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* estimate */}
              <div className="flex flex-col rounded-[20px] border border-white/[0.09] bg-white/[0.035] p-6 md:p-8">
                <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-white/45">{t("resultTitle")}</p>
                <p
                  className="mt-3 text-[clamp(30px,3vw,40px)] font-semibold leading-none tracking-[-0.03em] tabular-nums"
                  style={{
                    background: `linear-gradient(165deg, #fff 30%, ${AMBER})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  €{nf.format(low)}–{nf.format(high)}
                </p>
                <p className="mt-4 flex items-center gap-2 text-[13.5px] text-white/60">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3.5 2.2" />
                  </svg>
                  {t("weeksLabel")}: <span className="font-mono font-semibold text-white tabular-nums">{weeks}–{weeks + 2} {t("weeksUnit")}</span>
                </p>
                <p className="mt-5 border-t border-white/[0.08] pt-5 text-[12.5px] leading-[1.55] text-white/40">{t("note")}</p>
                <div className="mt-auto pt-7">
                  <Button href="/contact" size="lg" className="w-full">
                    {t("cta")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

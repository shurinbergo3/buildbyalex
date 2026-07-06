"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { Button } from "./Button";

/* "What a slow site costs you" — three sliders, one uncomfortable number.
   Model: a 3s+ site loses ~40% of mobile visitors before first paint. */

const AMBER = "#FF7A2D";
const LOSS_RATE = 0.4;

const INTL_LOCALE: Record<string, string> = { ru: "ru-RU", pl: "pl-PL", en: "en-GB", ua: "uk-UA" };

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-4">
        <span className="text-[13.5px] font-medium text-white/65">{label}</span>
        <span className="font-mono text-[15px] font-semibold tabular-nums text-white">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/12"
        style={{ accentColor: AMBER }}
      />
    </label>
  );
}

export function WebsitesLossCalc() {
  const t = useTranslations("services.websites.calc");
  const locale = useLocale();
  const nf = new Intl.NumberFormat(INTL_LOCALE[locale] ?? "en-GB", { maximumFractionDigits: 0 });

  const [visitors, setVisitors] = useState(3000);
  const [conv, setConv] = useState(1.5);
  const [value, setValue] = useState(150);

  const lostLeads = visitors * LOSS_RATE * (conv / 100);
  const lostMonthly = lostLeads * value;

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
            <div className="relative grid gap-10 p-6 md:grid-cols-2 md:gap-12 md:p-10">
              <div className="flex flex-col gap-8 md:py-2">
                <Slider
                  label={t("visitors")}
                  value={visitors}
                  display={nf.format(visitors)}
                  min={500}
                  max={30000}
                  step={250}
                  onChange={setVisitors}
                />
                <Slider
                  label={t("conv")}
                  value={conv}
                  display={`${conv.toLocaleString(INTL_LOCALE[locale] ?? "en-GB")}%`}
                  min={0.5}
                  max={5}
                  step={0.1}
                  onChange={setConv}
                />
                <Slider
                  label={t("value")}
                  value={value}
                  display={`€${nf.format(value)}`}
                  min={30}
                  max={3000}
                  step={10}
                  onChange={setValue}
                />
                <p className="mt-auto text-[12.5px] leading-[1.55] text-white/40">{t("note")}</p>
              </div>

              <div className="flex flex-col rounded-[20px] border border-white/[0.09] bg-white/[0.035] p-6 md:p-8">
                <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-white/45">
                  {t("resultTitle")}
                </p>
                <p
                  className="mt-3 text-[clamp(40px,5vw,58px)] font-semibold leading-none tracking-[-0.035em] tabular-nums"
                  style={{
                    background: `linear-gradient(165deg, #fff 30%, ${AMBER})`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  €{nf.format(lostMonthly)}
                </p>
                <p className="mt-1.5 text-[14px] text-white/50">{t("perMonth")}</p>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/[0.08] pt-6">
                  <div>
                    <p className="font-mono text-[20px] font-semibold tabular-nums text-white">
                      €{nf.format(lostMonthly * 12)}
                    </p>
                    <p className="mt-1 text-[11.5px] uppercase tracking-[0.06em] text-white/40">{t("perYear")}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[20px] font-semibold tabular-nums text-white">
                      {nf.format(lostLeads)}
                    </p>
                    <p className="mt-1 text-[11.5px] uppercase tracking-[0.06em] text-white/40">{t("leadsLost")}</p>
                  </div>
                </div>

                <div className="mt-auto pt-8">
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

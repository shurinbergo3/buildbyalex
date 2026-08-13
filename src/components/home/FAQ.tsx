"use client";

import { useState } from "react";
import { useTranslations, useMessages } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { jsonLd } from "@/lib/jsonLd";

type FAQItem = { q: string; a: string };

export function FAQ() {
  const t = useTranslations("home.faq");
  const messages = useMessages() as unknown as {
    home: { faq: { items: FAQItem[] } };
  };
  const items = messages.home.faq.items;
  const [open, setOpen] = useState<number | null>(0);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <Section tone="default" pad="default">
      <Container size="md">
        <Reveal>
          <div className="text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">{t("headline")}</h2>
          </div>
        </Reveal>

        <ul className="mt-14 divide-y divide-[color:var(--c-hairline)] border-y border-[color:var(--c-hairline)] md:mt-16">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-[color:var(--c-accent-ink)] dark:hover:text-[color:var(--c-accent)] md:py-6"
                >
                  <span className="text-[16.5px] font-semibold tracking-[-0.014em] md:text-[18px]">
                    {item.q}
                  </span>
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[color:var(--c-hairline)] transition-transform duration-300 ${isOpen ? "rotate-45 bg-[color:var(--c-accent)] border-transparent text-white" : ""}`}
                    aria-hidden="true"
                  >
                    <svg width="11" height="11" viewBox="0 0 11 11">
                      <path d="M5.5 1v9M1 5.5h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-12 text-[15.5px] leading-[1.6] text-[color:var(--color-text-2)] md:pb-7">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(schema) }}
      />
    </Section>
  );
}

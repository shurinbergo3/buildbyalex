import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/* Pain section for flagship service pages: why the current site/store stays
   silent. Sticky header left, numbered list right (homepage PainPoints
   rhythm), plus an optional demo node below — e.g. the loading race on the
   websites page. */

type PainItem = { title: string; body: string };

export function ServicePain({
  branch,
  children,
}: {
  branch: "websites" | "store";
  children?: ReactNode;
}) {
  const t = useTranslations(`services.${branch}.pain`);
  const items = t.raw("items") as PainItem[];

  return (
    <Section tone="default" pad="default">
      <Container>
        <div className="grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:gap-24">
          <Reveal>
            <div className="md:sticky md:top-28">
              <p className="t-eyebrow">{t("eyebrow")}</p>
              <h2 className="mt-3 t-h2 max-w-[460px] text-balance">{t("headline")}</h2>
              <p className="mt-5 max-w-[420px] t-body-lg">{t("sub")}</p>
            </div>
          </Reveal>

          <ul>
            {items.map((item, i) => (
              <Reveal
                as="li"
                key={item.title}
                delay={i * 90}
                className={i > 0 ? "border-t border-[color:var(--c-hairline)]" : undefined}
              >
                <div className={`grid grid-cols-[44px_1fr] gap-x-4 sm:grid-cols-[56px_1fr] sm:gap-x-6 ${i > 0 ? "py-8 md:py-10" : "pb-8 md:pb-10 md:pt-2"}`}>
                  <span className="pt-1 font-mono text-[13px] tracking-[0.06em] text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="t-h4">{item.title}</h3>
                    <p className="mt-3 max-w-[520px] text-[15px] leading-[1.55] text-[color:var(--color-text-2)]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        {children && (
          <Reveal delay={120}>
            <div className="mt-12 md:mt-14">{children}</div>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

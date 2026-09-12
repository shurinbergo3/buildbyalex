import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/* Short-answer spec sheet: price, timeline, stack, ownership, coverage.
   Each answer is written as a self-contained sentence, so a snippet or an AI
   assistant can quote one row without needing the rest of the page. */

type Row = { q: string; a: string };

export function ServiceAnswers({
  branch,
  tone = "alt",
}: {
  branch: "websites" | "store" | "mobile" | "ai" | "automation" | "telegram" | "ads";
  tone?: "default" | "alt";
}) {
  const t = useTranslations(`services.${branch}.answers`);
  if (!t.has("items")) return null;
  const items = t.raw("items") as Row[];
  if (!items?.length) return null;

  return (
    <Section pad="tight" tone={tone}>
      <Container size="md">
        <Reveal>
          <h2 className="t-h3 max-w-[640px]">{t("headline")}</h2>
        </Reveal>
        <dl className="mt-8 divide-y divide-[color:var(--c-hairline)] border-y border-[color:var(--c-hairline)]">
          {items.map((row, i) => (
            <Reveal key={row.q} delay={i * 50}>
              <div className="grid gap-1.5 py-5 md:grid-cols-[minmax(0,270px)_1fr] md:gap-8">
                <dt className="text-[15px] font-semibold tracking-[-0.012em] md:text-[15.5px]">
                  {row.q}
                </dt>
                <dd className="text-[15px] leading-[1.6] text-[color:var(--color-text-2)]">
                  {row.a}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </Section>
  );
}

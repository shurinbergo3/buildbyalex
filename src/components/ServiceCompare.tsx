import { useTranslations } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";

/* Decision-stage comparison: buildbyalex vs a studio, a freelancer and a
   site builder. Honest rows, our column highlighted. Scrolls horizontally on
   phones instead of collapsing. */

type CompareRow = { label: string; me: string | boolean; vals: string[] };

function CheckBadge() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--c-accent)]">
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function ServiceCompare({ branch }: { branch: "websites" | "store" }) {
  const t = useTranslations(`services.${branch}.compare`);
  const rows = t.raw("rows") as CompareRow[];
  const cols = t.raw("cols") as string[];
  const headline = t("headline").split("\n");

  return (
    <Section pad="default" tone="alt">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[760px] text-center">
            <p className="t-eyebrow">{t("eyebrow")}</p>
            <h2 className="mt-3 t-h2">
              {headline.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h2>
            <p className="mx-auto mt-5 max-w-[600px] t-body-lg">{t("sub")}</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-12 overflow-x-auto rounded-[24px] border border-[color:var(--c-hairline)] bg-[color:var(--color-bg)] md:mt-14">
            <table className={`w-full border-collapse text-left ${cols.length <= 2 ? "min-w-[680px]" : "min-w-[820px]"}`}>
              <thead>
                <tr className="border-b border-[color:var(--c-hairline)]">
                  <th className="w-[26%] px-5 py-4 md:px-6" />
                  <th className="w-[21%] border-t-2 border-[color:var(--c-accent)] bg-[color:var(--c-accent-soft)] px-5 py-4 text-[14.5px] font-semibold tracking-[-0.01em] text-[color:var(--color-text)] md:px-6">
                    {t("colMe")}
                  </th>
                  {cols.map((c) => (
                    <th key={c} className="px-5 py-4 text-[13.5px] font-medium text-[color:var(--color-text-3)] md:px-6">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.label} className={i > 0 ? "border-t border-[color:var(--c-hairline)]" : undefined}>
                    <td className="px-5 py-4 text-[14px] font-medium leading-snug text-[color:var(--color-text-2)] md:px-6">
                      {row.label}
                    </td>
                    <td className="bg-[color:var(--c-accent-soft)] px-5 py-4 md:px-6">
                      {row.me === true ? (
                        <CheckBadge />
                      ) : (
                        <span className="text-[14px] font-semibold leading-snug text-[color:var(--color-text)]">{row.me}</span>
                      )}
                    </td>
                    {row.vals.map((v, j) => (
                      <td key={j} className="px-5 py-4 text-[13.5px] leading-snug text-[color:var(--color-text-3)] md:px-6">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-[640px] text-center text-[13px] leading-[1.5] text-[color:var(--color-text-3)]">
            {t("note")}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

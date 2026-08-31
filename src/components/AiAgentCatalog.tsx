import { useMessages } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { Eyebrow } from "./Eyebrow";
import { SectionAtmosphere } from "./SectionAtmosphere";

/* ─────────────────────────────────────────────────────────────────────────
   Nine agent types with a price, a timeline and a stack, in one table.
   The page used to sell three abstract packages; buyers arrive knowing the
   job they want done, not the package. A table also happens to be the format
   answer engines quote from, one row at a time, so every row is written to
   stand on its own.
   ───────────────────────────────────────────────────────────────────────── */

type CatalogItem = {
  title: string;
  does: string;
  price: string;
  time: string;
  stack: string;
  best: string;
};

type Catalog = {
  eyebrow: string;
  headline: string;
  sub: string;
  cols: { type: string; does: string; price: string; time: string; stack: string };
  items: CatalogItem[];
  note: string;
};

type Shape = { services: { ai: { catalog?: Catalog } } };

export function AiAgentCatalog() {
  const messages = useMessages() as unknown as Shape;
  const data = messages.services.ai.catalog;
  if (!data) return null;

  return (
    <Section pad="default" tone="default" className="isolate">
      <SectionAtmosphere variant="c" />
      <Container>
        <Reveal>
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h2 className="mt-3 t-h2 max-w-[640px]">{data.headline}</h2>
          <p className="mt-5 max-w-[640px] t-body-lg">{data.sub}</p>
        </Reveal>

        {/* Desktop: one scannable table. */}
        <Reveal delay={80}>
          <div className="mt-10 hidden overflow-x-auto rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] md:block">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[color:var(--c-hairline)]">
                  {[data.cols.type, data.cols.does, data.cols.price, data.cols.time, data.cols.stack].map((c) => (
                    <th
                      key={c}
                      className="px-5 py-3.5 text-[12px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-text-3)]"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr
                    key={item.title}
                    className="border-b border-[color:var(--c-hairline)] transition-colors last:border-0 hover:bg-[color:var(--color-bg-alt)]"
                  >
                    <td className="px-5 py-4 align-top">
                      <span className="block text-[15px] font-medium tracking-[-0.011em] text-[color:var(--color-text)]">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-[13px] leading-[1.45] text-[color:var(--color-text-3)]">
                        {item.best}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top text-[14.5px] leading-[1.5] text-[color:var(--color-text-2)]">
                      {item.does}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 align-top font-mono text-[14.5px] font-semibold tabular-nums text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                      {item.price}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 align-top text-[14px] text-[color:var(--color-text-2)]">
                      {item.time}
                    </td>
                    <td className="px-5 py-4 align-top text-[13.5px] leading-[1.45] text-[color:var(--color-text-3)]">
                      {item.stack}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* Mobile: the same rows as cards, because a five-column table at 390px
            is unreadable however it scrolls. */}
        <div className="mt-8 flex flex-col gap-3 md:hidden">
          {data.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 40}>
              <div className="rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-[15.5px] font-semibold tracking-[-0.011em]">{item.title}</h3>
                  <span className="flex-none whitespace-nowrap font-mono text-[14.5px] font-semibold tabular-nums text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                    {item.price}
                  </span>
                </div>
                <p className="mt-2 text-[14.5px] leading-[1.5] text-[color:var(--color-text-2)]">{item.does}</p>
                <p className="mt-3 text-[13px] leading-[1.45] text-[color:var(--color-text-3)]">
                  {item.time} · {item.stack}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-6 max-w-[720px] text-[14px] leading-[1.55] text-[color:var(--color-text-3)]">
            {data.note}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

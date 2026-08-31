import { useMessages } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { Eyebrow } from "./Eyebrow";

/* ─────────────────────────────────────────────────────────────────────────
   The systems an agent actually has to talk to, by name. EY Poland's 2026
   survey puts integration with existing IT at the top of what stops Polish
   companies from buying AI, and no competitor page answers it with names.
   Plain text, no logo wall: a buyer searching "agent AI Comarch Optima" needs
   to read the words, and so does the model answering that question for them.
   ───────────────────────────────────────────────────────────────────────── */

type Integrations = {
  eyebrow: string;
  headline: string;
  sub: string;
  groups: { title: string; items: string[] }[];
  note: string;
};

type Shape = { services: { ai: { integrations?: Integrations } } };

export function AiIntegrations() {
  const messages = useMessages() as unknown as Shape;
  const data = messages.services.ai.integrations;
  if (!data) return null;

  return (
    <Section pad="default" tone="alt">
      <Container>
        <Reveal>
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h2 className="mt-3 t-h2 max-w-[620px]">{data.headline}</h2>
          <p className="mt-5 max-w-[620px] t-body-lg">{data.sub}</p>
        </Reveal>

        <div className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {data.groups.map((group, i) => (
            <Reveal key={group.title} delay={i * 60}>
              <div className="border-t border-[color:var(--c-hairline)] pt-5">
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[color:var(--color-text-3)]">
                  {group.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-2.5 text-[15px] leading-[1.45] tracking-[-0.011em] text-[color:var(--color-text)]"
                    >
                      <span
                        aria-hidden
                        className="mt-[7px] h-[3px] w-[3px] flex-none rounded-full bg-[color:var(--c-accent)]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-10 max-w-[720px] text-[14.5px] leading-[1.55] text-[color:var(--color-text-2)]">
            {data.note}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}

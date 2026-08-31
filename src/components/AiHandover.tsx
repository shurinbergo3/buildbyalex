import { useMessages } from "next-intl";
import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { Eyebrow } from "./Eyebrow";

/* ─────────────────────────────────────────────────────────────────────────
   "And what if you disappear." The loudest unspoken objection to hiring one
   person instead of an agency, and the one every service page here leaves
   unanswered. Answering it in writing costs nothing and closes deals, so it
   sits above the price rather than buried in an FAQ.
   ───────────────────────────────────────────────────────────────────────── */

type Handover = {
  eyebrow: string;
  headline: string;
  sub: string;
  items: { title: string; body: string }[];
  note: string;
};

type Shape = { services: { ai: { handover?: Handover } } };

export function AiHandover() {
  const messages = useMessages() as unknown as Shape;
  const data = messages.services.ai.handover;
  if (!data) return null;

  return (
    <Section pad="default" tone="default">
      <Container size="md">
        <Reveal>
          <Eyebrow>{data.eyebrow}</Eyebrow>
          <h2 className="mt-3 t-h2 max-w-[560px]">{data.headline}</h2>
          <p className="mt-5 max-w-[620px] t-body-lg">{data.sub}</p>
        </Reveal>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--c-hairline)] sm:grid-cols-2">
          {data.items.map((item, i) => (
            <li key={item.title} className="bg-[color:var(--color-bg)] p-6">
              <Reveal delay={i * 50}>
                <span className="font-mono text-[12px] tabular-nums text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 t-h4">{item.title}</h3>
                <p className="mt-2.5 text-[15px] leading-[1.55] text-[color:var(--color-text-2)]">{item.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={200}>
          <p className="mt-6 text-[14.5px] leading-[1.55] text-[color:var(--color-text-2)]">{data.note}</p>
        </Reveal>
      </Container>
    </Section>
  );
}

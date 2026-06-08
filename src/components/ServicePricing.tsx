import { Container } from "./Container";
import { Section } from "./Section";
import { Reveal } from "./Reveal";
import { Button } from "./Button";

export type PricingTier = {
  title: string;
  from: string;
  price: string;
  body: string;
  examples?: string;
  market?: string;
  features?: string[];
  featured?: boolean;
};

type Props = {
  eyebrow: string;
  tiers: PricingTier[];
  bookCta: string;
  caption?: string;
  featuredLabel?: string;
  marketLabel?: string;
};

const COLS: Record<number, string> = {
  1: "mx-auto max-w-[440px]",
  2: "mx-auto max-w-[760px] md:grid-cols-2",
  3: "md:grid-cols-3",
};

export function ServicePricing({ eyebrow, tiers, bookCta, caption, featuredLabel, marketLabel }: Props) {
  const cols = COLS[tiers.length] ?? "md:grid-cols-3";

  return (
    <Section pad="default" tone="default">
      <Container size={tiers.length > 1 ? "md" : "sm"}>
        <Reveal>
          <p className="t-eyebrow text-center">{eyebrow}</p>
        </Reveal>

        <div className={`mt-10 grid gap-5 md:mt-12 ${cols}`}>
          {tiers.map((tier, i) => {
            const featured = !!tier.featured;
            return (
              <Reveal key={tier.title} delay={i * 90}>
                <article
                  className={[
                    "relative flex h-full flex-col rounded-[28px] p-7 md:p-8 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    featured
                      ? "bg-[#0A0A0A] text-white shadow-[var(--shadow-card)]"
                      : "bg-[color:var(--color-bg-alt)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]",
                  ].join(" ")}
                >
                  {featured && featuredLabel && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[color:var(--c-accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
                      {featuredLabel}
                    </span>
                  )}
                  <h3 className={`text-[15px] font-semibold ${featured ? "text-white/70" : "text-[color:var(--color-text-2)]"}`}>
                    {tier.title}
                  </h3>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className={`text-[12px] tracking-[0.04em] uppercase ${featured ? "text-white/50" : "text-[color:var(--color-text-3)]"}`}>
                      {tier.from}
                    </span>
                    <span className={`text-[clamp(36px,3.4vw,52px)] font-semibold tracking-[-0.03em] ${featured ? "text-white" : "text-[color:var(--color-text)]"}`}>
                      {tier.price}
                    </span>
                  </div>

                  {tier.market && (
                    <p className={`mt-2 text-[12.5px] ${featured ? "text-white/45" : "text-[color:var(--color-text-3)]"}`}>
                      {marketLabel ? `${marketLabel}: ` : ""}
                      <span className="line-through decoration-[1.5px] decoration-[color:var(--c-accent)]">
                        {tier.market}
                      </span>
                    </p>
                  )}

                  <p className={`mt-5 text-[15.5px] leading-[1.55] ${featured ? "text-white/80" : "text-[color:var(--color-text-2)]"}`}>
                    {tier.body}
                  </p>

                  {tier.features && tier.features.length > 0 && (
                    <ul className="mt-6 space-y-2.5">
                      {tier.features.map((f) => (
                        <li key={f} className={`flex gap-2.5 text-[14px] leading-[1.45] ${featured ? "text-white/80" : "text-[color:var(--color-text-2)]"}`}>
                          <svg
                            className={`mt-[3px] h-3.5 w-3.5 shrink-0 ${featured ? "text-[color:var(--c-accent)]" : "text-[color:var(--c-accent)]"}`}
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                          >
                            <path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {tier.examples && (
                    <p className={`mt-6 text-[12.5px] tracking-[0.02em] ${featured ? "text-white/50" : "text-[color:var(--color-text-3)]"}`}>
                      {tier.examples}
                    </p>
                  )}

                  <div className="mt-auto pt-8">
                    <Button
                      href="/contact"
                      variant={featured ? "primary" : "ghost"}
                      size="md"
                      className="w-full"
                    >
                      {bookCta}
                    </Button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {caption && (
          <Reveal delay={tiers.length * 90 + 120}>
            <p className="mx-auto mt-10 max-w-[640px] text-center text-[13.5px] leading-[1.5] text-[color:var(--color-text-3)]">
              {caption}
            </p>
          </Reveal>
        )}
      </Container>
    </Section>
  );
}

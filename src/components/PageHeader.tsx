import { Container } from "./Container";
import { Reveal } from "./Reveal";

export function PageHeader({
  eyebrow,
  headline,
  lead,
  align = "center",
}: {
  eyebrow: string;
  headline: string;
  lead?: string;
  align?: "center" | "left";
}) {
  const isCenter = align === "center";
  const headlineLines = headline.split("\n");

  return (
    <section className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16">
      <Container>
        <Reveal>
          <div className={isCenter ? "mx-auto max-w-[840px] text-center" : "max-w-[820px]"}>
            <p className="t-eyebrow">{eyebrow}</p>
            <h1 className="mt-4 text-[clamp(40px,5.5vw+8px,72px)] font-semibold leading-[1.06] tracking-[-0.032em]">
              {headlineLines.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h1>
            {lead && (
              <p className={`mt-6 text-[clamp(17px,1.2vw+13px,22px)] leading-[1.5] tracking-[-0.013em] text-[color:var(--color-text-2)] ${isCenter ? "mx-auto max-w-[640px]" : "max-w-[600px]"}`}>
                {lead}
              </p>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

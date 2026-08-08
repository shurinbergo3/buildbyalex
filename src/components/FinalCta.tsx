import type { ComponentProps } from "react";
import { Section } from "./Section";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { Button } from "./Button";
import { Magnetic } from "./Magnetic";
import { ShaderGlow } from "./ShaderGlow";
import { ProximityText } from "./ProximityText";
import { HeroWindow } from "./HeroWindow";
import { Link } from "@/i18n/navigation";
import type { ContourTheme } from "./heroGlyphs";

type Href = ComponentProps<typeof Link>["href"];

/* ════════════════════════════════════════════════════════════════════════════
   FinalCta — the end-of-page bookend. Same frosted glass macOS window as the
   hero (chrome bar + themed contours + sheen + glint), but centred: eyebrow →
   outcome headline → optional 3-step "what happens next" rail → one glowing
   primary + a quiet secondary → social proof. The page now opens and closes on
   the same premium surface. Shared by cases, services and the home page so the
   closing pitch never drifts. Reuses the established .case-cta-* styling.
   ──────────────────────────────────────────────────────────────────────────── */

type Step = { k: string; v: string };

function Stars({ accent }: { accent: string }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 16 16">
          <path
            d="M8 1.5l1.96 4.27 4.7.55-3.5 3.2.96 4.62L8 11.9l-4.12 2.24.96-4.62-3.5-3.2 4.7-.55L8 1.5z"
            fill={accent}
          />
        </svg>
      ))}
    </div>
  );
}

export function FinalCta({
  theme,
  accent = "#FF7A2D",
  chromeLabel = "buildbyalex.com",
  available,
  eyebrow,
  title,
  body,
  steps,
  primary,
  secondary,
  tertiary,
  rating,
  note,
}: {
  theme: ContourTheme;
  accent?: string;
  chromeLabel?: string;
  available?: string;
  eyebrow?: string;
  title: string;
  body?: string;
  steps?: Step[];
  primary: { label: string; href?: Href };
  secondary?:
    | { kind: "ghost"; label: string; href: Href }
    | { kind: "link"; label: string; href: string }
    | { kind: "external"; label: string; href: string };
  tertiary?: { label: string; href: string };
  rating?: { value: string; count: string };
  note?: string;
}) {
  return (
    <Section pad="default" tone="default">
      <Container size="default">
        <Reveal>
          <HeroWindow
            backdrop={<ShaderGlow className="mix-blend-screen opacity-80" />}
            theme={theme}
            accent={accent}
            label={chromeLabel}
            live={available}
            centered
            bodyClassName="!py-16 text-center sm:!py-20 md:!py-24"
          >
            <div className="mx-auto flex max-w-[720px] flex-col items-center">
              {eyebrow && (
                <span className="case-cta-eyebrow !mt-0" style={{ color: accent }}>
                  {eyebrow}
                </span>
              )}

              <h2 className="mt-4 text-[clamp(30px,4vw,50px)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
                <ProximityText text={title} />
              </h2>

              {body && (
                <p className="mx-auto mt-4 max-w-[500px] text-[16.5px] leading-[1.55] text-white/65">
                  {body}
                </p>
              )}

              {steps && steps.length > 0 && (
                <ol className="case-cta-rail">
                  {steps.map((s, i) => (
                    <li className="case-cta-step" key={i}>
                      <span className="case-cta-step-k">{s.k}</span>
                      <span className="case-cta-step-v">{s.v}</span>
                    </li>
                  ))}
                </ol>
              )}

              <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-3.5">
                <Magnetic>
                  <Button href={primary.href ?? "/contact"} size="lg" className="case-cta-primary">
                    {primary.label}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </Button>
                </Magnetic>

                {secondary &&
                  (secondary.kind === "ghost" ? (
                    <Button
                      href={secondary.href}
                      variant="ghost"
                      size="lg"
                      className="!border-white/20 !text-white hover:!bg-white/10"
                    >
                      {secondary.label}
                    </Button>
                  ) : secondary.kind === "external" ? (
                    <Button
                      as="a"
                      href={secondary.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      variant="ghost"
                      size="lg"
                      className="!border-white/20 !text-white hover:!bg-white/10"
                    >
                      {secondary.label}
                    </Button>
                  ) : (
                    <a
                      href={secondary.href}
                      className="text-[14px] text-white/65 underline underline-offset-4 transition-colors hover:text-white"
                    >
                      {secondary.label}
                    </a>
                  ))}

                {tertiary && (
                  <a
                    href={tertiary.href}
                    className="text-[14px] text-white/65 underline underline-offset-4 transition-colors hover:text-white"
                  >
                    {tertiary.label}
                  </a>
                )}
              </div>

              {rating && (
                <Link
                  href={{ pathname: "/", hash: "reviews" }}
                  aria-label={`${rating.value} · ${rating.count}`}
                  className="group mt-7 inline-flex items-center justify-center gap-2.5 transition-opacity hover:opacity-90"
                >
                  <Stars accent={accent} />
                  <span className="text-[13.5px] text-white/60 underline decoration-white/20 decoration-from-font underline-offset-[3px] transition-colors group-hover:text-white/85 group-hover:decoration-white/45">
                    <span className="font-semibold text-white">{rating.value}</span> · {rating.count}
                  </span>
                </Link>
              )}

              {note && <p className="case-cta-note">{note}</p>}
            </div>
          </HeroWindow>
        </Reveal>
      </Container>
    </Section>
  );
}

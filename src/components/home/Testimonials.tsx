import { useTranslations } from "next-intl";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";

type Review = { name: string; role: string; date: string; quote: string };

/* Muted, identity-style avatar tints — not UI accents. */
const AVATAR_TINTS = [
  { bg: "#F4E4D7", fg: "#B45309" },
  { bg: "#E2E8F0", fg: "#475569" },
  { bg: "#DCEFE8", fg: "#0F766E" },
  { bg: "#EAE2F2", fg: "#6D28D9" },
  { bg: "#F3E3E3", fg: "#B91C1C" },
  { bg: "#E5EAF4", fg: "#1D4ED8" },
  { bg: "#F4EAD7", fg: "#92750E" },
  { bg: "#E2ECE0", fg: "#3F6212" },
  { bg: "#F0E5DC", fg: "#9A3412" },
];

function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`} aria-label="5 out of 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M8 1.5l1.96 4.27 4.7.55-3.5 3.2.96 4.62L8 11.9l-4.12 2.24.96-4.62-3.5-3.2 4.7-.55L8 1.5z"
            fill="var(--c-accent)"
          />
        </svg>
      ))}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  const t = useTranslations("home.testimonials");
  const list = t.raw("list") as Review[];
  const rating = t("rating");
  const count = t("count");

  return (
    <Section tone="alt" pad="default">
      <Container>
        <Reveal>
          <div className="flex flex-col items-center gap-5 text-center md:flex-row md:items-end md:justify-between md:text-left">
            <div className="max-w-[620px]">
              <p className="t-eyebrow">{t("eyebrow")}</p>
              <h2 className="mt-3 t-h2">{t("headline")}</h2>
              <p className="mt-4 t-body-lg text-[color:var(--color-text-2)]">{t("subhead")}</p>
            </div>
            {/* Aggregate rating summary */}
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] px-5 py-3.5">
              <span className="text-[34px] font-semibold leading-none tracking-[-0.03em] text-[color:var(--color-text)]">
                {rating}
              </span>
              <span className="flex flex-col gap-1">
                <Stars />
                <span className="text-[12.5px] text-[color:var(--color-text-3)]">{count}</span>
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {list.map((r, i) => {
            const tint = AVATAR_TINTS[i % AVATAR_TINTS.length];
            return (
              <Reveal key={r.name} delay={(i % 3) * 80}>
                <figure className="flex h-full flex-col rounded-[20px] border border-[color:var(--color-divider)] bg-[color:var(--color-bg-elev)] p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold"
                      style={{ background: tint.bg, color: tint.fg }}
                      aria-hidden="true"
                    >
                      {initials(r.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <figcaption className="flex items-center gap-1.5">
                        <span className="truncate text-[14.5px] font-semibold tracking-[-0.011em] text-[color:var(--color-text)]">
                          {r.name}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-label="verified" className="shrink-0">
                          <circle cx="12" cy="12" r="9" fill="#3897F0" />
                          <path d="M8.5 12.3l2.3 2.3 4.7-5.1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </figcaption>
                      <p className="truncate text-[12.5px] text-[color:var(--color-text-3)]">{r.role}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Stars />
                    <span className="text-[12px] text-[color:var(--color-text-3)]">{r.date}</span>
                  </div>

                  <blockquote className="mt-3 text-[15px] leading-[1.55] text-[color:var(--color-text-2)]">
                    {r.quote}
                  </blockquote>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}

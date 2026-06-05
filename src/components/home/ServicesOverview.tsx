import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { serviceGlyph, serviceHref } from "@/components/serviceGlyphs";

/* ────────────────────────────────────────────────────────────────────────
   Services — apple.com-style bento. One big dark "AI" hero tile anchors the
   grid; two medium capability tiles stack beside it; three compact priced
   tiles run along the bottom. Asymmetric sizes, soft tiles, one accent.
   ──────────────────────────────────────────────────────────────────────── */

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg width="15" height="15" viewBox="0 0 14 14" className={className} aria-hidden="true">
    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/* Soft brand-tinted gradient glow in a tile corner — brightens on hover. */
const Aura = ({ className = "" }: { className?: string }) => (
  <span
    aria-hidden
    className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100 ${className}`}
    style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--c-accent) 24%, transparent) 0%, transparent 70%)" }}
  />
);

const tileBase =
  "group relative flex h-full flex-col overflow-hidden rounded-[28px] p-7 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--c-accent)] focus-visible:ring-offset-2 md:p-8";
const tileLight =
  "bg-[color:var(--color-bg-elev)] ring-1 ring-[color:var(--color-divider)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]";

export function ServicesOverview() {
  const t = useTranslations("home.services");

  const GlyphChip = ({ k, dark = false }: { k: keyof typeof serviceGlyph; dark?: boolean }) => (
    <span
      className={`relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl ring-1 transition-transform duration-300 group-hover:scale-105 ${
        dark
          ? "bg-gradient-to-br from-white/[0.16] to-white/[0.04] text-[color:var(--c-accent)] ring-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
          : "bg-gradient-to-br from-[color:var(--c-accent-soft)] to-transparent text-[color:var(--c-accent-ink)] ring-[color:var(--c-accent)]/20 shadow-[0_6px_16px_-6px_rgba(255,122,45,0.45)] dark:text-[color:var(--c-accent)]"
      }`}
    >
      {/* specular sheen */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent opacity-60" />
      <span className="relative h-6 w-6">{serviceGlyph[k]}</span>
    </span>
  );

  return (
    <Section tone="alt" pad="default" id="services">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[620px]">
              <p className="t-eyebrow">{t("eyebrow")}</p>
              <h2 className="mt-3 t-h2">{t("headline")}</h2>
            </div>
            <p className="t-body-lg max-w-[400px] md:text-right">{t("subhead")}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-6 md:gap-5">
          {/* ── AI — big dark hero (right, two rows tall) ── */}
          <Reveal className="md:col-span-4 md:col-start-3 md:row-span-2 md:row-start-1">
            <Link
              href={serviceHref.ai}
              className={`${tileBase} bg-[#0A0A0A] text-white shadow-[var(--shadow-card)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]`}
            >
              {/* decorative glyph art */}
              <span
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -right-8 h-56 w-56 text-[color:var(--c-accent)] opacity-[0.07] transition-transform duration-500 group-hover:scale-110"
              >
                {serviceGlyph.ai}
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute -right-1/4 top-1/3 h-[360px] w-[360px] rounded-full opacity-50 blur-[100px]"
                style={{ background: "radial-gradient(circle, rgba(255,122,45,0.18) 0%, transparent 70%)" }}
              />

              <div className="relative flex items-center gap-3">
                <GlyphChip k="ai" dark />
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-white/55">
                  {t("items.ai.category")}
                </p>
                <span className="ml-auto rounded-full bg-[color:var(--c-accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white">
                  {t("badge")}
                </span>
              </div>

              <h3 className="relative mt-6 text-[clamp(24px,2vw+14px,34px)] font-[number:var(--fw-semi)] leading-[1.1] tracking-[-0.02em] text-white">
                {t("items.ai.title")}
              </h3>
              <p className="relative mt-3 max-w-[440px] text-[15px] leading-[1.55] text-white/70">
                {t("items.ai.desc")}
              </p>

              <ul className="relative mt-6 grid gap-2.5 border-t border-white/10 pt-6 text-[14.5px] leading-[1.5] text-white/80 sm:grid-cols-2">
                {(t.raw("items.ai.bullets") as string[]).map((b, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--c-accent)]" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>

              <span className="relative mt-auto inline-flex items-center gap-1.5 pt-7 text-[14px] font-medium text-[color:var(--c-accent)]">
                {t("items.ai.link")}
                <Arrow className="transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>

          {/* ── Websites — medium (top-left) ── */}
          <Reveal delay={90} className="md:col-span-2 md:col-start-1 md:row-start-1">
            <MediumTile
              glyph={<GlyphChip k="websites" />}
              category={t("items.websites.category")}
              title={t("items.websites.title")}
              desc={t("items.websites.desc")}
              bullets={t.raw("items.websites.bullets") as string[]}
              link={t("items.websites.link")}
              href={serviceHref.websites}
            />
          </Reveal>

          {/* ── Mobile — medium (bottom-left) ── */}
          <Reveal delay={150} className="md:col-span-2 md:col-start-1 md:row-start-2">
            <MediumTile
              glyph={<GlyphChip k="mobile" />}
              category={t("items.mobile.category")}
              title={t("items.mobile.title")}
              desc={t("items.mobile.desc")}
              bullets={t.raw("items.mobile.bullets") as string[]}
              link={t("items.mobile.link")}
              href={serviceHref.mobile}
            />
          </Reveal>

          {/* ── Bottom row: three compact priced tiles ── */}
          <Reveal delay={220} className="md:col-span-2 md:col-start-1 md:row-start-3">
            <SmallTile
              glyph={<GlyphChip k="automation" />}
              category={t("automation.category")}
              title={t("automation.title")}
              body={t("automation.body")}
              price={t("automation.price")}
              href="/services/automation"
            />
          </Reveal>
          <Reveal delay={280} className="md:col-span-2 md:col-start-3 md:row-start-3">
            <SmallTile
              glyph={<GlyphChip k="telegram" />}
              category={t("telegram.category")}
              title={t("telegram.title")}
              body={t("telegram.body")}
              price={t("telegram.price")}
              href="/services/telegram-bots"
            />
          </Reveal>
          <Reveal delay={340} className="md:col-span-2 md:col-start-5 md:row-start-3">
            <SmallTile
              glyph={<GlyphChip k="ads" />}
              category={t("ads.category")}
              title={t("ads.title")}
              body={t("ads.body")}
              price={t("ads.price")}
              href="/services/advertising"
            />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* ───────────────────────── MEDIUM TILE ───────────────────────── */

function MediumTile({
  glyph,
  category,
  title,
  desc,
  bullets,
  link,
  href,
}: {
  glyph: React.ReactNode;
  category: string;
  title: string;
  desc: string;
  bullets: string[];
  link: string;
  href: React.ComponentProps<typeof Link>["href"];
}) {
  return (
    <Link href={href} className={`${tileBase} ${tileLight}`}>
      <Aura />
      <div className="relative flex items-center gap-3">
        {glyph}
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">{category}</p>
      </div>
      <h3 className="relative mt-5 t-h4 font-[number:var(--fw-semi)] text-[color:var(--color-text)]">{title}</h3>
      <p className="relative mt-2.5 text-[14.5px] leading-[1.5] text-[color:var(--color-text-2)]">{desc}</p>

      <ul className="relative mt-5 space-y-2.5 border-t border-[color:var(--color-divider)] pt-5 text-[14.5px] leading-[1.5] text-[color:var(--color-text-2)]">
        {bullets.slice(0, 3).map((b, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-[color:var(--c-accent)]" aria-hidden="true" />
            {b}
          </li>
        ))}
      </ul>

      <span className="relative mt-auto inline-flex items-center gap-1.5 pt-6 text-[14px] font-medium text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
        {link}
        <Arrow className="transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

/* ───────────────────────── SMALL TILE ───────────────────────── */

function SmallTile({
  glyph,
  category,
  title,
  body,
  price,
  href,
}: {
  glyph: React.ReactNode;
  category: string;
  title: string;
  body: string;
  price: string;
  href: React.ComponentProps<typeof Link>["href"];
}) {
  return (
    <Link href={href} className={`${tileBase} ${tileLight}`}>
      <Aura />
      <div className="relative flex items-center gap-3">
        {glyph}
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[color:var(--color-text-3)]">{category}</p>
      </div>
      <h3 className="relative mt-4 t-h4 font-[number:var(--fw-semi)] text-[color:var(--color-text)]">{title}</h3>
      <p className="relative mt-2 text-[14px] leading-[1.5] text-[color:var(--color-text-2)]">{body}</p>

      <div className="relative mt-auto flex items-center justify-between gap-3 pt-6">
        <span className="text-[14.5px] font-medium tracking-[-0.01em] text-[color:var(--color-text)]">{price}</span>
        <Arrow className="text-[color:var(--c-accent)] transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

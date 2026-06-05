import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/Container";
import { Section } from "@/components/Section";
import { Reveal } from "@/components/Reveal";
import { serviceGlyph, serviceHref } from "@/components/serviceGlyphs";

/* ────────────────────────────────────────────────────────────────────────
   Services — apple.com-style bento with brand illustrations. The big dark AI
   tile carries a live chat→CRM mock; the two capability tiles each hold a
   small product mock (browser, phone); the three priced tiles round it off.
   Soft gradient auras + frosted glyph chips give it the premium feel.
   ──────────────────────────────────────────────────────────────────────── */

const Arrow = ({ className = "" }: { className?: string }) => (
  <svg width="15" height="15" viewBox="0 0 14 14" className={className} aria-hidden="true">
    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const Check = ({ className = "" }: { className?: string }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Aura = ({ className = "" }: { className?: string }) => (
  <span
    aria-hidden
    className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100 ${className}`}
    style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--c-accent) 24%, transparent) 0%, transparent 70%)" }}
  />
);

const tileBase =
  "group relative flex h-full flex-col overflow-hidden rounded-[28px] p-6 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--c-accent)] focus-visible:ring-offset-2 md:p-7";
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
      <span aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent opacity-60" />
      <span className="relative h-6 w-6">{serviceGlyph[k]}</span>
    </span>
  );

  const Cat = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
    <p className={`text-[12px] font-semibold uppercase tracking-[0.08em] ${dark ? "text-white/55" : "text-[color:var(--color-text-3)]"}`}>
      {children}
    </p>
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

        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-6">
          {/* ── AI — big dark hero ── */}
          <Reveal className="md:col-span-4 md:col-start-3 md:row-span-2 md:row-start-1">
            <Link
              href={serviceHref.ai}
              className={`${tileBase} bg-[#0A0A0A] text-white shadow-[var(--shadow-card)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]`}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-1/4 top-0 h-[420px] w-[420px] rounded-full opacity-60 blur-[110px]"
                style={{ background: "radial-gradient(circle, rgba(255,122,45,0.20) 0%, transparent 70%)" }}
              />

              <div className="relative flex items-center gap-3">
                <GlyphChip k="ai" dark />
                <Cat dark>{t("items.ai.category")}</Cat>
                <span className="ml-auto rounded-full bg-[color:var(--c-accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-white">
                  {t("badge")}
                </span>
              </div>

              <h3 className="relative mt-5 text-[clamp(23px,1.6vw+14px,32px)] font-[number:var(--fw-semi)] leading-[1.1] tracking-[-0.02em] text-white">
                {t("items.ai.title")}
              </h3>
              <p className="relative mt-2.5 max-w-[460px] text-[15px] leading-[1.5] text-white/70">
                {t("items.ai.desc")}
              </p>

              <span className="relative mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-[color:var(--c-accent)]">
                {t("items.ai.link")}
                <Arrow className="transition-transform duration-200 group-hover:translate-x-1" />
              </span>

              {/* Live chat → CRM mock fills the tile */}
              <BotChatArt
                bullets={t.raw("items.ai.bullets") as string[]}
                wonLabel={t("items.ai.title")}
              />
            </Link>
          </Reveal>

          {/* ── Websites — medium ── */}
          <Reveal delay={90} className="md:col-span-2 md:col-start-1 md:row-start-1">
            <Link href={serviceHref.websites} className={`${tileBase} ${tileLight}`}>
              <Aura />
              <div className="relative flex items-center gap-3">
                <GlyphChip k="websites" />
                <Cat>{t("items.websites.category")}</Cat>
              </div>
              <h3 className="relative mt-4 t-h4 font-[number:var(--fw-semi)] text-[color:var(--color-text)]">
                {t("items.websites.title")}
              </h3>
              <p className="relative mt-2 text-[14px] leading-[1.5] text-[color:var(--color-text-2)]">
                {t("items.websites.desc")}
              </p>
              <BrowserArt />
              <span className="relative mt-auto inline-flex items-center gap-1.5 pt-5 text-[14px] font-medium text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                {t("items.websites.link")}
                <Arrow className="transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>

          {/* ── Mobile — medium ── */}
          <Reveal delay={150} className="md:col-span-2 md:col-start-1 md:row-start-2">
            <Link href={serviceHref.mobile} className={`${tileBase} ${tileLight}`}>
              <Aura />
              <div className="relative flex items-center gap-3">
                <GlyphChip k="mobile" />
                <Cat>{t("items.mobile.category")}</Cat>
              </div>
              <h3 className="relative mt-4 t-h4 font-[number:var(--fw-semi)] text-[color:var(--color-text)]">
                {t("items.mobile.title")}
              </h3>
              <p className="relative mt-2 text-[14px] leading-[1.5] text-[color:var(--color-text-2)]">
                {t("items.mobile.desc")}
              </p>
              <PhoneArt />
              <span className="relative mt-auto inline-flex items-center gap-1.5 pt-5 text-[14px] font-medium text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
                {t("items.mobile.link")}
                <Arrow className="transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          </Reveal>

          {/* ── Three compact priced tiles ── */}
          <Reveal delay={220} className="md:col-span-2 md:col-start-1 md:row-start-3">
            <SmallTile glyph={<GlyphChip k="automation" />} category={<Cat>{t("automation.category")}</Cat>} title={t("automation.title")} body={t("automation.body")} price={t("automation.price")} href="/services/automation" motif="flow" />
          </Reveal>
          <Reveal delay={280} className="md:col-span-2 md:col-start-3 md:row-start-3">
            <SmallTile glyph={<GlyphChip k="telegram" />} category={<Cat>{t("telegram.category")}</Cat>} title={t("telegram.title")} body={t("telegram.body")} price={t("telegram.price")} href="/services/telegram-bots" motif="chat" />
          </Reveal>
          <Reveal delay={340} className="md:col-span-2 md:col-start-5 md:row-start-3">
            <SmallTile glyph={<GlyphChip k="ads" />} category={<Cat>{t("ads.category")}</Cat>} title={t("ads.title")} body={t("ads.body")} price={t("ads.price")} href="/services/advertising" motif="bars" />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* ───────────────────────── ILLUSTRATIONS ───────────────────────── */

/** AI hero — a Telegram chat on the left flowing into a CRM "deal won" card. */
function BotChatArt({ bullets, wonLabel }: { bullets: string[]; wonLabel: string }) {
  return (
    <div aria-hidden className="relative mt-5 grid flex-1 content-center gap-3 pt-2 sm:grid-cols-[1.2fr_1fr]">
      {/* Chat */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm">
        <div className="flex flex-col gap-2">
          <span className="max-w-[88%] self-start rounded-2xl rounded-bl-[6px] px-3 py-1.5 text-[12.5px] leading-[1.35] text-white" style={{ background: "#182533" }}>
            👋 Подберу решение и отвечу за секунду
          </span>
          <span className="max-w-[80%] self-end rounded-2xl rounded-br-[6px] px-3 py-1.5 text-[12.5px] leading-[1.35] text-white" style={{ background: "#2b5278" }}>
            Сколько стоит AI-бот?
          </span>
          <span className="max-w-[92%] self-start rounded-2xl rounded-bl-[6px] px-3 py-1.5 text-[12.5px] leading-[1.35] text-white" style={{ background: "#182533" }}>
            От €600. Соберу заявку и передам в CRM
          </span>
        </div>
      </div>

      {/* CRM deal card */}
      <div
        className="relative overflow-hidden rounded-2xl border p-3.5"
        style={{
          background: "linear-gradient(180deg, rgba(255,122,45,0.12) 0%, rgba(255,122,45,0.03) 100%)",
          borderColor: "rgba(255,122,45,0.45)",
          boxShadow: "0 0 0 1px rgba(255,122,45,0.16), 0 12px 30px -12px rgba(255,122,45,0.4)",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/55">CRM</span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Check />
          </span>
        </div>
        <div className="mt-2 text-[13px] font-semibold text-white">Maria K. · Acme Co.</div>
        <div className="mt-0.5 text-[11.5px] text-white/60">€2,400 / mo</div>
        <div className="mt-2.5 flex flex-col gap-1.5">
          {bullets.slice(0, 2).map((b, i) => (
            <span key={i} className="flex items-center gap-1.5 text-[10.5px] text-white/55">
              <Check className="shrink-0 text-[color:var(--c-accent)]" />
              <span className="truncate">{b}</span>
            </span>
          ))}
        </div>
        <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[88%] rounded-full" style={{ background: "var(--c-accent)" }} />
        </div>
        <span className="sr-only">{wonLabel}</span>
      </div>
    </div>
  );
}

/** Websites — a tiny browser window with a Lighthouse-style speed score. */
function BrowserArt() {
  return (
    <div
      aria-hidden
      className="relative mt-4 overflow-hidden rounded-xl border border-[color:var(--color-divider)] bg-[color:var(--color-bg)] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center gap-1.5 border-b border-[color:var(--color-divider)] px-3 py-1.5">
        <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
        <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
        <span className="h-2 w-2 rounded-full bg-[#28C840]" />
        <span className="ml-2 flex-1 truncate rounded-full bg-[color:var(--color-bg-alt)] px-2.5 py-1 text-[10px] text-[color:var(--color-text-3)]">
          site.com
        </span>
      </div>
      <div className="flex items-center gap-3 p-3">
        <Ring value={98} />
        <div className="flex flex-1 flex-col gap-1.5">
          <span className="h-2 w-3/4 rounded-full bg-[color:var(--color-divider)]" />
          <span className="h-2 w-1/2 rounded-full bg-[color:var(--color-divider)]" />
          <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-[color:var(--c-accent-soft)] px-2 py-0.5 text-[10px] font-medium text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]">
            <Check className="h-2.5 w-2.5" /> топ-10 Google
          </span>
        </div>
      </div>
    </div>
  );
}

function Ring({ value }: { value: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative grid h-12 w-12 shrink-0 place-items-center">
      <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
        <circle cx="24" cy="24" r={r} fill="none" stroke="var(--color-divider)" strokeWidth="3.5" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke="var(--c-accent)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
        />
      </svg>
      <span className="absolute text-[12px] font-semibold text-[color:var(--color-text)]">{value}</span>
    </span>
  );
}

/** Mobile — a small phone with an app screen. */
function PhoneArt() {
  return (
    <div aria-hidden className="mt-4 flex justify-center">
      <div className="relative w-[150px] overflow-hidden rounded-[18px] border border-[color:var(--color-divider)] bg-[color:var(--color-bg)] p-2 shadow-[0_14px_36px_-18px_rgba(0,0,0,0.45)]">
        <div className="absolute left-1/2 top-1.5 h-1 w-8 -translate-x-1/2 rounded-full bg-[color:var(--color-divider)]" />
        <div className="mt-3 rounded-[12px] bg-[color:var(--color-bg-alt)] p-2.5">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-lg bg-[color:var(--c-accent)]" />
            <span className="flex flex-1 flex-col gap-1">
              <span className="h-1.5 w-3/4 rounded-full bg-[color:var(--color-divider)]" />
              <span className="h-1.5 w-1/2 rounded-full bg-[color:var(--color-divider)]" />
            </span>
          </div>
          <div className="mt-2 flex flex-col gap-1.5">
            {[0, 1].map((i) => (
              <span key={i} className="flex items-center gap-2 rounded-lg bg-[color:var(--color-bg)] p-1.5">
                <span className="h-4 w-4 rounded-md bg-[color:var(--c-accent-soft)]" />
                <span className="h-1.5 flex-1 rounded-full bg-[color:var(--color-divider)]" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
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
  motif,
}: {
  glyph: React.ReactNode;
  category: React.ReactNode;
  title: string;
  body: string;
  price: string;
  href: React.ComponentProps<typeof Link>["href"];
  motif: "flow" | "chat" | "bars";
}) {
  return (
    <Link href={href} className={`${tileBase} ${tileLight}`}>
      <Aura />
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {glyph}
          {category}
        </div>
        <Motif kind={motif} />
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

/** Tiny accent motif in the corner of a priced tile. */
function Motif({ kind }: { kind: "flow" | "chat" | "bars" }) {
  const stroke = "var(--c-accent)";
  return (
    <span aria-hidden className="opacity-70">
      {kind === "flow" && (
        <svg width="44" height="20" viewBox="0 0 44 20" fill="none">
          <circle cx="6" cy="10" r="3" fill={stroke} />
          <circle cx="22" cy="4" r="3" fill={stroke} opacity="0.6" />
          <circle cx="22" cy="16" r="3" fill={stroke} opacity="0.6" />
          <circle cx="38" cy="10" r="3" fill={stroke} opacity="0.35" />
          <path d="M9 10l10-5M9 10l10 5M25 5l10 4M25 15l10-4" stroke={stroke} strokeWidth="1.4" opacity="0.5" />
        </svg>
      )}
      {kind === "chat" && (
        <svg width="34" height="22" viewBox="0 0 34 22" fill="none">
          <rect x="1" y="2" width="22" height="13" rx="4" fill={stroke} opacity="0.18" />
          <path d="M6 19l4-5" stroke={stroke} strokeWidth="1.4" opacity="0.3" />
          <path d="M14 8.5l5 3 9-7" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {kind === "bars" && (
        <svg width="34" height="22" viewBox="0 0 34 22" fill="none">
          <rect x="2" y="13" width="5" height="7" rx="1.5" fill={stroke} opacity="0.4" />
          <rect x="11" y="8" width="5" height="12" rx="1.5" fill={stroke} opacity="0.6" />
          <rect x="20" y="3" width="5" height="17" rx="1.5" fill={stroke} />
          <path d="M3 9l9-4 9-3" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
        </svg>
      )}
    </span>
  );
}

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

/* Card CTA — a clearly tappable pill on mobile (full-width, labelled, with a
   visible border so the card reads as clickable), collapsing to the subtle
   inline "link →" treatment on md+ where hover affordances exist. */
const CardCta = ({ label, dark = false }: { label: string; dark?: boolean }) => (
  <span
    className={`relative mt-auto inline-flex w-full items-center justify-between gap-2 rounded-full px-4 py-2.5 text-[14px] font-medium ring-1 md:w-fit md:gap-1.5 md:rounded-none md:bg-transparent md:px-0 md:py-0 md:pt-5 md:ring-0 ${
      dark
        ? "bg-white/[0.06] text-[color:var(--c-accent)] ring-white/15"
        : "bg-[color:var(--color-bg-alt)] text-[color:var(--c-accent-ink)] ring-[color:var(--color-divider)] dark:text-[color:var(--c-accent)] md:dark:bg-transparent"
    }`}
  >
    {label}
    <Arrow className="transition-transform duration-200 group-hover:translate-x-1" />
  </span>
);

const Aura = ({ className = "" }: { className?: string }) => (
  <span
    aria-hidden
    className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100 ${className}`}
    style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--c-accent) 24%, transparent) 0%, transparent 70%)" }}
  />
);

const tileBase =
  "group relative flex h-full flex-col overflow-hidden rounded-[28px] p-5 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--c-accent)] focus-visible:ring-offset-2 md:p-7";
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
              <h2 className="mt-3 text-balance font-[number:var(--fw-semi)] leading-[1.1] tracking-[-0.024em] text-[clamp(26px,2.2vw+15px,42px)]">
                {t("headline")}
              </h2>
            </div>
            <p className="t-body-lg max-w-[400px] md:text-left">{t("subhead")}</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3 md:gap-5">
          {/* ── Row 1: capability tiles ── */}
          <Reveal delay={0}>
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
              <BrowserArt rank={t("art.rank")} />
              <CardCta label={t("items.websites.link")} />
            </Link>
          </Reveal>

          {/* AI — dark, badged, but the same size as its siblings */}
          <Reveal delay={90}>
            <Link
              href={serviceHref.ai}
              className={`${tileBase} bg-[#0A0A0A] text-white shadow-[var(--shadow-card)] hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]`}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-1/4 -top-1/4 h-72 w-72 rounded-full opacity-60 blur-[90px]"
                style={{ background: "radial-gradient(circle, rgba(255,122,45,0.20) 0%, transparent 70%)" }}
              />
              <div className="relative flex items-center gap-3">
                <GlyphChip k="ai" dark />
                <Cat dark>{t("items.ai.category")}</Cat>
              </div>
              <span className="relative mt-3 w-fit rounded-full bg-[color:var(--c-accent)] px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-white">
                {t("badge")}
              </span>
              <h3 className="relative mt-3 t-h4 font-[number:var(--fw-semi)] text-white">
                {t("items.ai.title")}
              </h3>
              <p className="relative mt-2 text-[14px] leading-[1.5] text-white/70">
                {t("items.ai.desc")}
              </p>
              <AiChatArt
                chat1={t("art.chat1")}
                chat2={t("art.chat2")}
                chat3={t("art.chat3")}
                lead={t("art.lead")}
                deal={t("art.deal")}
              />
              <CardCta label={t("items.ai.link")} dark />
            </Link>
          </Reveal>

          {/* Mobile */}
          <Reveal delay={150}>
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
              <CardCta label={t("items.mobile.link")} />
            </Link>
          </Reveal>

        </div>

        {/* ── Row 2: priced tiles (four across) ── */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:mt-5 md:gap-5 lg:grid-cols-4">
          <Reveal delay={220}>
            <SmallTile glyph={<GlyphChip k="store" />} category={<Cat>{t("store.category")}</Cat>} title={t("store.title")} body={t("store.body")} price={t("store.price")} href="/services/online-store" art={<StoreArt />} />
          </Reveal>
          <Reveal delay={280}>
            <SmallTile glyph={<GlyphChip k="automation" />} category={<Cat>{t("automation.category")}</Cat>} title={t("automation.title")} body={t("automation.body")} price={t("automation.price")} href="/services/automation" art={<FlowArt />} />
          </Reveal>
          <Reveal delay={340}>
            <SmallTile glyph={<GlyphChip k="telegram" />} category={<Cat>{t("telegram.category")}</Cat>} title={t("telegram.title")} body={t("telegram.body")} price={t("telegram.price")} href="/services/telegram-bots" art={<TelegramArt />} />
          </Reveal>
          <Reveal delay={400}>
            <SmallTile glyph={<GlyphChip k="ads" />} category={<Cat>{t("ads.category")}</Cat>} title={t("ads.title")} body={t("ads.body")} price={t("ads.price")} href="/services/advertising" art={<AdsArt />} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/* ───────────────────────── ILLUSTRATIONS ───────────────────────── */

/** AI tile — a compact chat with a "→ CRM · deal won" chip. */
function AiChatArt({
  chat1,
  chat2,
  chat3,
  lead,
  deal,
}: {
  chat1: string;
  chat2: string;
  chat3: string;
  lead: string;
  deal: string;
}) {
  return (
    <div aria-hidden className="relative mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm">
      <div className="flex flex-col gap-1.5">
        <span className="max-w-[90%] self-start rounded-2xl rounded-bl-[5px] px-2.5 py-1.5 text-[12px] leading-[1.35] text-white" style={{ background: "#182533" }}>
          {chat1}
        </span>
        <span className="max-w-[78%] self-end rounded-2xl rounded-br-[5px] px-2.5 py-1.5 text-[12px] leading-[1.35] text-white" style={{ background: "#2b5278" }}>
          {chat2}
        </span>
        <span className="max-w-[92%] inline-flex items-center gap-1.5 self-start rounded-2xl rounded-bl-[5px] px-2.5 py-1.5 text-[12px] leading-[1.35] text-white" style={{ background: "#182533" }}>
          {chat3}
          <Check className="shrink-0 text-emerald-400" />
        </span>
      </div>

      <div
        className="mt-2.5 flex items-center justify-between rounded-xl border px-2.5 py-2"
        style={{ background: "rgba(255,122,45,0.10)", borderColor: "rgba(255,122,45,0.40)" }}
      >
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-white/80">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ color: "var(--c-accent)" }}>
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {lead}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
          <Check /> {deal}
        </span>
      </div>
    </div>
  );
}

/** Websites — a tiny browser window with a Lighthouse-style speed score. */
function BrowserArt({ rank }: { rank: string }) {
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
            <Check className="h-2.5 w-2.5" /> {rank}
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
  art,
}: {
  glyph: React.ReactNode;
  category: React.ReactNode;
  title: string;
  body: string;
  price: string;
  href: React.ComponentProps<typeof Link>["href"];
  art: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${tileBase} ${tileLight}`}>
      <Aura />
      <div className="relative flex items-center gap-3">
        {glyph}
        {category}
      </div>
      <h3 className="relative mt-4 t-h4 font-[number:var(--fw-semi)] text-[color:var(--color-text)]">{title}</h3>
      <p className="relative mt-2 text-[14px] leading-[1.5] text-[color:var(--color-text-2)]">{body}</p>

      {/* mock + price share a bottom-anchored block so all four glances align */}
      <div className="relative mt-auto">
        {art}
        <div className="flex items-center justify-between gap-3 pt-4 md:pt-5">
          <span className="text-[14.5px] font-medium tracking-[-0.01em] text-[color:var(--color-text)]">{price}</span>
          <Arrow className="text-[color:var(--c-accent)] transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

/* Compact, decorative product glances for the four priced tiles — same visual
   language as the row-1 arts (framed surface, accent + skeleton), so the whole
   bento reads as one system. All aria-hidden; theme tokens keep them correct in
   light and dark. */

/** Store — a product row with an add control + a checkout bar. */
function StoreArt() {
  return (
    <div
      aria-hidden
      className="mt-4 rounded-xl border border-[color:var(--color-divider)] bg-[color:var(--color-bg)] p-2.5 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center gap-2.5 rounded-lg bg-[color:var(--color-bg-alt)] p-2">
        <span
          className="grid h-9 w-9 flex-none place-items-center rounded-lg"
          style={{ background: "linear-gradient(150deg, var(--c-accent-soft), transparent)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
            <path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9" />
          </svg>
        </span>
        <span className="flex flex-1 flex-col gap-1.5">
          <span className="h-2 w-3/4 rounded-full bg-[color:var(--color-divider)]" />
          <span className="h-2 w-10 rounded-full bg-[color:var(--c-accent)]" />
        </span>
        <span className="grid h-6 w-6 flex-none place-items-center rounded-full text-white" style={{ background: "var(--c-accent)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "linear-gradient(160deg,#FF7A2D,#E8590C)" }}>
        <span className="h-2 w-16 rounded-full bg-white/70" />
        <span className="h-2 w-7 rounded-full bg-white/90" />
      </div>
    </div>
  );
}

/** Automation — a three-node pipeline ending in a green "done". */
function FlowArt() {
  return (
    <div
      aria-hidden
      className="mt-4 rounded-xl border border-[color:var(--color-divider)] bg-[color:var(--color-bg)] p-3 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center">
        {[0, 1, 2].map((i) => {
          const done = i === 2;
          return (
            <div key={i} className="flex flex-1 items-center last:flex-none">
              <span
                className="grid h-7 w-7 flex-none place-items-center rounded-lg text-[11px] font-semibold text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)]"
                style={
                  done
                    ? { background: "rgba(52,210,123,0.14)", color: "#2ba86a", boxShadow: "inset 0 0 0 1px rgba(52,210,123,0.4)" }
                    : { background: "var(--c-accent-soft)", boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--c-accent) 30%, transparent)" }
                }
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#2ba86a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  i + 1
                )}
              </span>
              {i < 2 && (
                <span className="mx-1.5 h-px flex-1" style={{ background: "linear-gradient(90deg, color-mix(in srgb, var(--c-accent) 45%, transparent), var(--color-divider))" }} />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-[color:var(--color-divider)] bg-[color:var(--color-bg-alt)] px-2.5 py-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--c-accent)"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" /></svg>
        <span className="h-2 flex-1 rounded-full bg-[color:var(--color-divider)]" />
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#2ba86a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
}

/** Telegram — a bot bubble with two inline buttons. */
function TelegramArt() {
  const TG = "#229ED9";
  return (
    <div
      aria-hidden
      className="mt-4 overflow-hidden rounded-xl border border-[color:var(--color-divider)] bg-[color:var(--color-bg)] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center gap-2 border-b border-[color:var(--color-divider)] px-3 py-2">
        <span className="grid h-6 w-6 flex-none place-items-center rounded-full" style={{ background: `linear-gradient(160deg, #2AABEE, ${TG})` }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M21.9 4.3 18.7 19.5c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9 9-8.1c.4-.3-.1-.5-.6-.2L6.3 13.4l-4.8-1.5c-1-.3-1-1 .2-1.5l18.7-7.2c.9-.3 1.6.2 1.3 1.6Z" /></svg>
        </span>
        <span className="flex flex-1 flex-col gap-1">
          <span className="h-1.5 w-16 rounded-full bg-[color:var(--color-divider)]" />
          <span className="h-1.5 w-9 rounded-full" style={{ background: `color-mix(in srgb, ${TG} 55%, transparent)` }} />
        </span>
      </div>
      <div className="space-y-2 p-2.5">
        <div className="max-w-[85%] space-y-1.5 rounded-xl rounded-tl-[4px] px-2.5 py-2" style={{ background: `color-mix(in srgb, ${TG} 12%, var(--color-bg-alt))` }}>
          <span className="block h-1.5 w-full rounded-full bg-[color:var(--color-divider)]" />
          <span className="block h-1.5 w-2/3 rounded-full bg-[color:var(--color-divider)]" />
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 1].map((i) => (
            <span key={i} className="grid h-6 place-items-center rounded-lg" style={{ background: `color-mix(in srgb, ${TG} 14%, transparent)` }}>
              <span className="h-1.5 w-8 rounded-full" style={{ background: `color-mix(in srgb, ${TG} 60%, transparent)` }} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Ads — a ROAS glance with a bar chart + KPI grid. */
function AdsArt() {
  const bars = [40, 55, 48, 68, 60, 82, 96];
  return (
    <div
      aria-hidden
      className="mt-4 rounded-xl border border-[color:var(--color-divider)] bg-[color:var(--color-bg)] p-3 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="h-1.5 w-9 rounded-full bg-[color:var(--color-divider)]" />
          <span className="h-4 w-14 rounded-md" style={{ background: "linear-gradient(150deg, var(--c-accent), color-mix(in srgb, var(--c-accent) 55%, #fff))" }} />
        </div>
        <div className="flex h-12 items-end gap-1">
          {bars.map((h, i) => (
            <span
              key={i}
              className="w-2 rounded-t-[2px]"
              style={{ height: `${h}%`, background: i === bars.length - 1 ? "var(--c-accent)" : "var(--c-accent-soft)" }}
            />
          ))}
        </div>
      </div>
      <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-[color:var(--color-divider)] pt-2.5">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="h-2 w-10 rounded-full bg-[color:var(--color-divider)]" />
            <span className="h-1.5 w-6 rounded-full bg-[color:var(--c-accent-soft)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

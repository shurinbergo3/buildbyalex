import type { CSSProperties, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TELEGRAM_URL } from "@/lib/contacts";
import { AppleMark, ChatGptLogo, GoogleG, TelegramMark } from "@/components/CaseHeroKit";

/* The HTML half of each film chapter. Everything here is static markup: the
   engine only moves `--p` (chapter progress) on the layer, and each element
   decides in CSS when it enters (--in) and leaves (--out). Positions inside
   `.pf-frame` are fractions of the clip's own 16:9 frame (--x, --y, --w). */

const sv = (vars: Record<string, string | number>) => vars as CSSProperties;

/* Sized through attributes: the global `svg { height: auto }` reset would
   flatten utility-sized stars to nothing. */
function Stars({ size = 12, color }: { size?: number; color: string }) {
  return (
    <span className="pf-stars" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 16 16" fill={color}>
          <path d="M8 1.3l1.9 4.1 4.5.5-3.4 3.1.9 4.4L8 11.4 4.1 13.4l.9-4.4L1.6 5.9l4.5-.5L8 1.3z" />
        </svg>
      ))}
    </span>
  );
}

function Copy({
  ns,
  slug,
  from = 0.05,
  to = 0.985,
  children,
}: {
  ns: string;
  slug?: string;
  from?: number;
  to?: number;
  children?: ReactNode;
}) {
  const t = useTranslations(ns);
  return (
    <div className="pf-copy">
      <p className="pf-kicker pf-in" style={sv({ "--in": from, "--out": to })}>
        {t("kicker")}
      </p>
      <h2 className="pf-title pf-in" style={sv({ "--in": from + 0.015, "--out": to })}>
        {t.rich("title", { em: (c) => <em>{c}</em> })}
      </h2>
      {/* Body and proof move as one block: on phones it folds away while the
          chapter's card is up, so the title drops back to the bottom edge. */}
      <div className="pf-more pf-in" style={sv({ "--in": from + 0.04, "--out": to })}>
        <p className="pf-body">{t.rich("body", { b: (c) => <b>{c}</b> })}</p>
        {slug && (
          <div className="pf-proof">
            <span className="pf-proof-value">{t("proof.value")}</span>
            <span className="pf-proof-label">{t("proof.label")}</span>
            <Link href={{ pathname: "/work/[slug]", params: { slug } }}>{t("proof.link")} →</Link>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

/* The page opens on the search headline (the same H1 the home page ranks
   with); the night-shift story takes over as soon as the camera moves. */
export function HeroLayer({ reviewCount }: { reviewCount: number }) {
  const t = useTranslations("promo.hero");
  const th = useTranslations("home.hero");
  const headline = th("headline").split("\n");
  return (
    <>
      <div
        className="pf-hero-shade pf-in"
        style={sv({ "--in": -1, "--out": 0.46, "--d": 0.08, "--rise": "0px" })}
        aria-hidden="true"
      />
      <div className="pf-hero">
        <p className="pf-hero-eyebrow pf-in" style={sv({ "--in": -1, "--out": 0.1 })}>
          {t("eyebrow")}
        </p>
        <h1 className="pf-hero-title pf-in" style={sv({ "--in": -1, "--out": 0.11 })}>
          {headline.map((line) => (
            <span key={line} className="pf-line">
              {line}
            </span>
          ))}
          <em>{th("kicker")}</em>
        </h1>
        <p className="pf-hero-sub pf-in" style={sv({ "--in": -1, "--out": 0.1 })}>
          {t("sub")}
        </p>
        <div className="pf-hero-cta pf-in" style={sv({ "--in": -1, "--out": 0.09 })}>
          <Link href="/contact" className="pf-btn pf-btn--primary">
            {t("primary")}
          </Link>
          <button type="button" className="pf-btn pf-btn--ghost" data-film-go="search">
            {t("secondary")}
            <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="pf-hero-meta pf-in" style={sv({ "--in": -1, "--out": 0.08 })}>
          <span className="pf-hero-stars">
            <Stars color="#FF9A52" />
            {th("reviews", { count: reviewCount })}
          </span>
          <span>
            {t("altLabel")}{" "}
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer noopener">
              {t("altLink")} ↗
            </a>
          </span>
        </div>
      </div>
      <div className="pf-story pf-in" style={sv({ "--in": 0.14, "--out": 0.44, "--d": 0.05 })}>
        <p className="pf-story-title">
          <span className="pf-hero-time">{t("time")}</span> {t("title")}
          <em>{t("accent")}</em>
        </p>
      </div>
      <p className="pf-hint pf-in" style={sv({ "--in": -1, "--out": 0.05, "--d": 0.04 })}>
        {t("scroll")}
      </p>
    </>
  );
}

export function SearchLayer() {
  const t = useTranslations("promo.search");
  return (
    <>
      <Copy ns="promo.search" slug="legalwin" />
      <div className="pf-box pf-frame">
        <div
          className="pf-at pf-query pf-in"
          style={sv({ "--x": 0.305, "--y": 0.5, "--w": 0.42, "--in": 0.005, "--out": 0.2, "--d": 0.03, "--rise": "0px" })}
        >
          <span className="pf-query-text">{t("serp.query")}</span>
        </div>

        <div
          className="pf-at pf-at--card pf-glass pf-serp pf-in pf-in--zoom"
          style={sv({ "--x": 0.655, "--y": 0.34, "--w": 0.3, "--in": 0.5, "--out": 0.75 })}
        >
          <div className="pf-serp-bar">
            <GoogleG />
            <span>{t("serp.query")}</span>
          </div>
          <div className="pf-serp-hit">
            <div className="pf-serp-url">
              <span className="pf-fav">L</span>
              <span>{t("serp.url")}</span>
              <span className="pf-rank">{t("serp.rank")}</span>
            </div>
            <p className="pf-serp-title">{t("serp.title")}</p>
            <p className="pf-serp-snippet">{t("serp.snippet")}</p>
            <p className="pf-serp-rating">
              <Stars size={11} color="#FBBC05" />
              <span>{t("serp.rating")}</span>
            </p>
          </div>
        </div>

        <div
          className="pf-at pf-at--card pf-glass pf-gpt pf-in pf-in--zoom"
          style={sv({ "--x": 0.655, "--y": 0.34, "--w": 0.3, "--in": 0.74, "--out": 0.985 })}
        >
          <div className="pf-gpt-head">
            <ChatGptLogo />
            ChatGPT
          </div>
          <p className="pf-gpt-q">{t("gpt.question")}</p>
          <p className="pf-gpt-a">{t("gpt.answer")}</p>
          <span className="pf-gpt-src">↗ {t("gpt.source")}</span>
        </div>
      </div>
    </>
  );
}

const SITE_LABEL_Y = [0.14, 0.235, 0.33, 0.425, 0.52, 0.615];

export function SiteLayer() {
  const t = useTranslations("promo.site");
  const labels = t.raw("layers") as string[];
  return (
    <>
      <Copy ns="promo.site" slug="visionair" />
      <div className="pf-box pf-frame">
        {labels.map((label, i) => (
          <div
            key={label}
            className="pf-at pf-label pf-only-d pf-in"
            style={sv({ "--x": 0.7, "--y": SITE_LABEL_Y[i], "--w": 0.28, "--in": 0.5 + i * 0.045, "--out": 0.985, "--rise": "10px" })}
          >
            {label}
          </div>
        ))}
        <div
          className="pf-at pf-at--card pf-chips pf-only-m pf-in"
          style={sv({ "--x": 0, "--y": 0, "--in": 0.5, "--out": 0.985 })}
        >
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </>
  );
}

export function AgentLayer() {
  const t = useTranslations("promo.agent");
  const messages = t.raw("chat.messages") as { from: "client" | "bot"; text: string }[];
  return (
    <>
      <Copy ns="promo.agent" slug="legalwin" />
      <div className="pf-box pf-frame">
        <div
          className="pf-at pf-at--card pf-glass pf-chat pf-in pf-in--zoom"
          style={sv({ "--x": 0.625, "--y": 0.1, "--w": 0.335, "--in": 0.4, "--out": 0.985 })}
        >
          <div className="pf-chat-head">
            <span className="pf-avatar">M</span>
            <div>
              <div className="pf-chat-name">{t("chat.name")}</div>
              <div className="pf-chat-role">{t("chat.role")}</div>
            </div>
            <span className="pf-chat-status">{t("chat.status")}</span>
          </div>
          <div className="pf-chat-body">
            {messages.map((m, i) => (
              <p
                key={i}
                className={`pf-msg pf-msg--${m.from} pf-in`}
                style={sv({ "--in": 0.45 + i * 0.075, "--out": 2, "--d": 0.03, "--rise": "10px" })}
              >
                {m.text}
              </p>
            ))}
          </div>
          <div className="pf-chat-input">{t("chat.input")}</div>
        </div>
      </div>
    </>
  );
}

export function CrmLayer() {
  const t = useTranslations("promo.crm");
  const fields = t.raw("card.fields") as { k: string; v: string }[];
  const stages = t.raw("card.stages") as string[];
  return (
    <>
      <Copy ns="promo.crm" slug="crm-bot" />
      <div className="pf-box pf-frame">
        <div
          className="pf-at pf-at--card pf-glass pf-deal pf-in pf-in--zoom"
          style={sv({ "--x": 0.575, "--y": 0.28, "--w": 0.34, "--in": 0.46, "--out": 0.985 })}
        >
          <div className="pf-deal-board">{t("card.board")}</div>
          <div className="pf-deal-top">
            <span className="pf-avatar">ОП</span>
            <div>
              <div className="pf-deal-name">{t("card.name")}</div>
              <div className="pf-deal-topic">{t("card.topic")}</div>
            </div>
            <span className="pf-deal-amount">{t("card.amount")}</span>
          </div>
          <div className="pf-steps">
            {stages.map((s, i) => (
              <span key={s} className="pf-step">
                <i style={sv({ "--in": i < 3 ? 0.5 + i * 0.08 : 9 })} />
              </span>
            ))}
          </div>
          <div className="pf-step-names">
            {stages.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          <div className="pf-fields">
            {fields.map((f, i) => (
              <div
                key={f.k}
                className="pf-field pf-in"
                style={sv({ "--in": 0.52 + i * 0.06, "--out": 2, "--d": 0.03, "--rise": "8px" })}
              >
                <span>{f.k}</span>
                <i />
                <b>{f.v}</b>
              </div>
            ))}
          </div>
          <div className="pf-deal-foot">
            <span>{t("card.auto")}</span>
            <span className="pf-status">✓ {t("card.status")}</span>
          </div>
        </div>
      </div>
    </>
  );
}

const NODE_X = [0.168, 0.334, 0.5, 0.667, 0.833];

export function AutoLayer() {
  const t = useTranslations("promo.auto");
  const nodes = t.raw("nodes") as string[];
  return (
    <>
      <Copy ns="promo.auto" slug="leadbot" />
      <div className="pf-box pf-frame">
        {[3, 4].map((i) => (
          <div
            key={i}
            className="pf-at pf-tile-glow pf-in"
            style={sv({ "--x": NODE_X[i] - 0.06, "--y": 0.39, "--w": 0.12, "--in": i === 3 ? 0.62 : 0.74, "--out": 2, "--d": 0.05, "--rise": "0px" })}
            aria-hidden="true"
          />
        ))}
        {nodes.map((node, i) => (
          <div
            key={node}
            className="pf-at pf-node pf-only-d pf-in"
            style={sv({ "--x": NODE_X[i] - 0.08, "--y": 0.655, "--w": 0.16, "--in": 0.48 + i * 0.07, "--out": 0.985, "--rise": "10px" })}
          >
            {node}
          </div>
        ))}
        <div
          className="pf-at pf-stack-note pf-only-d pf-in"
          style={sv({ "--x": 0.25, "--y": 0.8, "--w": 0.5, "--in": 0.8, "--out": 0.985 })}
        >
          {t("stack")}
        </div>
        <div
          className="pf-at pf-at--card pf-chips pf-only-m pf-in"
          style={sv({ "--x": 0, "--y": 0, "--in": 0.48, "--out": 0.985 })}
        >
          {nodes.map((node, i) => (
            <span key={node}>
              {i > 0 && "→ "}
              {node}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export function AppLayer() {
  const t = useTranslations("promo.app");
  return (
    <>
      <Copy ns="promo.app" slug="body-forge" />
      <div className="pf-box pf-frame">
        <div
          className="pf-at pf-screen pf-in"
          style={sv({ "--x": 0.4165, "--y": 0.162, "--w": 0.1675, "--hh": "66.2%", "--in": 0.44, "--out": 0.985, "--d": 0.08, "--rise": "0px" })}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/cases/bodyforge-app-poster.webp" alt="" loading="lazy" decoding="async" />
        </div>
        <div
          className="pf-at pf-at--card pf-at--low pf-glass pf-store pf-in pf-in--zoom"
          style={sv({ "--x": 0.655, "--y": 0.36, "--w": 0.28, "--in": 0.56, "--out": 0.985 })}
        >
          <span className="pf-store-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="60%" height="60%" fill="currentColor">
              <rect x="1.5" y="9" width="3" height="6" rx="1" />
              <rect x="4.5" y="6.5" width="3.2" height="11" rx="1.2" />
              <rect x="7.7" y="11" width="8.6" height="2" rx="1" />
              <rect x="16.3" y="6.5" width="3.2" height="11" rx="1.2" />
              <rect x="19.5" y="9" width="3" height="6" rx="1" />
            </svg>
          </span>
          <div>
            <div className="pf-store-label">{t("store.label")}</div>
            <div className="pf-store-name">{t("store.name")}</div>
            <div className="pf-store-sub">
              <AppleMark /> {t("store.sub")}
            </div>
          </div>
          <span className="pf-store-get">{t("store.get")}</span>
        </div>
      </div>
    </>
  );
}

export function MorningLayer() {
  const t = useTranslations("promo.morning");
  const notice = (
    <>
      <div className="pf-notice-head">
        <TelegramMark />
        <span>{t("notice.app")}</span>
        <time>{t("notice.time")}</time>
      </div>
      <p className="pf-notice-title">{t("notice.title")}</p>
      <p className="pf-notice-text">{t("notice.text")}</p>
    </>
  );
  return (
    <>
      <Copy ns="promo.morning" from={0.3} to={2}>
        <div className="pf-morning-cta pf-in" style={sv({ "--in": 0.4, "--out": 2 })}>
          <Link href="/contact" className="pf-btn pf-btn--primary">
            {t("primary")}
          </Link>
          <a href={TELEGRAM_URL} target="_blank" rel="noreferrer noopener" className="pf-btn pf-btn--ghost">
            <TelegramMark className="h-5 w-5" />
            {t("secondary")}
          </a>
        </div>
        <p className="pf-morning-note pf-in" style={sv({ "--in": 0.44, "--out": 2 })}>
          {t("note")}
        </p>
      </Copy>
      <div className="pf-box pf-frame">
        <div
          className="pf-at pf-lock pf-only-d pf-in"
          style={sv({ "--x": 0.4425, "--y": 0.274, "--w": 0.115, "--hh": "45.3%", "--in": 0.46, "--out": 2, "--d": 0.08, "--rise": "0px" })}
        >
          <span className="pf-lock-time">09:00</span>
          <div className="pf-notice">{notice}</div>
        </div>
        <div
          className="pf-at pf-at--card pf-at--top pf-glass pf-notice pf-only-m pf-in"
          style={sv({ "--x": 0, "--y": 0, "--in": 0.46, "--out": 2 })}
        >
          {notice}
        </div>
      </div>
    </>
  );
}

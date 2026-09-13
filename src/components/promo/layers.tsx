import type { CSSProperties, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TELEGRAM_URL } from "@/lib/contacts";
import { AppleMark, ChatGptLogo, GoogleG, TelegramMark } from "@/components/CaseHeroKit";
import { WarsawTime } from "./WarsawTime";

/* The HTML half of each film chapter. Everything here is static markup: the
   engine only moves `--p` (chapter progress) on the layer, and each element
   decides in CSS when it enters (--in) and leaves (--out). Positions inside
   `.pf-frame` are fractions of the clip's own 16:9 frame (--x, --y, --w),
   measured on the last frame of each clip, where the camera comes to rest. */

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

/* Bitrix24-style mark for the CRM scene: the blue clock tile and the wordmark. */
function BitrixMark({ brand }: { brand: string }) {
  return (
    <span className="pf-bx-mark">
      <svg viewBox="0 0 24 24" width="1.4em" height="1.4em" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#2FC6F6" />
        <path d="M12 6.4V12l3.7 2.3" stroke="#fff" strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span>
        {brand}
        <b>24</b>
      </span>
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

/* the five glass result slabs under the chosen card, top to bottom */
const RESULT_SLABS = [
  { x: 0.3925, y: 0.572, w: 0.215, h: 3.4 },
  { x: 0.381, y: 0.611, w: 0.238, h: 3.9 },
  { x: 0.3675, y: 0.663, w: 0.265, h: 4.8 },
  { x: 0.35, y: 0.726, w: 0.3, h: 5.7 },
  { x: 0.325, y: 0.806, w: 0.35, h: 8.3 },
];

export function SearchLayer() {
  const t = useTranslations("promo.search");
  const results = t.raw("results") as string[];
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
        {/* once the camera settles the bar sits higher and smaller; the query stays in it */}
        <div
          className="pf-at pf-query pf-query--rest pf-only-d pf-in"
          style={sv({ "--x": 0.342, "--y": 0.212, "--w": 0.33, "--in": 0.4, "--out": 0.985, "--d": 0.05, "--rise": "0px" })}
        >
          {t("serp.query")}
        </div>

        {results.map((r, i) => (
          <div
            key={r}
            className="pf-at pf-result pf-in"
            style={sv({
              "--x": RESULT_SLABS[i].x,
              "--y": RESULT_SLABS[i].y,
              "--w": RESULT_SLABS[i].w,
              "--hh": `${RESULT_SLABS[i].h}%`,
              "--fs": 0.62 + i * 0.1,
              "--in": 0.51 + i * 0.012,
              "--out": 0.985,
              "--rise": "0px",
            })}
          >
            <span>{r}</span>
          </div>
        ))}

        {/* the chosen card is tilted in the frame, so its label is too */}
        <div
          className="pf-at pf-hit pf-in"
          style={sv({ "--x": 0.39, "--y": 0.418, "--w": 0.22, "--hh": "10.6%", "--in": 0.51, "--out": 0.985, "--rise": "0px", rotate: "-7.9deg" })}
        >
          <span className="pf-hit-url">{t("hit.url")}</span>
          <span className="pf-hit-title">{t("hit.title")}</span>
          <span className="pf-hit-rating">{t("hit.rating")}</span>
        </div>

        <div
          className="pf-at pf-at--card pf-glass pf-serp pf-in pf-in--zoom"
          style={sv({ "--x": 0.655, "--y": 0.34, "--w": 0.3, "--in": 0.44, "--out": 0.6 })}
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
          style={sv({ "--x": 0.655, "--y": 0.34, "--w": 0.3, "--in": 0.59, "--out": 0.985 })}
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
            style={sv({ "--x": 0.7, "--y": SITE_LABEL_Y[i], "--w": 0.28, "--in": 0.46 + i * 0.015, "--out": 0.985, "--rise": "10px" })}
          >
            {label}
          </div>
        ))}
        <div
          className="pf-at pf-at--card pf-chips pf-only-m pf-in"
          style={sv({ "--x": 0, "--y": 0, "--in": 0.46, "--out": 0.985 })}
        >
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </>
  );
}

/* The six glass speech bubbles around the phone, in the order the
   conversation reads: amber ones are the client, clear ones the agent. */
const BUBBLES = [
  { x: 0.1425, y: 0.353, w: 0.16, h: 17.6, client: true },
  { x: 0.294, y: 0.237, w: 0.096, h: 11.1 },
  { x: 0.609, y: 0.133, w: 0.142, h: 16.5 },
  { x: 0.625, y: 0.55, w: 0.111, h: 12.6, client: true },
  { x: 0.711, y: 0.35, w: 0.1215, h: 13.9 },
  { x: 0.294, y: 0.583, w: 0.09, h: 10.4 },
];

export function AgentLayer() {
  const t = useTranslations("promo.agent");
  const messages = t.raw("chat.messages") as { from: "client" | "bot"; text: string }[];
  const bubbles = t.raw("bubbles") as string[];
  const mini = t.raw("mini") as string[];
  return (
    <>
      <Copy ns="promo.agent" slug="legalwin" />
      <div className="pf-box pf-frame">
        {bubbles.map((text, i) => (
          <div
            key={text}
            className="pf-at pf-bubble pf-only-d pf-in"
            data-client={BUBBLES[i].client ? "" : undefined}
            style={sv({
              "--x": BUBBLES[i].x,
              "--y": BUBBLES[i].y,
              "--w": BUBBLES[i].w,
              "--hh": `${BUBBLES[i].h}%`,
              "--in": 0.39 + i * 0.018,
              "--out": 0.985,
              "--rise": "6px",
            })}
          >
            {text}
          </div>
        ))}

        {/* the same conversation, running on the phone itself */}
        <div
          className="pf-at pf-mini pf-only-d pf-in"
          style={sv({ "--x": 0.43, "--y": 0.203, "--w": 0.14, "--hh": "56.4%", "--in": 0.4, "--out": 0.985, "--rise": "0px", "--d": 0.08 })}
        >
          <div className="pf-mini-head">
            <span className="pf-avatar">M</span>
            <span>
              <span className="pf-mini-name">{t("chat.name")}</span>
              <span className="pf-mini-status">{t("chat.status")}</span>
            </span>
          </div>
          <div className="pf-mini-body">
            {mini.map((text, i) => (
              <p
                key={text}
                className={`pf-mini-msg pf-mini-msg--${i % 2 ? "bot" : "client"} pf-in`}
                style={sv({ "--in": 0.41 + i * 0.03, "--out": 2, "--d": 0.03, "--rise": "4px" })}
              >
                {text}
              </p>
            ))}
          </div>
          <div className="pf-mini-input">{t("chat.input")}</div>
        </div>

        <div
          className="pf-at pf-at--card pf-glass pf-chat pf-only-m pf-in pf-in--zoom"
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
                style={sv({ "--in": 0.42 + i * 0.022, "--out": 2, "--d": 0.03, "--rise": "10px" })}
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

/* The glass kanban board read as a Bitrix24 pipeline: the header slot of each
   column and the first card in it. Tonight's lead waits in "Звонок", the stage
   the deal card shows; the glowing card at the end is a paid deal. */
const BX_HEADS = [
  { x: 0.172, y: 0.198, w: 0.123, h: 6.6 },
  { x: 0.328, y: 0.209, w: 0.112, h: 6.3 },
  { x: 0.472, y: 0.222, w: 0.104, h: 5.6 },
  { x: 0.606, y: 0.233, w: 0.099, h: 5.8 },
  { x: 0.734, y: 0.247, w: 0.096, h: 5.3 },
];
const BX_CARDS = [
  { x: 0.172, y: 0.283, w: 0.056, h: 6.1 },
  { x: 0.328, y: 0.294, w: 0.052, h: 6.1 },
  { x: 0.473, y: 0.302, w: 0.047, h: 5.9 },
  { x: 0.6075, y: 0.311, w: 0.0455, h: 5.6 },
  { x: 0.734, y: 0.317, w: 0.046, h: 5.5 },
];
const BX_COLORS = ["#39A8EF", "#2FC6F6", "#FFA900", "#FF7A2D", "#9DCF00"];
const BX_COUNTS = [9, 7, 4, 5, 3];

export function CrmLayer() {
  const t = useTranslations("promo.crm");
  const fields = t.raw("card.fields") as { k: string; v: string }[];
  const stages = t.raw("card.stages") as string[];
  const bxStages = t.raw("bx.stages") as string[];
  const deals = t.raw("bx.deals") as { n: string; v: string }[];
  return (
    <>
      <Copy ns="promo.crm" slug="crm-bot" />
      <div className="pf-box pf-frame">
        <div
          className="pf-at pf-bx-logo pf-only-d pf-in"
          style={sv({ "--x": 0.318, "--y": 0.1, "--w": 0.4, "--in": 0.45, "--out": 0.985 })}
        >
          <BitrixMark brand={t("bx.brand")} />
          <span>{t("bx.board")}</span>
        </div>

        {bxStages.map((stage, i) => (
          <div
            key={stage}
            className="pf-at pf-bx-head pf-only-d pf-in"
            style={sv({
              "--x": BX_HEADS[i].x,
              "--y": BX_HEADS[i].y,
              "--w": BX_HEADS[i].w,
              "--hh": `${BX_HEADS[i].h}%`,
              "--c": BX_COLORS[i],
              "--in": 0.45 + i * 0.012,
              "--out": 0.985,
              "--rise": "0px",
            })}
          >
            <span>{stage}</span>
            <em>{BX_COUNTS[i]}</em>
          </div>
        ))}

        {deals.map((deal, i) => (
          <div
            key={deal.n}
            className="pf-at pf-bx-card pf-only-d pf-in"
            data-new={i === 2 ? "" : undefined}
            data-hot={i === deals.length - 1 ? "" : undefined}
            style={sv({
              "--x": BX_CARDS[i].x,
              "--y": BX_CARDS[i].y,
              "--w": BX_CARDS[i].w,
              "--hh": `${BX_CARDS[i].h}%`,
              "--in": 0.47 + i * 0.012,
              "--out": 0.985,
              "--rise": "0px",
            })}
          >
            <b>{deal.n}</b>
            <span>{deal.v}</span>
          </div>
        ))}

        <div
          className="pf-at pf-at--card pf-glass pf-deal pf-in pf-in--zoom"
          style={sv({ "--x": 0.595, "--y": 0.5, "--w": 0.3, "--in": 0.47, "--out": 0.985 })}
        >
          <div className="pf-deal-board">
            <BitrixMark brand={t("bx.brand")} />
            <span>
              {t("bx.deal")} · {t("card.board")}
            </span>
          </div>
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
                <i style={sv({ "--in": i < 3 ? 0.5 + i * 0.025 : 9 })} />
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
                style={sv({ "--in": 0.49 + i * 0.025, "--out": 2, "--d": 0.03, "--rise": "8px" })}
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
const TILE_X = [0.1075, 0.274, 0.44, 0.606, 0.7725];

/* what happens at each step of the chain: form, pipeline, mail, calendar, Telegram */
const TILE_ICONS: ReactNode[] = [
  <g key="form">
    <rect x="5" y="3.5" width="14" height="17" rx="2.6" />
    <path d="M9 8.5h6M9 12h6M9 15.5h3.5" />
  </g>,
  <g key="crm">
    <rect x="3.5" y="4.5" width="4.6" height="15" rx="1.4" />
    <rect x="9.7" y="4.5" width="4.6" height="10.5" rx="1.4" />
    <rect x="15.9" y="4.5" width="4.6" height="6.5" rx="1.4" />
  </g>,
  <g key="mail">
    <rect x="3" y="5.5" width="18" height="13" rx="2.6" />
    <path d="m3.6 7.2 8.4 6 8.4-6" />
  </g>,
  <g key="calendar">
    <rect x="3.5" y="5" width="17" height="15" rx="2.6" />
    <path d="M3.5 10h17M8 3v4M16 3v4M9 14.5l2 2 4-4" />
  </g>,
  <path key="telegram" d="M20.5 4.5 3.5 11.2l6 2.1 1.9 6.2 3.2-3.9 4.6 3.4 1.3-14.5ZM9.5 13.3l7.9-5.6" />,
];

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
            style={sv({ "--x": NODE_X[i] - 0.06, "--y": 0.39, "--w": 0.12, "--in": i === 3 ? 0.5 : 0.53, "--out": 2, "--d": 0.05, "--rise": "0px" })}
            aria-hidden="true"
          />
        ))}
        {TILE_ICONS.map((icon, i) => (
          <div
            key={i}
            className="pf-at pf-tile-icon pf-in"
            style={sv({
              "--x": TILE_X[i],
              "--y": 0.391,
              "--w": 0.12,
              "--hh": "21.8%",
              "--in": i < 3 ? 0.45 + i * 0.02 : i === 3 ? 0.52 : 0.55,
              "--out": 2,
              "--rise": "0px",
            })}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" width="38%" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {icon}
            </svg>
          </div>
        ))}
        {nodes.map((node, i) => (
          <div
            key={node}
            className="pf-at pf-node pf-only-d pf-in"
            style={sv({ "--x": NODE_X[i] - 0.08, "--y": 0.655, "--w": 0.16, "--in": 0.46 + i * 0.022, "--out": 0.985, "--rise": "10px" })}
          >
            {node}
          </div>
        ))}
        <div
          className="pf-at pf-stack-note pf-only-d pf-in"
          style={sv({ "--x": 0.25, "--y": 0.8, "--w": 0.5, "--in": 0.53, "--out": 0.985 })}
        >
          {t("stack")}
        </div>
        <div
          className="pf-at pf-at--card pf-chips pf-only-m pf-in"
          style={sv({ "--x": 0, "--y": 0, "--in": 0.46, "--out": 0.985 })}
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

/* The phone runs the visitor's own app, not a portfolio screenshot: a small
   inbox that takes bookings. Drawn in HTML so the copy stays crisp and
   translatable instead of being baked into a picture. */
const APP_TABS: ReactNode[] = [
  <g key="inbox">
    <path d="M3.5 13.5h4l1.3 2.4h6.4l1.3-2.4h4" />
    <path d="M3.5 13.5 6 5.9A2.2 2.2 0 0 1 8.1 4.4h7.8A2.2 2.2 0 0 1 18 5.9l2.5 7.6v3.3a2.4 2.4 0 0 1-2.4 2.4H5.9a2.4 2.4 0 0 1-2.4-2.4z" />
  </g>,
  <g key="calendar">
    <rect x="3.6" y="5" width="16.8" height="14.6" rx="3" />
    <path d="M3.6 9.6h16.8M8.2 3.4v3.4M15.8 3.4v3.4" />
  </g>,
  <g key="clients">
    <circle cx="9.4" cy="9" r="3.4" />
    <path d="M3.8 19.4c0-3 2.5-4.8 5.6-4.8s5.6 1.8 5.6 4.8" />
    <path d="M16.5 8.2a3 3 0 0 1 0 5.6M18.2 19.4c0-2-.6-3.4-1.7-4.3" />
  </g>,
  <g key="profile">
    <circle cx="12" cy="8.4" r="3.6" />
    <path d="M5 19.6c0-3.4 3.1-5.2 7-5.2s7 1.8 7 5.2" />
  </g>,
];

export function AppLayer() {
  const t = useTranslations("promo.app");
  const rows = t.raw("screen.rows") as { time: string; name: string; note: string }[];
  const tabs = t.raw("screen.tabs") as string[];
  return (
    <>
      <Copy ns="promo.app" slug="body-forge" />
      <div className="pf-box pf-frame">
        <div
          className="pf-at pf-screen pf-in"
          style={sv({ "--x": 0.4165, "--y": 0.162, "--w": 0.1675, "--hh": "66.2%", "--in": 0.44, "--out": 0.985, "--d": 0.08, "--rise": "0px" })}
        >
          <div className="pf-app">
            <div className="pf-app-bar">
              <span>{t("screen.time")}</span>
              <span className="pf-app-signal" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </div>
            <div className="pf-app-head">
              <span className="pf-app-title">{t("screen.title")}</span>
              <span className="pf-app-count">{t("screen.count")}</span>
            </div>
            <div className="pf-app-card">
              <span className="pf-app-badge">{t("screen.badge")}</span>
              <span className="pf-app-name">{t("screen.name")}</span>
              <span className="pf-app-topic">{t("screen.topic")}</span>
              <span className="pf-app-slot">{t("screen.slot")}</span>
              <span className="pf-app-actions">
                <b>{t("screen.accept")}</b>
                <i>{t("screen.call")}</i>
              </span>
            </div>
            <span className="pf-app-next">{t("screen.next")}</span>
            <div className="pf-app-rows">
              {rows.map((r) => (
                <span key={r.time} className="pf-app-row">
                  <b>{r.time}</b>
                  <span>
                    <em>{r.name}</em>
                    {r.note}
                  </span>
                </span>
              ))}
            </div>
            <div className="pf-app-tabs">
              {tabs.map((label, i) => (
                <span key={label} data-on={i === 0 ? "" : undefined}>
                  <svg viewBox="0 0 24 24" width="1.5em" height="1.5em" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    {APP_TABS[i]}
                  </svg>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div
          className="pf-at pf-at--card pf-at--low pf-glass pf-store pf-in pf-in--zoom"
          style={sv({ "--x": 0.645, "--y": 0.36, "--w": 0.305, "--in": 0.5, "--out": 0.985 })}
        >
          <span className="pf-store-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="58%" height="58%" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.5 13.5h4l1.3 2.4h6.4l1.3-2.4h4" />
              <path d="M3.5 13.5 6 5.9A2.2 2.2 0 0 1 8.1 4.4h7.8A2.2 2.2 0 0 1 18 5.9l2.5 7.6v3.3a2.4 2.4 0 0 1-2.4 2.4H5.9a2.4 2.4 0 0 1-2.4-2.4z" />
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
  const head = (
    <>
      <div className="pf-notice-head">
        <TelegramMark />
        <span>{t("notice.app")}</span>
        <time>{t("notice.time")}</time>
      </div>
      <p className="pf-notice-title">{t("notice.title")}</p>
    </>
  );
  const notice = (
    <>
      {head}
      <p className="pf-notice-text">{t("notice.text")}</p>
    </>
  );
  return (
    <>
      <div
        className="pf-morning-shade pf-in"
        style={sv({ "--in": 0.24, "--out": 2, "--d": 0.12, "--rise": "0px" })}
        aria-hidden="true"
      />
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
        {/* the phone shows the real time in Warsaw, whenever the page is opened */}
        <div
          className="pf-at pf-lock pf-only-d pf-in"
          style={sv({ "--x": 0.4425, "--y": 0.274, "--w": 0.115, "--hh": "45.3%", "--in": 0.46, "--out": 2, "--d": 0.08, "--rise": "0px" })}
        >
          <span className="pf-lock-date">
            <WarsawTime fallback="" date />
          </span>
          <span className="pf-lock-time">
            <WarsawTime fallback="09:00" />
          </span>
          {/* the phone keeps the short version; the card next to it reads in full */}
          <div className="pf-notice">{head}</div>
        </div>
        <div
          className="pf-at pf-glass pf-notice pf-notice--float pf-only-d pf-in pf-in--zoom"
          style={sv({ "--x": 0.6, "--y": 0.3, "--w": 0.25, "--in": 0.47, "--out": 2 })}
        >
          {notice}
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

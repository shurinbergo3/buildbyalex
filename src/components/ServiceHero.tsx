"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useMessages, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container } from "./Container";
import { Section } from "./Section";
import { Button } from "./Button";
import { HeroWindow } from "./HeroWindow";
import { Link } from "@/i18n/navigation";
import { ProductShot } from "./storeGlyphs";
import { GoogleG, META_PATH, WhatsAppMark } from "./brandGlyphs";
import { AppIconMark } from "./AppIconMark";

/* ─────────────────────────────────────────────────────────────────────────
   Service hero — cinematic "key-art" stage shared by all six service pages.
   A dark, contained panel (matching the case-cover aesthetic: amber aurora,
   dot-grid, specular edge, faux chrome) with the selling copy on the left and
   a live, per-branch product glance on the right. The glance is deliberately
   a *teaser* — a compact, distinct surface — so it doesn't duplicate the full
   animated showcase that follows lower on the page.
   ───────────────────────────────────────────────────────────────────────── */

type Branch = "websites" | "store" | "ai" | "automation" | "mobile" | "telegram" | "ads";
type Metric = { v: string; l: string };

type HeroShape = {
  services: Record<
    Branch,
    {
      eyebrow: string;
      headline: string;
      lead: string;
      from: string;
      primaryCta: string;
      stack: { items: string[] };
      hero: { badge: string; metrics: Metric[]; mock: Record<string, unknown> };
    }
  >;
};

const AMBER = "#FF7A2D";
const META_BLUE = "#0A84FF";

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 / 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M8 1.5l1.96 4.27 4.7.55-3.5 3.2.96 4.62L8 11.9l-4.12 2.24.96-4.62-3.5-3.2 4.7-.55L8 1.5z"
            fill={AMBER}
          />
        </svg>
      ))}
    </div>
  );
}

/* ── Shared glass surface for the right-side glance ── */
function Glass({
  label,
  live,
  children,
}: {
  label: ReactNode;
  live?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[22px] border border-white/10 backdrop-blur-xl"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.02))",
        boxShadow:
          "0 34px 80px -34px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
    >
      <header className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-[9px] w-[9px] rounded-full bg-[#FF5F57]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[#FEBC2E]" />
          <span className="h-[9px] w-[9px] rounded-full bg-[#28C840]" />
        </span>
        <span className="ml-1.5 truncate text-[11.5px] font-medium tracking-[-0.01em] text-white/55">
          {label}
        </span>
        {live && (
          <span className="ml-auto flex items-center gap-1.5 text-[10.5px] font-medium text-[#7CE2A6]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34d27b] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34d27b]" />
            </span>
            live
          </span>
        )}
      </header>
      <div className="relative p-4">{children}</div>
    </div>
  );
}

function Chip({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0c0c0f]/85 px-3 py-1.5 text-[12px] font-medium text-white/85 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/* ════════════════════ Per-branch glances ════════════════════ */

function WebsitesMock({ m }: { m: Record<string, unknown> }) {
  const features = (m.features as string[]) ?? [];
  return (
    <div className="relative pb-6 pl-6 pt-7">
      <Glass label={m.url as string}>
        <div className="rounded-xl bg-gradient-to-b from-white/[0.04] to-transparent p-3.5">
          {/* nav */}
          <div className="flex items-center gap-2">
            <span className="grid h-5 w-5 flex-none place-items-center rounded-md text-[9px] font-bold text-[#1a0d04]" style={{ background: AMBER }}>
              B
            </span>
            <span className="text-[10px] font-semibold tracking-[-0.01em] text-white/85">{m.brand as string}</span>
            <span className="ml-auto flex items-center gap-2.5">
              {((m.nav as string[]) ?? []).map((item) => (
                <span key={item} className="hidden text-[8.5px] text-white/45 sm:inline">
                  {item}
                </span>
              ))}
              <span
                className="rounded-full px-2.5 py-1 text-[8.5px] font-semibold text-[#1a0d04]"
                style={{ background: AMBER }}
              >
                {m.navCta as string}
              </span>
            </span>
          </div>

          {/* hero block */}
          <div className="mt-5">
            <p className="text-[8px] font-semibold uppercase tracking-[0.18em]" style={{ color: AMBER }}>
              {m.pageEyebrow as string}
            </p>
            <p className="mt-2 text-[17px] font-semibold leading-[1.12] tracking-[-0.025em] text-white">
              {m.pageTitle as string}
            </p>
            <p className="mt-2 max-w-[85%] text-[9.5px] leading-[1.5] text-white/50">{m.pageSub as string}</p>
            <div className="mt-3.5 flex items-center gap-2">
              <span
                className="rounded-full px-3.5 py-1.5 text-[9.5px] font-semibold text-[#1a0d04]"
                style={{ background: AMBER, boxShadow: "0 8px 20px -8px rgba(255,122,45,0.7)" }}
              >
                {m.pageCta as string}
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1.5 text-[9.5px] font-medium text-white/70">
                {m.pageCta2 as string}
              </span>
            </div>
          </div>

          {/* feature row */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {features.map((f, i) => (
              <div key={i} className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-2">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 13l4 4L19 7" stroke={AMBER} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="mt-1.5 block text-[8.5px] font-medium leading-tight text-white/55">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </Glass>

      {/* floating proof chips */}
      <Chip className="absolute left-0 top-1" style={{ borderColor: "rgba(255,122,45,0.3)" }}>
        <GoogleG />
        <span className="font-semibold text-white">{m.serp as string}</span>
      </Chip>
      <Chip className="absolute -bottom-1 right-2 !px-3.5 !py-2">
        <span
          className="grid h-8 w-8 place-items-center rounded-full text-[13px] font-bold text-[#0a0a0a]"
          style={{ background: "conic-gradient(#34d27b 0 100%, #1d1d20 0)", boxShadow: "inset 0 0 0 3px #0c0c0f" }}
        >
          <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-[#0c0c0f] text-white">100</span>
        </span>
        <span className="text-[11px] leading-tight text-white/70">{m.score as string}</span>
      </Chip>
    </div>
  );
}

/* Interactive store glance — a tiny clothing shop you can actually use: tap to
   fill a basket, watch the cart total tick up, check out and pick courier
   delivery, land on an order-placed screen. Three stages flip in place so the
   surface never grows; fully usable on a phone (single column, large taps). */
type StoreProduct = { n: string; p: string };

const STORE_THUMBS = [
  "radial-gradient(120% 100% at 30% 0%, #3a2a18, #1a130c 70%)",
  "radial-gradient(120% 100% at 30% 0%, #1f2a38, #101620 70%)",
  "radial-gradient(120% 100% at 30% 0%, #322029, #181014 70%)",
  "radial-gradient(120% 100% at 30% 0%, #20302a, #111815 70%)",
];
/* hero catalogue → silhouette index: jacket · sneaker · hoodie · backpack */
const STORE_GLYPH = [0, 1, 2, 4];

function CartGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="20" r="1.3" />
      <circle cx="18" cy="20" r="1.3" />
      <path d="M2.5 3.5h2.3L7 15.4a1.4 1.4 0 0 0 1.4 1.1h8.5a1.4 1.4 0 0 0 1.4-1.1L20.8 7H5.4" />
    </svg>
  );
}

function StoreMock({ m }: { m: Record<string, unknown> }) {
  const reduce = useReducedMotion();
  const products = (m.products as StoreProduct[]) ?? [];
  const priceOf = (s: string) => Number(String(s).replace(/[^\d]/g, "")) || 0;
  const [qty, setQty] = useState<number[]>(() => products.map(() => 0));
  const [stage, setStage] = useState<"shop" | "delivery" | "done">("shop");

  const count = qty.reduce((a, b) => a + b, 0);
  const total = qty.reduce((sum, q, i) => sum + q * priceOf(products[i]?.p ?? ""), 0);
  const addItem = (i: number) => setQty((q) => q.map((v, j) => (j === i ? v + 1 : v)));
  const reset = () => {
    setQty(products.map(() => 0));
    setStage("shop");
  };

  const anim = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.25, ease: "easeOut" as const },
      };

  return (
    <div className="relative pb-6 pl-6 pt-7">
      <Glass label={m.url as string} live>
        <div className="min-h-[314px]">
          <AnimatePresence mode="wait">
            {stage === "shop" && (
              <motion.div key="shop" {...anim}>
                {/* shop header */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="grid h-6 w-6 place-items-center rounded-lg text-[11px] font-bold text-[#0a0a0a]" style={{ background: AMBER }}>
                      {(m.brand as string).slice(0, 1)}
                    </span>
                    <span className="text-[12.5px] font-semibold tracking-[-0.01em] text-white">{m.brand as string}</span>
                  </span>
                  <span className="relative inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/70">
                    <CartGlyph />
                    <span className="tabular-nums">{count}</span>
                    {count > 0 && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full" style={{ background: AMBER }} />}
                  </span>
                </div>

                {/* product grid */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {products.map((pr, i) => (
                    <div key={i} className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02]">
                      <div className="relative grid aspect-[5/4] place-items-center" style={{ background: STORE_THUMBS[i % STORE_THUMBS.length] }}>
                        <span className="absolute inset-0" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }} />
                        <ProductShot i={STORE_GLYPH[i % STORE_GLYPH.length]} className="h-[86%] w-[86%]" />
                        {qty[i] > 0 && (
                          <span className="absolute left-1.5 top-1.5 grid h-4 min-w-[16px] place-items-center rounded-full px-1 text-[9px] font-bold text-[#0a0a0a]" style={{ background: AMBER }}>
                            {qty[i]}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-1.5 px-2 py-2">
                        <span className="min-w-0">
                          <span className="block truncate text-[10.5px] font-medium text-white/85">{pr.n}</span>
                          <span className="block text-[10.5px] font-semibold text-white">{pr.p}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => addItem(i)}
                          aria-label={`${m.add as string} — ${pr.n}`}
                          className="grid h-6 w-6 flex-none cursor-pointer place-items-center rounded-full text-[#0a0a0a] transition-transform duration-150 active:scale-90"
                          style={{ background: AMBER }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* cart bar */}
                <div className="mt-3">
                  {count === 0 ? (
                    <p className="rounded-xl border border-dashed border-white/10 px-3 py-2.5 text-center text-[11px] text-white/45">
                      {m.hint as string}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setStage("delivery")}
                      className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-transform duration-150 active:scale-[0.99]"
                      style={{ background: "linear-gradient(160deg,#FF7A2D,#E8590C)" }}
                    >
                      <span className="text-[12px] font-semibold text-white">{m.checkout as string}</span>
                      <span className="text-[12px] font-semibold text-white tabular-nums">€{total}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {stage === "delivery" && (
              <motion.div key="delivery" {...anim}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStage("shop")}
                    aria-label="←"
                    className="grid h-6 w-6 flex-none cursor-pointer place-items-center rounded-full border border-white/10 text-white/60 transition-colors hover:text-white"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M14 6l-6 6 6 6" />
                    </svg>
                  </button>
                  <span className="text-[12.5px] font-semibold text-white">{m.deliveryTitle as string}</span>
                </div>

                {/* courier option */}
                <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-[#FF7A2D]/35 bg-[#FF7A2D]/[0.08] p-2.5">
                  <span className="grid h-8 w-8 flex-none place-items-center rounded-lg text-[#ffb487]" style={{ background: "rgba(255,122,45,0.16)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M2.5 6.5h11v9h-11z" />
                      <path d="M13.5 9.5H17l3.5 3.5v2.5h-7z" />
                      <circle cx="6.5" cy="18" r="1.6" />
                      <circle cx="17" cy="18" r="1.6" />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block truncate text-[11.5px] font-medium text-white">{m.courier as string}</span>
                    <span className="block text-[10.5px] text-white/55">{m.eta as string}</span>
                  </span>
                  <span className="flex-none text-[11px] font-semibold text-[#7fe3a6]">{m.free as string}</span>
                </div>

                {/* address */}
                <div className="mt-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5">
                  <span className="block text-[9px] font-medium uppercase tracking-[0.1em] text-white/40">{m.addressLabel as string}</span>
                  <span className="mt-1 block text-[11.5px] text-white/80">{m.address as string}</span>
                </div>

                {/* total + pay */}
                <div className="mt-3 flex items-center justify-between border-t border-white/[0.07] pt-3">
                  <span className="text-[11.5px] text-white/55">{m.total as string}</span>
                  <span className="text-[16px] font-semibold tracking-[-0.02em] text-white tabular-nums">€{total}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStage("done")}
                  className="mt-3 grid w-full cursor-pointer place-items-center rounded-xl py-2.5 text-[12px] font-semibold text-white transition-transform duration-150 active:scale-[0.99]"
                  style={{ background: "linear-gradient(160deg,#FF7A2D,#E8590C)" }}
                >
                  {m.pay as string} · €{total}
                </button>
              </motion.div>
            )}

            {stage === "done" && (
              <motion.div key="done" {...anim} className="grid place-items-center py-7 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full" style={{ background: "rgba(52,210,123,0.14)", border: "1px solid rgba(52,210,123,0.4)" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <motion.path
                      d="M5 12.5l4 4 10-10"
                      stroke="#34d27b"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={reduce ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </svg>
                </span>
                <p className="mt-4 text-[14px] font-semibold text-white">{m.done as string}</p>
                <p className="mt-1 text-[11.5px] text-white/55">{m.doneSub as string}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70 tabular-nums">
                  {m.orderId as string} · €{total}
                </span>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-4 cursor-pointer text-[11.5px] font-medium text-[#ffb487] underline-offset-2 transition-colors hover:underline"
                >
                  {m.reset as string}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Glass>

      {/* floating proof chips */}
      <Chip className="absolute left-0 top-1" style={{ borderColor: "rgba(255,122,45,0.3)" }}>
        <GoogleG />
        <span className="font-semibold text-white">{m.serp as string}</span>
      </Chip>
      <Chip className="absolute -bottom-1 right-2 !px-3.5 !py-2">
        <span
          className="grid h-8 w-8 place-items-center rounded-full text-[13px] font-bold text-[#0a0a0a]"
          style={{ background: "conic-gradient(#34d27b 0 100%, #1d1d20 0)", boxShadow: "inset 0 0 0 3px #0c0c0f" }}
        >
          <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-[#0c0c0f] text-white">100</span>
        </span>
        <span className="text-[11px] leading-tight text-white/70">{m.score as string}</span>
      </Chip>
    </div>
  );
}

function AiMock({ m }: { m: Record<string, unknown> }) {
  return (
    <Glass label={m.agent as string} live>
      <div className="flex flex-col gap-2.5">
        {/* incoming */}
        <div className="max-w-[82%] self-start rounded-2xl rounded-tl-md bg-white/[0.08] px-3.5 py-2.5 text-[12.5px] leading-[1.4] text-white/85">
          {m.q as string}
        </div>
        {/* outgoing (agent) */}
        <div
          className="max-w-[86%] self-end rounded-2xl rounded-tr-md px-3.5 py-2.5 text-[12.5px] leading-[1.4] text-white"
          style={{ background: "linear-gradient(160deg, #FF7A2D, #E8590C)" }}
        >
          {m.a as string}
        </div>
        {/* outcome */}
        <div className="self-end inline-flex items-center gap-1.5 rounded-full border border-[#34d27b]/25 bg-[#34d27b]/10 px-2.5 py-1 text-[11px] font-medium text-[#9beabf]">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4 4 10-10" stroke="#34d27b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {m.outcome as string}
        </div>
        {/* typing */}
        <div className="mt-0.5 inline-flex items-center gap-1 self-start rounded-full bg-white/[0.06] px-3 py-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-white/45"
              style={{ animation: `aiTyping 1.2s ${i * 0.18}s ease-in-out infinite` }}
            />
          ))}
        </div>
      </div>
    </Glass>
  );
}

/* Automation glance — the two halves of the promise, wired together: the bot
   answers the client in WhatsApp (top) and every reply pushes the deal one
   stage down the CRM funnel (bottom). One timer drives both, then it loops. */
type ChatLine = { s: "in" | "out"; t: string };
type FunnelStage = { n: string; c: string };

/* Funnel taper — each stage's bar as a share of the track. */
const FUNNEL_W = [100, 79, 60, 44];

function AutomationMock({ m }: { m: Record<string, unknown> }) {
  const reduce = useReducedMotion();
  const lines = (m.msgs as ChatLine[]) ?? [];
  const stages = (m.stages as FunnelStage[]) ?? [];
  const client = (m.client as string) ?? "";
  // One extra beat at the end so the closed deal has a moment to land.
  const period = lines.length + 2;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTick((v) => v + 1), 1600);
    return () => clearInterval(id);
  }, [reduce]);

  const cycle = Math.floor(tick / period);
  const phase = reduce ? lines.length : tick % period;
  // The thread is never empty — the client's first message is already there.
  const shown = Math.min(phase + 1, lines.length);
  const stage = Math.max(0, Math.min(shown - 1, stages.length - 1));
  const won = shown >= lines.length;
  const typing = !reduce && shown < lines.length ? lines[shown].s : null;

  return (
    <div
      className="relative overflow-hidden rounded-[22px] border border-white/10 backdrop-blur-xl"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.02))",
        boxShadow: "0 34px 80px -34px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
    >
      {/* ── messenger ── */}
      <header className="flex items-center gap-2.5 px-4 py-2.5" style={{ background: "#1f2c33" }}>
        <span className="grid h-8 w-8 flex-none place-items-center rounded-full" style={{ background: "linear-gradient(160deg,#25D366,#128C7E)" }}>
          <WhatsAppMark size={17} color="#fff" />
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[12.5px] font-semibold text-white">{client}</span>
          <span className="block truncate text-[10.5px] text-[#8696a0]">{m.chatStatus as string}</span>
        </span>
        <span className="ml-auto flex-none rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.06em] text-[#7ee2a8]">
          {m.autoBadge as string}
        </span>
      </header>

      <div
        className="relative h-[136px] overflow-hidden px-3 pb-2.5 pt-3"
        style={{ background: "radial-gradient(120% 90% at 20% 0%, rgba(37,211,102,0.07), transparent 60%), #0b141a" }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-7" style={{ background: "linear-gradient(#0b141a, transparent)" }} />
        <div className="flex h-full flex-col justify-end gap-1.5">
          <AnimatePresence initial={false}>
            {lines.slice(0, shown).map((l, i) => (
              <motion.div
                key={`${cycle}-${i}`}
                layout
                initial={reduce ? false : { opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className={`flex ${l.s === "in" ? "justify-start" : "justify-end"}`}
              >
                <span
                  className={`max-w-[84%] px-2.5 py-1.5 text-[12px] leading-[1.35] text-white/95 ${
                    l.s === "in" ? "rounded-2xl rounded-tl-[5px]" : "rounded-2xl rounded-tr-[5px]"
                  }`}
                  style={{ background: l.s === "in" ? "#202c33" : "#005c4b" }}
                >
                  {l.t}
                </span>
              </motion.div>
            ))}
            {typing && (
              <motion.div
                key={`${cycle}-typing`}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${typing === "in" ? "justify-start" : "justify-end"}`}
              >
                <span
                  className="inline-flex items-center gap-1 rounded-2xl px-3 py-2"
                  style={{ background: typing === "in" ? "#202c33" : "#005c4b" }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-white/60"
                      style={{ animation: `aiTyping 1.2s ${i * 0.18}s ease-in-out infinite` }}
                    />
                  ))}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── the wire between them ── */}
      <div className="flex items-center gap-2 px-4 py-2.5">
        <span className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14))" }} />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF7A2D]/30 bg-[#FF7A2D]/10 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#ffb487]">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
          </svg>
          {m.sync as string}
        </span>
        <span className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.14), transparent)" }} />
      </div>

      {/* ── CRM funnel ── */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-[9.5px] font-semibold uppercase tracking-[0.11em] text-white/40">{m.crm as string}</span>
          <span className="ml-auto truncate rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 text-[10.5px] font-medium text-white/75 tabular-nums">
            {m.deal as string}
          </span>
        </div>

        <div className="mt-2.5 space-y-1.5">
          {stages.map((st, i) => {
            const reached = i <= stage;
            const last = i === stages.length - 1;
            const lit = reached && (!last || won);
            const here = i === stage;
            return (
              <div key={i} className="flex h-[26px] items-center gap-1.5">
                <div className="relative h-full min-w-0 flex-1">
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 rounded-lg border border-white/[0.07] bg-white/[0.03]"
                    style={{ width: `${FUNNEL_W[i] ?? 100}%` }}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 rounded-lg transition-opacity duration-500"
                    style={{
                      width: `${FUNNEL_W[i] ?? 100}%`,
                      // passed stages stay faintly warm; the deal's current stage burns bright
                      opacity: lit ? (here ? 1 : 0.4) : 0,
                      background: last
                        ? "linear-gradient(90deg, rgba(52,210,123,0.3), rgba(52,210,123,0.08))"
                        : "linear-gradient(90deg, rgba(255,122,45,0.32), rgba(255,122,45,0.06))",
                      boxShadow: last
                        ? "inset 0 0 0 1px rgba(52,210,123,0.45)"
                        : "inset 0 0 0 1px rgba(255,122,45,0.4)",
                    }}
                  />
                  <span
                    className="relative z-10 flex h-full items-center truncate pl-2.5 text-[11px] font-medium transition-colors duration-500"
                    style={{ color: here ? "#fff" : lit ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.4)" }}
                  >
                    {st.n}
                  </span>
                </div>
                <span className="w-7 flex-none text-right text-[10.5px] text-white/35 tabular-nums">{st.c}</span>
                <span className="grid h-[22px] w-[22px] flex-none place-items-center">
                  {i === stage && (
                    <motion.span
                      layoutId="automation-deal"
                      transition={{ type: "spring", stiffness: 260, damping: 26 }}
                      className="grid h-[22px] w-[22px] place-items-center rounded-full text-[10px] font-bold"
                      style={
                        won
                          ? { background: "rgba(52,210,123,0.2)", boxShadow: "inset 0 0 0 1.5px rgba(52,210,123,0.6)", color: "#9beabf" }
                          : { background: "rgba(255,122,45,0.18)", boxShadow: "inset 0 0 0 1.5px rgba(255,122,45,0.55)", color: "#ffb487" }
                      }
                    >
                      {won ? (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M5 12.5l4 4 10-10" stroke="#34d27b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        client.slice(0, 1)
                      )}
                    </motion.span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 h-[26px]">
          <AnimatePresence>
            {won && (
              <motion.span
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#34d27b]/25 bg-[#34d27b]/10 px-3 py-1.5 text-[11px] font-medium text-[#9beabf]"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M5 12.5l4 4 10-10" stroke="#34d27b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {m.done as string}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* Apple + Android glyphs — reused as big outline marks and small badge logos */
const APPLE_PATH =
  "M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z";
const PLAY_PATH =
  "M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.808 1.626L15.39 12l2.508-2.492zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z";

function StoreBadge({ kind, sub, name }: { kind: "apple" | "play"; sub: string; name: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-[#0b0b0e]/80 px-3 py-1.5 shadow-[0_14px_34px_-16px_rgba(0,0,0,0.85)] backdrop-blur-md">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden className="flex-none">
        <path d={kind === "apple" ? APPLE_PATH : PLAY_PATH} />
      </svg>
      <span className="text-left leading-none">
        <span className="block text-[7.5px] font-medium uppercase tracking-[0.08em] text-white/50">{sub}</span>
        <span className="mt-0.5 block text-[12px] font-semibold tracking-[-0.01em] text-white">{name}</span>
      </span>
    </div>
  );
}

function MobileMock({ m }: { m: Record<string, unknown> }) {
  return (
    <div className="relative px-4 py-5">
      <div className="relative mx-auto w-full max-w-[228px]">
        {/* titanium frame */}
        <div
          className="relative overflow-hidden rounded-[38px] p-[3px]"
          style={{
            background: "linear-gradient(150deg, #3a3a3d, #161617 35%, #161617 65%, #4a4a4d)",
            boxShadow: "0 40px 90px -30px rgba(0,0,0,0.8)",
          }}
        >
          <div className="relative aspect-[228/470] overflow-hidden rounded-[35px] bg-[#0a0a0b]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "radial-gradient(120% 80% at 50% 0%, #1c1408, #0d0a06 38%, #08080a)" }}
            />
            {/* status bar */}
            <div className="relative flex items-center justify-between px-5 pt-2.5 text-[10px] font-semibold text-white">
              <span>9:41</span>
              <span className="flex items-end gap-[3px]">
                {/* signal */}
                <span className="flex items-end gap-[1.5px]">
                  {[3, 5, 7, 9].map((h) => (
                    <span key={h} className="w-[2px] rounded-[1px] bg-white/85" style={{ height: h }} />
                  ))}
                </span>
                {/* wifi */}
                <svg width="11" height="9" viewBox="0 0 16 12" fill="none" aria-hidden className="mb-[0.5px]">
                  <path d="M1 3.6a11 11 0 0 1 14 0" stroke="#fff" strokeOpacity="0.85" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M3.6 6.4a7 7 0 0 1 8.8 0" stroke="#fff" strokeOpacity="0.85" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="8" cy="9.6" r="1.3" fill="#fff" fillOpacity="0.85" />
                </svg>
                {/* battery */}
                <span className="relative mb-[0.5px] h-[9px] w-[16px] rounded-[3px] border border-white/50">
                  <span className="absolute inset-[1.5px] right-[5px] rounded-[1.5px] bg-white/85" />
                  <span className="absolute -right-[3px] top-1/2 h-[3.5px] w-[1.5px] -translate-y-1/2 rounded-r-sm bg-white/40" />
                </span>
              </span>
            </div>
            <div className="absolute left-1/2 top-2 h-[20px] w-[68px] -translate-x-1/2 rounded-full bg-black" />
            {/* App Store product page */}
            <div className="relative mt-5 flex items-start gap-2.5 px-4">
              <AppIconMark size={54} />
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="truncate text-[13px] font-semibold leading-tight tracking-[-0.015em] text-white">
                  {m.appName as string}
                </p>
                <p className="mt-0.5 line-clamp-2 text-[9px] leading-[1.35] text-white/45">{m.cardSub as string}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="grid h-[22px] min-w-[64px] place-items-center rounded-full px-3 text-[10px] font-bold uppercase text-white"
                    style={{ background: "#0071E3" }}
                  >
                    {m.cta as string}
                  </span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="text-white/40" aria-hidden>
                    <path d="M12 15V3m0 0L8 7m4-4 4 4M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* ratings strip, App Store style */}
            <div className="relative mx-4 mt-4 grid grid-cols-3 divide-x divide-white/[0.08] border-y border-white/[0.08] py-2 text-center">
              <div className="px-1">
                <p className="text-[6.5px] uppercase tracking-[0.08em] text-white/35">{m.ratingsLabel as string}</p>
                <p className="mt-1 flex items-center justify-center gap-0.5 text-[11px] font-semibold leading-none tabular-nums text-white/85">
                  4,9<span className="text-[8px] text-[#ffb85c]">★</span>
                </p>
              </div>
              <div className="px-1">
                <p className="truncate text-[6.5px] uppercase tracking-[0.08em] text-white/35">{m.chartLabel as string}</p>
                <p className="mt-1 text-[11px] font-semibold leading-none text-white/85">№1</p>
              </div>
              <div className="px-1">
                <p className="text-[6.5px] uppercase tracking-[0.08em] text-white/35">{m.ageLabel as string}</p>
                <p className="mt-1 text-[11px] font-semibold leading-none text-white/85">4+</p>
              </div>
            </div>

            {/* screenshot strip — two real screens of the app */}
            <div className="relative mt-3.5 flex gap-2 overflow-hidden px-4">
              {/* 1 · orders feed */}
              <div
                className="h-[152px] flex-1 overflow-hidden rounded-[10px] border border-white/[0.08] p-2"
                style={{ background: "linear-gradient(170deg, rgba(255,122,45,0.18), rgba(10,10,12,0.94) 58%)" }}
              >
                <p className="text-[6px] font-semibold uppercase tracking-[0.1em] text-white/40">
                  {(m.shot1 as string) ?? ""}
                </p>
                <p className="mt-1 text-[10px] font-semibold leading-none tabular-nums text-white">128</p>
                <div className="mt-2 space-y-1">
                  {[0, 1, 2].map((k) => (
                    <span key={k} className="flex items-center gap-1.5 rounded-md bg-white/[0.07] px-1 py-[3px]">
                      <span
                        className="h-2.5 w-2.5 flex-none rounded-[3px]"
                        style={{ background: k === 0 ? AMBER : "rgba(255,255,255,0.2)" }}
                      />
                      <span className="h-[3px] flex-1 rounded-full bg-white/20" />
                      <span className="h-[3px] w-3 flex-none rounded-full bg-white/35" />
                    </span>
                  ))}
                </div>
                <span
                  className="mt-2 grid h-[15px] place-items-center rounded-full text-[6px] font-bold uppercase tracking-[0.04em] text-[#1a0d04]"
                  style={{ background: AMBER }}
                >
                  {(m.shot1Cta as string) ?? ""}
                </span>
              </div>

              {/* 2 · payment done */}
              <div className="h-[152px] flex-1 overflow-hidden rounded-[10px] border border-white/[0.08] bg-[#0d0d10] p-2">
                <p className="text-[6px] font-semibold uppercase tracking-[0.1em] text-white/40">
                  {(m.shot2 as string) ?? ""}
                </p>
                <div className="mt-3 grid place-items-center">
                  <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: "rgba(52,210,123,0.16)" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M5 13l4 4L19 7" stroke="#34d27b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="mt-1.5 text-[10px] font-semibold leading-none tabular-nums text-white">€148</p>
                  <p className="mt-1 text-[6px] leading-none text-white/40">{(m.shot2Sub as string) ?? ""}</p>
                </div>
                <span className="mt-3 grid h-[15px] place-items-center rounded-full border border-white/15 text-[6px] font-semibold text-white/70">
                  {(m.shot2Cta as string) ?? ""}
                </span>
              </div>
            </div>

            {/* tab bar */}
            <div className="absolute inset-x-0 bottom-0 border-t border-white/[0.08] bg-black/40 px-3 pb-4 pt-1.5 backdrop-blur-sm">
              <div className="flex items-center justify-around">
                {((m.tabs as string[]) ?? []).map((tab, i) => (
                  <span
                    key={tab}
                    className="text-[7px] font-medium"
                    style={{ color: i === 1 ? "#0a84ff" : "rgba(255,255,255,0.35)" }}
                  >
                    {tab}
                  </span>
                ))}
              </div>
              <div className="mt-1.5 flex justify-center">
                <span className="h-[4px] w-[88px] rounded-full bg-white/35" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Chip className="absolute right-0 top-3" style={{ borderColor: "rgba(255,122,45,0.3)" }}>
        <span style={{ color: AMBER }}>★</span>
        <span className="font-semibold text-white">{m.rating as string}</span>
      </Chip>

      {/* store badges */}
      <div className="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-2.5">
        <StoreBadge kind="apple" sub="Download on the" name="App Store" />
        <StoreBadge kind="play" sub="Get it on" name="Google Play" />
      </div>
    </div>
  );
}

function TelegramMock({ m }: { m: Record<string, unknown> }) {
  const buttons = (m.buttons as string[]) ?? [];
  return (
    <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#0e1621] backdrop-blur-xl shadow-[0_34px_80px_-34px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)]">
      {/* telegram header */}
      <header className="flex items-center gap-2.5 border-b border-white/[0.06] bg-[#17212b] px-4 py-3">
        <span className="grid h-8 w-8 place-items-center rounded-full" style={{ background: "linear-gradient(160deg,#2AABEE,#229ED9)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M21.9 4.3 18.7 19.5c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9 9-8.1c.4-.3-.1-.5-.6-.2L6.3 13.4l-4.8-1.5c-1-.3-1-1 .2-1.5l18.7-7.2c.9-.3 1.6.2 1.3 1.6Z"/></svg>
        </span>
        <div className="leading-tight">
          <p className="text-[12.5px] font-semibold text-white">{m.bot as string}</p>
          <p className="flex items-center gap-1 text-[10.5px] text-[#7CE2A6]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34d27b]" /> bot · online
          </p>
        </div>
      </header>
      <div className="space-y-2.5 px-3.5 py-4" style={{ background: "linear-gradient(180deg,#0e1621,#0b1219)" }}>
        {/* bot bubble */}
        <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-[#182531] px-3.5 py-2.5 text-[12.5px] leading-[1.4] text-white/90">
          {m.botMsg as string}
        </div>
        {/* inline buttons */}
        <div className="grid grid-cols-2 gap-2">
          {buttons.map((b, i) => (
            <span key={i} className="grid place-items-center rounded-lg bg-[#202b36] px-2 py-2 text-center text-[11px] font-medium text-[#5fc3f2]">
              {b}
            </span>
          ))}
        </div>
        {/* mini-app card */}
        <div className="mt-1 rounded-2xl border border-white/[0.08] bg-[#141d27] p-3">
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 rounded-xl" style={{ background: "linear-gradient(150deg,#FF7A2D,#E8590C)" }} />
            <div className="flex-1 leading-tight">
              <p className="text-[12px] font-semibold text-white">{m.appTitle as string}</p>
              <span className="mt-1 block h-1.5 w-16 rounded-full bg-white/20" />
            </div>
          </div>
          <div className="mt-3 grid h-8 place-items-center rounded-lg text-[12px] font-semibold text-white" style={{ background: "linear-gradient(160deg,#FF7A2D,#E8590C)" }}>
            {m.pay as string}
          </div>
        </div>
      </div>
    </div>
  );
}

type AdsPanel = {
  leads: string;
  delta: string;
  cpl: string;
  check: string;
  kpis: Metric[];
};

/* Ads glance — the only two questions a client actually asks: how many leads
   does this bring, and what does one cost. The waffle turns the lead count
   into something you can *see* (one square = one lead), and the pair of tiles
   underneath puts the €-per-lead next to the average order value. Tabs swap
   the whole picture between the Google and Meta accounts. */
const WAFFLE_COLS = 26;

function AdsMock({ m }: { m: Record<string, unknown> }) {
  const reduce = useReducedMotion();
  const tabs = (m.tabs as string[]) ?? ["Google Ads", "Meta Ads"];
  const panels = [m.google, m.meta].map((p) => (p ?? {}) as unknown as AdsPanel);

  const [tab, setTab] = useState(0);
  const data = panels[tab];
  const kpis = data.kpis ?? [];
  const leads = Number(String(data.leads ?? "").replace(/\D/g, "")) || 0;

  const isMeta = tab === 1;
  const accent = isMeta ? META_BLUE : AMBER;
  const numGrad = isMeta ? "linear-gradient(170deg,#fff,#8fc4ff)" : "linear-gradient(170deg,#fff,#ffb487)";

  return (
    <Glass label={m.dash as string} live>
      {/* the two ad accounts */}
      <div className="flex gap-2">
        {tabs.map((label, i) => {
          const active = i === tab;
          const meta = i === 1;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setTab(i)}
              aria-pressed={active}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition-colors"
              style={
                active
                  ? meta
                    ? { background: "rgba(10,132,255,0.16)", color: "#8fc4ff", border: "1px solid rgba(10,132,255,0.34)" }
                    : { background: "rgba(255,122,45,0.16)", color: "#ffb487", border: "1px solid rgba(255,122,45,0.3)" }
                  : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              {meta ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d={META_PATH} />
                </svg>
              ) : (
                <GoogleG />
              )}
              {label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.26, ease: "easeOut" }}
        >
          {/* how many leads landed */}
          <div className="mt-4 flex items-end gap-2.5">
            <p
              className="text-[42px] font-semibold leading-[0.9] tracking-[-0.035em] tabular-nums"
              style={{ background: numGrad, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
            >
              {data.leads}
            </p>
            <div className="pb-0.5">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/45">{m.leadsLabel as string}</p>
              <span className="mt-1 inline-flex items-center gap-0.5 rounded-full bg-[#34d27b]/12 px-1.5 py-[3px] text-[10px] font-semibold text-[#7fe3a6]">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 19V5M5 12l7-7 7 7" stroke="#34d27b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {data.delta}
              </span>
            </div>
          </div>

          {/* one square = one lead */}
          <div
            className="mt-3.5 grid gap-[3px]"
            style={{ gridTemplateColumns: `repeat(${WAFFLE_COLS}, minmax(0,1fr))` }}
            aria-hidden
          >
            {Array.from({ length: leads }).map((_, i) => (
              <span
                key={i}
                className="aspect-square rounded-[2.5px]"
                style={
                  {
                    background: accent,
                    // the pile warms up as it fills, so the block reads as motion
                    "--dot-o": 0.26 + (0.46 * i) / Math.max(leads - 1, 1),
                    opacity: "var(--dot-o)",
                    animation: reduce ? undefined : `adsLeadIn 0.45s ${Math.min(i * 7, 900)}ms both`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          <p className="mt-2 text-[10px] text-white/45">{m.waffleNote as string}</p>

          {/* what one lead costs vs what one order is worth */}
          <div className="mt-3.5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5">
              <p className="text-[19px] font-semibold leading-none tracking-[-0.02em] text-white tabular-nums">{data.cpl}</p>
              <p className="mt-1.5 text-[9.5px] font-medium uppercase leading-tight tracking-[0.08em] text-white/45">
                {m.cplLabel as string}
              </p>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/30" aria-hidden>
              <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="rounded-xl border border-[#34d27b]/25 bg-[#34d27b]/[0.08] px-3 py-2.5">
              <p className="text-[19px] font-semibold leading-none tracking-[-0.02em] text-[#9beabf] tabular-nums">{data.check}</p>
              <p className="mt-1.5 text-[9.5px] font-medium uppercase leading-tight tracking-[0.08em] text-[#7fe3a6]/70">
                {m.checkLabel as string}
              </p>
            </div>
          </div>

          {/* the month in three numbers */}
          <div className="mt-3.5 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-3">
            {kpis.map((k, i) => (
              <div key={i}>
                <p className="text-[15px] font-semibold tracking-[-0.02em] text-white tabular-nums">{k.v}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-white/45">{k.l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </Glass>
  );
}

const MOCKS: Record<Branch, (p: { m: Record<string, unknown> }) => ReactNode> = {
  websites: WebsitesMock,
  store: StoreMock,
  ai: AiMock,
  automation: AutomationMock,
  mobile: MobileMock,
  telegram: TelegramMock,
  ads: AdsMock,
};

export function ServiceHero({ branch, reviewCount }: { branch: Branch; reviewCount: number }) {
  const t = useTranslations(`services.${branch}`);
  const tr = useTranslations("home.testimonials");
  const messages = useMessages() as unknown as HeroShape;
  const svc = messages.services[branch];
  const metrics = svc.hero.metrics ?? [];
  const mock = svc.hero.mock ?? {};
  const headlineLines = t("headline").split("\n");
  // Websites lean into a fuller logo wall (HTML/CSS/CMS/…); the rest stay compact.
  const stack = svc.stack.items.slice(0, branch === "websites" ? 12 : 6);
  const Mock = MOCKS[branch];
  const reduce = useReducedMotion();

  // Window-chrome label — the most "live" string from each branch's glance.
  const branchLabel =
    ((
      {
        websites: mock.url,
        store: mock.url,
        ai: mock.agent,
        automation: mock.flow,
        mobile: mock.appName,
        telegram: mock.bot,
        ads: mock.dash,
      } as Record<Branch, unknown>
    )[branch] as string) || "buildbyalex.com";

  return (
    <Section pad="tight" tone="default" className="!pt-10 md:!pt-14">
      <Container size="default">
        <HeroWindow theme={branch === "websites" || branch === "store" ? "web" : branch} accent={AMBER} label={branchLabel} live={svc.hero.badge}>
          <div className="relative z-10 grid items-center gap-10 md:grid-cols-12 md:gap-10 lg:gap-14">
            {/* ── copy ── */}
            <div className="min-w-0 md:col-span-6">
              <p
                className="text-[12px] font-semibold uppercase tracking-[0.16em]"
                style={{ color: AMBER, fontFamily: "var(--font-mono), monospace" }}
              >
                {t("eyebrow")}
              </p>
              <h1 className="mt-4 text-[clamp(34px,4.4vw+10px,60px)] font-semibold leading-[1.05] tracking-[-0.032em] text-white">
                {headlineLines.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h1>
              <p className="mt-5 max-w-[480px] text-[clamp(15px,0.7vw+13px,18px)] leading-[1.55] tracking-[-0.012em] text-white/65">
                {t("lead")}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Button href="/contact" size="lg">{t("primaryCta")}</Button>
                <span className="text-[14.5px] text-white/55">{t("from")}</span>
              </div>

              <Link
                href={{ pathname: "/", hash: "reviews" }}
                aria-label={`${tr("rating")} · ${reviewCount} ${tr("count")}`}
                className="group mt-6 inline-flex items-center gap-2.5 transition-opacity hover:opacity-90"
              >
                <Stars />
                <span className="text-[13px] text-white/55 underline decoration-white/20 decoration-from-font underline-offset-[3px] transition-colors group-hover:text-white/80 group-hover:decoration-white/40">
                  <span className="font-semibold text-white">{tr("rating")}</span> · {reviewCount} {tr("count")}
                </span>
              </Link>

              {/* metrics */}
              <div className="mt-8 grid max-w-[480px] grid-cols-3 gap-3 border-t border-white/[0.08] pt-6">
                {metrics.map((mt, i) => (
                  <div key={i} className="min-w-0">
                    <p
                      className="text-[clamp(20px,1.6vw+12px,26px)] font-semibold leading-none tracking-[-0.03em]"
                      style={{
                        background: "linear-gradient(165deg,#fff,#ffb487)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {mt.v}
                    </p>
                    <p className="mt-1.5 break-words text-[10.5px] font-medium uppercase leading-tight tracking-[0.06em] text-white/45">
                      {mt.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── glance ── */}
            <div className="min-w-0 md:col-span-6">
              <motion.div
                className="relative mx-auto w-full max-w-[420px]"
                animate={reduce ? undefined : { y: [0, -9, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* ambient screen glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-8 -z-10"
                  style={{
                    background: "radial-gradient(ellipse 60% 50% at 55% 45%, rgba(255,122,45,0.22), transparent 70%)",
                    filter: "blur(30px)",
                  }}
                />
                <Mock m={mock} />
              </motion.div>
            </div>
          </div>

          {/* stack strip */}
          <div className="relative z-10 mt-10 flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-6">
            {stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-white/55"
              >
                {tech}
              </span>
            ))}
          </div>
        </HeroWindow>
      </Container>
    </Section>
  );
}

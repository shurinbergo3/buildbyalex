"use client";

import { useState, type ReactNode } from "react";
import { useMessages, useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ProductGlyph } from "./storeGlyphs";

/* Online-store service demo. A real, *interactive* clothing storefront, hand-built
   and rendered live inside a desktop browser chrome, with an overlapping phone
   running the same shop in its mobile layout. Fill the basket from the catalogue,
   open the cart drawer, pick courier delivery and place the order — every stage
   flips in place. The phone is a decorative, state-synced preview. All copy comes
   from services.store.demo (.site for chrome, .shop for the storefront). */

const AMBER = "#FF7A2D";

const PHONE_W = 390;
const PHONE_H = 844;
const PHONE_RENDER_W = 142;

type Product = { n: string; p: string; c: string };
type Shop = {
  brand: string;
  nav: string[];
  heroEyebrow: string;
  heroTitle: string;
  heroCta: string;
  search: string;
  products: Product[];
  add: string;
  cartTitle: string;
  empty: string;
  emptyHint: string;
  subtotal: string;
  checkout: string;
  deliveryTitle: string;
  back: string;
  courier: string;
  eta: string;
  free: string;
  addressLabel: string;
  address: string;
  total: string;
  pay: string;
  done: string;
  doneSub: string;
  orderId: string;
  continue: string;
};
type DemoShape = {
  services: { store: { demo: { shop: Shop; site: { url: string; langs: string }; serp: string; score: string } } };
};

/* per-product thumbnail tints — muted boutique palette over the dark canvas */
const THUMBS = [
  "radial-gradient(130% 120% at 28% 8%, #3a2c1a, #19120a 72%)",
  "radial-gradient(130% 120% at 28% 8%, #1f2a39, #0f151d 72%)",
  "radial-gradient(130% 120% at 28% 8%, #33222b, #170f13 72%)",
  "radial-gradient(130% 120% at 28% 8%, #203029, #101713 72%)",
  "radial-gradient(130% 120% at 28% 8%, #2c2740, #14111f 72%)",
  "radial-gradient(130% 120% at 28% 8%, #382323, #181010 72%)",
];

const priceOf = (s: string) => Number(String(s).replace(/[^\d]/g, "")) || 0;

/* ── tiny inline icons ── */
const CartIcon = ({ s = 15 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="9" cy="20" r="1.3" />
    <circle cx="18" cy="20" r="1.3" />
    <path d="M2.5 3.5h2.3L7 15.4a1.4 1.4 0 0 0 1.4 1.1h8.5a1.4 1.4 0 0 0 1.4-1.1L20.8 7H5.4" />
  </svg>
);
const SearchIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
const PlusIcon = ({ s = 13 }: { s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

function Chip({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0c0c0f]/90 px-3 py-1.5 text-[12px] font-medium text-white/85 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)] backdrop-blur-md ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
function GoogleG() {
  return (
    <svg width="13" height="13" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.3C29.2 35 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.6l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.5l6.2 5.3C39.7 35.4 44 30.2 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}

/* ─────────────── decorative phone storefront (state-synced) ─────────────── */
function PhoneStore({ shop, count, total }: { shop: Shop; count: number; total: number }) {
  const featured = shop.products.slice(0, 3);
  return (
    <div className="flex h-full flex-col bg-[#0a0a0b] text-white" style={{ width: PHONE_W, height: PHONE_H }}>
      {/* status bar */}
      <div className="flex items-center justify-between px-6 pt-4 text-[15px] font-semibold">
        <span>9:41</span>
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
        </span>
      </div>
      {/* header */}
      <div className="flex items-center justify-between px-6 pt-5">
        <span className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl text-[17px] font-bold text-[#0a0a0a]" style={{ background: AMBER }}>
            {shop.brand.slice(0, 1)}
          </span>
          <span className="text-[22px] font-semibold tracking-[-0.02em]">{shop.brand}</span>
        </span>
        <span className="relative grid h-11 w-11 place-items-center rounded-full border border-white/12 text-white/80">
          <CartIcon s={20} />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[12px] font-bold text-[#0a0a0a]" style={{ background: AMBER }}>
              {count}
            </span>
          )}
        </span>
      </div>
      {/* hero banner */}
      <div className="mx-6 mt-5 overflow-hidden rounded-3xl p-6" style={{ background: "linear-gradient(150deg,#FF7A2D,#b5430b)" }}>
        <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/80">{shop.heroEyebrow}</p>
        <p className="mt-2 text-[30px] font-semibold leading-[1.05] tracking-[-0.02em] text-white">{shop.heroTitle}</p>
      </div>
      {/* product list */}
      <div className="mt-5 flex-1 space-y-4 px-6">
        {featured.map((pr, i) => (
          <div key={i} className="flex items-center gap-4 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-3.5">
            <span className="grid h-[78px] w-[78px] flex-none place-items-center rounded-2xl" style={{ background: THUMBS[i % THUMBS.length] }}>
              <ProductGlyph i={i} className="h-[58%] w-[58%]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] uppercase tracking-[0.08em] text-white/45">{pr.c}</span>
              <span className="mt-1 block truncate text-[19px] font-semibold tracking-[-0.01em]">{pr.n}</span>
              <span className="mt-1 block text-[19px] font-semibold" style={{ color: "#ffb487" }}>{pr.p}</span>
            </span>
            <span className="grid h-12 w-12 flex-none place-items-center rounded-full text-[#0a0a0a]" style={{ background: AMBER }}>
              <PlusIcon s={22} />
            </span>
          </div>
        ))}
      </div>
      {/* sticky cart bar */}
      <div className="px-6 pb-10 pt-4">
        <div className="flex items-center justify-between rounded-full px-7 py-5 text-white" style={{ background: count > 0 ? "linear-gradient(160deg,#FF7A2D,#E8590C)" : "rgba(255,255,255,0.06)" }}>
          <span className="text-[19px] font-semibold">{shop.checkout}</span>
          <span className="text-[19px] font-semibold tabular-nums">€{total}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── main showcase ─────────────────────────── */
export function StoreSiteMock() {
  const t = useTranslations("services.store.demo");
  const reduce = useReducedMotion();
  const demo = (useMessages() as unknown as DemoShape).services.store.demo;
  const shop = demo.shop;
  const products = shop.products ?? [];

  const [qty, setQty] = useState<number[]>(() => products.map(() => 0));
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<"cart" | "delivery" | "done">("cart");

  const count = qty.reduce((a, b) => a + b, 0);
  const total = qty.reduce((sum, q, i) => sum + q * priceOf(products[i]?.p ?? ""), 0);
  const setQ = (i: number, d: number) => setQty((q) => q.map((v, j) => (j === i ? Math.max(0, v + d) : v)));
  const add = (i: number) => {
    setQ(i, 1);
    setStage("cart");
    setOpen(true);
  };
  const reset = () => {
    setQty(products.map(() => 0));
    setStage("cart");
    setOpen(false);
  };

  const phoneScale = PHONE_RENDER_W / PHONE_W;
  const drawerAnim = reduce
    ? {}
    : { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: { type: "spring" as const, stiffness: 320, damping: 36 } };
  const stageAnim = reduce
    ? {}
    : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.22, ease: "easeOut" as const } };

  return (
    <div className="relative mx-auto w-full max-w-[940px] pb-12 sm:pb-0">
      {/* Desktop browser */}
      <div className="overflow-hidden rounded-2xl border border-[color:var(--c-hairline)] bg-[color:var(--color-bg-elev)] shadow-[0_30px_80px_-28px_rgba(10,10,10,0.5)]">
        {/* Chrome */}
        <div className="flex items-center gap-3 border-b border-[color:var(--c-hairline)] bg-[color:var(--color-bg-alt)] px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="mx-auto flex max-w-[360px] flex-1 items-center gap-2 rounded-full bg-[color:var(--color-bg-elev)] px-3 py-1 text-[12px] text-[color:var(--color-text-3)]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 1 1 6 0v3H9z" fill="currentColor" />
            </svg>
            <span className="truncate">{t("site.url")}</span>
          </div>
          <span className="hidden rounded-full border border-[color:var(--c-hairline)] px-2 py-0.5 text-[10.5px] font-medium tabular-nums text-[color:var(--color-text-3)] sm:inline">
            {t("site.langs")}
          </span>
        </div>

        {/* Live storefront — dark canvas, real interactive DOM */}
        <div className="relative overflow-hidden bg-[#0a0a0b] text-white">
          {/* top nav */}
          <header className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-4 py-3 sm:px-6">
            <span className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded-lg text-[13px] font-bold text-[#0a0a0a]" style={{ background: AMBER }}>
                {shop.brand.slice(0, 1)}
              </span>
              <span className="text-[15px] font-semibold tracking-[-0.01em]">{shop.brand}</span>
              <nav className="ml-3 hidden items-center gap-4 text-[12.5px] text-white/55 md:flex">
                {shop.nav.map((n) => (
                  <span key={n} className="cursor-default transition-colors hover:text-white/85">{n}</span>
                ))}
              </nav>
            </span>
            <span className="flex items-center gap-2">
              <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] text-white/40 lg:flex">
                <SearchIcon />
                {shop.search}
              </span>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={shop.cartTitle}
                className="relative grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-white/12 text-white/80 transition-colors hover:bg-white/[0.06]"
              >
                <CartIcon />
                {count > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full px-1 text-[9.5px] font-bold text-[#0a0a0a]" style={{ background: AMBER }}>
                    {count}
                  </span>
                )}
              </button>
            </span>
          </header>

          {/* hero banner */}
          <div className="relative m-4 overflow-hidden rounded-2xl p-5 sm:m-6 sm:p-7" style={{ background: "linear-gradient(135deg,#1a1208 0%,#0d0a06 55%), radial-gradient(120% 140% at 88% 0%, rgba(255,122,45,0.5), transparent 60%)" }}>
            <div className="relative">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#ffb487" }}>{shop.heroEyebrow}</p>
              <p className="mt-2 max-w-[60%] text-[clamp(22px,3.6vw,34px)] font-semibold leading-[1.04] tracking-[-0.02em]">{shop.heroTitle}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12.5px] font-semibold text-white" style={{ background: "linear-gradient(160deg,#FF7A2D,#E8590C)" }}>
                {shop.heroCta}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </div>

          {/* product grid */}
          <div className="grid grid-cols-2 gap-3 px-4 pb-5 sm:grid-cols-3 sm:px-6 sm:pb-7">
            {products.map((pr, i) => (
              <div key={i} className="group overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] transition-colors hover:border-white/[0.14]">
                <div className="relative grid aspect-[4/3] place-items-center" style={{ background: THUMBS[i % THUMBS.length] }}>
                  <span aria-hidden className="absolute inset-0" style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }} />
                  <ProductGlyph i={i} className="h-[46%] w-[46%] transition-transform duration-300 group-hover:scale-[1.06]" />
                  {qty[i] > 0 && (
                    <span className="absolute left-2 top-2 grid h-5 min-w-[20px] place-items-center rounded-full px-1 text-[10.5px] font-bold text-[#0a0a0a]" style={{ background: AMBER }}>
                      {qty[i]}
                    </span>
                  )}
                </div>
                <div className="flex items-end justify-between gap-2 p-2.5 sm:p-3">
                  <span className="min-w-0">
                    <span className="block truncate text-[9.5px] uppercase tracking-[0.07em] text-white/40">{pr.c}</span>
                    <span className="mt-0.5 block truncate text-[12px] font-medium text-white/90">{pr.n}</span>
                    <span className="mt-0.5 block text-[12.5px] font-semibold" style={{ color: "#ffb487" }}>{pr.p}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => add(i)}
                    aria-label={`${shop.add} — ${pr.n}`}
                    className="grid h-7 w-7 flex-none cursor-pointer place-items-center rounded-full text-[#0a0a0a] transition-transform duration-150 active:scale-90"
                    style={{ background: AMBER }}
                  >
                    <PlusIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* cart drawer */}
          <AnimatePresence>
            {open && (
              <>
                <motion.button
                  type="button"
                  aria-label="close"
                  onClick={() => setOpen(false)}
                  className="absolute inset-0 z-10 cursor-default bg-black/55 backdrop-blur-[2px]"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                />
                <motion.aside
                  className="absolute inset-y-0 right-0 z-20 flex w-[min(340px,86%)] flex-col border-l border-white/10 bg-[#0e0e11]"
                  {...drawerAnim}
                >
                  {/* drawer header */}
                  <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3.5">
                    <span className="flex items-center gap-2 text-[14px] font-semibold">
                      {stage === "delivery" ? (
                        <button type="button" onClick={() => setStage("cart")} aria-label={shop.back} className="grid h-6 w-6 cursor-pointer place-items-center rounded-full border border-white/10 text-white/60 transition-colors hover:text-white">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M14 6l-6 6 6 6" /></svg>
                        </button>
                      ) : (
                        <CartIcon />
                      )}
                      {stage === "delivery" ? shop.deliveryTitle : stage === "done" ? shop.done : shop.cartTitle}
                    </span>
                    <button type="button" onClick={() => setOpen(false)} aria-label="×" className="grid h-6 w-6 cursor-pointer place-items-center rounded-full text-white/45 transition-colors hover:text-white">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
                    </button>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                      {/* CART */}
                      {stage === "cart" && (
                        <motion.div key="cart" {...stageAnim} className="flex h-full flex-col">
                          {count === 0 ? (
                            <div className="grid flex-1 place-items-center px-6 text-center">
                              <span>
                                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/10 text-white/40"><CartIcon s={20} /></span>
                                <p className="mt-3 text-[13px] font-medium text-white/80">{shop.empty}</p>
                                <p className="mt-1 text-[11.5px] text-white/45">{shop.emptyHint}</p>
                              </span>
                            </div>
                          ) : (
                            <div className="flex-1 space-y-2.5 overflow-y-auto px-4 py-4">
                              {products.map((pr, i) =>
                                qty[i] > 0 ? (
                                  <div key={i} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5">
                                    <span className="grid h-12 w-12 flex-none place-items-center rounded-lg" style={{ background: THUMBS[i % THUMBS.length] }}>
                                      <ProductGlyph i={i} className="h-[56%] w-[56%]" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                      <span className="block truncate text-[12px] font-medium text-white/90">{pr.n}</span>
                                      <span className="block text-[11.5px] font-semibold" style={{ color: "#ffb487" }}>{pr.p}</span>
                                    </span>
                                    <span className="flex flex-none items-center gap-1.5">
                                      <button type="button" onClick={() => setQ(i, -1)} aria-label="−" className="grid h-6 w-6 cursor-pointer place-items-center rounded-full border border-white/12 text-white/70 transition-colors hover:bg-white/[0.06]">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden><path d="M5 12h14" /></svg>
                                      </button>
                                      <span className="w-4 text-center text-[12px] font-semibold tabular-nums">{qty[i]}</span>
                                      <button type="button" onClick={() => setQ(i, 1)} aria-label="+" className="grid h-6 w-6 cursor-pointer place-items-center rounded-full text-[#0a0a0a]" style={{ background: AMBER }}>
                                        <PlusIcon s={11} />
                                      </button>
                                    </span>
                                  </div>
                                ) : null,
                              )}
                            </div>
                          )}
                          {count > 0 && (
                            <div className="border-t border-white/[0.07] px-4 py-3.5">
                              <div className="flex items-center justify-between text-[12.5px]">
                                <span className="text-white/55">{shop.subtotal}</span>
                                <span className="font-semibold tabular-nums">€{total}</span>
                              </div>
                              <button type="button" onClick={() => setStage("delivery")} className="mt-3 grid w-full cursor-pointer place-items-center rounded-xl py-2.5 text-[12.5px] font-semibold text-white transition-transform duration-150 active:scale-[0.99]" style={{ background: "linear-gradient(160deg,#FF7A2D,#E8590C)" }}>
                                {shop.checkout}
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* DELIVERY */}
                      {stage === "delivery" && (
                        <motion.div key="delivery" {...stageAnim} className="flex h-full flex-col px-4 py-4">
                          <div className="flex items-center gap-2.5 rounded-xl border border-[#FF7A2D]/35 bg-[#FF7A2D]/[0.08] p-2.5">
                            <span className="grid h-8 w-8 flex-none place-items-center rounded-lg text-[#ffb487]" style={{ background: "rgba(255,122,45,0.16)" }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                <path d="M2.5 6.5h11v9h-11z" /><path d="M13.5 9.5H17l3.5 3.5v2.5h-7z" /><circle cx="6.5" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" />
                              </svg>
                            </span>
                            <span className="min-w-0 flex-1 leading-tight">
                              <span className="block truncate text-[11.5px] font-medium text-white">{shop.courier}</span>
                              <span className="block text-[10.5px] text-white/55">{shop.eta}</span>
                            </span>
                            <span className="flex-none text-[11px] font-semibold text-[#7fe3a6]">{shop.free}</span>
                          </div>
                          <div className="mt-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5">
                            <span className="block text-[9px] font-medium uppercase tracking-[0.1em] text-white/40">{shop.addressLabel}</span>
                            <span className="mt-1 block text-[11.5px] text-white/80">{shop.address}</span>
                          </div>
                          <div className="mt-auto">
                            <div className="flex items-center justify-between border-t border-white/[0.07] pt-3">
                              <span className="text-[11.5px] text-white/55">{shop.total}</span>
                              <span className="text-[16px] font-semibold tracking-[-0.02em] tabular-nums">€{total}</span>
                            </div>
                            <button type="button" onClick={() => setStage("done")} className="mt-3 grid w-full cursor-pointer place-items-center rounded-xl py-2.5 text-[12.5px] font-semibold text-white transition-transform duration-150 active:scale-[0.99]" style={{ background: "linear-gradient(160deg,#FF7A2D,#E8590C)" }}>
                              {shop.pay} · €{total}
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* DONE */}
                      {stage === "done" && (
                        <motion.div key="done" {...stageAnim} className="grid h-full place-items-center px-6 text-center">
                          <span>
                            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full" style={{ background: "rgba(52,210,123,0.14)", border: "1px solid rgba(52,210,123,0.4)" }}>
                              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <motion.path d="M5 12.5l4 4 10-10" stroke="#34d27b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} />
                              </svg>
                            </span>
                            <p className="mt-4 text-[15px] font-semibold">{shop.done}</p>
                            <p className="mt-1 text-[12px] text-white/55">{shop.doneSub}</p>
                            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11.5px] text-white/70 tabular-nums">
                              {shop.orderId} · €{total}
                            </span>
                            <button type="button" onClick={reset} className="mt-5 block w-full cursor-pointer rounded-xl border border-white/12 py-2.5 text-[12.5px] font-medium text-white/85 transition-colors hover:bg-white/[0.05]">
                              {shop.continue}
                            </button>
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* floating proof chips */}
      <Chip className="absolute -left-2 top-16 z-30 hidden md:inline-flex" style={{ borderColor: "rgba(255,122,45,0.3)" }}>
        <GoogleG />
        <span className="font-semibold text-white">{t("serp")}</span>
      </Chip>
      <Chip className="absolute -left-3 top-32 z-30 hidden !px-3.5 !py-2 lg:inline-flex">
        <span className="grid h-7 w-7 place-items-center rounded-full text-[12px] font-bold text-[#0a0a0a]" style={{ background: "conic-gradient(#34d27b 0 100%, #1d1d20 0)", boxShadow: "inset 0 0 0 3px #0c0c0f" }}>
          <span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-[#0c0c0f] text-white">100</span>
        </span>
        <span className="text-[11px] leading-tight text-white/75">{t("score")}</span>
      </Chip>

      {/* Overlapping phone — same shop, mobile layout (decorative, state-synced) */}
      <motion.div
        aria-hidden="true"
        className="absolute -bottom-10 right-4 z-30 hidden sm:block md:right-12"
        style={{ width: PHONE_RENDER_W }}
        initial={false}
        animate={reduce ? undefined : { y: [0, -9, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="overflow-hidden rounded-[24px] border border-black/10 bg-[#0A0A0A] p-1.5 shadow-[0_24px_50px_-18px_rgba(10,10,10,0.6)]">
          <div className="relative overflow-hidden rounded-[18px] bg-[#0A0A0A]" style={{ height: PHONE_H * phoneScale }}>
            <div className="origin-top-left" style={{ width: PHONE_W, height: PHONE_H, transform: `scale(${phoneScale})` }}>
              <PhoneStore shop={shop} count={count} total={total} />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

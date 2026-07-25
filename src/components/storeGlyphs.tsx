import type { ReactNode } from "react";

/* Per-product line-art silhouettes shared by the online-store hero (ServiceHero →
   StoreMock) and the live storefront demo (StoreSiteMock). Drawn inline so both
   mocks stay request-free and keep their 100/100 Lighthouse score. Index order:
   0 puffer · 1 sneaker · 2 hoodie · 3 jeans · 4 backpack · 5 cap. */
export const GLYPHS: ReactNode[] = [
  /* puffer jacket */
  <>
    <path d="M24 13 15 19 12 32 19 34 19 52 45 52 45 34 52 32 49 19 40 13 35 18 29 18Z" />
    <path d="M32 18V52M19 40h26M19 46h26" />
  </>,
  /* runner sneaker */
  <>
    <path d="M11 44H55c2 0 3 2 2 4-1 2-3 2-5 2H14c-3 0-5-1-5-3 0-2 1-3 1-3Z" />
    <path d="M13 44V31c0-2 2-3 4-2 2 1 2 4 5 5 6 3 16 4 25 6 5 1 8 3 8 4" />
    <path d="M24 35l4-3M28 38l4-3M33 40l4-3" />
  </>,
  /* oversize hoodie */
  <>
    <path d="M25 16 15 21 12 34 18 37 18 52 46 52 46 37 52 34 49 21 39 16" />
    <path d="M25 16c0-7 14-7 14 0" />
    <path d="M27 17c2 6 8 6 10 0" />
    <path d="M23 41h18M23 41v7M41 41v7M30 20v11M34 20v11" />
  </>,
  /* slim jeans */
  <>
    <path d="M20 14h24l1 38H35L32 27 29 52H19Z" />
    <path d="M20 19h24M32 19v8M22 20c2 4 6 4 7 0M35 20c1 4 5 4 7 0" />
  </>,
  /* city backpack */
  <>
    <path d="M21 26c0-8 4-12 11-12s11 4 11 12v24c0 2-1 3-3 3H24c-2 0-3-1-3-3Z" />
    <path d="M27 16c0-6 10-6 10 0" />
    <path d="M24 40c0-7 16-7 16 0v10c0 1-1 1-2 1H26c-1 0-2 0-2-1Z" />
    <path d="M26 30c0-3 12-3 12 0" />
  </>,
  /* logo cap */
  <>
    <path d="M15 39c0-15 15-20 26-14 5 3 7 8 7 14" />
    <path d="M15 39h33" />
    <path d="M48 39c9-1 13 2 13 5 0 1-2 1-8 0l-5-3" />
    <path d="M30 21c-3 7-5 13-6 18M37 23c0 7 0 12 0 16" />
  </>,
];

export function ProductGlyph({ i, className = "" }: { i: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      style={{ color: "rgba(244,214,182,0.6)" }}
    >
      {GLYPHS[((i % GLYPHS.length) + GLYPHS.length) % GLYPHS.length]}
    </svg>
  );
}

/* Real studio product cutouts (transparent WebP) that replace the line glyphs
   inside the store mocks. Same index order as GLYPHS so callers keep passing the
   same `i`: 0 puffer · 1 sneaker · 2 hoodie · 3 jeans · 4 backpack · 5 cap. */
export const PRODUCT_SHOTS = [
  "/services/store/puffer.webp",
  "/services/store/sneaker.webp",
  "/services/store/hoodie.webp",
  "/services/store/jeans.webp",
  "/services/store/backpack.webp",
  "/services/store/cap.webp",
];

export function ProductShot({ i, className = "" }: { i: number; className?: string }) {
  const src = PRODUCT_SHOTS[((i % PRODUCT_SHOTS.length) + PRODUCT_SHOTS.length) % PRODUCT_SHOTS.length];
  return (
    <span
      aria-hidden
      className={className}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.55))",
      }}
    />
  );
}

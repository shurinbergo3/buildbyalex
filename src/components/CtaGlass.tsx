/**
 * Decorative layers for the frosted-glass CTA surface.
 *
 * Drop <CtaGlassLayers /> as the first child of any element that carries the
 * `cta-glass` class, then wrap the real content in a `relative z-10` div.
 * Pure presentational markup — safe in both server and client components.
 */
export function CtaGlassLayers() {
  return (
    <>
      <div className="cta-glass__aurora" aria-hidden="true" />
      <div className="cta-glass__frost" aria-hidden="true" />
      <div className="cta-glass__grid" aria-hidden="true" />
      <div className="cta-glass__edge" aria-hidden="true" />
    </>
  );
}

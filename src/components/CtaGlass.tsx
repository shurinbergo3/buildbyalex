import Image from "next/image";

/**
 * Decorative layers for the frosted-glass CTA surface.
 *
 * Drop <CtaGlassLayers /> as the first child of any element that carries the
 * `cta-glass` class, then wrap the real content in a `relative z-10` div.
 * Pure presentational markup — safe in both server and client components.
 *
 * Pass `photo` to put a cinematic key-art shot under the glass; add the
 * `cta-glass--photo` modifier on the surface so the frost thins out and the
 * image reads through it.
 */
export function CtaGlassLayers({ photo }: { photo?: string }) {
  return (
    <>
      {photo && (
        <div className="cta-glass__photo" aria-hidden="true">
          <Image
            src={photo}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 912px"
            className="object-cover"
          />
        </div>
      )}
      <div className="cta-glass__aurora" aria-hidden="true" />
      <div className="cta-glass__frost" aria-hidden="true" />
      <div className="cta-glass__grid" aria-hidden="true" />
      <div className="cta-glass__edge" aria-hidden="true" />
    </>
  );
}

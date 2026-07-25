/**
 * Cinematic key-art backgrounds for the frosted-glass CTA at the foot of a post.
 * One image per article, picked deterministically from the seed so the choice is
 * stable between SSR and client and identical across the 4 language versions
 * (seed with the cluster id, not the localized slug).
 */
const CTA_BACKGROUNDS = [
  "/cta/cta-01.webp",
  "/cta/cta-02.webp",
  "/cta/cta-03.webp",
  "/cta/cta-04.webp",
  "/cta/cta-05.webp",
  "/cta/cta-06.webp",
  "/cta/cta-07.webp",
  "/cta/cta-08.webp",
  "/cta/cta-09.webp",
  "/cta/cta-10.webp",
] as const;

export function ctaBackground(seed: string): string {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return CTA_BACKGROUNDS[Math.abs(hash) % CTA_BACKGROUNDS.length];
}

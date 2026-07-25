/* Aurora atmosphere — the site's ambient signature for otherwise-empty text
   sections. Soft blurred warm blobs + one cool counter-glow for depth + a
   whisper of grain, all keyed off the accent token so it lives in both themes.
   Sits at -z-10 inside an isolated section: above the section fill, below the
   content. Kept deliberately faint so it reads as light, never as clutter.
   Blobs bleed past the top/bottom edges, which is what softens the seam between
   two stacked sections. */

type Blob = { x: string; y: string; size: string; color: string; blur: number; opacity: number };

const WARM_STRONG = "color-mix(in srgb, var(--c-accent) 32%, transparent)";
const WARM_SOFT = "color-mix(in srgb, var(--c-accent) 22%, transparent)";
const COOL = "rgba(70, 118, 255, 0.14)";

const PRESETS: Record<string, Blob[]> = {
  a: [
    { x: "-6%", y: "-24%", size: "clamp(300px, 40vw, 560px)", color: WARM_STRONG, blur: 64, opacity: 0.9 },
    { x: "70%", y: "60%", size: "clamp(260px, 34vw, 480px)", color: WARM_SOFT, blur: 78, opacity: 0.72 },
    { x: "82%", y: "-16%", size: "clamp(220px, 28vw, 400px)", color: COOL, blur: 70, opacity: 0.85 },
  ],
  b: [
    { x: "64%", y: "-26%", size: "clamp(300px, 40vw, 560px)", color: WARM_STRONG, blur: 64, opacity: 0.85 },
    { x: "-12%", y: "54%", size: "clamp(260px, 34vw, 480px)", color: WARM_SOFT, blur: 78, opacity: 0.72 },
    { x: "8%", y: "-14%", size: "clamp(220px, 28vw, 380px)", color: COOL, blur: 70, opacity: 0.8 },
  ],
  c: [
    { x: "50%", y: "-32%", size: "clamp(340px, 46vw, 680px)", color: WARM_SOFT, blur: 84, opacity: 0.78 },
    { x: "12%", y: "62%", size: "clamp(220px, 28vw, 400px)", color: WARM_STRONG, blur: 78, opacity: 0.6 },
    { x: "86%", y: "46%", size: "clamp(200px, 26vw, 360px)", color: COOL, blur: 70, opacity: 0.75 },
  ],
};

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function SectionAtmosphere({
  variant = "a",
  className = "",
}: {
  variant?: "a" | "b" | "c";
  className?: string;
}) {
  const blobs = PRESETS[variant] ?? PRESETS.a;
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 dark:opacity-[0.6]">
        {blobs.map((b, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              top: b.y,
              left: b.x,
              width: b.size,
              height: b.size,
              transform: "translate(-40%, -40%)",
              background: `radial-gradient(circle at 50% 50%, ${b.color}, transparent 68%)`,
              filter: `blur(${b.blur}px)`,
              opacity: b.opacity,
            }}
          />
        ))}
      </div>
      <span
        className="absolute inset-0 opacity-[0.035] mix-blend-soft-light dark:opacity-[0.05]"
        style={{ backgroundImage: GRAIN, backgroundSize: "140px 140px" }}
      />
    </div>
  );
}

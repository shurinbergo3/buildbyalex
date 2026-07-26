/* The stand-in app icon used wherever we show "your app, live in the stores".
   A real iOS icon shape (squircle), a warm gradient, a top gloss and a hairline
   rim — the details that make a mock read as a shipped product rather than a
   placeholder. The mark itself is a geometric launch chevron over a base bar. */

export function AppIconMark({
  size = 40,
  radius = 0.226,
  className = "",
}: {
  /** px */
  size?: number;
  /** corner radius as a share of size — 0.226 matches the iOS icon grid */
  radius?: number;
  className?: string;
}) {
  const r = size * radius;
  return (
    <span
      className={`relative grid flex-none place-items-center overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: "linear-gradient(160deg, #FFA24F 0%, #FF7A2D 42%, #D9490A 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 0 0 0.5px rgba(0,0,0,0.22), 0 4px 12px -4px rgba(216,73,10,0.6)",
      }}
      aria-hidden
    >
      <span
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: "56%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.28), transparent)",
        }}
      />
      <svg viewBox="0 0 48 48" width={size * 0.66} height={size * 0.66} className="relative">
        {/* rising trajectory + its head — reads as launch at any size */}
        <path
          d="M9 37c8.5.6 15.2-3.4 20-12"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.95"
          strokeWidth="5.6"
          strokeLinecap="round"
        />
        <circle cx="34.5" cy="14.5" r="5.4" fill="#fff" />
        <path
          d="M15 12.5h7M18.5 9v7"
          stroke="#fff"
          strokeOpacity="0.55"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

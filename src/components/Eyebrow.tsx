/* Section label. Replaces the dot-in-a-pill badge that every template ships
   with — a thin accent rule reads as typography instead of a widget, and it
   sits at the same optical weight in light and dark. */

export function Eyebrow({
  children,
  align = "start",
  tone = "accent",
  className = "",
}: {
  children: React.ReactNode;
  align?: "start" | "center";
  tone?: "accent" | "muted" | "onDark";
  className?: string;
}) {
  const color =
    tone === "accent"
      ? "var(--c-accent-ink)"
      : tone === "onDark"
        ? "rgba(255,255,255,0.7)"
        : "var(--color-text-3)";
  const rule =
    tone === "accent"
      ? "var(--c-accent)"
      : tone === "onDark"
        ? "rgba(255,255,255,0.5)"
        : "var(--color-text-3)";

  if (align === "center") {
    return (
      <span className={`flex flex-col items-center gap-2.5 ${className}`}>
        <span
          className="text-[11px] font-semibold uppercase leading-none tracking-[0.2em]"
          style={{ color }}
        >
          {children}
        </span>
        <span
          aria-hidden
          className="h-px w-10"
          style={{ background: `linear-gradient(90deg, transparent, ${rule}, transparent)` }}
        />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span
        aria-hidden
        className="h-px w-7 shrink-0"
        style={{ background: `linear-gradient(90deg, ${rule}, transparent)` }}
      />
      <span
        className="text-[11px] font-semibold uppercase leading-none tracking-[0.18em]"
        style={{ color }}
      >
        {children}
      </span>
    </span>
  );
}

import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = 22,
  showDot = true,
}: {
  className?: string;
  /** Number → px, or any CSS length (e.g. a clamp() for fluid watermarks). */
  size?: number | string;
  showDot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-semibold tracking-[-0.022em] leading-none select-none",
        className,
      )}
      style={{ fontSize: size }}
      aria-label="buildbyalex"
    >
      <span>build</span>
      <span className="opacity-40">by</span>
      <span className="text-[color:var(--c-accent)]">alex</span>
      {showDot && (
        <span
          className="block rounded-full bg-[color:var(--c-accent)]"
          // em units keep the dot perfectly proportional at every size.
          style={{ width: "0.2em", height: "0.2em", marginLeft: "0.07em", marginBottom: "0.1em" }}
        />
      )}
    </span>
  );
}

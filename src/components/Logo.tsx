import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = 22,
}: {
  className?: string;
  size?: number;
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
      <span
        className="ml-[2px] block h-[5px] w-[5px] rounded-full bg-[color:var(--c-accent)]"
        style={{ marginBottom: 2 }}
      />
    </span>
  );
}

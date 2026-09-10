import { cn } from "@/lib/utils";

type Tone = "default" | "alt" | "ink";
type Pad = "default" | "tight" | "loose";

// Default sections stay see-through so the page's ambient light runs through
// them; alt ones add a faint glass lift that fades out at the edges, so the
// page reads as one surface instead of stacked bands.
const toneClass: Record<Tone, string> = {
  default: "",
  alt: "bg-[linear-gradient(180deg,transparent,var(--color-bg-alt)_12rem,var(--color-bg-alt)_calc(100%_-_12rem),transparent)]",
  ink: "bg-black/40 text-[#F5F5F5]",
};

const padClass: Record<Pad, string> = {
  tight: "py-12 md:py-16",
  default: "py-16 md:py-20",
  loose: "py-16 md:py-24",
};

export function Section({
  id,
  tone = "default",
  pad = "default",
  className,
  children,
}: {
  id?: string;
  tone?: Tone;
  pad?: Pad;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        toneClass[tone],
        padClass[pad],
        className,
      )}
    >
      {children}
    </section>
  );
}

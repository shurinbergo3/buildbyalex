import { cn } from "@/lib/utils";

type Tone = "default" | "alt" | "ink";
type Pad = "default" | "tight" | "loose";

const toneClass: Record<Tone, string> = {
  default: "bg-[color:var(--color-bg)]",
  alt: "bg-[color:var(--color-bg-alt)]",
  ink: "bg-[#0A0A0A] text-[#F5F5F5]",
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

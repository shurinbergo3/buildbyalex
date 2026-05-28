import { cn } from "@/lib/utils";

type Size = "default" | "sm" | "md" | "wide";

const sizes: Record<Size, string> = {
  sm: "max-w-[720px]",
  md: "max-w-[960px]",
  default: "max-w-[1200px]",
  wide: "max-w-[1440px]",
};

export function Container({
  className,
  size = "default",
  children,
}: {
  className?: string;
  size?: Size;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full px-6 md:px-8", sizes[size], className)}>
      {children}
    </div>
  );
}

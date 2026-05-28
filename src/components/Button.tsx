import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "link";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-1.5 font-medium leading-none rounded-full transition-[background,color,transform] duration-200 ease-[cubic-bezier(0.28,0.11,0.32,1)] disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-[color:var(--c-accent)] text-white hover:bg-[color:var(--c-accent-hover)] active:translate-y-[1px]",
  secondary:
    "bg-[color:var(--color-text)] text-[color:var(--color-bg)] hover:opacity-90 active:translate-y-[1px]",
  ghost:
    "border border-[color:var(--c-hairline)] bg-transparent text-[color:var(--color-text)] hover:bg-[color:var(--color-bg-alt)] active:translate-y-[1px]",
  link:
    "p-0 rounded-none text-[color:var(--c-accent-ink)] dark:text-[color:var(--c-accent)] hover:underline underline-offset-4",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[15px] tracking-[-0.011em]",
  lg: "h-12 px-6 text-[16px] tracking-[-0.014em]",
};

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
};

type LinkProps = Common &
  Omit<ComponentProps<typeof Link>, "className"> & {
    as?: "link";
  };

type ButtonProps = Common &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    as: "button";
  };

type AnchorProps = Common &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
    as: "a";
    href: string;
  };

function stripAs<T extends { as?: unknown }>(obj: T): Omit<T, "as"> {
  const copy = { ...obj };
  delete (copy as { as?: unknown }).as;
  return copy;
}

export function Button(props: LinkProps | ButtonProps | AnchorProps) {
  const { variant = "primary", size = "md", className, ...rest } = props;
  const classes = cn(base, variants[variant], variant !== "link" && sizes[size], className);

  if ("as" in rest && rest.as === "button") {
    return <button className={classes} {...stripAs(rest)} />;
  }
  if ("as" in rest && rest.as === "a") {
    return <a className={classes} {...stripAs(rest)} />;
  }
  return <Link className={classes} {...stripAs(rest as LinkProps)} />;
}

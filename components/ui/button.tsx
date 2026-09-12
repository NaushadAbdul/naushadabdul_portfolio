import type { ReactNode } from "react";
import type { Accent } from "@/lib/types";
import { accentStyle, cn } from "@/lib/utils";

type Variant = "solid" | "accent" | "outline";
type Size = "sm" | "md" | "lg";

type BaseProps = {
  children: ReactNode;
  /** solid = ink block, accent = flat colour, outline = transparent. */
  variant?: Variant;
  size?: Size;
  accent?: Accent;
  className?: string;
  /** Renders an <a> instead of a <button>. */
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
  target?: string;
  rel?: string;
  title?: string;
  name?: string;
  value?: string;
  "aria-label"?: string;
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base md:text-lg",
};

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper",
  accent: "text-ink",
  outline: "bg-paper text-ink",
};

/**
 * Brutalist button.
 *
 * The hover state translates the element by exactly its hard shadow offset and
 * drops the shadow, so the button appears to be pressed flush into the page.
 */
export function Button({
  children,
  variant = "solid",
  size = "md",
  accent = "yellow",
  className,
  href,
  type = "button",
  disabled,
  onClick,
  target,
  rel,
  title,
  name,
  value,
  "aria-label": ariaLabel,
}: BaseProps) {
  const classes = cn(
    "brut-border inline-flex items-center justify-center gap-2 font-mono font-bold uppercase tracking-widest",
    "transition-[transform,box-shadow,background-color] duration-100 ease-out",
    "shadow-brut hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-none",
    "disabled:pointer-events-none disabled:opacity-50",
    sizes[size],
    variants[variant],
    variant === "accent" && accentStyle(accent).bg,
    className,
  );

  if (href !== undefined) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        target={target}
        rel={rel}
        title={title}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      title={title}
      name={name}
      value={value}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

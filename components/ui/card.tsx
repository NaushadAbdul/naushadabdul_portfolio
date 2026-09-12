import type { ReactNode } from "react";
import type { Accent } from "@/lib/types";
import { accentStyle, cn } from "@/lib/utils";

type CardProps = {
  children: ReactNode;
  className?: string;
  /** Optional flat colour strip along the top edge. */
  accentBar?: Accent;
  /** Lift the card on hover, for interactive cards. */
  interactive?: boolean;
};

/** Brutalist panel: thick ink border, hard offset shadow, no rounded corners. */
export function Card({ children, className, accentBar, interactive = false }: CardProps) {
  return (
    <div
      className={cn(
        "brut-border relative bg-paper shadow-brut",
        interactive &&
          "transition-[transform,box-shadow] duration-100 ease-out hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-none",
        className,
      )}
    >
      {accentBar ? (
        <div
          className={cn("h-3 w-full border-b-[3px] border-ink", accentStyle(accentBar).bg)}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </div>
  );
}

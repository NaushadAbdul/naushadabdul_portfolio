import type { CSSProperties, ReactNode } from "react";
import type { Accent } from "@/lib/types";
import { accentStyle, cn } from "@/lib/utils";

type StickerProps = {
  children: ReactNode;
  accent?: Accent;
  /** Rotation in degrees, applied statically and preserved while floating. */
  rotate?: number;
  className?: string;
  /** Gentle idle float. */
  float?: boolean;
};

/** A rotated, loosely-stuck label — the brutalism equivalent of a sticker. */
export function Sticker({ children, accent = "lime", rotate = -6, className, float = false }: StickerProps) {
  const style = { "--float-rotate": `${rotate}deg`, transform: `rotate(${rotate}deg)` } as CSSProperties;

  return (
    <span
      style={style}
      className={cn(
        "brut-border inline-flex items-center gap-2 px-4 py-2 font-mono text-[0.7rem] font-bold uppercase shadow-brut-sm",
        accentStyle(accent).bg,
        accentStyle(accent).on,
        float && "animate-float",
        className,
      )}
    >
      {children}
    </span>
  );
}

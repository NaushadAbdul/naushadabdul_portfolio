import type { Accent } from "@/lib/types";
import { accentStyle, cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Display number, e.g. "02". */
  index: string;
  /** Small mono label above the title. */
  kicker: string;
  title: string;
  accent?: Accent;
  className?: string;
};

/**
 * Shared section header: a numbered colour chip, a mono kicker and an
 * oversized display title underlined by a thick rule.
 */
export function SectionHeading({ index, kicker, title, accent = "yellow", className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 md:mb-14", className)}>
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "brut-border flex size-12 shrink-0 items-center justify-center font-mono text-sm font-bold shadow-brut-sm",
            accentStyle(accent).bg,
            accentStyle(accent).on,
          )}
        >
          {index}
        </span>
        <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.3em] text-ink/60 md:text-xs">
          {kicker}
        </span>
      </div>

      <h2 className="mt-6 text-5xl uppercase sm:text-6xl md:text-7xl">{title}</h2>

      <div className={cn("mt-6 h-2 w-full border-y-[3px] border-ink", accentStyle(accent).bg)} aria-hidden="true" />
    </div>
  );
}

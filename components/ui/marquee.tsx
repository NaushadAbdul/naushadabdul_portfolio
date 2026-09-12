import type { Accent } from "@/lib/types";
import { accentStyle, cn } from "@/lib/utils";

type MarqueeProps = {
  items: string[];
  accent?: Accent;
  reverse?: boolean;
  className?: string;
};

/**
 * Infinite horizontal ticker.
 *
 * The list is rendered twice inside a `w-max` row and translated -50%, which
 * lands exactly one full copy later — so the loop has no visible seam.
 */
export function Marquee({ items, accent = "yellow", reverse = false, className }: MarqueeProps) {
  return (
    <div
      className={cn(
        "grid-paper-dark overflow-hidden border-y-[3px] border-ink",
        accentStyle(accent).bg,
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max",
          reverse ? "animate-marquee-rev" : "animate-marquee",
          "motion-reduce:animate-none",
        )}
      >
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex shrink-0 items-center"
            aria-hidden={copy === 1 ? "true" : undefined}
          >
            {items.map((item, index) => (
              <li
                key={`${copy}-${item}-${index}`}
                className="flex items-center gap-6 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.25em] whitespace-nowrap text-ink md:text-sm"
              >
                <span>{item}</span>
                <span aria-hidden="true" className="text-base leading-none">
                  ✶
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

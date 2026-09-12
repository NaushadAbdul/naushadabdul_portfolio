import { cn } from "@/lib/utils";

/**
 * Experimental hero graphics.
 *
 * Hand-built SVG/div shapes — a starburst, concentric rings, a checkerboard and
 * a zigzag. They are decorative only, so every one is `aria-hidden`.
 */

/** Alternating radii around a circle, used to build the starburst polygon. */
function starPoints(spikes: number, outer: number, inner: number, cx = 50, cy = 50) {
  const step = Math.PI / spikes;
  const points: string[] = [];

  for (let i = 0; i < spikes * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = i * step - Math.PI / 2;
    points.push(
      `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`,
    );
  }

  return points.join(" ");
}

const STARBURST = starPoints(12, 48, 20);

export function Starburst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("size-full", className)} aria-hidden="true">
      <polygon
        points={STARBURST}
        className="fill-brut-yellow stroke-ink"
        strokeWidth={3}
        strokeLinejoin="miter"
      />
      <circle cx="50" cy="50" r="13" className="fill-ink" />
    </svg>
  );
}

export function ConcentricRings({ className }: { className?: string }) {
  const radii = [46, 35, 24, 13];

  return (
    <svg viewBox="0 0 100 100" className={cn("size-full", className)} aria-hidden="true">
      {radii.map((radius, index) => (
        <circle
          key={radius}
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={3}
          className={index % 2 === 0 ? "stroke-ink" : "stroke-brut-pink"}
        />
      ))}
      <circle cx="50" cy="50" r="5" className="fill-ink" />
    </svg>
  );
}

export function Checkerboard({ className }: { className?: string }) {
  return (
    <div
      className={cn("brut-border grid grid-cols-4 grid-rows-4", className)}
      aria-hidden="true"
    >
      {Array.from({ length: 16 }).map((_, index) => {
        const isDark = (Math.floor(index / 4) + (index % 4)) % 2 === 0;
        return <div key={index} className={isDark ? "bg-ink" : "bg-brut-lime"} />;
      })}
    </div>
  );
}

export function ZigZag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 24" className={cn("w-full", className)} aria-hidden="true">
      <polyline
        points="0,20 12,4 24,20 36,4 48,20 60,4 72,20 84,4 96,20 108,4 120,20"
        fill="none"
        strokeWidth={3}
        className="stroke-ink"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

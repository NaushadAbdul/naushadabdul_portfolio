import type { Accent } from "./types";

/** Joins conditional class names. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type AccentStyle = {
  /** Solid accent background. */
  bg: string;
  /** Accent text colour. */
  text: string;
  /** Accent border colour. */
  border: string;
  /** Ink-on-accent text, for use over `bg`. */
  on: string;
};

/**
 * Static class strings per accent. Tailwind only ships classes it can find as
 * literal text, so these must never be built with string interpolation.
 */
export const accentStyles: Record<Accent, AccentStyle> = {
  yellow: {
    bg: "bg-brut-yellow",
    text: "text-brut-yellow",
    border: "border-brut-yellow",
    on: "text-ink",
  },
  lime: {
    bg: "bg-brut-lime",
    text: "text-brut-lime",
    border: "border-brut-lime",
    on: "text-ink",
  },
  pink: {
    bg: "bg-brut-pink",
    text: "text-brut-pink",
    border: "border-brut-pink",
    on: "text-ink",
  },
  blue: {
    bg: "bg-brut-blue",
    text: "text-brut-blue",
    border: "border-brut-blue",
    on: "text-paper",
  },
  orange: {
    bg: "bg-brut-orange",
    text: "text-brut-orange",
    border: "border-brut-orange",
    on: "text-ink",
  },
  purple: {
    bg: "bg-brut-purple",
    text: "text-brut-purple",
    border: "border-brut-purple",
    on: "text-ink",
  },
};

/** Resolves any stored accent value to a known palette entry. */
export function accentStyle(accent: string | null | undefined): AccentStyle {
  const key = accent as Accent;
  return accentStyles[key] ?? accentStyles.yellow;
}

/** Zero-pads a project's position in the list: 1 -> "01". */
export function projectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

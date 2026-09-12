/** Formats an ISO timestamp for the admin, or an em dash when absent. */
export function formatDateTime(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

/** "3 hours ago" style relative time, for the message inbox. */
export function formatRelative(value: string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const [unit, secondsPerUnit] of units) {
    if (Math.abs(seconds) >= secondsPerUnit) {
      return formatter.format(-Math.round(seconds / secondsPerUnit), unit);
    }
  }

  return "just now";
}

/** Renders any stored value as a short single-line preview. */
export function previewText(value: unknown, max = 60) {
  const text = String(value ?? "").trim();

  if (text.length <= max) return text;

  return `${text.slice(0, max - 1)}…`;
}

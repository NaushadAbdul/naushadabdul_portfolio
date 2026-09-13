import type { SiteSettings, SocialLink } from "./types";

/** Derives a readable handle from a profile URL, e.g. `@your-handle`. */
function handleFor(url: string, label: string) {
  try {
    const lastSegment = new URL(url).pathname.split("/").filter(Boolean).pop();

    if (!lastSegment) return "";

    return label === "LinkedIn" ? `/in/${lastSegment}` : `@${lastSegment}`;
  } catch {
    return url;
  }
}

/**
 * Builds the social list from settings, skipping any network the admin has not
 * filled in — so clearing a URL removes the link everywhere instead of
 * rendering a dead one.
 */
export function socialsFromSettings(settings: SiteSettings): SocialLink[] {
  const entries: Array<{ label: string; url: string | null; icon: string }> = [
    { label: "LinkedIn", url: settings.linkedin_url, icon: "/icons/linkedin.png" },
    { label: "GitHub", url: settings.github_url, icon: "/icons/github.png" },
    { label: "X", url: settings.x_url, icon: "/icons/twitter.png" },
    { label: "Instagram", url: settings.instagram_url, icon: "/icons/instagram.png" },
  ];

  return entries
    .filter((entry): entry is { label: string; url: string; icon: string } => Boolean(entry.url))
    .map((entry) => ({
      label: entry.label,
      href: entry.url,
      handle: handleFor(entry.url, entry.label),
      icon: entry.icon,
    }));
}

import type { SiteSettings } from "./types";

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

/**
 * Default content.
 *
 * These values are used until the `site_settings` row is filled in, and any
 * column left null in the database falls back to what is here — so clearing a
 * field in the admin can never blank the live site.
 *
 * NOTE: the email and social URLs below are placeholders. Edit them at
 * /admin/settings rather than in this file.
 */
export const defaultSettings: SiteSettings = {
  full_name: "Abdul Naushad Ali",
  initials: "ANA",
  role: "AI & Web Developer",
  tagline: "Build / Automate / Empower",
  description:
    "Full-stack developer working where AI, web and automation meet. I turn manual, messy workflows into fast software that ships.",
  bio: "I'm a developer who likes the unglamorous part: making software that keeps working once the demo is over.\n\nI spend most of my time at the seam between AI and product. That usually means taking a workflow a team does by hand, understanding where it actually breaks, and replacing it with something smaller and faster than anyone expected.\n\nThe work is equal parts engineering and editing: choosing the boring reliable option when it wins, and reaching for the ambitious one when it genuinely earns its place.",
  focus: "AI · Web · Automation",
  availability: "Open to freelance & full-time",
  location: "Kerala, India",
  email: "abdul@example.com",
  resume_url: null,
  portrait_url: null,
  linkedin_url: "https://www.linkedin.com/in/your-handle",
  github_url: "https://github.com/your-handle",
  x_url: "https://x.com/your-handle",
  instagram_url: "https://instagram.com/your-handle",
};

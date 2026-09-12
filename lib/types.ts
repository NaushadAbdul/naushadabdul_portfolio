/** Colour keys available for services, projects and section accents. */
export type Accent = "yellow" | "lime" | "pink" | "blue" | "orange" | "purple";

/** Row shape of the `services` table (see supabase/schema.sql). */
export type Service = {
  id: string;
  title: string;
  description: string;
  /** Short label or emoji rendered in the card corner. */
  icon: string;
  accent: Accent;
  display_order: number;
};

/** Row shape of the `projects` table (see supabase/schema.sql). */
export type Project = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  year: string;
  role: string;
  stack: string[];
  image_url: string | null;
  live_url: string | null;
  repo_url: string | null;
  featured: boolean;
  accent: Accent;
  display_order: number;
};

/** Row shape of the `skills` table (see supabase/admin.sql). */
export type Skill = {
  id: string;
  name: string;
  category: string;
  /** Proficiency, 1–5. */
  level: number;
  display_order: number;
};

/** Row shape of the `experience` table. */
export type Experience = {
  id: string;
  role: string;
  company: string;
  company_url: string | null;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  display_order: number;
};

/** Row shape of the `testimonials` table. */
export type Testimonial = {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  author_company: string;
  avatar_url: string | null;
  featured: boolean;
  display_order: number;
};

/** Row shape of the `messages` table, written by the contact form. */
export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

/**
 * Single editable record powering the site chrome (see `site_settings` in
 * supabase/admin.sql). Every field is non-optional because `lib/data.ts` merges
 * the database row over `defaultSettings`.
 */
export type SiteSettings = {
  full_name: string;
  initials: string;
  role: string;
  tagline: string;
  description: string;
  bio: string;
  focus: string;
  availability: string;
  location: string;
  email: string;
  resume_url: string | null;
  portrait_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  x_url: string | null;
  instagram_url: string | null;
};

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

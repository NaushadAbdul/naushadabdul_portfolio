import type { Accent } from "@/lib/types";

/**
 * Declarative admin registry.
 *
 * Every CRUD table is described once here, then a single set of routes
 * (`/admin/[resource]`, `/new`, `/[id]`) and one generic server action drive the
 * list, create, edit and delete UI. Adding a new editable table means adding an
 * entry to `resources` — no new pages.
 *
 * `table` is used to build Supabase queries, so it must never come from user
 * input: `getResource()` is a whitelist lookup and unknown keys 404.
 */

export const ACCENT_OPTIONS = ["yellow", "lime", "pink", "blue", "orange", "purple"] as const;

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "list"
  | "url"
  | "image"
  | "file";

export type FieldSpec = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
  required?: boolean;
  /** Allowed values for `select`. */
  options?: readonly string[];
  min?: number;
  max?: number;
  /** Render across the full width of the two-column form grid. */
  wide?: boolean;
  /** Storage bucket for `image` / `file` uploads. */
  bucket?: string;
  accept?: string;
  rows?: number;
};

export type ColumnSpec = {
  name: string;
  label: string;
  type?: "text" | "boolean" | "accent" | "number";
};

export type ResourceSpec = {
  /** URL segment and lookup key. */
  key: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  accent: Accent;
  /** Field shown as the row's primary label in the list. */
  titleField: string;
  /** Allows up/down reordering via `display_order`. */
  orderable: boolean;
  fields: FieldSpec[];
  columns: ColumnSpec[];
};

const ACCENT_FIELD: FieldSpec = {
  name: "accent",
  label: "Accent colour",
  type: "select",
  options: ACCENT_OPTIONS,
  help: "Colour used for this item's panel on the public site.",
};

export const resources: Record<string, ResourceSpec> = {
  projects: {
    key: "projects",
    table: "projects",
    label: "Projects",
    singular: "Project",
    description: "Case studies shown on the homepage and the /projects archive.",
    accent: "blue",
    titleField: "title",
    orderable: true,
    columns: [
      { name: "title", label: "Title" },
      { name: "year", label: "Year" },
      { name: "accent", label: "Accent", type: "accent" },
      { name: "featured", label: "Featured", type: "boolean" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, placeholder: "Nexus Docs Copilot" },
      {
        name: "slug",
        label: "Slug",
        type: "text",
        placeholder: "nexus-docs-copilot",
        help: "Used in URLs. Text is used to generate one if you leave this empty.",
      },
      {
        name: "tagline",
        label: "Tagline",
        type: "text",
        wide: true,
        placeholder: "Answers from 4,000 pages of internal docs in under two seconds.",
      },
      { name: "description", label: "Description", type: "textarea", rows: 5, wide: true },
      { name: "year", label: "Year", type: "text", placeholder: "2026" },
      { name: "role", label: "Your role", type: "text", placeholder: "Design & full-stack" },
      {
        name: "stack",
        label: "Stack",
        type: "list",
        wide: true,
        placeholder: "Next.js, TypeScript, pgvector",
        help: "Comma or newline separated.",
      },
      ACCENT_FIELD,
      { name: "featured", label: "Featured on homepage", type: "boolean" },
      { name: "image_url", label: "Cover image", type: "image", bucket: "media", wide: true },
      { name: "live_url", label: "Live URL", type: "url", placeholder: "https://example.com" },
      { name: "repo_url", label: "Repository URL", type: "url", placeholder: "https://github.com/..." },
    ],
  },

  services: {
    key: "services",
    table: "services",
    label: "Services",
    singular: "Service",
    description: "The three-card Services section on the homepage.",
    accent: "pink",
    titleField: "title",
    orderable: true,
    columns: [
      { name: "title", label: "Title" },
      { name: "icon", label: "Icon" },
      { name: "accent", label: "Accent", type: "accent" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, placeholder: "AI Integration & Agents" },
      { name: "description", label: "Description", type: "textarea", rows: 5, wide: true },
      {
        name: "icon",
        label: "Icon",
        type: "text",
        placeholder: "◆",
        help: "A single character or emoji shown in the card corner.",
      },
      ACCENT_FIELD,
    ],
  },

  skills: {
    key: "skills",
    table: "skills",
    label: "Skills",
    singular: "Skill",
    description: "Grouped by category in the Skills section on the homepage.",
    accent: "lime",
    titleField: "name",
    orderable: true,
    columns: [
      { name: "name", label: "Skill" },
      { name: "category", label: "Category" },
      { name: "level", label: "Level", type: "number" },
    ],
    fields: [
      { name: "name", label: "Skill", type: "text", required: true, placeholder: "TypeScript" },
      {
        name: "category",
        label: "Category",
        type: "text",
        required: true,
        placeholder: "Frontend",
        help: "Skills sharing a category are grouped together.",
      },
      {
        name: "level",
        label: "Level",
        type: "number",
        min: 1,
        max: 5,
        help: "1–5, drawn as a segmented bar.",
      },
    ],
  },

  experience: {
    key: "experience",
    table: "experience",
    label: "Experience",
    singular: "Role",
    description: "The timeline in the Experience section.",
    accent: "orange",
    titleField: "role",
    orderable: true,
    columns: [
      { name: "role", label: "Role" },
      { name: "company", label: "Company" },
      { name: "start_date", label: "From" },
      { name: "is_current", label: "Current", type: "boolean" },
    ],
    fields: [
      { name: "role", label: "Role", type: "text", required: true, placeholder: "Senior Full-Stack Developer" },
      { name: "company", label: "Company", type: "text", required: true, placeholder: "Nimbus Softworks" },
      { name: "company_url", label: "Company URL", type: "url", placeholder: "https://example.com" },
      { name: "location", label: "Location", type: "text", placeholder: "Remote" },
      { name: "start_date", label: "Start", type: "text", required: true, placeholder: "2023" },
      {
        name: "end_date",
        label: "End",
        type: "text",
        placeholder: "2025",
        help: "Leave empty when this is your current role.",
      },
      { name: "is_current", label: "Current role", type: "boolean" },
      { name: "description", label: "Description", type: "textarea", rows: 4, wide: true },
    ],
  },

  testimonials: {
    key: "testimonials",
    table: "testimonials",
    label: "Testimonials",
    singular: "Testimonial",
    description: "Quotes shown in the Testimonials section.",
    accent: "pink",
    titleField: "author_name",
    orderable: true,
    columns: [
      { name: "author_name", label: "Author" },
      { name: "author_company", label: "Company" },
      { name: "featured", label: "Featured", type: "boolean" },
    ],
    fields: [
      { name: "quote", label: "Quote", type: "textarea", rows: 4, required: true, wide: true },
      { name: "author_name", label: "Author name", type: "text", required: true, placeholder: "Priya Raghavan" },
      { name: "author_role", label: "Author role", type: "text", placeholder: "Head of Operations" },
      { name: "author_company", label: "Author company", type: "text", placeholder: "Acme Inc." },
      { name: "avatar_url", label: "Avatar", type: "image", bucket: "media" },
      { name: "featured", label: "Featured on homepage", type: "boolean" },
    ],
  },
};

/** Fields left out of the generic form because they are managed elsewhere. */
export const MANAGED_COLUMNS = ["id", "display_order", "created_at", "updated_at"] as const;

export function getResource(key: string): ResourceSpec | undefined {
  return Object.values(resources).some((resource) => resource.key === key)
    ? resources[key]
    : undefined;
}

export function resourceList(): ResourceSpec[] {
  return Object.values(resources);
}

/* ------------------------------------------------------------------
   Single-record screens
   ------------------------------------------------------------------ */

export type SingletonSpec = {
  key: string;
  label: string;
  description: string;
  accent: Accent;
  fields: FieldSpec[];
};

export const singletons: Record<string, SingletonSpec> = {
  about: {
    key: "about",
    label: "About",
    description: "The intro, bio and availability shown in the About section and the hero.",
    accent: "lime",
    fields: [
      { name: "role", label: "Role", type: "text", required: true, placeholder: "AI & Web Developer" },
      { name: "focus", label: "Focus", type: "text", placeholder: "AI · Web · Automation" },
      {
        name: "description",
        label: "Short intro",
        type: "textarea",
        rows: 3,
        wide: true,
        help: "Shown under the hero headline.",
      },
      {
        name: "bio",
        label: "Bio",
        type: "textarea",
        rows: 10,
        wide: true,
        help: "Separate paragraphs with a blank line.",
      },
      { name: "availability", label: "Availability", type: "text", placeholder: "Open to freelance & full-time" },
      { name: "location", label: "Location", type: "text", placeholder: "Kerala, India" },
      { name: "tagline", label: "Tagline", type: "text", wide: true, help: "Split on slashes for the footer ticker." },
    ],
  },

  settings: {
    key: "settings",
    label: "Settings",
    description: "Identity, contact details, social links and downloadable files.",
    accent: "purple",
    fields: [
      { name: "full_name", label: "Full name", type: "text", required: true, placeholder: "Abdul Naushad Ali" },
      { name: "initials", label: "Initials", type: "text", placeholder: "ANA", help: "Used for the logo mark." },
      { name: "email", label: "Contact email", type: "text", required: true, placeholder: "you@example.com" },
      {
        name: "portrait_url",
        label: "Portrait",
        type: "image",
        bucket: "media",
        help: "Uploads to Storage. Falls back to a designed placeholder when empty.",
      },
      {
        name: "resume_url",
        label: "Resume",
        type: "file",
        bucket: "resume",
        accept: "application/pdf",
        help: "PDF. Linked from the hero and footer when present.",
      },
      { name: "linkedin_url", label: "LinkedIn", type: "url", placeholder: "https://www.linkedin.com/in/..." },
      { name: "github_url", label: "GitHub", type: "url", placeholder: "https://github.com/..." },
      { name: "x_url", label: "X", type: "url", placeholder: "https://x.com/..." },
      { name: "instagram_url", label: "Instagram", type: "url", placeholder: "https://instagram.com/..." },
    ],
  },
};

export function getSingleton(key: string): SingletonSpec | undefined {
  return Object.values(singletons).some((singleton) => singleton.key === key)
    ? singletons[key]
    : undefined;
}

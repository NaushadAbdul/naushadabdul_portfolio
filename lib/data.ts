import {
  fallbackExperience,
  fallbackProjects,
  fallbackServices,
  fallbackSkills,
  fallbackTestimonials,
} from "./content";
import { defaultSettings } from "./site";
import { getPublicClient } from "./supabase/public";
import type { Experience, Project, Service, SiteSettings, Skill, Testimonial } from "./types";

/**
 * Public data access.
 *
 * Every reader degrades gracefully: a missing Supabase config, a missing table
 * or a network failure all resolve to the fallback content in `lib/content.ts`.
 * A personal site should never show a stack trace to a recruiter.
 */

async function selectAll<T>(table: string, fallback: T[]): Promise<T[]> {
  const supabase = getPublicClient();

  if (!supabase) {
    return fallback;
  }

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.warn(`[supabase] "${table}" query failed, using fallback content: ${error.message}`);
    return fallback;
  }

  if (!data || data.length === 0) {
    return fallback;
  }

  return data as T[];
}

/* ------------------------------------------------------------------
   Services & projects
   ------------------------------------------------------------------ */

/** All services, ordered by `display_order`. */
export async function getServices(): Promise<Service[]> {
  return selectAll<Service>("services", fallbackServices);
}

/** All projects, ordered by `display_order`. Used by /projects. */
export async function getProjects(): Promise<Project[]> {
  return selectAll<Project>("projects", fallbackProjects);
}

/** Featured projects only, for the homepage. */
export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  const featured = projects.filter((project) => project.featured);
  // If nothing is flagged as featured yet, show the first three rather than nothing.
  return featured.length > 0 ? featured : projects.slice(0, 3);
}

/* ------------------------------------------------------------------
   Skills, experience & testimonials
   ------------------------------------------------------------------ */

export async function getSkills(): Promise<Skill[]> {
  return selectAll<Skill>("skills", fallbackSkills);
}

export async function getExperience(): Promise<Experience[]> {
  return selectAll<Experience>("experience", fallbackExperience);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return selectAll<Testimonial>("testimonials", fallbackTestimonials);
}

/** Testimonials flagged as featured, for the homepage. */
export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const testimonials = await getTestimonials();
  const featured = testimonials.filter((testimonial) => testimonial.featured);
  return featured.length > 0 ? featured : testimonials.slice(0, 3);
}

/* ------------------------------------------------------------------
   Site settings
   ------------------------------------------------------------------ */

/**
 * The single settings record merged over the defaults.
 *
 * Merging (rather than replacing) means a column left null in the database can
 * never blank out part of the live site — nulls always lose to the default.
 */
export async function getSettings(): Promise<SiteSettings> {
  const supabase = getPublicClient();

  if (!supabase) {
    return defaultSettings;
  }

  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();

  if (error) {
    console.warn(`[supabase] "site_settings" query failed, using default content: ${error.message}`);
    return defaultSettings;
  }

  if (!data) {
    return defaultSettings;
  }

  const row = data as Record<string, unknown>;
  const merged = { ...defaultSettings } as Record<string, unknown>;

  for (const key of Object.keys(defaultSettings)) {
    const value = row[key];
    if (value !== null && value !== undefined) {
      merged[key] = value;
    }
  }

  return merged as SiteSettings;
}

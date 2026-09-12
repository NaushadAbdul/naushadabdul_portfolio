import type { SupabaseClient } from "@supabase/supabase-js";
import type { Message } from "@/lib/types";
import type { ResourceSpec } from "./resources";

/**
 * Reads performed with the signed-in admin's cookie client, so Row Level
 * Security decides what comes back rather than application code.
 */

export type Row = Record<string, unknown>;

export async function listResourceRows(supabase: SupabaseClient, resource: ResourceSpec): Promise<Row[]> {
  const { data, error } = await supabase
    .from(resource.table)
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []) as Row[];
}

export async function getResourceRow(
  supabase: SupabaseClient,
  resource: ResourceSpec,
  id: string,
): Promise<Row | null> {
  const { data, error } = await supabase
    .from(resource.table)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return (data as Row | null) ?? null;
}

export async function listMessages(supabase: SupabaseClient): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []) as Message[];
}

/** Raw settings row, used to seed the edit forms. */
export async function getSettingsRow(supabase: SupabaseClient): Promise<Row> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return (data as Row | null) ?? {};
}

export type AdminUser = {
  user_id: string;
  email: string | null;
  added_at: string;
  last_sign_in_at: string | null;
  is_self: boolean;
};

/**
 * Reads the allow-list, including emails, through a SECURITY DEFINER function
 * (auth.users is not reachable with the publishable key).
 *
 * Returns the error rather than throwing so the page can render a setup notice
 * when admin-users.sql has not been run yet.
 */
export async function listAdmins(
  supabase: SupabaseClient,
): Promise<{ admins: AdminUser[]; error: string | null }> {
  const { data, error } = await supabase.rpc("list_admins");

  if (error) {
    return { admins: [], error: error.message };
  }

  return { admins: (data ?? []) as AdminUser[], error: null };
}

export async function countUnreadMessages(supabase: SupabaseClient): Promise<number> {
  const { count, error } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  if (error) return 0;

  return count ?? 0;
}

export async function countRows(supabase: SupabaseClient, table: string): Promise<number> {
  const { count, error } = await supabase.from(table).select("id", { count: "exact", head: true });

  if (error) return 0;

  return count ?? 0;
}

export type DashboardStats = {
  projects: number;
  featuredProjects: number;
  services: number;
  skills: number;
  experience: number;
  testimonials: number;
  messages: number;
  unreadMessages: number;
  lastUpdated: string | null;
};

/** Most recent `updated_at` across the editable tables. */
async function mostRecentlyUpdated(supabase: SupabaseClient, tables: string[]) {
  const timestamps = await Promise.all(
    tables.map(async (table) => {
      const { data } = await supabase
        .from(table)
        .select("updated_at")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      return (data as { updated_at?: string } | null)?.updated_at ?? null;
    }),
  );

  const found = timestamps.filter((value): value is string => Boolean(value));

  if (found.length === 0) return null;

  return found.sort().at(-1) ?? null;
}

export async function getDashboardStats(supabase: SupabaseClient): Promise<DashboardStats> {
  const [
    projects,
    services,
    skills,
    experience,
    testimonials,
    messages,
    unreadMessages,
    featuredResult,
  ] = await Promise.all([
    countRows(supabase, "projects"),
    countRows(supabase, "services"),
    countRows(supabase, "skills"),
    countRows(supabase, "experience"),
    countRows(supabase, "testimonials"),
    countRows(supabase, "messages"),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false)
      .then(({ count }) => count ?? 0),
    supabase
      .from("projects")
      .select("id", { count: "exact", head: true })
      .eq("featured", true),
  ]);

  return {
    projects,
    featuredProjects: featuredResult.count ?? 0,
    services,
    skills,
    experience,
    testimonials,
    messages,
    unreadMessages,
    lastUpdated: await mostRecentlyUpdated(supabase, ["projects", "services", "site_settings"]),
  };
}

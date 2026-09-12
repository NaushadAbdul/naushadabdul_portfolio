/**
 * Supabase environment values.
 *
 * Supabase now issues publishable keys (`sb_publishable_…`); the legacy anon
 * key goes in the same slot and works identically, so both variable names are
 * accepted. These are read literally (not dynamically) because Next.js inlines
 * `NEXT_PUBLIC_*` values at build time.
 */
export const SUPABASE_URL = (
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  ""
).trim().replace(/^["']|["']$/g, "");

export const SUPABASE_KEY = (
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  ""
).trim().replace(/^["']|["']$/g, "");

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

export function getMissingSupabaseEnv(): string[] {
  const missing: string[] = [];
  if (!SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!SUPABASE_KEY) missing.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)");
  return missing;
}

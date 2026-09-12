/**
 * Supabase environment values.
 *
 * Supabase now issues publishable keys (`sb_publishable_…`); the legacy anon
 * key goes in the same slot and works identically, so both variable names are
 * accepted. These are read literally (not dynamically) because Next.js inlines
 * `NEXT_PUBLIC_*` values at build time.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

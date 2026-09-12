import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, SUPABASE_KEY, SUPABASE_URL } from "./env";

let cached: SupabaseClient | null = null;

/**
 * Plain anon client for public reads.
 *
 * No session is persisted because the public site never signs a user in — the
 * cookie-aware client in `./server` handles anything authenticated.
 */
export function getPublicClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;

  cached ??= createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}

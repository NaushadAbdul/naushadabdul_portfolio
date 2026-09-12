import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./env";

/**
 * Service-role client. SERVER ONLY.
 *
 * The service_role key bypasses Row Level Security entirely, so it must never
 * be prefixed with `NEXT_PUBLIC_` and never imported into a Client Component.
 * It is optional: the admin runs fine without it, and only the ability to
 * create brand-new auth accounts depends on it.
 */
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const hasServiceRoleKey = Boolean(SUPABASE_URL && serviceKey);

export function getServiceClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !serviceKey) return null;

  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

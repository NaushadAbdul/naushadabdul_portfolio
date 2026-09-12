import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { isSupabaseConfigured, SUPABASE_KEY, SUPABASE_URL } from "./env";

/**
 * Cookie-aware Supabase client for Server Components and Server Actions.
 *
 * Returns null when Supabase is not configured so callers can render a helpful
 * message instead of throwing.
 */
export async function getServerClient(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components are not allowed to set cookies. The middleware
          // refreshes the session instead, so this is safe to ignore.
        }
      },
    },
  });
}

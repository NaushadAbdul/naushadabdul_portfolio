"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, SUPABASE_KEY, SUPABASE_URL } from "./env";

let cached: SupabaseClient | null = null;

/**
 * Browser client, used for Storage uploads from the admin.
 *
 * Uploads go through RLS: the storage policies only permit authenticated
 * admins to write, so this client needs a valid session cookie.
 */
export function getBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;

  cached ??= createBrowserClient(SUPABASE_URL, SUPABASE_KEY);

  return cached;
}

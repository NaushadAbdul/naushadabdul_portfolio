"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

let cached: SupabaseClient | null = null;

/**
 * Browser client, used for Storage uploads from the admin.
 *
 * Uploads go through RLS: the storage policies only permit authenticated
 * admins to write, so this client needs a valid session cookie.
 */
export function getBrowserClient(): SupabaseClient | null {
  const url = (
    SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    ""
  ).trim().replace(/^["']|["']$/g, "");

  const key = (
    SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  ).trim().replace(/^["']|["']$/g, "");

  if (!url || !key) return null;

  cached ??= createBrowserClient(url, key);

  return cached;
}

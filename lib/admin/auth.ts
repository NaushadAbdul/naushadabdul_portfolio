"use server";

import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import type { ActionState } from "./action-state";

/**
 * Only ever redirect back into /admin, so a crafted `next` value cannot turn
 * the login form into an open redirect.
 */
function safeRedirectPath(value: string) {
  if (!value.startsWith("/admin")) return "/admin";
  if (value.startsWith("//") || value.startsWith("/admin/login")) return "/admin";
  return value;
}

export async function signIn(
  nextPath: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await getServerClient();

  if (!supabase) {
    return { error: "Supabase is not configured. Add your environment variables and restart." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are both required." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Sign-in failed. Please try again." };
  }

  // Confirm the account is actually on the admin allow-list, and sign it back
  // out if not — otherwise the dashboard would bounce them straight back here.
  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!adminRow) {
    await supabase.auth.signOut();
    return {
      error:
        "Signed in — but that account is not an administrator yet. Run the grant SQL at the bottom of supabase/admin.sql. If it reports 0 rows affected, the email did not match any account in auth.users.",
    };
  }

  redirect(safeRedirectPath(nextPath));
}

export async function signOut(): Promise<void> {
  const supabase = await getServerClient();

  await supabase?.auth.signOut();

  redirect("/admin/login");
}

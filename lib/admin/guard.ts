import type { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";

const LOGIN_PATH = "/admin/login";

/** Postgres `undefined_table`, and PostgREST's equivalent schema-cache miss. */
function isMissingTable(error: { code?: string; message: string }) {
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    /does not exist|schema cache/i.test(error.message)
  );
}

/**
 * Asserts that the current request belongs to a signed-in admin, and returns a
 * cookie-aware client plus the user.
 *
 * Called from the admin layout *and* from every server action. The layout check
 * protects rendering; the action check is what actually protects writes, since
 * server actions are independently addressable endpoints.
 */
export async function requireAdmin(): Promise<{ supabase: SupabaseClient; user: User }> {
  const supabase = await getServerClient();

  if (!supabase) {
    redirect(`${LOGIN_PATH}?error=config`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(LOGIN_PATH);
  }

  const { data: adminRow, error: adminError } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError && isMissingTable(adminError)) {
    // The tables have not been created yet. Say so, instead of claiming the
    // account is not an administrator, which would send the user hunting
    // through the wrong settings screen.
    redirect(`${LOGIN_PATH}?error=setup`);
  }

  if (!adminRow) {
    // Signed in, but not on the allow-list. Send them back to the login screen
    // rather than looping on a dashboard they can never open.
    await supabase.auth.signOut();
    redirect(`${LOGIN_PATH}?error=forbidden`);
  }

  return { supabase, user };
}

"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "./action-state";
import { requireAdmin } from "./guard";
import { describeDbError } from "./parse";
import { getServiceClient } from "@/lib/supabase/admin";

/**
 * Admin allow-list management.
 *
 * Granting an existing account is done entirely with the signed-in admin's own
 * key, via the `admin_grant_by_email` RPC — no privileged secret required.
 *
 * Creating a *new* auth account is the one operation that genuinely needs the
 * service_role key, because the Admin API is the only way to do it. That path
 * is optional and reports clearly when the key is absent.
 */

const MIN_PASSWORD_LENGTH = 8;

export async function addAdmin(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const createAccount = formData.get("create_account") === "on";

  if (!email) {
    return { error: "An email address is required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { error: "That does not look like a valid email address." };
  }

  if (createAccount) {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
    }

    const service = getServiceClient();

    if (!service) {
      return {
        error:
          "Creating a new account requires SUPABASE_SERVICE_ROLE_KEY in .env.local. Add it and restart, or create the user in Supabase → Authentication → Users and grant them here.",
      };
    }

    const { error: createError } = await service.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    // An existing account is fine — the grant below is what matters.
    if (createError) {
      const alreadyExists =
        createError.code === "email_exists" || /already/i.test(createError.message);

      if (!alreadyExists) {
        return { error: createError.message };
      }
    }
  }

  const { data, error } = await supabase.rpc("admin_grant_by_email", { target_email: email });

  if (error) {
    return { error: describeDbError(error) };
  }

  if (data === "no_user") {
    return {
      error: `No account exists for ${email}. Tick "create a new account" to make one, or add the user in Supabase → Authentication → Users first.`,
    };
  }

  revalidatePath("/admin/admins");
  return { ok: true };
}

export async function revokeAdmin(userId: string): Promise<void> {
  const { supabase, user } = await requireAdmin();

  // Belt and braces: the UI hides this button for yourself, and the
  // prevent_last_admin_removal trigger rejects emptying the list.
  if (userId === user.id) {
    throw new Error("You cannot remove your own admin access.");
  }

  const { error } = await supabase.from("admins").delete().eq("user_id", userId);

  if (error) throw new Error(describeDbError(error));

  revalidatePath("/admin/admins");
  revalidatePath("/admin");
}

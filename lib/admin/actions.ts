"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ActionState } from "./action-state";
import { requireAdmin } from "./guard";
import { describeDbError, parseFields, slugify } from "./parse";
import { getResource, getSingleton } from "./resources";

/**
 * Admin write operations.
 *
 * One generic implementation serves every CRUD resource, driven by the registry
 * in `resources.ts`. Each action re-checks admin rights: server actions are
 * independently addressable POST endpoints, so the layout guard is not enough.
 */

/** Edits change site-wide chrome (hero, footer, nav), so purge the whole cache. */
function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function createRecord(
  resourceKey: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const resource = getResource(resourceKey);
  if (!resource) return { error: "Unknown section." };

  const { supabase } = await requireAdmin();

  const { row, errors } = parseFields(resource.fields, formData);
  if (errors.length > 0) return { error: errors.join(" ") };

  if ("slug" in row) {
    row.slug = String(row.slug ?? "").trim() || slugify(String(row[resource.titleField] ?? ""));
    if (!row.slug) return { error: "A slug is required." };
  }

  // New rows go to the end of the list.
  const { data: last } = await supabase
    .from(resource.table)
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  row.display_order = ((last as { display_order?: number } | null)?.display_order ?? 0) + 1;

  const { error } = await supabase.from(resource.table).insert(row);
  if (error) return { error: describeDbError(error) };

  revalidateSite();
  redirect(`/admin/${resource.key}`);
}

export async function updateRecord(
  resourceKey: string,
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const resource = getResource(resourceKey);
  if (!resource) return { error: "Unknown section." };

  const { supabase } = await requireAdmin();

  const { row, errors } = parseFields(resource.fields, formData);
  if (errors.length > 0) return { error: errors.join(" ") };

  if ("slug" in row) {
    row.slug = String(row.slug ?? "").trim() || slugify(String(row[resource.titleField] ?? ""));
    if (!row.slug) return { error: "A slug is required." };
  }

  const { error } = await supabase.from(resource.table).update(row).eq("id", id);
  if (error) return { error: describeDbError(error) };

  revalidateSite();
  redirect(`/admin/${resource.key}`);
}

export async function deleteRecord(resourceKey: string, id: string): Promise<void> {
  const resource = getResource(resourceKey);
  if (!resource) return;

  const { supabase } = await requireAdmin();

  const { error } = await supabase.from(resource.table).delete().eq("id", id);
  if (error) throw new Error(describeDbError(error));

  revalidateSite();
  redirect(`/admin/${resource.key}`);
}

/**
 * Swaps a row with its neighbour and renumbers the whole list sequentially,
 * which also repairs any gaps left by earlier edits.
 */
export async function moveRecord(
  resourceKey: string,
  id: string,
  direction: "up" | "down",
): Promise<void> {
  const resource = getResource(resourceKey);
  if (!resource?.orderable) return;

  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from(resource.table)
    .select("id, display_order")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(describeDbError(error));

  const rows = (data ?? []) as Array<{ id: string }>;
  const index = rows.findIndex((row) => row.id === id);
  if (index === -1) return;

  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= rows.length) return;

  const reordered = [...rows];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

  await Promise.all(
    reordered.map((row, position) =>
      supabase
        .from(resource.table)
        .update({ display_order: position + 1 })
        .eq("id", row.id),
    ),
  );

  revalidateSite();
  redirect(`/admin/${resource.key}`);
}

/** Saves one of the single-record screens (about / settings). */
export async function saveSingleton(
  singletonKey: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const singleton = getSingleton(singletonKey);
  if (!singleton) return { error: "Unknown section." };

  const { supabase } = await requireAdmin();

  const { row, errors } = parseFields(singleton.fields, formData);
  if (errors.length > 0) return { error: errors.join(" ") };

  const { error } = await supabase.from("site_settings").update(row).eq("id", 1);
  if (error) return { error: describeDbError(error) };

  revalidateSite();
  return { ok: true };
}

/* ------------------------------------------------------------------
   Message inbox
   ------------------------------------------------------------------ */

function revalidateInbox() {
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function setMessageRead(id: string, isRead: boolean): Promise<void> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
  if (error) throw new Error(describeDbError(error));

  revalidateInbox();
}

export async function deleteMessage(id: string): Promise<void> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw new Error(describeDbError(error));

  revalidateInbox();
}

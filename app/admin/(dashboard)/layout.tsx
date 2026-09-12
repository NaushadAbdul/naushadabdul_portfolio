import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin/guard";
import { countUnreadMessages, getSettingsRow } from "@/lib/admin/queries";
import { defaultSettings } from "@/lib/site";

/** Admin data must always be fresh — never cached. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { supabase, user } = await requireAdmin();

  const [settings, unreadCount] = await Promise.all([
    getSettingsRow(supabase),
    countUnreadMessages(supabase),
  ]);

  const initials =
    typeof settings.initials === "string" && settings.initials.trim()
      ? settings.initials.trim()
      : defaultSettings.initials;

  return (
    <AdminShell email={user.email ?? ""} initials={initials} unreadCount={unreadCount}>
      {children}
    </AdminShell>
  );
}

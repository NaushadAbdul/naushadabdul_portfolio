import { ActionForm } from "@/components/admin/action-form";
import { AddAdminForm } from "@/components/admin/add-admin-form";
import { PageHeader } from "@/components/admin/page-header";
import { SetupNotice } from "@/components/admin/setup-notice";
import { revokeAdmin } from "@/lib/admin/admin-users";
import { formatDateTime, formatRelative } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/guard";
import { listAdmins } from "@/lib/admin/queries";
import { hasServiceRoleKey } from "@/lib/supabase/admin";

const DESCRIPTION =
  "Who can sign in here and change the site. Anyone on this list can edit every page, read the inbox and manage other admins — so keep it short.";

export default async function AdminsPage() {
  const { supabase } = await requireAdmin();
  const { admins, error } = await listAdmins(supabase);

  if (error) {
    return (
      <>
        <PageHeader title="Admins" description={DESCRIPTION} accent="purple" />
        <SetupNotice
          title="Admin management is not set up yet"
          message={error}
          file="supabase/admin-users.sql"
        />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Admins" description={DESCRIPTION} accent="purple" />

      <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        {/* ---- current admins ---- */}
        <div>
          <h2 className="mb-4 font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-ink/55">
            Current admins ({admins.length})
          </h2>

          <div className="brut-border overflow-x-auto bg-paper shadow-brut">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b-[3px] border-ink bg-paper-dim">
                  <th scope="col" className="px-3 py-2.5 text-left font-mono text-[0.6rem] font-bold uppercase tracking-widest">
                    Account
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-left font-mono text-[0.6rem] font-bold uppercase tracking-widest">
                    Added
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-left font-mono text-[0.6rem] font-bold uppercase tracking-widest">
                    Last sign-in
                  </th>
                  <th scope="col" className="px-3 py-2.5 text-right font-mono text-[0.6rem] font-bold uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y-2 divide-ink/10">
                {admins.map((admin) => (
                  <tr key={admin.user_id} className="transition-colors hover:bg-brut-yellow/15">
                    <td className="px-3 py-2.5">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-medium break-all">{admin.email ?? admin.user_id}</span>
                        {admin.is_self ? (
                          <span className="brut-border-2 bg-brut-lime px-1.5 py-0.5 font-mono text-[0.55rem] font-bold uppercase tracking-widest">
                            You
                          </span>
                        ) : null}
                      </span>
                    </td>

                    <td className="px-3 py-2.5 font-mono text-[0.65rem] text-ink/60">
                      {formatDateTime(admin.added_at)}
                    </td>

                    <td className="px-3 py-2.5 font-mono text-[0.65rem] text-ink/60">
                      {admin.last_sign_in_at ? formatRelative(admin.last_sign_in_at) : "never"}
                    </td>

                    <td className="px-3 py-2.5 text-right">
                      {admin.is_self ? (
                        <span
                          className="font-mono text-[0.6rem] tracking-wide text-ink/30"
                          title="You cannot remove your own access"
                        >
                          —
                        </span>
                      ) : (
                        <ActionForm
                          action={revokeAdmin.bind(null, admin.user_id)}
                          confirm={`Remove admin access for ${admin.email ?? admin.user_id}? They will be signed out and locked out of /admin.`}
                        >
                          <button
                            type="submit"
                            className="brut-border-2 bg-brut-pink px-2.5 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-widest transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
                          >
                            Remove
                          </button>
                        </ActionForm>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 font-mono text-[0.65rem] leading-relaxed tracking-wide text-ink/45">
            You cannot remove your own access. The database also rejects any deletion that would
            empty the list, so there is no way to lock everyone out from here.
          </p>
        </div>

        {/* ---- add ---- */}
        <div>
          <h2 className="mb-4 font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-ink/55">
            Grant access
          </h2>

          <AddAdminForm canCreateAccounts={hasServiceRoleKey} />
        </div>
      </div>
    </>
  );
}

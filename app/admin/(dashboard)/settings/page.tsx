import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ResourceForm } from "@/components/admin/resource-form";
import { saveSingleton } from "@/lib/admin/actions";
import { formatDateTime } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/guard";
import { getSettingsRow } from "@/lib/admin/queries";
import { getSingleton } from "@/lib/admin/resources";

export default async function SettingsAdminPage() {
  const singleton = getSingleton("settings");
  if (!singleton) notFound();

  const { supabase } = await requireAdmin();
  const settings = await getSettingsRow(supabase);

  const resumeUrl = typeof settings.resume_url === "string" ? settings.resume_url : null;

  return (
    <>
      <PageHeader
        title="Settings"
        description={`${singleton.description} Last saved ${formatDateTime(settings.updated_at as string)}.`}
        accent={singleton.accent}
        action={
          <a
            href="/"
            target="_blank"
            rel="noreferrer noopener"
            className="border-b-[3px] border-ink font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-brut-yellow"
          >
            View on site ↗
          </a>
        }
      />

      <div className="max-w-3xl">
        <ResourceForm
          fields={singleton.fields}
          initial={settings}
          action={saveSingleton.bind(null, "settings")}
          submitLabel="Save settings"
          cancelHref="/admin"
        />

        {resumeUrl ? (
          <p className="mt-6 font-mono text-[0.65rem] leading-relaxed tracking-wide text-ink/55">
            Résumé is live at{" "}
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="border-b-2 border-ink/40 break-all transition-colors hover:border-ink hover:bg-brut-yellow"
            >
              {resumeUrl}
            </a>
            {" "}— the hero and footer link to it automatically.
          </p>
        ) : (
          <p className="mt-6 font-mono text-[0.65rem] tracking-wide text-ink/45">
            No résumé uploaded, so the download links are hidden on the public site.
          </p>
        )}
      </div>
    </>
  );
}

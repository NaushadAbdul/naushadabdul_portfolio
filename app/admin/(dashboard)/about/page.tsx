import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ResourceForm } from "@/components/admin/resource-form";
import { saveSingleton } from "@/lib/admin/actions";
import { formatDateTime } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/guard";
import { getSettingsRow } from "@/lib/admin/queries";
import { getSingleton } from "@/lib/admin/resources";

export default async function AboutAdminPage() {
  const singleton = getSingleton("about");
  if (!singleton) notFound();

  const { supabase } = await requireAdmin();
  const settings = await getSettingsRow(supabase);

  return (
    <>
      <PageHeader
        title="About"
        description={`${singleton.description} Last saved ${formatDateTime(settings.updated_at as string)}.`}
        accent={singleton.accent}
        action={
          <a
            href="/#about"
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
          action={saveSingleton.bind(null, "about")}
          submitLabel="Save about"
          cancelHref="/admin"
        />
      </div>
    </>
  );
}

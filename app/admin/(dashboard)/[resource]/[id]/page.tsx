import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/action-form";
import { PageHeader } from "@/components/admin/page-header";
import { ResourceForm } from "@/components/admin/resource-form";
import { deleteRecord, updateRecord } from "@/lib/admin/actions";
import { formatDateTime } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/guard";
import { getResourceRow } from "@/lib/admin/queries";
import { getResource } from "@/lib/admin/resources";

type PageProps = {
  params: Promise<{ resource: string; id: string }>;
};

export default async function EditResourcePage({ params }: PageProps) {
  const { resource: resourceKey, id } = await params;
  const resource = getResource(resourceKey);

  if (!resource) notFound();

  const { supabase } = await requireAdmin();
  const row = await getResourceRow(supabase, resource, id);

  if (!row) notFound();

  const title = String(row[resource.titleField] ?? `Edit ${resource.singular}`);

  return (
    <>
      <PageHeader
        title={title}
        description={`Editing ${resource.singular.toLowerCase()} · created ${formatDateTime(row.created_at as string)} · updated ${formatDateTime(row.updated_at as string)}`}
        accent={resource.accent}
        action={
          <a
            href={`/admin/${resource.key}`}
            className="border-b-[3px] border-ink font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-brut-yellow"
          >
            ← Back to {resource.label}
          </a>
        }
      />

      <div className="max-w-3xl">
        <ResourceForm
          fields={resource.fields}
          initial={row}
          action={updateRecord.bind(null, resource.key, id)}
          submitLabel="Save changes"
          cancelHref={`/admin/${resource.key}`}
        />

        <div className="mt-10 border-t-[3px] border-ink pt-6">
          <h2 className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-ink/55">
            Danger zone
          </h2>
          <div className="mt-4">
            <ActionForm
              action={deleteRecord.bind(null, resource.key, id)}
              confirm={`Delete "${title}"? This cannot be undone.`}
            >
              <button
                type="submit"
                className="brut-border bg-brut-pink px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-widest shadow-brut transition-transform hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-none"
              >
                Delete this {resource.singular.toLowerCase()}
              </button>
            </ActionForm>
          </div>
        </div>
      </div>
    </>
  );
}

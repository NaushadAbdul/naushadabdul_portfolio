import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ResourceForm } from "@/components/admin/resource-form";
import { createRecord } from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin/guard";
import { getResource } from "@/lib/admin/resources";

type PageProps = {
  params: Promise<{ resource: string }>;
};

export default async function NewResourcePage({ params }: PageProps) {
  const { resource: resourceKey } = await params;
  const resource = getResource(resourceKey);

  if (!resource) notFound();

  await requireAdmin();

  return (
    <>
      <PageHeader
        title={`New ${resource.singular}`}
        description={`Adds a row to ${resource.label.toLowerCase()} and puts it at the end of the order.`}
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
          action={createRecord.bind(null, resource.key)}
          submitLabel={`Create ${resource.singular}`}
          cancelHref={`/admin/${resource.key}`}
        />
      </div>
    </>
  );
}

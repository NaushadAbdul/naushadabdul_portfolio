import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/action-form";
import { PageHeader } from "@/components/admin/page-header";
import { SetupNotice } from "@/components/admin/setup-notice";
import { Button } from "@/components/ui/button";
import { deleteRecord, moveRecord } from "@/lib/admin/actions";
import { previewText } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/guard";
import { listResourceRows, type Row } from "@/lib/admin/queries";
import { getResource, type ColumnSpec, type ResourceSpec } from "@/lib/admin/resources";
import { accentStyle, cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ resource: string }>;
};

function Cell({ row, column, resource }: { row: Row; column: ColumnSpec; resource: ResourceSpec }) {
  const value = row[column.name];

  if (column.type === "boolean") {
    return value ? (
      <span className="brut-border-2 bg-brut-lime px-1.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase">
        Yes
      </span>
    ) : (
      <span className="font-mono text-[0.6rem] text-ink/35">—</span>
    );
  }

  if (column.type === "accent") {
    const accent = accentStyle(typeof value === "string" ? value : null);
    return (
      <span className="flex items-center gap-2">
        <span aria-hidden="true" className={cn("size-4 border-2 border-ink", accent.bg)} />
        <span className="font-mono text-[0.65rem] tracking-wide text-ink/60">{String(value ?? "—")}</span>
      </span>
    );
  }

  if (column.type === "number") {
    return <span className="font-mono text-xs">{String(value ?? 0)}</span>;
  }

  const isTitle = column.name === resource.titleField;
  const text = previewText(value, 70) || "—";

  if (isTitle) {
    return (
      <a
        href={`/admin/${resource.key}/${String(row.id)}`}
        className="font-medium underline decoration-2 underline-offset-4 transition-colors hover:bg-brut-yellow"
      >
        {text}
      </a>
    );
  }

  return <span className="text-ink/70">{text}</span>;
}

export default async function ResourceListPage({ params }: PageProps) {
  const { resource: resourceKey } = await params;
  const resource = getResource(resourceKey);

  // Unknown URL segments must 404 rather than reach a query builder.
  if (!resource) notFound();

  const { supabase } = await requireAdmin();

  let rows: Row[] = [];
  let loadError: string | null = null;

  try {
    rows = await listResourceRows(supabase, resource);
  } catch (cause) {
    loadError = cause instanceof Error ? cause.message : "Could not load rows.";
  }

  // A missing table is far more likely than a real outage, so explain it
  // rather than letting a raw Postgres error reach the error boundary.
  if (loadError) {
    return (
      <>
        <PageHeader
          title={resource.label}
          description={resource.description}
          accent={resource.accent}
        />
        <SetupNotice
          title={`Could not load ${resource.label.toLowerCase()}`}
          message={loadError}
          file="supabase/admin.sql"
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={resource.label}
        description={resource.description}
        accent={resource.accent}
        action={
          <Button href={`/admin/${resource.key}/new`} variant="accent" accent={resource.accent}>
            New {resource.singular}
          </Button>
        }
      />

      {rows.length === 0 ? (
        <div className="brut-border bg-paper p-10 text-center shadow-brut-sm">
          <p className="font-display text-xl uppercase">Nothing here yet</p>
          <p className="mx-auto mt-2 max-w-md font-mono text-[0.7rem] leading-relaxed text-ink/55">
            The public site is showing the built-in sample content until you add your first{" "}
            {resource.singular.toLowerCase()}.
          </p>
          <div className="mt-6 flex justify-center">
            <Button href={`/admin/${resource.key}/new`} variant="accent" accent={resource.accent}>
              Add {resource.singular}
            </Button>
          </div>
        </div>
      ) : (
        <div className="brut-border overflow-x-auto bg-paper shadow-brut">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b-[3px] border-ink bg-paper-dim">
                {resource.orderable ? (
                  <th scope="col" className="w-20 px-3 py-2.5 text-left font-mono text-[0.6rem] font-bold uppercase tracking-widest">
                    Order
                  </th>
                ) : null}

                {resource.columns.map((column) => (
                  <th
                    key={column.name}
                    scope="col"
                    className="px-3 py-2.5 text-left font-mono text-[0.6rem] font-bold uppercase tracking-widest"
                  >
                    {column.label}
                  </th>
                ))}

                <th scope="col" className="px-3 py-2.5 text-right font-mono text-[0.6rem] font-bold uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-ink/10">
              {rows.map((row, index) => {
                const id = String(row.id);

                return (
                  <tr key={id} className="transition-colors hover:bg-brut-yellow/15">
                    {resource.orderable ? (
                      <td className="px-3 py-2">
                        <div className="flex gap-1">
                          <ActionForm action={moveRecord.bind(null, resource.key, id, "up")}>
                            <button
                              type="submit"
                              disabled={index === 0}
                              aria-label={`Move ${resource.singular} up`}
                              className="brut-border-2 size-7 bg-paper font-mono text-xs leading-none transition-transform hover:translate-x-0.5 hover:translate-y-0.5 disabled:pointer-events-none disabled:opacity-25"
                            >
                              ↑
                            </button>
                          </ActionForm>

                          <ActionForm action={moveRecord.bind(null, resource.key, id, "down")}>
                            <button
                              type="submit"
                              disabled={index === rows.length - 1}
                              aria-label={`Move ${resource.singular} down`}
                              className="brut-border-2 size-7 bg-paper font-mono text-xs leading-none transition-transform hover:translate-x-0.5 hover:translate-y-0.5 disabled:pointer-events-none disabled:opacity-25"
                            >
                              ↓
                            </button>
                          </ActionForm>
                        </div>
                      </td>
                    ) : null}

                    {resource.columns.map((column) => (
                      <td key={column.name} className="px-3 py-2.5">
                        <Cell row={row} column={column} resource={resource} />
                      </td>
                    ))}

                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-end gap-3">
                        <a
                          href={`/admin/${resource.key}/${id}`}
                          className="font-mono text-[0.65rem] font-bold uppercase tracking-widest underline decoration-2 underline-offset-4 transition-colors hover:bg-brut-yellow"
                        >
                          Edit
                        </a>

                        <ActionForm
                          action={deleteRecord.bind(null, resource.key, id)}
                          confirm={`Delete "${String(row[resource.titleField] ?? "this row")}"? This cannot be undone.`}
                        >
                          <button
                            type="submit"
                            className="brut-border-2 bg-brut-pink px-2 py-1 font-mono text-[0.6rem] font-bold uppercase tracking-widest transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
                          >
                            Delete
                          </button>
                        </ActionForm>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-5 font-mono text-[0.65rem] tracking-wide text-ink/45">
        {rows.length} row{rows.length === 1 ? "" : "s"}
        {resource.orderable ? " · order controls the sequence on the public site" : ""}
      </p>
    </>
  );
}

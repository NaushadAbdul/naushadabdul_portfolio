"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/lib/admin/action-state";
import type { FieldSpec } from "@/lib/admin/resources";
import { getBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

type ServerAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

type ResourceFormProps = {
  fields: FieldSpec[];
  /** Existing row values, used to seed the inputs. */
  initial?: Record<string, unknown>;
  action: ServerAction;
  submitLabel: string;
  cancelHref: string;
};

const INPUT_CLASSES =
  "brut-border-2 w-full bg-paper px-3 py-2.5 text-sm transition-shadow duration-100 placeholder:text-ink/35 focus:shadow-brut-xs";

const LABEL_CLASSES =
  "mb-1.5 block font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em]";

/* ------------------------------------------------------------------
   Upload control
   ------------------------------------------------------------------ */

type UploadFieldProps = {
  field: FieldSpec;
  defaultValue: string;
};

/**
 * Uploads to Supabase Storage from the browser, then keeps the resulting public
 * URL in a hidden input so the server action only ever receives a string.
 *
 * The URL is also editable by hand, so an image hosted elsewhere can be pasted
 * in without uploading a duplicate.
 */
function UploadField({ field, defaultValue }: UploadFieldProps) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bucket = field.bucket ?? "media";
  const isImage = field.type === "image";

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setError(null);

    try {
      const supabase = getBrowserClient();
      if (!supabase) throw new Error("Supabase is not configured. Please refresh the page.");

      const extension = file.name.split(".").pop()?.toLowerCase() ?? "bin";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { cacheControl: "31536000", upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  return (
    <div className="brut-border-2 bg-paper p-3">
      <input type="hidden" name={field.name} value={url} />

      <div className="flex items-start gap-4">
        {isImage ? (
          url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt=""
              className="brut-border-2 size-20 shrink-0 object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="brut-border-2 dots-ink flex size-20 shrink-0 items-center justify-center bg-paper-dim font-mono text-[0.6rem] text-ink/50"
            >
              none
            </span>
          )
        ) : null}

        <div className="min-w-0 flex-1">
          <label className="brut-border-2 inline-flex cursor-pointer items-center gap-2 bg-brut-lime px-3 py-1.5 font-mono text-[0.65rem] font-bold uppercase tracking-widest shadow-brut-xs transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
            {busy ? "Uploading…" : url ? "Replace file" : "Choose file"}
            <input
              type="file"
              accept={field.accept ?? (isImage ? "image/*" : undefined)}
              onChange={handleFile}
              disabled={busy}
              className="sr-only"
            />
          </label>

          <input
            type="text"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="…or paste a URL"
            className={cn(INPUT_CLASSES, "mt-2")}
            aria-label={`${field.label} URL`}
          />

          {url ? (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="mt-2 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-ink/50 underline hover:text-ink"
            >
              Clear
            </button>
          ) : null}

          {error ? (
            <p className="mt-2 font-mono text-[0.65rem] font-bold text-brut-pink">✕ {error}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Single field
   ------------------------------------------------------------------ */

function FieldControl({ field, value }: { field: FieldSpec; value: unknown }) {
  if (field.type === "boolean") {
    return (
      <label className="brut-border-2 flex cursor-pointer items-center gap-3 bg-paper px-3 py-2.5">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={Boolean(value)}
          className="size-5 shrink-0 accent-[#0a0a0a]"
        />
        <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.18em]">{field.label}</span>
      </label>
    );
  }

  return (
    <>
      <label htmlFor={field.name} className={LABEL_CLASSES}>
        {field.label}
        {field.required ? <span className="ml-1 text-brut-pink">*</span> : null}
      </label>

      {field.type === "textarea" ? (
        <textarea
          id={field.name}
          name={field.name}
          rows={field.rows ?? 4}
          defaultValue={String(value ?? "")}
          placeholder={field.placeholder}
          className={cn(INPUT_CLASSES, "resize-y")}
        />
      ) : field.type === "select" ? (
        <select
          id={field.name}
          name={field.name}
          defaultValue={String(value ?? field.options?.[0] ?? "")}
          className={INPUT_CLASSES}
        >
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : field.type === "list" ? (
        <textarea
          id={field.name}
          name={field.name}
          rows={2}
          defaultValue={Array.isArray(value) ? value.join(", ") : String(value ?? "")}
          placeholder={field.placeholder}
          className={cn(INPUT_CLASSES, "resize-y")}
        />
      ) : field.type === "image" || field.type === "file" ? (
        <UploadField field={field} defaultValue={String(value ?? "")} />
      ) : (
        <input
          id={field.name}
          name={field.name}
          type={field.type === "number" ? "number" : field.type === "url" ? "url" : "text"}
          min={field.min}
          max={field.max}
          defaultValue={String(value ?? "")}
          placeholder={field.placeholder}
          className={INPUT_CLASSES}
        />
      )}

      {field.help ? (
        <p className="mt-1.5 font-mono text-[0.6rem] leading-relaxed tracking-wide text-ink/50">
          {field.help}
        </p>
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------------
   Form
   ------------------------------------------------------------------ */

export function ResourceForm({
  fields,
  initial = {},
  action,
  submitLabel,
  cancelHref,
}: ResourceFormProps) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error ? (
        <p role="alert" className="brut-border-2 bg-brut-pink px-4 py-3 font-mono text-xs font-bold">
          ✕ {state.error}
        </p>
      ) : null}

      {state?.ok ? (
        <p role="status" className="brut-border-2 bg-brut-lime px-4 py-3 font-mono text-xs font-bold">
          ✓ Saved
        </p>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={cn(field.wide && "md:col-span-2")}>
            <FieldControl field={field} value={initial[field.name]} />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t-[3px] border-ink pt-6">
        <Button type="submit" disabled={pending} variant="accent" accent="lime" size="lg">
          {pending ? "Saving…" : submitLabel}
        </Button>
        <Button href={cancelHref} variant="outline" size="lg">
          Cancel
        </Button>
      </div>
    </form>
  );
}

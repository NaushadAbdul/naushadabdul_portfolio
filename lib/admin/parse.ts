import type { FieldSpec } from "./resources";

/** Turns "Nexus Docs Copilot!" into "nexus-docs-copilot". */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type ParsedForm = {
  row: Record<string, unknown>;
  errors: string[];
};

/**
 * Coerces a submitted FormData into a database row using the field specs.
 *
 * Only keys present in `fields` end up in the row, which means a crafted form
 * post cannot smuggle extra columns such as `id` or `display_order` into the
 * write. Unchecked checkboxes are absent from FormData, so booleans are read as
 * "present and on" rather than parsed.
 */
export function parseFields(fields: FieldSpec[], formData: FormData): ParsedForm {
  const row: Record<string, unknown> = {};
  const errors: string[] = [];

  for (const field of fields) {
    const raw = formData.get(field.name);

    switch (field.type) {
      case "boolean": {
        row[field.name] = raw === "on" || raw === "true";
        break;
      }

      case "number": {
        const text = String(raw ?? "").trim();
        const value = text === "" ? (field.min ?? 0) : Number(text);

        if (!Number.isFinite(value)) {
          errors.push(`${field.label} must be a number.`);
          break;
        }
        if (field.min !== undefined && value < field.min) {
          errors.push(`${field.label} must be at least ${field.min}.`);
          break;
        }
        if (field.max !== undefined && value > field.max) {
          errors.push(`${field.label} must be at most ${field.max}.`);
          break;
        }

        row[field.name] = value;
        break;
      }

      case "list": {
        row[field.name] = String(raw ?? "")
          .split(/[\n,]/)
          .map((item) => item.trim())
          .filter(Boolean);
        break;
      }

      case "url":
      case "image":
      case "file": {
        const value = String(raw ?? "").trim();

        if (value !== "" && !/^https?:\/\//i.test(value)) {
          errors.push(`${field.label} must start with http:// or https://`);
          break;
        }

        row[field.name] = value === "" ? null : value;
        break;
      }

      default: {
        const value = String(raw ?? "").trim();

        if (field.required && value === "") {
          errors.push(`${field.label} is required.`);
        }
        if (field.options && value !== "" && !field.options.includes(value)) {
          errors.push(`${field.label} has an invalid value.`);
        }

        row[field.name] = value;
        break;
      }
    }
  }

  return { row, errors };
}

/** Maps a Postgres error onto something worth showing a human. */
export function describeDbError(error: { code?: string; message: string }): string {
  switch (error.code) {
    case "23505":
      return "That value already exists — the slug must be unique.";
    case "23514":
      return "A value is outside the allowed range.";
    case "23502":
      return "A required field was left empty.";
    case "42501":
      return "Your session is not allowed to make this change. Sign in again.";
    case "42P01":
      return "That table does not exist yet. Run supabase/admin.sql.";
    case "PGRST116":
      return "That record no longer exists.";
    default:
      return error.message;
  }
}

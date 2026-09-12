"use client";

import type { ReactNode } from "react";

type ActionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
  /** Shows a native confirmation prompt before submitting. */
  confirm?: string;
  className?: string;
};

/**
 * Thin wrapper for the fire-and-forget server actions (delete, reorder,
 * mark read).
 *
 * A client component is needed only so the optional confirmation prompt can run
 * client-side; the action itself stays on the server.
 */
export function ActionForm({ action, children, confirm, className }: ActionFormProps) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(event) => {
        if (confirm && !window.confirm(confirm)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </form>
  );
}

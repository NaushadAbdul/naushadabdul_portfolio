"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { addAdmin } from "@/lib/admin/admin-users";

const INPUT_CLASSES =
  "brut-border-2 w-full bg-paper px-3 py-2.5 text-sm transition-shadow duration-100 placeholder:text-ink/35 focus:shadow-brut-xs";

type AddAdminFormProps = {
  /** False when SUPABASE_SERVICE_ROLE_KEY is absent. */
  canCreateAccounts: boolean;
};

export function AddAdminForm({ canCreateAccounts }: AddAdminFormProps) {
  const [state, formAction, pending] = useActionState(addAdmin, null);
  const [createAccount, setCreateAccount] = useState(false);

  return (
    <form action={formAction} className="brut-border bg-paper p-5 shadow-brut md:p-6">
      <h2 className="border-b-[3px] border-ink pb-3 text-xl uppercase">Add an admin</h2>

      {state?.error ? (
        <p role="alert" className="brut-border-2 mt-5 bg-brut-pink px-4 py-3 font-mono text-[0.7rem] leading-relaxed font-bold break-words">
          ✕ {state.error}
        </p>
      ) : null}

      {state?.ok ? (
        <p role="status" className="brut-border-2 mt-5 bg-brut-lime px-4 py-3 font-mono text-[0.7rem] font-bold">
          ✓ That account now has admin access.
        </p>
      ) : null}

      <div className="mt-5">
        <label htmlFor="admin-email" className="mb-1.5 block font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em]">
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="off"
          placeholder="someone@example.com"
          className={INPUT_CLASSES}
        />
      </div>

      <label className="brut-border-2 mt-5 flex cursor-pointer items-start gap-3 bg-paper p-3">
        <input
          type="checkbox"
          name="create_account"
          checked={createAccount}
          onChange={(event) => setCreateAccount(event.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-[#0a0a0a]"
        />
        <span>
          <span className="block font-mono text-[0.7rem] font-bold uppercase tracking-[0.15em]">
            Create a new account
          </span>
          <span className="mt-1 block font-mono text-[0.6rem] leading-relaxed text-ink/55">
            Off: grants admin to an account that already exists. On: also creates the account
            with the password below.
          </span>
        </span>
      </label>

      {createAccount ? (
        <div className="mt-4">
          <label htmlFor="admin-password" className="mb-1.5 block font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em]">
            Password
          </label>
          <input
            id="admin-password"
            name="password"
            type="text"
            minLength={8}
            placeholder="At least 8 characters"
            className={INPUT_CLASSES}
          />
          <p className="mt-1.5 font-mono text-[0.6rem] leading-relaxed tracking-wide text-ink/50">
            The account is created already confirmed, so this password works immediately.
            Share it over a channel you trust, and have them change it after signing in.
          </p>

          {!canCreateAccounts ? (
            <p className="brut-border-2 mt-3 bg-brut-orange px-3 py-2 font-mono text-[0.6rem] leading-relaxed font-bold">
              SUPABASE_SERVICE_ROLE_KEY is not set, so account creation will fail. Add it to
              .env.local and restart, or create the user in Supabase → Authentication → Users
              and grant them here instead.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 border-t-[3px] border-ink pt-5">
        <Button type="submit" disabled={pending} variant="accent" accent="lime" size="lg">
          {pending ? "Working…" : "Grant admin access"}
        </Button>
      </div>
    </form>
  );
}

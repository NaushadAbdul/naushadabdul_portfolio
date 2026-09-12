"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/lib/admin/action-state";
import { signIn } from "@/lib/admin/auth";

type LoginFormProps = {
  /** Validated server-side before redirecting; only /admin paths are accepted. */
  nextPath: string;
  initialError?: string;
};

export function LoginForm({ nextPath, initialError }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(
    signIn.bind(null, nextPath),
    (initialError ? { error: initialError } : null) as ActionState,
  );

  return (
    <form action={formAction} className="brut-border bg-paper p-5 sm:p-6 md:p-8 shadow-brut sm:shadow-brut-lg w-full">
      <div className="mb-5 sm:mb-6 border-b-[3px] border-ink pb-3">
        <h1 className="text-2xl sm:text-3xl uppercase font-extrabold tracking-tight">Sign in</h1>
        <p className="mt-1 font-mono text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-ink/60">
          Administrator access only
        </p>
      </div>

      {state?.error ? (
        <p
          role="alert"
          className="brut-border-2 mb-4 sm:mb-5 bg-brut-pink px-3.5 py-2.5 sm:px-4 sm:py-3 font-mono text-[0.65rem] sm:text-[0.7rem] leading-relaxed font-bold"
        >
          ✕ {state.error}
        </p>
      ) : null}

      <div className="space-y-3.5 sm:space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block font-mono text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.16em] sm:tracking-[0.18em]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="brut-border-2 w-full bg-paper px-3 py-2.5 text-base sm:text-sm transition-shadow duration-100 placeholder:text-ink/35 focus:shadow-brut-xs"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block font-mono text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[0.16em] sm:tracking-[0.18em]">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="brut-border-2 w-full bg-paper px-3 py-2.5 text-base sm:text-sm transition-shadow duration-100 placeholder:text-ink/35 focus:shadow-brut-xs"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={pending}
        variant="accent"
        accent="lime"
        size="lg"
        className="mt-5 sm:mt-6 w-full py-3 sm:py-4 text-sm sm:text-base md:text-lg"
      >
        {pending ? "Signing in…" : "Sign in"}
        {!pending && <span aria-hidden="true">→</span>}
      </Button>

      <p className="mt-4 sm:mt-5 font-mono text-[0.55rem] sm:text-[0.6rem] leading-relaxed tracking-wide text-ink/50">
        Accounts are created in Supabase, not here. See the bottom of{" "}
        <span className="font-bold">supabase/admin.sql</span> for the one-time setup.
      </p>
    </form>
  );
}

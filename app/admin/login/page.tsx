import type { Metadata } from "next";
import { ConcentricRings, Starburst } from "@/components/hero-graphics";
import { LoginForm } from "@/components/admin/login-form";
import { getMissingSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  forbidden:
    "That account is not an administrator yet. Run the bootstrap SQL at the bottom of supabase/admin.sql to grant it access.",
  config: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and your publishable key, then restart the server.",
  setup:
    "The admin tables do not exist yet. Run supabase/admin.sql in the Supabase SQL Editor, then sign in again.",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const initialError = params.error ? ERROR_MESSAGES[params.error] : undefined;
  const missingEnv = getMissingSupabaseEnv();

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden px-3.5 py-10 sm:px-6 sm:py-16 md:py-20">
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden="true">
        <Starburst className="absolute -top-12 -right-16 size-44 sm:-top-16 sm:-right-20 sm:size-64 md:size-96 animate-spin-slow opacity-60 sm:opacity-70" />
        <ConcentricRings className="absolute -bottom-16 -left-16 size-48 sm:-bottom-24 sm:-left-24 sm:size-72 md:size-96 opacity-50 sm:opacity-60" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        {!isSupabaseConfigured ? (
          <div className="brut-border-2 mb-4 sm:mb-5 bg-brut-orange px-3.5 py-2.5 sm:px-4 sm:py-3 font-mono text-[0.65rem] sm:text-[0.7rem] leading-relaxed font-bold">
            <p>Supabase is not configured — sign-in will not work until the environment variables are set.</p>
            {missingEnv.length > 0 && (
              <p className="mt-1 font-semibold text-ink/85">Missing: {missingEnv.join(", ")}</p>
            )}
          </div>
        ) : null}

        <LoginForm nextPath={params.next ?? "/admin"} initialError={initialError} />

        <p className="mt-5 sm:mt-6 text-center">
          <a
            href="/"
            className="inline-block border-b-[3px] border-ink font-mono text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] transition-colors hover:bg-brut-yellow py-0.5"
          >
            ← Back to site
          </a>
        </p>
      </div>
    </main>
  );
}

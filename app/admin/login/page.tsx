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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
        <Starburst className="absolute -top-16 -right-20 size-64 animate-spin-slow opacity-70 md:size-96" />
        <ConcentricRings className="absolute -bottom-24 -left-24 size-72 opacity-60 md:size-96" />
      </div>

      <div className="relative w-full max-w-md">
        {!isSupabaseConfigured ? (
          <div className="brut-border-2 mb-5 bg-brut-orange px-4 py-3 font-mono text-[0.7rem] leading-relaxed font-bold">
            <p>Supabase is not configured — sign-in will not work until the environment variables are set.</p>
            {missingEnv.length > 0 && (
              <p className="mt-1 font-semibold text-ink/85">Missing: {missingEnv.join(", ")}</p>
            )}
          </div>
        ) : null}

        <LoginForm nextPath={params.next ?? "/admin"} initialError={initialError} />

        <p className="mt-6 text-center">
          <a
            href="/"
            className="border-b-[3px] border-ink font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-brut-yellow"
          >
            ← Back to site
          </a>
        </p>
      </div>
    </main>
  );
}

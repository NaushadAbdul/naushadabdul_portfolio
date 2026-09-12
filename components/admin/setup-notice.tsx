type SetupNoticeProps = {
  title: string;
  message: string;
  /** SQL file the user needs to run in the Supabase SQL Editor. */
  file?: string;
};

/**
 * Shown instead of a raw Postgres error when the database is not set up yet.
 *
 * A missing table is the single most likely reason a fresh install breaks, and
 * "relation public.x does not exist" tells the user nothing actionable.
 */
export function SetupNotice({ title, message, file }: SetupNoticeProps) {
  return (
    <div className="brut-border bg-brut-orange p-6 shadow-brut md:p-8">
      <span aria-hidden="true" className="mb-5 block h-2.5 w-16 border-2 border-ink bg-paper" />

      <h2 className="text-2xl uppercase md:text-3xl">{title}</h2>

      <p className="mt-3 max-w-2xl text-sm leading-relaxed break-words">{message}</p>

      {file ? (
        <p className="mt-6 font-mono text-[0.7rem] font-bold uppercase tracking-[0.18em]">
          Run{" "}
          <code className="brut-border-2 bg-paper px-2 py-1 tracking-normal normal-case">
            {file}
          </code>{" "}
          in the Supabase SQL Editor, then reload this page.
        </p>
      ) : null}
    </div>
  );
}

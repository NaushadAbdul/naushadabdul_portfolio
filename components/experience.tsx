import { SectionHeading } from "@/components/ui/section-heading";
import type { Experience as ExperienceEntry } from "@/lib/types";
import { accentStyles, cn } from "@/lib/utils";

const ROLE_ACCENTS = ["orange", "blue", "pink", "lime", "yellow", "purple"] as const;

type ExperienceProps = {
  experience: ExperienceEntry[];
};

export function Experience({ experience }: ExperienceProps) {
  if (experience.length === 0) return null;

  return (
    <section id="experience" className="border-b-[3px] border-ink px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading index="03" kicker="Where I've worked" title="Experience" accent="orange" />

        <ol className="space-y-6">
          {experience.map((entry, index) => {
            const accent = accentStyles[ROLE_ACCENTS[index % ROLE_ACCENTS.length]];
            const period = entry.is_current
              ? `${entry.start_date} — Now`
              : [entry.start_date, entry.end_date].filter(Boolean).join(" — ");

            return (
              <li
                key={entry.id}
                className="brut-border grid gap-5 bg-paper p-5 shadow-brut transition-[transform,box-shadow] duration-100 ease-out hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-none md:grid-cols-[13rem_1fr] md:gap-8 md:p-7"
              >
                {/* ---- period rail ---- */}
                <div className="flex items-start gap-4 md:flex-col md:gap-4">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "brut-border-2 flex size-12 shrink-0 items-center justify-center font-mono text-sm font-bold md:size-16",
                      accent.bg,
                      accent.on,
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="brut-border-2 bg-paper px-2.5 py-1 font-mono text-[0.65rem] font-bold tracking-wider uppercase">
                      {period}
                    </span>
                    {entry.is_current ? (
                      <span className="brut-border-2 flex items-center gap-1.5 bg-brut-lime px-2.5 py-1 font-mono text-[0.65rem] font-bold tracking-wider uppercase">
                        <span className="size-1.5 animate-blink rounded-full bg-ink" aria-hidden="true" />
                        Current
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* ---- detail ---- */}
                <div>
                  <h3 className="text-2xl uppercase md:text-3xl">{entry.role}</h3>

                  <p className="mt-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-ink/70">
                    {entry.company_url ? (
                      <a
                        href={entry.company_url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="border-b-2 border-ink/40 transition-colors hover:border-ink"
                      >
                        {entry.company}
                      </a>
                    ) : (
                      entry.company
                    )}
                    {entry.location ? <span className="text-ink/45"> · {entry.location}</span> : null}
                  </p>

                  {entry.description ? (
                    <p className="mt-4 text-sm leading-relaxed text-ink/75 md:text-base">
                      {entry.description}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

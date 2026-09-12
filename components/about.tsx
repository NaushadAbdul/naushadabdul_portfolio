import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Sticker } from "@/components/ui/sticker";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

/** The three disciplines, shown as a colour-coded stack. */
const DISCIPLINES = [
  {
    label: "AI",
    detail: "LLM features, retrieval over your own data, agents with guardrails and evals.",
    chip: "bg-brut-yellow",
  },
  {
    label: "Web",
    detail: "Typed full-stack Next.js products that stay maintainable after launch.",
    chip: "bg-brut-blue",
  },
  {
    label: "Automation",
    detail: "Scheduled jobs and integrations that delete manual busywork for good.",
    chip: "bg-brut-pink",
  },
] as const;

type AboutProps = {
  settings: SiteSettings;
};

export function About({ settings }: AboutProps) {
  // Blank lines in the bio become separate paragraphs.
  const paragraphs = settings.bio
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const facts = [
    { label: "Based in", value: settings.location },
    { label: "Focus", value: settings.focus },
    { label: "Status", value: settings.availability },
    { label: "Email", value: settings.email },
  ];

  return (
    <section id="about" className="border-b-[3px] border-ink px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading index="01" kicker="Who I am" title="About" accent="lime" />

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* ---- narrative ---- */}
          <div>
            <p className="text-2xl leading-snug font-medium md:text-3xl">
              I&apos;m {settings.full_name} — a developer who likes the unglamorous part: making
              software that keeps working once the demo is over.
            </p>

            <div className="mt-7 space-y-5 text-base leading-relaxed text-ink/75 md:text-lg">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Sticker accent="lime" rotate={-2}>
                Ships, then iterates
              </Sticker>
              <Sticker accent="blue" rotate={2}>
                Documents everything
              </Sticker>
            </div>
          </div>

          {/* ---- disciplines + fact file ---- */}
          <div className="space-y-5">
            {DISCIPLINES.map((discipline, index) => (
              <div
                key={discipline.label}
                className="brut-border flex items-stretch gap-0 bg-paper shadow-brut-sm transition-[transform,box-shadow] duration-100 ease-out hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
              >
                <div
                  className={cn(
                    "flex w-16 shrink-0 items-center justify-center border-r-[3px] border-ink font-mono text-xs font-bold",
                    discipline.chip,
                  )}
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="p-4">
                  <h3 className="text-xl uppercase">{discipline.label}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/75">{discipline.detail}</p>
                </div>
              </div>
            ))}

            <Card accentBar="orange" className="p-5">
              <h3 className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.25em] text-ink/60">
                Fact file
              </h3>
              <dl className="mt-4 divide-y-2 divide-dashed divide-ink/25">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="font-mono text-[0.7rem] font-bold uppercase tracking-widest text-ink/60">
                      {fact.label}
                    </dt>
                    <dd className="text-right text-sm font-medium break-all">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

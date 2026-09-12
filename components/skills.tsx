import { SectionHeading } from "@/components/ui/section-heading";
import type { Skill } from "@/lib/types";
import { accentStyles, cn } from "@/lib/utils";

/** Each category card takes the next colour in the palette. */
const CATEGORY_ACCENTS = ["yellow", "blue", "pink", "lime", "orange", "purple"] as const;

const LEVELS = [1, 2, 3, 4, 5];

type SkillsProps = {
  skills: Skill[];
};

/** Groups skills by category, preserving the order rows arrive in. */
function groupByCategory(skills: Skill[]) {
  const groups = new Map<string, Skill[]>();

  for (const skill of skills) {
    const existing = groups.get(skill.category);

    if (existing) {
      existing.push(skill);
    } else {
      groups.set(skill.category, [skill]);
    }
  }

  return [...groups.entries()];
}

export function Skills({ skills }: SkillsProps) {
  if (skills.length === 0) return null;

  const groups = groupByCategory(skills);

  return (
    <section id="skills" className="border-b-[3px] border-ink px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading index="02" kicker="Toolkit" title="Skills" accent="yellow" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map(([category, items], groupIndex) => {
            const accent = accentStyles[CATEGORY_ACCENTS[groupIndex % CATEGORY_ACCENTS.length]];

            return (
              <div key={category} className="brut-border bg-paper shadow-brut">
                <div
                  className={cn(
                    "flex items-center justify-between border-b-[3px] border-ink px-4 py-3",
                    accent.bg,
                  )}
                >
                  <h3 className={cn("font-display text-lg uppercase", accent.on)}>{category}</h3>
                  <span className={cn("font-mono text-[0.65rem] font-bold opacity-70", accent.on)}>
                    {String(items.length).padStart(2, "0")}
                  </span>
                </div>

                <ul className="divide-y-2 divide-dashed divide-ink/20 p-4">
                  {items.map((skill) => (
                    <li key={skill.id} className="flex items-center justify-between gap-4 py-2.5">
                      <span className="text-sm font-medium">{skill.name}</span>

                      <span className="flex shrink-0 items-center gap-2">
                        <span className="flex gap-1" aria-hidden="true">
                          {LEVELS.map((step) => (
                            <span
                              key={step}
                              className={cn(
                                "h-3.5 w-2.5 border-2 border-ink",
                                step <= skill.level ? accent.bg : "bg-paper",
                              )}
                            />
                          ))}
                        </span>
                        <span className="sr-only">
                          {skill.level} out of {LEVELS.length}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

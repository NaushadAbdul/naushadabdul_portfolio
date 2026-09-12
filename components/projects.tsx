import { FeaturedProject } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Project } from "@/lib/types";

type ProjectsProps = {
  projects: Project[];
};

export function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="border-b-[3px] border-ink px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading index="05" kicker="Selected work" title="Projects" accent="blue" />

        <div className="space-y-10 md:space-y-14">
          {projects.map((project, index) => (
            <FeaturedProject key={project.id} project={project} index={index} flip={index % 2 === 1} />
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-5">
          <Button href="/projects" variant="accent" accent="blue" size="lg">
            View All Projects
            <span aria-hidden="true">→</span>
          </Button>
          <p className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.2em] text-ink/60">
            {String(projects.length).padStart(2, "0")} featured · more in the archive
          </p>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { getProjects } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects",
  description: "The full archive of projects I have designed, built and shipped.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      {/* ---- page header ---- */}
      <section className="relative overflow-hidden border-b-[3px] border-ink px-4 py-16 sm:px-6 md:py-20">
        <span
          className="pointer-events-none absolute -top-10 right-0 font-display text-[22vw] leading-none text-ink/[0.05] uppercase select-none"
          aria-hidden="true"
        >
          Work
        </span>

        <div className="relative mx-auto w-full max-w-7xl">
          <a
            href="/"
            className="inline-flex items-center gap-2 border-b-[3px] border-ink font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-brut-yellow"
          >
            ← Back home
          </a>

          <h1 className="mt-8 text-6xl uppercase md:text-8xl">All Projects</h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/75 md:text-lg">
            Everything I&apos;ve built and can talk about publicly — products, agents, dashboards and the
            automation glue underneath them.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="brut-border bg-brut-lime px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-brut-xs">
              {String(projects.length).padStart(2, "0")} projects
            </span>
            <Button href="/#contact" variant="outline">
              Start a project
            </Button>
          </div>
        </div>
      </section>

      {/* ---- grid ---- */}
      <section className="px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>

          <div className="brut-border mt-16 flex flex-wrap items-center justify-between gap-6 bg-brut-yellow p-6 shadow-brut md:p-8">
            <div>
              <h2 className="text-3xl uppercase md:text-4xl">Got a project like these?</h2>
              <p className="mt-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-ink/60">
                Tell me about it — I reply within a day
              </p>
            </div>
            <Button href="/#contact" variant="solid" size="lg">
              Let&apos;s Build
              <span aria-hidden="true">→</span>
            </Button>
          </div>
        </div>
      </section>

      <Marquee
        items={["AI Integration", "Next.js", "Automation", "LLM Agents", "TypeScript", "RAG Pipelines"]}
        accent="pink"
      />
    </>
  );
}

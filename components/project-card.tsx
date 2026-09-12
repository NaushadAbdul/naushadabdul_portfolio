import type { Project } from "@/lib/types";
import { accentStyle, cn } from "@/lib/utils";

function StackChips({ stack }: { stack: string[] }) {
  if (stack.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {stack.map((tech) => (
        <li
          key={tech}
          className="border-2 border-ink bg-paper px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-wider"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  const links = [
    project.live_url ? { label: "Live site", href: project.live_url } : null,
    project.repo_url ? { label: "Source", href: project.repo_url } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer noopener"
          className="border-b-[3px] border-ink font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] transition-colors hover:bg-brut-yellow"
        >
          {link.label} ↗
        </a>
      ))}
    </div>
  );
}

/** Optional artwork. Uses an <img> so any remote URL works without config. */
function Poster({ project, className }: { project: Project; className?: string }) {
  if (project.image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.image_url}
        alt={`${project.title} preview`}
        loading="lazy"
        className={cn("h-full w-full object-cover mix-blend-multiply", className)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn("text-outline font-display text-[5.5rem] leading-none opacity-60 md:text-[7rem]", className)}
    >
      {project.title.slice(0, 2).toUpperCase()}
    </span>
  );
}

/* ------------------------------------------------------------------
   Homepage: large alternating row
   ------------------------------------------------------------------ */

type FeaturedProjectProps = {
  project: Project;
  index: number;
  flip?: boolean;
};

export function FeaturedProject({ project, index, flip = false }: FeaturedProjectProps) {
  const accent = accentStyle(project.accent);

  return (
    <article className="brut-border grid bg-paper shadow-brut-lg transition-[transform,box-shadow] duration-150 ease-out hover:translate-x-2 hover:translate-y-2 hover:shadow-none lg:grid-cols-2">
      {/* poster panel */}
      <div
        className={cn(
          "grid-paper relative flex min-h-56 flex-col justify-between border-ink p-6 md:min-h-72 md:p-8",
          "border-b-[3px] lg:border-b-0",
          accent.bg,
          flip ? "lg:order-2 lg:border-l-[3px]" : "lg:border-r-[3px]",
        )}
      >
        <div className="flex items-start justify-between">
          <span className={cn("font-mono text-xs font-bold uppercase tracking-[0.3em]", accent.on)}>
            {String(index + 1).padStart(2, "0")} / Featured
          </span>
          <span className={cn("font-mono text-xs font-bold uppercase tracking-widest", accent.on)}>
            {project.year}
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <Poster project={project} />
        </div>

        <span className={cn("font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em]", accent.on)}>
          {project.role}
        </span>
      </div>

      {/* content panel */}
      <div className={cn("flex flex-col justify-center p-6 md:p-8", flip && "lg:order-1")}>
        <h3 className="text-3xl uppercase md:text-4xl">{project.title}</h3>
        <p className="mt-4 text-lg leading-snug font-medium">{project.tagline}</p>
        <p className="mt-4 text-sm leading-relaxed text-ink/75">{project.description}</p>

        <div className="mt-6">
          <StackChips stack={project.stack} />
        </div>

        <div className="mt-6">
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------
   /projects: compact grid card
   ------------------------------------------------------------------ */

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const accent = accentStyle(project.accent);

  return (
    <article className="brut-border flex flex-col bg-paper shadow-brut transition-[transform,box-shadow] duration-100 ease-out hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-none">
      <div
        className={cn(
          "grid-paper flex aspect-16/10 items-center justify-center border-b-[3px] border-ink p-5",
          accent.bg,
        )}
      >
        <Poster project={project} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink/60">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{project.year}</span>
        </div>

        <h3 className="mt-3 text-2xl uppercase">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/75">{project.tagline}</p>

        <div className="mt-5">
          <StackChips stack={project.stack} />
        </div>

        <div className="mt-5">
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}

import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/types";
import { accentStyle, cn } from "@/lib/utils";

type ServicesProps = {
  services: Service[];
};

export function Services({ services }: ServicesProps) {
  return (
    <section
      id="services"
      data-reveal
      className="reveal-soft border-b-[3px] border-ink px-4 py-20 sm:px-6 md:py-28 [--float-distance:-7px] [--float-duration:12s]"
    >
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading index="04" kicker="What I do" title="Services" accent="pink" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const accent = accentStyle(service.accent);

            return (
              <article
                key={service.id}
                className="float-drift brut-border group flex flex-col bg-paper shadow-brut transition-[transform,box-shadow] duration-100 ease-out hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-none"
              >
                <div className={cn("flex items-center justify-between border-b-[3px] border-ink p-4", accent.bg)}>
                  <span className={cn("font-display text-3xl leading-none", accent.on)}>{service.icon}</span>
                  <span
                    className={cn(
                      "font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] opacity-70",
                      accent.on,
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="text-2xl uppercase">{service.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/75">{service.description}</p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="mt-6 inline-flex w-fit translate-x-0 items-center gap-2 border-b-[3px] border-transparent font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] transition-all duration-150 group-hover:gap-3 group-hover:border-ink"
                  >
                    Start a project
                    <span>→</span>
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Button href="#contact" variant="solid" size="lg" float>
            Have something else in mind?
          </Button>
          <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.2em] text-ink/60">
            Custom scope is welcome
          </span>
        </div>
      </div>
    </section>
  );
}

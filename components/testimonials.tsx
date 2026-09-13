import { SectionHeading } from "@/components/ui/section-heading";
import type { Testimonial } from "@/lib/types";
import { accentStyles, cn } from "@/lib/utils";

const QUOTE_ACCENTS = ["pink", "lime", "blue", "yellow", "purple", "orange"] as const;

type TestimonialsProps = {
  testimonials: Testimonial[];
};

/** First letters of the author's name, for avatar-less cards. */
function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimonials"
      data-reveal
      className="reveal-quick border-b-[3px] border-ink px-4 py-20 sm:px-6 md:py-28 [--float-distance:-6px] [--float-duration:11.5s]"
    >
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading index="06" kicker="Kind words" title="Testimonials" accent="pink" />

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const accent = accentStyles[QUOTE_ACCENTS[index % QUOTE_ACCENTS.length]];
            const attribution = [testimonial.author_role, testimonial.author_company]
              .filter(Boolean)
              .join(", ");

            return (
              <li
                key={testimonial.id}
                className="float-drift brut-border flex flex-col bg-paper shadow-brut transition-[transform,box-shadow] duration-100 ease-out hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-none"
              >
                <div className={cn("border-b-[3px] border-ink px-5 py-3", accent.bg)}>
                  <span
                    aria-hidden="true"
                    className={cn("font-display text-3xl leading-none", accent.on)}
                  >
                    &ldquo;
                  </span>
                </div>

                <blockquote className="flex flex-1 flex-col justify-between p-5">
                  <p className="text-base leading-relaxed font-medium">{testimonial.quote}</p>

                  <footer className="mt-6 flex items-center gap-3 border-t-2 border-dashed border-ink/20 pt-4">
                    {testimonial.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={testimonial.avatar_url}
                        alt=""
                        loading="lazy"
                        className="brut-border-2 size-11 shrink-0 object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "brut-border-2 flex size-11 shrink-0 items-center justify-center font-mono text-xs font-bold",
                          accent.bg,
                          accent.on,
                        )}
                      >
                        {initialsOf(testimonial.author_name)}
                      </span>
                    )}

                    <div className="min-w-0">
                      <cite className="block font-display text-sm uppercase not-italic">
                        {testimonial.author_name}
                      </cite>
                      {attribution ? (
                        <span className="mt-0.5 block truncate font-mono text-[0.65rem] tracking-wider text-ink/55">
                          {attribution}
                        </span>
                      ) : null}
                    </div>
                  </footer>
                </blockquote>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

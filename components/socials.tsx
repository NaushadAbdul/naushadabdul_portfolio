import { socialsFromSettings } from "@/lib/socials";
import type { SiteSettings } from "@/lib/types";
import { accentStyles, cn } from "@/lib/utils";

/** One accent per position, in order. */
const SOCIAL_ACCENTS = ["blue", "purple", "yellow", "pink"] as const;

type SocialsProps = {
  settings: SiteSettings;
};

export function Socials({ settings }: SocialsProps) {
  const socials = socialsFromSettings(settings);

  // Clearing every URL in /admin/settings removes the section entirely.
  if (socials.length === 0) return null;

  return (
    <section
      aria-labelledby="socials-heading"
      className="border-b-[3px] border-ink px-4 py-16 sm:px-6 md:py-20"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 id="socials-heading" className="text-4xl uppercase md:text-5xl">
            Socials
          </h2>
          <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.25em] text-ink/60">
            Elsewhere on the internet
          </span>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {socials.map((social, index) => {
            const accent = accentStyles[SOCIAL_ACCENTS[index % SOCIAL_ACCENTS.length]];

            return (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="brut-border group flex h-full flex-col justify-between bg-paper p-5 shadow-brut transition-[transform,box-shadow] duration-100 ease-out hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-none"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block size-5 border-2 border-ink transition-transform duration-150 group-hover:rotate-45",
                      accent.bg,
                    )}
                  />
                  <span className="mt-8 flex items-center justify-between gap-3">
                    <span className="font-display text-2xl uppercase">{social.label}</span>
                    <span
                      aria-hidden="true"
                      className="text-xl transition-transform duration-150 group-hover:translate-x-1"
                    >
                      ↗
                    </span>
                  </span>
                  <span className="mt-1 truncate font-mono text-[0.65rem] tracking-wider text-ink/55">
                    {social.handle}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

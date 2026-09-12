import { Marquee } from "@/components/ui/marquee";
import { navLinks } from "@/lib/site";
import { socialsFromSettings } from "@/lib/socials";
import type { SiteSettings } from "@/lib/types";

type FooterProps = {
  settings: SiteSettings;
};

export function Footer({ settings }: FooterProps) {
  const year = new Date().getFullYear();
  const socials = socialsFromSettings(settings);
  /** "Build / Automate / Empower" -> ticker items. */
  const taglineItems = settings.tagline
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <footer className="grid-paper-dark border-t-[3px] border-ink bg-ink text-paper">
      {taglineItems.length > 0 ? (
        <Marquee items={taglineItems} accent="lime" reverse className="border-x-0" />
      ) : null}

      <div className="mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 md:pt-20">
        {/* Giant personal wordmark */}
        <a href="#top" className="group block" aria-label="Back to top">
          <span className="block font-display text-[clamp(2.25rem,12.5vw,11rem)] leading-[0.85] tracking-tight uppercase">
            {settings.full_name.split(" ").map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="block transition-colors duration-200 group-hover:text-outline-paper"
              >
                {word}
              </span>
            ))}
          </span>
        </a>

        <div className="mt-12 grid gap-10 border-t-[3px] border-paper/25 pt-10 md:grid-cols-3">
          <div>
            <h2 className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-paper/50">
              Say hello
            </h2>
            <a
              href={`mailto:${settings.email}`}
              className="mt-3 inline-block border-b-[3px] border-paper/40 pb-0.5 text-sm break-all transition-colors hover:border-brut-lime hover:text-brut-lime"
            >
              {settings.email}
            </a>
            <p className="mt-3 font-mono text-[0.7rem] tracking-wider text-paper/50">
              {settings.location}
            </p>
            {settings.resume_url ? (
              <p className="mt-4">
                <a
                  href={settings.resume_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="font-mono text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:text-brut-lime"
                >
                  Download Résumé ↓
                </a>
              </p>
            ) : null}
          </div>

          <div>
            <h2 className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-paper/50">
              Navigate
            </h2>
            <ul className="mt-3 space-y-2">
              {[...navLinks, { label: "All projects", href: "/projects" }].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-mono text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:text-brut-lime"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-paper/50">
              Follow
            </h2>
            {socials.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-mono text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:text-brut-lime"
                    >
                      {social.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 font-mono text-xs text-paper/40">No links added yet.</p>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t-[3px] border-paper/25 py-7">
          <p className="font-mono text-[0.65rem] tracking-widest text-paper/50">
            © {year} {settings.full_name}. All rights reserved.
          </p>
          <p className="font-mono text-[0.65rem] font-bold tracking-[0.25em] text-paper/70 uppercase">
            {settings.tagline}
          </p>
          <a
            href="#top"
            className="border-b-[3px] border-paper/40 font-mono text-[0.65rem] font-bold tracking-[0.25em] uppercase transition-colors hover:border-brut-lime hover:text-brut-lime"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}

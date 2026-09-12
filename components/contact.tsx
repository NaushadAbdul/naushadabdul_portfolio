import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SiteSettings } from "@/lib/types";

type ContactProps = {
  settings: SiteSettings;
};

export function Contact({ settings }: ContactProps) {
  return (
    <section id="contact" className="border-b-[3px] border-ink px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto w-full max-w-7xl">
        <SectionHeading index="07" kicker="Get in touch" title="Contact" accent="orange" />

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* ---- CTA copy ---- */}
          <div>
            <h3 className="text-4xl uppercase md:text-5xl">
              Let&apos;s build
              <br />
              something
              <br />
              <span className="text-outline">worth shipping.</span>
            </h3>

            <p className="mt-7 max-w-md text-base leading-relaxed text-ink/75 md:text-lg">
              Tell me what you&apos;re working on — a product to launch, an AI feature that keeps
              slipping, or a process still running on copy-paste. I&apos;ll reply with an honest read
              on the fastest path forward.
            </p>

            <div className="brut-border mt-9 bg-brut-blue p-5 shadow-brut-sm">
              <p className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-paper/70">
                Prefer email
              </p>
              <a
                href={`mailto:${settings.email}`}
                className="mt-2 block border-b-[3px] border-paper/40 pb-1 font-display text-lg break-all text-paper transition-colors hover:border-paper md:text-2xl"
              >
                {settings.email}
              </a>
            </div>

            <dl className="mt-8 divide-y-2 divide-dashed divide-ink/25">
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink/60">
                  Location
                </dt>
                <dd className="text-sm font-medium">{settings.location}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink/60">
                  Availability
                </dt>
                <dd className="text-sm font-medium">{settings.availability}</dd>
              </div>
            </dl>

            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="/projects" variant="outline">
                See the full archive
              </Button>
              {settings.resume_url ? (
                <Button href={settings.resume_url} variant="accent" accent="lime" target="_blank" rel="noreferrer noopener">
                  Download Résumé
                  <span aria-hidden="true">↓</span>
                </Button>
              ) : null}
            </div>
          </div>

          {/* ---- form ---- */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

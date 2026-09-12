import { Checkerboard, ConcentricRings, Starburst, ZigZag } from "@/components/hero-graphics";
import { Portrait } from "@/components/portrait";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { Sticker } from "@/components/ui/sticker";
import type { SiteSettings } from "@/lib/types";

const TICKER = ["AI Integration", "Next.js", "Automation", "LLM Agents", "TypeScript", "RAG Pipelines"];

type HeroProps = {
  settings: SiteSettings;
};

export function Hero({ settings }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden border-b-[3px] border-ink bg-paper">
      {/* ---- background graphics: contained on desktop, hidden/subtle on mobile so they never collide with content ---- */}
      <div className="pointer-events-none absolute inset-0 select-none overflow-hidden" aria-hidden="true">
        <span className="absolute -top-4 -left-6 sm:-top-6 sm:-left-10 font-display text-[22vw] sm:text-[26vw] leading-none text-ink/[0.04] uppercase">
          {settings.initials}
        </span>
        <Starburst className="absolute -top-12 -right-16 size-48 md:size-80 animate-spin-slow opacity-60 md:opacity-90 hidden sm:block" />
        <ConcentricRings className="absolute bottom-10 -left-12 size-44 md:size-72 opacity-50 md:opacity-70 hidden md:block" />
        <Checkerboard className="absolute top-1/2 right-[46%] hidden size-28 -rotate-6 opacity-80 xl:block" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 sm:gap-12 px-4 pt-8 pb-12 sm:px-6 sm:pt-14 sm:pb-16 md:pt-20 md:pb-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
        {/* ---- copy ---- */}
        <div className="flex flex-col items-start">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Sticker accent="lime" rotate={-2} float className="text-[0.65rem] sm:text-xs">
              <span className="size-1.5 sm:size-2 animate-blink rounded-full bg-ink" aria-hidden="true" />
              {settings.availability}
            </Sticker>
            <Sticker accent="yellow" rotate={2} className="text-[0.65rem] sm:text-xs">
              {settings.location}
            </Sticker>
          </div>

          <p className="mt-5 sm:mt-7 font-mono text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-ink/60">
            {settings.role}
          </p>

          <h1 className="mt-3 sm:mt-4 text-4xl xs:text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] leading-[0.92] sm:leading-[0.88] uppercase font-black tracking-tight">
            I build{" "}
            <span className="relative inline-block">
              <span className="relative z-10">AI</span>
              <span className="absolute inset-x-0 bottom-0.5 sm:bottom-1 z-0 h-3 sm:h-4 md:h-6 bg-brut-yellow" aria-hidden="true" />
            </span>{" "}
            systems that
            <br className="hidden sm:block" /> actually <span className="text-outline">ship</span>.
          </h1>

          <p className="mt-4 sm:mt-7 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-ink/80">
            {settings.description}
          </p>

          <div className="mt-6 sm:mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
            <Button href="#contact" variant="accent" accent="pink" size="md" className="py-2.5 sm:py-3.5 px-5 sm:px-8 text-xs sm:text-base md:text-lg">
              Let&apos;s Build
              <span aria-hidden="true">→</span>
            </Button>
            <Button href="#projects" variant="outline" size="md" className="py-2.5 sm:py-3.5 px-5 sm:px-8 text-xs sm:text-base md:text-lg">
              View Work
            </Button>
            {settings.resume_url ? (
              <a
                href={settings.resume_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-block border-b-[3px] border-ink font-mono text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] transition-colors hover:bg-brut-lime py-1"
              >
                Résumé ↓
              </a>
            ) : null}
          </div>

          <ZigZag className="mt-8 sm:mt-12 max-w-xs opacity-40 hidden sm:block" />
        </div>

        {/* ---- portrait ---- */}
        <div className="relative mx-auto w-full max-w-[280px] xs:max-w-[320px] sm:max-w-sm md:max-w-md lg:max-w-none mt-4 lg:mt-0">
          <div className="relative">
            {/* Background offset card (visible on tablet/desktop) */}
            <div
              className="brut-border absolute -top-3 -left-3 sm:-top-4 sm:-left-4 hidden h-full w-full bg-brut-blue sm:block"
              aria-hidden="true"
            />
            {/* Foreground image container */}
            <div className="brut-border relative aspect-4/5 sm:aspect-5/6 overflow-hidden bg-brut-yellow shadow-brut sm:shadow-brut-lg">
              <Portrait alt={`Portrait of ${settings.full_name}`} src={settings.portrait_url} className="object-cover object-top" />
            </div>
            {/* Focus sticker */}
            <Sticker
              accent="pink"
              rotate={6}
              float
              className="absolute -right-2 -bottom-3 sm:-right-4 sm:-bottom-4 md:-right-6 text-[0.6rem] sm:text-xs"
            >
              {settings.focus}
            </Sticker>
          </div>
        </div>
      </div>

      <Marquee items={TICKER} accent="yellow" />
    </section>
  );
}

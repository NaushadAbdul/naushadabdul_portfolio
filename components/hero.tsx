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
    <section id="top" className="relative overflow-hidden border-b-[3px] border-ink">
      {/* ---- experimental background graphics ---- */}
      <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
        <span className="absolute -top-6 -left-10 font-display text-[26vw] leading-none text-ink/[0.045] uppercase">
          {settings.initials}
        </span>
        <Starburst className="absolute -top-10 -right-16 size-56 animate-spin-slow opacity-90 md:size-80" />
        <ConcentricRings className="absolute bottom-16 -left-16 size-52 opacity-70 md:size-72" />
        <Checkerboard className="absolute top-1/2 right-[46%] hidden size-28 -rotate-6 opacity-80 xl:block" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 pt-14 pb-16 sm:px-6 md:pt-20 md:pb-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
        {/* ---- copy ---- */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Sticker accent="lime" rotate={-3} float>
              <span className="size-2 animate-blink rounded-full bg-ink" aria-hidden="true" />
              {settings.availability}
            </Sticker>
            <Sticker accent="yellow" rotate={2}>
              {settings.location}
            </Sticker>
          </div>

          <p className="mt-7 font-mono text-xs font-bold uppercase tracking-[0.3em] text-ink/60">
            {settings.role}
          </p>

          <h1 className="mt-4 text-[3.25rem] leading-[0.88] uppercase sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
            I build{" "}
            <span className="relative inline-block">
              <span className="relative z-10">AI</span>
              <span className="absolute inset-x-0 bottom-1 z-0 h-4 bg-brut-yellow md:h-6" aria-hidden="true" />
            </span>{" "}
            systems that
            <br className="hidden sm:block" /> actually <span className="text-outline">ship</span>.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-ink/80 md:text-lg">
            {settings.description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="#contact" variant="accent" accent="pink" size="lg">
              Let&apos;s Build
              <span aria-hidden="true">→</span>
            </Button>
            <Button href="#projects" variant="outline" size="lg">
              View Work
            </Button>
            {settings.resume_url ? (
              <a
                href={settings.resume_url}
                target="_blank"
                rel="noreferrer noopener"
                className="border-b-[3px] border-ink font-mono text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:bg-brut-lime"
              >
                Résumé ↓
              </a>
            ) : null}
          </div>

          <ZigZag className="mt-12 max-w-xs opacity-40" />
        </div>

        {/* ---- portrait ---- */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative">
            <div
              className="brut-border absolute -top-4 -left-4 hidden h-full w-full bg-brut-blue md:block"
              aria-hidden="true"
            />
            <div className="brut-border relative aspect-5/6 overflow-hidden bg-brut-yellow shadow-brut-lg">
              <Portrait alt={`Portrait of ${settings.full_name}`} src={settings.portrait_url} />
            </div>
            <Sticker accent="pink" rotate={8} float className="absolute -right-3 -bottom-3 md:-right-6">
              {settings.focus}
            </Sticker>
          </div>
        </div>
      </div>

      <Marquee items={TICKER} accent="yellow" />
    </section>
  );
}

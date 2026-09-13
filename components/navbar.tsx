"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";
import { accentStyles, cn } from "@/lib/utils";

/** Nav links cycle through the palette, left to right. */
const NAV_ACCENTS = ["yellow", "lime", "pink", "blue", "orange", "purple"] as const;

type NavbarProps = {
  settings: SiteSettings;
};

export function Navbar({ settings }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stop the page scrolling behind the open mobile panel.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close the panel if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b-[3px] border-ink bg-paper transition-shadow duration-200 [--float-delay:0.2s] [--float-distance:-2px] [--float-duration:11s]",
        scrolled && "shadow-brut-sm",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:py-4"
      >
        {/* Wordmark */}
        <a href="#top" className="group flex shrink-0 items-center gap-3" aria-label={`${settings.full_name} — home`}>
          <span className="brut-border flex size-11 items-center justify-center bg-brut-yellow font-mono text-sm font-bold shadow-brut-xs transition-transform duration-100 group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none">
            {settings.initials}
          </span>
          <span className="hidden leading-none xl:block">
            <span className="block font-display text-sm uppercase tracking-tight">{settings.full_name}</span>
            <span className="mt-0.5 block font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] text-ink/60">
              {settings.role}
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center md:flex">
          {navLinks.map((link, index) => {
            const accent = accentStyles[NAV_ACCENTS[index % NAV_ACCENTS.length]];
            return (
              <li key={link.href} className="float-drift">
                <a
                  href={link.href}
                  className="group relative block px-3 py-2 font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] transition-colors hover:bg-paper-dim lg:text-xs"
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-2 bottom-1 h-[3px] origin-left scale-x-0 transition-transform duration-150 group-hover:scale-x-100",
                      accent.bg,
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Button href="#contact" size="sm" variant="accent" accent="lime" className="hidden lg:inline-flex" float>
            Let&apos;s Build
          </Button>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="float-drift brut-border flex size-11 items-center justify-center bg-brut-pink shadow-brut-xs press hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none md:hidden"
          >
            <span className="relative block h-4 w-5" aria-hidden="true">
              {[0, 1, 2].map((line) => (
                <span
                  key={line}
                  className={cn(
                    "absolute left-0 h-[3px] w-full bg-ink transition-transform duration-200",
                    line === 0 && (menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"),
                    line === 1 && (menuOpen ? "top-1/2 -translate-y-1/2 opacity-0" : "top-1/2 -translate-y-1/2"),
                    line === 2 && (menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"),
                  )}
                />
              ))}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div id="mobile-menu" hidden={!menuOpen} className="border-t-[3px] border-ink bg-paper md:hidden">
        <ul className="divide-y-[3px] divide-ink">
          {navLinks.map((link, index) => {
            const accent = accentStyles[NAV_ACCENTS[index % NAV_ACCENTS.length]];
            return (
              <li key={link.href} className="float-drift">
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between px-5 py-4 font-display text-2xl uppercase"
                >
                  {link.label}
                  <span className={cn("size-4 border-2 border-ink", accent.bg)} aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>
        <div className="p-5">
          <Button
            href="#contact"
            variant="accent"
            accent="lime"
            size="lg"
            className="w-full"
            onClick={() => setMenuOpen(false)}
            float
          >
            Let&apos;s Build
          </Button>
        </div>
      </div>
    </header>
  );
}

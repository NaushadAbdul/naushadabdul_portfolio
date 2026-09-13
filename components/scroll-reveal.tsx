"use client";

import { useEffect } from "react";

/**
 * Scroll-reveal fallback.
 *
 * Sections reveal themselves with a pure-CSS scroll-driven animation. This
 * covers browsers that don't support `animation-timeline: view()` yet: it
 * eases the sections in with an IntersectionObserver instead.
 *
 * Nothing runs — and nothing is hidden — in browsers that already handle the
 * CSS path, or for visitors who prefer reduced motion. When no JavaScript
 * runs at all, every section is visible.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (typeof CSS === "undefined" || CSS.supports?.("animation-timeline: view()")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );

    // Reveal everything already on screen before hiding anything, so the
    // first paint never flashes a section away.
    const viewport = window.innerHeight;
    for (const target of targets) {
      if (target.getBoundingClientRect().top < viewport) {
        target.classList.add("is-revealed");
      } else {
        observer.observe(target);
      }
    }

    // Switches the fallback styles on for the sections still waiting below
    // the fold.
    document.documentElement.classList.add("reveal-js");

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("reveal-js");
    };
  }, []);

  return null;
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CursorGrid } from "@/components/ui/cursor-grid";
import { getSettings } from "@/lib/data";

/** Rebuild at most every 5 minutes so admin edits appear without a deploy. */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: {
      default: `${settings.full_name} — ${settings.role}`,
      template: `%s — ${settings.full_name}`,
    },
    description: settings.description,
    keywords: [
      "AI developer",
      "Next.js developer",
      "automation",
      "LLM agents",
      "web development",
      settings.full_name,
    ],
    authors: [{ name: settings.full_name }],
    openGraph: {
      type: "website",
      title: `${settings.full_name} — ${settings.role}`,
      description: settings.description,
      siteName: settings.full_name,
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.full_name} — ${settings.role}`,
      description: settings.description,
    },
  };
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:brut-border focus:bg-brut-lime focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:font-bold focus:uppercase"
      >
        Skip to content
      </a>

      {/* Interactive background cursor grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full overflow-hidden opacity-60"
      >
        <CursorGrid
          cellSize={34}
          color="#0a0a0a"
          radius={140}
          falloff="smooth"
          holdTime={300}
          fadeDuration={700}
          lineWidth={1.2}
          maxOpacity={0.6}
          fillOpacity={0.06}
          gridOpacity={0}
          cellRadius={0}
          clickPulse
          pulseSpeed={650}
        />
      </div>

      <Navbar settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <ScrollReveal />
    </>
  );
}

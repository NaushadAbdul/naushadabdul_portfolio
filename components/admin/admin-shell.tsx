"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { signOut } from "@/lib/admin/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", chip: "bg-brut-yellow", exact: true },
  { href: "/admin/projects", label: "Projects", chip: "bg-brut-blue" },
  { href: "/admin/services", label: "Services", chip: "bg-brut-pink" },
  { href: "/admin/skills", label: "Skills", chip: "bg-brut-lime" },
  { href: "/admin/experience", label: "Experience", chip: "bg-brut-orange" },
  { href: "/admin/testimonials", label: "Testimonials", chip: "bg-brut-purple" },
  { href: "/admin/messages", label: "Messages", chip: "bg-brut-yellow" },
  { href: "/admin/about", label: "About", chip: "bg-brut-lime" },
  { href: "/admin/settings", label: "Settings", chip: "bg-brut-purple" },
  { href: "/admin/admins", label: "Admins", chip: "bg-brut-pink" },
];

type AdminShellProps = {
  children: ReactNode;
  email: string;
  initials: string;
  unreadCount: number;
};

/**
 * Admin chrome.
 *
 * The nav is a horizontally scrollable strip on small screens and a fixed
 * column on large ones, which avoids a slide-out menu and its focus-trap
 * baggage entirely.
 */
export function AdminShell({ children, email, initials, unreadCount }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="border-b-[3px] border-ink bg-ink text-paper lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:border-r-[3px] lg:border-b-0">
        {/* Brand + account */}
        <div className="flex items-center justify-between gap-3 border-b-[3px] border-paper/20 p-4">
          <a href="/admin" className="flex items-center gap-3">
            <span className="brut-border flex size-9 shrink-0 items-center justify-center bg-brut-yellow font-mono text-[0.7rem] font-bold text-ink">
              {initials}
            </span>
            <span className="leading-none">
              <span className="block font-display text-sm uppercase">Admin</span>
              <span className="mt-1 block max-w-32 truncate font-mono text-[0.6rem] text-paper/50">
                {email}
              </span>
            </span>
          </a>

          <form action={signOut}>
            <button
              type="submit"
              className="border-b-[3px] border-paper/40 font-mono text-[0.6rem] font-bold tracking-[0.15em] uppercase transition-colors hover:border-brut-lime hover:text-brut-lime"
            >
              Sign out
            </button>
          </form>
        </div>

        {/* Navigation */}
        <nav aria-label="Admin" className="p-3">
          <ul className="flex gap-1.5 overflow-x-auto lg:flex-col lg:overflow-visible">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);

              return (
                <li key={item.href} className="shrink-0 lg:shrink">
                  <a
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between gap-3 px-3 py-2 font-mono text-[0.7rem] font-bold tracking-[0.14em] whitespace-nowrap uppercase transition-colors",
                      active ? "bg-paper text-ink" : "text-paper/70 hover:bg-paper/10 hover:text-paper",
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={cn("size-2.5 shrink-0 border border-ink", item.chip)}
                      />
                      {item.label}
                    </span>

                    {item.href === "/admin/messages" && unreadCount > 0 ? (
                      <span className="bg-brut-pink px-1.5 py-0.5 font-mono text-[0.6rem] font-bold text-ink">
                        {unreadCount}
                      </span>
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden p-4 lg:block">
          <a
            href="/"
            target="_blank"
            rel="noreferrer noopener"
            className="brut-border-2 flex items-center justify-between gap-2 bg-paper px-3 py-2 font-mono text-[0.65rem] font-bold tracking-[0.15em] text-ink uppercase shadow-brut-xs transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            View site
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}

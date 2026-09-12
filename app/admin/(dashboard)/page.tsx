import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatRelative, previewText } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/guard";
import { getDashboardStats, listMessages } from "@/lib/admin/queries";
import { cn } from "@/lib/utils";

type StatCard = {
  label: string;
  value: number | string;
  sub?: string;
  chip: string;
  href?: string;
};

export default async function AdminDashboardPage() {
  const { supabase, user } = await requireAdmin();

  const [stats, messages] = await Promise.all([getDashboardStats(supabase), listMessages(supabase)]);

  const recent = messages.slice(0, 5);

  const cards: StatCard[] = [
    {
      label: "Projects",
      value: stats.projects,
      sub: `${stats.featuredProjects} featured`,
      chip: "bg-brut-blue",
      href: "/admin/projects",
    },
    { label: "Services", value: stats.services, chip: "bg-brut-pink", href: "/admin/services" },
    { label: "Skills", value: stats.skills, chip: "bg-brut-lime", href: "/admin/skills" },
    { label: "Experience", value: stats.experience, chip: "bg-brut-orange", href: "/admin/experience" },
    {
      label: "Testimonials",
      value: stats.testimonials,
      chip: "bg-brut-purple",
      href: "/admin/testimonials",
    },
    {
      label: "Messages",
      value: stats.messages,
      sub: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : "all read",
      chip: "bg-brut-yellow",
      href: "/admin/messages",
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Signed in as ${user.email ?? "admin"}. Last content change: ${formatDateTime(stats.lastUpdated)}.`}
        accent="yellow"
        action={
          <>
            <Button href="/admin/projects/new" variant="accent" accent="lime">
              New project
            </Button>
            <Button href="/" variant="outline" target="_blank" rel="noreferrer noopener">
              View site ↗
            </Button>
          </>
        }
      />

      {/* ---- stats ---- */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <li key={card.label}>
            <a
              href={card.href ?? "#"}
              className="brut-border group flex items-center justify-between gap-4 bg-paper p-5 shadow-brut transition-[transform,box-shadow] duration-100 ease-out hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-none"
            >
              <span>
                <span className="block font-mono text-[0.6rem] font-bold uppercase tracking-[0.22em] text-ink/55">
                  {card.label}
                </span>
                <span className="mt-1 block font-display text-4xl leading-none">
                  {typeof card.value === "number" ? String(card.value).padStart(2, "0") : card.value}
                </span>
                {card.sub ? (
                  <span className="mt-1.5 block font-mono text-[0.6rem] tracking-wide text-ink/50">
                    {card.sub}
                  </span>
                ) : null}
              </span>

              <span
                aria-hidden="true"
                className={cn(
                  "size-6 shrink-0 border-2 border-ink transition-transform duration-150 group-hover:rotate-45",
                  card.chip,
                )}
              />
            </a>
          </li>
        ))}
      </ul>

      {/* ---- quick actions ---- */}
      <section className="mt-8">
        <h2 className="mb-4 font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-ink/55">
          Quick actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Add project", href: "/admin/projects/new", chip: "bg-brut-blue" },
            { label: "Add skill", href: "/admin/skills/new", chip: "bg-brut-lime" },
            { label: "Add role", href: "/admin/experience/new", chip: "bg-brut-orange" },
            { label: "Add testimonial", href: "/admin/testimonials/new", chip: "bg-brut-purple" },
            { label: "Edit about", href: "/admin/about", chip: "bg-brut-lime" },
            { label: "Site settings", href: "/admin/settings", chip: "bg-brut-purple" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="brut-border-2 flex items-center gap-2.5 bg-paper px-3.5 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] shadow-brut-xs transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              <span aria-hidden="true" className={cn("size-2.5 border border-ink", item.chip)} />
              {item.label}
            </a>
          ))}
        </div>
      </section>

      {/* ---- recent messages ---- */}
      <section className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-ink/55">
            Recent messages
          </h2>
          <a
            href="/admin/messages"
            className="border-b-[3px] border-ink font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] transition-colors hover:bg-brut-yellow"
          >
            Open inbox →
          </a>
        </div>

        {recent.length === 0 ? (
          <p className="brut-border bg-paper p-6 text-center font-mono text-xs text-ink/50 shadow-brut-sm">
            No messages yet. Submissions from the contact form land here.
          </p>
        ) : (
          <ul className="brut-border divide-y-2 divide-ink/10 bg-paper shadow-brut">
            {recent.map((message) => (
              <li key={message.id} className="flex flex-wrap items-center gap-3 p-4">
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-2.5 shrink-0 border border-ink",
                    message.is_read ? "bg-paper-dim" : "bg-brut-pink",
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">
                    {message.name}
                    {!message.is_read ? (
                      <span className="ml-2 font-mono text-[0.6rem] font-bold tracking-widest text-brut-pink uppercase">
                        new
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[0.65rem] text-ink/55">
                    {previewText(message.message, 80)}
                  </span>
                </span>
                <span className="font-mono text-[0.6rem] tracking-wide text-ink/45">
                  {formatRelative(message.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

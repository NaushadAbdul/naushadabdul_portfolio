import { ActionForm } from "@/components/admin/action-form";
import { PageHeader } from "@/components/admin/page-header";
import { deleteMessage, setMessageRead } from "@/lib/admin/actions";
import { formatDateTime, formatRelative } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/admin/guard";
import { listMessages } from "@/lib/admin/queries";
import { cn } from "@/lib/utils";

export default async function MessagesPage() {
  const { supabase } = await requireAdmin();
  const messages = await listMessages(supabase);

  const unread = messages.filter((message) => !message.is_read).length;

  return (
    <>
      <PageHeader
        title="Messages"
        description="Submissions from the contact form. Reading does not require a reply — use the mail link to respond."
        accent="yellow"
        action={
          unread > 0 ? (
            <span className="brut-border-2 bg-brut-pink px-3 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-widest shadow-brut-xs">
              {unread} unread
            </span>
          ) : (
            <span className="brut-border-2 bg-brut-lime px-3 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-widest shadow-brut-xs">
              All read
            </span>
          )
        }
      />

      {messages.length === 0 ? (
        <p className="brut-border bg-paper p-10 text-center font-mono text-xs text-ink/50 shadow-brut-sm">
          No messages yet. Anything sent through the contact form appears here.
        </p>
      ) : (
        <ul className="space-y-4">
          {messages.map((message) => (
            <li
              key={message.id}
              className={cn(
                "brut-border bg-paper shadow-brut",
                !message.is_read && "border-l-[10px] border-l-brut-pink",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-ink p-4">
                <div className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-lg uppercase">{message.name}</span>
                    {!message.is_read ? (
                      <span className="bg-brut-pink px-1.5 py-0.5 font-mono text-[0.55rem] font-bold uppercase tracking-widest">
                        New
                      </span>
                    ) : null}
                  </span>

                  <span className="mt-1 block font-mono text-[0.65rem] tracking-wide">
                    <a
                      href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: your message`)}`}
                      className="border-b-2 border-ink/40 break-all transition-colors hover:border-ink hover:bg-brut-yellow"
                    >
                      {message.email}
                    </a>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${message.email}`}
                    className="brut-border-2 bg-brut-blue px-2.5 py-1.5 font-mono text-[0.6rem] font-bold uppercase tracking-widest text-paper transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
                  >
                    Reply
                  </a>

                  <ActionForm
                    action={setMessageRead.bind(null, message.id, !message.is_read)}
                  >
                    <button
                      type="submit"
                      className="brut-border-2 bg-brut-lime px-2.5 py-1.5 font-mono text-[0.6rem] font-bold uppercase tracking-widest transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
                    >
                      {message.is_read ? "Mark unread" : "Mark read"}
                    </button>
                  </ActionForm>

                  <ActionForm
                    action={deleteMessage.bind(null, message.id)}
                    confirm="Delete this message permanently?"
                  >
                    <button
                      type="submit"
                      className="brut-border-2 bg-brut-pink px-2.5 py-1.5 font-mono text-[0.6rem] font-bold uppercase tracking-widest transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
                    >
                      Delete
                    </button>
                  </ActionForm>
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
                <p className="mt-4 font-mono text-[0.6rem] tracking-wide text-ink/45">
                  {formatDateTime(message.created_at)} · {formatRelative(message.created_at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

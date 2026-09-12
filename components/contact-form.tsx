"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "error";

const FIELDS = [
  { name: "name", label: "Name", type: "text", placeholder: "Your name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", placeholder: "you@company.com", autoComplete: "email" },
] as const;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          // Honeypot: real users never see or fill this field.
          company: data.get("company"),
        }),
      });

      const payload: { error?: string } = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error ?? "Message could not be sent. Please try again.");
      }

      form.reset();
      setStatus("success");
    } catch (cause) {
      setErrorMessage(cause instanceof Error ? cause.message : "Message could not be sent.");
      setStatus("error");
    }
  }

  const sending = status === "sending";

  return (
    <form onSubmit={handleSubmit} noValidate className="brut-border bg-paper p-5 shadow-brut md:p-7">
      <div className="mb-6 flex items-center justify-between border-b-[3px] border-ink pb-3">
        <h3 className="font-mono text-xs font-bold uppercase tracking-[0.25em]">Send a message</h3>
        <span className="font-mono text-[0.6rem] font-bold uppercase tracking-widest text-ink/50">
          No spam, ever
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="mb-2 block font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em]"
            >
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              required
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              className="brut-border-2 w-full bg-paper px-3.5 py-3 text-sm transition-shadow duration-100 placeholder:text-ink/35 focus:shadow-brut-xs"
            />
          </div>
        ))}
      </div>

      <div className="mt-5">
        <label
          htmlFor="message"
          className="mb-2 block font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em]"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="What are you building, and where does it hurt?"
          className="brut-border-2 w-full resize-y bg-paper px-3.5 py-3 text-sm transition-shadow duration-100 placeholder:text-ink/35 focus:shadow-brut-xs"
        />
      </div>

      {/* Honeypot — hidden from users, catnip for bots. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "success" ? (
        <p
          role="status"
          className="brut-border-2 mt-5 bg-brut-lime px-4 py-3 font-mono text-xs font-bold uppercase tracking-widest"
        >
          ✓ Message sent — I&apos;ll get back to you shortly.
        </p>
      ) : null}

      {status === "error" && errorMessage ? (
        <p
          role="alert"
          className="brut-border-2 mt-5 bg-brut-pink px-4 py-3 font-mono text-xs font-bold uppercase tracking-widest"
        >
          ✕ {errorMessage}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={sending} variant="accent" accent="lime" size="lg" className="min-w-45">
          {sending ? "Sending…" : "Send Message"}
          {!sending && <span aria-hidden="true">→</span>}
        </Button>
        <span className={cn("font-mono text-[0.6rem] font-bold uppercase tracking-widest text-ink/50")}>
          Usually replies within a day
        </span>
      </div>
    </form>
  );
}

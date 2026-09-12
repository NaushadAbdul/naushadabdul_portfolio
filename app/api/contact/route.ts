import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getPublicClient } from "@/lib/supabase/public";

export const runtime = "nodejs";

/**
 * Contact form handler.
 *
 * Writes to the `messages` inbox first, then emails a copy if Resend is
 * configured. Both channels are attempted and the request only fails if neither
 * worked — so the form still works before you have set up email.
 */

const LIMITS = { name: 100, email: 200, message: 5000 } as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ------------------------------------------------------------------
   Best-effort rate limiting
   In-memory, so it resets on redeploy and is per-instance. Enough to
   stop a casual spam script; a public site should not need more.
   ------------------------------------------------------------------ */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const requestLog = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string) {
  const now = Date.now();

  // Keep the map from growing without bound on a long-lived instance.
  if (requestLog.size > 500) {
    for (const [entryKey, entry] of requestLog) {
      if (now > entry.resetAt) requestLog.delete(entryKey);
    }
  }

  const entry = requestLog.get(key);

  if (!entry || now > entry.resetAt) {
    requestLog.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

/** Inserts into the inbox using the anon key; RLS allows insert but not select. */
async function storeMessage(name: string, email: string, message: string) {
  const supabase = getPublicClient();

  if (!supabase) {
    return { ok: false, reason: "Supabase is not configured." };
  }

  const { error } = await supabase.from("messages").insert({ name, email, message });

  if (error) {
    return { ok: false, reason: error.message };
  }

  return { ok: true };
}

async function emailMessage(name: string, email: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;

  // Not configured: silently skip, the message is already in the inbox.
  if (!apiKey || !to) {
    return { ok: false, reason: "Resend is not configured." };
  }

  // `||` rather than `??` so an empty string in .env.local still falls back.
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    message: escapeHtml(message).replace(/\n/g, "<br />"),
  };

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#0a0a0a">
          <h2 style="margin:0 0 16px">New portfolio message</h2>
          <p style="margin:0 0 8px"><strong>Name:</strong> ${safe.name}</p>
          <p style="margin:0 0 8px"><strong>Email:</strong> ${safe.email}</p>
          <hr style="border:none;border-top:2px solid #0a0a0a;margin:16px 0" />
          <p style="margin:0;white-space:pre-wrap">${safe.message}</p>
        </div>
      `,
    });

    if (error) {
      return { ok: false, reason: error.message };
    }

    return { ok: true };
  } catch (cause) {
    return { ok: false, reason: cause instanceof Error ? cause.message : "Unknown email error." };
  }
}

export async function POST(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "unknown";
  const clientKey = forwardedFor.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(clientKey)) {
    return NextResponse.json({ error: "Too many messages. Try again in a minute." }, { status: 429 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const name = readString(payload.name);
  const email = readString(payload.email);
  const message = readString(payload.message);
  const honeypot = readString(payload.company);

  // A bot filled the hidden field. Pretend it worked so it does not retry.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are all required." }, { status: 400 });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "That email address does not look right." }, { status: 400 });
  }

  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  const [stored, emailed] = await Promise.all([
    storeMessage(name, email, message),
    emailMessage(name, email, message),
  ]);

  if (!stored.ok) {
    console.warn(`[contact] could not store message: ${stored.reason}`);
  }
  if (!emailed.ok) {
    console.warn(`[contact] could not email message: ${emailed.reason}`);
  }

  if (!stored.ok && !emailed.ok) {
    return NextResponse.json(
      { error: "Message could not be delivered. Please email me directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, stored: stored.ok, emailed: emailed.ok });
}

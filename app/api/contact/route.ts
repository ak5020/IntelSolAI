import { NextResponse } from 'next/server';

import { contactSchema, fieldErrorsFrom, type ContactResponse } from '@/lib/contactSchema';
import {
  autoReplyHtml,
  autoReplyText,
  notificationHtml,
  notificationText,
} from '@/lib/emailTemplate';
import { mailerName, sendMail } from '@/lib/mailer';

/* This route sends email, so it must never be statically optimised or cached. */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/* ---------------------------------------------------------------------------
   Rate limiting
   ---------------------------------------------------------------------------
   Max 3 submissions per IP per 10 minutes, held in a module-level Map.

   Caveat, documented in HANDOFF.md: this resets on cold start and is per
   serverless instance, so it is a speed bump rather than a guarantee. Move to
   Upstash Redis if spam becomes a real problem.
--------------------------------------------------------------------------- */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }

  recent.push(now);
  hits.set(ip, recent);

  // Opportunistic cleanup so the Map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return false;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown';
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function json(body: ContactResponse, status: number) {
  return NextResponse.json(body, { status });
}

/** Minimum time on the form before a submission is believable. */
const MIN_ELAPSED_MS = 3000;

/** Shown to the browser for any send failure. Deliberately says nothing. */
const GENERIC_SEND_ERROR = 'We could not send that just now. Please try again.';

export async function POST(request: Request) {
  // --- Rate limit ---------------------------------------------------------
  if (isRateLimited(clientIp(request))) {
    return json(
      { ok: false, error: 'Too many messages from this connection. Please try again shortly.' },
      429,
    );
  }

  // --- Parse --------------------------------------------------------------
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'We could not read that submission.' }, 400);
  }

  // --- Re-validate. The client's result is never trusted. ------------------
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: 'Please check the highlighted fields.',
        fieldErrors: fieldErrorsFrom(parsed.error),
      },
      400,
    );
  }

  const data = parsed.data;

  // --- Honeypot: a filled hidden field means a bot. Report success and send
  //     nothing, so the bot has no signal that it was caught. ---------------
  if (data.website) {
    return json({ ok: true }, 200);
  }

  // --- Timing check: humans do not complete this form in under 3 seconds. --
  if (data.elapsedMs !== undefined && data.elapsedMs < MIN_ELAPSED_MS) {
    return json({ ok: true }, 200);
  }

  // --- Config -------------------------------------------------------------
  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) {
    // Logged server-side only; misconfiguration never leaks to the client.
    console.error('[contact] CONTACT_TO_EMAIL is not set.');
    return json({ ok: false, error: GENERIC_SEND_ERROR }, 500);
  }

  const submittedAt = new Date();
  const subject = `New enquiry — ${data.name}${data.company ? `, ${data.company}` : ''}`;

  // --- Notification to IntelSol. replyTo means hitting Reply answers the
  //     lead directly rather than ourselves. -------------------------------
  const notification = await sendMail({
    to,
    replyTo: data.email,
    subject,
    html: notificationHtml(data, submittedAt),
    text: notificationText(data, submittedAt),
  });

  if (!notification.ok) {
    console.error(`[contact] Notification failed via ${mailerName()}:`, notification.reason);
    return json({ ok: false, error: GENERIC_SEND_ERROR }, 500);
  }

  // --- Auto-reply to the submitter. A failure here must NOT fail the
  //     request: the enquiry already landed, which is what matters. --------
  const autoReply = await sendMail({
    to: data.email,
    subject: 'Thanks — we got your message',
    html: autoReplyHtml(data.name),
    text: autoReplyText(data.name),
  });

  if (!autoReply.ok) {
    console.error(`[contact] Auto-reply failed via ${mailerName()}:`, autoReply.reason);
  }

  return json({ ok: true }, 200);
}

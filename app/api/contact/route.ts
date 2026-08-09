import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { contactSchema, fieldErrorsFrom, type ContactResponse } from '@/lib/contactSchema';
import {
  autoReplyHtml,
  autoReplyText,
  notificationHtml,
  notificationText,
} from '@/lib/emailTemplate';

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
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // The real reason is logged server-side only; the client gets a generic
    // message so misconfiguration never leaks into a response body.
    console.error(
      '[contact] Missing env:',
      [!apiKey && 'RESEND_API_KEY', !to && 'CONTACT_TO_EMAIL', !from && 'CONTACT_FROM_EMAIL']
        .filter(Boolean)
        .join(', '),
    );
    return json({ ok: false, error: 'We could not send that just now. Please try again.' }, 500);
  }

  const submittedAt = new Date();
  const subject = `New enquiry — ${data.name}${data.company ? `, ${data.company}` : ''}`;

  try {
    const resend = new Resend(apiKey);

    // --- Notification to IntelSol. replyTo means hitting Reply in Gmail
    //     answers the lead directly. ----------------------------------------
    const notification = await resend.emails.send({
      from: `IntelSol AI <${from}>`,
      to: [to],
      replyTo: data.email,
      subject,
      html: notificationHtml(data, submittedAt),
      text: notificationText(data, submittedAt),
    });

    if (notification.error) {
      console.error('[contact] Resend notification failed:', notification.error);
      return json({ ok: false, error: 'We could not send that just now. Please try again.' }, 500);
    }

    // --- Auto-reply to the submitter. A failure here must NOT fail the
    //     request: the enquiry already landed, which is what matters. -------
    try {
      const reply = await resend.emails.send({
        from: `IntelSol AI <${from}>`,
        to: [data.email],
        subject: 'Thanks — we got your message',
        html: autoReplyHtml(data.name),
        text: autoReplyText(data.name),
      });
      if (reply.error) console.error('[contact] Auto-reply failed:', reply.error);
    } catch (error) {
      console.error('[contact] Auto-reply threw:', error);
    }

    return json({ ok: true }, 200);
  } catch (error) {
    console.error('[contact] Send threw:', error);
    return json({ ok: false, error: 'We could not send that just now. Please try again.' }, 500);
  }
}

/* ---------------------------------------------------------------------------
   SMTP alternative (Nodemailer)
   ---------------------------------------------------------------------------
   Ready to swap in if you would rather use your own SMTP server than Resend.
   Install `nodemailer` and `@types/nodemailer`, add the env vars below, then
   replace the `resend.emails.send(...)` calls above with `transport.sendMail`.

   SMTP_HOST=smtp.yourhost.com
   SMTP_PORT=587
   SMTP_USER=
   SMTP_PASS=

   import nodemailer from 'nodemailer';

   const transport = nodemailer.createTransport({
     host: process.env.SMTP_HOST,
     port: Number(process.env.SMTP_PORT ?? 587),
     secure: Number(process.env.SMTP_PORT) === 465,
     auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
   });

   await transport.sendMail({
     from: `IntelSol AI <${from}>`,
     to,
     replyTo: data.email,
     subject,
     html: notificationHtml(data, submittedAt),
     text: notificationText(data, submittedAt),
   });
--------------------------------------------------------------------------- */

import type { Transporter } from 'nodemailer';

/**
 * Email delivery, provider-agnostic.
 *
 * Two backends, chosen by environment variables at runtime:
 *
 *   SMTP    — used when SMTP_HOST, SMTP_USER and SMTP_PASS are all set.
 *             Works immediately with a Gmail App Password, no DNS required.
 *   Resend  — used otherwise, when RESEND_API_KEY is set. Needs a verified
 *             sending domain, but is faster and has better deliverability.
 *
 * Nothing else in the app knows which one is active, so moving from Gmail SMTP
 * to Resend later is an environment-variable change, not a code change.
 */

export type MailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Set so hitting Reply answers the lead, not ourselves. */
  replyTo?: string;
};

export type SendResult = { ok: true } | { ok: false; reason: string };

/* --- Backend selection ----------------------------------------------------- */

type Backend = 'smtp' | 'resend' | 'none';

function activeBackend(): Backend {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) return 'smtp';
  if (process.env.RESEND_API_KEY) return 'resend';
  return 'none';
}

/** Human-readable name for logs and health checks. */
export function mailerName(): string {
  const backend = activeBackend();
  if (backend === 'smtp') return `SMTP (${process.env.SMTP_HOST})`;
  if (backend === 'resend') return 'Resend';
  return 'not configured';
}

/* --- SMTP ------------------------------------------------------------------ */

/**
 * Held at module scope so warm serverless invocations reuse the connection
 * pool instead of paying the TLS handshake on every submission.
 */
let transporter: Transporter | null = null;

async function getTransporter(): Promise<Transporter> {
  if (transporter) return transporter;

  // Imported lazily so the dependency is only pulled in when SMTP is actually
  // the configured backend.
  const nodemailer = await import('nodemailer');
  const port = Number(process.env.SMTP_PORT ?? 587);

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 is implicit TLS; 587 upgrades via STARTTLS.
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    pool: true,
    maxConnections: 1,
  });

  return transporter;
}

async function sendViaSmtp(message: MailMessage, from: string): Promise<SendResult> {
  const transport = await getTransporter();

  await transport.sendMail({
    from,
    to: message.to,
    replyTo: message.replyTo,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });

  return { ok: true };
}

/* --- Resend ---------------------------------------------------------------- */

async function sendViaResend(message: MailMessage, from: string): Promise<SendResult> {
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const result = await resend.emails.send({
    from,
    to: [message.to],
    replyTo: message.replyTo,
    subject: message.subject,
    html: message.html,
    text: message.text,
  });

  if (result.error) {
    return { ok: false, reason: `Resend: ${result.error.message}` };
  }

  return { ok: true };
}

/* --- Public API ------------------------------------------------------------ */

/**
 * Sends one message through whichever backend is configured.
 *
 * Never throws — failures come back as `{ ok: false, reason }` so the caller
 * decides what to surface. The reason is for server logs only; it must not be
 * returned to the browser.
 */
export async function sendMail(message: MailMessage): Promise<SendResult> {
  const backend = activeBackend();

  if (backend === 'none') {
    return {
      ok: false,
      reason:
        'No mail backend configured. Set SMTP_HOST/SMTP_USER/SMTP_PASS, or RESEND_API_KEY.',
    };
  }

  const fromAddress = process.env.CONTACT_FROM_EMAIL;
  if (!fromAddress) {
    return { ok: false, reason: 'CONTACT_FROM_EMAIL is not set.' };
  }

  const from = `IntelSol AI <${fromAddress}>`;

  try {
    return backend === 'smtp'
      ? await sendViaSmtp(message, from)
      : await sendViaResend(message, from);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { ok: false, reason: `${backend}: ${reason}` };
  }
}

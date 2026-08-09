import type { ContactInput } from './contactSchema';

/** Minimal HTML escaping — submissions are untrusted input. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #e6e8eb;font:600 13px/1.4 -apple-system,Segoe UI,Roboto,sans-serif;color:#5b6570;vertical-align:top;width:180px;">${escapeHtml(
        label,
      )}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e6e8eb;font:400 14px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#12161a;white-space:pre-wrap;">${escapeHtml(
        value,
      )}</td>
    </tr>`;
}

/**
 * Internal notification.
 *
 * Light-themed on purpose: this lands in an inbox, not on the site, and dark
 * HTML email renders unpredictably across clients. No tracking pixels.
 */
export function notificationHtml(data: ContactInput, submittedAt: Date): string {
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f5f6f7;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e6e8eb;border-radius:12px;overflow:hidden;">
    <tr>
      <td style="padding:20px 16px;background:#07090c;">
        <span style="font:700 16px/1.2 -apple-system,Segoe UI,Roboto,sans-serif;color:#f2f5f7;">IntelSol<span style="color:#3fdcc0;">AI</span></span>
        <span style="font:400 13px/1.2 -apple-system,Segoe UI,Roboto,sans-serif;color:#79838e;margin-left:10px;">New website enquiry</span>
      </td>
    </tr>
    ${row('Name', data.name)}
    ${row('Email', data.email)}
    ${row('Company', data.company || '—')}
    ${row('Service', data.service || 'Not specified')}
    ${row('Budget', data.budget || 'Not specified')}
    ${row('Message', data.message)}
    ${row('Submitted', submittedAt.toISOString())}
  </table>
  <p style="max-width:640px;margin:16px auto 0;font:400 12px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:#79838e;">
    Reply to this email to answer ${escapeHtml(data.name)} directly.
  </p>
</body></html>`;
}

/** Plain-text alternative — required for deliverability and text-only clients. */
export function notificationText(data: ContactInput, submittedAt: Date): string {
  return [
    'New website enquiry — IntelSol AI',
    '',
    `Name:      ${data.name}`,
    `Email:     ${data.email}`,
    `Company:   ${data.company || '—'}`,
    `Service:   ${data.service || 'Not specified'}`,
    `Budget:    ${data.budget || 'Not specified'}`,
    '',
    'Message:',
    data.message,
    '',
    `Submitted: ${submittedAt.toISOString()}`,
    '',
    'Reply to this email to answer the sender directly.',
  ].join('\n');
}

/* --- Auto-reply to the person who submitted ------------------------------- */

export function autoReplyHtml(name: string): string {
  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f5f6f7;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6e8eb;border-radius:12px;">
    <tr><td style="padding:28px 28px 8px;">
      <p style="margin:0 0 16px;font:400 15px/1.65 -apple-system,Segoe UI,Roboto,sans-serif;color:#12161a;">Hi ${escapeHtml(
        name.split(' ')[0] ?? name,
      )},</p>
      <p style="margin:0 0 16px;font:400 15px/1.65 -apple-system,Segoe UI,Roboto,sans-serif;color:#12161a;">
        Thanks for getting in touch. We've got your message and someone will read it properly
        rather than send you a sequence. You'll hear back within one business day.
      </p>
      <p style="margin:0 0 16px;font:400 15px/1.65 -apple-system,Segoe UI,Roboto,sans-serif;color:#12161a;">
        If it's useful in the meantime, have a think about which single workflow costs your team
        the most hours each week — that's usually where we start.
      </p>
      <p style="margin:0 0 28px;font:400 15px/1.65 -apple-system,Segoe UI,Roboto,sans-serif;color:#12161a;">
        — IntelSol AI
      </p>
    </td></tr>
  </table>
</body></html>`;
}

export function autoReplyText(name: string): string {
  return [
    `Hi ${name.split(' ')[0] ?? name},`,
    '',
    "Thanks for getting in touch. We've got your message and someone will read it properly",
    "rather than send you a sequence. You'll hear back within one business day.",
    '',
    "If it's useful in the meantime, have a think about which single workflow costs your team",
    "the most hours each week — that's usually where we start.",
    '',
    '— IntelSol AI',
  ].join('\n');
}

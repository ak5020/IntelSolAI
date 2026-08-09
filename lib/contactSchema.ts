import { z } from 'zod';

import { budgetOptions, serviceOptions } from './content';

/**
 * The single source of truth for contact-form validation.
 *
 * Imported by the client component (inline errors) AND by the route handler
 * (re-validation). The server never trusts the client result — it re-parses
 * the raw body with this same schema.
 */

/**
 * Disposable-domain blocklist. Deliberately short and obvious: the goal is to
 * stop throwaway addresses on a B2B enquiry form, not to maintain an
 * exhaustive registry. Extend as needed.
 */
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.net',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'throwawaymail.com',
  'yopmail.com',
  'trashmail.com',
  'sharklasers.com',
  'getnada.com',
  'dispostable.com',
  'maildrop.cc',
  'fakeinbox.com',
  'mintemail.com',
]);

function isDisposable(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain !== undefined && DISPOSABLE_DOMAINS.has(domain);
}

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name (at least 2 characters).')
    .max(80, 'Name must be 80 characters or fewer.'),

  email: z
    .string()
    .trim()
    .min(1, 'Work email is required.')
    .email('Enter a valid email address.')
    .max(254, 'That email address is too long.')
    .refine((value) => !isDisposable(value), {
      message: 'Please use a work email address.',
    }),

  company: z
    .string()
    .trim()
    .max(100, 'Company must be 100 characters or fewer.')
    .optional()
    .or(z.literal('')),

  message: z
    .string()
    .trim()
    .min(20, 'Please give us at least 20 characters so we can be useful.')
    .max(1500, 'Message must be 1500 characters or fewer.'),

  service: z
    .enum(serviceOptions as unknown as [string, ...string[]])
    .optional()
    .or(z.literal('')),

  budget: z
    .enum(budgetOptions as unknown as [string, ...string[]])
    .optional()
    .or(z.literal('')),

  // --- Spam controls. Present in the payload but never shown to real users. --

  /**
   * Honeypot. Bots fill it; humans cannot see it.
   *
   * Deliberately unconstrained: if this rejected at the schema level, a filled
   * honeypot would come back as a 400 naming the field, telling the bot
   * exactly what caught it. Instead it validates cleanly and the route handler
   * checks it, returning a normal success while sending nothing.
   */
  website: z.string().optional(),

  /** Milliseconds the form was on screen before submit. Server rejects < 3s. */
  elapsedMs: z.number().int().nonnegative().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Shape returned by the API on every outcome, success or failure. */
export type ContactResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

/** Field-name → first error message, for rendering inline messages. */
export function fieldErrorsFrom(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && out[key] === undefined) {
      out[key] = issue.message;
    }
  }
  return out;
}

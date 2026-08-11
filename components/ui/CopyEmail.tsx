'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { CheckIcon, MailIcon } from '@/components/svg/icons';
import { site } from '@/lib/content';

type Props = {
  /**
   * What the control reads when idle. Defaults to the address itself, which is
   * what the contact section wants; the footer passes a short "Email" instead.
   */
  label?: string;
  className?: string;
  iconClassName?: string;
};

/**
 * Puts the contact address on the clipboard.
 *
 * A button, not a `mailto:` link, because that is the ask — most people are on
 * webmail, where a mailto either does nothing or opens a desktop client they
 * never use, and the thing they actually wanted was the address itself.
 *
 * The address stays visible wherever it was visible before, so nothing is
 * hidden behind the interaction: this only saves a selection drag.
 */
export function CopyEmail({ label, className, iconClassName }: Props) {
  /* `failed` is a real state, not a nicety — clipboard writes are blocked
     outright in some embedded webviews, and silently doing nothing on click is
     the worst possible outcome for the one control that hands over an address. */
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const copy = useCallback(async () => {
    const ok = await writeToClipboard(site.email);
    setState(ok ? 'copied' : 'failed');
    if (resetTimer.current) clearTimeout(resetTimer.current);
    /* Failure sticks around longer — it asks the reader to do something. */
    resetTimer.current = setTimeout(() => setState('idle'), ok ? 2000 : 6000);
  }, []);

  const copied = state === 'copied';

  return (
    <>
      <button
        type="button"
        onClick={copy}
        /* The visible label may be just "Email", so spell the action out. */
        aria-label={`Copy email address ${site.email}`}
        /* The two colour states are mutually exclusive rather than layered:
           `text-body` and `text-accent` are both colour utilities, so having
           both present would leave the winner down to stylesheet order. */
        /* py-2 -my-2 grows the tap target to ~41px without moving a pixel of
           layout — this is now a thing people are meant to hit with a thumb,
           and the text's own 25px line box is a mean target on a phone. */
        className={`group inline-flex items-center gap-3 py-2 -my-2 transition-colors duration-150 ${
          copied ? 'text-accent' : 'text-body hover:text-text'
        } ${className ?? ''}`}
      >
        {copied ? (
          <CheckIcon className={iconClassName ?? 'h-5 w-5'} />
        ) : (
          <MailIcon className={`${iconClassName ?? 'h-5 w-5'} text-muted group-hover:text-text`} />
        )}
        {copied ? 'Copied' : (label ?? site.email)}
      </button>

      {/* Announced to screen readers; `role="status"` is polite by default, so
          it never interrupts whatever is being read. */}
      <span role="status" className="sr-only">
        {copied ? `${site.email} copied to clipboard` : ''}
      </span>

      {state === 'failed' && (
        /* select-all makes one click (or one tap) select the whole address, so
           there is still a fast path when the clipboard is off limits. */
        <span className="mt-2 block select-all text-[0.85rem] text-muted">
          Copy failed — select it here: <span className="text-text">{site.email}</span>
        </span>
      )}
    </>
  );
}

/**
 * Writes to the clipboard, with a fallback for browsers that refuse the modern
 * API. `navigator.clipboard` needs a secure context, so it is missing on plain
 * http — which includes most local network testing.
 */
async function writeToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* Fall through — a rejected promise here usually means a permissions
       policy blocked it, and the legacy path is sometimes still allowed. */
  }

  try {
    const field = document.createElement('textarea');
    field.value = text;
    /* Off-screen rather than hidden: `display:none` elements cannot be
       selected, and focusing a visible field would scroll the page. */
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.top = '-9999px';
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(field);
    return ok;
  } catch {
    return false;
  }
}

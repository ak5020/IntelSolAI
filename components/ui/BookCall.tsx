'use client';

import { useCallback, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';

/* ---------------------------------------------------------------------------
   Calendly trigger
   ---------------------------------------------------------------------------
   Calendly's own embed snippet loads ~90KB of third-party CSS and JS on every
   page view, from a third-party origin, whether or not anyone books. That is
   paid for by every visitor to fund a click a small fraction of them make, and
   it would show up directly in the performance and third-party budgets this
   site is held to.

   So nothing loads until it is needed: the assets are fetched on the first
   hover or focus of the button (by which point a click is likely) and, failing
   that, on the click itself. Until then the button is an ordinary link.

   That also means no Calendly cookie is set on anyone who never expresses
   interest in booking — which is the honest default, and one less thing for a
   cookie banner to have to cover.
--------------------------------------------------------------------------- */

const WIDGET_CSS = 'https://assets.calendly.com/assets/external/widget.css';
const WIDGET_JS = 'https://assets.calendly.com/assets/external/widget.js';

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (options: { url: string }) => void };
  }
}

/** Resolves once the widget is ready. Shared, so parallel triggers load once. */
let loader: Promise<void> | null = null;

function loadCalendly(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('server'));
  if (window.Calendly) return Promise.resolve();
  if (loader) return loader;

  loader = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${WIDGET_CSS}"]`)) {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = WIDGET_CSS;
      document.head.appendChild(css);
    }

    const script = document.createElement('script');
    script.src = WIDGET_JS;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      /* Let a later attempt retry rather than caching the failure forever. */
      loader = null;
      reject(new Error('Calendly failed to load'));
    };
    document.head.appendChild(script);
  });

  return loader;
}

type Props = {
  url: string;
  label: string;
  variant?: 'primary' | 'ghost';
  className?: string;
  /** Fired when the modal is triggered — the mobile drawer uses it to close,
      so the scheduler is not sitting on top of an open menu. */
  onActivate?: () => void;
};

export function BookCall({ url, label, variant = 'primary', className, onActivate }: Props) {
  const [opening, setOpening] = useState(false);
  /* Once the script has failed, stop intercepting: the anchor's own navigation
     is a working booking flow, just in a new tab instead of a modal. */
  const failed = useRef(false);

  const prefetch = useCallback(() => {
    if (failed.current) return;
    void loadCalendly().catch(() => {
      failed.current = true;
    });
  }, []);

  const open = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      /* Never swallow a modified click — cmd/ctrl/middle-click should open the
         booking page in a new tab exactly as the href promises. */
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      if (failed.current) return;

      event.preventDefault();
      onActivate?.();
      setOpening(true);

      loadCalendly()
        .then(() => {
          window.Calendly?.initPopupWidget({ url });
        })
        .catch(() => {
          failed.current = true;
          /* Still honour the click that was just made. */
          window.open(url, '_blank', 'noopener');
        })
        .finally(() => setOpening(false));
    },
    [url, onActivate],
  );

  return (
    <Button
      href={url}
      variant={variant}
      className={className}
      target="_blank"
      rel="noopener"
      onClick={open}
      onPointerEnter={prefetch}
      onFocus={prefetch}
      aria-busy={opening || undefined}
    >
      {label}
    </Button>
  );
}

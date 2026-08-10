'use client';

import { useEffect, useState } from 'react';

import { ArrowUpIcon } from '@/components/svg/icons';

/** Appears once the visitor is roughly a screen and a half down the page. */
const SHOW_AFTER_PX = 900;

/**
 * Back-to-top button, fixed to the bottom-right once the page is scrolled.
 *
 * Stays mounted so it can fade rather than pop, but is removed from the tab
 * order and the accessibility tree while hidden — a focusable control the user
 * cannot see is worse than no control at all.
 */
export function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > SHOW_AFTER_PX;
      // Only re-render on an actual change, not on every scroll event.
      setVisible((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    /* window.scrollTo ignores the CSS `scroll-behavior: auto` that the
       reduced-motion media query sets, so the preference is checked here. */
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      /* Deliberately opaque rather than translucent-with-backdrop-blur: this
         element is fixed and permanently in the DOM, so a backdrop-filter
         would make the compositor re-blur what is behind it on every scroll
         frame. Measured at ~200ms of extra Total Blocking Time. */
      className={`fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-btn border border-line-strong bg-bg-elev text-text transition-[opacity,transform,background-color,border-color] duration-300 hover:border-accent hover:bg-bg-elev-2 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <ArrowUpIcon className="h-5 w-5" />
    </button>
  );
}

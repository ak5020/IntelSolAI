'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Fires once when an element scrolls into view, then disconnects.
 *
 * This is the only scroll-observation primitive in the project — reveals,
 * counters and stroke-draw animations all read from it, so there is exactly
 * one IntersectionObserver pattern to reason about.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.2, rootMargin: '0px 0px -10% 0px' },
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No observer support (or a very old browser): show content immediately
    // rather than leaving it hidden forever.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // fire once
        }
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
    // `options` is a literal at every call site, so an identity check would
    // re-subscribe on every render. The observer is intentionally set up once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}

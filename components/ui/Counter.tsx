'use client';

import { useEffect, useRef, useState } from 'react';

import { useInView } from '@/lib/useInView';

type Props = {
  value: number;
  suffix?: string;
  /** Rendered instead of a count-up, e.g. the static "24/7" figure. */
  staticValue?: string;
};

const DURATION_MS = 1400;

/** easeOutCubic — fast start, settled finish. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts from 0 to `value` when scrolled into view.
 *
 * Zero layout shift: the final string is always present in the DOM via a
 * visually-hidden span that reserves the full width, so the number never
 * changes the element's size as it ticks. Without JS (or with reduced motion)
 * the final value renders immediately.
 */
export function Counter({ value, suffix = '', staticValue }: Props) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [display, setDisplay] = useState(value);
  const frame = useRef<number>(0);

  useEffect(() => {
    if (staticValue !== undefined || !inView) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    setDisplay(0);

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      setDisplay(Math.round(easeOut(progress) * value));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [inView, value, staticValue]);

  if (staticValue !== undefined) {
    return (
      <span ref={ref} className="tabular-nums">
        {staticValue}
      </span>
    );
  }

  return (
    <span ref={ref} className="relative inline-block tabular-nums">
      {/* Reserves the final width so the row never reflows mid-count. */}
      <span aria-hidden="true" className="invisible">
        {value}
        {suffix}
      </span>
      <span className="absolute inset-0">
        {display}
        {suffix}
      </span>
    </span>
  );
}

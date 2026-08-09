'use client';

import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently occupying the viewport, for the
 * nav's active-link underline.
 *
 * Picks the entry closest to the top of the viewport rather than the first
 * intersecting one, so fast scrolls don't leave the underline on a section
 * that has already left the screen.
 */
export function useScrollSpy(ids: readonly string[], offset = 96) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;

        const closest = visible.reduce((best, entry) =>
          Math.abs(entry.boundingClientRect.top) < Math.abs(best.boundingClientRect.top)
            ? entry
            : best,
        );
        setActiveId(closest.target.id);
      },
      {
        // Bias the detection band to the upper half of the viewport so the
        // active link changes as a heading reaches the top, not the middle.
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: 0,
      },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [ids, offset]);

  return activeId;
}

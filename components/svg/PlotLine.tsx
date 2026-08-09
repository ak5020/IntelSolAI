'use client';

import { useInView } from '@/lib/useInView';

/** Total path length, used to seed stroke-dasharray/offset for the draw-on. */
const LENGTH = 1600;

/* Geometry is deliberately confined to the top ~70% of the viewBox. The plot
   is stretched to the row's full height, so a line spanning the whole box
   would cut straight through the small muted labels and read as strikethrough.
   Kept up here it sits behind the large numerals instead, where it belongs. */
const LINE =
  'M0 178 L110 168 L220 180 L330 150 L440 158 L550 128 L660 136 L770 104 L880 112 L990 80 L1100 88 L1200 58';

/**
 * Decorative plot behind the statistics row.
 *
 * Draws itself once, in step with the counters. Under reduced motion the
 * global media query collapses the animation and the `to` state applies
 * immediately, so the line simply appears complete.
 */
export function PlotLine() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <svg
        viewBox="0 0 1200 280"
        preserveAspectRatio="none"
        className="h-full w-full opacity-[0.45]"
        fill="none"
      >
        {/* Baseline grid */}
        <g stroke="var(--color-line)" strokeWidth="1">
          {[58, 98, 138, 178].map((y) => (
            <path key={y} d={`M0 ${y} H1200`} />
          ))}
        </g>

        <path
          d={LINE}
          stroke="var(--color-signal)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={LENGTH}
          strokeDashoffset={LENGTH}
          style={
            inView ? { animation: 'draw 1200ms var(--ease-out-expo) forwards' } : undefined
          }
        />
      </svg>
    </div>
  );
}

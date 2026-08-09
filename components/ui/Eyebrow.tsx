import type { ReactNode } from 'react';

/**
 * Mono section label. The accent tick is the only decoration it gets —
 * it marks the start of a section without spending the accent colour on
 * anything larger.
 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mono flex items-center gap-2.5 text-muted">
      <span aria-hidden="true" className="inline-block h-px w-6 bg-accent" />
      {children}
    </p>
  );
}

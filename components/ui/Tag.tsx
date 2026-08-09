import type { ReactNode } from 'react';

/** Hairline mono badge — capability pills (S2) and product tags (S6). */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="mono inline-flex items-center rounded-badge border border-line bg-bg-elev px-2.5 py-1.5 text-muted">
      {children}
    </span>
  );
}

import type { ReactNode } from 'react';

import { Eyebrow } from './Eyebrow';

type Props = {
  id: string;
  eyebrow?: string;
  heading?: string;
  sub?: string;
  /** Widens the header block; default keeps intro copy readable. */
  headerClassName?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Every section on the page renders through this.
 *
 * It owns the 1px top border, the vertical rhythm (--section-y, never
 * overridden per section), the shell width, and the labelled-landmark
 * wiring — so spacing and semantics cannot drift between sections.
 */
export function SectionShell({
  id,
  eyebrow,
  heading,
  sub,
  headerClassName,
  className,
  children,
}: Props) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={heading ? headingId : undefined}
      className={`relative border-t border-line ${className ?? ''}`}
      style={{ paddingBlock: 'var(--section-y)' }}
    >
      <div className="shell">
        {(eyebrow || heading || sub) && (
          <header className={`mb-12 max-w-3xl md:mb-16 ${headerClassName ?? ''}`}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {heading && (
              <h2 id={headingId} className="mt-4">
                {heading}
              </h2>
            )}
            {sub && <p className="mt-5 max-w-2xl text-body">{sub}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

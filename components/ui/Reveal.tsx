'use client';

import type { ElementType, ReactNode } from 'react';

import { useInView } from '@/lib/useInView';

type Props = {
  children: ReactNode;
  /** Stagger step in ms. Index 2 with step 60 delays by 120ms. */
  index?: number;
  step?: number;
  as?: ElementType;
  className?: string;
};

/**
 * Scroll-reveal wrapper.
 *
 * The hidden state lives in CSS behind `html[data-reveal-ready="true"]`, which
 * only gets set when JS runs (see the bootstrap script in app/layout.tsx). With
 * JS disabled the element is simply visible — content is never gated on this.
 */
export function Reveal({ children, index = 0, step = 60, as, className }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const Tag = (as ?? 'div') as ElementType;

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-revealed={inView ? 'true' : undefined}
      style={{ '--reveal-delay': `${index * step}ms` } as React.CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  );
}

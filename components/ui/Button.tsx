import type { AnchorHTMLAttributes, ReactNode } from 'react';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: 'primary' | 'ghost';
  children: ReactNode;
};

/**
 * Link-styled CTA. Two variants only.
 *
 * `primary` is one of the three places the accent colour is allowed to appear
 * (the others are active tab states and live data points).
 */
export function Button({ href, variant = 'primary', className, children, ...rest }: Props) {
  const base =
    'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-btn px-5 py-3 text-[0.95rem] font-medium transition-colors duration-150';

  const styles =
    variant === 'primary'
      ? 'bg-accent text-accent-ink hover:bg-[#57e6cd]'
      : 'border border-line-strong text-text hover:border-accent hover:bg-bg-elev-2';

  return (
    <a href={href} className={`${base} ${styles} ${className ?? ''}`} {...rest}>
      {children}
    </a>
  );
}

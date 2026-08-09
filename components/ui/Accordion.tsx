'use client';

import { useId, useState } from 'react';

import { ChevronIcon } from '@/components/svg/icons';

type Item = { q: string; a: string };

/**
 * FAQ accordion — one panel open at a time.
 *
 * Height is animated with `grid-template-rows: 0fr → 1fr` (see globals.css),
 * which needs no JS measurement and stays smooth at any content length.
 *
 * The collapsed state is applied only when JS is active, so with JavaScript
 * disabled every answer renders open and readable.
 */
export function Accordion({ items }: { items: readonly Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const open = openIndex === i;
        const buttonId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;

        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-start justify-between gap-6 py-6 text-left text-[1.05rem] font-medium text-text transition-colors duration-150 hover:text-accent md:text-[1.15rem]"
              >
                {item.q}
                <ChevronIcon
                  className={`mt-0.5 h-5 w-5 shrink-0 text-muted transition-transform duration-300 ${
                    open ? 'rotate-180 text-accent' : ''
                  }`}
                />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              data-open={open ? 'true' : 'false'}
              className="acc-panel"
            >
              <div>
                <p className="max-w-2xl pb-6 pr-10 text-body">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

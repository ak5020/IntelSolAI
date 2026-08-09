'use client';

import { useRef, useState } from 'react';

import { FlowDiagram } from '@/components/svg/FlowDiagram';
import { CheckIcon } from '@/components/svg/icons';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { useCases, useCasesCopy } from '@/lib/content';

/**
 * S8 — use cases by team.
 *
 * Real tabs: role="tablist", roving tabindex, Left/Right/Home/End keyboard
 * navigation, and aria-selected driving the active state.
 *
 * With JS disabled the tab strip is hidden by CSS and all four panels render
 * stacked, so no content is trapped behind a control that cannot work.
 */
export function UseCases() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (index: number) => {
    const next = (index + useCases.length) % useCases.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        focusTab(active + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        focusTab(active - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusTab(0);
        break;
      case 'End':
        e.preventDefault();
        focusTab(useCases.length - 1);
        break;
    }
  };

  return (
    <section
      id="use-cases"
      aria-labelledby="use-cases-heading"
      className="defer-paint border-t border-line"
      style={{ paddingBlock: 'var(--section-y)' }}
    >
      <div className="shell">
        <header className="mb-12 max-w-3xl md:mb-16">
          <Eyebrow>{useCasesCopy.eyebrow}</Eyebrow>
          <h2 id="use-cases-heading" className="mt-4">
            {useCasesCopy.heading}
          </h2>
        </header>

        <div
          role="tablist"
          aria-label="Use cases by team"
          onKeyDown={onKeyDown}
          className="tablist mb-10 flex-wrap gap-2 border-b border-line pb-3"
        >
          {useCases.map((tab, i) => (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={active === i}
              aria-controls={`panel-${tab.id}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={`min-h-[44px] rounded-btn px-4 py-2.5 text-[0.95rem] transition-colors duration-150 ${
                active === i
                  ? 'bg-accent-soft text-accent'
                  : 'text-body hover:bg-bg-elev-2 hover:text-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {useCases.map((tab, i) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            tabIndex={0}
            data-active={active === i ? 'true' : 'false'}
            className="tab-panel grid gap-10 lg:grid-cols-12 lg:gap-14"
          >
            <div className="lg:col-span-7">
              {/* Visible only in the no-JS stacked view; the tab label already
                  names the panel once the strip is active. */}
              <h3 className="mb-6 lg:hidden">{tab.label}</h3>
              <ul className="flex flex-col gap-3">
                {tab.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-card border border-line bg-bg-elev px-5 py-4"
                  >
                    <CheckIcon className="h-4 w-4 shrink-0 text-accent" />
                    <span className="text-body">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <FlowDiagram id={tab.id} steps={tab.flow} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

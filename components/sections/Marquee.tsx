import { marquee } from '@/lib/content';

/**
 * S3 — two rows scrolling in opposite directions.
 *
 * The track holds the list twice and translates by exactly -50%, so the loop
 * is seamless. Pure CSS: no JS, no measurement, paused on hover or focus.
 */
function Row({ items, direction }: { items: readonly string[]; direction: 'left' | 'right' }) {
  return (
    <div className="marquee overflow-hidden py-4">
      <div
        className="marquee-track"
        style={{ animationName: direction === 'left' ? 'marquee-left' : 'marquee-right' }}
      >
        {/* Rendered twice. The second copy is hidden from assistive tech so
            screen readers don't hear the whole list repeated. */}
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
            className="mono flex shrink-0 items-center text-muted"
          >
            {items.map((item) => (
              <li key={item} className="flex items-center whitespace-nowrap">
                <span className="px-6">{item}</span>
                <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-line-strong" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <section aria-label="Tools we work with and outcomes we target" className="border-t border-line py-10">
      <Row items={marquee.tools} direction="left" />
      <Row items={marquee.outcomes} direction="right" />
    </section>
  );
}

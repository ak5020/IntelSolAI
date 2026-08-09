import { FallbackGlyph, integrationGlyphs } from '@/components/svg/IntegrationGlyphs';
import { Reveal } from '@/components/ui/Reveal';
import { SectionShell } from '@/components/ui/SectionShell';
import { integrations, integrationsCopy } from '@/lib/content';

/** Grid columns at the widest breakpoint, used to compute the diagonal wave. */
const COLUMNS = 4;

/**
 * S10 — integration tiles.
 *
 * The reveal runs on a diagonal: delay is derived from row + column, so the
 * grid fills from the top-left corner outward rather than row by row.
 */
export function Integrations() {
  return (
    <SectionShell
      id="integrations"
      eyebrow={integrationsCopy.eyebrow}
      heading={integrationsCopy.heading}
      className="defer-paint"
    >
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {integrations.map((name, i) => {
          const Glyph = integrationGlyphs[name] ?? FallbackGlyph;
          const diagonal = Math.floor(i / COLUMNS) + (i % COLUMNS);

          return (
            <Reveal as="li" key={name} index={diagonal} step={50}>
              <div className="group flex h-full items-center gap-3 rounded-card border border-line bg-bg-elev px-4 py-4 transition-colors duration-150 hover:border-line-strong hover:bg-bg-elev-2">
                <Glyph className="h-5 w-5 shrink-0 text-muted transition-colors duration-150 group-hover:text-text" />
                <span className="mono truncate text-muted transition-colors duration-150 group-hover:text-text">
                  {name}
                </span>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </SectionShell>
  );
}

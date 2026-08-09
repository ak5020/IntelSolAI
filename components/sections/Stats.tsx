import { PlotLine } from '@/components/svg/PlotLine';
import { Counter } from '@/components/ui/Counter';
import { Reveal } from '@/components/ui/Reveal';
import { SectionShell } from '@/components/ui/SectionShell';
import { stats, statsCopy } from '@/lib/content';

/**
 * S5 — impact figures.
 *
 * {/* TODO: CONFIRM REAL METRIC *\/}
 * Every animated figure in lib/content.ts is a realistic placeholder, not a
 * measured IntelSol result. Replace before launch — tracked in HANDOFF.md.
 */
export function Stats() {
  return (
    <SectionShell
      id="impact"
      eyebrow={statsCopy.eyebrow}
      heading={statsCopy.heading}
      className="defer-paint"
    >
      <div className="relative">
        <PlotLine />
        <dl className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            /*
              A <dl> may only contain <dt>/<dd> pairs or a single <div> wrapping
              them, and <dt> must precede its <dd>. Reveal renders that one
              wrapping div itself, and flex-col-reverse puts the figure above
              its label visually without breaking the required source order.
            */
            <Reveal
              key={stat.id}
              index={i}
              className="flex flex-col-reverse border-t border-line pt-6"
            >
              <dt className="mono mt-4 text-muted">{stat.label}</dt>
              <dd className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-bold leading-none tracking-[-0.03em] text-accent">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  staticValue={'staticValue' in stat ? stat.staticValue : undefined}
                />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </SectionShell>
  );
}

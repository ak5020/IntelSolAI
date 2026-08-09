import { Reveal } from '@/components/ui/Reveal';
import { SectionShell } from '@/components/ui/SectionShell';
import { processCopy, processSteps } from '@/lib/content';

/**
 * S7 — the four-step engagement sequence.
 *
 * Numbering is justified here because the steps genuinely happen in order.
 * The connecting line is a CSS-drawn hairline: horizontal on desktop,
 * vertical on mobile, and it scales with the grid instead of being positioned
 * by JavaScript.
 */
export function Process() {
  return (
    <SectionShell
      id="process"
      eyebrow={processCopy.eyebrow}
      heading={processCopy.heading}
      className="defer-paint"
    >
      <ol className="relative grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {/* Connector: drawn behind the step markers. */}
        <div
          aria-hidden="true"
          className="absolute left-[7px] top-2 hidden h-[calc(100%-2rem)] w-px bg-line md:block lg:left-0 lg:top-[7px] lg:h-px lg:w-full"
        />

        {processSteps.map((step, i) => (
          <Reveal as="li" key={step.n} index={i} className="relative">
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 block h-3.5 w-3.5 rounded-full border border-accent bg-bg"
            />
            <div className="pl-8 lg:pl-0 lg:pt-10">
              <span className="mono text-accent">{step.n}</span>
              <h3 className="mt-3 text-[1.25rem]">{step.title}</h3>
              <p className="mt-3 text-[0.95rem] text-body">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </SectionShell>
  );
}

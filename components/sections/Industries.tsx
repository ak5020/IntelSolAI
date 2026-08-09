import { industryIcons } from '@/components/svg/icons';
import { Reveal } from '@/components/ui/Reveal';
import { SectionShell } from '@/components/ui/SectionShell';
import { industries, industriesCopy } from '@/lib/content';

/** S9 — six compact industry tiles, same icon language as the services grid. */
export function Industries() {
  return (
    <SectionShell
      id="industries"
      eyebrow={industriesCopy.eyebrow}
      heading={industriesCopy.heading}
      className="defer-paint"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry, i) => {
          const Icon = industryIcons[industry.icon];
          return (
            <Reveal as="li" key={industry.id} index={i}>
              <article className="group flex h-full items-start gap-4 rounded-card border border-line bg-bg-elev p-5 transition-colors duration-150 hover:border-line-strong hover:bg-bg-elev-2">
                <Icon className="mt-0.5 h-6 w-6 shrink-0 text-muted transition-colors duration-150 group-hover:text-accent" />
                <div>
                  <h3 className="text-[1.05rem]">{industry.title}</h3>
                  <p className="mt-2 text-[0.925rem] text-body">{industry.body}</p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </ul>
    </SectionShell>
  );
}

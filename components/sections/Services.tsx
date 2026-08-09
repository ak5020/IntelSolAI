import { serviceIcons } from '@/components/svg/icons';
import { Reveal } from '@/components/ui/Reveal';
import { SectionShell } from '@/components/ui/SectionShell';
import { services, servicesCopy } from '@/lib/content';

/**
 * S4 — six service cards.
 *
 * Hover does three things and stops: border, background, icon colour. No
 * scale, no shadow, no glow.
 */
export function Services() {
  return (
    <SectionShell
      id="services"
      eyebrow={servicesCopy.eyebrow}
      heading={servicesCopy.heading}
      sub={servicesCopy.sub}
      className="defer-paint"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => {
          const Icon = serviceIcons[service.icon];
          return (
            <Reveal as="li" key={service.id} index={i}>
              <article className="group h-full rounded-card border border-line bg-bg-elev p-6 transition-colors duration-150 hover:border-line-strong hover:bg-bg-elev-2">
                <Icon className="h-6 w-6 text-muted transition-colors duration-150 group-hover:text-accent" />
                <h3 className="mt-5 text-[1.15rem]">{service.title}</h3>
                <p className="mt-3 text-[0.95rem] text-body">{service.body}</p>
              </article>
            </Reveal>
          );
        })}
      </ul>
    </SectionShell>
  );
}

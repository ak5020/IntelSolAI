import Image from 'next/image';

import { LinkedInIcon } from '@/components/svg/icons';
import { Reveal } from '@/components/ui/Reveal';
import { SectionShell } from '@/components/ui/SectionShell';
import { aboutCopy, team } from '@/lib/content';

/**
 * S11b — who IntelSol is and who you'll work with.
 *
 * Story and principles on the left, leadership portraits on the right; the two
 * columns stack below lg. Portraits share one square crop and one studio-grey
 * backdrop so they read as a set regardless of how each was originally shot.
 */
export function About() {
  return (
    <SectionShell
      id="about"
      eyebrow={aboutCopy.eyebrow}
      heading={aboutCopy.heading}
      sub={aboutCopy.sub}
      className="defer-paint"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
        {/* --- Principles ------------------------------------------------- */}
        <ul className="grid content-start gap-8 sm:grid-cols-3 sm:gap-6 lg:col-span-5 lg:grid-cols-1 lg:gap-0">
          {aboutCopy.principles.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              index={i}
              className="border-t border-line pt-5 lg:pb-8 lg:pt-6 lg:first:border-t-0 lg:first:pt-0"
            >
              <h3 className="flex items-center gap-3 text-[1.15rem]">
                <span aria-hidden="true" className="mono text-accent">
                  0{i + 1}
                </span>
                {item.title}
              </h3>
              <p className="mt-3 text-[0.95rem] text-body">{item.body}</p>
            </Reveal>
          ))}
        </ul>

        {/* --- Team ------------------------------------------------------- */}
        <div className="lg:col-span-7">
          <h3 className="sr-only">{aboutCopy.teamHeading}</h3>
          <ul className="grid gap-6 sm:grid-cols-2">
            {team.map((person, i) => (
              <Reveal
                as="li"
                key={person.name}
                index={i}
                className="overflow-hidden rounded-card border border-line bg-bg-elev"
              >
                <article>
                  <div className="relative aspect-square overflow-hidden bg-bg-elev-2">
                    <Image
                      src={person.photo}
                      alt={`Portrait of ${person.name}, ${person.role} of IntelSol AI`}
                      fill
                      sizes="(min-width: 1240px) 340px, (min-width: 1024px) 27vw, (min-width: 640px) 45vw, 92vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-[1.2rem]">{person.name}</h4>
                        <p className="mono mt-1 text-accent">{person.role}</p>
                      </div>
                      {person.linkedin && (
                        <a
                          href={person.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${person.name} on LinkedIn`}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn border border-line text-muted transition-colors hover:border-line-strong hover:text-text"
                        >
                          <LinkedInIcon className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                    <p className="mt-4 text-[0.95rem] text-body">{person.bio}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}

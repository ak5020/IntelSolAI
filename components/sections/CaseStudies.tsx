import { ArrowRightIcon } from '@/components/svg/icons';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { Tag } from '@/components/ui/Tag';
import { caseStudies, caseStudiesCopy } from '@/lib/caseStudies';

/**
 * S6d — case studies index.
 *
 * One card per study, each linking to its own page. The cards open in a new
 * tab because these pages are the destination for paid traffic: someone
 * reading a case study should not lose the landing page they arrived on, and
 * the tab they came from is where the contact form lives.
 */
export function CaseStudies() {
  return (
    <section
      id="case-studies"
      aria-labelledby="case-studies-heading"
      className="defer-paint border-t border-line"
      style={{ paddingBlock: 'var(--section-y)' }}
    >
      <div className="shell">
        <header className="mb-12 max-w-3xl md:mb-16">
          <Eyebrow>{caseStudiesCopy.eyebrow}</Eyebrow>
          <h2 id="case-studies-heading" className="mt-4">
            {caseStudiesCopy.heading}
          </h2>
          <p className="mt-5 max-w-2xl text-body">{caseStudiesCopy.sub}</p>
        </header>

        <ul className="flex flex-col gap-5">
          {caseStudies.map((study, i) => (
            <Reveal as="li" key={study.slug} index={i} step={70}>
              {/*
                The whole card is the link, with the visible button styled as a
                span. One tab stop and one hit target rather than a card that
                looks clickable but only responds on a small button.
              */}
              <a
                href={`/${study.slug}`}
                target="_blank"
                rel="noopener"
                className="group block rounded-card border border-line bg-bg-elev p-6 transition-[border-color,background-color] duration-300 hover:border-line-strong hover:bg-bg-elev-2 focus-visible:border-accent sm:p-8"
              >
                <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-7">
                    <p className="mono text-accent">{study.category}</p>
                    <h3 className="mt-3 text-[clamp(1.35rem,2.4vw,1.9rem)]">{study.cardTitle}</h3>
                    <p className="mt-4 max-w-2xl text-body">{study.cardSummary}</p>

                    <span className="mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-btn border border-line-strong px-5 py-3 text-[0.95rem] font-medium text-text transition-colors duration-150 group-hover:border-accent group-hover:bg-bg-elev">
                      View case study
                      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>

                  {/* The stack is the proof on the card — it says what was
                      actually built before anyone opens the page. */}
                  <div className="lg:col-span-5">
                    <p className="mono mb-3 text-muted">Built with</p>
                    <ul className="flex flex-wrap gap-2">
                      {study.technologies.slice(0, 5).map((tech) => (
                        <li key={tech}>
                          <Tag>{tech}</Tag>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

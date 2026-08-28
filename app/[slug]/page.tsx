import type { Metadata } from 'next';

import { DemandIqFlow } from '@/components/svg/DemandIqFlow';
import { ArrowRightIcon, CheckIcon } from '@/components/svg/icons';
import { Logo } from '@/components/svg/Logo';
import { SeoFlow } from '@/components/svg/SeoFlow';
import { Footer } from '@/components/sections/Footer';
import { BookCall } from '@/components/ui/BookCall';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { ScrollTop } from '@/components/ui/ScrollTop';
import { Tag } from '@/components/ui/Tag';
import { VideoPlayer } from '@/components/ui/VideoPlayer';
import { type CaseStudy, caseStudies, caseStudyBySlug } from '@/lib/caseStudies';
import { contactCta, primaryCta, site } from '@/lib/content';

/* ---------------------------------------------------------------------------
   Case study detail pages — /lead-qualification, /whatsapp-commerce, etc.
   ---------------------------------------------------------------------------
   These sit at the root rather than under /case-studies/ because the client
   wants short, ad-friendly URLs. Next resolves static segments before dynamic
   ones, so /robots.txt, /sitemap.xml, /icon.svg, /opengraph-image and /api/*
   are unaffected by this catch-all.

   `dynamicParams = false` is what stops it behaving like a catch-all for
   everything else: any slug not returned by generateStaticParams 404s instead
   of being rendered on demand.
--------------------------------------------------------------------------- */

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudyBySlug(slug);
  if (!study) return {};

  return {
    title: study.meta.title,
    description: study.meta.description,
    alternates: { canonical: `/${study.slug}` },
    openGraph: {
      type: 'article',
      url: `${site.url}/${study.slug}`,
      siteName: site.name,
      title: study.meta.title,
      description: study.meta.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: study.meta.title,
      description: study.meta.description,
    },
  };
}

/** Article + breadcrumb, plus a VideoObject where the study has a recording. */
function jsonLd(study: CaseStudy) {
  const url = `${site.url}/${study.slug}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}/#article`,
        headline: study.title,
        description: study.meta.description,
        articleSection: study.category,
        mainEntityOfPage: url,
        author: { '@id': `${site.url}/#organization` },
        publisher: { '@id': `${site.url}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Case studies',
            item: `${site.url}/#case-studies`,
          },
          { '@type': 'ListItem', position: 3, name: study.title, item: url },
        ],
      },
      ...(study.media.kind === 'video'
        ? [
            {
              '@type': 'VideoObject',
              name: `${study.media.title} — demo`,
              description: study.meta.description,
              thumbnailUrl: [`${site.url}${study.media.poster}`],
              uploadDate: '2026-08-16',
              contentUrl: `${site.url}${study.media.sources.mp4}`,
            },
          ]
        : []),
    ],
  };
}

/** Heading + prose + ticked list, repeated for challenge / solution / stack. */
function DetailSection({
  id,
  title,
  body,
  points,
  index,
}: {
  id: string;
  title: string;
  body: string;
  points: readonly string[];
  index: number;
}) {
  return (
    <Reveal as="section" index={index} className="mt-14 md:mt-20">
      <h2 id={id} className="text-[clamp(1.4rem,2.6vw,2rem)]">
        {title}
      </h2>
      <p className="mt-5 max-w-3xl text-body">{body}</p>
      <ul className="mt-7 flex max-w-3xl flex-col gap-3.5">
        {points.map((point) => (
          <li key={point} className="flex gap-3.5">
            <CheckIcon className="mt-0.5 h-[1.15rem] w-[1.15rem] shrink-0 text-accent" />
            <span className="text-body">{point}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  /* generateStaticParams plus dynamicParams=false guarantees this resolves;
     the guard exists so the type is narrowed rather than asserted. */
  const study = caseStudyBySlug(slug);
  if (!study) return null;

  const related = caseStudies.filter((other) => other.slug !== study.slug);

  return (
    <>
      <script
        type="application/ld+json"
        // Our own static copy, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(study)) }}
      />

      {/* Header: deliberately simpler than the landing nav. Someone arriving
          here from an ad needs the way home and the CTA, not a section menu
          for a page they are not on. */}
      <header className="sticky top-0 z-50 border-b border-line bg-bg/[0.88] backdrop-blur-xl">
        <div className="shell flex h-[72px] items-center justify-between gap-4">
          <a href="/" aria-label="IntelSolAI home" className="shrink-0">
            <Logo />
          </a>
          <BookCall
            url={primaryCta.href}
            label={primaryCta.label}
            className="hidden sm:inline-flex"
          />
        </div>
      </header>

      <main id="main">
        <article className="shell" style={{ paddingBlock: 'clamp(40px, 6vh, 72px)' }}>
          <a
            href="/#case-studies"
            className="mono inline-flex min-h-[44px] items-center gap-2 text-muted transition-colors duration-150 hover:text-text"
          >
            <ArrowRightIcon className="h-4 w-4 rotate-180" />
            Back to case studies
          </a>

          <Reveal className="mt-6">
            <Eyebrow>{study.category}</Eyebrow>
            <h1 className="mt-4 max-w-4xl text-[clamp(2rem,4.6vw,3.4rem)]">{study.title}</h1>
          </Reveal>

          <Reveal index={1} className="mt-12 md:mt-16">
            <h2 className="text-[clamp(1.4rem,2.6vw,2rem)]">Project overview</h2>
            <p className="mt-5 max-w-3xl text-body">{study.overview}</p>
          </Reveal>

          {/* --- The artefact: a recording, or the workflow redrawn --------- */}
          <Reveal index={2} className="mt-10">
            {study.media.kind === 'video' ? (
              <VideoPlayer
                title={study.media.title}
                width={study.media.width}
                height={study.media.height}
                poster={study.media.poster}
                sources={study.media.sources}
              />
            ) : study.media.diagram === 'demand-iq' ? (
              <DemandIqFlow />
            ) : (
              <SeoFlow />
            )}
            <p className="mt-4 max-w-3xl text-[0.9rem] text-muted">{study.media.caption}</p>
          </Reveal>

          <DetailSection
            id="challenge"
            title="The challenge"
            body={study.challenge.body}
            points={study.challenge.points}
            index={0}
          />
          <DetailSection
            id="solution"
            title="Our solution"
            body={study.solution.body}
            points={study.solution.points}
            index={0}
          />
          <DetailSection
            id="technical"
            title="Technical implementation"
            body={study.technical.body}
            points={study.technical.points}
            index={0}
          />

          <Reveal className="mt-12">
            <p className="mono mb-4 text-muted">Technologies</p>
            <ul className="flex flex-wrap gap-2">
              {study.technologies.map((tech) => (
                <li key={tech}>
                  <Tag>{tech}</Tag>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* --- Key results ------------------------------------------------ */}
          <Reveal className="mt-14 md:mt-20">
            <div className="rounded-card border border-accent bg-bg-elev p-6 sm:p-8">
              <h2 className="text-[clamp(1.4rem,2.6vw,2rem)]">Key results</h2>
              <ul className="mt-6 flex flex-col gap-4">
                {study.results.map((result) => (
                  <li key={result} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span className="text-body">{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal className="mt-14 md:mt-20">
            <h2 className="text-[clamp(1.4rem,2.6vw,2rem)]">Why it matters</h2>
            <p className="mt-5 max-w-3xl text-body">{study.whyItMatters}</p>
          </Reveal>

          <Reveal className="mt-14 md:mt-20">
            <h2 className="text-[clamp(1.4rem,2.6vw,2rem)]">Services behind this project</h2>
            <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {study.servicesBehind.map((service) => (
                <li
                  key={service.title}
                  className="rounded-card border border-line bg-bg-elev p-5"
                >
                  <h3 className="text-[1.02rem]">{service.title}</h3>
                  <p className="mt-2 text-[0.92rem] text-muted">{service.body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </article>

        {/* --- Related studies ---------------------------------------------- */}
        <section
          aria-labelledby="related-heading"
          className="border-t border-line"
          style={{ paddingBlock: 'var(--section-y)' }}
        >
          <div className="shell">
            <h2 id="related-heading" className="text-[clamp(1.4rem,2.6vw,2rem)]">
              Related case studies
            </h2>
            <ul className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((other, i) => (
                <Reveal as="li" key={other.slug} index={i}>
                  <a
                    href={`/${other.slug}`}
                    className="group flex h-full flex-col rounded-card border border-line bg-bg-elev p-6 transition-[border-color,background-color] duration-300 hover:border-line-strong hover:bg-bg-elev-2"
                  >
                    <p className="mono text-accent">{other.category}</p>
                    <h3 className="mt-3 text-[1.05rem]">{other.cardTitle}</h3>
                    <p className="mt-3 flex-1 text-[0.92rem] text-muted">{other.cardSummary}</p>
                    <span className="mono mt-5 inline-flex items-center gap-2 text-text">
                      Read the case study
                      <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* --- Closing CTA --------------------------------------------------- */}
        <section
          aria-labelledby="cs-cta-heading"
          className="border-t border-line"
          style={{ paddingBlock: 'var(--section-y)' }}
        >
          <div className="shell text-center">
            <Eyebrow>Get started</Eyebrow>
            <h2 id="cs-cta-heading" className="mt-4 text-[clamp(1.8rem,3.6vw,2.8rem)]">
              Have a workflow like this one?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-body">
              Tell us what your team is doing manually. We&apos;ll map one workflow, estimate the
              impact, and tell you honestly whether it&apos;s worth building.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <BookCall url={primaryCta.href} label={primaryCta.label} />
              <Button href={`/${contactCta.href}`} variant="ghost">
                {contactCta.label}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollTop />
    </>
  );
}

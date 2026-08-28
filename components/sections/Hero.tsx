import { OrbitGraphic } from '@/components/svg/OrbitGraphic';
import { BookCall } from '@/components/ui/BookCall';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Tag } from '@/components/ui/Tag';
import { hero } from '@/lib/content';

/**
 * S2 — Hero.
 *
 * A Server Component: the page's LCP text ships as HTML with no client
 * JavaScript involved. The load-in sequence is a pure CSS stagger driven by
 * animation-delay, so nothing here waits on hydration.
 */
export function Hero() {
  /* Load order: eyebrow → each H1 line → sub → CTAs → pills, 60ms apart. */
  const step = (i: number) => ({ animationDelay: `${i * 60}ms` });

  return (
    <section id="top" className="relative overflow-hidden pt-[112px]" style={{ paddingBottom: 'var(--section-y)' }}>
      {/* Single subtle radial wash behind the hero — cheap CSS, no image. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, rgb(63 220 192 / 0.07), transparent 70%)',
        }}
      />

      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <div className="hero-in" style={step(0)}>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </div>

          <h1 className="mt-6">
            {hero.headingLines.map((line, i) => (
              <span key={line} className="hero-in block" style={step(i + 1)}>
                {line}
              </span>
            ))}
          </h1>

          <p className="hero-in mt-7 max-w-xl text-body" style={step(3)}>
            {hero.sub}
          </p>

          <div className="hero-in mt-9 flex flex-wrap gap-3" style={step(4)}>
            <BookCall url={hero.ctaPrimary.href} label={hero.ctaPrimary.label} />
            <Button href={hero.ctaSecondary.href} variant="ghost">
              {hero.ctaSecondary.label}
            </Button>
          </div>

          <ul className="hero-in mt-9 flex flex-wrap gap-2" style={step(5)}>
            {hero.pills.map((pill) => (
              <li key={pill}>
                <Tag>{pill}</Tag>
              </li>
            ))}
          </ul>

          <ul
            className="hero-in mono mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 text-muted"
            style={step(6)}
          >
            {hero.trustLine.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {i > 0 && (
                  <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-line-strong" />
                )}
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Signature graphic — fades in last, at 400ms. */}
        <div className="hero-in lg:col-span-6" style={{ animationDelay: '400ms' }}>
          <OrbitGraphic idPrefix="hero-orbit" />
        </div>
      </div>
    </section>
  );
}

import { LinkedInIcon } from '@/components/svg/icons';
import { OrbitGraphic } from '@/components/svg/OrbitGraphic';
import { CopyEmail } from '@/components/ui/CopyEmail';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { contact, site } from '@/lib/content';

import { ContactForm } from './ContactForm';

/**
 * S12 — closing CTA and contact form.
 *
 * The hero's orbit graphic returns here as quiet background texture at 6%
 * opacity, so the page visually closes where it opened. It sits behind the
 * form at a low enough opacity that input contrast is unaffected, and it is
 * aria-hidden and pointer-events-none so it cannot interfere with the form.
 */
export function Cta() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden border-t border-line"
      style={{ paddingBlock: 'var(--section-y)' }}
    >
      <OrbitGraphic
        variant="ambient"
        idPrefix="cta-orbit"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-[0.06]"
      />

      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Eyebrow>{contact.eyebrow}</Eyebrow>
          <h2 id="contact-heading" className="mt-4">
            {contact.heading}
          </h2>
          <p className="mt-5 max-w-lg text-body">{contact.sub}</p>

          <ul className="mt-9 flex flex-col gap-4">
            <li>
              <CopyEmail />
            </li>
            <li>
              <a
                href={site.linkedin}
                rel="noopener noreferrer"
                target="_blank"
                className="inline-flex items-center gap-3 text-body transition-colors duration-150 hover:text-text"
              >
                <LinkedInIcon className="h-5 w-5 text-muted" />
                IntelSol AI on LinkedIn
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

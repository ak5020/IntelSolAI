import { LinkedInIcon, MailIcon } from '@/components/svg/icons';
import { Logo } from '@/components/svg/Logo';
import { footer, navLinks, site } from '@/lib/content';

/** S13 — footer. */
export function Footer() {
  return (
    <footer className="border-t border-line" style={{ paddingBlock: 'clamp(56px, 8vh, 88px)' }}>
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-5 max-w-sm text-[0.95rem] text-body">{footer.description}</p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h2 className="mono mb-4 text-muted">Page</h2>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[0.95rem] text-body transition-colors duration-150 hover:text-text"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <h2 className="mono mb-4 text-muted">Services</h2>
            <ul className="flex flex-col gap-3">
              {footer.serviceLinks.map((service) => (
                <li key={service} className="text-[0.95rem] text-body">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="mono mb-4 text-muted">Contact</h2>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="inline-flex items-center gap-2 text-[0.95rem] text-body transition-colors duration-150 hover:text-text"
                >
                  <MailIcon className="h-4 w-4" />
                  Email
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-[0.95rem] text-body transition-colors duration-150 hover:text-text"
                >
                  <LinkedInIcon className="h-4 w-4" />
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mono mt-14 flex flex-col gap-4 border-t border-line pt-8 text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          {/* Renders nothing while footer.legal is empty — see lib/content.ts */}
          {footer.legal.length > 0 && (
            <ul className="flex gap-6">
              {footer.legal.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="transition-colors duration-150 hover:text-text">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}

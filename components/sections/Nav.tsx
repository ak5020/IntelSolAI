'use client';

import { useEffect, useState } from 'react';

import { Logo } from '@/components/svg/Logo';
import { BookCall } from '@/components/ui/BookCall';
import { navLinks, primaryCta } from '@/lib/content';
import { useScrollSpy } from '@/lib/useScrollSpy';

const SECTION_IDS = navLinks.map((l) => l.href.slice(1));

/**
 * S1 — fixed header.
 *
 * Transparent at the top of the page; after 40px it picks up a translucent
 * background, a blur and a bottom hairline. The active link is driven by the
 * shared scroll-spy hook.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useScrollSpy(SECTION_IDS);

  /* Scroll state. Passive listener, and the comparison guards against
     setState on every single scroll event. */
  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 40;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Lock body scroll and allow Escape to close while the overlay is open. */
  useEffect(() => {
    if (!menuOpen) {
      document.body.removeAttribute('data-scroll-locked');
      return;
    }
    document.body.setAttribute('data-scroll-locked', 'true');

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.removeAttribute('data-scroll-locked');
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || menuOpen
          ? 'border-b border-line bg-bg/[0.88] backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <nav aria-label="Primary" className="shell flex h-[72px] items-center justify-between">
        {/* The accessible name must start with the visible text ("IntelSolAI"),
            otherwise voice-control users cannot activate what they can read. */}
        <a href="#top" aria-label="IntelSolAI home" className="shrink-0">
          <Logo />
        </a>

        {/* Desktop links ------------------------------------------------- */}
        <ul className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const active = activeId === link.href.slice(1);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={active ? 'true' : undefined}
                  className={`relative py-2 text-[0.95rem] transition-colors duration-150 ${
                    active ? 'text-text' : 'text-body hover:text-text'
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-300 ${
                      active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <BookCall
            url={primaryCta.href}
            label={primaryCta.label}
            /* !hidden / sm:!inline-flex, not the bare utilities: Button's base
               classes already set inline-flex unconditionally, so a
               non-important `hidden` here has equal specificity and loses to
               it depending on Tailwind's internal rule order — which is
               exactly what let this button render at every width, including
               the phone sizes it was meant to disappear at. */
            className="!hidden !min-h-[44px] !px-4 !py-2.5 !text-[0.9rem] sm:!inline-flex"
          />

          {/* Hamburger → close, morphed with transforms on two lines rather
              than swapping two different icons. */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-11 w-11 items-center justify-center rounded-btn text-text lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line
                x1="4"
                y1="9"
                x2="20"
                y2="9"
                className="origin-center transition-transform duration-300"
                style={menuOpen ? { transform: 'translateY(3px) rotate(45deg)' } : undefined}
              />
              <line
                x1="4"
                y1="15"
                x2="20"
                y2="15"
                className="origin-center transition-transform duration-300"
                style={menuOpen ? { transform: 'translateY(-3px) rotate(-45deg)' } : undefined}
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>

    {/*
      The overlay lives OUTSIDE <header> on purpose.

      The header carries `backdrop-blur` once scrolled or opened, and
      backdrop-filter makes an element the containing block for its
      position:fixed descendants — exactly like transform and filter do. Nested
      inside, this panel's `top-[72px] bottom-0` resolved against the header's
      72px box instead of the viewport and collapsed to 1px tall, so the menu
      opened to nothing on every mobile device.
    */}
    <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto border-t border-line bg-bg lg:hidden"
      >
        <ul className="shell flex flex-col py-6">
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setMenuOpen(false)}
                data-reveal=""
                data-revealed={menuOpen ? 'true' : undefined}
                style={{ '--reveal-delay': `${i * 60}ms` } as React.CSSProperties}
                className="block border-b border-line py-5 font-display text-2xl font-semibold text-text"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="shell pb-10">
          <BookCall
            url={primaryCta.href}
            label={primaryCta.label}
            className="w-full"
            onActivate={() => setMenuOpen(false)}
          />
        </div>
    </div>
    </>
  );
}

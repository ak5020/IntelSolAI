import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, JetBrains_Mono, Public_Sans } from 'next/font/google';
import type { ReactNode } from 'react';

import { services, site } from '@/lib/content';

/**
 * Google Analytics (GA4) measurement ID.
 *
 * Read from the environment rather than hardcoded so a staging deploy can run
 * with analytics off, or point at a different property, without a code
 * change. Falls back to the ID the client supplied, since this is a public
 * identifier (it is meant to appear in every page's HTML) rather than a
 * secret — unlike CONTACT_TO_EMAIL or SMTP_PASS, there is nothing to protect
 * by keeping it out of the repo.
 */
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-MQHJ4LMT0F';

import './globals.css';

/* ---------------------------------------------------------------------------
   Fonts — self-hosted by next/font, latin subset only, no runtime CDN request.
   Only the weights actually used are requested.
--------------------------------------------------------------------------- */

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
  variable: '--font-bricolage',
  preload: true, // paints the LCP element
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-public-sans',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-jetbrains',
});

/* ---------------------------------------------------------------------------
   Metadata
--------------------------------------------------------------------------- */

const title = 'IntelSol AI — AI Automation, AI Agents & Voice AI Development Company';
const description =
  'IntelSol builds agentic AI systems, voice AI agents, chatbots, and workflow automation for startups, fintech, and B2B SaaS. 6+ years of product engineering, measured on real business ROI.';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  /* The card image itself comes from app/opengraph-image.tsx — Next injects
     it into both openGraph and twitter, so it is not repeated here. */
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: site.name,
    title,
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export const viewport = {
  themeColor: '#07090c',
  width: 'device-width',
  initialScale: 1,
};

/* ---------------------------------------------------------------------------
   Structured data — SITE-WIDE ONLY.

   Organization, WebSite and ProfessionalService describe the business, so they
   are true on every page and belong here. Anything that describes THIS page's
   content does not: FAQPage and the product VideoObjects moved to app/page.tsx
   when the case-study routes were added, because emitting them from the layout
   put FAQ markup on pages with no FAQ on them and video markup on pages with
   no video. Google treats that as a mismatch between markup and content, which
   costs the rich result it was meant to earn.
--------------------------------------------------------------------------- */

function jsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        description: site.oneLiner,
        logo: { '@type': 'ImageObject', url: `${site.url}/images/logo.svg` },
        sameAs: [site.linkedin],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'sales',
            email: site.email,
            availableLanguage: ['English'],
          },
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: site.name,
        description,
        publisher: { '@id': `${site.url}/#organization` },
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${site.url}/#service`,
        name: site.name,
        url: site.url,
        description,
        parentOrganization: { '@id': `${site.url}/#organization` },
        serviceType: [
          'AI automation',
          'AI agents development',
          'Agentic AI',
          'Voice AI agents',
          'AI chatbot development',
          'Workflow automation',
          'RAG applications',
          'LLM integration',
        ],
        areaServed: 'Worldwide',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'AI automation and engineering services',
          itemListElement: services.map((service) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: service.title,
              description: service.body,
            },
          })),
        },
      },
    ],
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${publicSans.variable} ${jetbrains.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          // Content is our own static copy, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
        />
        {/*
          Marks the document as JS-capable. Every progressive enhancement in
          the CSS (reveals, accordion collapse, tab strip) keys off this, so
          with JS disabled the page renders fully expanded instead of hiding
          content behind controls that cannot run.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.revealReady='true'`,
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div className="noise" aria-hidden="true" />
        {children}
        {/*
          Renders Google's gtag.js via next/script under the hood, which is
          why this isn't the raw <script> tags from the snippet Google gives
          you: their version loads eagerly in <head> and competes with the
          hero for bandwidth on the connection that matters most for LCP.
          `@next/third-parties` uses strategy="afterInteractive", so it loads
          after the page is already interactive instead of blocking the
          content a visitor is there to see — same tag, same G- ID, better
          loading behaviour.

          One instance, in the root layout, is what puts it on every route —
          the landing page and all four case-study pages — without risking
          the duplicate-tag mistake Google's own instructions warn against.
        */}
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}

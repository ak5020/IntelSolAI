import { CaseStudies } from '@/components/sections/CaseStudies';
import { Clients } from '@/components/sections/Clients';
import { Cta } from '@/components/sections/Cta';
import { Faq } from '@/components/sections/Faq';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { Industries } from '@/components/sections/Industries';
import { Integrations } from '@/components/sections/Integrations';
import { Marquee } from '@/components/sections/Marquee';
import { Nav } from '@/components/sections/Nav';
import { Process } from '@/components/sections/Process';
import { Products } from '@/components/sections/Products';
import { Services } from '@/components/sections/Services';
import { Stats } from '@/components/sections/Stats';
import { Workflow } from '@/components/sections/Workflow';
import { ScrollTop } from '@/components/ui/ScrollTop';
import { UseCases } from '@/components/sections/UseCases';
import { faqs, products, site } from '@/lib/content';

/* ---------------------------------------------------------------------------
   Structured data for THIS page only.

   The site-wide graph (Organization, WebSite, ProfessionalService) is emitted
   by the root layout. FAQPage and the product VideoObjects live here instead,
   because they describe content that exists on the landing page and nowhere
   else — putting them in the layout advertised an FAQ on every case-study
   page, which is a markup/content mismatch and loses the rich result.
--------------------------------------------------------------------------- */
function jsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        '@id': `${site.url}/#faq`,
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
      ...products.map((product) => ({
        '@type': 'VideoObject',
        name: `${product.title} — product demo`,
        description: product.description,
        thumbnailUrl: [`${site.url}${product.poster}`],
        uploadDate: product.uploadDate,
        contentUrl: `${site.url}${product.sources.mp4}`,
      })),
    ],
  };
}

/** Section composition only — all markup lives in the section components. */
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // Our own static copy, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Services />
        <Workflow />
        <Stats />
        <Products />
        <Clients />
        <CaseStudies />
        <Process />
        <UseCases />
        <Industries />
        <Integrations />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <ScrollTop />
    </>
  );
}

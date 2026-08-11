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

/** Section composition only — all markup lives in the section components. */
export default function Page() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Services />
        <Workflow />
        <Stats />
        <Products />
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

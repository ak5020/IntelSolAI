import { Accordion } from '@/components/ui/Accordion';
import { SectionShell } from '@/components/ui/SectionShell';
import { faqCopy, faqs } from '@/lib/content';

/** S11 — accordion FAQ. Mirrored exactly by the FAQPage JSON-LD in layout. */
export function Faq() {
  return (
    <SectionShell
      id="faq"
      eyebrow={faqCopy.eyebrow}
      heading={faqCopy.heading}
      className="defer-paint"
    >
      <div className="max-w-3xl">
        <Accordion items={faqs} />
      </div>
    </SectionShell>
  );
}

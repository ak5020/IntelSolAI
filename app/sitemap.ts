import type { MetadataRoute } from 'next';

import { caseStudies } from '@/lib/caseStudies';
import { site } from '@/lib/content';

/**
 * The landing page plus one entry per case study.
 *
 * In-page anchors are deliberately not listed — they are not separate
 * documents. The case studies are, and they are the pages paid traffic lands
 * on, so they need to be discoverable in their own right.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${site.url}/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...caseStudies.map((study) => ({
      url: `${site.url}/${study.slug}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ];
}

import type { MetadataRoute } from 'next';

import { site } from '@/lib/content';

/** Single-page site: one canonical URL. In-page anchors are not sitemap entries. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}

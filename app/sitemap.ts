import type { MetadataRoute } from 'next';

const BASE = 'https://run.aiporate.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/pricing', '/for-gyms', '/for-workshops', '/demo', '/start', '/new', '/talk-to-us'];
  return pages.map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7,
  }));
}

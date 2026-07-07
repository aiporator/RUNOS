import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/articles';
import { CITIES } from '@/lib/cities';
import { WORKSHOP_TYPES } from '@/lib/workshop-types';

const BASE = 'https://run.aiporate.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '', '/pricing', '/for-gyms', '/for-workshops', '/for-runners', '/demo', '/start', '/new',
    '/talk-to-us', '/articles', '/cities', '/discover', '/workshops',
  ];
  const articlePages = ARTICLES.map((a) => `/articles/${a.slug}`);
  const cityPages = CITIES.map((c) => `/cities/${c.slug}`);
  const workshopTypePages = WORKSHOP_TYPES.map((w) => `/workshops/${w.slug}`);
  return [...pages, ...articlePages, ...cityPages, ...workshopTypePages].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7,
  }));
}

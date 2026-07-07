import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/articles';
import { CITIES } from '@/lib/cities';

const BASE = 'https://run.aiporate.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '', '/pricing', '/for-gyms', '/for-workshops', '/for-runners', '/demo', '/start', '/new',
    '/talk-to-us', '/articles', '/cities', '/discover',
  ];
  const articlePages = ARTICLES.map((a) => `/articles/${a.slug}`);
  const cityPages = CITIES.map((c) => `/cities/${c.slug}`);
  return [...pages, ...articlePages, ...cityPages].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7,
  }));
}

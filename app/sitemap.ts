import type { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/articles';

const BASE = 'https://run.aiporate.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/pricing', '/for-gyms', '/for-workshops', '/demo', '/start', '/new', '/talk-to-us', '/articles'];
  const articlePages = ARTICLES.map((a) => `/articles/${a.slug}`);
  return [...pages, ...articlePages].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7,
  }));
}

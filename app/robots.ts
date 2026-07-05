import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Private/workspace surfaces stay out of the index.
        disallow: ['/my', '/app/', '/api/'],
      },
    ],
    sitemap: 'https://run.aiporate.com/sitemap.xml',
  };
}

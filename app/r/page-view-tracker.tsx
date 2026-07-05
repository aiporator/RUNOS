'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';

export default function PageViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    track('public_page_viewed', { slug });
  }, [slug]);
  return null;
}

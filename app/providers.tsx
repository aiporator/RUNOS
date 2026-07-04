'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { initAnalytics, trackPageview } from '@/lib/analytics';

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (pathname) trackPageview(pathname);
  }, [pathname]);

  return <>{children}</>;
}

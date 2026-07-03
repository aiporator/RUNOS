'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type ParallaxBgProps = {
  /** Parallax speed factor, e.g. 0.16. */
  speed: number;
  className?: string;
  children?: ReactNode;
};

/**
 * Background layer that drifts vertically as its parent section scrolls
 * through the viewport. Disabled entirely under prefers-reduced-motion.
 */
export default function ParallaxBg({ speed, className, children }: ParallaxBgProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const parent = el.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const offset = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
      el.style.transform = `translateY(${offset}px)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

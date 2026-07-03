'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type RevealProps = {
  children?: ReactNode;
  className?: string;
  /** Stagger delay step (maps to .mk-rv-d1 … .mk-rv-d4). */
  delay?: 1 | 2 | 3 | 4;
  id?: string;
};

/**
 * IntersectionObserver wrapper: renders a div with the `.mk-rv` reveal class
 * and adds `.in` once scrolled into view. With prefers-reduced-motion the
 * CSS renders the final state immediately.
 */
export default function Reveal({ children, className, delay, id }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = ['mk-rv', delay ? `mk-rv-d${delay}` : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={ref} id={id} className={cls}>
      {children}
    </div>
  );
}

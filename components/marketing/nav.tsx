'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { arr, btnVolt, btnSm } from './styles';

type MarketingNavProps = {
  /** '' on the homepage (in-page anchors), '/' on other pages (link back home). */
  anchorPrefix?: string;
};

export default function MarketingNav({ anchorPrefix = '' }: MarketingNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 400 && y > lastY);
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links: Array<{ href: string; text: string }> = [
    { href: `${anchorPrefix}#surfaces`, text: 'Product' },
    { href: `${anchorPrefix}#pacer`, text: 'Pacer AI' },
    { href: '/new', text: 'Create event' },
    { href: '/pricing', text: 'Pricing' },
    { href: `${anchorPrefix}#faq`, text: 'FAQ' },
  ];

  return (
    <nav
      className={[
        'fixed inset-x-0 top-0 z-[100] border-b transition-all duration-[450ms] ease-out-expo',
        scrolled
          ? 'border-line bg-bg/70 backdrop-blur-xl'
          : 'border-transparent bg-transparent',
        hidden ? '-translate-y-full' : 'translate-y-0',
      ].join(' ')}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-[18px]">
        <Link
          href="/"
          className="flex items-center gap-[9px] font-display text-[22px] font-bold tracking-[-0.02em]"
        >
          <span className="pulse-dot h-[11px] w-[11px] rounded-full bg-volt shadow-[0_0_14px_#cdfb50]" />
          RunOS
        </Link>
        <div className="hidden items-center gap-[34px] text-sm font-medium text-muted md:flex">
          {links.map((l) => (
            <Link key={l.text} href={l.href} className="mk-nav-link hover:text-paper">
              {l.text}
            </Link>
          ))}
          <Link href="/demo" className="text-[13px] text-muted-2 transition-colors hover:text-volt">
            Live demo
          </Link>
        </div>
        <Link href="/new" className={`group ${btnVolt} ${btnSm}`}>
          Start free <span className={arr}>→</span>
        </Link>
      </div>
    </nav>
  );
}

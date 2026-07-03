'use client';

import { useEffect, useRef, useState } from 'react';
import type { Faq } from './data';

function FaqItem({
  faq,
  open,
  onToggle,
}: {
  faq: Faq;
  open: boolean;
  onToggle: () => void;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const measure = () => {
      if (innerRef.current) setHeight(innerRef.current.scrollHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const maxHeight = open ? (height !== null ? `${height}px` : 'none') : '0px';

  return (
    <div className="border-b border-white/[0.12]">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-5 border-none bg-transparent py-[26px] text-left font-display text-lg font-semibold text-paper transition-colors duration-300 hover:text-volt"
      >
        {faq.q}
        <span
          className={[
            'relative grid h-[34px] w-[34px] flex-none place-items-center rounded-full border transition-all duration-[450ms] ease-out-expo',
            open
              ? 'rotate-[135deg] border-volt bg-volt text-ink'
              : 'rotate-0 border-white/25 text-paper',
          ].join(' ')}
          aria-hidden="true"
        >
          <span className="absolute h-[1.7px] w-[13px] bg-current" />
          <span className="absolute h-[13px] w-[1.7px] bg-current" />
        </span>
      </button>
      <div className="mk-faq-a" style={{ maxHeight }}>
        <div ref={innerRef}>
          <p className="pb-[26px] pr-[46px] text-[15.5px] text-paper/[0.68]">{faq.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqAccordion({ items }: { items: Faq[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="flex flex-col">
      {items.map((f, i) => (
        <FaqItem
          key={f.q}
          faq={f}
          open={openIdx === i}
          onToggle={() => setOpenIdx((cur) => (cur === i ? null : i))}
        />
      ))}
    </div>
  );
}

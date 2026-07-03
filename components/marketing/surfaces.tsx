'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Reveal from './reveal';
import { SURFACES } from './data';
import { label } from './styles';

export default function SurfacesSection() {
  const [idx, setIdx] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  // Auto-rotate every 6s; restart the timer whenever a chip is clicked.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      setIdx((i) => (i + 1) % SURFACES.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [resetKey]);

  const select = (i: number) => {
    setIdx(i);
    setResetKey((k) => k + 1);
  };

  const active = SURFACES[idx];

  return (
    <section className="bg-bg py-[120px]" id="surfaces">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="mb-14 max-w-[760px]">
          <span className={`${label} text-muted`}>The OS reveal</span>
          <h2 className="mb-5 font-display text-[clamp(34px,4.6vw,60px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            One platform. <em className="not-italic text-volt">Eight surfaces.</em> Everything
            connected.
          </h2>
          <p className="text-[17px] text-muted">
            Strava owns activity. WhatsApp owns communication. Eventbrite owns events. Nobody owns
            the operating system. Until now.
          </p>
        </Reveal>

        <Reveal delay={1} className="mb-10 flex flex-wrap gap-2.5">
          <div role="tablist" className="contents">
            {SURFACES.map((s, i) => (
              <button
                key={s.k}
                role="tab"
                type="button"
                aria-selected={i === idx}
                onClick={() => select(i)}
                className={[
                  'rounded-full border px-[22px] py-[11px] font-display text-[14.5px] transition-all duration-300 ease-out-expo',
                  i === idx
                    ? 'border-volt bg-volt font-semibold text-ink'
                    : 'border-line bg-transparent font-medium text-muted hover:-translate-y-0.5 hover:border-paper hover:text-paper',
                ].join(' ')}
              >
                {s.k}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal
          delay={2}
          className="group grid min-h-[430px] grid-cols-1 overflow-hidden rounded-[26px] border border-line bg-bg-2 lg:grid-cols-[1.05fr_0.95fr]"
        >
          {/* visual (stacked crossfade) */}
          <div className="relative order-first min-h-[260px] overflow-hidden bg-gradient-to-br from-[#232a14] to-bg-2 lg:order-last lg:min-h-0">
            {SURFACES.map((s, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={`${s.k}-${i}`}
                src={s.img}
                alt={i === idx ? s.k : ''}
                loading={i === 0 ? 'eager' : 'lazy'}
                className={[
                  'absolute inset-0 h-full w-full object-cover [filter:saturate(0.8)_contrast(1.02)] transition-[opacity,transform] duration-700 ease-out-expo group-hover:scale-105',
                  i === idx ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
              />
            ))}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,#12140f_100%)] lg:bg-[linear-gradient(90deg,#12140f_0%,transparent_32%)]" />
          </div>

          {/* copy */}
          <div
            key={idx}
            className="mk-panel-in flex flex-col justify-center gap-[18px] px-7 py-9 lg:px-[54px] lg:py-[52px]"
          >
            <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-volt">
              {active.k}
            </span>
            <h3 className="font-display text-[clamp(26px,2.8vw,38px)] font-semibold leading-[1.05] tracking-[-0.02em]">
              {active.h}
            </h3>
            <p className="text-[16.5px] text-muted">{active.p}</p>
            <Link
              href="/app"
              className="group/link mt-1.5 inline-flex w-max items-center gap-2 font-display text-[15px] font-semibold text-volt"
            >
              {active.cta}{' '}
              <span className="transition-transform duration-300 ease-out-expo group-hover/link:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

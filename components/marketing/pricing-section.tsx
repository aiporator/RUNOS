'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import Reveal from './reveal';
import { TIERS, type Tier } from './data';
import { arr, btnDark, btnVolt, label } from './styles';

type Mode = 'monthly' | 'annual';

/** Animated dollar figure — eases between monthly and annual values. */
function AnimatedPrice({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = value;
    if (from === value) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }
    const t0 = performance.now();
    const dur = 500;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (value - from) * ease));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{display}</>;
}

function BillingToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  const monthlyRef = useRef<HTMLButtonElement>(null);
  const annualRef = useRef<HTMLButtonElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  const place = useCallback(() => {
    const btn = (mode === 'annual' ? annualRef : monthlyRef).current;
    if (btn) setPill({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [mode]);

  useEffect(() => {
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [place]);

  const btnCls = (active: boolean) =>
    [
      'relative z-[1] rounded-full border-none bg-transparent px-6 py-2.5 font-display text-sm font-semibold transition-colors duration-300',
      active ? 'text-ink' : 'text-muted-dark',
    ].join(' ');

  return (
    <div className="flex justify-center">
      <div className="relative inline-flex rounded-full border border-line-dark bg-white p-[5px]">
        {pill ? (
          <span
            className="absolute bottom-[5px] top-[5px] rounded-full bg-volt transition-all duration-[400ms] ease-out-expo"
            style={{ left: pill.left, width: pill.width }}
          />
        ) : null}
        <button ref={monthlyRef} type="button" className={btnCls(mode === 'monthly')} onClick={() => onChange('monthly')}>
          Monthly
        </button>
        <button ref={annualRef} type="button" className={btnCls(mode === 'annual')} onClick={() => onChange('annual')}>
          Annual <span className="ml-1.5 text-xs font-semibold text-volt-deep">2 months free</span>
        </button>
      </div>
    </div>
  );
}

function TierCard({
  tier,
  mode,
  full,
  delay,
}: {
  tier: Tier;
  mode: Mode;
  full: boolean;
  delay?: 1 | 2 | 3 | 4;
}) {
  const featured = tier.featured === true;
  const feats = full ? tier.fullFeatures : tier.features;
  const price = mode === 'annual' ? tier.annual : tier.monthly;

  return (
    <Reveal
      delay={delay}
      className={[
        'relative flex flex-col rounded-3xl border px-[34px] py-10 transition-all duration-500 ease-out-expo',
        featured
          ? 'border-ink bg-ink text-paper lg:scale-[1.03] hover:-translate-y-2.5 hover:shadow-[0_34px_80px_rgba(16,18,8,0.32)]'
          : 'border-line-dark bg-white text-ink hover:-translate-y-2.5 hover:shadow-[0_30px_70px_rgba(16,18,8,0.14)]',
      ].join(' ')}
    >
      {tier.badge ? (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-volt px-[18px] py-[7px] font-display text-xs font-bold uppercase tracking-[0.06em] text-ink">
          {tier.badge}
        </span>
      ) : null}
      <div className="mb-1.5 font-display text-xl font-semibold">{tier.name}</div>
      <p className={`mb-[26px] text-sm ${featured ? 'text-muted' : 'text-muted-dark'}`}>
        {tier.audience}
      </p>
      <div className="font-display text-[56px] font-bold leading-none tracking-[-0.03em]">
        {tier.monthly === null ? (
          <>{tier.customPrice}</>
        ) : (
          <>
            $<AnimatedPrice value={price ?? 0} />
            <span className={`text-base font-medium tracking-normal ${featured ? 'text-muted' : 'text-muted-dark'}`}>
              /mo
            </span>
          </>
        )}
      </div>
      <p className={`mb-[26px] mt-2 min-h-[20px] text-[13.5px] ${featured ? 'text-muted' : 'text-muted-dark'}`}>
        {tier.priceLine ?? (mode === 'annual' ? 'Billed annually — 2 months free' : 'Billed monthly')}
      </p>
      <ul className="mb-[34px] flex flex-1 flex-col gap-3 text-[14.5px]">
        {feats.map((f) => (
          <li key={f} className="flex items-start gap-[11px]">
            <span className="mk-check" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>
      <p className={`mb-[18px] text-[13.5px] italic ${featured ? 'text-muted' : 'text-muted-dark'}`}>
        {tier.tagline}
      </p>
      <Link href="/app" className={`group justify-center ${featured ? btnVolt : btnDark}`}>
        {tier.ctaLabel} <span className={arr}>→</span>
      </Link>
    </Reveal>
  );
}

type PricingSectionProps = {
  /** false = homepage preview (3 tiers + Network band); true = /pricing full 4-tier comparison. */
  full?: boolean;
};

export default function PricingSection({ full = false }: PricingSectionProps) {
  const [mode, setMode] = useState<Mode>('monthly');
  const tiers = full ? TIERS : TIERS.filter((t) => t.name !== 'Network');
  const network = TIERS.find((t) => t.name === 'Network');

  return (
    <section className="bg-paper pb-[110px] pt-[120px] text-ink" id="pricing">
      <div className="mx-auto max-w-[1200px] px-6">
        {!full ? (
          <Reveal className="mx-auto mb-11 max-w-[640px] text-center">
            <span className={`${label} text-muted-dark`}>Choose your operating level</span>
            <h2 className="mb-[18px] font-display text-[clamp(34px,4.4vw,56px)] font-semibold leading-[1.05] tracking-[-0.02em]">
              Pricing that scales with your club. Not against it.
            </h2>
            <p className="text-muted-dark">
              Members never pay. The club subscribes — and the platform fee shrinks as you grow.
            </p>
          </Reveal>
        ) : null}

        <Reveal delay={1} className="mb-14">
          <BillingToggle mode={mode} onChange={setMode} />
        </Reveal>

        <div
          className={[
            'grid grid-cols-1 items-stretch gap-6',
            full ? 'md:grid-cols-2 xl:grid-cols-4' : 'lg:grid-cols-3',
          ].join(' ')}
        >
          {tiers.map((t, i) => (
            <TierCard
              key={t.name}
              tier={t}
              mode={mode}
              full={full}
              delay={i === 0 ? undefined : (Math.min(i, 4) as 1 | 2 | 3 | 4)}
            />
          ))}
        </div>

        {!full && network ? (
          <>
            <Reveal className="mt-[26px] flex flex-wrap items-center justify-between gap-6 rounded-card border border-line-dark bg-white px-9 py-[30px] transition-all duration-[400ms] ease-out-expo hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(16,18,8,0.1)]">
              <div>
                <h3 className="mb-1.5 font-display text-xl font-semibold">
                  Network — custom, from $999/mo
                </h3>
                <p className="max-w-[58ch] text-[14.5px] text-muted-dark">
                  For multi-chapter orgs, franchises, cities, and federations. Unlimited members,
                  white-label mobile app, API access, SSO, SLA, dedicated CSM.
                </p>
              </div>
              <Link href="/talk-to-us" className={`group ${btnDark}`}>
                Talk to us <span className={arr}>→</span>
              </Link>
            </Reveal>
            <Reveal className="mt-[30px] text-center text-[13.5px] text-muted-dark">
              Watch the platform fee shrink as you grow: 2% on Starter → 1% on Club → 0.5% on Pro.
            </Reveal>
            <Reveal className="mt-6 text-center">
              <Link
                href="/pricing"
                className="group inline-flex items-center gap-2 font-display text-[15px] font-semibold text-volt-deep"
              >
                See full pricing{' '}
                <span className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          </>
        ) : null}
      </div>
    </section>
  );
}

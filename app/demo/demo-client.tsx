'use client';

// Client interactivity for /demo — vertical picker + sticky conversion bar.
// Both instrument the funnel via lib/analytics.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { track } from '@/lib/analytics';
import { VERTICALS } from '@/lib/verticals';
import { arr, btnVolt } from '@/components/marketing/styles';

export function VerticalPicker() {
  const router = useRouter();

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {VERTICALS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => {
              track('demo_started', { vertical: v.id });
              router.push('/app');
            }}
            className="group rounded-card border border-line bg-bg-2 p-5 text-left transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-volt/50 hover:shadow-[0_14px_40px_rgba(205,251,80,0.12)]"
          >
            <div className="text-[28px]">{v.emoji}</div>
            <div className="mt-3 font-display text-[15px] font-semibold text-paper transition-colors group-hover:text-volt">
              {v.label}
            </div>
            <div className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{v.headline}</div>
            <div className="mt-3 text-[12px] font-semibold text-volt opacity-0 transition-opacity group-hover:opacity-100">
              Enter demo →
            </div>
          </button>
        ))}
      </div>
      <p className="mt-4 text-[12.5px] text-muted-2">
        Demo workspace shows the running-club dataset; your workspace adapts to your vertical.
      </p>
    </div>
  );
}

export function StickyStartBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-line bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div>
          <div className="font-display text-[15px] font-semibold text-paper">
            Ready to set up your own?
          </div>
          <div className="text-[12.5px] text-muted">
            Free forever under 50 members. No credit card.
          </div>
        </div>
        <Link
          href="/start"
          onClick={() => track('cta_clicked', { cta: 'demo_to_start' })}
          className={`group ${btnVolt}`}
        >
          Start free <span className={arr}>→</span>
        </Link>
      </div>
    </div>
  );
}

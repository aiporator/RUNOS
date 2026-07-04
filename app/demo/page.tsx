import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingNav from '@/components/marketing/nav';
import MarketingFooter from '@/components/marketing/footer';
import { StickyStartBar, VerticalPicker } from './demo-client';

export const metadata: Metadata = {
  title: 'Live demo — RunOS',
  description:
    'A live, fully seeded RunOS workspace — Harbor City Runners, 48 members, real workflows. Click anything. Break nothing.',
};

const TOUR_STOPS: Array<{ n: string; title: string; notice: string; href: string }> = [
  {
    n: '01',
    title: 'Dashboard',
    notice: 'Notice the WACM north-star metric — engagement, not vanity numbers, front and center.',
    href: '/app',
  },
  {
    n: '02',
    title: 'QR check-in live',
    notice: 'Notice attendance flowing straight into the CRM — no clipboard, no spreadsheet.',
    href: '/app/events/evt_001/checkin',
  },
  {
    n: '03',
    title: 'Ask Pacer',
    notice: 'Notice the AI already drafted win-back messages for every at-risk member.',
    href: '/app/intelligence',
  },
  {
    n: '04',
    title: 'Sponsor pipeline',
    notice: 'Notice the deal stages and perk redemptions — sponsorship as a system, not a favor.',
    href: '/app/partners',
  },
];

export default function DemoPage() {
  return (
    <div className="bg-bg text-paper">
      <MarketingNav anchorPrefix="/" />

      {/* hero */}
      <header className="relative isolate overflow-hidden pb-16 pt-[180px]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_70%_0%,rgba(205,251,80,0.09),transparent_70%)]" />
        <div className="mx-auto max-w-[1200px] px-6">
          <span className="mb-[22px] inline-flex items-center gap-2.5 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-volt before:h-[1.5px] before:w-[26px] before:bg-volt before:content-['']">
            Live demo — no signup
          </span>
          <h1 className="mk-fade-up max-w-[16ch] font-display text-[clamp(40px,6vw,84px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            See it working in <em className="not-italic text-volt">60 seconds.</em>
          </h1>
          <p
            className="mk-fade-up mt-6 max-w-[54ch] text-[clamp(16px,1.5vw,19px)] text-muted"
            style={{ animationDelay: '0.2s' }}
          >
            This is a live, fully seeded workspace — Harbor City Runners, 48 members, real
            workflows. Click anything. Break nothing.
          </p>
        </div>
      </header>

      {/* choose your world */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24">
        <h2 className="mb-2 font-display text-[clamp(24px,3vw,34px)] font-semibold tracking-[-0.02em]">
          Choose your world
        </h2>
        <p className="mb-8 max-w-[52ch] text-[15px] text-muted">
          One OS, many kinds of communities. Pick the one that looks like yours and step inside.
        </p>
        <VerticalPicker />
      </section>

      {/* guided tour */}
      <section className="border-t border-line bg-bg-2/40 py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="mb-2 font-display text-[clamp(24px,3vw,34px)] font-semibold tracking-[-0.02em]">
            Guided tour
          </h2>
          <p className="mb-8 max-w-[52ch] text-[15px] text-muted">
            Four screens where the money is. Deep-link straight in — every one is live.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TOUR_STOPS.map((stop) => (
              <Link
                key={stop.n}
                href={stop.href}
                className="group rounded-card border border-line bg-bg-2 p-5 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-volt/50"
              >
                <div className="font-display text-[13px] font-bold text-volt">{stop.n}</div>
                <div className="mt-2 font-display text-[16px] font-semibold text-paper transition-colors group-hover:text-volt">
                  {stop.title}
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{stop.notice}</p>
                <div className="mt-4 text-[12.5px] font-semibold text-volt">Open →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* footer + breathing room above the sticky bar */}
      <div className="pb-24">
        <MarketingFooter anchorPrefix="/" />
      </div>

      <StickyStartBar />
    </div>
  );
}

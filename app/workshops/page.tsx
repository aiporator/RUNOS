import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingNav from '@/components/marketing/nav';
import MarketingFooter from '@/components/marketing/footer';
import Reveal from '@/components/marketing/reveal';
import { label } from '@/components/marketing/styles';
import { WorkshopTypeIcon } from '@/components/icons/workshop-type-icons';
import { WORKSHOP_TYPES } from '@/lib/workshop-types';

export const metadata: Metadata = {
  title: 'Workshop software by craft — pottery, woodworking, cooking & more — RunOS',
  description:
    'RunOS built for how your specific craft actually runs, not a generic events page. Pottery, woodworking, cooking, photography, painting, jewelry, floristry, textile.',
};

export default function WorkshopsIndexPage() {
  return (
    <main className="overflow-x-clip bg-bg text-paper">
      <MarketingNav anchorPrefix="/" />

      <header className="relative isolate overflow-hidden pb-16 pt-[160px]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_30%_0%,rgba(205,251,80,0.08),transparent_70%)]" />
        <div className="mx-auto max-w-[960px] px-6">
          <span className={`${label} text-volt`}>Built for your specific craft</span>
          <h1 className="mb-5 font-display text-[clamp(34px,5.5vw,60px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Every workshop is different. Your software should know that.
          </h1>
          <p className="max-w-[62ch] text-[16px] text-muted">
            A pottery studio orders clay by the confirmed headcount. A woodworking shop caps
            capacity at the tool count, not the room size. A florist buys stock the morning of,
            with no restocking. Pick your craft — the page is written for it, not templated
            around it.
          </p>
        </div>
      </header>

      <section className="pb-[120px]">
        <div className="mx-auto max-w-[960px] px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {WORKSHOP_TYPES.map((w, i) => (
              <Reveal key={w.slug} delay={i === 0 ? undefined : (Math.min(i, 4) as 1 | 2 | 3 | 4)}>
                <Link
                  href={`/workshops/${w.slug}`}
                  className="group flex items-start gap-4 rounded-card border border-line bg-bg-2 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-volt/40"
                >
                  <div className="grid h-12 w-12 flex-none place-items-center rounded-xl border border-volt/25 bg-volt/8">
                    <WorkshopTypeIcon id={w.id} className="h-6 w-6 text-volt" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-[17px] font-semibold transition-colors group-hover:text-volt">
                      {w.name}
                    </div>
                    {w.germanTerm && (
                      <div className="mt-0.5 text-[11.5px] text-muted-2">{w.germanTerm}</div>
                    )}
                    <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{w.tagline}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter anchorPrefix="/" />
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingNav from '@/components/marketing/nav';
import MarketingFooter from '@/components/marketing/footer';
import Reveal from '@/components/marketing/reveal';
import { label } from '@/components/marketing/styles';
import { CITIES } from '@/lib/cities';

export const metadata: Metadata = {
  title: 'RunOS by city — Cologne, Düsseldorf, Frankfurt, München, Berlin, Amsterdam, Paris, Barcelona',
  description:
    'RunOS is expanding city by city. See what running club software looks like in your city, or be the founding club that brings it there.',
};

export default function CitiesIndexPage() {
  return (
    <main className="overflow-x-clip bg-bg text-paper">
      <MarketingNav anchorPrefix="/" />

      <header className="relative isolate overflow-hidden pb-16 pt-[160px]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_30%_0%,rgba(205,251,80,0.08),transparent_70%)]" />
        <div className="mx-auto max-w-[900px] px-6">
          <span className={`${label} text-volt`}>City by city</span>
          <h1 className="mb-5 font-display text-[clamp(34px,5.5vw,60px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            RunOS, wherever your club runs.
          </h1>
          <p className="max-w-[60ch] text-[16px] text-muted">
            The founding-club program is landing city by city. Pick yours — or if it&apos;s not
            listed yet, that just means you&apos;d be first.
          </p>
        </div>
      </header>

      <section className="pb-[120px]">
        <div className="mx-auto max-w-[900px] px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {CITIES.map((c, i) => (
              <Reveal key={c.slug} delay={i === 0 ? undefined : (Math.min(i, 4) as 1 | 2 | 3 | 4)}>
                <Link
                  href={`/cities/${c.slug}`}
                  className="group block rounded-card border border-line bg-bg-2 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-volt/40"
                >
                  <div className="font-display text-[19px] font-semibold transition-colors group-hover:text-volt">
                    {c.name}
                  </div>
                  <div className="mt-1 text-[12px] text-muted-2">{c.country}</div>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{c.blurb}</p>
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

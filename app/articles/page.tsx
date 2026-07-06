import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingNav from '@/components/marketing/nav';
import MarketingFooter from '@/components/marketing/footer';
import Reveal from '@/components/marketing/reveal';
import { label } from '@/components/marketing/styles';
import { ARTICLES } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Articles — RunOS',
  description:
    'Notes on running a community without seven disconnected apps: ops playbooks, pricing math, privacy design, and what the AI chief-of-staff actually does.',
};

const CATEGORY_TONE: Record<string, string> = {
  Ops: 'text-volt border-volt/25 bg-volt/10',
  Growth: 'text-info border-info/25 bg-info/10',
  Product: 'text-ok border-ok/25 bg-ok/10',
  Privacy: 'text-warn border-warn/25 bg-warn/10',
  Playbook: 'text-muted border-line bg-white/5',
};

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00.000Z`);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export default function ArticlesIndexPage() {
  return (
    <main className="overflow-x-clip bg-bg text-paper">
      <MarketingNav anchorPrefix="/" />

      <header className="relative isolate overflow-hidden pb-16 pt-[160px]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_30%_0%,rgba(205,251,80,0.08),transparent_70%)]" />
        <div className="mx-auto max-w-[900px] px-6">
          <span className={`${label} text-volt`}>Notes from the build</span>
          <h1 className="mb-5 font-display text-[clamp(34px,5.5vw,60px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Running a community, without the seven-app tax.
          </h1>
          <p className="max-w-[60ch] text-[16px] text-muted">
            Ops playbooks, pricing math, product notes, and privacy design — written for
            organizers, not for search engines.
          </p>
        </div>
      </header>

      <section className="pb-[120px]">
        <div className="mx-auto max-w-[900px] px-6">
          <div className="divide-y divide-line border-t border-line">
            {ARTICLES.map((a, i) => (
              <Reveal key={a.slug} delay={i === 0 ? undefined : (Math.min(i, 4) as 1 | 2 | 3 | 4)}>
                <Link
                  href={`/articles/${a.slug}`}
                  className="group flex flex-col gap-3 py-8 transition-colors duration-200 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${CATEGORY_TONE[a.category] ?? 'text-muted border-line'}`}
                      >
                        {a.category}
                      </span>
                      <span className="text-[12px] text-muted-2">
                        {formatDate(a.publishedAt)} · {a.readMinutes} min read
                      </span>
                    </div>
                    <h2 className="font-display text-[20px] font-semibold leading-snug tracking-[-0.01em] transition-colors duration-200 group-hover:text-volt sm:text-[22px]">
                      {a.title}
                    </h2>
                    <p className="mt-2 max-w-[62ch] text-[14.5px] leading-relaxed text-muted">{a.dek}</p>
                  </div>
                  <span className="mt-1 shrink-0 font-display text-[14px] font-semibold text-muted-2 transition-all duration-200 group-hover:translate-x-1 group-hover:text-volt">
                    Read →
                  </span>
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

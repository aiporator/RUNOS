import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin } from 'lucide-react';
import MarketingNav from '@/components/marketing/nav';
import MarketingFooter from '@/components/marketing/footer';
import Reveal from '@/components/marketing/reveal';
import { arr, btnGhost, btnVolt, label } from '@/components/marketing/styles';
import { Badge, EmptyState } from '@/components/ui';
import { WorkshopTypeIcon } from '@/components/icons/workshop-type-icons';
import { WORKSHOP_TYPES, getWorkshopType } from '@/lib/workshop-types';
import { listInstantEvents } from '@/lib/instant';

type Params = { type: string };

// Reads the live instant-events store — must render per-request, same reason
// as /cities/[city]: a static build would freeze "live right now" at deploy time.
export const dynamic = 'force-dynamic';

export function generateStaticParams(): Params[] {
  return WORKSHOP_TYPES.map((w) => ({ type: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { type } = await params;
  const w = getWorkshopType(type);
  if (!w) return {};
  const germanBit = w.germanTerm ? ` (${w.germanTerm})` : '';
  return {
    title: `${w.name}${germanBit} class software — RunOS`,
    description: `RunOS built for ${w.name.toLowerCase()} instructors specifically: ${w.tagline} Free under 20 people, no account.`,
  };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default async function WorkshopTypePage({ params }: { params: Promise<Params> }) {
  const { type } = await params;
  const w = getWorkshopType(type);
  if (!w) notFound();

  const liveEvents = listInstantEvents({ vertical: 'workshop', keywords: w.keywords });

  return (
    <main className="overflow-x-clip bg-bg text-paper">
      <MarketingNav anchorPrefix="/" />

      <header className="relative isolate overflow-hidden pb-16 pt-[160px]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_65%_0%,rgba(205,251,80,0.1),transparent_70%)]" />
        <div className="mx-auto max-w-[900px] px-6">
          <Link
            href="/workshops"
            className="mb-6 inline-flex items-center gap-2 text-[13px] font-semibold text-muted-2 transition-colors hover:text-volt"
          >
            ← All crafts
          </Link>
          <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-volt/25 bg-volt/8">
            <WorkshopTypeIcon id={w.id} className="h-8 w-8 text-volt" />
          </div>
          <span className={`${label} text-volt`}>
            {w.name}
            {w.germanTerm ? ` · ${w.germanTerm}` : ''}
          </span>
          <h1 className="mb-5 font-display text-[clamp(30px,5vw,54px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            {w.tagline}
          </h1>
          <p className="max-w-[60ch] text-[16px] text-muted">
            One page, one link, one link to share — built around how {w.name.toLowerCase()}{' '}
            instructors actually operate, not a generic events template with the noun swapped.
          </p>
        </div>
      </header>

      <section className="pb-[70px]">
        <div className="mx-auto max-w-[900px] px-6">
          <div className="grid gap-5 sm:grid-cols-1">
            <Reveal className="rounded-card border border-line bg-bg-2 p-7">
              <h2 className="mb-2.5 font-display text-[17px] font-semibold">{w.detail.title}</h2>
              <p className="text-[14.5px] leading-relaxed text-muted">{w.detail.body}</p>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2">
              <Reveal delay={1} className="rounded-card border border-line bg-bg-2 p-6">
                <h3 className="mb-2 font-display text-[15px] font-semibold text-volt">
                  {w.materials.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-muted">{w.materials.body}</p>
              </Reveal>
              <Reveal delay={2} className="rounded-card border border-line bg-bg-2 p-6">
                <h3 className="mb-2 font-display text-[15px] font-semibold text-volt">
                  {w.secondPain.title}
                </h3>
                <p className="text-[13.5px] leading-relaxed text-muted">{w.secondPain.body}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-[100px]">
        <div className="mx-auto max-w-[900px] px-6">
          <Reveal className="mb-6">
            <h2 className="font-display text-[22px] font-semibold tracking-[-0.01em]">
              Live {w.name.toLowerCase()} sessions right now
            </h2>
          </Reveal>
          {liveEvents.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {liveEvents.map((e) => {
                const d = new Date(e.date);
                return (
                  <Link
                    key={e.id}
                    href={`/e/${e.id}`}
                    className="group block rounded-card border border-line bg-bg-2 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-volt/40"
                  >
                    <div className="flex items-center gap-2">
                      <Badge tone="volt">
                        {MONTHS[d.getUTCMonth()]} {d.getUTCDate()}
                      </Badge>
                      {e.price === 0 && <Badge tone="muted">Free</Badge>}
                    </div>
                    <div className="mt-3 font-display text-[15px] font-semibold transition-colors group-hover:text-volt">
                      {e.title}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-muted">
                      <MapPin size={12} className="text-muted-2" /> {e.location}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title={`No ${w.name.toLowerCase()} sessions published yet`}
              sub={`Be the first — publishing "${w.sampleSession}" takes 60 seconds and it's free for up to 20 people.`}
              action={
                <Link
                  href={`/new?vertical=workshop&title=${encodeURIComponent(w.sampleSession)}`}
                  className={`group ${btnVolt}`}
                >
                  Publish a {w.name.toLowerCase()} session <span className={arr}>→</span>
                </Link>
              }
            />
          )}
        </div>
      </section>

      <section className="bg-paper-2 py-[90px] text-ink">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="mx-auto mb-4 max-w-[26ch] font-display text-[clamp(28px,4vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em]">
            Run your {w.name.toLowerCase()} sessions on one page.
          </h2>
          <p className="mx-auto mb-8 max-w-[52ch] text-[15px] text-muted-dark">
            Free under 20 people, no account. When you outgrow that, Starter is free under 50
            members — see the full pitch for workshops and courses.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/start?vertical=workshop" className={`group ${btnVolt}`}>
              Start free <span className={arr}>→</span>
            </Link>
            <Link
              href="/for-workshops"
              className={`group ${btnGhost} !border-ink !text-ink hover:!border-ink/60`}
            >
              See the full workshop pitch <span className={arr}>→</span>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter anchorPrefix="/" />
    </main>
  );
}

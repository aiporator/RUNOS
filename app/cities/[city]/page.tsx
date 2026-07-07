import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin } from 'lucide-react';
import MarketingNav from '@/components/marketing/nav';
import MarketingFooter from '@/components/marketing/footer';
import Reveal from '@/components/marketing/reveal';
import { arr, btnGhost, btnVolt, label } from '@/components/marketing/styles';
import { Badge, EmptyState } from '@/components/ui';
import { CITIES, getCity } from '@/lib/cities';
import { listInstantEvents } from '@/lib/instant';
import { getVertical } from '@/lib/verticals';

type Params = { city: string };

// Reads the live instant-events store — must render per-request, not once at
// build time, or "live in {city} right now" would freeze at whatever existed
// during the last deploy.
export const dynamic = 'force-dynamic';

export function generateStaticParams(): Params[] {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return {};
  return {
    title: `Running club software in ${c.name} — RunOS`,
    description: `RunOS is the operating system for running clubs, gyms, studios, and workshop organizers in ${c.name}. Free under 50 members — be the founding club.`,
  };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default async function CityPage({ params }: { params: Promise<Params> }) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();

  const localEvents = listInstantEvents({ q: c.name });

  return (
    <main className="overflow-x-clip bg-bg text-paper">
      <MarketingNav anchorPrefix="/" />

      <header className="relative isolate overflow-hidden pb-16 pt-[160px]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_30%_0%,rgba(205,251,80,0.08),transparent_70%)]" />
        <div className="mx-auto max-w-[900px] px-6">
          <Link
            href="/cities"
            className="mb-6 inline-flex items-center gap-2 text-[13px] font-semibold text-muted-2 transition-colors hover:text-volt"
          >
            ← All cities
          </Link>
          <span className={`${label} text-volt`}>{c.name}, {c.country}</span>
          <h1 className="mb-5 font-display text-[clamp(30px,5vw,54px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Run the club, not the chaos — <em className="not-italic text-volt">in {c.name}.</em>
          </h1>
          <p className="max-w-[60ch] text-[16px] text-muted">{c.blurb}</p>
        </div>
      </header>

      <section className="pb-[70px]">
        <div className="mx-auto max-w-[900px] px-6">
          <Reveal className="rounded-card border border-line bg-bg-2 p-7">
            <h2 className="mb-3 font-display text-[18px] font-semibold">Where {c.name} runs</h2>
            <p className="mb-4 text-[14.5px] leading-relaxed text-muted">
              Whatever route your club runs today — {c.landmarks.slice(0, -1).join(', ')} or{' '}
              {c.landmarks[c.landmarks.length - 1]} — RunOS runs underneath it: one login for
              members, events, dues, and an AI that plans your month. It doesn&apos;t care which
              bridge you cross.
            </p>
            <p className="text-[14.5px] leading-relaxed text-muted">
              Same system for gyms, fitness studios, and workshop organizers in {c.name} too —
              the running-club framing here is just the wedge.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-[100px]">
        <div className="mx-auto max-w-[900px] px-6">
          <Reveal className="mb-6">
            <h2 className="font-display text-[22px] font-semibold tracking-[-0.01em]">
              Live in {c.name} right now
            </h2>
          </Reveal>
          {localEvents.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {localEvents.map((e) => {
                const vertical = getVertical(e.vertical);
                const d = new Date(e.date);
                return (
                  <Link
                    key={e.id}
                    href={`/e/${e.id}`}
                    className="group block rounded-card border border-line bg-bg-2 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-volt/40"
                  >
                    <div className="flex items-center gap-2">
                      <Badge tone="volt">{MONTHS[d.getUTCMonth()]} {d.getUTCDate()}</Badge>
                      <Badge tone="muted">{vertical.emoji} {vertical.label}</Badge>
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
              title={`No public events in ${c.name} yet`}
              sub="Be the first — publishing takes 60 seconds and it's free for up to 20 people."
              action={
                <Link
                  href={`/new?location=${encodeURIComponent(c.name)}&vertical=running-club`}
                  className={`group ${btnVolt}`}
                >
                  Create the first event in {c.name} <span className={arr}>→</span>
                </Link>
              }
            />
          )}
        </div>
      </section>

      <section className="bg-paper-2 py-[90px] text-ink">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="mx-auto mb-4 max-w-[24ch] font-display text-[clamp(28px,4vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em]">
            Be the founding club in {c.name}.
          </h2>
          <p className="mx-auto mb-8 max-w-[52ch] text-[15px] text-muted-dark">
            Free under 50 members, white-glove migration off WhatsApp and spreadsheets, and a
            direct line to the team building the product.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href={`/start?city=${encodeURIComponent(c.name)}&vertical=running-club`} className={`group ${btnVolt}`}>
              Start your club in {c.name} <span className={arr}>→</span>
            </Link>
            <Link
              href={`/talk-to-us?vertical=running-club&source=city_${c.slug}`}
              className={`group ${btnGhost} !border-ink !text-ink hover:!border-ink/60`}
            >
              Talk to us about the founding-club program <span className={arr}>→</span>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter anchorPrefix="/" />
    </main>
  );
}

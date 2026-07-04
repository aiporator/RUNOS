import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin } from 'lucide-react';
import { club, upcomingEvents } from '@/lib/data';
import { formatDateTime, money } from '@/lib/utils';
import { Badge } from '@/components/ui';
import MarketingFooter from '@/components/marketing/footer';
import type { EventType } from '@/lib/types';
import PublicCalendar from '../public-calendar';
import JoinForm from '../join-form';

const typeTone: Record<EventType, 'volt' | 'info' | 'warn' | 'ok' | 'muted'> = {
  'long-run': 'volt',
  track: 'info',
  tempo: 'info',
  race: 'warn',
  trail: 'ok',
  social: 'muted',
};

function titleCase(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = slug === club.slug ? club.name : titleCase(slug);
  return { title: `${name} — Powered by RunOS`, description: `Join ${name} — upcoming runs, events, and membership.` };
}

export default async function PublicOrgPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const isDemo = slug !== club.slug;
  const orgName = isDemo ? titleCase(slug) : club.name;
  const published = upcomingEvents().filter((e) => e.status === 'published');

  return (
    <div className="min-h-screen bg-bg text-paper">
      {/* Minimal public top bar — not the app shell, not the marketing nav */}
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-[960px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-volt shadow-[0_0_12px_#cdfb50]" />
            <span className="font-display text-[16px] font-bold tracking-tight">{orgName}</span>
            {isDemo && <Badge tone="muted">demo preview</Badge>}
          </div>
          <Link
            href="#join"
            className="rounded-full bg-volt px-5 py-2 font-display text-[13.5px] font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)]"
          >
            Join us
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[960px] px-6">
        {/* Hero */}
        <section className="fade-up pb-12 pt-14 text-center sm:pt-20">
          <div className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-volt">Running community</div>
          <h1 className="font-display text-[clamp(38px,7vw,64px)] font-bold leading-[1.02] tracking-[-0.03em]">
            {orgName}
          </h1>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-[15px] text-muted">
            <MapPin size={15} className="text-muted-2" /> {club.city}
          </p>
          <p className="mt-2 text-[14px] text-muted">
            {club.memberCount} members · 38 events last quarter · Powered by RunOS
          </p>
        </section>

        <div className="grid gap-8 pb-16 lg:grid-cols-[1fr_320px]">
          {/* Upcoming events */}
          <section className="fade-up-1">
            <h2 className="mb-4 font-display text-xl font-semibold tracking-tight">Upcoming</h2>
            <div className="space-y-4">
              {published.map((e) => {
                const spotsLeft = Math.max(0, e.capacity - e.registered);
                return (
                  <div
                    key={e.id}
                    id={`event-${e.id}`}
                    className="scroll-mt-24 rounded-card border border-line bg-bg-2 p-5 transition hover:border-volt/35"
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      <Badge tone={typeTone[e.type]}>{e.type}</Badge>
                      <Badge tone="muted">{e.distanceKm} km</Badge>
                      <span className="ml-auto text-[13px] font-semibold text-volt">
                        {e.price === 0 ? 'Free' : money(e.price)}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-[18px] font-semibold tracking-tight">{e.title}</h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
                      <span>{formatDateTime(e.date)}</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} className="text-muted-2" /> {e.location}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className={`text-[12.5px] ${spotsLeft <= 10 ? 'font-semibold text-warn' : 'text-muted'}`}>
                        {spotsLeft === 0 ? 'Sold out — waitlist open' : `${spotsLeft} spots left`}
                      </span>
                      <Link
                        href={`/c/${slug}/${e.id}`}
                        className="rounded-full bg-volt px-5 py-2 font-display text-[13.5px] font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)]"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Compact public calendar */}
          <aside className="fade-up-2 lg:pt-11">
            <PublicCalendar events={published.map((e) => ({ id: e.id, date: e.date }))} />
            <p className="mt-3 text-center text-[11.5px] text-muted-2">Tap a highlighted day to jump to the run.</p>
          </aside>
        </div>

        {/* Join */}
        <section id="join" className="scroll-mt-24 pb-20">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Run with us</h2>
            <p className="mt-2 text-[14px] text-muted">
              All paces welcome. Three weekly sessions, a coffee crew, and a benefits passport with local partners.
            </p>
          </div>
          <div className="mx-auto mt-6 max-w-lg">
            <JoinForm slug={slug} orgName={orgName} />
          </div>
        </section>
      </main>

      <MarketingFooter anchorPrefix="/" />
    </div>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CloudSun, MapPin, Route, Users } from 'lucide-react';
import { club, getEvent } from '@/lib/data';
import { money } from '@/lib/utils';
import { Badge, ProgressBar } from '@/components/ui';
import type { EventType } from '@/lib/types';
import RsvpForm from '../../rsvp-form';
import PoweredByBanner from '../../powered-by';

export const dynamic = 'force-dynamic';

const typeTone: Record<EventType, 'volt' | 'info' | 'warn' | 'ok' | 'muted'> = {
  'long-run': 'volt',
  track: 'info',
  tempo: 'info',
  race: 'warn',
  trail: 'ok',
  social: 'muted',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const whatToBring = [
  'Water bottle or soft flask',
  'Weather-appropriate layers',
  'Your phone — check-in is a QR scan',
  'Post-run coffee money (Dock 7 discount applies)',
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; eventId: string }>;
}): Promise<Metadata> {
  const { eventId } = await params;
  const event = getEvent(eventId);
  if (!event) return { title: 'Event — RunOS' };
  return { title: `${event.title} — Powered by RunOS`, description: event.description };
}

export default async function PublicEventPage({
  params,
}: {
  params: Promise<{ slug: string; eventId: string }>;
}) {
  const { slug, eventId } = await params;
  const event = getEvent(eventId);
  if (!event) notFound();

  const d = new Date(event.date);
  const timeStr = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
  const isFull = event.registered >= event.capacity;
  const spotsLeft = Math.max(0, event.capacity - event.registered);

  return (
    <div className="min-h-screen bg-bg text-paper">
      {/* Minimal public top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-[960px] items-center justify-between px-6 py-4">
          <Link href={`/c/${slug}`} className="flex items-center gap-2.5">
            <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-volt shadow-[0_0_12px_#cdfb50]" />
            <span className="font-display text-[16px] font-bold tracking-tight">{club().name}</span>
          </Link>
          <Link href={`/c/${slug}`} className="text-[13px] font-semibold text-muted transition hover:text-volt">
            All events →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[960px] px-6 pb-16">
        <div className="grid gap-8 pt-12 lg:grid-cols-[1fr_340px]">
          {/* Hero + details */}
          <div className="fade-up">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge tone={typeTone[event.type]}>{event.type}</Badge>
              <Badge tone="muted">{event.distanceKm} km</Badge>
              <span className="text-[13px] font-semibold text-volt">
                {event.price === 0 ? 'Free' : money(event.price)}
              </span>
            </div>
            <h1 className="mt-4 font-display text-[clamp(30px,5vw,46px)] font-bold leading-[1.05] tracking-[-0.02em]">
              {event.title}
            </h1>

            {/* Big date/time block */}
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <div className="grid h-20 w-20 flex-none place-items-center rounded-card border border-volt/30 bg-volt/8 text-center">
                <div>
                  <div className="font-display text-[26px] font-bold leading-none text-volt">{d.getUTCDate()}</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                    {MONTHS[d.getUTCMonth()]}
                  </div>
                </div>
              </div>
              <div>
                <div className="font-display text-[17px] font-semibold">
                  {WEEKDAYS[d.getUTCDay()]} · {timeStr}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[13.5px] text-muted">
                  <MapPin size={13} className="text-muted-2" /> {event.location}
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-muted">{event.description}</p>

            {/* Capacity bar */}
            <div className="mt-6 max-w-xl rounded-card border border-line bg-bg-2 p-4">
              <div className="mb-2 flex items-center justify-between text-[12.5px]">
                <span className="font-semibold text-paper/90">
                  {event.registered} of {event.capacity} spots taken
                </span>
                <span className={spotsLeft <= 10 ? 'font-semibold text-warn' : 'text-muted'}>
                  {isFull ? 'Waitlist open' : `${spotsLeft} left`}
                </span>
              </div>
              <ProgressBar value={event.registered / event.capacity} tone={isFull ? 'warn' : 'volt'} />
            </div>

            {/* Details grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-card border border-line bg-bg-2 p-4">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-2">
                  <Route size={13} /> Route
                </div>
                <div className="text-[13.5px] font-medium">{event.routeName}</div>
                <div className="mt-0.5 text-[12.5px] text-muted">{event.distanceKm} km · all paces welcome</div>
              </div>
              <div className="rounded-card border border-line bg-bg-2 p-4">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-2">
                  <Users size={13} /> Pacers &amp; hosts
                </div>
                <div className="text-[13.5px] font-medium">
                  {event.pacers.length > 0 ? event.pacers.join(', ') : 'Hosted by the club crew'}
                </div>
                <div className="mt-0.5 text-[12.5px] text-muted">
                  {event.pacers.length > 0 ? `${event.pacers.length} pace group${event.pacers.length === 1 ? '' : 's'}` : 'Pace groups announced on the day'}
                </div>
              </div>
              <div className="rounded-card border border-line bg-bg-2 p-4">
                <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-2">
                  <CloudSun size={13} /> Weather
                </div>
                <div className="text-[13.5px] font-medium">{event.weather}</div>
                <div className="mt-0.5 text-[12.5px] text-muted">Updated automatically before the start</div>
              </div>
              <div className="rounded-card border border-line bg-bg-2 p-4">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-2">
                  What to bring
                </div>
                <ul className="space-y-1 text-[12.5px] text-muted">
                  {whatToBring.map((item) => (
                    <li key={item} className="flex items-start gap-1.5">
                      <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-volt" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* RSVP card */}
          <aside className="fade-up-1">
            <div className="rounded-card border border-line bg-bg-2 p-6 lg:sticky lg:top-24">
              <div className="mb-1 font-display text-[17px] font-semibold">
                {isFull ? 'Event is full' : 'Save your spot'}
              </div>
              <p className="mb-5 text-[12.5px] text-muted">
                {isFull
                  ? 'Join the waitlist — cancellations are promoted automatically.'
                  : `${event.price === 0 ? 'Free to join' : `${money(event.price)} per runner`} · takes 10 seconds.`}
              </p>
              <RsvpForm eventId={event.id} eventTitle={event.title} slug={slug} waitlist={isFull} />
            </div>
          </aside>
        </div>

        <PoweredByBanner />
      </main>

      <footer className="border-t border-line py-8 text-center text-[12.5px] text-muted-2">
        © 2026 {club().name} · Hosted on RunOS
      </footer>
    </div>
  );
}

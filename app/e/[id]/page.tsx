// /e/[id] — the shareable public page for an instant event. Server component;
// reads the store directly (no HTTP hop). Chrome matches the /c/ public pages:
// minimal top bar, dark, volt, powered-by loop at the bottom.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MapPin, Share2, User } from 'lucide-react';
import { FREE_CAPACITY, getInstantEvent, stats } from '@/lib/instant';
import { getVertical } from '@/lib/verticals';
import { Badge, ProgressBar } from '@/components/ui';
import { VerticalIcon } from '@/components/icons/vertical-icons';
import InstantRsvpForm from '../instant-rsvp-form';
import ShareRow from '../share-row';
import InstantPoweredBy from '../instant-powered-by';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = getInstantEvent(id);
  if (!event) return { title: 'Event — RunOS' };
  return {
    title: `${event.title} — hosted by ${event.hostName}`,
    description: event.description || `Join ${event.hostName} — free RSVP in 10 seconds.`,
  };
}

export default async function InstantEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = getInstantEvent(id);
  const eventStats = stats(id);
  if (!event || !eventStats) notFound();

  const vertical = getVertical(event.vertical);
  const typeDef = vertical.eventTypes.find((t) => t.id === event.type);
  const d = new Date(event.date);
  const timeStr = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
  const isFull = eventStats.spotsLeft === 0;

  const captionEvent = {
    title: event.title,
    hostName: event.hostName,
    date: event.date,
    location: event.location,
    capacity: event.capacity,
    price: event.price,
    vertical: event.vertical,
  };

  return (
    <div className="min-h-screen bg-bg text-paper">
      {/* Minimal public top bar */}
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-[960px] items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-volt shadow-[0_0_12px_#cdfb50]" />
            <span className="font-display text-[16px] font-bold tracking-tight">RunOS</span>
          </Link>
          <Link href="/new" className="text-[13px] font-semibold text-muted transition hover:text-volt">
            Create your own →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[960px] px-6 pb-16">
        <div className="grid gap-8 pt-12 lg:grid-cols-[1fr_340px]">
          {/* Hero + details */}
          <div className="fade-up">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge tone={typeDef?.tone ?? 'volt'}>{typeDef?.label ?? event.type}</Badge>
              <Badge tone="muted">
                <VerticalIcon id={vertical.id} className="mr-1 h-3 w-3" /> {vertical.label}
              </Badge>
              {event.price === 0 && <Badge tone="volt">Free event</Badge>}
            </div>
            <h1 className="mt-4 font-display text-[clamp(30px,5vw,46px)] font-bold leading-[1.05] tracking-[-0.02em]">
              {event.title}
            </h1>
            <div className="mt-2 flex items-center gap-1.5 text-[14px] text-muted">
              <User size={14} className="text-muted-2" /> Hosted by {event.hostName}
            </div>

            {/* Big date/time block */}
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <div className="grid h-20 w-20 flex-none place-items-center rounded-card border border-volt/30 bg-volt/8 text-center">
                <div>
                  <div className="font-display text-[26px] font-bold leading-none text-volt">
                    {d.getUTCDate()}
                  </div>
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

            {event.description && (
              <p className="mt-6 max-w-xl text-[14.5px] leading-relaxed text-muted">
                {event.description}
              </p>
            )}

            {/* Capacity bar */}
            <div className="mt-6 max-w-xl rounded-card border border-line bg-bg-2 p-4">
              <div className="mb-2 flex items-center justify-between text-[12.5px]">
                <span className="font-semibold text-paper/90">
                  {eventStats.confirmed} of {event.capacity} spots taken
                </span>
                <span className={eventStats.spotsLeft <= 3 ? 'font-semibold text-warn' : 'text-muted'}>
                  {isFull
                    ? `Waitlist open${eventStats.waitlist > 0 ? ` · ${eventStats.waitlist} waiting` : ''}`
                    : `${eventStats.spotsLeft} left`}
                </span>
              </div>
              <ProgressBar value={eventStats.confirmed / event.capacity} tone={isFull ? 'warn' : 'volt'} />
            </div>

            {/* Share row */}
            <div className="mt-6 max-w-xl rounded-card border border-line bg-bg-2 p-4">
              <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-2">
                <Share2 size={13} /> Bring your people
              </div>
              <ShareRow path={`/e/${event.id}`} event={captionEvent} />
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
                  ? 'Join the waitlist — you take the first spot that opens.'
                  : `${event.price === 0 ? 'Free to join' : `€${event.price} per spot`} · takes 10 seconds.`}
              </p>
              <InstantRsvpForm eventId={event.id} eventTitle={event.title} waitlist={isFull} />
            </div>
          </aside>
        </div>

        <InstantPoweredBy />
      </main>

      <footer className="border-t border-line py-8 text-center text-[12.5px] text-muted-2">
        Hosted by {event.hostName} · Free for events up to {FREE_CAPACITY} people ·{' '}
        <Link href="/new" className="text-muted transition hover:text-volt">
          Made with RunOS
        </Link>
      </footer>
    </div>
  );
}

// /e/[id]/manage?key= — the host's lite dashboard. The manage key is the only
// credential (no account, that's the wedge); a wrong key gets a friendly
// private-link card, never a scary error.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CalendarDays, Lock, MapPin, PartyPopper } from 'lucide-react';
import { FREE_CAPACITY, getInstantEvent, listRsvps, stats } from '@/lib/instant';
import { getVertical } from '@/lib/verticals';
import { Badge, Card } from '@/components/ui';
import AttendeeList from '../../attendee-list';
import ShareRow from '../../share-row';
import { CopyLinkField, UpgradeCta } from '../../manage-widgets';

export const metadata: Metadata = { title: 'Manage your event — RunOS' };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const UPSELL_BULLETS = [
  'A recurring event calendar — publish a whole season at once',
  'Memberships, packs, and payments with a 0.5% platform fee',
  'Automations: reminders, waitlist promotion, win-back nudges',
  'Sponsor pipeline and perks your regulars actually use',
];

function PrivateLinkCard() {
  return (
    <div className="grid min-h-svh place-items-center bg-bg px-6 text-paper">
      <div className="w-full max-w-md rounded-card border border-line bg-bg-2 p-8 text-center">
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-volt/15">
          <Lock size={20} className="text-volt" />
        </div>
        <h1 className="font-display text-[22px] font-bold tracking-tight">
          This manage link is private
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-[13.5px] text-muted">
          Only the host&apos;s manage link (with its secret key) opens this page. If you created this
          event, use the link you got when you published it.
        </p>
        <Link
          href="/new"
          className="mt-6 inline-flex items-center rounded-full bg-volt px-6 py-3 font-display text-[14px] font-semibold text-ink transition hover:shadow-[0_10px_32px_rgba(205,251,80,0.35)]"
        >
          Create your own event free →
        </Link>
      </div>
    </div>
  );
}

export default async function ManageInstantEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ key?: string; new?: string }>;
}) {
  const { id } = await params;
  const { key, new: isNew } = await searchParams;
  const event = getInstantEvent(id);
  if (!event) notFound();
  if (key !== event.manageKey) return <PrivateLinkCard />;

  const eventStats = stats(id);
  const rsvps = listRsvps(id);
  const vertical = getVertical(event.vertical);
  const d = new Date(event.date);
  const timeStr = `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;

  const captionEvent = {
    title: event.title,
    hostName: event.hostName,
    date: event.date,
    location: event.location,
    capacity: event.capacity,
    price: event.price,
    vertical: event.vertical,
  };

  const statTiles = [
    { label: 'Confirmed', value: eventStats?.confirmed ?? 0 },
    { label: 'Waitlist', value: eventStats?.waitlist ?? 0 },
    { label: 'Spots left', value: eventStats?.spotsLeft ?? 0 },
    { label: 'Checked in', value: eventStats?.checkedIn ?? 0 },
  ];

  return (
    <div className="min-h-svh bg-bg text-paper">
      {/* Minimal top bar */}
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[860px] items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-volt shadow-[0_0_12px_#cdfb50]" />
            <span className="font-display text-[16px] font-bold tracking-tight">RunOS</span>
          </Link>
          <Link
            href={`/e/${event.id}`}
            className="text-[13px] font-semibold text-muted transition hover:text-volt"
          >
            View public page →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[860px] px-6 pb-20 pt-10">
        {/* One-time success banner */}
        {isNew === '1' && (
          <div className="fade-up mb-8 flex items-center gap-3 rounded-card border border-volt/30 bg-volt/10 px-5 py-4">
            <PartyPopper size={20} className="flex-none text-volt" />
            <div>
              <div className="font-display text-[15px] font-semibold text-volt">
                Your event is live! Share the link below.
              </div>
              <div className="text-[12.5px] text-muted">
                Bookmark this page — it&apos;s your private manage link. No account, no password.
              </div>
            </div>
          </div>
        )}

        {/* Event header */}
        <div className="fade-up">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="muted">
              {vertical.emoji} {vertical.label}
            </Badge>
            {event.capacity <= FREE_CAPACITY ? (
              <Badge tone="volt">Free forever</Badge>
            ) : (
              <Badge tone="info">Free during beta — Starter plan later</Badge>
            )}
          </div>
          <h1 className="mt-3 font-display text-[clamp(26px,4vw,38px)] font-bold leading-tight tracking-[-0.02em]">
            {event.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13.5px] text-muted">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={13} className="text-muted-2" />
              {WEEKDAYS[d.getUTCDay()]} {d.getUTCDate()} {MONTHS[d.getUTCMonth()]} · {timeStr}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-muted-2" /> {event.location}
            </span>
          </div>
        </div>

        {/* Share card */}
        <Card className="fade-up-1 mt-8">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-2">
            Your public link
          </div>
          <CopyLinkField path={`/e/${event.id}`} />
          <div className="mt-4">
            <ShareRow path={`/e/${event.id}`} event={captionEvent} />
          </div>
        </Card>

        {/* Stats row */}
        <div className="fade-up-2 mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statTiles.map((s) => (
            <Card key={s.label}>
              <div className="text-[12px] font-medium text-muted">{s.label}</div>
              <div className="mt-1.5 font-display text-[28px] font-bold leading-none tracking-tight">
                {s.value}
              </div>
            </Card>
          ))}
        </div>

        {/* Attendees */}
        <Card className="fade-up-3 mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-[15px] font-semibold">Attendees</h2>
            <span className="text-[12px] text-muted-2">
              {rsvps.length} RSVP{rsvps.length === 1 ? '' : 's'} · capacity {event.capacity}
            </span>
          </div>
          <AttendeeList initial={rsvps} />
        </Card>

        {/* Upsell */}
        <div className="fade-up-4 mt-8 rounded-card border border-volt/25 bg-volt/6 p-6 sm:p-8">
          <h2 className="font-display text-[20px] font-bold tracking-tight">
            Outgrowing one-off events?
          </h2>
          <p className="mt-1.5 max-w-lg text-[13.5px] text-muted">
            When one event becomes every week, RunOS turns your link into a full {vertical.nouns.org}{' '}
            workspace.
          </p>
          <ul className="mt-4 space-y-2.5 text-[13.5px] text-paper/90">
            {UPSELL_BULLETS.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span className="text-volt">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <UpgradeCta />
          </div>
        </div>
      </main>
    </div>
  );
}

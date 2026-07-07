import Link from 'next/link';
import { Check, MapPin, Users } from 'lucide-react';
import { completedEvents, events, upcomingEvents } from '@/lib/data';
import { formatDate, formatDateTime, pct, relativeDays } from '@/lib/utils';
import { Badge, Card, CardTitle, PageHeader, ProgressBar, Stat, Table } from '@/components/ui';
import type { EventStatus, EventType } from '@/lib/types';

export const dynamic = 'force-dynamic';

const typeTone: Record<EventType, 'volt' | 'info' | 'warn' | 'ok' | 'muted'> = {
  'long-run': 'volt',
  track: 'info',
  race: 'warn',
  trail: 'ok',
  social: 'muted',
  tempo: 'muted',
};

const statusTone: Record<EventStatus, 'volt' | 'warn' | 'ok' | 'muted'> = {
  draft: 'muted',
  published: 'volt',
  live: 'warn',
  completed: 'ok',
};

const growthPackAssets = [
  'Landing page',
  'Registration flow',
  'Email sequence (5)',
  'Waitlist automation',
  'Reminder SMS (T-24h)',
  'QR check-in',
  'Photo gallery',
  'IG carousel',
  'Sponsor report',
  'Post-event survey',
  'Referral campaign',
  'Recap post',
];

export default function EventsPage() {
  const upcoming = upcomingEvents();
  const completed = completedEvents();
  const published = upcoming.filter((e) => e.status === 'published');
  const totalRegistered = upcoming.reduce((s, e) => s + e.registered, 0);
  const avgCheckinRate =
    completed.reduce((s, e) => s + (e.registered ? e.checkedIn / e.registered : 0), 0) /
    Math.max(1, completed.length);
  const waitlistTotal = events().reduce((s, e) => s + e.waitlist, 0);

  return (
    <div>
      <PageHeader
        kicker="Operations"
        title="Events"
        sub={`${published.length} published and upcoming · publishing one event auto-creates its full growth pack.`}
        actions={
          <>
            <Link
              href="/app/events/calendar"
              className="rounded-full border border-line px-5 py-2.5 font-display text-sm font-semibold text-paper transition hover:border-volt/40"
            >
              Calendar view
            </Link>
            <Link
              href="/app/events/new"
              className="rounded-full bg-volt px-5 py-2.5 font-display text-sm font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)]"
            >
              New event
            </Link>
          </>
        }
      />

      <div className="grid gap-4 fade-up-1 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Upcoming published" value={String(published.length)} sub={`+${upcoming.length - published.length} in draft`} />
        <Stat label="Registered across upcoming" value={String(totalRegistered)} delta="+23 this week" sub="Across all published events" />
        <Stat label="Avg check-in rate" value={pct(avgCheckinRate)} sub={`Last ${completed.length} completed events`} />
        <Stat label="On waitlists" value={String(waitlistTotal)} sub="Auto-promoted when spots open" />
      </div>

      <Card className="mt-6 fade-up-2">
        <CardTitle action={<span className="text-[12px] text-muted">{upcoming.length} events</span>}>Upcoming</CardTitle>
        <div className="space-y-3">
          {upcoming.map((e) => (
            <Link
              key={e.id}
              href={`/app/events/${e.id}`}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-bg-3 px-4 py-3.5 transition hover:border-volt/40"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <Badge tone={typeTone[e.type]}>{e.type}</Badge>
                  <span className="truncate font-display text-[14.5px] font-semibold">{e.title}</span>
                  {e.status === 'draft' && <Badge tone="muted">draft</Badge>}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-muted">
                  <span>{formatDateTime(e.date)} · {relativeDays(e.date)}</span>
                  <span className="inline-flex items-center gap-1"><MapPin size={12} className="text-muted-2" />{e.location}</span>
                  <span>{e.routeName} · {e.distanceKm} km</span>
                  <span className="inline-flex items-center gap-1"><Users size={12} className="text-muted-2" />{e.pacers.length} pacer{e.pacers.length === 1 ? '' : 's'}</span>
                </div>
              </div>
              <div className="flex items-center gap-5">
                {e.predictedAttendance && (
                  <div className="hidden text-right sm:block">
                    <div className="text-[11px] uppercase tracking-wide text-muted-2">Pacer forecast</div>
                    <div className="text-[13px] font-semibold text-volt">
                      {e.predictedAttendance[0]}–{e.predictedAttendance[1]}
                    </div>
                  </div>
                )}
                <div className="w-28">
                  <div className="mb-1.5 flex justify-between text-[11.5px] text-muted">
                    <span>{e.registered}/{e.capacity}</span>
                    <span>{pct(e.registered / e.capacity)}</span>
                  </div>
                  <ProgressBar value={e.registered / e.capacity} tone={e.status === 'draft' ? 'info' : 'volt'} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="fade-up-3 xl:col-span-2">
          <CardTitle action={<span className="text-[12px] text-muted">last 30 days</span>}>Past events</CardTitle>
          <Table head={['Event', 'Date', 'Registered', 'Checked in', 'Rate', 'Recap']}>
            {completed.map((e) => (
              <tr key={e.id} className="text-[13.5px]">
                <td className="py-3 pr-4">
                  <Link href={`/app/events/${e.id}`} className="font-medium transition hover:text-volt">
                    {e.title}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-muted">{formatDate(e.date)}</td>
                <td className="py-3 pr-4">{e.registered}</td>
                <td className="py-3 pr-4">{e.checkedIn}</td>
                <td className="py-3 pr-4 font-semibold text-volt">{pct(e.checkedIn / e.registered)}</td>
                <td className="py-3">
                  <Badge tone="ok">Recap published</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card className="fade-up-4 border-volt/25 bg-volt/5">
          <CardTitle action={<Badge tone="volt">automatic</Badge>}>Event Growth Pack</CardTitle>
          <p className="mb-4 text-[13px] leading-relaxed text-muted">
            Publishing an event auto-creates 12 assets — the full funnel from landing page to recap. No extra work,
            every event ships with its own growth machine.
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            {growthPackAssets.map((asset) => (
              <div key={asset} className="flex items-center gap-2 text-[12.5px]">
                <span className="grid h-4 w-4 flex-none place-items-center rounded-full bg-volt/15">
                  <Check size={11} className="text-volt" strokeWidth={3} />
                </span>
                <span className="text-paper/90">{asset}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

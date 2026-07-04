import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, Clock, Megaphone, QrCode } from 'lucide-react';
import { getEvent, getMember, registrations } from '@/lib/data';
import { formatDate, formatDateTime, money, pct, relativeDays } from '@/lib/utils';
import { Avatar, Badge, Card, CardTitle, KV, ProgressBar } from '@/components/ui';
import type { EventStatus, EventType } from '@/lib/types';

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

interface PackItem {
  name: string;
  done: boolean;
  note: string;
}

function growthPackStatus(status: EventStatus): PackItem[] {
  const after = status === 'completed';
  return [
    { name: 'Landing page', done: status !== 'draft', note: status === 'draft' ? 'publishes with event' : 'live' },
    { name: 'Registration flow', done: status !== 'draft', note: status === 'draft' ? 'publishes with event' : 'live' },
    { name: 'Email sequence', done: status !== 'draft', note: status === 'draft' ? '5 emails drafted' : after ? '5 of 5 sent' : '3 of 5 sent' },
    { name: 'Waitlist automation', done: status !== 'draft', note: 'auto-promotes on cancellations' },
    { name: 'Reminder SMS', done: after, note: after ? 'sent' : 'scheduled T-24h' },
    { name: 'QR check-in', done: status !== 'draft', note: status === 'draft' ? 'generated on publish' : 'ready' },
    { name: 'Photo gallery', done: after, note: after ? 'published' : 'after event' },
    { name: 'IG carousel', done: after, note: after ? 'posted' : 'after event' },
    { name: 'Sponsor report', done: after, note: after ? 'sent to partners' : 'after event' },
    { name: 'Post-event survey', done: after, note: after ? 'collecting responses' : 'sends T+2h' },
    { name: 'Referral campaign', done: status !== 'draft', note: 'invite links active' },
    { name: 'Recap post', done: after, note: after ? 'published' : 'drafted after event' },
  ];
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) notFound();

  const regs = registrations.filter((r) => r.eventId === event.id);
  const waiversSigned = regs.filter((r) => r.waiverSigned).length;
  const roster = regs
    .slice(0, 12)
    .map((r) => ({ reg: r, member: getMember(r.memberId) }))
    .filter((x): x is { reg: (typeof regs)[number]; member: NonNullable<ReturnType<typeof getMember>> } => Boolean(x.member));
  const forecast = event.predictedAttendance;
  const forecastMid = forecast ? Math.round((forecast[0] + forecast[1]) / 2) : null;
  const noShowRate = forecastMid && event.registered ? 1 - forecastMid / event.registered : null;
  const pack = growthPackStatus(event.status);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 fade-up">
        <div>
          <div className="mb-2.5 flex items-center gap-2">
            <Badge tone={statusTone[event.status]}>{event.status}</Badge>
            <Badge tone={typeTone[event.type]}>{event.type}</Badge>
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">{event.title}</h1>
          <p className="mt-1.5 max-w-xl text-sm text-muted">
            {formatDateTime(event.date)} ({relativeDays(event.date)}) · {event.location} · {event.weather}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="rounded-full border border-line px-5 py-2.5 font-display text-sm font-semibold text-paper transition hover:border-volt/40"
          >
            Edit
          </Link>
          <Link
            href={`/app/events/${event.id}/promote`}
            className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-display text-sm font-semibold text-paper transition hover:border-volt/40"
          >
            <Megaphone size={16} /> Promote
          </Link>
          <Link
            href={`/app/events/${event.id}/checkin`}
            className="inline-flex items-center gap-2 rounded-full bg-volt px-5 py-2.5 font-display text-sm font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)]"
          >
            <QrCode size={16} /> Open check-in
          </Link>
        </div>
      </div>

      <div className="grid gap-4 fade-up-1 xl:grid-cols-3">
        <Card>
          <CardTitle action={<span className="text-[12px] text-muted">{pct(event.registered / event.capacity)} full</span>}>
            Registrations
          </CardTitle>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[40px] font-bold leading-none tracking-tight">{event.registered}</span>
            <span className="text-sm text-muted">of {event.capacity}</span>
          </div>
          <div className="mt-4">
            <ProgressBar value={event.registered / event.capacity} />
          </div>
          <div className="mt-5 space-y-1 border-t border-line pt-3">
            <KV k="Waitlist" v={event.waitlist > 0 ? <span className="text-warn">{event.waitlist} waiting</span> : '0'} />
            {regs.length > 0 ? (
              <KV
                k="Waivers signed"
                v={
                  <span className={waiversSigned === regs.length ? 'text-ok' : 'text-warn'}>
                    {waiversSigned} of {regs.length}
                  </span>
                }
              />
            ) : (
              <KV k="Checked in" v={String(event.checkedIn)} />
            )}
          </div>
          {regs.length === 0 && (
            <div className="mt-4 rounded-lg border border-dashed border-line px-3.5 py-3 text-[12.5px] leading-relaxed text-muted">
              Per-member registration detail syncs when the roster opens — summary numbers above come from the event
              record.
            </div>
          )}
        </Card>

        <Card>
          <CardTitle>Logistics</CardTitle>
          <div className="divide-y divide-line/60">
            <KV k="Route" v={`${event.routeName} · ${event.distanceKm} km`} />
            <KV k="Pacers" v={event.pacers.length > 0 ? event.pacers.join(', ') : <span className="text-warn">Needed — sign-up open</span>} />
            <KV k="Volunteers" v={event.volunteers.length > 0 ? event.volunteers.join(', ') : <span className="text-warn">Needed</span>} />
            <KV k="Weather" v={event.weather} />
            <KV k="Price" v={event.price === 0 ? 'Free' : money(event.price)} />
          </div>
          <p className="mt-4 border-t border-line pt-3 text-[12.5px] leading-relaxed text-muted">{event.description}</p>
        </Card>

        {forecast && forecastMid !== null ? (
          <Card className="border-volt/25 bg-volt/5">
            <CardTitle action={<Badge tone="volt">Pacer AI</Badge>}>Pacer forecast</CardTitle>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[40px] font-bold leading-none tracking-tight text-volt">
                {forecast[0]}–{forecast[1]}
              </span>
              <span className="text-sm text-muted">expected on the line</span>
            </div>
            <div className="mt-4 space-y-1 border-t border-volt/15 pt-3">
              <KV k="Registered today" v={String(event.registered)} />
              {noShowRate !== null && <KV k="Expected no-shows" v={`~${pct(Math.max(0, noShowRate))}`} />}
            </div>
            <p className="mt-4 text-[13px] leading-relaxed text-paper/90">
              <span className="font-semibold text-volt">Recommendation:</span> plan aid and pace groups for ~{forecastMid}{' '}
              runners{event.pacers.length > 0 ? ` across ${event.pacers.length} pacers` : ''}, and keep{' '}
              {event.waitlist > 0 ? `promoting the ${event.waitlist}-person waitlist` : 'registration open'} — no-shows
              usually free up spots by T-12h.
            </p>
          </Card>
        ) : (
          <Card>
            <CardTitle>Pacer forecast</CardTitle>
            <div className="grid h-[85%] place-items-center rounded-xl border border-dashed border-line px-6 text-center">
              <p className="text-[13px] leading-relaxed text-muted">
                Forecast unlocks once the event is published and registrations start flowing in.
              </p>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-6 grid gap-4 fade-up-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardTitle action={<span className="text-[12px] text-muted">{regs.length > 12 ? `first 12 of ${regs.length}` : `${regs.length} registered`}</span>}>
            Registered members
          </CardTitle>
          {roster.length > 0 ? (
            <div className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {roster.map(({ reg, member }) => (
                <div key={reg.id} className="flex items-center gap-3 rounded-lg px-1 py-2">
                  <Avatar name={member.name} color={member.avatarColor} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-medium">{member.name}</div>
                    <div className="flex items-center gap-1 text-[11.5px] text-muted">
                      <Clock size={11} className="text-muted-2" /> registered {relativeDays(reg.registeredAt)} · {formatDate(reg.registeredAt)}
                    </div>
                  </div>
                  <Badge tone={reg.waiverSigned ? 'ok' : 'danger'}>{reg.waiverSigned ? 'Waiver ✓' : 'No waiver'}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid place-items-center rounded-card border border-dashed border-line py-14 text-center">
              <div>
                <div className="font-display text-[15px] font-semibold">No individual registrations yet</div>
                <p className="mx-auto mt-1.5 max-w-sm text-[13px] text-muted">
                  {event.status === 'draft'
                    ? 'Publish the event to open registration — the growth pack starts filling it automatically.'
                    : `${event.registered} registered via the event record — the per-member roster syncs closer to event day.`}
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <CardTitle action={<span className="text-[12px] text-muted">{pack.filter((p) => p.done).length} of {pack.length} live</span>}>
            Growth Pack status
          </CardTitle>
          <div className="space-y-2.5">
            {pack.map((item) => (
              <div key={item.name} className="flex items-center gap-2.5 text-[12.5px]">
                {item.done ? (
                  <span className="grid h-4 w-4 flex-none place-items-center rounded-full bg-volt/15">
                    <Check size={11} className="text-volt" strokeWidth={3} />
                  </span>
                ) : (
                  <span className="grid h-4 w-4 flex-none place-items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
                  </span>
                )}
                <span className={item.done ? 'text-paper/90' : 'text-muted'}>{item.name}</span>
                <span className="ml-auto text-right text-[11.5px] text-muted-2">{item.note}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Pause, Play, Wifi } from 'lucide-react';
import { Avatar, Badge, Card, CardTitle, ProgressBar, Stat } from '@/components/ui';
import { formatDateTime, pct } from '@/lib/utils';

export interface RosterEntry {
  id: string;
  name: string;
  avatarColor: string;
  isNew: boolean;
  streak: number | null;
  waiverSigned: boolean;
}

export interface CheckinEventProps {
  id: string;
  title: string;
  date: string;
  location: string;
  registered: number;
  capacity: number;
  waitlist: number;
  volunteers: string[];
  predictedAttendance: [number, number] | null;
}

interface Arrival {
  entry: RosterEntry;
  at: number;
}

function agoLabel(at: number, now: number): string {
  const s = Math.max(0, Math.round((now - at) / 1000));
  if (s < 8) return 'just now';
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}

export default function CheckinLive({ event, roster }: { event: CheckinEventProps; roster: RosterEntry[] }) {
  const cap = Math.min(24, roster.length);
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const [running, setRunning] = useState(true);
  const [reduced, setReduced] = useState(false);

  // Respect prefers-reduced-motion: render the full feed at once, no ticking simulation.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      const now = Date.now();
      setArrivals(
        roster
          .slice(0, cap)
          .map((entry, i) => ({ entry, at: now - (cap - i) * 9000 }))
          .reverse(),
      );
    }
  }, [cap, roster]);

  useEffect(() => {
    if (!running || reduced || cap === 0) return;
    const timer = window.setInterval(() => {
      setArrivals((prev) =>
        prev.length >= cap ? prev : [{ entry: roster[prev.length], at: Date.now() }, ...prev],
      );
    }, 1800);
    return () => window.clearInterval(timer);
  }, [running, reduced, cap, roster]);

  const now = Date.now();
  const checkedIn = arrivals.length;
  const arrivalsLast5m = arrivals.filter((a) => now - a.at < 5 * 60_000).length;
  const noShowsPredicted = event.predictedAttendance
    ? Math.max(0, event.registered - Math.round((event.predictedAttendance[0] + event.predictedAttendance[1]) / 2))
    : Math.round(event.registered * 0.1);
  const waiverMissing = useMemo(() => roster.filter((r) => !r.waiverSigned).length, [roster]);
  const done = checkedIn >= cap;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 fade-up">
        <div>
          <Link
            href={`/app/events/${event.id}`}
            className="mb-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted transition hover:text-volt"
          >
            <ArrowLeft size={13} /> Back to event
          </Link>
          <h1 className="flex items-center gap-3 font-display text-3xl font-semibold tracking-tight">
            Check-in mission control
            <span className="inline-flex items-center gap-1.5 rounded-full border border-volt/25 bg-volt/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-volt">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-volt" /> Live
            </span>
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {event.title} · {formatDateTime(event.date)} · {event.location}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          disabled={reduced || done}
          className="inline-flex items-center gap-2 rounded-full bg-volt px-5 py-2.5 font-display text-sm font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)] disabled:opacity-50 disabled:hover:shadow-none"
        >
          {running && !done ? <Pause size={15} /> : <Play size={15} />}
          {done ? 'All arrived' : running ? 'Pause simulation' : 'Start simulation'}
        </button>
      </div>

      <div className="grid gap-4 fade-up-1 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardTitle action={<Badge tone="volt">QR live</Badge>}>Scan to check in</CardTitle>
          <div className="grid place-items-center rounded-xl border border-line bg-bg-3 p-6">
            <QRCodeSVG
              value={`https://run.aiporate.com/checkin/${event.id}`}
              size={220}
              level="M"
              fgColor="#cdfb50"
              bgColor="transparent"
            />
          </div>
          <div className="mt-4 text-center">
            <div className="font-display text-[14.5px] font-semibold">{event.title}</div>
            <div className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-muted">
              <Wifi size={13} className="text-ok" /> Offline-capable — syncs when back online
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardTitle action={<span className="text-[12px] text-muted">{event.waitlist} on waitlist</span>}>
            Live arrivals
          </CardTitle>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[56px] font-bold leading-none tracking-tight text-volt">{checkedIn}</span>
              <span className="text-[15px] text-muted">/ {event.registered} registered</span>
            </div>
            <div className="text-right text-[12.5px] text-muted">{pct(event.registered ? checkedIn / event.registered : 0)} checked in</div>
          </div>
          <div className="mt-3">
            <ProgressBar value={event.registered ? checkedIn / event.registered : 0} />
          </div>

          <div className="thin-scroll mt-5 max-h-[340px] space-y-1 overflow-y-auto border-t border-line pt-4">
            {arrivals.length === 0 && (
              <div className="grid place-items-center rounded-xl border border-dashed border-line py-12 text-center">
                <p className="max-w-xs text-[13px] text-muted">
                  {cap === 0
                    ? 'No registered members on the roster yet — arrivals will appear here as runners scan the QR.'
                    : 'Waiting for the first scan… press Start simulation to preview the live feed.'}
                </p>
              </div>
            )}
            {arrivals.map((a) => (
              <div key={a.entry.id} className="flex items-center gap-3 rounded-lg px-1 py-2 fade-up">
                <Avatar name={a.entry.name} color={a.entry.avatarColor} size={32} />
                <div className="min-w-0 flex-1">
                  <span className="text-[13.5px] font-medium">{a.entry.name}</span>
                  <span className="ml-2 text-[12.5px] text-muted">checked in</span>
                </div>
                {a.entry.isNew && <Badge tone="volt">First event!</Badge>}
                {!a.entry.isNew && a.entry.streak !== null && <Badge tone="info">Streak {a.entry.streak}</Badge>}
                {!a.entry.waiverSigned && <Badge tone="danger">No waiver</Badge>}
                <span className="flex-none text-[11.5px] text-muted-2">{agoLabel(a.at, now)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 fade-up-2 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Arrivals last 5 min" value={String(arrivalsLast5m)} sub="Peak flow usually at T-10 min" />
        <Stat label="No-shows predicted" value={String(noShowsPredicted)} sub="Pacer forecast vs registered" />
        <Stat
          label="Waivers missing"
          value={String(waiverMissing)}
          sub={waiverMissing > 0 ? 'Flag at the check-in desk' : 'All signed'}
          delta={waiverMissing > 0 ? 'action needed' : undefined}
          deltaGood={waiverMissing === 0}
        />
        <Stat label="Volunteers on site" value={String(event.volunteers.length)} sub={event.volunteers.join(', ') || 'None assigned'} />
      </div>
    </div>
  );
}

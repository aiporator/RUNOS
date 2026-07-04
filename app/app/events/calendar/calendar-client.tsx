'use client';

// Organizer calendar — month + week views over the club's events.
// Receives plain serializable events from the server page wrapper.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn, formatDateTime } from '@/lib/utils';
import type { ClubEvent } from '@/lib/types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Fixed demo "today" — matches lib/seed TODAY (2026-07-02).
const TODAY_KEY = '2026-07-02';

/** Dot / block color per event type; drafts always render muted. */
function toneOf(e: Pick<ClubEvent, 'type' | 'status'>): 'volt' | 'info' | 'warn' | 'ok' | 'muted' {
  if (e.status === 'draft') return 'muted';
  switch (e.type) {
    case 'long-run': return 'volt';
    case 'track':
    case 'tempo': return 'info';
    case 'race': return 'warn';
    case 'trail': return 'ok';
    default: return 'muted';
  }
}

const dotClass: Record<string, string> = {
  volt: 'bg-volt',
  info: 'bg-info',
  warn: 'bg-warn',
  ok: 'bg-ok',
  muted: 'bg-white/35',
};

const blockClass: Record<string, string> = {
  volt: 'border-volt/50 bg-volt/12',
  info: 'border-info/50 bg-info/12',
  warn: 'border-warn/50 bg-warn/12',
  ok: 'border-ok/50 bg-ok/12',
  muted: 'border-line bg-white/6',
};

const LEGEND: { label: string; tone: string }[] = [
  { label: 'Long run', tone: 'volt' },
  { label: 'Track / tempo', tone: 'info' },
  { label: 'Race', tone: 'warn' },
  { label: 'Trail', tone: 'ok' },
  { label: 'Social / draft', tone: 'muted' },
];

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function timeLabel(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
}

/** Monday of the week containing the given UTC date. */
function mondayOf(d: Date): Date {
  const m = new Date(d);
  m.setUTCHours(0, 0, 0, 0);
  m.setUTCDate(m.getUTCDate() - ((m.getUTCDay() + 6) % 7));
  return m;
}

/** Full weeks (Mon-start) covering the given month, incl. leading/trailing days. */
function monthGrid(year: number, month: number): Date[][] {
  const first = new Date(Date.UTC(year, month, 1));
  const cursor = mondayOf(first);
  const weeks: Date[][] = [];
  do {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    weeks.push(week);
  } while (cursor.getUTCMonth() === month && cursor.getUTCFullYear() === year);
  return weeks;
}

function EventChip({ event }: { event: ClubEvent }) {
  const router = useRouter();
  const tone = toneOf(event);
  return (
    <button
      type="button"
      onClick={() => router.push(`/app/events/${event.id}`)}
      className="group/chip relative flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left transition hover:bg-white/8"
    >
      <span className={cn('h-1.5 w-1.5 flex-none rounded-full', dotClass[tone])} />
      <span className="truncate text-[11.5px] font-medium text-paper/90">{event.title}</span>
      <span className="ml-auto hidden flex-none text-[10.5px] text-muted-2 lg:block">{timeLabel(event.date)}</span>

      {/* Hover tooltip card */}
      <span className="pointer-events-none invisible absolute left-1/2 top-full z-30 mt-1.5 w-56 -translate-x-1/2 rounded-xl border border-line bg-bg-3 p-3 text-left opacity-0 shadow-[0_16px_40px_rgba(0,0,0,0.5)] transition group-hover/chip:visible group-hover/chip:opacity-100">
        <span className="block truncate font-display text-[12.5px] font-semibold text-paper">{event.title}</span>
        <span className="mt-1 block text-[11.5px] text-muted">{formatDateTime(event.date)}</span>
        <span className="mt-1 block text-[11.5px] text-muted">
          <span className="font-semibold text-volt">{event.registered}</span> / {event.capacity} registered
          {event.status === 'draft' && ' · draft'}
        </span>
      </span>
    </button>
  );
}

export default function CalendarClient({ events }: { events: ClubEvent[] }) {
  const router = useRouter();
  const [view, setView] = useState<'month' | 'week'>('month');
  // Anchor: month cursor (July 2026) + week cursor (Monday of today's week).
  const [cursor, setCursor] = useState<{ year: number; month: number }>({ year: 2026, month: 6 });
  const [weekStart, setWeekStart] = useState<Date>(() => mondayOf(new Date(`${TODAY_KEY}T00:00:00Z`)));

  const byDay = useMemo(() => {
    const map = new Map<string, ClubEvent[]>();
    for (const e of events) {
      const key = e.date.slice(0, 10);
      const list = map.get(key) ?? [];
      list.push(e);
      map.set(key, list);
    }
    for (const list of map.values()) list.sort((a, b) => a.date.localeCompare(b.date));
    return map;
  }, [events]);

  const weeks = useMemo(() => monthGrid(cursor.year, cursor.month), [cursor]);

  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setUTCDate(d.getUTCDate() + i);
      days.push(d);
    }
    return days;
  }, [weekStart]);

  function shift(dir: -1 | 1): void {
    if (view === 'month') {
      setCursor((c) => {
        const m = c.month + dir;
        if (m < 0) return { year: c.year - 1, month: 11 };
        if (m > 11) return { year: c.year + 1, month: 0 };
        return { year: c.year, month: m };
      });
    } else {
      setWeekStart((w) => {
        const next = new Date(w);
        next.setUTCDate(next.getUTCDate() + dir * 7);
        return next;
      });
    }
  }

  const weekEnd = weekDays[6];
  const headerLabel =
    view === 'month'
      ? `${MONTH_NAMES[cursor.month]} ${cursor.year}`
      : `${weekStart.getUTCDate()} ${MONTH_NAMES[weekStart.getUTCMonth()].slice(0, 3)} – ${weekEnd.getUTCDate()} ${MONTH_NAMES[weekEnd.getUTCMonth()].slice(0, 3)} ${weekEnd.getUTCFullYear()}`;

  const HOUR_START = 6;
  const HOUR_END = 21;
  const HOUR_PX = 44;

  return (
    <div className="fade-up-1">
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => shift(-1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted transition hover:border-volt/40 hover:text-paper"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => shift(1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted transition hover:border-volt/40 hover:text-paper"
          >
            <ChevronRight size={15} />
          </button>
        </div>
        <div className="min-w-[150px] font-display text-lg font-semibold tracking-tight">{headerLabel}</div>

        <div className="flex rounded-full border border-line p-0.5">
          {(['month', 'week'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                'rounded-full px-4 py-1.5 font-display text-[12.5px] font-semibold capitalize transition',
                view === v ? 'bg-volt text-ink' : 'text-muted hover:text-paper',
              )}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-4">
          <div className="hidden flex-wrap items-center gap-3 md:flex">
            {LEGEND.map((l) => (
              <span key={l.label} className="flex items-center gap-1.5 text-[11.5px] text-muted">
                <span className={cn('h-2 w-2 rounded-full', dotClass[l.tone])} />
                {l.label}
              </span>
            ))}
          </div>
          <Link
            href="#"
            className="rounded-full bg-volt px-5 py-2.5 font-display text-sm font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)]"
          >
            ＋ New event
          </Link>
        </div>
      </div>

      {view === 'month' ? (
        <div className="rounded-card border border-line bg-bg-2">
          <div className="grid grid-cols-7 border-b border-line">
            {WEEKDAY_LABELS.map((d) => (
              <div key={d} className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-2">
                {d}
              </div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className={cn('grid grid-cols-7', wi > 0 && 'border-t border-line')}>
              {week.map((day) => {
                const key = dayKey(day);
                const inMonth = day.getUTCMonth() === cursor.month;
                const isToday = key === TODAY_KEY;
                const dayEvents = byDay.get(key) ?? [];
                return (
                  <div
                    key={key}
                    className={cn(
                      'group relative min-h-[104px] border-l border-line px-1.5 py-1.5 first:border-l-0',
                      !inMonth && 'bg-bg/60',
                    )}
                  >
                    <div className="mb-1 flex items-center justify-between px-1">
                      <span
                        className={cn(
                          'grid h-6 w-6 place-items-center rounded-full text-[12px] font-semibold',
                          inMonth ? 'text-paper/85' : 'text-muted-2',
                          isToday && 'bg-volt/12 text-volt ring-1 ring-volt',
                        )}
                      >
                        {day.getUTCDate()}
                      </span>
                      {isToday && <span className="text-[10px] font-semibold uppercase tracking-wide text-volt">today</span>}
                    </div>
                    {dayEvents.length > 0 ? (
                      <div className="space-y-0.5">
                        {dayEvents.map((e) => (
                          <EventChip key={e.id} event={e} />
                        ))}
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="flex w-full items-center gap-1 rounded-md px-1.5 py-1 text-[11px] text-muted-2 opacity-0 transition group-hover:opacity-100"
                      >
                        <Plus size={11} /> Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-line bg-bg-2">
          <div className="grid grid-cols-[52px_repeat(7,1fr)] border-b border-line">
            <div />
            {weekDays.map((d) => {
              const isToday = dayKey(d) === TODAY_KEY;
              return (
                <div key={dayKey(d)} className="border-l border-line px-3 py-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-2">
                    {WEEKDAY_LABELS[(d.getUTCDay() + 6) % 7]}
                  </span>
                  <span
                    className={cn(
                      'ml-2 inline-grid h-6 w-6 place-items-center rounded-full text-[12px] font-semibold',
                      isToday ? 'bg-volt/12 text-volt ring-1 ring-volt' : 'text-paper/85',
                    )}
                  >
                    {d.getUTCDate()}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-[52px_repeat(7,1fr)]">
            {/* Hour labels */}
            <div className="relative" style={{ height: (HOUR_END - HOUR_START) * HOUR_PX }}>
              {Array.from({ length: HOUR_END - HOUR_START }, (_, i) => (
                <div
                  key={i}
                  className="absolute right-2 -translate-y-1/2 text-[10.5px] text-muted-2"
                  style={{ top: i * HOUR_PX }}
                >
                  {i > 0 && `${String(HOUR_START + i).padStart(2, '0')}:00`}
                </div>
              ))}
            </div>
            {weekDays.map((d) => {
              const key = dayKey(d);
              const dayEvents = byDay.get(key) ?? [];
              return (
                <div key={key} className="relative border-l border-line" style={{ height: (HOUR_END - HOUR_START) * HOUR_PX }}>
                  {Array.from({ length: HOUR_END - HOUR_START - 1 }, (_, i) => (
                    <div key={i} className="absolute inset-x-0 border-t border-line/50" style={{ top: (i + 1) * HOUR_PX }} />
                  ))}
                  {dayEvents.map((e) => {
                    const start = new Date(e.date);
                    const hour = start.getUTCHours() + start.getUTCMinutes() / 60;
                    const top = Math.max(0, (hour - HOUR_START) * HOUR_PX);
                    const tone = toneOf(e);
                    return (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => router.push(`/app/events/${e.id}`)}
                        className={cn(
                          'absolute inset-x-1 z-10 overflow-hidden rounded-lg border-l-2 p-2 text-left transition hover:brightness-125',
                          blockClass[tone],
                        )}
                        style={{ top, height: HOUR_PX * 1.75 }}
                      >
                        <span className="block truncate text-[11.5px] font-semibold text-paper">{e.title}</span>
                        <span className="mt-0.5 block text-[10.5px] text-muted">
                          {timeLabel(e.date)} · {e.registered}/{e.capacity}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

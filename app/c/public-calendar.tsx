'use client';

// Compact public month calendar — July 2026 with volt dots on event days.
// Clicking a day with events smooth-scrolls to that event's card anchor.
import { cn } from '@/lib/utils';

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const TODAY_KEY = '2026-07-02';

export interface PublicCalendarEvent {
  id: string;
  date: string; // ISO datetime
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Full Monday-start weeks covering July 2026. */
function julyGrid(): Date[][] {
  const first = new Date(Date.UTC(2026, 6, 1));
  const cursor = new Date(first);
  cursor.setUTCDate(cursor.getUTCDate() - ((cursor.getUTCDay() + 6) % 7));
  const weeks: Date[][] = [];
  do {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cursor));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    weeks.push(week);
  } while (cursor.getUTCMonth() === 6);
  return weeks;
}

export default function PublicCalendar({ events }: { events: PublicCalendarEvent[] }) {
  const byDay = new Map<string, string>();
  for (const e of events) {
    const key = e.date.slice(0, 10);
    if (!byDay.has(key)) byDay.set(key, e.id);
  }
  const weeks = julyGrid();

  function scrollToEvent(eventId: string): void {
    document.getElementById(`event-${eventId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return (
    <div className="rounded-card border border-line bg-bg-2 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-display text-[15px] font-semibold">July 2026</span>
        <span className="flex items-center gap-1.5 text-[11.5px] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-volt" /> run day
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((d, i) => (
          <div key={`${d}-${i}`} className="grid h-8 place-items-center text-[11px] font-semibold text-muted-2">
            {d}
          </div>
        ))}
        {weeks.flat().map((day) => {
          const key = dayKey(day);
          const inMonth = day.getUTCMonth() === 6;
          const isToday = key === TODAY_KEY;
          const eventId = inMonth ? byDay.get(key) : undefined;
          return (
            <button
              key={key}
              type="button"
              disabled={!eventId}
              onClick={() => eventId && scrollToEvent(eventId)}
              className={cn(
                'relative grid h-9 place-items-center rounded-lg text-[12.5px] transition',
                inMonth ? 'text-paper/85' : 'text-muted-2/60',
                isToday && 'ring-1 ring-volt text-volt font-semibold',
                eventId ? 'cursor-pointer bg-volt/8 font-semibold hover:bg-volt/20' : 'cursor-default',
              )}
            >
              {day.getUTCDate()}
              {eventId && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-volt" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

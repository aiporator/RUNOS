import Link from 'next/link';
import { events } from '@/lib/data';
import { Badge, Card, CardTitle, PageHeader } from '@/components/ui';
import CalendarClient from './calendar-client';

export const dynamic = 'force-dynamic';

const recurringSchedules = [
  { name: 'Saturday Long Run', cadence: 'weekly', slot: 'Sat 07:00' },
  { name: 'Track Tuesday', cadence: 'weekly', slot: 'Tue 18:00' },
  { name: 'New Member Welcome Run', cadence: 'monthly', slot: 'first Thursday' },
];

export default function EventsCalendarPage() {
  const allEvents = events();
  return (
    <div>
      <PageHeader
        kicker="Operations"
        title="Calendar"
        sub={`${allEvents.length} events on the schedule · recurring sessions auto-publish so the calendar never goes quiet.`}
        actions={
          <Link
            href="/app/events"
            className="rounded-full border border-line px-5 py-2.5 font-display text-sm font-semibold text-paper transition hover:border-volt/40"
          >
            List view
          </Link>
        }
      />

      <CalendarClient events={allEvents} />

      <Card className="mt-6 fade-up-2">
        <CardTitle action={<span className="text-[12px] text-muted">3 active schedules</span>}>
          Recurring schedules
        </CardTitle>
        <div className="space-y-3">
          {recurringSchedules.map((s) => (
            <div
              key={s.name}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-bg-3 px-4 py-3.5"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-display text-[14px] font-semibold">{s.name}</span>
                <span className="text-[12.5px] text-muted">
                  {s.cadence} · {s.slot}
                </span>
              </div>
              <Badge tone="volt">auto-publishes T-7d</Badge>
            </div>
          ))}
        </div>
        <p className="mt-4 border-t border-line pt-3 text-[12.5px] leading-relaxed text-muted">
          Set a schedule once — RunOS creates each session, publishes it a week out, and runs the full growth pack
          automatically. Perfect for weekly classes, workshops, and standing club sessions.
        </p>
      </Card>
    </div>
  );
}

import { notFound } from 'next/navigation';
import { getEvent, getMember, registrations } from '@/lib/data';
import CheckinLive, { type CheckinEventProps, type RosterEntry } from './checkin-live';

export const dynamic = 'force-dynamic';

export default async function CheckinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) notFound();

  // Join registrations to members on the server and pass only serializable data down.
  const roster: RosterEntry[] = registrations()
    .filter((r) => r.eventId === event.id)
    .flatMap((r, i) => {
      const m = getMember(r.memberId);
      if (!m) return [];
      return [
        {
          id: m.id,
          name: m.name,
          avatarColor: m.avatarColor,
          isNew: m.status === 'new',
          streak: m.tags.includes('streak-holder') ? 3 + (i % 8) : null,
          waiverSigned: r.waiverSigned,
        },
      ];
    });

  const eventProps: CheckinEventProps = {
    id: event.id,
    title: event.title,
    date: event.date,
    location: event.location,
    registered: event.registered,
    capacity: event.capacity,
    waitlist: event.waitlist,
    volunteers: event.volunteers,
    predictedAttendance: event.predictedAttendance ?? null,
  };

  return <CheckinLive event={eventProps} roster={roster} />;
}

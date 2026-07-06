// Deterministic "book a call" slots — three fixed daily times across the next
// business days. No calendar integration yet (see DEPLOYMENT.md); enough to
// give a partner real choices without an external dependency.

export interface AppointmentSlot {
  id: string;
  iso: string; // ISO 8601 datetime, UTC
  label: string; // "Tue 14 Jul · 14:00 UTC"
}

const DAY_TIMES = ['10:00', '14:00', '16:30'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function isWeekday(d: Date): boolean {
  const day = d.getUTCDay();
  return day !== 0 && day !== 6;
}

/** Next `count` weekday call slots starting tomorrow, three fixed times per day. */
export function getUpcomingSlots(count = 6, from: Date = new Date()): AppointmentSlot[] {
  const slots: AppointmentSlot[] = [];
  const cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  cursor.setUTCDate(cursor.getUTCDate() + 1);
  while (slots.length < count) {
    if (isWeekday(cursor)) {
      for (const time of DAY_TIMES) {
        if (slots.length >= count) break;
        const [h, m] = time.split(':').map(Number);
        const iso = new Date(
          Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate(), h, m),
        ).toISOString();
        slots.push({
          id: iso,
          iso,
          label: `${WEEKDAYS[cursor.getUTCDay()]} ${cursor.getUTCDate()} ${MONTHS[cursor.getUTCMonth()]} · ${time} UTC`,
        });
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return slots;
}

'use client';

// Attendee list for the host's lite dashboard. Check-in toggles are local
// state for the demo — the note in the footer sets expectations.
import { useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { InstantRsvp } from '@/lib/instant';

export default function AttendeeList({ initial }: { initial: InstantRsvp[] }) {
  const [rsvps, setRsvps] = useState(initial);

  function toggle(id: string): void {
    setRsvps((list) => list.map((r) => (r.id === id ? { ...r, checkedIn: !r.checkedIn } : r)));
  }

  if (rsvps.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line py-10 text-center">
        <div className="font-display text-[14.5px] font-semibold">No RSVPs yet</div>
        <p className="mx-auto mt-1.5 max-w-xs text-[12.5px] text-muted">
          Share your link — the first RSVP usually lands within the hour.
        </p>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-line/60">
        {rsvps.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-4 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-[14px] font-semibold">{r.name}</span>
                {r.status === 'waitlist' && <Badge tone="warn">Waitlist</Badge>}
              </div>
              <div className="mt-0.5 truncate text-[12.5px] text-muted">{r.email}</div>
            </div>
            <button
              type="button"
              onClick={() => toggle(r.id)}
              className={cn(
                'inline-flex flex-none items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition',
                r.checkedIn
                  ? 'border-volt/40 bg-volt/15 text-volt'
                  : 'border-line bg-bg-3 text-muted hover:border-volt/40 hover:text-paper',
              )}
            >
              {r.checkedIn ? <CheckCircle2 size={13} /> : <Circle size={13} />}
              {r.checkedIn ? 'Checked in' : 'Check in'}
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t border-line pt-3 text-[11.5px] text-muted-2">
        Check-in syncs on event day — scan tickets or tap names as people arrive.
      </p>
    </div>
  );
}

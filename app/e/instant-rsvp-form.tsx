'use client';

// Instant-event RSVP — hits the real public API (no auth needed, that's the
// point), then flips to a ticket state: confirmed, waitlisted, or a friendly
// "you're already in" for duplicate emails.
import { useState } from 'react';
import { track } from '@/lib/analytics';

type TicketStatus = 'confirmed' | 'waitlist' | 'already_registered';

interface RsvpResponse {
  data?: { status: TicketStatus; rsvp_id: string };
  error?: { message?: string };
}

const MY_RUNS_KEY = 'runos_my_runs';

/** Remembers an RSVP'd event id in this browser — the no-account "My Runs" passport. */
function saveToMyRuns(eventId: string): void {
  try {
    const raw = window.localStorage.getItem(MY_RUNS_KEY);
    const ids: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    if (!ids.includes(eventId)) {
      window.localStorage.setItem(MY_RUNS_KEY, JSON.stringify([...ids, eventId]));
    }
  } catch {
    // storage full/blocked — the RSVP itself still went through
  }
}

/** Deterministic QR-looking placeholder built from divs — keeps the bundle light. */
function QrPlaceholder({ seed }: { seed: string }) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 2147483647;
  const cells: boolean[] = [];
  for (let i = 0; i < 121; i++) {
    h = (h * 16807) % 2147483647;
    cells.push(h % 100 < 46);
  }
  const isFinder = (r: number, c: number): boolean =>
    (r < 3 && c < 3) || (r < 3 && c > 7) || (r > 7 && c < 3);
  return (
    <div className="grid aspect-square w-24 flex-none grid-cols-11 gap-px rounded-md bg-paper p-1.5">
      {cells.map((on, i) => {
        const r = Math.floor(i / 11);
        const c = i % 11;
        const filled = isFinder(r, c)
          ? (r === 1 && c === 1) || (r === 1 && c === 9) || (r === 9 && c === 1) || r === 0 || r === 2 || r === 8 || r === 10 || c === 0 || c === 2 || c === 8 || c === 10
          : on;
        return <div key={i} className={filled ? 'bg-ink' : 'bg-paper'} />;
      })}
    </div>
  );
}

export default function InstantRsvpForm({
  eventId,
  eventTitle,
  waitlist,
}: {
  eventId: string;
  eventTitle: string;
  waitlist: boolean;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<TicketStatus | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/v1/public/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const json = (await res.json()) as RsvpResponse;
      if (!json.data) {
        setError(json.error?.message ?? 'Something went wrong — try again.');
        setSubmitting(false);
        return;
      }
      track('instant_rsvp', { eventId, status: json.data.status });
      saveToMyRuns(eventId);
      setStatus(json.data.status);
    } catch {
      setError('Network hiccup — try again.');
      setSubmitting(false);
    }
  }

  if (status) {
    const isWaitlist = status === 'waitlist';
    return (
      <div>
        <div className="font-display text-lg font-semibold text-volt">
          {status === 'already_registered'
            ? "You're already on the list!"
            : isWaitlist
              ? "You're on the waitlist!"
              : "You're in!"}
        </div>
        <p className="mt-1.5 text-[13.5px] text-muted">
          {isWaitlist
            ? 'If a spot opens up, the first waitlisted guest takes it — check your email.'
            : 'Show this ticket at the door — no app, no printout needed.'}
        </p>
        <div className="mt-4 flex items-center gap-4 rounded-xl border border-dashed border-volt/40 bg-bg-3 p-4">
          <QrPlaceholder seed={eventId + email} />
          <div className="min-w-0">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-2">
              {isWaitlist ? 'Waitlist pass' : 'Your ticket'}
            </div>
            <div className="mt-1 truncate font-display text-[14.5px] font-semibold">{eventTitle}</div>
            <div className="mt-1 text-[12px] text-muted">{name || 'Guest'} · scan at check-in</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        aria-label="Your name"
        className="w-full rounded-xl border border-line bg-bg-3 px-4 py-3 text-[14px] text-paper placeholder:text-muted-2 focus:border-volt/50 focus:outline-none"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        aria-label="Email address"
        className="w-full rounded-xl border border-line bg-bg-3 px-4 py-3 text-[14px] text-paper placeholder:text-muted-2 focus:border-volt/50 focus:outline-none"
      />
      {error && <p className="text-[12.5px] text-danger">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-volt px-6 py-3.5 font-display text-[15px] font-semibold text-ink transition hover:shadow-[0_10px_32px_rgba(205,251,80,0.35)] disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? 'Saving…' : waitlist ? 'Join waitlist' : 'Reserve my spot'}
      </button>
      <p className="text-center text-[12px] text-muted-2">No account needed — just show up.</p>
    </form>
  );
}

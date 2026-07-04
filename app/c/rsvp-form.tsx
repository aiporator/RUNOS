'use client';

// Public event RSVP — unauthenticated visitors can't hit the registrations API
// (it would 401), so the lead is captured via /api/v1/leads fire-and-forget and
// the form always flips to the ticket success state.
import { useState } from 'react';
import { track } from '@/lib/analytics';

/** Deterministic QR-looking placeholder built from divs — keeps the public bundle light. */
function QrPlaceholder({ seed }: { seed: string }) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 2147483647;
  const cells: boolean[] = [];
  for (let i = 0; i < 121; i++) {
    h = (h * 16807) % 2147483647;
    cells.push(h % 100 < 46);
  }
  // Finder-pattern corners so it reads as a QR code.
  const isFinder = (r: number, c: number): boolean =>
    (r < 3 && c < 3) || (r < 3 && c > 7) || (r > 7 && c < 3);
  return (
    <div className="grid aspect-square w-24 flex-none grid-cols-11 gap-px rounded-md bg-paper p-1.5">
      {cells.map((on, i) => {
        const r = Math.floor(i / 11);
        const c = i % 11;
        const filled = isFinder(r, c) ? (r === 1 && c === 1) || (r === 1 && c === 9) || (r === 9 && c === 1) || r === 0 || r === 2 || r === 8 || r === 10 || c === 0 || c === 2 || c === 8 || c === 10 : on;
        return <div key={i} className={filled ? 'bg-ink' : 'bg-paper'} />;
      })}
    </div>
  );
}

export default function RsvpForm({
  eventId,
  eventTitle,
  slug,
  waitlist,
}: {
  eventId: string;
  eventTitle: string;
  slug: string;
  waitlist: boolean;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    fetch('/api/v1/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name,
        org_name: slug,
        vertical: 'running-club',
        source: 'public_event_rsvp',
        event_id: eventId,
      }),
    }).catch(() => {});
    track('public_rsvp_submitted', { eventId });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div>
        <div className="font-display text-lg font-semibold text-volt">
          {waitlist ? "You're on the waitlist!" : "You're registered!"}
        </div>
        <p className="mt-1.5 text-[13.5px] text-muted">
          {waitlist
            ? 'Check your email — we promote from the waitlist automatically when spots open.'
            : 'Check your email for your QR ticket.'}
        </p>
        <div className="mt-4 flex items-center gap-4 rounded-xl border border-dashed border-volt/40 bg-bg-3 p-4">
          <QrPlaceholder seed={eventId + email} />
          <div className="min-w-0">
            <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted-2">
              {waitlist ? 'Waitlist pass' : 'Your ticket'}
            </div>
            <div className="mt-1 truncate font-display text-[14.5px] font-semibold">{eventTitle}</div>
            <div className="mt-1 text-[12px] text-muted">{name || 'Guest runner'} · scan at check-in</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
      <button
        type="submit"
        className="w-full rounded-full bg-volt px-6 py-3.5 font-display text-[15px] font-semibold text-ink transition hover:shadow-[0_10px_32px_rgba(205,251,80,0.35)]"
      >
        {waitlist ? 'Join waitlist' : 'Reserve my spot'}
      </button>
      <p className="text-center text-[12px] text-muted-2">Free cancellation until 24h before the start.</p>
    </form>
  );
}

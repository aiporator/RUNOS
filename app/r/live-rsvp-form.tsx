'use client';

import { useState } from 'react';
import { getSupabase } from '@/lib/supabase';
import { track } from '@/lib/analytics';

export default function LiveRsvpForm({
  eventId, full, eventTitle,
}: { eventId: string; full: boolean; eventTitle: string }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'dup'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  function onStart() {
    if (!started) {
      setStarted(true);
      track('rsvp_started', { eventId });
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('busy');
    setError(null);
    const supabase = getSupabase();
    const { error: err } = await supabase.from('runos_rsvps').insert({
      event_id: eventId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      status: full ? 'waitlist' : 'confirmed',
    });
    if (err) {
      if (err.code === '23505') {
        setState('dup');
        return;
      }
      setError(err.message);
      setState('idle');
      return;
    }
    track('live_rsvp_submitted', { eventId, status: full ? 'waitlist' : 'confirmed' });
    setState('done');
  }

  if (state === 'done' || state === 'dup') {
    return (
      <div className="rounded-xl border border-dashed border-volt/50 bg-volt/8 p-4 text-center">
        <div className="font-display text-[15px] font-semibold text-volt">
          {state === 'dup' ? "You're already on the list!" : full ? "You're on the waitlist!" : "You're in! 🎉"}
        </div>
        <p className="mt-1.5 text-[12px] text-muted">
          {eventTitle} — see you there. The organizer has your details.
        </p>
      </div>
    );
  }

  const input =
    'w-full rounded-lg border border-line bg-bg-2 px-3.5 py-2.5 text-[13.5px] outline-none transition focus:border-volt/60 placeholder:text-muted-2';

  return (
    <form onSubmit={submit} className="space-y-2.5">
      <div className="font-display text-[13.5px] font-semibold">{full ? 'Join the waitlist' : 'Register — 10 seconds'}</div>
      <input className={input} placeholder="Your name" aria-label="Your name" value={name} onFocus={onStart} onChange={(e) => setName(e.target.value)} required />
      <input className={input} type="email" placeholder="Email" aria-label="Email address" value={email} onFocus={onStart} onChange={(e) => setEmail(e.target.value)} required />
      {error && <p className="text-[11.5px] text-danger">{error}</p>}
      <button
        disabled={state === 'busy'}
        className="w-full rounded-full bg-volt py-2.5 font-display text-[13.5px] font-semibold text-ink transition hover:shadow-[0_6px_22px_rgba(205,251,80,0.35)] disabled:opacity-60"
      >
        {state === 'busy' ? 'Saving…' : full ? 'Join waitlist →' : 'Reserve my spot →'}
      </button>
      <p className="text-center text-[10.5px] text-muted-2">Free · no account needed</p>
    </form>
  );
}

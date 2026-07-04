'use client';

// Public "request to join" form — captures the lead fire-and-forget and always
// shows the success state (the leads endpoint may lag behind this page).
import { useState } from 'react';
import { Check } from 'lucide-react';
import { track } from '@/lib/analytics';

export default function JoinForm({ slug, orgName }: { slug: string; orgName: string }) {
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
        source: 'public_page_join',
      }),
    }).catch(() => {});
    track('public_rsvp_submitted', { slug });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-card border border-volt/30 bg-volt/8 p-8 text-center">
        <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-volt/15">
          <Check size={22} className="text-volt" strokeWidth={3} />
        </span>
        <div className="font-display text-xl font-semibold">You&apos;re in the queue</div>
        <p className="mx-auto mt-2 max-w-sm text-[14px] text-muted">
          You&apos;re in the queue — the organizers will approve you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card border border-line bg-bg-2 p-6 sm:p-8">
      <div className="grid gap-3 sm:grid-cols-2">
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
      </div>
      <button
        type="submit"
        className="mt-4 w-full rounded-full bg-volt px-6 py-3.5 font-display text-[15px] font-semibold text-ink transition hover:shadow-[0_10px_32px_rgba(205,251,80,0.35)]"
      >
        Request to join — it&apos;s free
      </button>
      <p className="mt-3 text-center text-[12px] text-muted-2">
        Joining {orgName} is free. No spam — just run invites.
      </p>
    </form>
  );
}

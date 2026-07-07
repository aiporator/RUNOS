'use client';

// /talk-to-us — books a real call slot against /api/v1/appointments. No
// calendar integration yet (see DEPLOYMENT.md): slots are generated
// deterministically and a human confirms by email within one business day.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { track } from '@/lib/analytics';
import { VERTICALS, type VerticalId } from '@/lib/verticals';
import { cn } from '@/lib/utils';

interface SlotsResponse {
  data?: { id: string; iso: string; label: string }[];
}

interface CreateAppointmentResponse {
  data?: { id: string; status: string };
  error?: { message?: string };
}

const inputCls =
  'w-full rounded-xl border border-line bg-bg-3 px-4 py-3 text-[14px] text-paper outline-none transition placeholder:text-muted-2 focus:border-volt/60';

const labelCls = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted';

export default function BookCallForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [verticalId, setVerticalId] = useState<VerticalId | ''>('');
  const [notes, setNotes] = useState('');
  const [slots, setSlots] = useState<{ id: string; iso: string; label: string }[]>([]);
  const [slotIso, setSlotIso] = useState('');
  const [source, setSource] = useState('talk_to_us');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  // Prefill from a referring page (e.g. the onboarding wizard) via query string.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const org = params.get('org_name');
    const vert = params.get('vertical');
    const src = params.get('source');
    if (org) setOrgName(org);
    if (vert && VERTICALS.some((v) => v.id === vert)) setVerticalId(vert as VerticalId);
    if (src) setSource(src);
  }, []);

  useEffect(() => {
    fetch('/api/v1/appointments/slots')
      .then((res) => res.json() as Promise<SlotsResponse>)
      .then((json) => setSlots(json.data ?? []))
      .catch(() => setSlots([]));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    const slot = slots.find((s) => s.iso === slotIso);
    try {
      const res = await fetch('/api/v1/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          org_name: orgName || undefined,
          vertical: verticalId || undefined,
          slot_iso: slot?.iso,
          slot_label: slot?.label,
          notes: notes || undefined,
          source,
        }),
      });
      const json = (await res.json()) as CreateAppointmentResponse;
      if (!res.ok || !json.data) {
        setError(json.error?.message ?? 'Something went wrong — try again.');
        setSubmitting(false);
        return;
      }
      track('appointment_requested', { vertical: verticalId || 'unspecified', has_slot: Boolean(slot) });
      setDone(true);
    } catch {
      setError('Network hiccup — try again.');
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-svh bg-bg text-paper">
        <header className="border-b border-line">
          <div className="mx-auto flex max-w-[900px] items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-[9px] font-display text-[19px] font-bold tracking-[-0.02em]">
              <span className="pulse-dot h-[10px] w-[10px] rounded-full bg-volt shadow-[0_0_14px_#cdfb50]" />
              RunOS
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-[560px] px-6 pb-24 pt-20 text-center">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-volt/15 text-3xl">✓</div>
          <h1 className="font-display text-[clamp(28px,4vw,40px)] font-bold leading-[1.1] tracking-[-0.02em]">
            Request sent.
          </h1>
          <p className="mt-3 text-[15px] text-muted">
            {slotIso
              ? `We'll confirm ${slots.find((s) => s.iso === slotIso)?.label ?? 'your slot'} by email within one business day.`
              : 'We\'ll reach out by email within one business day to find a time.'}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/new" className="group rounded-full bg-volt px-6 py-3 font-display text-[14px] font-semibold text-ink transition hover:shadow-[0_10px_32px_rgba(205,251,80,0.35)]">
              Try creating an event meanwhile →
            </Link>
            <a href="mailto:start@aiporate.com" className="text-[13px] text-muted-2 transition-colors hover:text-volt">
              Or email start@aiporate.com directly
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-bg text-paper">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[900px] items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-[9px] font-display text-[19px] font-bold tracking-[-0.02em]">
            <span className="pulse-dot h-[10px] w-[10px] rounded-full bg-volt shadow-[0_0_14px_#cdfb50]" />
            RunOS
          </Link>
          <Link href="/demo" className="text-[13px] text-muted-2 transition-colors hover:text-volt">
            See the demo first
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-6 pb-20 pt-12">
        <div className="fade-up">
          <h1 className="font-display text-[clamp(28px,4.5vw,46px)] font-bold leading-[1.05] tracking-[-0.02em]">
            Let&apos;s talk. <span className="text-volt">Pick a time.</span>
          </h1>
          <p className="mt-3 max-w-[56ch] text-[15px] text-muted">
            Founding-club pilots, Network-tier rollouts, brand partnerships — tell us where you
            are and grab a slot. A real person confirms by email.
          </p>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="fade-up-1 mt-10 space-y-6">
          <div className="rounded-card border border-line bg-bg-2 p-6 sm:p-7">
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="call-name" className={labelCls}>Your name</label>
                  <input
                    id="call-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Maya Torres"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="call-email" className={labelCls}>Email</label>
                  <input
                    id="call-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maya@harborcity.run"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="call-org" className={labelCls}>Club / organization (optional)</label>
                  <input
                    id="call-org"
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Harbor City Runners"
                    className={inputCls}
                  />
                </div>
                <div>
                  <span className={labelCls}>What best describes you?</span>
                  <select
                    value={verticalId}
                    onChange={(e) => setVerticalId(e.target.value as VerticalId | '')}
                    className={cn(inputCls, 'appearance-none')}
                  >
                    <option value="">Prefer not to say</option>
                    {VERTICALS.map((v) => (
                      <option key={v.id} value={v.id}>{v.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <span className={labelCls}>Pick a slot (optional — we can also just email you)</span>
                <div className="grid gap-2 sm:grid-cols-3">
                  {slots.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSlotIso(slotIso === s.iso ? '' : s.iso)}
                      className={cn(
                        'rounded-xl border px-3 py-2.5 text-left text-[12.5px] font-semibold transition-all duration-200',
                        slotIso === s.iso
                          ? 'border-volt bg-volt/15 text-volt'
                          : 'border-line bg-bg-3 text-muted hover:border-volt/40 hover:text-paper',
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="call-notes" className={labelCls}>What should we know? (optional)</label>
                <textarea
                  id="call-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="We run 400 members across 3 chapters and need SSO + white-label…"
                  className={cn(inputCls, 'resize-y')}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-card border border-danger/30 bg-danger/10 px-4 py-3 text-[13.5px] text-danger">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={cn(
              'w-full rounded-full bg-volt px-6 py-4 font-display text-[16px] font-semibold text-ink transition hover:shadow-[0_10px_32px_rgba(205,251,80,0.35)]',
              submitting && 'cursor-wait opacity-60',
            )}
          >
            {submitting ? 'Sending…' : slotIso ? 'Request this slot →' : 'Send request →'}
          </button>
          <p className="text-center text-[12px] text-muted-2">
            No account needed. We reply by email — usually within one business day.
          </p>
        </form>
      </main>
    </div>
  );
}

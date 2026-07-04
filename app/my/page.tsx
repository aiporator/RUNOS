'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabase, slugify, type LiveEvent, type LiveOrg } from '@/lib/supabase';
import { getVertical } from '@/lib/verticals';
import { track } from '@/lib/analytics';

interface EventWithStats extends LiveEvent {
  confirmed: number;
}

export default function MyClubPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);
  const [org, setOrg] = useState<LiveOrg | null>(null);
  const [events, setEvents] = useState<EventWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [clubName, setClubName] = useState('');
  // event form
  const [title, setTitle] = useState('Saturday Long Run');
  const [type, setType] = useState('long-run');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('08:00');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(30);
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justCreated, setJustCreated] = useState<string | null>(null);

  const load = useCallback(async (userId: string) => {
    const supabase = getSupabase();
    setLoading(true);
    const { data: orgs } = await supabase
      .from('runos_orgs')
      .select('*')
      .eq('owner_id', userId)
      .limit(1);
    const found = (orgs?.[0] as LiveOrg | undefined) ?? null;
    setOrg(found);
    if (found) {
      const { data: evts } = await supabase
        .from('runos_events')
        .select('*')
        .eq('org_id', found.id)
        .order('starts_at', { ascending: true });
      const withStats: EventWithStats[] = [];
      for (const e of (evts ?? []) as LiveEvent[]) {
        const { data: stats } = await supabase.rpc('runos_event_stats', { eid: e.id });
        const row = Array.isArray(stats) ? stats[0] : stats;
        withStats.push({ ...e, confirmed: Number(row?.confirmed ?? 0) });
      }
      setEvents(withStats);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
      if (data.session) void load(data.session.user.id);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [load]);

  useEffect(() => {
    if (checked && !session) router.replace('/signup');
  }, [checked, session, router]);

  async function createClub(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setBusy(true);
    const supabase = getSupabase();
    const name = clubName.trim() || 'My Club';
    const slug = `${slugify(name) || 'club'}-${session.user.id.slice(0, 4)}`;
    const { error: err } = await supabase.from('runos_orgs').insert({
      owner_id: session.user.id,
      name,
      slug,
      vertical: 'running-club',
      city: null,
    });
    setBusy(false);
    if (err) setError(err.message);
    else void load(session.user.id);
  }

  async function createEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!org || !date) return;
    setBusy(true);
    setError(null);
    const supabase = getSupabase();
    const startsAt = new Date(`${date}T${time || '08:00'}:00`).toISOString();
    const { data, error: err } = await supabase
      .from('runos_events')
      .insert({
        org_id: org.id,
        title: title.trim(),
        type,
        starts_at: startsAt,
        location: location.trim() || null,
        capacity,
        description: description.trim() || null,
        published: true,
      })
      .select('id')
      .single();
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    track('live_event_published', { vertical: org.vertical, capacity });
    setJustCreated(data?.id ?? null);
    setTitle('');
    setDescription('');
    if (session) void load(session.user.id);
  }

  if (!checked || (checked && !session)) {
    return <main className="grid min-h-screen place-items-center text-muted">Loading…</main>;
  }

  const v = org ? getVertical(org.vertical) : getVertical('running-club');
  const publicUrl = org ? `/r/${org.slug}` : '';
  const input =
    'w-full rounded-xl border border-line bg-bg-2 px-4 py-3 text-[14px] outline-none transition focus:border-volt/60 placeholder:text-muted-2';

  return (
    <main className="mx-auto max-w-[900px] px-5 py-10">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-bold">
          <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-volt shadow-[0_0_12px_#cdfb50]" />
          RunOS <span className="rounded-full border border-volt/30 bg-volt/10 px-2.5 py-0.5 text-[10.5px] font-semibold text-volt">LIVE</span>
        </Link>
        <button
          onClick={async () => { await getSupabase().auth.signOut(); router.push('/'); }}
          className="text-[13px] text-muted hover:text-paper"
        >
          Sign out
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Loading your club…</p>
      ) : !org ? (
        <div className="mx-auto max-w-[440px] rounded-card border border-line bg-bg-2 p-7">
          <h1 className="font-display text-[22px] font-semibold">Name your club</h1>
          <p className="mt-1.5 text-[13px] text-muted">One last step — then plan your first run.</p>
          <form onSubmit={createClub} className="mt-5 space-y-3.5">
            <input className={input} placeholder="Club name" value={clubName} onChange={(e) => setClubName(e.target.value)} required />
            {error && <p className="text-[12.5px] text-danger">{error}</p>}
            <button className="w-full rounded-full bg-volt py-3 font-display text-[15px] font-semibold text-ink" disabled={busy}>
              Create club →
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-volt">{v.emoji} {v.label} · live workspace</div>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">{org.name}</h1>
            <p className="mt-1.5 text-[13.5px] text-muted">
              Public page:{' '}
              <Link href={publicUrl} className="font-semibold text-volt hover:underline">{publicUrl}</Link>
              {' '}— share it anywhere. Registrations land here in real time.
            </p>
          </div>

          {justCreated && (
            <div className="mb-6 rounded-card border border-volt/30 bg-volt/10 px-5 py-4 text-[13.5px]">
              <span className="font-semibold text-volt">Your {v.nouns.event} is live!</span>{' '}
              Share the public page — every registration appears below.{' '}
              <Link href={publicUrl} className="font-semibold text-volt underline">Open public page →</Link>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <section className="rounded-card border border-line bg-bg-2 p-6">
              <h2 className="font-display text-[16px] font-semibold">
                {events.length === 0 ? `Plan your first ${v.nouns.event}` : `Plan the next ${v.nouns.event}`}
              </h2>
              <form onSubmit={createEvent} className="mt-4 space-y-3">
                <input className={input} placeholder={`${v.sampleEvents[0]?.title ?? 'Event title'}`} value={title} onChange={(e) => setTitle(e.target.value)} required />
                <div className="flex flex-wrap gap-1.5">
                  {v.eventTypes.map((t) => (
                    <button type="button" key={t.id} onClick={() => setType(t.id)}
                      className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${type === t.id ? 'border-volt bg-volt text-ink' : 'border-line text-muted hover:text-paper'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input className={input} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                  <input className={input} type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
                <input className={input} placeholder="Meeting point / location" value={location} onChange={(e) => setLocation(e.target.value)} />
                <div>
                  <div className="mb-1.5 flex justify-between text-[12px] text-muted">
                    <span>Capacity</span><span className="font-semibold text-paper">{capacity}</span>
                  </div>
                  <input type="range" min={1} max={200} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="w-full accent-[#cdfb50]" />
                </div>
                <textarea className={`${input} min-h-[70px]`} placeholder="Description (pace groups, what to bring…)" value={description} onChange={(e) => setDescription(e.target.value)} />
                {error && <p className="text-[12.5px] text-danger">{error}</p>}
                <button className="w-full rounded-full bg-volt py-3 font-display text-[14.5px] font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)] disabled:opacity-60" disabled={busy}>
                  {busy ? 'Publishing…' : `Publish ${v.nouns.event} →`}
                </button>
              </form>
            </section>

            <section className="rounded-card border border-line bg-bg-2 p-6">
              <h2 className="font-display text-[16px] font-semibold">Your {v.nouns.event}s</h2>
              {events.length === 0 ? (
                <p className="mt-4 rounded-xl border border-dashed border-line px-4 py-8 text-center text-[13px] text-muted">
                  Nothing yet — publish your first {v.nouns.event} and share the public page.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {events.map((e) => (
                    <div key={e.id} className="rounded-xl border border-line bg-bg-3 px-4 py-3.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-display text-[14px] font-semibold">{e.title}</div>
                          <div className="mt-0.5 text-[12px] text-muted">
                            {new Date(e.starts_at).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            {e.location ? ` · ${e.location}` : ''}
                          </div>
                        </div>
                        <div className="flex-none text-right">
                          <div className="font-display text-[18px] font-bold text-volt">{e.confirmed}<span className="text-[12px] font-medium text-muted">/{e.capacity}</span></div>
                          <div className="text-[10.5px] text-muted-2">registered</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-5 border-t border-line pt-4 text-[12.5px] text-muted">
                Want the full OS — CRM, automations, sponsors, Pacer AI?{' '}
                <Link href="/app" className="font-semibold text-volt hover:underline">Tour the workspace →</Link>
              </div>
            </section>
          </div>
        </>
      )}
    </main>
  );
}

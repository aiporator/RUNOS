'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSupabase, slugify } from '@/lib/supabase';
import { VERTICALS } from '@/lib/verticals';
import { track } from '@/lib/analytics';

type Mode = 'signup' | 'signin';

export default function SignupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clubName, setClubName] = useState('');
  const [city, setCity] = useState('');
  const [vertical, setVertical] = useState('running-club');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function ensureOrg(userId: string) {
    const supabase = getSupabase();
    const { data: existing } = await supabase
      .from('runos_orgs')
      .select('id, slug')
      .eq('owner_id', userId)
      .limit(1);
    if (existing && existing.length > 0) return;
    const name = clubName.trim() || 'My Club';
    const base = slugify(name) || 'club';
    const slug = `${base}-${userId.slice(0, 4)}`;
    await supabase.from('runos_orgs').insert({
      owner_id: userId,
      name,
      slug,
      vertical,
      city: city.trim() || null,
    });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const supabase = getSupabase();
    try {
      if (mode === 'signup') {
        if (!clubName.trim()) {
          setError('Give your club a name — you can change it later.');
          return;
        }
        // Stash the club so we can create it after email confirmation too.
        localStorage.setItem(
          'runos_pending_club',
          JSON.stringify({ clubName: clubName.trim(), city: city.trim(), vertical }),
        );
        const { data, error: err } = await supabase.auth.signUp({ email, password });
        if (err) {
          setError(err.message);
          return;
        }
        track('account_created', { vertical });
        track('signup_completed', { vertical });
        if (data.session && data.user) {
          await ensureOrg(data.user.id);
          router.push('/my');
        } else {
          setNotice(
            'Almost there — we sent a confirmation link to your email. Click it, come back, and sign in. Your club will be created automatically.',
          );
        }
      } else {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) {
          setError(err.message);
          return;
        }
        if (data.user) {
          const pending = localStorage.getItem('runos_pending_club');
          if (pending) {
            try {
              const p = JSON.parse(pending) as { clubName: string; city: string; vertical: string };
              setClubName(p.clubName);
              setCity(p.city);
              setVertical(p.vertical);
            } catch {
              /* ignore */
            }
          }
          await ensureOrg(data.user.id);
          localStorage.removeItem('runos_pending_club');
          router.push('/my');
        }
      }
    } finally {
      setBusy(false);
    }
  }

  const input =
    'w-full rounded-xl border border-line bg-bg-2 px-4 py-3 text-[14.5px] outline-none transition focus:border-volt/60 placeholder:text-muted-2';

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-[440px]">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 font-display text-xl font-bold">
          <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-volt shadow-[0_0_12px_#cdfb50]" />
          RunOS
        </Link>

        <div className="rounded-card border border-line bg-bg-2 p-7">
          <div className="mb-6 flex rounded-full border border-line p-1">
            {(['signup', 'signin'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); setNotice(null); }}
                className={`flex-1 rounded-full py-2 font-display text-[13.5px] font-semibold transition ${
                  mode === m ? 'bg-volt text-ink' : 'text-muted hover:text-paper'
                }`}
              >
                {m === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            ))}
          </div>

          <h1 className="font-display text-[22px] font-semibold tracking-tight">
            {mode === 'signup' ? 'Your club, live in minutes.' : 'Welcome back.'}
          </h1>
          <p className="mt-1.5 text-[13px] text-muted">
            {mode === 'signup'
              ? 'Free under 50 members. No credit card.'
              : 'Sign in to your club workspace.'}
          </p>

          <form onSubmit={submit} className="mt-6 space-y-3.5">
            {mode === 'signup' && (
              <>
                <input className={input} placeholder="Club name — e.g. Harbor City Runners" value={clubName} onChange={(e) => setClubName(e.target.value)} required />
                <input className={input} placeholder="City (optional)" value={city} onChange={(e) => setCity(e.target.value)} />
                <div className="flex flex-wrap gap-1.5">
                  {VERTICALS.map((v) => (
                    <button
                      type="button"
                      key={v.id}
                      onClick={() => setVertical(v.id)}
                      className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
                        vertical === v.id ? 'border-volt bg-volt text-ink' : 'border-line text-muted hover:text-paper'
                      }`}
                    >
                      {v.emoji} {v.label}
                    </button>
                  ))}
                </div>
              </>
            )}
            <input className={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <input className={input} type="password" placeholder="Password (8+ characters)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />

            {error && <p className="rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-[12.5px] text-danger">{error}</p>}
            {notice && <p className="rounded-lg border border-volt/30 bg-volt/10 px-3.5 py-2.5 text-[12.5px] text-paper/90">{notice}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-volt py-3 font-display text-[15px] font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)] disabled:opacity-60"
            >
              {busy ? 'One moment…' : mode === 'signup' ? 'Create my club →' : 'Sign in →'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-[12.5px] text-muted">
          Just need one event page? <Link href="/new" className="font-semibold text-volt hover:underline">Create one free — no account</Link>
        </p>
      </div>
    </main>
  );
}

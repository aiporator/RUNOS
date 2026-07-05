'use client';

// /start — the self-serve onboarding wizard. Five steps, state persisted to
// localStorage ('runos_onboarding'), every step instrumented, final payload
// POSTed to /api/v1/leads.
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { getVertical, VERTICALS, type VerticalId } from '@/lib/verticals';
import { arr, btnGhost, btnVolt } from '@/components/marketing/styles';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

type ImportMethod = 'csv' | 'paste' | 'skip';

interface ImportedRow {
  name: string;
  email: string;
}

interface WizardState {
  step: number; // 1..5
  verticalId: VerticalId | '';
  orgName: string;
  city: string;
  brandColor: string;
  importMethod: ImportMethod | '';
  memberCount: number;
  previewRows: ImportedRow[];
  pasteText: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventCapacity: string;
  eventPrice: string;
  eventType: string;
  submitted: boolean;
}

const STORAGE_KEY = 'runos_onboarding';

const DEFAULT_STATE: WizardState = {
  step: 1,
  verticalId: '',
  orgName: '',
  city: '',
  brandColor: '#cdfb50',
  importMethod: '',
  memberCount: 0,
  previewRows: [],
  pasteText: '',
  eventTitle: '',
  eventDate: '',
  eventTime: '18:00',
  eventCapacity: '30',
  eventPrice: '0',
  eventType: '',
  submitted: false,
};

const ORG_PLACEHOLDERS: Record<VerticalId, string> = {
  'running-club': 'Harbor City Runners',
  gym: 'Iron Habit Gym',
  'fitness-studio': 'Studio Flow',
  workshop: 'Clay & Fire Workshops',
  community: 'North Meetup',
};

const BRAND_SWATCHES = ['#cdfb50', '#7db8ff', '#b78bff', '#ff9d7a', '#7ee081', '#ffc94d'];

const STEP_LABELS = ['Vertical', 'Name it', 'Your people', 'First event', 'Done'];

// ---------------------------------------------------------------------------
// Parsing helpers (client-side, forgiving)
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseCsv(text: string): ImportedRow[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(',');
      return { name: (parts[0] ?? '').trim(), email: (parts[1] ?? '').trim() };
    })
    .filter((row) => row.name.length > 0 && EMAIL_RE.test(row.email) && row.name.toLowerCase() !== 'name');
}

function parseEmails(text: string): string[] {
  return text
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => EMAIL_RE.test(s));
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

const inputCls =
  'w-full rounded-xl border border-line bg-bg-3 px-4 py-3 text-[14.5px] text-paper outline-none transition placeholder:text-muted-2 focus:border-volt/60';

const labelCls = 'mb-2 block text-[12px] font-semibold uppercase tracking-[0.14em] text-muted';

function StepHeading({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-volt">{kicker}</div>
      <h1 className="font-display text-[clamp(28px,4vw,44px)] font-semibold leading-tight tracking-[-0.02em]">
        {title}
      </h1>
      {sub && <p className="mt-2 max-w-[52ch] text-[15px] text-muted">{sub}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Wizard
// ---------------------------------------------------------------------------

export default function StartPage() {
  const [state, setState] = useState<WizardState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);
  const startedRef = useRef(false);

  // Hydrate from localStorage once, then fire wizard_started once per mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<WizardState>;
        setState({ ...DEFAULT_STATE, ...parsed });
      }
    } catch {
      // corrupted stash — start fresh
    }
    setLoaded(true);
    if (!startedRef.current) {
      startedRef.current = true;
      track('wizard_started');
    }
  }, []);

  // Persist on every change (after initial load).
  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full/blocked — wizard still works in-memory
    }
  }, [state, loaded]);

  const patch = useCallback((p: Partial<WizardState>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  const vertical = state.verticalId ? getVertical(state.verticalId) : null;

  const submitLead = useCallback((s: WizardState) => {
    void fetch('/api/v1/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        org_name: s.orgName,
        vertical: s.verticalId,
        city: s.city || undefined,
        member_count: s.memberCount,
        first_event_title: s.eventTitle || undefined,
        source: 'start_wizard',
      }),
    }).catch(() => {
      // funnel capture is best-effort; never block the celebration
    });
  }, []);

  const completeStep = useCallback(
    (step: number) => {
      setState((s) => {
        track('wizard_step_completed', { step, vertical: s.verticalId });
        if (step === 4) {
          track('wizard_completed', { vertical: s.verticalId, memberCount: s.memberCount });
          if (!s.submitted) submitLead(s);
          return { ...s, step: 5, submitted: true };
        }
        return { ...s, step: step + 1 };
      });
    },
    [submitLead],
  );

  const goBack = useCallback(() => {
    setState((s) => ({ ...s, step: Math.max(1, s.step - 1) }));
  }, []);

  const canAdvance =
    (state.step === 1 && state.verticalId !== '') ||
    (state.step === 2 && state.orgName.trim().length > 0) ||
    (state.step === 3 && state.importMethod !== '') ||
    (state.step === 4 && state.eventTitle.trim().length > 0 && state.eventDate !== '');

  return (
    <div className="flex min-h-svh flex-col bg-bg text-paper">
      {/* top bar */}
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-[9px] font-display text-[19px] font-bold tracking-[-0.02em]"
        >
          <span className="pulse-dot h-[10px] w-[10px] rounded-full bg-volt shadow-[0_0_14px_#cdfb50]" />
          RunOS
        </Link>
        {/* progress dots */}
        <div className="flex items-center gap-2.5" aria-label={`Step ${state.step} of 5`}>
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            return (
              <span
                key={label}
                title={label}
                className={cn(
                  'h-2 rounded-full transition-all duration-300 ease-out-expo',
                  n === state.step ? 'w-6 bg-volt' : n < state.step ? 'w-2 bg-volt/60' : 'w-2 bg-white/15',
                )}
              />
            );
          })}
        </div>
        <Link href="/demo" className="text-[13px] text-muted-2 transition-colors hover:text-volt">
          See the demo first
        </Link>
      </div>

      <div className="mx-auto w-full max-w-[860px] flex-1 px-6 py-14">
        {/* ------------------------------------------------ step 1: vertical */}
        {state.step === 1 && (
          <div className="fade-up">
            <StepHeading
              kicker="Step 1 of 5"
              title="What are you running?"
              sub="One OS, many kinds of communities. Everything downstream adapts to your answer."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {VERTICALS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() =>
                    patch({
                      verticalId: v.id,
                      eventTitle: v.sampleEvents[0]?.title ?? '',
                      eventType: v.eventTypes[0]?.id ?? '',
                    })
                  }
                  className={cn(
                    'rounded-card border p-5 text-left transition-all duration-300 ease-out-expo hover:-translate-y-0.5',
                    state.verticalId === v.id
                      ? 'border-volt bg-volt/10 shadow-[0_10px_32px_rgba(205,251,80,0.15)]'
                      : 'border-line bg-bg-2 hover:border-volt/40',
                  )}
                >
                  <div className="text-[26px]">{v.emoji}</div>
                  <div className="mt-2.5 font-display text-[15px] font-semibold">{v.label}</div>
                  <div className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{v.sub}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --------------------------------------------------- step 2: name */}
        {state.step === 2 && (
          <div className="fade-up">
            <StepHeading
              kicker="Step 2 of 5"
              title="Name it."
              sub="This becomes your workspace, your public pages, and your brand everywhere members see you."
            />
            <div className="space-y-6">
              <div>
                <label htmlFor="org-name" className={labelCls}>
                  {vertical ? `Your ${vertical.nouns.org} name` : 'Organization name'}
                </label>
                <input
                  id="org-name"
                  type="text"
                  value={state.orgName}
                  onChange={(e) => patch({ orgName: e.target.value })}
                  placeholder={state.verticalId ? ORG_PLACEHOLDERS[state.verticalId] : 'Harbor City Runners'}
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="org-city" className={labelCls}>
                  City
                </label>
                <input
                  id="org-city"
                  type="text"
                  value={state.city}
                  onChange={(e) => patch({ city: e.target.value })}
                  placeholder="Harbor City"
                  className={inputCls}
                />
              </div>
              <div>
                <span className={labelCls}>Brand color</span>
                <div className="flex items-center gap-3">
                  {BRAND_SWATCHES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`Brand color ${c}`}
                      onClick={() => patch({ brandColor: c })}
                      className={cn(
                        'h-10 w-10 rounded-full transition-all duration-200',
                        state.brandColor === c
                          ? 'scale-110 ring-2 ring-paper ring-offset-2 ring-offset-bg'
                          : 'hover:scale-105',
                      )}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------- step 3: people */}
        {state.step === 3 && (
          <div className="fade-up">
            <StepHeading
              kicker="Step 3 of 5"
              title="Bring your people."
              sub="We'll import attendance history later — white-glove on us."
            />
            <div className="grid gap-4 sm:grid-cols-3">
              {(
                [
                  { id: 'csv', title: 'Upload CSV', sub: 'name,email — straight from your spreadsheet.' },
                  { id: 'paste', title: 'Paste emails', sub: 'Copy from the group chat, paste here.' },
                  { id: 'skip', title: 'Skip for now', sub: `Add ${vertical?.nouns.member ?? 'member'}s any time later.` },
                ] as Array<{ id: ImportMethod; title: string; sub: string }>
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    patch(
                      opt.id === 'skip'
                        ? { importMethod: 'skip', memberCount: 0, previewRows: [] }
                        : { importMethod: opt.id },
                    )
                  }
                  className={cn(
                    'rounded-card border p-5 text-left transition-all duration-300 ease-out-expo',
                    state.importMethod === opt.id
                      ? 'border-volt bg-volt/10'
                      : 'border-line bg-bg-2 hover:border-volt/40',
                  )}
                >
                  <div className="font-display text-[15px] font-semibold">{opt.title}</div>
                  <div className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{opt.sub}</div>
                </button>
              ))}
            </div>

            {state.importMethod === 'csv' && (
              <div className="mt-6 rounded-card border border-line bg-bg-2 p-5">
                <label htmlFor="csv-file" className={labelCls}>
                  CSV file (name,email per line)
                </label>
                <input
                  id="csv-file"
                  type="file"
                  accept=".csv,text/csv,text/plain"
                  className="block w-full text-[13.5px] text-muted file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-volt file:px-5 file:py-2.5 file:font-display file:text-sm file:font-semibold file:text-ink"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    void file.text().then((text) => {
                      const rows = parseCsv(text);
                      patch({ memberCount: rows.length, previewRows: rows.slice(0, 3) });
                    });
                  }}
                />
                {state.memberCount > 0 && (
                  <div className="mt-4">
                    <div className="text-[13.5px] font-semibold text-volt">
                      {state.memberCount} {vertical?.nouns.member ?? 'member'}
                      {state.memberCount === 1 ? '' : 's'} parsed
                    </div>
                    <div className="mt-2 space-y-1.5">
                      {state.previewRows.map((row) => (
                        <div
                          key={row.email}
                          className="flex justify-between rounded-lg bg-bg-3 px-3 py-2 text-[13px]"
                        >
                          <span className="font-medium">{row.name}</span>
                          <span className="text-muted">{row.email}</span>
                        </div>
                      ))}
                      {state.memberCount > 3 && (
                        <div className="px-3 pt-1 text-[12px] text-muted-2">
                          …and {state.memberCount - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {state.importMethod === 'paste' && (
              <div className="mt-6 rounded-card border border-line bg-bg-2 p-5">
                <label htmlFor="paste-emails" className={labelCls}>
                  Paste emails (any format — we&apos;ll find them)
                </label>
                <textarea
                  id="paste-emails"
                  rows={5}
                  value={state.pasteText}
                  onChange={(e) => {
                    const emails = parseEmails(e.target.value);
                    patch({
                      pasteText: e.target.value,
                      memberCount: emails.length,
                      previewRows: emails.slice(0, 3).map((email) => ({ name: email.split('@')[0], email })),
                    });
                  }}
                  placeholder={'maya@harborcity.run\njonas@harborcity.run\n…'}
                  className={cn(inputCls, 'resize-y font-mono text-[13px]')}
                />
                <div className="mt-3 text-[13.5px] font-semibold text-volt">
                  {state.memberCount} email{state.memberCount === 1 ? '' : 's'} detected
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------- step 4: event */}
        {state.step === 4 && vertical && (
          <div className="fade-up">
            <StepHeading
              kicker="Step 4 of 5"
              title={`Your first ${vertical.nouns.event}.`}
              sub="Publishing auto-creates: landing page, registration, reminders, QR check-in, and social drafts."
            />
            <div className="space-y-6">
              <div>
                <label htmlFor="event-title" className={labelCls}>
                  Title
                </label>
                <input
                  id="event-title"
                  type="text"
                  value={state.eventTitle}
                  onChange={(e) => patch({ eventTitle: e.target.value })}
                  placeholder={vertical.sampleEvents[0]?.title}
                  className={inputCls}
                />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="event-date" className={labelCls}>
                    Date
                  </label>
                  <input
                    id="event-date"
                    type="date"
                    value={state.eventDate}
                    onChange={(e) => patch({ eventDate: e.target.value })}
                    className={cn(inputCls, '[color-scheme:dark]')}
                  />
                </div>
                <div>
                  <label htmlFor="event-time" className={labelCls}>
                    Time
                  </label>
                  <input
                    id="event-time"
                    type="time"
                    value={state.eventTime}
                    onChange={(e) => patch({ eventTime: e.target.value })}
                    className={cn(inputCls, '[color-scheme:dark]')}
                  />
                </div>
                <div>
                  <label htmlFor="event-capacity" className={labelCls}>
                    Capacity
                  </label>
                  <input
                    id="event-capacity"
                    type="number"
                    min={1}
                    value={state.eventCapacity}
                    onChange={(e) => patch({ eventCapacity: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="event-price" className={labelCls}>
                    Price ($ — free by default)
                  </label>
                  <input
                    id="event-price"
                    type="number"
                    min={0}
                    step="0.01"
                    value={state.eventPrice}
                    onChange={(e) => patch({ eventPrice: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <span className={labelCls}>Type</span>
                <div className="flex flex-wrap gap-2">
                  {vertical.eventTypes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => patch({ eventType: t.id })}
                      className={cn(
                        'rounded-full border px-4 py-2 text-[13px] font-semibold transition-all duration-200',
                        state.eventType === t.id
                          ? 'border-volt bg-volt/15 text-volt'
                          : 'border-line bg-bg-2 text-muted hover:border-volt/40 hover:text-paper',
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --------------------------------------------------- step 5: done */}
        {state.step === 5 && vertical && (
          <div className="fade-up text-center">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-volt/15 text-3xl">
              🎉
            </div>
            <h1 className="font-display text-[clamp(30px,4.5vw,48px)] font-semibold leading-tight tracking-[-0.02em]">
              <span className="text-volt">{state.orgName || 'Your workspace'}</span> is ready.
            </h1>
            <p className="mx-auto mt-3 max-w-[46ch] text-[15px] text-muted">
              Free forever under 50 {vertical.nouns.member}s. No credit card.
            </p>

            <div className="mx-auto mt-8 max-w-[520px] rounded-card border border-line bg-bg-2 p-6 text-left">
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="grid h-11 w-11 flex-none place-items-center rounded-full font-display text-lg font-bold text-ink"
                  style={{ background: state.brandColor }}
                >
                  {(state.orgName || 'R').charAt(0).toUpperCase()}
                </span>
                <div>
                  <div className="font-display text-[16px] font-semibold">{state.orgName || 'Your workspace'}</div>
                  <div className="text-[12.5px] text-muted">
                    {vertical.emoji} {vertical.label}
                    {state.city ? ` · ${state.city}` : ''}
                  </div>
                </div>
              </div>
              <div className="space-y-2 border-t border-line pt-4 text-[13.5px]">
                <div className="flex justify-between">
                  <span className="text-muted">{`${vertical.nouns.member.charAt(0).toUpperCase()}${vertical.nouns.member.slice(1)}s imported`}</span>
                  <span className="font-semibold">
                    {state.memberCount > 0 ? state.memberCount : 'Skipped — later, white-glove'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">First {vertical.nouns.event}</span>
                  <span className="font-semibold">{state.eventTitle}</span>
                </div>
                {state.eventDate && (
                  <div className="flex justify-between">
                    <span className="text-muted">Scheduled</span>
                    <span className="font-semibold">
                      {state.eventDate}
                      {state.eventTime ? ` · ${state.eventTime}` : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mx-auto mt-6 max-w-[520px] rounded-card border border-volt/25 bg-volt/8 p-6 text-left">
              <div className="mb-3 font-display text-[14px] font-semibold text-volt">
                What happens next
              </div>
              <ul className="space-y-2.5 text-[13.5px] text-paper/90">
                {[
                  `Your first ${vertical.nouns.event} gets a landing page, registration, and QR check-in`,
                  'Reminder sequence armed — 48h, 24h, and morning-of',
                  'Social drafts generated for you to review and post',
                  `Attendance history import — white-glove, on us`,
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="text-volt">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/app" className={`group ${btnVolt}`}>
                Open your workspace <span className={arr}>→</span>
              </Link>
              <a href="mailto:start@aiporate.com?subject=White-glove%20migration" className={btnGhost}>
                Book white-glove migration
              </a>
            </div>
          </div>
        )}

        {/* --------------------------------------------------------- footer nav */}
        {state.step < 5 && (
          <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
            <button
              type="button"
              onClick={goBack}
              disabled={state.step === 1}
              className={cn(
                'text-[14px] font-semibold text-muted transition-colors hover:text-paper',
                state.step === 1 && 'invisible',
              )}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => completeStep(state.step)}
              disabled={!canAdvance}
              className={cn(`group ${btnVolt}`, !canAdvance && 'cursor-not-allowed opacity-40')}
            >
              {state.step === 4 ? 'Finish setup' : 'Continue'} <span className={arr}>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

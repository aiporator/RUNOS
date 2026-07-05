'use client';

// The 60-second event creator — single screen, live preview, no account.
// Created events are stashed in localStorage ('runos_instant_events') so
// returning visitors can find their manage links again.
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { track } from '@/lib/analytics';
import { FREE_CAPACITY } from '@/lib/instant';
import { getVertical, VERTICALS, type VerticalId } from '@/lib/verticals';
import { cn } from '@/lib/utils';
import { Badge, ProgressBar } from '@/components/ui';

const STORAGE_KEY = 'runos_instant_events';

interface StoredEvent {
  id: string;
  manageKey: string;
  title: string;
}

interface CreateResponse {
  data?: {
    id: string;
    public_url: string;
    manage_url: string;
    free: boolean;
    requiresUpgrade: boolean;
  };
  error?: { message?: string };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const inputCls =
  'w-full rounded-xl border border-line bg-bg-3 px-4 py-3 text-[14px] text-paper outline-none transition placeholder:text-muted-2 focus:border-volt/60';

const labelCls = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted';

function loadStored(): StoredEvent[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is StoredEvent =>
        typeof e === 'object' &&
        e !== null &&
        typeof (e as StoredEvent).id === 'string' &&
        typeof (e as StoredEvent).manageKey === 'string',
    );
  } catch {
    return [];
  }
}

export default function CreateEventForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [hostName, setHostName] = useState('');
  const [verticalId, setVerticalId] = useState<VerticalId>('workshop');
  const [eventType, setEventType] = useState('workshop');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(12);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [myEvents, setMyEvents] = useState<StoredEvent[]>([]);

  useEffect(() => {
    setMyEvents(loadStored());
  }, []);

  const vertical = getVertical(verticalId);
  const isFree = capacity <= FREE_CAPACITY;
  const previewDate = date ? new Date(`${date}T${time || '18:00'}:00.000Z`) : null;

  function pickVertical(id: VerticalId): void {
    setVerticalId(id);
    setEventType(getVertical(id).eventTypes[0]?.id ?? '');
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/v1/public/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          hostName,
          vertical: verticalId,
          type: eventType,
          date: `${date}T${time || '18:00'}:00.000Z`,
          location,
          capacity,
          price: 0,
          description,
        }),
      });
      const json = (await res.json()) as CreateResponse;
      if (!res.ok || !json.data) {
        setError(json.error?.message ?? 'Something went wrong — try again.');
        setSubmitting(false);
        return;
      }
      track('instant_event_created', { vertical: verticalId, capacity });
      const manageKey = json.data.manage_url.split('key=')[1] ?? '';
      try {
        const next = [...loadStored(), { id: json.data.id, manageKey, title }];
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage blocked — the manage link still works
      }
      router.push(`${json.data.manage_url}&new=1`);
    } catch {
      setError('Network hiccup — try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-svh bg-bg text-paper">
      {/* Minimal top bar — no full nav; this page is the wedge's front door. */}
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-[9px] font-display text-[19px] font-bold tracking-[-0.02em]"
          >
            <span className="pulse-dot h-[10px] w-[10px] rounded-full bg-volt shadow-[0_0_14px_#cdfb50]" />
            RunOS
          </Link>
          <Link href="/start" className="text-[13px] text-muted-2 transition-colors hover:text-volt">
            Running a whole community? →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-6 pb-20 pt-12">
        {/* Returning visitors — their events */}
        {myEvents.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-2">
              Your events
            </span>
            {myEvents.slice(-5).map((e) => (
              <Link
                key={e.id}
                href={`/e/${e.id}/manage?key=${e.manageKey}`}
                className="rounded-full border border-line bg-bg-2 px-3.5 py-1.5 text-[12.5px] font-semibold text-muted transition hover:border-volt/40 hover:text-volt"
              >
                {e.title || e.id}
              </Link>
            ))}
          </div>
        )}

        <div className="fade-up">
          <h1 className="font-display text-[clamp(30px,5vw,50px)] font-bold leading-[1.05] tracking-[-0.02em]">
            Create your event. <span className="text-volt">Sixty seconds.</span> Free.
          </h1>
          <p className="mt-3 max-w-[56ch] text-[15px] text-muted">
            Workshops, runs, classes, meetups — up to {FREE_CAPACITY} people free forever. No account.
            No credit card.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* -------------------------------------------------------- form */}
          <form onSubmit={(e) => void handleSubmit(e)} className="fade-up-1 space-y-6">
            <div className="rounded-card border border-line bg-bg-2 p-6 sm:p-7">
              <div className="space-y-5">
                <div>
                  <label htmlFor="ie-title" className={labelCls}>
                    Event title
                  </label>
                  <input
                    id="ie-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={vertical.sampleEvents[0]?.title ?? 'Saturday Session'}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="ie-host" className={labelCls}>
                    Your name
                  </label>
                  <input
                    id="ie-host"
                    type="text"
                    required
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="Who's hosting?"
                    className={inputCls}
                  />
                </div>

                <div>
                  <span className={labelCls}>What kind of event?</span>
                  <div className="flex flex-wrap gap-2">
                    {VERTICALS.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => pickVertical(v.id)}
                        className={cn(
                          'rounded-full border px-4 py-2 text-[13px] font-semibold transition-all duration-200',
                          verticalId === v.id
                            ? 'border-volt bg-volt/15 text-volt'
                            : 'border-line bg-bg-3 text-muted hover:border-volt/40 hover:text-paper',
                        )}
                      >
                        {v.emoji} {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className={labelCls}>Type</span>
                  <div className="flex flex-wrap gap-2">
                    {vertical.eventTypes.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setEventType(t.id)}
                        className={cn(
                          'rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-all duration-200',
                          eventType === t.id
                            ? 'border-volt bg-volt/15 text-volt'
                            : 'border-line bg-bg-3 text-muted hover:border-volt/40 hover:text-paper',
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ie-date" className={labelCls}>
                      Date
                    </label>
                    <input
                      id="ie-date"
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={cn(inputCls, '[color-scheme:dark]')}
                    />
                  </div>
                  <div>
                    <label htmlFor="ie-time" className={labelCls}>
                      Time
                    </label>
                    <input
                      id="ie-time"
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className={cn(inputCls, '[color-scheme:dark]')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="ie-location" className={labelCls}>
                    Location
                  </label>
                  <input
                    id="ie-location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Studio, park entrance, café — wherever you meet"
                    className={inputCls}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="ie-capacity" className={cn(labelCls, 'mb-0')}>
                      Capacity — {capacity} {capacity === 1 ? 'spot' : 'spots'}
                    </label>
                    {isFree ? (
                      <Badge tone="volt">Free forever</Badge>
                    ) : (
                      <Badge tone="info">Free during beta — Starter plan later</Badge>
                    )}
                  </div>
                  <input
                    id="ie-capacity"
                    type="range"
                    min={1}
                    max={100}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full accent-volt"
                  />
                  <div className="mt-1 flex justify-between text-[11px] text-muted-2">
                    <span>1</span>
                    <span className="text-volt">≤ {FREE_CAPACITY} free forever</span>
                    <span>100</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="ie-desc" className={labelCls}>
                    Short description
                  </label>
                  <textarea
                    id="ie-desc"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What should people expect? What should they bring?"
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
              {submitting ? 'Publishing…' : 'Publish my event →'}
            </button>
            <p className="text-center text-[12px] text-muted-2">
              You get a shareable page + a private manage link. That&apos;s it — no signup.
            </p>
          </form>

          {/* ---------------------------------------------------- preview */}
          <aside className="fade-up-2 hidden lg:block">
            <div className="sticky top-8">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-2">
                Live preview — your public page
              </div>
              <div className="overflow-hidden rounded-card border border-line bg-bg-2">
                <div className="flex items-center gap-2 border-b border-line bg-bg-3 px-4 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="truncate text-[11px] text-muted-2">runos.com/e/your-event</span>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone={vertical.eventTypes.find((t) => t.id === eventType)?.tone ?? 'volt'}>
                      {vertical.eventTypes.find((t) => t.id === eventType)?.label ?? eventType}
                    </Badge>
                    <Badge tone="muted">
                      {vertical.emoji} {vertical.label}
                    </Badge>
                    <Badge tone="volt">Free</Badge>
                  </div>
                  <div className="mt-3 font-display text-[20px] font-bold leading-tight tracking-[-0.01em]">
                    {title || 'Your event title'}
                  </div>
                  <div className="mt-1 text-[12px] text-muted">
                    Hosted by {hostName || 'you'}
                  </div>
                  <div className="mt-4 flex items-center gap-3.5">
                    <div className="grid h-14 w-14 flex-none place-items-center rounded-xl border border-volt/30 bg-volt/8 text-center">
                      {previewDate ? (
                        <div>
                          <div className="font-display text-[18px] font-bold leading-none text-volt">
                            {previewDate.getUTCDate()}
                          </div>
                          <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted">
                            {MONTHS[previewDate.getUTCMonth()]}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[16px] text-muted-2">?</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-display text-[13px] font-semibold">
                        {previewDate
                          ? `${WEEKDAYS[previewDate.getUTCDay()]} · ${time || '18:00'}`
                          : 'Pick a date'}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 truncate text-[11.5px] text-muted">
                        <MapPin size={11} className="flex-none text-muted-2" />
                        <span className="truncate">{location || 'Location TBD'}</span>
                      </div>
                    </div>
                  </div>
                  {description && (
                    <p className="mt-3 line-clamp-3 text-[12px] leading-relaxed text-muted">
                      {description}
                    </p>
                  )}
                  <div className="mt-4 rounded-xl border border-line bg-bg-3 p-3">
                    <div className="mb-1.5 flex justify-between text-[11px]">
                      <span className="font-semibold text-paper/90">0 of {capacity} spots taken</span>
                      <span className="text-muted">{capacity} left</span>
                    </div>
                    <ProgressBar value={0} tone="volt" />
                  </div>
                  <div className="mt-4 rounded-full bg-volt py-2.5 text-center font-display text-[13px] font-semibold text-ink">
                    Reserve my spot
                  </div>
                </div>
              </div>
              <p className="mt-3 text-center text-[11.5px] text-muted-2">
                Updates as you type — this is exactly what your guests see.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

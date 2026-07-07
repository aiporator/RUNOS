'use client';

// /my-runs — the no-account "operate your running life" passport. Reads two
// localStorage keys already written elsewhere in the funnel: events you
// hosted (set in app/new/create-form.tsx) and events you RSVP'd to (set in
// app/e/instant-rsvp-form.tsx), then fetches live details for each from the
// public API. Deliberately honest: this is browser-local, not an account —
// see the note at the bottom of the page.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import MarketingNav from '@/components/marketing/nav';
import MarketingFooter from '@/components/marketing/footer';
import { arr, btnVolt, label } from '@/components/marketing/styles';
import { Badge, EmptyState } from '@/components/ui';
import { getVertical, type VerticalId } from '@/lib/verticals';
import { VerticalIcon } from '@/components/icons/vertical-icons';

const HOSTED_KEY = 'runos_instant_events';
const ATTENDING_KEY = 'runos_my_runs';

interface HostedRef {
  id: string;
  manageKey: string;
  title: string;
}

interface EventDetail {
  id: string;
  title: string;
  hostName: string;
  vertical: VerticalId;
  date: string;
  location: string;
}

interface DetailResponse {
  data?: EventDetail;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function loadJson<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function EventRow({ event, manageUrl }: { event: EventDetail; manageUrl?: string }) {
  const v = getVertical(event.vertical);
  const d = new Date(event.date);
  const upcoming = d.getTime() > Date.now();
  return (
    <Link
      href={manageUrl ?? `/e/${event.id}`}
      className="group flex items-center gap-4 rounded-card border border-line bg-bg-2 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-volt/40"
    >
      <div className="grid h-12 w-12 flex-none place-items-center rounded-xl border border-volt/30 bg-volt/8 text-center">
        <div>
          <div className="font-display text-[15px] font-bold leading-none text-volt">{d.getUTCDate()}</div>
          <div className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-wide text-muted">
            {MONTHS[d.getUTCMonth()]}
          </div>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-[14.5px] font-semibold transition-colors group-hover:text-volt">
          {event.title}
        </div>
        <div className="mt-1 flex items-center gap-1.5 truncate text-[12px] text-muted">
          <MapPin size={11} className="flex-none text-muted-2" /> {event.location}
        </div>
      </div>
      <div className="flex flex-none flex-col items-end gap-1.5">
        <Badge tone="muted">
          <VerticalIcon id={v.id} className="mr-1 h-3 w-3" /> {v.label}
        </Badge>
        {!upcoming && <span className="text-[10.5px] text-muted-2">past</span>}
      </div>
    </Link>
  );
}

export default function MyRunsView() {
  const [loading, setLoading] = useState(true);
  const [hosting, setHosting] = useState<{ event: EventDetail; manageUrl: string }[]>([]);
  const [attending, setAttending] = useState<EventDetail[]>([]);

  useEffect(() => {
    const hostedRefs = loadJson<HostedRef>(HOSTED_KEY);
    const attendingIds = loadJson<string>(ATTENDING_KEY).filter(
      (id) => !hostedRefs.some((h) => h.id === id),
    );

    async function fetchDetail(id: string): Promise<EventDetail | null> {
      try {
        const res = await fetch(`/api/v1/public/events/${id}`);
        const json = (await res.json()) as DetailResponse;
        return json.data ?? null;
      } catch {
        return null;
      }
    }

    void (async () => {
      const [hostedDetails, attendingDetails] = await Promise.all([
        Promise.all(hostedRefs.map((h) => fetchDetail(h.id))),
        Promise.all(attendingIds.map((id) => fetchDetail(id))),
      ]);
      setHosting(
        hostedRefs
          .map((h, i) => ({ event: hostedDetails[i], manageUrl: `/e/${h.id}/manage?key=${h.manageKey}` }))
          .filter((h): h is { event: EventDetail; manageUrl: string } => h.event !== null),
      );
      setAttending(attendingDetails.filter((e): e is EventDetail => e !== null));
      setLoading(false);
    })();
  }, []);

  const empty = !loading && hosting.length === 0 && attending.length === 0;

  return (
    <div className="min-h-svh bg-bg text-paper">
      <MarketingNav anchorPrefix="/" />

      <header className="relative isolate overflow-hidden pb-12 pt-[160px]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_30%_0%,rgba(205,251,80,0.08),transparent_70%)]" />
        <div className="mx-auto max-w-[800px] px-6">
          <span className={`${label} text-volt`}>Your running life</span>
          <h1 className="mb-4 font-display text-[clamp(30px,5vw,50px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            My runs.
          </h1>
          <p className="max-w-[56ch] text-[15px] text-muted">
            Every event you&apos;ve hosted or RSVP&apos;d to on this browser, in one place.
          </p>
        </div>
      </header>

      <section className="pb-[100px]">
        <div className="mx-auto max-w-[800px] px-6">
          {loading ? (
            <div className="py-16 text-center text-[13.5px] text-muted-2">Loading your runs…</div>
          ) : empty ? (
            <EmptyState
              title="Nothing here yet"
              sub="RSVP to a run or publish your own — both show up here automatically."
              action={
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link href="/discover" className={`group ${btnVolt}`}>
                    Discover a run <span className={arr}>→</span>
                  </Link>
                </div>
              }
            />
          ) : (
            <div className="space-y-10">
              {attending.length > 0 && (
                <div>
                  <h2 className="mb-4 font-display text-[16px] font-semibold">Attending</h2>
                  <div className="space-y-3">
                    {attending.map((e) => (
                      <EventRow key={e.id} event={e} />
                    ))}
                  </div>
                </div>
              )}
              {hosting.length > 0 && (
                <div>
                  <h2 className="mb-4 font-display text-[16px] font-semibold">Hosting</h2>
                  <div className="space-y-3">
                    {hosting.map(({ event, manageUrl }) => (
                      <EventRow key={event.id} event={event} manageUrl={manageUrl} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <p className="mt-12 text-center text-[12px] text-muted-2">
            This page reads your browser&apos;s local storage — nothing here is on a server, and
            nothing syncs across devices yet. Runner accounts are on the roadmap.
          </p>
        </div>
      </section>

      <MarketingFooter anchorPrefix="/" />
    </div>
  );
}

'use client';

// /discover — the runner-facing front door: browse every public instant
// event on RunOS, filter by city or type, RSVP in one tap. No account, no
// club login — this is the "connect with other runners" surface.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MapPin, Users } from 'lucide-react';
import MarketingNav from '@/components/marketing/nav';
import MarketingFooter from '@/components/marketing/footer';
import { arr, btnVolt, label } from '@/components/marketing/styles';
import { Badge, EmptyState } from '@/components/ui';
import { CITIES } from '@/lib/cities';
import { VERTICALS, getVertical, type VerticalId } from '@/lib/verticals';
import { cn } from '@/lib/utils';
import { VerticalIcon } from '@/components/icons/vertical-icons';

interface DiscoverEvent {
  id: string;
  title: string;
  hostName: string;
  vertical: VerticalId;
  type: string;
  date: string;
  location: string;
  capacity: number;
  price: number;
  public_url: string;
}

interface ListResponse {
  data?: DiscoverEvent[];
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DiscoverView() {
  const [events, setEvents] = useState<DiscoverEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('');
  const [vertical, setVertical] = useState<VerticalId | ''>('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: '60' });
    if (city) params.set('q', city);
    if (vertical) params.set('vertical', vertical);
    fetch(`/api/v1/public/events?${params.toString()}`)
      .then((res) => res.json() as Promise<ListResponse>)
      .then((json) => setEvents(json.data ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [city, vertical]);

  return (
    <div className="min-h-svh bg-bg text-paper">
      <MarketingNav anchorPrefix="/" />

      <header className="relative isolate overflow-hidden pb-14 pt-[160px]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_30%_0%,rgba(205,251,80,0.08),transparent_70%)]" />
        <div className="mx-auto max-w-[1000px] px-6">
          <span className={`${label} text-volt`}>Find your next one</span>
          <h1 className="mb-5 font-display text-[clamp(30px,5vw,52px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Every open run, class, and workshop — <span className="text-volt">in one place.</span>
          </h1>
          <p className="max-w-[60ch] text-[16px] text-muted">
            Real events published by real organizers on RunOS. RSVP in one tap — no account, no
            app to download.
          </p>
        </div>
      </header>

      <section className="pb-[100px]">
        <div className="mx-auto max-w-[1000px] px-6">
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCity('')}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-all duration-200',
                city === ''
                  ? 'border-volt bg-volt/15 text-volt'
                  : 'border-line bg-bg-2 text-muted hover:border-volt/40 hover:text-paper',
              )}
            >
              All cities
            </button>
            {CITIES.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => setCity(c.name)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-all duration-200',
                  city === c.name
                    ? 'border-volt bg-volt/15 text-volt'
                    : 'border-line bg-bg-2 text-muted hover:border-volt/40 hover:text-paper',
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="mb-10 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setVertical('')}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all duration-200',
                vertical === ''
                  ? 'border-line bg-bg-3 text-paper'
                  : 'border-line bg-bg-3 text-muted hover:text-paper',
              )}
            >
              Any type
            </button>
            {VERTICALS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVertical(v.id)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all duration-200',
                  vertical === v.id
                    ? 'border-volt bg-volt/15 text-volt'
                    : 'border-line bg-bg-3 text-muted hover:border-volt/40 hover:text-paper',
                )}
              >
                <VerticalIcon id={v.id} className="mr-1 inline h-3.5 w-3.5 align-[-3px]" /> {v.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-20 text-center text-[13.5px] text-muted-2">Loading…</div>
          ) : events.length === 0 ? (
            <EmptyState
              title="Nothing published here yet"
              sub="Be the first to put an event on the map — it takes 60 seconds and it's free."
              action={
                <Link
                  href={city ? `/new?location=${encodeURIComponent(city)}` : '/new'}
                  className={`group ${btnVolt}`}
                >
                  Create an event <span className={arr}>→</span>
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => {
                const v = getVertical(e.vertical);
                const typeDef = v.eventTypes.find((t) => t.id === e.type);
                const d = new Date(e.date);
                return (
                  <Link
                    key={e.id}
                    href={e.public_url}
                    className="group flex flex-col rounded-card border border-line bg-bg-2 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-volt/40"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone={typeDef?.tone ?? 'volt'}>{typeDef?.label ?? e.type}</Badge>
                      {e.price === 0 && <Badge tone="muted">Free</Badge>}
                    </div>
                    <div className="mt-3 font-display text-[15.5px] font-semibold leading-snug transition-colors group-hover:text-volt">
                      {e.title}
                    </div>
                    <div className="mt-1.5 text-[12px] text-muted">Hosted by {e.hostName}</div>
                    <div className="mt-3 flex items-center gap-1.5 text-[12.5px] text-muted">
                      <span className="font-semibold text-paper/85">
                        {WEEKDAYS[d.getUTCDay()]} {MONTHS[d.getUTCMonth()]} {d.getUTCDate()}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[12px] text-muted-2">
                      <MapPin size={11} className="flex-none" />
                      <span className="truncate">{e.location}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11.5px] text-muted-2">
                      <Users size={11} className="flex-none" /> up to {e.capacity}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <MarketingFooter anchorPrefix="/" />
    </div>
  );
}

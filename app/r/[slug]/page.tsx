import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSupabase, type LiveEvent, type LiveOrg } from '@/lib/supabase';
import { getVertical } from '@/lib/verticals';
import LiveRsvpForm from '../live-rsvp-form';

export const dynamic = 'force-dynamic';

export default async function PublicLiveClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = getServerSupabase();

  const { data: orgs } = await supabase.from('runos_orgs').select('*').eq('slug', slug).limit(1);
  const org = (orgs?.[0] as LiveOrg | undefined) ?? null;
  if (!org) notFound();

  const { data: evts } = await supabase
    .from('runos_events')
    .select('*')
    .eq('org_id', org.id)
    .eq('published', true)
    .order('starts_at', { ascending: true });
  const events = (evts ?? []) as LiveEvent[];

  const stats = new Map<string, number>();
  for (const e of events) {
    const { data } = await supabase.rpc('runos_event_stats', { eid: e.id });
    const row = Array.isArray(data) ? data[0] : data;
    stats.set(e.id, Number(row?.confirmed ?? 0));
  }

  const v = getVertical(org.vertical);

  return (
    <main className="min-h-screen">
      <div className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-lg">
        <div className="mx-auto flex max-w-[840px] items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5 font-display text-[16px] font-bold">
            <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-volt shadow-[0_0_12px_#cdfb50]" />
            {org.name}
          </div>
          <a href="#events" className="rounded-full bg-volt px-4 py-2 font-display text-[13px] font-semibold text-ink">
            Join a {v.nouns.event}
          </a>
        </div>
      </div>

      <section className="mx-auto max-w-[840px] px-5 pb-6 pt-12">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-volt">
          {v.emoji} {v.label}{org.city ? ` · ${org.city}` : ''}
        </div>
        <h1 className="mt-2 font-display text-[clamp(32px,6vw,52px)] font-semibold leading-[1.05] tracking-tight">
          {org.name}
        </h1>
        <p className="mt-3 max-w-[52ch] text-[15px] text-muted">
          Upcoming {v.nouns.event}s below — pick one, register in ten seconds, and just show up.
          Powered by RunOS.
        </p>
      </section>

      <section id="events" className="mx-auto max-w-[840px] px-5 pb-16">
        {events.length === 0 ? (
          <div className="rounded-card border border-dashed border-line px-6 py-12 text-center text-muted">
            No {v.nouns.event}s published yet — check back soon.
          </div>
        ) : (
          <div className="space-y-5">
            {events.map((e) => {
              const confirmed = stats.get(e.id) ?? 0;
              const left = Math.max(0, e.capacity - confirmed);
              const d = new Date(e.starts_at);
              return (
                <div key={e.id} className="overflow-hidden rounded-card border border-line bg-bg-2">
                  <div className="grid gap-0 md:grid-cols-[1fr_300px]">
                    <div className="p-6">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-volt/25 bg-volt/12 px-2.5 py-0.5 text-[11px] font-semibold text-volt">
                          {v.eventTypes.find((t) => t.id === e.type)?.label ?? e.type}
                        </span>
                        {e.price_cents === 0 && (
                          <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-semibold text-muted">Free</span>
                        )}
                      </div>
                      <h2 className="mt-3 font-display text-[22px] font-semibold leading-tight">{e.title}</h2>
                      <p className="mt-2 text-[13.5px] text-muted">
                        {d.toLocaleString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                        {e.location ? ` · ${e.location}` : ''}
                      </p>
                      {e.description && <p className="mt-3 text-[13.5px] leading-relaxed text-paper/80">{e.description}</p>}
                      <div className="mt-4">
                        <div className="mb-1.5 flex justify-between text-[12px] text-muted">
                          <span>{confirmed} registered</span>
                          <span>{left > 0 ? `${left} spots left` : 'Waitlist open'}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                          <div className="h-full rounded-full bg-volt" style={{ width: `${Math.min(100, (confirmed / e.capacity) * 100)}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-line bg-bg-3 p-6 md:border-l md:border-t-0">
                      <LiveRsvpForm eventId={e.id} full={left <= 0} eventTitle={e.title} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="border-t border-line bg-bg-2/60 py-8 text-center">
        <p className="text-[13px] text-muted">
          <span className="font-semibold text-paper">Powered by RunOS</span> — run your own community free.
        </p>
        <Link href="/signup" className="mt-3 inline-block rounded-full bg-volt px-6 py-2.5 font-display text-[13.5px] font-semibold text-ink">
          Start your club free →
        </Link>
      </div>
    </main>
  );
}

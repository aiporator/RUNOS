import Link from 'next/link';
import {
  activityFeed, atRiskMembers, club, failedPayments, getMember, mrr,
  newMembers, revenueThisMonth, totalPerkRedemptions, upcomingEvents, weeklyMetrics,
} from '@/lib/data';
import { formatDateTime, money, pct, relativeDays } from '@/lib/utils';
import { Avatar, Badge, Card, CardTitle, PageHeader, ProgressBar, Sparkline, Stat } from '@/components/ui';

export default function DashboardPage() {
  const events = upcomingEvents().filter((e) => e.status === 'published').slice(0, 3);
  const risky = atRiskMembers().slice(0, 5);
  const wacmSeries = weeklyMetrics.map((w) => w.wacm);
  const now = weeklyMetrics[weeklyMetrics.length - 1];
  const prev = weeklyMetrics[weeklyMetrics.length - 2];

  return (
    <div>
      <PageHeader
        kicker="Today at Harbor City Runners"
        title={`Morning, Maya.`}
        sub={`${club.memberCount} members · ${newMembers().length} joined this month · Saturday Long Run is ${relativeDays(events[0]?.date ?? '')} with ${events[0]?.registered ?? 0} registered.`}
        actions={
          <Link href="/app/events" className="rounded-full bg-volt px-5 py-2.5 font-display text-sm font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)]">
            Publish event →
          </Link>
        }
      />

      <div className="grid gap-4 fade-up-1 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Weekly Active Community Members" value={String(now.wacm)} delta={`+${now.wacm - prev.wacm} w/w`} sub="North-star · attended, logged, posted, redeemed" />
        <Stat label="MRR from memberships" value={money(mrr())} delta="+6% m/m" sub="26 monthly · 13 annual" />
        <Stat label="Perk redemptions (all-time)" value={String(totalPerkRedemptions())} delta="+38 this month" sub="Benefits passport is working" />
        <Stat label="Revenue this month" value={money(revenueThisMonth())} sub={`${failedPayments().length} failed payments in dunning`} />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="fade-up-2 xl:col-span-2">
          <CardTitle
            action={<Link href="/app/events" className="text-[12.5px] font-semibold text-volt hover:underline">All events →</Link>}
          >
            Upcoming events
          </CardTitle>
          <div className="space-y-3">
            {events.map((e) => (
              <Link
                key={e.id}
                href={`/app/events/${e.id}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-line bg-bg-3 px-4 py-3.5 transition hover:border-volt/40"
              >
                <div>
                  <div className="font-display text-[14.5px] font-semibold">{e.title}</div>
                  <div className="mt-0.5 text-[12.5px] text-muted">
                    {formatDateTime(e.date)} · {e.location} · {e.weather}
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  {e.predictedAttendance && (
                    <div className="hidden text-right sm:block">
                      <div className="text-[11px] uppercase tracking-wide text-muted-2">Pacer forecast</div>
                      <div className="text-[13px] font-semibold text-volt">{e.predictedAttendance[0]}–{e.predictedAttendance[1]}</div>
                    </div>
                  )}
                  <div className="w-28">
                    <div className="mb-1.5 flex justify-between text-[11.5px] text-muted">
                      <span>{e.registered}/{e.capacity}</span>
                      <span>{pct(e.registered / e.capacity)}</span>
                    </div>
                    <ProgressBar value={e.registered / e.capacity} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="fade-up-3">
          <CardTitle action={<span className="text-[12px] text-muted">last 12 weeks</span>}>WACM trend</CardTitle>
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="font-display text-4xl font-bold">{now.wacm}</div>
              <div className="mt-1 text-[12.5px] text-muted">of 48 members active this week</div>
            </div>
            <Sparkline data={wacmSeries} width={150} height={54} />
          </div>
          <div className="mt-5 border-t border-line pt-4">
            <div className="mb-2 text-[12px] font-semibold text-muted">Pacer's read</div>
            <p className="text-[13px] leading-relaxed text-muted">
              Engagement is compounding: 5 of the last 6 weeks grew. The 10K Time Trial journey is at 73% of capacity
              with 16 days to go — on pace to sell out around July 12.
            </p>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Card className="fade-up-3 xl:col-span-1">
          <CardTitle
            action={<Link href="/app/community" className="text-[12.5px] font-semibold text-volt hover:underline">Open CRM →</Link>}
          >
            Churn watch
          </CardTitle>
          <div className="space-y-3">
            {risky.map((m) => (
              <Link key={m.id} href={`/app/community/${m.id}`} className="flex items-center gap-3 rounded-lg px-1 py-1 transition hover:bg-white/4">
                <Avatar name={m.name} color={m.avatarColor} size={34} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-medium">{m.name}</div>
                  <div className="text-[11.5px] text-muted">last seen {relativeDays(m.lastSeen)}</div>
                </div>
                <Badge tone={m.churnRisk > 0.75 ? 'danger' : 'warn'}>{pct(m.churnRisk)} risk</Badge>
              </Link>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-volt/25 bg-volt/8 px-3.5 py-3 text-[12.5px] leading-relaxed text-paper/90">
            <span className="font-semibold text-volt">Pacer:</span> I drafted “we miss you” messages for all {atRiskMembers().length} at-risk members.
            <Link href="/app/intelligence" className="ml-1 font-semibold text-volt hover:underline">Review & send →</Link>
          </div>
        </Card>

        <Card className="fade-up-4 xl:col-span-2">
          <CardTitle action={<span className="text-[12px] text-muted">live from all surfaces</span>}>Community pulse</CardTitle>
          <div className="space-y-1">
            {activityFeed.slice(0, 7).map((a) => {
              const m = getMember(a.memberId);
              if (!m) return null;
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-lg px-1 py-2">
                  <Avatar name={m.name} color={m.avatarColor} size={30} />
                  <div className="min-w-0 flex-1 text-[13.5px]">
                    <span className="font-medium">{m.name}</span>{' '}
                    <span className="text-muted">{a.text}</span>
                    {a.meta && <span className="ml-2 rounded bg-white/6 px-1.5 py-0.5 text-[11px] text-muted">{a.meta}</span>}
                  </div>
                  <span className="flex-none text-[11.5px] text-muted-2">{relativeDays(a.date)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}

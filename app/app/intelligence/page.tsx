import Link from 'next/link';
import {
  ambassadorCandidates, atRiskMembers, mrr, upcomingEvents, weeklyMetrics,
} from '@/lib/data';
import { getStore } from '@/lib/store';
import { formatDate, money, pct, relativeDays } from '@/lib/utils';
import { Avatar, Badge, Card, CardTitle, PageHeader, ProgressBar, Stat } from '@/components/ui';
import { RevenueChart, WacmAttendanceChart } from './charts';
import { PacerChat } from './pacer-chat';

export const dynamic = 'force-dynamic';

const benchmarks: { label: string; you: string; median: string; badge: string; tone: 'ok' | 'volt' }[] = [
  { label: 'Retention (12-month)', you: '84%', median: '71% median', badge: 'top quartile', tone: 'ok' },
  { label: 'Event fill rate', you: '73%', median: '68% median', badge: '+5 pts', tone: 'volt' },
  { label: 'Revenue per member', you: '€19', median: '€14 median', badge: '+36%', tone: 'volt' },
];

export default function IntelligencePage() {
  const now = weeklyMetrics[weeklyMetrics.length - 1];
  const prev = weeklyMetrics[weeklyMetrics.length - 2];
  const risky = atRiskMembers();
  const ambassadors = ambassadorCandidates().slice(0, 3);
  const predicted = upcomingEvents().filter((e) => e.status === 'published' && e.predictedAttendance);
  const forecastMrr = Math.round(mrr() * 1.06);

  const store = getStore();
  const audit = store.listAudit();
  const automationRuns = store.listAutomationRuns();
  const byCategory = new Map<string, number>();
  for (const entry of audit) {
    const category = entry.action.split('.')[0];
    byCategory.set(category, (byCategory.get(category) ?? 0) + 1);
  }
  const topCategories = [...byCategory.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCategory = topCategories[0]?.[1] ?? 1;
  const automatedSteps = automationRuns.reduce((sum, r) => sum + r.steps.length, 0);

  return (
    <div>
      <PageHeader
        title="Intelligence"
        sub="Predictions, benchmarks, and Pacer — your club's digital COO."
      />

      <div className="grid gap-4 fade-up-1 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="WACM now" value={String(now.wacm)} delta={`+${now.wacm - prev.wacm} w/w`} sub="weekly active community members" />
        <Stat label="Predicted Saturday attendance" value="58–71" sub="Harbor Loop 16K · 64 registered" />
        <Stat label="Churn-risk members" value={String(risky.length)} delta="Win-back running" deltaGood={false} sub="flagged by attendance-gap model" />
        <Stat label="Forecast MRR next month" value={money(forecastMrr)} delta="+6%" sub={`from ${money(mrr())} today`} />
      </div>

      <div className="mt-6 grid items-start gap-4 xl:grid-cols-3">
        {/* Left / main column */}
        <div className="space-y-4 xl:col-span-2">
          <div className="fade-up-2">
            <WacmAttendanceChart />
          </div>
          <div className="fade-up-3">
            <RevenueChart />
          </div>

          <Card className="fade-up-3">
            <CardTitle action={<Badge tone="info">clubs like yours · 250–800 members</Badge>}>
              Network intelligence
            </CardTitle>
            <div className="divide-y divide-line/60">
              {benchmarks.map((b) => (
                <div key={b.label} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-medium">{b.label}</div>
                    <div className="mt-0.5 text-[11.5px] text-muted">
                      you: <span className="font-semibold text-volt">{b.you}</span> · network: {b.median}
                    </div>
                  </div>
                  <Badge tone={b.tone}>{b.badge}</Badge>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-line pt-3 text-[11.5px] leading-relaxed text-muted-2">
              Compared against anonymized clubs of similar size (250–800 members, k≥50). Benchmarks are aggregated and
              anonymized. No club can ever see another club&rsquo;s raw data.
            </p>
          </Card>

          <Card className="fade-up-4">
            <CardTitle action={<span className="text-[12px] text-muted">refreshed hourly</span>}>Predictions</CardTitle>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-2">
                  Event attendance
                </div>
                <div className="space-y-3">
                  {predicted.map((e) => (
                    <div key={e.id} className="rounded-xl border border-line bg-bg-3 px-3.5 py-3">
                      <div className="truncate text-[12.5px] font-medium">{e.title}</div>
                      <div className="mt-1 flex items-baseline justify-between">
                        <span className="text-[11.5px] text-muted">{formatDate(e.date)} · {e.registered} registered</span>
                        <span className="text-[13px] font-semibold text-volt">
                          {e.predictedAttendance?.[0]}–{e.predictedAttendance?.[1]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-2">
                  Churn watch
                </div>
                <div className="space-y-3">
                  {risky.slice(0, 3).map((m) => (
                    <div key={m.id} className="flex items-center gap-2.5">
                      <Avatar name={m.name} color={m.avatarColor} size={32} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium">{m.name}</div>
                        <div className="text-[11px] text-muted">last seen {relativeDays(m.lastSeen)}</div>
                      </div>
                      <Badge tone={m.churnRisk > 0.75 ? 'danger' : 'warn'}>{pct(m.churnRisk)}</Badge>
                    </div>
                  ))}
                </div>
                <Link href="/app/community" className="mt-3 inline-block text-[12px] font-semibold text-volt hover:underline">
                  All {risky.length} at-risk →
                </Link>
              </div>

              <div>
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-2">
                  Ambassador candidates
                </div>
                <div className="space-y-3">
                  {ambassadors.map((m) => (
                    <div key={m.id} className="flex items-center gap-2.5">
                      <Avatar name={m.name} color={m.avatarColor} size={32} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium">{m.name}</div>
                        <div className="text-[11px] text-muted">{m.eventsAttended} events attended</div>
                      </div>
                      <Badge tone="volt">{m.communityScore}</Badge>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-muted-2">
                  Community score ≥ 78 and not yet an ambassador. Pacer can send invites.
                </p>
              </div>
            </div>
          </Card>

          <Card className="fade-up-4">
            <CardTitle action={<Badge tone="info">live from the audit log</Badge>}>Product analytics</CardTitle>
            <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-2">
                  Actions by area
                </div>
                {topCategories.length === 0 ? (
                  <p className="text-[12.5px] text-muted-2">
                    No activity recorded yet — every create, update, and check-in lands here.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {topCategories.map(([category, count]) => (
                      <div key={category} className="flex items-center gap-3">
                        <span className="w-24 flex-none text-[12.5px] font-medium capitalize">{category}</span>
                        <div className="flex-1">
                          <ProgressBar value={count / maxCategory} tone="volt" />
                        </div>
                        <span className="w-8 flex-none text-right text-[12.5px] text-muted">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="rounded-xl border border-line bg-bg-3 px-4 py-3.5">
                  <div className="font-display text-[22px] font-semibold text-volt">{audit.length}</div>
                  <div className="text-[11.5px] text-muted">actions recorded this session</div>
                </div>
                <div className="rounded-xl border border-line bg-bg-3 px-4 py-3.5">
                  <div className="font-display text-[22px] font-semibold text-volt">{automatedSteps}</div>
                  <div className="text-[11.5px] text-muted">
                    steps handled by <Link href="/app/automations" className="font-semibold text-volt hover:underline">automations</Link> — work you didn&rsquo;t do
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column — Pacer */}
        <div className="xl:sticky xl:top-6 xl:col-span-1">
          <PacerChat />
        </div>
      </div>
    </div>
  );
}

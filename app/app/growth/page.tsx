import { Check, Plus } from 'lucide-react';
import { journeys, members } from '@/lib/data';
import { cn, pct } from '@/lib/utils';
import { Avatar, Badge, Card, CardTitle, PageHeader, ProgressBar, Stat, Table } from '@/components/ui';
import { QuickActionButton } from '@/components/quick-action';

export const dynamic = 'force-dynamic';

const statusTone: Record<string, 'ok' | 'warn' | 'muted'> = {
  active: 'ok',
  paused: 'warn',
  draft: 'muted',
};

const packSteps: { label: string; detail: string; done: boolean }[] = [
  { label: 'Landing page', detail: 'published', done: true },
  { label: 'Email 1', detail: 'opened 61%', done: true },
  { label: 'IG carousel', detail: 'posted', done: true },
  { label: 'Email 2', detail: 'opened 54%', done: true },
  { label: 'SMS reminder', detail: 'T-24h', done: false },
  { label: 'QR check-in', detail: 'event day', done: false },
  { label: 'Photos + recap', detail: 'after', done: false },
  { label: 'Sponsor report', detail: 'after', done: false },
  { label: 'Survey', detail: 'after', done: false },
];

const landingPages: { name: string; slug: string; views: number; conversion: number; registrations: number }[] = [
  { name: '10K Time Trial + Summer Social', slug: '/e/10k-time-trial', views: 1412, conversion: 0.062, registrations: 87 },
  { name: 'Saturday Long Run — Harbor Loop', slug: '/e/harbor-loop', views: 968, conversion: 0.066, registrations: 64 },
  { name: 'Track Tuesday — 400m Repeats', slug: '/e/track-tuesday', views: 541, conversion: 0.057, registrations: 31 },
];

const topReferrers: { memberIndex: number; referred: number }[] = [
  { memberIndex: 1, referred: 5 },
  { memberIndex: 7, referred: 4 },
  { memberIndex: 12, referred: 3 },
];

export default function GrowthPage() {
  const allJourneys = journeys();
  const active = allJourneys.filter((j) => j.status === 'active');
  const enrolledNow = allJourneys.reduce((s, j) => s + j.enrolled, 0);
  const avgConversion = allJourneys.reduce((s, j) => s + j.conversionRate, 0) / allJourneys.length;

  return (
    <div>
      <PageHeader
        title="Growth"
        sub="Journeys, campaigns, and the referral engine — set it once, it runs weekly."
        actions={
          <QuickActionButton
            label={
              <>
                <Plus size={16} strokeWidth={2.5} /> New journey
              </>
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-volt px-5 py-2.5 font-display text-sm font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)]"
            title="New journey"
            description="Starts as a draft — turn it on once the trigger and steps look right."
            endpoint="/api/v1/journeys"
            fields={[
              { name: 'name', label: 'Name', required: true, placeholder: 'Winter re-engagement' },
              { name: 'trigger', label: 'Trigger', required: true, placeholder: 'no_show_2_weeks' },
              { name: 'conversionGoal', label: 'Goal', required: true, placeholder: 'Attends a run within 14 days' },
            ]}
            submitLabel="Create journey"
          />
        }
      />

      <div className="grid gap-4 fade-up-1 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active journeys" value={String(active.length)} sub={`of ${allJourneys.length} total · 1 paused`} />
        <Stat label="Members enrolled now" value={String(enrolledNow)} delta="+31 this week" sub="across all running journeys" />
        <Stat label="Avg conversion rate" value={pct(avgConversion)} delta="+4 pts q/q" sub="goal completion, all journeys" />
        <Stat label="Messages sent this month" value="1,284" sub="email · SMS · push — 0 spam reports" />
      </div>

      <Card className="mt-6 fade-up-2">
        <CardTitle action={<span className="text-[12px] text-muted">automated · runs weekly</span>}>Journeys</CardTitle>
        <Table head={['Name', 'Trigger', 'Steps', 'Enrolled now', 'Completed', 'Goal', 'Conversion', 'Status']}>
          {allJourneys.map((j) => (
            <tr key={j.id} className="transition hover:bg-white/3">
              <td className="py-3.5 pr-4 font-medium">{j.name}</td>
              <td className="py-3.5 pr-4">
                <span className="rounded bg-white/6 px-1.5 py-0.5 font-mono text-[11px] text-muted">{j.trigger}</span>
              </td>
              <td className="py-3.5 pr-4 text-muted">{j.steps}</td>
              <td className="py-3.5 pr-4">{j.enrolled}</td>
              <td className="py-3.5 pr-4 text-muted">{j.completed}</td>
              <td className="max-w-[190px] py-3.5 pr-4 text-[12.5px] text-muted">{j.conversionGoal}</td>
              <td className="py-3.5 pr-4">
                <div className="flex w-28 items-center gap-2">
                  <ProgressBar value={j.conversionRate} />
                  <span className="w-9 flex-none text-[12px] font-semibold text-volt">{pct(j.conversionRate)}</span>
                </div>
              </td>
              <td className="py-3.5">
                <Badge tone={statusTone[j.status]}>{j.status}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Card>

      <Card className="mt-4 fade-up-3">
        <CardTitle action={<Badge tone="volt">12-step journey · active</Badge>}>
          Event Growth Pack — 10K Time Trial
        </CardTitle>
        <div className="thin-scroll overflow-x-auto pb-1">
          <div className="flex min-w-[880px]">
            {packSteps.map((s, i) => (
              <div key={s.label} className="flex-1">
                <div className="flex items-center">
                  <div className={cn('h-px flex-1', i === 0 ? 'bg-transparent' : s.done ? 'bg-volt/40' : 'bg-line')} />
                  {s.done ? (
                    <span className="grid h-[18px] w-[18px] flex-none place-items-center rounded-full bg-volt text-ink">
                      <Check size={11} strokeWidth={3.5} />
                    </span>
                  ) : (
                    <span className="h-[18px] w-[18px] flex-none rounded-full border border-line bg-bg-3" />
                  )}
                  <div
                    className={cn(
                      'h-px flex-1',
                      i === packSteps.length - 1 ? 'bg-transparent' : packSteps[i + 1].done ? 'bg-volt/40' : 'bg-line',
                    )}
                  />
                </div>
                <div className="mt-3 px-1 text-center">
                  <div className={cn('text-[12px] font-semibold leading-tight', s.done ? 'text-paper' : 'text-muted')}>
                    {s.label}
                  </div>
                  <div className={cn('mt-0.5 text-[11px]', s.done ? 'text-volt' : 'text-muted-2')}>{s.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-4 text-[12.5px] text-muted">
          <span>
            <span className="font-semibold text-paper">87</span> enrolled
          </span>
          <span>
            fills <span className="font-semibold text-volt">73%</span> of 120 capacity
          </span>
          <span>ticket revenue so far <span className="font-semibold text-paper">€696</span></span>
          <span className="text-muted-2">Pacer projects sell-out around Jul 12.</span>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 fade-up-4 xl:grid-cols-2">
        <Card>
          <CardTitle action={<Badge tone="volt">Give 2 months / Get 2 months</Badge>}>Referral engine</CardTitle>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold">14</span>
            <span className="text-[13px] text-muted">members referred this year — 29% of all new joins</span>
          </div>
          <div className="mt-5 space-y-3 border-t border-line pt-4">
            <div className="text-[12px] font-semibold uppercase tracking-wide text-muted-2">Top referrers</div>
            {topReferrers.map(({ memberIndex, referred }) => {
              const m = members()[memberIndex];
              return (
                <div key={m.id} className="flex items-center gap-3">
                  <Avatar name={m.name} color={m.avatarColor} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13.5px] font-medium">{m.name}</div>
                    <div className="text-[11.5px] text-muted">{referred * 2} free months earned</div>
                  </div>
                  <Badge tone="volt">{referred} referred</Badge>
                </div>
              );
            })}
          </div>
          <p className="mt-4 rounded-lg border border-line bg-bg-3 px-3.5 py-3 text-[12.5px] leading-relaxed text-muted">
            Every member gets a personal invite link. When a friend stays 60 days, both sides earn 2 free months —
            applied automatically to the next billing cycle.
          </p>
        </Card>

        <Card>
          <CardTitle action={<span className="text-[12px] text-muted">3 published</span>}>Landing pages</CardTitle>
          <div className="space-y-3">
            {landingPages.map((p) => (
              <div key={p.slug} className="rounded-xl border border-line bg-bg-3 px-4 py-3.5 transition hover:border-volt/40">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate font-display text-[14px] font-semibold">{p.name}</div>
                    <div className="mt-0.5 font-mono text-[11px] text-muted-2">runos.club{p.slug}</div>
                  </div>
                  <div className="flex-none text-right">
                    <div className="text-[13px] font-semibold text-volt">{p.registrations} registrations</div>
                    <div className="mt-0.5 text-[11.5px] text-muted">
                      {p.views.toLocaleString('en-US')} views · {(p.conversion * 100).toFixed(1)}% convert
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <ProgressBar value={p.conversion * 10} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11.5px] text-muted-2">
            Pages are generated from the event brief — hero photo, route map, pace groups, and one-tap register.
          </p>
        </Card>
      </div>
    </div>
  );
}

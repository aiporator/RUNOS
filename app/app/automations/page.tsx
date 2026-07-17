import { ArrowRight, PauseCircle, PlayCircle, Zap } from 'lucide-react';
import { getStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Badge, Card, CardTitle, EmptyState, PageHeader } from '@/components/ui';
import { InstantActionButton } from '@/components/quick-action';
import { AutomationBuilder, STEP_LABELS, TRIGGER_LABELS } from './automation-builder';

export const dynamic = 'force-dynamic';

export default function AutomationsPage() {
  const store = getStore();
  const automations = store.listAutomations();
  const runs = store.listAutomationRuns().slice(0, 12);
  const totalRuns = automations.reduce((sum, a) => sum + a.runs, 0);

  return (
    <div>
      <PageHeader
        kicker="Workflows"
        title="Automations"
        sub={`If this, then that — running on real club events. ${totalRuns} run${totalRuns === 1 ? '' : 's'} so far.`}
        actions={<AutomationBuilder />}
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Automation list */}
        <div className="space-y-4">
          {automations.length === 0 ? (
            <Card>
              <EmptyState
                title="No automations yet"
                sub="Create your first one — welcome messages, receipts, and staff pings all run themselves."
              />
            </Card>
          ) : (
            automations.map((a, i) => (
              <Card key={a.id} className={cn('fade-up', i === 1 && 'fade-up-1', i >= 2 && 'fade-up-2')}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        'grid h-10 w-10 flex-none place-items-center rounded-xl',
                        a.enabled ? 'bg-volt/15 text-volt' : 'bg-white/5 text-muted-2',
                      )}
                    >
                      <Zap className="h-4.5 w-4.5" aria-hidden />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-[15px] font-semibold">{a.name}</span>
                        <Badge tone={a.enabled ? 'ok' : 'muted'}>{a.enabled ? 'live' : 'paused'}</Badge>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[12px] text-muted">
                        <span className="rounded-full border border-line bg-bg-3 px-2.5 py-1 font-medium">
                          {TRIGGER_LABELS[a.trigger]}
                        </span>
                        {a.steps.map((s, j) => (
                          <span key={j} className="inline-flex items-center gap-1.5">
                            <ArrowRight className="h-3 w-3 text-muted-2" aria-hidden />
                            <span className="rounded-full border border-line bg-bg-3 px-2.5 py-1 font-medium">
                              {STEP_LABELS[s.kind]}
                              {s.value ? `: “${s.value.length > 24 ? `${s.value.slice(0, 24)}…` : s.value}”` : ''}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-muted-2">{a.runs} run{a.runs === 1 ? '' : 's'}</span>
                    <InstantActionButton
                      label={
                        a.enabled ? (
                          <span className="inline-flex items-center gap-1.5"><PauseCircle className="h-4 w-4" aria-hidden /> Pause</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5"><PlayCircle className="h-4 w-4" aria-hidden /> Enable</span>
                        )
                      }
                      busyLabel="…"
                      endpoint={`/api/v1/automations/${a.id}`}
                      method="PATCH"
                      body={{ enabled: !a.enabled }}
                      successMessage={a.enabled ? `“${a.name}” paused` : `“${a.name}” is live`}
                      className={cn(
                        'rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition disabled:opacity-50',
                        a.enabled
                          ? 'border-line text-muted hover:border-warn/40 hover:text-warn'
                          : 'border-volt/40 bg-volt/15 text-volt hover:bg-volt/25',
                      )}
                    />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Run log */}
        <Card className="fade-up-2 self-start">
          <CardTitle>Recent runs</CardTitle>
          {runs.length === 0 ? (
            <EmptyState
              title="Nothing has fired yet"
              sub="As soon as a trigger event happens — a payment, a new member — runs show up here."
            />
          ) : (
            <ol className="space-y-4">
              {runs.map((r) => (
                <li key={r.id} className="border-l-2 border-volt/30 pl-3.5">
                  <div className="text-[13px] font-medium">{r.automationName}</div>
                  <div className="text-[11.5px] text-muted-2">triggered by {r.triggeredBy}</div>
                  <ul className="mt-1.5 space-y-1">
                    {r.steps.map((s, i) => (
                      <li key={i} className="text-[12px] leading-relaxed text-muted">
                        {s}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </div>
  );
}

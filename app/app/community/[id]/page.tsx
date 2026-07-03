import { notFound } from 'next/navigation';
import { MessageSquare, NotebookPen } from 'lucide-react';
import { getMember, payments } from '@/lib/data';
import type { ConsentScope, MemberStatus } from '@/lib/types';
import { formatDate, money, pct, relativeDays } from '@/lib/utils';
import { Avatar, Badge, Card, CardTitle, KV, PageHeader, ProgressBar } from '@/components/ui';

const consentScopes: Array<{ scope: ConsentScope; label: string; description: string }> = [
  { scope: 'profile.basic', label: 'The basics', description: 'Name, photo, and club profile — visible to other members in the app.' },
  { scope: 'activity.summary', label: 'Activity summary', description: 'Weekly distance and attendance totals, used for club stats and challenges.' },
  { scope: 'activity.detailed', label: 'Detailed activity', description: 'Full runs from connected apps: routes, pace, and splits.' },
  { scope: 'health.medical', label: 'Medical info', description: 'Emergency contact and medical notes — shown to organizers on event day only.' },
  { scope: 'location.live', label: 'Live location', description: 'Real-time position during club events, for safety sweeps on long routes.' },
  { scope: 'marketing.brands', label: 'Brand marketing', description: 'Anonymized, aggregated stats shared with club sponsors and partners.' },
  { scope: 'photos.appearances', label: 'Photo appearances', description: 'May appear in event photos, galleries, and club social posts.' },
];

const statusTone: Record<MemberStatus, 'ok' | 'info' | 'warn' | 'danger'> = {
  active: 'ok',
  new: 'info',
  'at-risk': 'warn',
  lapsed: 'danger',
};

const pacerNotes: Record<MemberStatus, string> = {
  active:
    'Attendance and activity are steady, so no intervention is needed — this member responds well to challenge invites. Consider tapping them for the July Distance Club leaderboard push.',
  new: 'They are inside the critical first 45 days, where a second attendance doubles retention. The welcome journey is running; a personal hello from a pacer at the next Saturday run would seal it.',
  'at-risk':
    'Attendance has slipped and the gap since their last check-in is widening. Send the drafted "we miss you" message with a free-guest invite to the Saturday Long Run — that combination recovers 41% of drifting members.',
  lapsed:
    'They have been inactive for over six weeks, so automated nudges alone are unlikely to work. A direct, personal message referencing their last event plus a no-pressure social invite is the highest-odds win-back play.',
};

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = getMember(id);
  if (!member) notFound();

  const memberPayments = payments.filter((p) => p.memberId === member.id && p.status === 'succeeded');
  const spent = memberPayments.reduce((s, p) => s + p.amount, 0);
  const riskTone = member.churnRisk > 0.7 ? 'danger' : member.churnRisk > 0.4 ? 'warn' : 'ok';

  return (
    <div>
      <PageHeader
        kicker="Community · Member profile"
        title={member.name}
        sub={`Member since ${formatDate(member.joinedAt)} · ${member.city} · last seen ${relativeDays(member.lastSeen)}`}
        actions={
          <>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-3 px-4 py-2.5 font-display text-sm font-semibold text-paper transition hover:border-volt/40"
            >
              <NotebookPen className="h-4 w-4" aria-hidden />
              Add note
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-volt px-5 py-2.5 font-display text-sm font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)]"
            >
              <MessageSquare className="h-4 w-4" aria-hidden />
              Message
            </button>
          </>
        }
      />

      <div className="mb-6 flex items-center gap-5 fade-up-1">
        <Avatar name={member.name} color={member.avatarColor} size={72} />
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={statusTone[member.status]}>{member.status}</Badge>
            {member.roles.filter((r) => r !== 'member').map((r) => (
              <Badge key={r} tone="volt">{r}</Badge>
            ))}
            <Badge tone="muted">{member.tier} tier</Badge>
          </div>
          <div className="mt-2 text-[13px] text-muted">{member.email}</div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="fade-up-1">
          <CardTitle>Profile</CardTitle>
          <div className="divide-y divide-line/60">
            <KV k="Email" v={member.email} />
            <KV k="Chapter" v={member.city} />
            <KV k="Tier" v={<span className="capitalize">{member.tier}</span>} />
            <KV k="Joined" v={formatDate(member.joinedAt)} />
            <KV k="Last seen" v={relativeDays(member.lastSeen)} />
            <KV
              k="Connected apps"
              v={
                <span className="flex flex-wrap justify-end gap-1.5">
                  {member.connectedApps.map((a) => (
                    <Badge key={a} tone="info">{a}</Badge>
                  ))}
                </span>
              }
            />
            <KV k="Volunteer hours" v={member.volunteerHours > 0 ? `${member.volunteerHours} hrs` : '—'} />
          </div>
        </Card>

        <Card className="fade-up-2">
          <CardTitle>Running</CardTitle>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="text-[12px] font-medium text-muted">Community score</div>
              <div className="font-display text-[40px] font-bold leading-none tracking-tight text-volt">
                {member.communityScore}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] font-medium text-muted">Weekly volume</div>
              <div className="font-display text-[22px] font-bold">{member.weeklyKm} km</div>
            </div>
          </div>
          <div className="mb-1.5 flex justify-between text-[12px] text-muted">
            <span>Attendance · last 12 weeks</span>
            <span>{pct(member.attendanceRate)}</span>
          </div>
          <ProgressBar value={member.attendanceRate} tone={member.attendanceRate < 0.35 ? 'warn' : 'volt'} />
          <div className="mt-4 border-t border-line pt-3">
            <KV k="Events attended" v={String(member.eventsAttended)} />
            {member.prs.map((pr) => (
              <KV key={pr.distance} k={`${pr.distance} PR`} v={<span className="font-display font-semibold">{pr.time}</span>} />
            ))}
          </div>
        </Card>

        <Card className="fade-up-2">
          <CardTitle action={<Badge tone={riskTone}>{pct(member.churnRisk)} churn risk</Badge>}>
            Pacer insight
          </CardTitle>
          <p className="text-[13px] leading-relaxed text-muted">{pacerNotes[member.status]}</p>
          <div className="mt-4 rounded-lg border border-volt/25 bg-volt/8 px-3.5 py-3 text-[12.5px] leading-relaxed text-paper/90">
            <span className="font-semibold text-volt">Pacer:</span> I can draft this message for you — it takes one
            click to review and send from the Intelligence desk.
          </div>
        </Card>

        <Card className="fade-up-3 xl:col-span-2">
          <CardTitle action={<span className="text-[12px] text-muted">Only the member can change these.</span>}>
            Consent &amp; data sharing
          </CardTitle>
          <div className="divide-y divide-line/60">
            {consentScopes.map((c) => {
              const granted = member.consents.includes(c.scope);
              return (
                <div key={c.scope} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[13.5px] font-medium">{c.label}</span>
                      <span className="font-mono text-[11px] text-muted-2">{c.scope}</span>
                    </div>
                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">{c.description}</p>
                  </div>
                  <span
                    className={
                      granted
                        ? 'inline-flex flex-none items-center rounded-full border border-volt/25 bg-volt/15 px-3 py-1 text-[11px] font-semibold text-volt'
                        : 'inline-flex flex-none items-center rounded-full border border-line bg-white/5 px-3 py-1 text-[11px] font-semibold text-muted'
                    }
                  >
                    {granted ? 'Sharing' : 'Private'}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="fade-up-4">
          <CardTitle>Value</CardTitle>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[32px] font-bold leading-none tracking-tight">{money(member.ltv)}</span>
            <span className="text-[12px] font-semibold text-volt">lifetime value</span>
          </div>
          <div className="mt-4 border-t border-line pt-3">
            <div className="mb-2 text-[12px] font-semibold text-muted">
              Purchases · {memberPayments.length} succeeded · {money(spent)} last 30 days
            </div>
            {memberPayments.length === 0 ? (
              <p className="text-[12.5px] text-muted-2">No payments in the last 30 days.</p>
            ) : (
              <div className="space-y-1.5">
                {memberPayments.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 text-[12.5px]">
                    <span className="truncate text-muted">{p.description}</span>
                    <span className="flex-none font-medium">{money(p.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="mt-4 border-t border-line pt-3 text-[12.5px] leading-relaxed text-muted">
            Perk redemptions land here too — benefits-passport usage is one of the strongest retention signals we
            track for this member.
          </p>
        </Card>
      </div>
    </div>
  );
}

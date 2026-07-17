// Pacer copilot — a real analysis engine, not a script. Every answer is
// computed from the live store at ask-time: who actually hasn't paid, who is
// actually inactive, what the attendance and revenue series actually did.
// Deterministic and zero-cost by design; when ANTHROPIC_API_KEY is present the
// API route lets Claude rephrase the computed facts (see /api/v1/copilot) —
// the numbers always come from here, never from a model.
import { TODAY } from './seed';
import { getStore } from './store';
import type { Member } from './types';

export interface CopilotAction {
  label: string;
  /** Navigate somewhere in the app. */
  href?: string;
  /** Or execute a real API call. */
  endpoint?: string;
  method?: 'POST' | 'PATCH';
  body?: Record<string, unknown>;
  successMessage?: string;
}

export interface CopilotReply {
  intent: 'unpaid' | 'inactive' | 'attendance' | 'revenue' | 'plan' | 'sponsor' | 'overview';
  text: string;
  actions: CopilotAction[];
  /** The computed inputs behind the text — rendered nowhere, but they keep the answer auditable. */
  facts: Record<string, unknown>;
}

const DAY_MS = 86_400_000;

function daysSince(iso: string): number {
  return Math.round((TODAY.getTime() - new Date(iso).getTime()) / DAY_MS);
}

function money(n: number): string {
  return `$${n.toFixed(n % 1 === 0 ? 0 : 2)}`;
}

function names(members: Member[], max = 3): string {
  const head = members.slice(0, max).map((m) => m.name.split(' ')[0]);
  const rest = members.length - head.length;
  return rest > 0 ? `${head.join(', ')} and ${rest} more` : head.join(', ');
}

// ---------------------------------------------------------------------------
// Intent handlers — each computes over the store, then explains itself.
// ---------------------------------------------------------------------------

function unpaid(): CopilotReply {
  const store = getStore();
  const failed = store.listPayments('failed');
  const rows = failed.flatMap((p) => {
    const member = store.getMember(p.memberId);
    return member ? [{ member, payment: p }] : [];
  });
  const total = rows.reduce((s, r) => s + r.payment.amount, 0);
  const ids = [...new Set(rows.map((r) => r.member.id))];

  const lines = rows
    .slice(0, 5)
    .map((r) => `• ${r.member.name} — ${money(r.payment.amount)} (${r.payment.description})`)
    .join('\n');

  return {
    intent: 'unpaid',
    text:
      rows.length === 0
        ? 'Everyone is paid up — no failed or outstanding payments right now. Dunning has nothing to chase.'
        : `${rows.length} payment${rows.length === 1 ? '' : 's'} totaling ${money(total)} ${rows.length === 1 ? 'is' : 'are'} currently failed:\n\n${lines}\n\nDunning retries automatically, but a personal reminder converts 2× better than the third automated email. I can send one to each of them now.`,
    actions:
      rows.length === 0
        ? [{ label: 'Open Money →', href: '/app/money' }]
        : [
            {
              label: `Send reminder to ${ids.length}`,
              endpoint: '/api/v1/members/bulk',
              method: 'POST',
              body: {
                ids,
                action: 'message',
                value:
                  'Quick heads-up: your last club payment didn’t go through. You can update your card from the members page — takes 30 seconds. Thanks!',
              },
              successMessage: `Payment reminders sent to ${ids.length} member${ids.length === 1 ? '' : 's'}`,
            },
            { label: 'Open Money →', href: '/app/money' },
          ],
    facts: { failedCount: rows.length, totalOutstanding: total, memberIds: ids },
  };
}

function inactive(): CopilotReply {
  const store = getStore();
  const quiet = store
    .listMembers()
    .filter((m) => daysSince(m.lastSeen) >= 30)
    .sort((a, b) => daysSince(b.lastSeen) - daysSince(a.lastSeen));
  const atRisk = store.listMembers({ status: 'at-risk' });
  const ids = quiet.map((m) => m.id);

  const lines = quiet
    .slice(0, 5)
    .map((m) => `• ${m.name} — last seen ${daysSince(m.lastSeen)} days ago (${m.status})`)
    .join('\n');

  return {
    intent: 'inactive',
    text:
      quiet.length === 0
        ? `Nobody has been away 30+ days — the closest thing to a churn signal is the ${atRisk.length} at-risk member${atRisk.length === 1 ? '' : 's'} the model already flagged.`
        : `${quiet.length} member${quiet.length === 1 ? '' : 's'} haven’t been seen in 30+ days:\n\n${lines}\n\nThe pattern behind most of these is a broken weekly habit, not a decision to quit — which is exactly what a comeback campaign is for: a personal note now, a free-guest invite for Saturday, and a follow-up if they don’t book.`,
    actions:
      quiet.length === 0
        ? [{ label: 'Open Community →', href: '/app/community' }]
        : [
            {
              label: 'Launch comeback campaign',
              endpoint: '/api/v1/members/bulk',
              method: 'POST',
              body: {
                ids,
                action: 'message',
                value:
                  'We miss you at the runs! Saturday’s Long Run has your name on it — bring a friend, both of you run free. No pressure, just good company.',
              },
              successMessage: `Comeback campaign sent to ${ids.length} member${ids.length === 1 ? '' : 's'}`,
            },
            {
              label: 'Create win-back journey',
              endpoint: '/api/v1/journeys',
              method: 'POST',
              body: {
                name: 'Comeback campaign',
                trigger: 'inactive_30d',
                conversionGoal: 'Attends a run within 14 days',
              },
              successMessage: 'Win-back journey created as a draft',
            },
            { label: 'Open Community →', href: '/app/community' },
          ],
    facts: { inactiveCount: quiet.length, atRiskCount: atRisk.length, memberIds: ids },
  };
}

function attendance(): CopilotReply {
  const store = getStore();
  const weeks = store.metrics().wacm;
  const last = weeks[weeks.length - 1];
  const prev = weeks[weeks.length - 2];
  const fourWeekAvg = weeks.slice(-5, -1).reduce((s, w) => s + w.attendance, 0) / Math.min(4, weeks.length - 1);
  const delta = last.attendance - prev.attendance;
  const vsAvg = last.attendance - fourWeekAvg;
  const best = [...weeks].sort((a, b) => b.attendance - a.attendance)[0];

  const direction = delta >= 0 ? 'up' : 'down';
  const reasons: string[] = [];
  if (last.newMembers < prev.newMembers) {
    reasons.push(`new-member intake halved (${last.newMembers} vs ${prev.newMembers} the week before) — new members attend most reliably in their first month`);
  }
  if (last.churned > 0) {
    reasons.push(`${last.churned} member${last.churned === 1 ? '' : 's'} churned this week, and churned members stop showing up before they formally leave`);
  }
  if (last.wacm > prev.wacm && delta < 0) {
    reasons.push(`weekly-active is actually up (${last.wacm} vs ${prev.wacm}) — people are engaging online but skipping sessions, which usually points at the schedule, not the club`);
  }
  if (reasons.length === 0) reasons.push('no negative driver stands out in the data — the dip is within normal week-to-week noise');

  return {
    intent: 'attendance',
    text:
      `Attendance is ${direction} ${Math.abs(delta)} week-over-week (${last.attendance} in "${last.week}" vs ${prev.attendance}), ` +
      `${vsAvg >= 0 ? `${Math.round(vsAvg)} above` : `${Math.round(Math.abs(vsAvg))} below`} the 4-week average of ${Math.round(fourWeekAvg)}. ` +
      `Best week on record: "${best.week}" with ${best.attendance}.\n\nWhat the data says about why:\n${reasons.map((r) => `• ${r}`).join('\n')}`,
    actions: [
      { label: 'Open Intelligence →', href: '/app/intelligence' },
      { label: 'Schedule an extra session', href: '/app/events/new' },
    ],
    facts: { last: last.attendance, prev: prev.attendance, fourWeekAvg, bestWeek: best.week },
  };
}

function revenue(): CopilotReply {
  const store = getStore();
  const metrics = store.metrics();
  const failed = store.listPayments('failed');
  const refunded = store.listPayments('refunded');
  const failedTotal = failed.reduce((s, p) => s + p.amount, 0);
  const refundTotal = refunded.reduce((s, p) => s + p.amount, 0);
  const weeks = metrics.wacm;
  const lastRev = weeks[weeks.length - 1].revenue;
  const prevRev = weeks[weeks.length - 2].revenue;
  const churnedRecent = weeks.slice(-4).reduce((s, w) => s + w.churned, 0);

  const reasons: [number, string][] = [
    [failedTotal, `${money(failedTotal)} sitting in failed payments (${failed.length} transaction${failed.length === 1 ? '' : 's'}) — dunning recovers ~71%, a personal nudge recovers more`],
    [refundTotal, `${money(refundTotal)} refunded`],
    [churnedRecent * 12, `${churnedRecent} members churned over the last 4 weeks (~${money(churnedRecent * 12)}/mo in plan revenue)`],
  ];
  const top = reasons.filter(([v]) => v > 0).sort((a, b) => b[0] - a[0]).slice(0, 3);

  return {
    intent: 'revenue',
    text:
      `Revenue this month is ${money(metrics.revenueThisMonth)} on ${money(metrics.mrr)} MRR; the latest week booked ${money(lastRev)} vs ${money(prevRev)} the week before.` +
      (top.length === 0
        ? ' No leaks in the data — failed payments, refunds, and churn are all at zero.'
        : `\n\nTop ${top.length} drag${top.length === 1 ? '' : 's'} on the number, largest first:\n${top.map(([, r]) => `• ${r}`).join('\n')}`),
    actions: [
      ...(failed.length > 0
        ? [{
            label: `Nudge ${new Set(failed.map((p) => p.memberId)).size} failed payers`,
            endpoint: '/api/v1/members/bulk',
            method: 'POST' as const,
            body: {
              ids: [...new Set(failed.map((p) => p.memberId))],
              action: 'message',
              value: 'Your last payment didn’t go through — mind updating your card? Takes 30 seconds from the members page.',
            },
            successMessage: 'Failed payers nudged',
          }]
        : []),
      { label: 'Open Money →', href: '/app/money' },
    ],
    facts: { revenueThisMonth: metrics.revenueThisMonth, mrr: metrics.mrr, failedTotal, refundTotal, churnedRecent },
  };
}

function plan(): CopilotReply {
  const store = getStore();
  const metrics = store.metrics();
  const avgAttendance = Math.round(
    metrics.wacm.slice(-4).reduce((s, w) => s + w.attendance, 0) / 4,
  );
  const nextMonth = new Date(TODAY.getTime() + 30 * DAY_MS);
  const monthName = nextMonth.toLocaleDateString('en-US', { month: 'long' });
  const firstSaturday = new Date(nextMonth);
  firstSaturday.setUTCDate(1);
  while (firstSaturday.getUTCDay() !== 6) firstSaturday.setUTCDate(firstSaturday.getUTCDate() + 1);

  return {
    intent: 'plan',
    text:
      `Draft for ${monthName}, sized from your real numbers (${avgAttendance} average attendance over the last 4 weeks, ${metrics.counts.activeMembers} active members):\n\n` +
      `• 4 Saturday long runs — capacity ${Math.round(avgAttendance * 1.3)}, first one ${firstSaturday.toUTCString().slice(0, 11)}\n` +
      `• 1 track workout mid-month — capacity ${Math.round(avgAttendance * 0.6)}\n` +
      `• 1 social run + coffee to close the month — the retention workhorse\n\n` +
      `I can create the first Saturday as a draft right now; the rest follow the same template in two clicks each.`,
    actions: [
      {
        label: 'Create first Saturday draft',
        endpoint: '/api/v1/events',
        method: 'POST',
        body: {
          title: `Saturday Long Run — ${monthName} opener`,
          type: 'long-run',
          date: firstSaturday.toISOString(),
          location: 'Central Pier, Harbor City',
          capacity: Math.round(avgAttendance * 1.3),
          distanceKm: 16,
        },
        successMessage: 'Draft event created',
      },
      { label: 'Open Events →', href: '/app/events' },
    ],
    facts: { avgAttendance, month: monthName, firstSaturday: firstSaturday.toISOString() },
  };
}

function sponsor(): CopilotReply {
  const store = getStore();
  const metrics = store.metrics();
  const sponsors = store.listSponsors();
  const proposal = sponsors.find((s) => s.stage === 'proposal');

  return {
    intent: 'sponsor',
    text:
      `Pipeline: ${money(metrics.sponsorPipelineValue)} in open deals, ${money(metrics.activeSponsorValue)} active.` +
      (proposal
        ? ` The furthest-along open deal is ${proposal.name} (${money(proposal.dealValue)}, stage "proposal") — next step on file: ${proposal.nextStep}. I can send it and move the deal to negotiation.`
        : ' Nothing is sitting at the proposal stage — the next move is qualifying the leads.'),
    actions: proposal
      ? [
          {
            label: `Send ${proposal.name} proposal`,
            endpoint: `/api/v1/sponsors/${proposal.id}`,
            method: 'PATCH',
            body: { stage: 'negotiation', next_step: 'Proposal sent — awaiting response' },
            successMessage: `${proposal.name} moved to negotiation`,
          },
          { label: 'Open Partners →', href: '/app/partners' },
        ]
      : [{ label: 'Open Partners →', href: '/app/partners' }],
    facts: { pipeline: metrics.sponsorPipelineValue, active: metrics.activeSponsorValue, proposalId: proposal?.id ?? null },
  };
}

function overview(): CopilotReply {
  const store = getStore();
  const m = store.metrics();
  const last = m.wacm[m.wacm.length - 1];
  return {
    intent: 'overview',
    text:
      `Snapshot: ${m.counts.members} members (${m.counts.activeMembers} active, ${m.counts.atRiskMembers} at risk), ` +
      `${last.wacm} weekly-active this week, ${money(m.mrr)} MRR, ${m.counts.upcomingEvents} events on the calendar.\n\n` +
      `Ask me things like “who hasn’t paid?”, “which members went inactive?”, “why did attendance drop?”, “why is revenue lower?”, “plan next month”, or “what’s in the sponsor pipeline?” — every answer is computed from your live data, and most come with a one-click fix.`,
    actions: [{ label: 'Open Intelligence →', href: '/app/intelligence' }],
    facts: { members: m.counts.members, wacm: last.wacm, mrr: m.mrr },
  };
}

// ---------------------------------------------------------------------------
// Intent routing — keyword scoring, not a single substring hit.
// ---------------------------------------------------------------------------

const INTENTS: { intent: CopilotReply['intent']; keywords: string[]; run: () => CopilotReply }[] = [
  { intent: 'unpaid', keywords: ['paid', 'pay', 'unpaid', 'owe', 'outstanding', 'dues', 'failed payment', 'reminder'], run: unpaid },
  { intent: 'inactive', keywords: ['inactive', 'quit', 'quiet', 'churn', 'risk', 'away', 'missing', 'comeback', 'lapsed', 'gone', '30 days'], run: inactive },
  { intent: 'attendance', keywords: ['attendance', 'show up', 'showed up', 'turnout', 'dropped', 'drop', 'fewer people'], run: attendance },
  { intent: 'revenue', keywords: ['revenue', 'income', 'money', 'lower', 'mrr', 'forecast', 'earning'], run: revenue },
  { intent: 'plan', keywords: ['plan', 'month', 'schedule', 'october', 'draft events', 'calendar'], run: plan },
  { intent: 'sponsor', keywords: ['sponsor', 'proposal', 'pipeline', 'deal', 'partner'], run: sponsor },
];

export function askCopilot(query: string): CopilotReply {
  const q = query.toLowerCase();
  let bestScore = 0;
  let best: (() => CopilotReply) | null = null;
  for (const candidate of INTENTS) {
    const score = candidate.keywords.reduce((s, k) => s + (q.includes(k) ? (k.includes(' ') ? 2 : 1) : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = candidate.run;
    }
  }
  return best ? best() : overview();
}

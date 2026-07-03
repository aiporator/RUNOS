// Query helpers over the seed data. This is the demo's "repository layer" —
// swap the imports for real Postgres queries without touching the UI.
import {
  activityFeed, challenges, club, events, journeys, members, membershipPlans,
  payments, perks, registrations, sponsors, vendors, weeklyMetrics, TODAY,
} from './seed';
import type { ClubEvent, Member, Payment } from './types';

export {
  activityFeed, challenges, club, events, journeys, members, membershipPlans,
  payments, perks, registrations, sponsors, vendors, weeklyMetrics, TODAY,
};

export function getMember(id: string): Member | undefined {
  return members.find((m) => m.id === id);
}

export function getEvent(id: string): ClubEvent | undefined {
  return events.find((e) => e.id === id);
}

export function upcomingEvents(): ClubEvent[] {
  return events
    .filter((e) => e.status === 'published' || e.status === 'draft')
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function completedEvents(): ClubEvent[] {
  return events.filter((e) => e.status === 'completed').sort((a, b) => b.date.localeCompare(a.date));
}

export function atRiskMembers(): Member[] {
  return [...members].filter((m) => m.status === 'at-risk').sort((a, b) => b.churnRisk - a.churnRisk);
}

export function newMembers(): Member[] {
  return members.filter((m) => m.status === 'new');
}

export function ambassadorCandidates(): Member[] {
  return [...members]
    .filter((m) => !m.roles.includes('ambassador') && m.communityScore >= 78)
    .sort((a, b) => b.communityScore - a.communityScore);
}

export function mrr(): number {
  return membershipPlans.reduce(
    (sum, p) => sum + p.members * (p.interval === 'year' ? p.price / 12 : p.price),
    0,
  );
}

export function revenueThisMonth(): number {
  return payments.filter((p) => p.status === 'succeeded').reduce((s, p) => s + p.amount, 0);
}

export function failedPayments(): Payment[] {
  return payments.filter((p) => p.status === 'failed');
}

export function totalPerkRedemptions(): number {
  return perks.reduce((s, p) => s + p.redemptions, 0);
}

export function sponsorPipelineValue(): number {
  return sponsors.filter((s) => !['active', 'renewal'].includes(s.stage)).reduce((s, x) => s + x.dealValue, 0);
}

export function activeSponsorValue(): number {
  return sponsors.filter((s) => ['active', 'renewal'].includes(s.stage)).reduce((s, x) => s + x.dealValue, 0);
}

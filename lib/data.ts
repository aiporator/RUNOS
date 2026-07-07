// Query helpers over the live backend store — this is the demo's "repository
// layer" for the /app organizer dashboard. Everything that can be created or
// changed from the dashboard (members, events, sponsors, journeys, …) reads
// from the mutable store singleton (lib/store.ts) so a CTA's effect actually
// shows up here; entities nothing in the UI mutates stay frozen seed
// re-exports. Swap the store-backed calls for real Postgres queries without
// touching the UI.
import { activityFeed, membershipPlans, vendors, weeklyMetrics, TODAY } from './seed';
import { getStore } from './store';
import type { ClubEvent, Member, Payment } from './types';

export { activityFeed, membershipPlans, vendors, weeklyMetrics, TODAY };

export function members(): Member[] {
  return getStore().listMembers();
}

export function events(): ClubEvent[] {
  return getStore().listEvents();
}

export function registrations() {
  return getStore().listRegistrations();
}

export function payments(): Payment[] {
  return getStore().listPayments();
}

export function sponsors() {
  return getStore().listSponsors();
}

export function perks() {
  return getStore().listPerks();
}

export function challenges() {
  return getStore().listChallenges();
}

export function journeys() {
  return getStore().listJourneys();
}

export function club() {
  return getStore().getClub();
}

export function staff() {
  return getStore().listStaff();
}

export function integrations() {
  return getStore().listIntegrations();
}

export function memberNotes(memberId: string) {
  return getStore().listMemberNotes(memberId);
}

export function getMember(id: string): Member | undefined {
  return getStore().getMember(id);
}

export function getEvent(id: string): ClubEvent | undefined {
  return getStore().getEvent(id);
}

export function upcomingEvents(): ClubEvent[] {
  return events()
    .filter((e) => e.status === 'published' || e.status === 'draft')
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function completedEvents(): ClubEvent[] {
  return events().filter((e) => e.status === 'completed').sort((a, b) => b.date.localeCompare(a.date));
}

export function atRiskMembers(): Member[] {
  return members().filter((m) => m.status === 'at-risk').sort((a, b) => b.churnRisk - a.churnRisk);
}

export function newMembers(): Member[] {
  return members().filter((m) => m.status === 'new');
}

export function ambassadorCandidates(): Member[] {
  return members()
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
  return payments().filter((p) => p.status === 'succeeded').reduce((s, p) => s + p.amount, 0);
}

export function failedPayments(): Payment[] {
  return payments().filter((p) => p.status === 'failed');
}

export function totalPerkRedemptions(): number {
  return perks().reduce((s, p) => s + p.redemptions, 0);
}

export function sponsorPipelineValue(): number {
  return sponsors().filter((s) => !['active', 'renewal'].includes(s.stage)).reduce((s, x) => s + x.dealValue, 0);
}

export function activeSponsorValue(): number {
  return sponsors().filter((s) => ['active', 'renewal'].includes(s.stage)).reduce((s, x) => s + x.dealValue, 0);
}

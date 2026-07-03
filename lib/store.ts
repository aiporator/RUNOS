// RunOS backend store — a singleton, mutable, in-memory database for the demo
// REST API. Initialized from the deterministic seed data (deep-copied so route
// mutations never touch the seed module). Function signatures below double as
// the repository interface for the future Postgres swap
// (see docs/03-architecture/database-schema.md).
import {
  challenges as seedChallenges,
  events as seedEvents,
  journeys as seedJourneys,
  members as seedMembers,
  membershipPlans as seedMembershipPlans,
  payments as seedPayments,
  perks as seedPerks,
  registrations as seedRegistrations,
  sponsors as seedSponsors,
  weeklyMetrics as seedWeeklyMetrics,
  TODAY,
} from './seed';
import type {
  Challenge,
  ClubEvent,
  ConsentScope,
  EventStatus,
  EventType,
  Journey,
  Member,
  MemberStatus,
  Payment,
  PaymentKind,
  Perk,
  Registration,
  Sponsor,
  WeeklyMetric,
} from './types';

// ---------------------------------------------------------------------------
// Constants & auxiliary types
// ---------------------------------------------------------------------------

export const SPONSOR_STAGES = [
  'lead',
  'contacted',
  'proposal',
  'negotiation',
  'active',
  'renewal',
] as const;

export type SponsorStage = Sponsor['stage'];

const PLATFORM_FEE_RATE = 0.005; // 0.5%

const AVATAR_COLORS = [
  '#cdfb50', '#7db8ff', '#ff9d7a', '#b78bff', '#7ee081', '#ffc94d', '#ff8ab8', '#71e0d4',
];

export interface AuditEntry {
  id: string;
  action: string; // e.g. "member.created"
  entity: string; // e.g. "mem_049"
  at: string; // ISO timestamp
}

export interface PerkRedemption {
  id: string;
  perkId: string;
  memberId: string;
  codeIssued: string;
  redeemedAt: string;
}

export interface MemberFilter {
  status?: MemberStatus;
  q?: string;
}

export interface EventFilter {
  status?: EventStatus;
  type?: EventType;
}

export interface CreateMemberInput {
  name: string;
  email: string;
  tier?: Member['tier'];
  city?: string;
  tags?: string[];
  consents?: ConsentScope[];
}

export interface UpdateMemberInput {
  status?: MemberStatus;
  tags?: string[];
  tier?: Member['tier'];
}

export interface CreateEventInput {
  title: string;
  type: EventType;
  date: string;
  location?: string;
  routeName?: string;
  distanceKm?: number;
  capacity?: number;
  price?: number;
  description?: string;
}

export interface UpdateEventInput {
  title?: string;
  status?: EventStatus;
  date?: string;
  location?: string;
  routeName?: string;
  distanceKm?: number;
  capacity?: number;
  price?: number;
  description?: string;
  weather?: string;
}

export interface CreatePaymentInput {
  memberId: string;
  kind: PaymentKind;
  description: string;
  amount: number;
}

export type RegistrationResult =
  | { kind: 'registered'; registration: Registration; event: ClubEvent }
  | { kind: 'waitlisted'; position: number; event: ClubEvent }
  | { kind: 'already_registered'; registration: Registration }
  | { kind: 'event_not_found' }
  | { kind: 'member_not_found' };

export type CheckInResult =
  | { kind: 'checked_in'; firstTime: boolean; registration: Registration; event: ClubEvent }
  | { kind: 'already_checked_in'; registration: Registration; event: ClubEvent }
  | { kind: 'not_registered' }
  | { kind: 'event_not_found' }
  | { kind: 'member_not_found' };

export type RedeemResult =
  | { kind: 'redeemed'; redemption: PerkRedemption; perk: Perk }
  | { kind: 'limit_reached'; perk: Perk }
  | { kind: 'perk_inactive'; perk: Perk }
  | { kind: 'perk_not_found' }
  | { kind: 'member_not_found' };

export interface Metrics {
  wacm: WeeklyMetric[];
  mrr: number;
  revenueThisMonth: number;
  counts: {
    members: number;
    activeMembers: number;
    atRiskMembers: number;
    newMembers: number;
    events: number;
    upcomingEvents: number;
    registrations: number;
    checkedInTotal: number;
    payments: number;
    sponsors: number;
    perkRedemptions: number;
    challenges: number;
    journeys: number;
  };
  sponsorPipelineValue: number;
  activeSponsorValue: number;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface StoreState {
  members: Member[];
  events: ClubEvent[];
  registrations: Registration[];
  payments: Payment[];
  sponsors: Sponsor[];
  perks: Perk[];
  challenges: Challenge[];
  journeys: Journey[];
  weeklyMetrics: WeeklyMetric[];
  redemptions: PerkRedemption[];
  auditLog: AuditEntry[];
  counters: Record<string, number>;
  auditSeq: number;
}

export interface RunosStore {
  // members
  listMembers(filter?: MemberFilter): Member[];
  getMember(id: string): Member | undefined;
  createMember(input: CreateMemberInput): Member;
  updateMember(id: string, patch: UpdateMemberInput): Member | undefined;
  // events
  listEvents(filter?: EventFilter): ClubEvent[];
  getEvent(id: string): ClubEvent | undefined;
  createEvent(input: CreateEventInput): ClubEvent;
  updateEvent(id: string, patch: UpdateEventInput): ClubEvent | undefined;
  // registrations & check-in
  listRegistrations(eventId?: string): Registration[];
  createRegistration(eventId: string, memberId: string): RegistrationResult;
  checkIn(eventId: string, memberId: string): CheckInResult;
  // money
  listPayments(status?: Payment['status']): Payment[];
  createPayment(input: CreatePaymentInput): Payment;
  // partners
  listSponsors(): Sponsor[];
  getSponsor(id: string): Sponsor | undefined;
  updateSponsorStage(id: string, stage: SponsorStage, nextStep?: string): Sponsor | undefined;
  listPerks(): Perk[];
  redeemPerk(perkId: string, memberId: string): RedeemResult;
  // engage
  listChallenges(): Challenge[];
  listJourneys(): Journey[];
  // analytics & audit
  metrics(): Metrics;
  listAudit(): AuditEntry[];
  recordAudit(action: string, entity: string): AuditEntry;
}

function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function createStore(): RunosStore {
  const state: StoreState = {
    members: deepCopy(seedMembers),
    events: deepCopy(seedEvents),
    registrations: deepCopy(seedRegistrations),
    payments: deepCopy(seedPayments),
    sponsors: deepCopy(seedSponsors),
    perks: deepCopy(seedPerks),
    challenges: deepCopy(seedChallenges),
    journeys: deepCopy(seedJourneys),
    weeklyMetrics: deepCopy(seedWeeklyMetrics),
    redemptions: [],
    auditLog: [],
    counters: {
      mem: seedMembers.length,
      evt: seedEvents.length,
      reg: seedRegistrations.length,
      pay: seedPayments.length,
      prx: 0,
      aud: 0,
    },
    auditSeq: 0,
  };

  function nextId(prefix: string): string {
    const n = (state.counters[prefix] ?? 0) + 1;
    state.counters[prefix] = n;
    return `${prefix}_${String(n).padStart(3, '0')}`;
  }

  // Deterministic audit timestamps: fixed base date (seed TODAY) plus an
  // incrementing offset — no Date.now() at module scope.
  function recordAudit(action: string, entity: string): AuditEntry {
    state.auditSeq += 1;
    const entry: AuditEntry = {
      id: nextId('aud'),
      action,
      entity,
      at: new Date(TODAY.getTime() + state.auditSeq * 1000).toISOString(),
    };
    state.auditLog.push(entry);
    return entry;
  }

  return {
    // -- members ------------------------------------------------------------
    listMembers(filter?: MemberFilter): Member[] {
      let out = state.members;
      if (filter?.status) out = out.filter((m) => m.status === filter.status);
      if (filter?.q) {
        const q = filter.q.toLowerCase();
        out = out.filter(
          (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
        );
      }
      return out;
    },

    getMember(id: string): Member | undefined {
      return state.members.find((m) => m.id === id);
    },

    createMember(input: CreateMemberInput): Member {
      const id = nextId('mem');
      const now = new Date().toISOString();
      const idx = state.counters.mem - 1;
      const member: Member = {
        id,
        name: input.name,
        email: input.email,
        joinedAt: now,
        status: 'new',
        roles: ['member'],
        tier: input.tier ?? 'free',
        city: input.city ?? 'Harbor City — Central',
        avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
        weeklyKm: 0,
        attendanceRate: 0,
        eventsAttended: 0,
        lastSeen: now,
        churnRisk: 0.1,
        communityScore: 30,
        ltv: 0,
        consents: input.consents ?? ['profile.basic'],
        connectedApps: [],
        prs: [],
        volunteerHours: 0,
        tags: input.tags ?? ['first-timer-followup'],
      };
      state.members.push(member);
      recordAudit('member.created', id);
      return member;
    },

    updateMember(id: string, patch: UpdateMemberInput): Member | undefined {
      const member = state.members.find((m) => m.id === id);
      if (!member) return undefined;
      if (patch.status !== undefined) member.status = patch.status;
      if (patch.tags !== undefined) member.tags = patch.tags;
      if (patch.tier !== undefined) member.tier = patch.tier;
      recordAudit('member.updated', id);
      return member;
    },

    // -- events ---------------------------------------------------------------
    listEvents(filter?: EventFilter): ClubEvent[] {
      let out = state.events;
      if (filter?.status) out = out.filter((e) => e.status === filter.status);
      if (filter?.type) out = out.filter((e) => e.type === filter.type);
      return [...out].sort((a, b) => a.date.localeCompare(b.date));
    },

    getEvent(id: string): ClubEvent | undefined {
      return state.events.find((e) => e.id === id);
    },

    createEvent(input: CreateEventInput): ClubEvent {
      const id = nextId('evt');
      const event: ClubEvent = {
        id,
        title: input.title,
        type: input.type,
        status: 'draft',
        date: input.date,
        location: input.location ?? 'TBD',
        routeName: input.routeName ?? input.title,
        distanceKm: input.distanceKm ?? 0,
        capacity: input.capacity ?? 50,
        registered: 0,
        checkedIn: 0,
        waitlist: 0,
        price: input.price ?? 0,
        pacers: [],
        volunteers: [],
        weather: '—',
        description: input.description ?? '',
      };
      state.events.push(event);
      recordAudit('event.created', id);
      return event;
    },

    updateEvent(id: string, patch: UpdateEventInput): ClubEvent | undefined {
      const event = state.events.find((e) => e.id === id);
      if (!event) return undefined;
      if (patch.title !== undefined) event.title = patch.title;
      if (patch.status !== undefined) event.status = patch.status;
      if (patch.date !== undefined) event.date = patch.date;
      if (patch.location !== undefined) event.location = patch.location;
      if (patch.routeName !== undefined) event.routeName = patch.routeName;
      if (patch.distanceKm !== undefined) event.distanceKm = patch.distanceKm;
      if (patch.capacity !== undefined) event.capacity = patch.capacity;
      if (patch.price !== undefined) event.price = patch.price;
      if (patch.description !== undefined) event.description = patch.description;
      if (patch.weather !== undefined) event.weather = patch.weather;
      recordAudit('event.updated', id);
      return event;
    },

    // -- registrations & check-in ---------------------------------------------
    listRegistrations(eventId?: string): Registration[] {
      return eventId
        ? state.registrations.filter((r) => r.eventId === eventId)
        : state.registrations;
    },

    createRegistration(eventId: string, memberId: string): RegistrationResult {
      const event = state.events.find((e) => e.id === eventId);
      if (!event) return { kind: 'event_not_found' };
      const member = state.members.find((m) => m.id === memberId);
      if (!member) return { kind: 'member_not_found' };
      const existing = state.registrations.find(
        (r) => r.eventId === eventId && r.memberId === memberId,
      );
      if (existing) return { kind: 'already_registered', registration: existing };
      if (event.registered >= event.capacity) {
        event.waitlist += 1;
        recordAudit('registration.waitlisted', `${eventId}:${memberId}`);
        return { kind: 'waitlisted', position: event.waitlist, event };
      }
      const registration: Registration = {
        id: nextId('reg'),
        eventId,
        memberId,
        registeredAt: new Date().toISOString(),
        checkedInAt: null,
        waiverSigned: false,
      };
      state.registrations.push(registration);
      event.registered += 1;
      recordAudit('registration.created', registration.id);
      return { kind: 'registered', registration, event };
    },

    checkIn(eventId: string, memberId: string): CheckInResult {
      const event = state.events.find((e) => e.id === eventId);
      if (!event) return { kind: 'event_not_found' };
      const member = state.members.find((m) => m.id === memberId);
      if (!member) return { kind: 'member_not_found' };
      const registration = state.registrations.find(
        (r) => r.eventId === eventId && r.memberId === memberId,
      );
      if (!registration) return { kind: 'not_registered' };
      // Idempotent: a second check-in is a no-op that reports the fact.
      if (registration.checkedInAt !== null) {
        return { kind: 'already_checked_in', registration, event };
      }
      const firstTime = !state.registrations.some(
        (r) => r.memberId === memberId && r.checkedInAt !== null,
      );
      registration.checkedInAt = new Date().toISOString();
      event.checkedIn += 1;
      member.eventsAttended += 1;
      member.lastSeen = registration.checkedInAt;
      recordAudit('checkin.recorded', registration.id);
      return { kind: 'checked_in', firstTime, registration, event };
    },

    // -- money ------------------------------------------------------------------
    listPayments(status?: Payment['status']): Payment[] {
      const out = status ? state.payments.filter((p) => p.status === status) : state.payments;
      return [...out].sort((a, b) => b.date.localeCompare(a.date));
    },

    createPayment(input: CreatePaymentInput): Payment {
      const payment: Payment = {
        id: nextId('pay'),
        memberId: input.memberId,
        kind: input.kind,
        description: input.description,
        amount: input.amount,
        // RunOS platform fee: 0.5% of the transaction amount.
        fee: Math.round(input.amount * PLATFORM_FEE_RATE * 100) / 100,
        status: 'succeeded',
        date: new Date().toISOString(),
      };
      state.payments.push(payment);
      recordAudit('payment.succeeded', payment.id);
      return payment;
    },

    // -- partners ------------------------------------------------------------
    listSponsors(): Sponsor[] {
      return state.sponsors;
    },

    getSponsor(id: string): Sponsor | undefined {
      return state.sponsors.find((s) => s.id === id);
    },

    updateSponsorStage(id: string, stage: SponsorStage, nextStep?: string): Sponsor | undefined {
      const sponsor = state.sponsors.find((s) => s.id === id);
      if (!sponsor) return undefined;
      sponsor.stage = stage;
      if (nextStep !== undefined) sponsor.nextStep = nextStep;
      recordAudit('sponsor.stage_changed', id);
      return sponsor;
    },

    listPerks(): Perk[] {
      return state.perks;
    },

    redeemPerk(perkId: string, memberId: string): RedeemResult {
      const perk = state.perks.find((p) => p.id === perkId);
      if (!perk) return { kind: 'perk_not_found' };
      const member = state.members.find((m) => m.id === memberId);
      if (!member) return { kind: 'member_not_found' };
      if (!perk.active) return { kind: 'perk_inactive', perk };
      if (perk.monthlyLimit !== null && perk.redemptions >= perk.monthlyLimit) {
        return { kind: 'limit_reached', perk };
      }
      perk.redemptions += 1;
      const redemption: PerkRedemption = {
        id: nextId('prx'),
        perkId,
        memberId,
        codeIssued: `RUNOS-${perkId.replace('perk_', 'P')}-${String(state.counters.prx).padStart(4, '0')}`,
        redeemedAt: new Date().toISOString(),
      };
      state.redemptions.push(redemption);
      recordAudit('perk.redeemed', redemption.id);
      return { kind: 'redeemed', redemption, perk };
    },

    // -- engage ---------------------------------------------------------------
    listChallenges(): Challenge[] {
      return state.challenges;
    },

    listJourneys(): Journey[] {
      return state.journeys;
    },

    // -- analytics & audit ------------------------------------------------------
    metrics(): Metrics {
      const mrr = seedMembershipPlans.reduce(
        (sum, p) => sum + p.members * (p.interval === 'year' ? p.price / 12 : p.price),
        0,
      );
      const revenueThisMonth = state.payments
        .filter((p) => p.status === 'succeeded')
        .reduce((s, p) => s + p.amount, 0);
      return {
        wacm: state.weeklyMetrics,
        mrr: Math.round(mrr * 100) / 100,
        revenueThisMonth: Math.round(revenueThisMonth * 100) / 100,
        counts: {
          members: state.members.length,
          activeMembers: state.members.filter((m) => m.status === 'active').length,
          atRiskMembers: state.members.filter((m) => m.status === 'at-risk').length,
          newMembers: state.members.filter((m) => m.status === 'new').length,
          events: state.events.length,
          upcomingEvents: state.events.filter(
            (e) => e.status === 'published' || e.status === 'draft',
          ).length,
          registrations: state.registrations.length,
          checkedInTotal: state.events.reduce((s, e) => s + e.checkedIn, 0),
          payments: state.payments.length,
          sponsors: state.sponsors.length,
          perkRedemptions: state.perks.reduce((s, p) => s + p.redemptions, 0),
          challenges: state.challenges.length,
          journeys: state.journeys.length,
        },
        sponsorPipelineValue: state.sponsors
          .filter((s) => !['active', 'renewal'].includes(s.stage))
          .reduce((sum, s) => sum + s.dealValue, 0),
        activeSponsorValue: state.sponsors
          .filter((s) => ['active', 'renewal'].includes(s.stage))
          .reduce((sum, s) => sum + s.dealValue, 0),
      };
    },

    listAudit(): AuditEntry[] {
      return [...state.auditLog].reverse();
    },

    recordAudit,
  };
}

// ---------------------------------------------------------------------------
// Singleton — stashed on globalThis so the store survives Next.js dev
// hot-reloads (each reload re-evaluates modules but keeps globalThis).
// ---------------------------------------------------------------------------

const globalWithStore = globalThis as typeof globalThis & { __runosStore?: RunosStore };

export function getStore(): RunosStore {
  globalWithStore.__runosStore ??= createStore();
  return globalWithStore.__runosStore;
}

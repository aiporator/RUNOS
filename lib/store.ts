// RunOS backend store — a singleton, mutable, in-memory database for the demo
// REST API. Initialized from the deterministic seed data (deep-copied so route
// mutations never touch the seed module). Function signatures below double as
// the repository interface for the future Postgres swap
// (see docs/03-architecture/database-schema.md).
import {
  automations as seedAutomations,
  challenges as seedChallenges,
  club as seedClub,
  events as seedEvents,
  integrations as seedIntegrations,
  journeys as seedJourneys,
  members as seedMembers,
  membershipPlans as seedMembershipPlans,
  payments as seedPayments,
  perks as seedPerks,
  registrations as seedRegistrations,
  sponsors as seedSponsors,
  staff as seedStaff,
  weeklyMetrics as seedWeeklyMetrics,
  TODAY,
} from './seed';
import type {
  Automation,
  AutomationRun,
  AutomationStep,
  AutomationTrigger,
  Challenge,
  Club,
  ClubEvent,
  ConsentScope,
  EventStatus,
  EventType,
  Integration,
  Journey,
  Member,
  MemberNote,
  MemberStatus,
  Payment,
  PaymentKind,
  Perk,
  Registration,
  Sponsor,
  StaffMember,
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

export interface HistoryEntry {
  seq: number;
  label: string; // human label of the mutation this snapshot precedes
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

export interface CreateJourneyInput {
  name: string;
  trigger: string;
  conversionGoal: string;
}

export interface CreateChallengeInput {
  name: string;
  metric: string;
  target: number;
  unit: string;
  endsAt: string;
}

export interface CreateSponsorInput {
  name: string;
  industry: string;
  contact: string;
  dealValue: number;
}

export interface InviteStaffInput {
  name: string;
  email: string;
  roles: string[];
}

export interface BulkMemberInput {
  ids: string[];
  action: 'status' | 'tag' | 'tier' | 'message';
  value: string;
}

export interface CreateAutomationInput {
  name: string;
  trigger: AutomationTrigger;
  steps: AutomationStep[];
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
  club: Club;
  staff: StaffMember[];
  integrations: Integration[];
  memberNotes: MemberNote[];
  automations: Automation[];
  automationRuns: AutomationRun[];
  counters: Record<string, number>;
  auditSeq: number;
}

export interface RunosStore {
  // members
  listMembers(filter?: MemberFilter): Member[];
  getMember(id: string): Member | undefined;
  createMember(input: CreateMemberInput): Member;
  updateMember(id: string, patch: UpdateMemberInput): Member | undefined;
  bulkMembers(input: BulkMemberInput): number;
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
  createChallenge(input: CreateChallengeInput): Challenge;
  listJourneys(): Journey[];
  createJourney(input: CreateJourneyInput): Journey;
  createSponsor(input: CreateSponsorInput): Sponsor;
  // member notes & messages
  listMemberNotes(memberId: string): MemberNote[];
  addMemberNote(memberId: string, kind: MemberNote['kind'], body: string): MemberNote | undefined;
  // platform — club settings, staff, integrations
  getClub(): Club;
  addChapter(name: string): Club;
  rotateApiKey(): Club;
  transferOwnership(email: string): Club;
  scheduleDeactivation(): Club;
  cancelDeactivation(): Club;
  exportData(): Record<string, unknown>;
  listStaff(): StaffMember[];
  inviteStaff(input: InviteStaffInput): StaffMember;
  listIntegrations(): Integration[];
  toggleIntegration(id: string): Integration | undefined;
  // automations — "if this then that" over real store events
  listAutomations(): Automation[];
  listAutomationRuns(): AutomationRun[];
  createAutomation(input: CreateAutomationInput): Automation;
  setAutomationEnabled(id: string, enabled: boolean): Automation | undefined;
  // analytics & audit
  metrics(): Metrics;
  listAudit(): AuditEntry[];
  recordAudit(action: string, entity: string): AuditEntry;
  // undo / time travel — snapshots taken automatically before every mutation
  listHistory(): HistoryEntry[];
  undo(): HistoryEntry | undefined;
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
    club: deepCopy(seedClub),
    staff: deepCopy(seedStaff),
    integrations: deepCopy(seedIntegrations),
    memberNotes: [],
    automations: deepCopy(seedAutomations),
    automationRuns: [],
    counters: {
      mem: seedMembers.length,
      evt: seedEvents.length,
      reg: seedRegistrations.length,
      pay: seedPayments.length,
      prx: 0,
      aud: 0,
      jrn: seedJourneys.length,
      chl: seedChallenges.length,
      spo: seedSponsors.length,
      stf: seedStaff.length,
      note: 0,
      atm: seedAutomations.length,
      run: 0,
    },
    auditSeq: 0,
  };

  function nextId(prefix: string): string {
    const n = (state.counters[prefix] ?? 0) + 1;
    state.counters[prefix] = n;
    return `${prefix}_${String(n).padStart(3, '0')}`;
  }

  // Undo / time travel: a snapshot of the whole state is pushed automatically
  // before every mutating method runs (see the wrapping loop below). Undo pops
  // the latest snapshot and restores it wholesale — trivially correct because
  // the store is one in-memory object; the Postgres swap replaces this with
  // an event-sourced log.
  const MAX_SNAPSHOTS = 25;
  const snapshots: { label: string; at: string; state: StoreState }[] = [];
  let historySeq = 0;

  function pushSnapshot(label: string): void {
    historySeq += 1;
    snapshots.push({
      label,
      at: new Date(TODAY.getTime() + (state.auditSeq + historySeq) * 1000).toISOString(),
      state: deepCopy(state),
    });
    if (snapshots.length > MAX_SNAPSHOTS) snapshots.shift();
  }

  function restoreSnapshot(snap: StoreState): void {
    state.members = snap.members;
    state.events = snap.events;
    state.registrations = snap.registrations;
    state.payments = snap.payments;
    state.sponsors = snap.sponsors;
    state.perks = snap.perks;
    state.challenges = snap.challenges;
    state.journeys = snap.journeys;
    state.weeklyMetrics = snap.weeklyMetrics;
    state.redemptions = snap.redemptions;
    state.auditLog = snap.auditLog;
    state.club = snap.club;
    state.staff = snap.staff;
    state.integrations = snap.integrations;
    state.memberNotes = snap.memberNotes;
    state.automations = snap.automations;
    state.automationRuns = snap.automationRuns;
    state.counters = snap.counters;
    state.auditSeq = snap.auditSeq;
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
    runAutomations(entry);
    return entry;
  }

  // -- automation engine ------------------------------------------------------
  // Fires enabled automations whose trigger matches a freshly recorded audit
  // action. Steps write to state directly (recording their own audit entries
  // for the activity feed) — the depth guard stops those entries from firing
  // further automations, so a receipt can never trigger a receipt.
  let automationDepth = 0;

  function resolveMemberId(entity: string): string | undefined {
    if (entity.startsWith('mem_')) return entity;
    if (entity.startsWith('pay_')) {
      return state.payments.find((p) => p.id === entity)?.memberId;
    }
    if (entity.startsWith('reg_')) {
      return state.registrations.find((r) => r.id === entity)?.memberId;
    }
    // waitlist audit entities look like "evt_001:mem_002"
    const composite = entity.split(':').find((part) => part.startsWith('mem_'));
    return composite;
  }

  function executeStep(step: AutomationStep, entry: AuditEntry, log: string[]): void {
    const memberId = resolveMemberId(entry.entity);
    const member = memberId ? state.members.find((m) => m.id === memberId) : undefined;
    switch (step.kind) {
      case 'send_receipt': {
        if (!member) return void log.push('Receipt skipped — no member on this event');
        const payment = entry.entity.startsWith('pay_')
          ? state.payments.find((p) => p.id === entry.entity)
          : undefined;
        const amount = payment ? `$${payment.amount.toFixed(2)}` : 'your payment';
        state.memberNotes.push({
          id: nextId('note'),
          memberId: member.id,
          kind: 'message',
          body: `Receipt: ${amount} received${payment ? ` for "${payment.description}"` : ''}. Thanks, ${member.name.split(' ')[0]}!`,
          at: new Date().toISOString(),
        });
        recordAudit('member.messaged', member.id);
        log.push(`Receipt sent to ${member.name}`);
        return;
      }
      case 'send_message': {
        if (!member) return void log.push('Message skipped — no member on this event');
        state.memberNotes.push({
          id: nextId('note'),
          memberId: member.id,
          kind: 'message',
          body: step.value ?? 'Hello from the club!',
          at: new Date().toISOString(),
        });
        recordAudit('member.messaged', member.id);
        log.push(`Message sent to ${member.name}`);
        return;
      }
      case 'add_tag': {
        if (!member || !step.value) return void log.push('Tag skipped');
        if (!member.tags.includes(step.value)) member.tags.push(step.value);
        recordAudit('member.updated', member.id);
        log.push(`Tagged ${member.name} "${step.value}"`);
        return;
      }
      case 'notify_staff': {
        recordAudit('staff.notified', entry.entity);
        log.push(`Staff notified: ${step.value ?? entry.action}`);
        return;
      }
      case 'enroll_journey': {
        const journey =
          state.journeys.find((j) => j.name.toLowerCase() === (step.value ?? '').toLowerCase()) ??
          state.journeys.find((j) => j.status === 'active');
        if (!journey) return void log.push('Journey skipped — none active');
        journey.enrolled += 1;
        recordAudit('journey.enrolled', journey.id);
        log.push(`Enrolled in "${journey.name}"`);
        return;
      }
      case 'update_leaderboard': {
        const challenge = state.challenges[0];
        if (!challenge || !member) return void log.push('Leaderboard skipped');
        const leader = challenge.leaders.find((l) => l.memberId === member.id);
        if (leader) leader.value += 1;
        else challenge.leaders.push({ memberId: member.id, value: 1 });
        recordAudit('challenge.updated', challenge.id);
        log.push(`Leaderboard bumped for ${member.name}`);
        return;
      }
    }
  }

  function runAutomations(entry: AuditEntry): void {
    if (automationDepth > 0) return;
    const matching = state.automations.filter((a) => a.enabled && a.trigger === entry.action);
    if (matching.length === 0) return;
    automationDepth += 1;
    try {
      for (const automation of matching) {
        const log: string[] = [];
        for (const step of automation.steps) executeStep(step, entry, log);
        automation.runs += 1;
        state.automationRuns.push({
          id: nextId('run'),
          automationId: automation.id,
          automationName: automation.name,
          triggeredBy: entry.entity,
          at: new Date(TODAY.getTime() + state.auditSeq * 1000).toISOString(),
          steps: log,
        });
        recordAudit('automation.ran', automation.id);
      }
    } finally {
      automationDepth -= 1;
    }
  }

  const store: RunosStore = {
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

    bulkMembers(input: BulkMemberInput): number {
      const targets = state.members.filter((m) => input.ids.includes(m.id));
      if (targets.length === 0) return 0;
      for (const member of targets) {
        switch (input.action) {
          case 'status':
            member.status = input.value as MemberStatus;
            break;
          case 'tier':
            member.tier = input.value as Member['tier'];
            break;
          case 'tag':
            if (!member.tags.includes(input.value)) member.tags.push(input.value);
            break;
          case 'message':
            state.memberNotes.push({
              id: nextId('note'),
              memberId: member.id,
              kind: 'message',
              body: input.value,
              at: new Date().toISOString(),
            });
            break;
        }
      }
      // One audit entry for the whole batch — the activity feed shows the
      // operation, not N near-identical rows.
      recordAudit(
        input.action === 'message' ? 'member.bulk_messaged' : 'member.bulk_updated',
        `${targets.length} members`,
      );
      return targets.length;
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

    createChallenge(input: CreateChallengeInput): Challenge {
      const id = nextId('chl');
      const challenge: Challenge = {
        id,
        name: input.name,
        metric: input.metric,
        target: input.target,
        unit: input.unit,
        endsAt: input.endsAt,
        participants: 0,
        leaders: [],
      };
      state.challenges.push(challenge);
      recordAudit('challenge.created', id);
      return challenge;
    },

    listJourneys(): Journey[] {
      return state.journeys;
    },

    createJourney(input: CreateJourneyInput): Journey {
      const id = nextId('jrn');
      const journey: Journey = {
        id,
        name: input.name,
        trigger: input.trigger,
        status: 'draft',
        steps: 1,
        enrolled: 0,
        completed: 0,
        conversionGoal: input.conversionGoal,
        conversionRate: 0,
      };
      state.journeys.push(journey);
      recordAudit('journey.created', id);
      return journey;
    },

    createSponsor(input: CreateSponsorInput): Sponsor {
      const id = nextId('spo');
      const sponsor: Sponsor = {
        id,
        name: input.name,
        industry: input.industry,
        contact: input.contact,
        stage: 'lead',
        dealValue: input.dealValue,
        nextStep: 'Qualify audience fit',
        lastTouch: new Date().toISOString(),
        logoHue: (input.name.charCodeAt(0) * 37) % 360,
      };
      state.sponsors.push(sponsor);
      recordAudit('sponsor.created', id);
      return sponsor;
    },

    // -- member notes & messages ------------------------------------------------
    listMemberNotes(memberId: string): MemberNote[] {
      return state.memberNotes
        .filter((n) => n.memberId === memberId)
        .sort((a, b) => b.at.localeCompare(a.at));
    },

    addMemberNote(memberId: string, kind: MemberNote['kind'], body: string): MemberNote | undefined {
      const member = state.members.find((m) => m.id === memberId);
      if (!member) return undefined;
      const note: MemberNote = {
        id: nextId('note'),
        memberId,
        kind,
        body,
        at: new Date().toISOString(),
      };
      state.memberNotes.push(note);
      recordAudit(kind === 'note' ? 'member.note_added' : 'member.messaged', memberId);
      return note;
    },

    // -- platform: club settings, staff, integrations ----------------------------
    getClub(): Club {
      return state.club;
    },

    addChapter(name: string): Club {
      state.club.chapters.push(name);
      recordAudit('club.chapter_added', state.club.id);
      return state.club;
    },

    rotateApiKey(): Club {
      const suffix = Math.random().toString(36).slice(2, 10);
      state.club.apiKey = `ros_live_${suffix}`;
      recordAudit('club.api_key_rotated', state.club.id);
      return state.club;
    },

    transferOwnership(email: string): Club {
      const previousOwner = state.staff.find((s) => s.roles.includes('Owner'));
      if (previousOwner) {
        previousOwner.roles = previousOwner.roles.filter((r) => r !== 'Owner').concat('Organizer');
      }
      let newOwner = state.staff.find((s) => s.email.toLowerCase() === email.toLowerCase());
      if (newOwner) {
        if (!newOwner.roles.includes('Owner')) newOwner.roles = ['Owner', ...newOwner.roles];
      } else {
        newOwner = {
          id: nextId('stf'),
          name: email.split('@')[0],
          email,
          roles: ['Owner'],
          color: AVATAR_COLORS[state.staff.length % AVATAR_COLORS.length],
          lastActive: 'just now',
          status: 'invited',
        };
        state.staff.push(newOwner);
      }
      state.club.ownerEmail = email;
      recordAudit('club.ownership_transferred', state.club.id);
      return state.club;
    },

    scheduleDeactivation(): Club {
      const d = new Date(TODAY.getTime() + state.auditSeq * 1000);
      d.setUTCDate(d.getUTCDate() + 30);
      state.club.status = 'pending_deletion';
      state.club.deletionScheduledAt = d.toISOString();
      recordAudit('club.deactivation_scheduled', state.club.id);
      return state.club;
    },

    cancelDeactivation(): Club {
      state.club.status = 'active';
      state.club.deletionScheduledAt = null;
      recordAudit('club.deactivation_cancelled', state.club.id);
      return state.club;
    },

    exportData(): Record<string, unknown> {
      recordAudit('club.data_exported', state.club.id);
      return {
        club: state.club,
        members: state.members,
        events: state.events,
        registrations: state.registrations,
        payments: state.payments,
        sponsors: state.sponsors,
        exportedAt: new Date().toISOString(),
      };
    },

    listStaff(): StaffMember[] {
      return state.staff;
    },

    inviteStaff(input: InviteStaffInput): StaffMember {
      const member: StaffMember = {
        id: nextId('stf'),
        name: input.name,
        email: input.email,
        roles: input.roles.length > 0 ? input.roles : ['Organizer'],
        color: AVATAR_COLORS[state.staff.length % AVATAR_COLORS.length],
        lastActive: 'invited',
        status: 'invited',
      };
      state.staff.push(member);
      recordAudit('staff.invited', member.id);
      return member;
    },

    listIntegrations(): Integration[] {
      return state.integrations;
    },

    toggleIntegration(id: string): Integration | undefined {
      const integration = state.integrations.find((i) => i.id === id);
      if (!integration) return undefined;
      integration.connected = !integration.connected;
      recordAudit(integration.connected ? 'integration.connected' : 'integration.disconnected', id);
      return integration;
    },

    // -- automations ------------------------------------------------------------
    listAutomations(): Automation[] {
      return state.automations;
    },

    listAutomationRuns(): AutomationRun[] {
      return [...state.automationRuns].reverse();
    },

    createAutomation(input: CreateAutomationInput): Automation {
      const automation: Automation = {
        id: nextId('atm'),
        name: input.name,
        trigger: input.trigger,
        steps: input.steps,
        enabled: true,
        runs: 0,
      };
      state.automations.push(automation);
      recordAudit('automation.created', automation.id);
      return automation;
    },

    setAutomationEnabled(id: string, enabled: boolean): Automation | undefined {
      const automation = state.automations.find((a) => a.id === id);
      if (!automation) return undefined;
      automation.enabled = enabled;
      recordAudit(enabled ? 'automation.enabled' : 'automation.disabled', id);
      return automation;
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

    listHistory(): HistoryEntry[] {
      return snapshots
        .map((s, i) => ({ seq: i + 1, label: s.label, at: s.at }))
        .reverse();
    },

    undo(): HistoryEntry | undefined {
      const snap = snapshots.pop();
      if (!snap) return undefined;
      restoreSnapshot(snap.state);
      return { seq: snapshots.length + 1, label: snap.label, at: snap.at };
    },
  };

  // Wrap every mutating method: snapshot before it runs, then discard the
  // snapshot if the call turned out to be a no-op (no audit entry recorded —
  // every successful mutation records one, so unchanged auditSeq ⇒ unchanged
  // state). Reads and the undo machinery itself stay unwrapped.
  const MUTATION_LABELS: Partial<Record<keyof RunosStore, string>> = {
    createMember: 'Member added',
    updateMember: 'Member updated',
    createEvent: 'Event created',
    updateEvent: 'Event updated',
    createRegistration: 'Registration added',
    checkIn: 'Check-in recorded',
    createPayment: 'Payment recorded',
    updateSponsorStage: 'Sponsor stage changed',
    redeemPerk: 'Perk redeemed',
    createChallenge: 'Challenge launched',
    createJourney: 'Journey created',
    createSponsor: 'Sponsor added',
    addMemberNote: 'Note logged',
    addChapter: 'Chapter added',
    rotateApiKey: 'API key rotated',
    transferOwnership: 'Ownership transferred',
    scheduleDeactivation: 'Club deactivation scheduled',
    cancelDeactivation: 'Club deactivation cancelled',
    inviteStaff: 'Staff invited',
    toggleIntegration: 'Integration toggled',
    bulkMembers: 'Bulk member action',
    createAutomation: 'Automation created',
    setAutomationEnabled: 'Automation toggled',
  };
  for (const [name, label] of Object.entries(MUTATION_LABELS) as [keyof RunosStore, string][]) {
    const original = store[name] as (...args: unknown[]) => unknown;
    (store as unknown as Record<string, unknown>)[name] = (...args: unknown[]) => {
      const seqBefore = state.auditSeq;
      pushSnapshot(label);
      const result = original(...args);
      if (state.auditSeq === seqBefore) snapshots.pop();
      return result;
    };
  }

  return store;
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

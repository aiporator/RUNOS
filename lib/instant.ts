// INSTANT EVENTS — the Luma-style micro-wedge. Anyone creates an event in 60
// seconds, no account needed. Events with capacity ≤ FREE_CAPACITY are free
// forever; larger events are allowed in the demo but flagged requiresUpgrade.
// Store lives on globalThis (same pattern as lib/store.ts) so it survives
// Next.js dev hot-reloads. Swap for the `instant_events` tables when going live.
import type { VerticalId } from './verticals';

// ---------------------------------------------------------------------------
// Constants & types
// ---------------------------------------------------------------------------

/** Events with capacity ≤ 20 are free forever. */
export const FREE_CAPACITY = 20;

export interface InstantEvent {
  id: string;
  title: string;
  hostName: string;
  vertical: VerticalId;
  type: string;
  date: string; // ISO datetime
  location: string;
  capacity: number;
  price: number;
  description: string;
  manageKey: string;
  createdAt: string;
}

export type InstantRsvpStatus = 'confirmed' | 'waitlist';

export interface InstantRsvp {
  id: string;
  eventId: string;
  name: string;
  email: string;
  status: InstantRsvpStatus;
  checkedIn: boolean;
  createdAt: string;
}

export interface CreateInstantEventInput {
  title: string;
  hostName?: string;
  vertical?: VerticalId;
  type?: string;
  date: string;
  location?: string;
  capacity: number;
  price?: number;
  description?: string;
}

export interface InstantStats {
  capacity: number;
  confirmed: number;
  waitlist: number;
  spotsLeft: number;
  checkedIn: number;
}

export type AddRsvpResult =
  | { kind: 'created'; rsvp: InstantRsvp }
  | { kind: 'already_registered'; rsvp: InstantRsvp }
  | { kind: 'event_not_found' };

/** Capacity above the free tier — allowed in the demo, flagged in responses. */
export function requiresUpgrade(event: Pick<InstantEvent, 'capacity'>): boolean {
  return event.capacity > FREE_CAPACITY;
}

// ---------------------------------------------------------------------------
// Ids — deterministic, no Date.now()/Math.random() at module scope.
// base36 counter + a "random-ish" suffix derived from the counter (LCG step).
// ---------------------------------------------------------------------------

function counterSuffix(n: number): string {
  return ((n * 48271 + 12345) % 46656).toString(36).padStart(3, '0');
}

function reverse(s: string): string {
  return s.split('').reverse().join('');
}

/** manageKey = 'mk_' + reversed event id. */
export function manageKeyFor(id: string): string {
  return `mk_${reverse(id)}`;
}

// ---------------------------------------------------------------------------
// Seed — one example instant event so the pages always have something to show.
// ---------------------------------------------------------------------------

const SEED_EVENT: InstantEvent = {
  id: 'ie_demo1',
  title: 'Intro to Ceramics — Saturday Session',
  hostName: 'Mara Lindqvist',
  vertical: 'workshop',
  type: 'workshop',
  date: '2026-07-11T10:00:00.000Z',
  location: 'Clay & Fire Studio, Dockside 14',
  capacity: 12,
  price: 0,
  description:
    'Three hours at the wheel — wedging, centering, and your first thrown bowl. Materials, aprons, and firing included. Zero experience needed; come with clean hands and low expectations, leave with a bowl.',
  manageKey: manageKeyFor('ie_demo1'),
  createdAt: '2026-07-01T09:00:00.000Z',
};

const SEED_RSVPS: InstantRsvp[] = [
  { id: 'ir_demo1', eventId: 'ie_demo1', name: 'Jonas Weber', email: 'jonas@example.com', status: 'confirmed', checkedIn: false, createdAt: '2026-07-01T10:12:00.000Z' },
  { id: 'ir_demo2', eventId: 'ie_demo1', name: 'Priya Nair', email: 'priya@example.com', status: 'confirmed', checkedIn: false, createdAt: '2026-07-01T11:40:00.000Z' },
  { id: 'ir_demo3', eventId: 'ie_demo1', name: 'Sam Okafor', email: 'sam@example.com', status: 'confirmed', checkedIn: false, createdAt: '2026-07-01T14:05:00.000Z' },
  { id: 'ir_demo4', eventId: 'ie_demo1', name: 'Elin Sørensen', email: 'elin@example.com', status: 'confirmed', checkedIn: false, createdAt: '2026-07-02T08:22:00.000Z' },
  { id: 'ir_demo5', eventId: 'ie_demo1', name: 'Tomás Rivera', email: 'tomas@example.com', status: 'confirmed', checkedIn: false, createdAt: '2026-07-02T19:47:00.000Z' },
];

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface InstantStoreState {
  events: InstantEvent[];
  rsvps: InstantRsvp[];
  eventSeq: number;
  rsvpSeq: number;
}

function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const globalWithInstant = globalThis as typeof globalThis & {
  __runosInstantStore?: InstantStoreState;
};

function getState(): InstantStoreState {
  globalWithInstant.__runosInstantStore ??= {
    events: [deepCopy(SEED_EVENT)],
    rsvps: deepCopy(SEED_RSVPS),
    eventSeq: 0,
    rsvpSeq: 0,
  };
  return globalWithInstant.__runosInstantStore;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function createInstantEvent(input: CreateInstantEventInput): InstantEvent {
  const state = getState();
  state.eventSeq += 1;
  const id = `ie_${state.eventSeq.toString(36)}${counterSuffix(state.eventSeq)}`;
  const event: InstantEvent = {
    id,
    title: input.title,
    hostName: input.hostName?.trim() || 'An anonymous host',
    vertical: input.vertical ?? 'community',
    type: input.type ?? 'meetup',
    date: input.date,
    location: input.location?.trim() || 'Location shared with attendees',
    capacity: input.capacity,
    price: input.price ?? 0,
    description: input.description ?? '',
    manageKey: manageKeyFor(id),
    createdAt: new Date().toISOString(),
  };
  state.events.push(event);
  return event;
}

export function getInstantEvent(id: string): InstantEvent | undefined {
  return getState().events.find((e) => e.id === id);
}

export function listRsvps(eventId: string): InstantRsvp[] {
  return getState().rsvps.filter((r) => r.eventId === eventId);
}

export function addRsvp(eventId: string, name: string, email: string): AddRsvpResult {
  const state = getState();
  const event = state.events.find((e) => e.id === eventId);
  if (!event) return { kind: 'event_not_found' };
  const normalized = email.trim().toLowerCase();
  const existing = state.rsvps.find(
    (r) => r.eventId === eventId && r.email.toLowerCase() === normalized,
  );
  if (existing) return { kind: 'already_registered', rsvp: existing };
  const confirmed = state.rsvps.filter(
    (r) => r.eventId === eventId && r.status === 'confirmed',
  ).length;
  state.rsvpSeq += 1;
  const rsvp: InstantRsvp = {
    id: `ir_${state.rsvpSeq.toString(36)}${counterSuffix(state.rsvpSeq)}`,
    eventId,
    name: name.trim(),
    email: normalized,
    status: confirmed < event.capacity ? 'confirmed' : 'waitlist',
    checkedIn: false,
    createdAt: new Date().toISOString(),
  };
  state.rsvps.push(rsvp);
  return { kind: 'created', rsvp };
}

export function toggleCheckin(rsvpId: string): InstantRsvp | undefined {
  const rsvp = getState().rsvps.find((r) => r.id === rsvpId);
  if (!rsvp) return undefined;
  rsvp.checkedIn = !rsvp.checkedIn;
  return rsvp;
}

export function stats(eventId: string): InstantStats | undefined {
  const event = getInstantEvent(eventId);
  if (!event) return undefined;
  const rsvps = listRsvps(eventId);
  const confirmed = rsvps.filter((r) => r.status === 'confirmed').length;
  return {
    capacity: event.capacity,
    confirmed,
    waitlist: rsvps.filter((r) => r.status === 'waitlist').length,
    spotsLeft: Math.max(0, event.capacity - confirmed),
    checkedIn: rsvps.filter((r) => r.checkedIn).length,
  };
}

// ---------------------------------------------------------------------------
// Caption generator — lib/social's generatePosts() is hard-typed to the
// running-club ClubEvent (route, distance, weather), so instant events get
// their own small IG-style caption. Pure over plain fields, safe client-side.
// ---------------------------------------------------------------------------

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface CaptionEvent {
  title: string;
  hostName: string;
  date: string;
  location: string;
  capacity: number;
  price: number;
  vertical: string;
}

export function generateInstantCaption(event: CaptionEvent, url: string): string {
  const d = new Date(event.date);
  const when = `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}, ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
  const priceLine = event.price === 0 ? 'Free to join' : `€${event.price} per spot`;
  return [
    `${event.title} ✨`,
    '',
    `🗓 ${when}`,
    `📍 ${event.location}`,
    `🎟 ${priceLine} · only ${event.capacity} spots`,
    '',
    `Hosted by ${event.hostName}. Grab your spot before it fills up 👇`,
    url,
    '',
    `#${event.vertical.replace(/-/g, '')} #community #instantevent`,
  ].join('\n');
}

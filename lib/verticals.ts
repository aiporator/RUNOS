// Vertical system — one OS, many kinds of communities.
// The wizard, public pages, and marketing pages all read from this config.

export type VerticalId = 'running-club' | 'gym' | 'fitness-studio' | 'workshop' | 'community';

export interface EventTypeDef {
  id: string;
  label: string;
  tone: 'volt' | 'info' | 'warn' | 'ok' | 'muted';
}

export interface Vertical {
  id: VerticalId;
  label: string;
  headline: string;
  sub: string;
  nouns: {
    org: string;      // "club", "gym", "studio", ...
    member: string;   // "member", "athlete", "attendee", ...
    event: string;    // "run", "class", "workshop", "session", ...
    organizer: string;
  };
  eventTypes: EventTypeDef[];
  sampleEvents: { title: string; type: string; blurb: string }[];
  calendarFirst: boolean; // workshops/gyms live in the calendar view
  perksExamples: string[];
}

export const VERTICALS: Vertical[] = [
  {
    id: 'running-club',
    label: 'Running club',
    headline: 'Run the club. Not the chaos.',
    sub: 'Members, runs, dues, sponsors, and an AI that plans your month — one login.',
    nouns: { org: 'club', member: 'member', event: 'run', organizer: 'organizer' },
    eventTypes: [
      { id: 'long-run', label: 'Long run', tone: 'volt' },
      { id: 'tempo', label: 'Tempo', tone: 'info' },
      { id: 'track', label: 'Track', tone: 'info' },
      { id: 'trail', label: 'Trail', tone: 'ok' },
      { id: 'race', label: 'Race', tone: 'warn' },
      { id: 'social', label: 'Social', tone: 'muted' },
    ],
    sampleEvents: [
      { title: 'Saturday Long Run', type: 'long-run', blurb: 'Weekly long run with pace groups and coffee after.' },
      { title: 'Track Tuesday', type: 'track', blurb: 'Interval session on the track — all paces welcome.' },
    ],
    calendarFirst: false,
    perksExamples: ['Coffee discounts', 'Running store perks', 'Physio intake deals'],
  },
  {
    id: 'gym',
    label: 'Gym',
    headline: 'Run the gym floor, not the spreadsheet.',
    sub: 'Classes, memberships, waivers, check-ins, and win-back automations — one system.',
    nouns: { org: 'gym', member: 'member', event: 'class', organizer: 'coach' },
    eventTypes: [
      { id: 'strength', label: 'Strength', tone: 'volt' },
      { id: 'hiit', label: 'HIIT', tone: 'warn' },
      { id: 'mobility', label: 'Mobility', tone: 'ok' },
      { id: 'open-gym', label: 'Open gym', tone: 'muted' },
      { id: 'pt', label: 'Personal training', tone: 'info' },
    ],
    sampleEvents: [
      { title: 'Morning Strength — 07:00', type: 'strength', blurb: 'Coached barbell session, 12 spots.' },
      { title: 'Lunch HIIT Express', type: 'hiit', blurb: '30 minutes, in and out. QR check-in at the door.' },
    ],
    calendarFirst: true,
    perksExamples: ['Supplement partner deals', 'Physio & recovery discounts', 'Member guest passes'],
  },
  {
    id: 'fitness-studio',
    label: 'Fitness studio',
    headline: 'Fill every class. Know every regular.',
    sub: 'Class calendar, packs & memberships, waitlists, and automations that fill quiet slots.',
    nouns: { org: 'studio', member: 'client', event: 'class', organizer: 'instructor' },
    eventTypes: [
      { id: 'yoga', label: 'Yoga', tone: 'ok' },
      { id: 'pilates', label: 'Pilates', tone: 'info' },
      { id: 'spin', label: 'Spin', tone: 'warn' },
      { id: 'barre', label: 'Barre', tone: 'volt' },
      { id: 'workshop', label: 'Workshop', tone: 'muted' },
    ],
    sampleEvents: [
      { title: 'Vinyasa Flow — evening', type: 'yoga', blurb: 'All levels, mats provided. 18 spots.' },
      { title: 'Reformer Intro Workshop', type: 'workshop', blurb: 'Beginner-friendly intro, small group.' },
    ],
    calendarFirst: true,
    perksExamples: ['Athleisure partner discounts', 'Nutrition consults', 'Bring-a-friend passes'],
  },
  {
    id: 'workshop',
    label: 'Workshops & courses',
    headline: 'Publish a workshop. Fill the room. Repeat.',
    sub: 'Calendar-first scheduling, ticketing, waitlists, reminders, and social promotion — automated.',
    nouns: { org: 'organizer', member: 'attendee', event: 'workshop', organizer: 'host' },
    eventTypes: [
      { id: 'workshop', label: 'Workshop', tone: 'volt' },
      { id: 'course', label: 'Course series', tone: 'info' },
      { id: 'masterclass', label: 'Masterclass', tone: 'warn' },
      { id: 'meetup', label: 'Meetup', tone: 'ok' },
      { id: 'online', label: 'Online session', tone: 'muted' },
    ],
    sampleEvents: [
      { title: 'Intro to Ceramics — Saturday', type: 'workshop', blurb: '3 hours, materials included, 10 seats.' },
      { title: 'Photography Masterclass', type: 'masterclass', blurb: 'Golden-hour city shoot + edit session.' },
    ],
    calendarFirst: true,
    perksExamples: ['Material kits', 'Alumni discounts', 'Partner venue deals'],
  },
  {
    id: 'community',
    label: 'Community & meetups',
    headline: 'Your community, professionally run.',
    sub: 'Events, members, volunteers, sponsors, and growth loops for any community that meets.',
    nouns: { org: 'community', member: 'member', event: 'event', organizer: 'organizer' },
    eventTypes: [
      { id: 'meetup', label: 'Meetup', tone: 'volt' },
      { id: 'talk', label: 'Talk', tone: 'info' },
      { id: 'social', label: 'Social', tone: 'ok' },
      { id: 'volunteer', label: 'Volunteer day', tone: 'warn' },
      { id: 'online', label: 'Online', tone: 'muted' },
    ],
    sampleEvents: [
      { title: 'Monthly Meetup', type: 'meetup', blurb: 'Talks, demos, and pizza. Doors 18:30.' },
      { title: 'City Cleanup Volunteer Day', type: 'volunteer', blurb: 'Gloves and bags provided. Families welcome.' },
    ],
    calendarFirst: false,
    perksExamples: ['Local business perks', 'Co-working passes', 'Event space discounts'],
  },
];

export function getVertical(id: string): Vertical {
  return VERTICALS.find((v) => v.id === id) ?? VERTICALS[0];
}

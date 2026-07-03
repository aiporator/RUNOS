// Deterministic seed data for the demo club "Harbor City Runners".
// All dates are relative to a fixed "today" so the demo always looks live.
import type {
  ActivityItem, Challenge, Club, ClubEvent, Journey, Member, MembershipPlan,
  Payment, Perk, Registration, Sponsor, Vendor, WeeklyMetric,
} from './types';

export const TODAY = new Date('2026-07-02T08:00:00Z');

function daysFrom(days: number, hour = 8): string {
  const d = new Date(TODAY);
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(hour, 0, 0, 0);
  return d.toISOString();
}

// Small deterministic PRNG so numbers look organic but never change.
let seedState = 42;
function rnd(): number {
  seedState = (seedState * 16807) % 2147483647;
  return (seedState - 1) / 2147483646;
}
function between(min: number, max: number): number {
  return min + rnd() * (max - min);
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rnd() * arr.length)];
}

export const club: Club = {
  id: 'club_hcr',
  name: 'Harbor City Runners',
  slug: 'harbor-city-runners',
  city: 'Amsterdam',
  founded: '2021-03-14',
  memberCount: 48,
  plan: 'pro',
  chapters: ['Harbor City — Central', 'Harbor City — North'],
};

const firstNames = ['Maya', 'Leo', 'Priya', 'Emre', 'Sofia', 'Jonas', 'Amara', 'Tomas', 'Ines', 'Ravi', 'Freya', 'Marco', 'Yuki', 'Nadia', 'Owen', 'Lena', 'Kofi', 'Elif', 'Bram', 'Zoe', 'Hugo', 'Alba', 'Niko', 'Sara', 'Femke', 'Diego', 'Anouk', 'Mateo', 'Livia', 'Casper', 'Noor', 'Ilya', 'Greta', 'Sam', 'Dara', 'Rosa', 'Finn', 'Aiko', 'Jules', 'Mira', 'Otis', 'Vera', 'Karl', 'Tessa', 'Omar', 'Ida', 'Ben', 'Luna'];
const lastNames = ['Okafor', 'Martins', 'Sharma', 'Kaya', 'Lindqvist', 'Visser', 'Ndiaye', 'Novak', 'Costa', 'Patel', 'Berg', 'Ricci', 'Tanaka', 'Haddad', 'Doyle', 'Fischer', 'Mensah', 'Demir', 'de Vries', 'Klein', 'Moreau', 'Serra', 'Laine', 'Haas', 'Bakker', 'Vega', 'Smit', 'Rojas', 'Conti', 'Jansen', 'Aziz', 'Petrov', 'Weber', 'Brook', 'Behan', 'Marin', 'Kelly', 'Mori', 'Blanc', 'Rao', 'Green', 'Lang', 'Voss', 'Peeters', 'Farsi', 'Holm', 'Carter', 'Reyes'];
const avatarColors = ['#cdfb50', '#7db8ff', '#ff9d7a', '#b78bff', '#7ee081', '#ffc94d', '#ff8ab8', '#71e0d4'];
const appPool = ['Strava', 'Garmin', 'Apple Health', 'COROS', 'Polar', 'Fitbit'];

export const members: Member[] = firstNames.map((fn, i) => {
  const joinedDaysAgo = Math.floor(between(20, 900));
  const attendanceRate = between(0.1, 0.95);
  const lastSeenDays = attendanceRate > 0.5 ? Math.floor(between(0, 9)) : Math.floor(between(7, 60));
  const churnRisk = Math.min(0.97, Math.max(0.02, (lastSeenDays / 45) * (1.15 - attendanceRate)));
  const status = joinedDaysAgo < 45 ? 'new' : churnRisk > 0.55 ? 'at-risk' : lastSeenDays > 42 ? 'lapsed' : 'active';
  const roles: Member['roles'] = ['member'];
  if (i === 0) roles.push('organizer');
  if (i === 2) roles.push('organizer', 'coach');
  if ([1, 7, 12, 19].includes(i)) roles.push('ambassador');
  if ([4, 9, 15, 22, 30].includes(i)) roles.push('volunteer');
  const eventsAttended = Math.floor(attendanceRate * (joinedDaysAgo / 7) * 0.8);
  return {
    id: `mem_${String(i + 1).padStart(3, '0')}`,
    name: `${fn} ${lastNames[i]}`,
    email: `${fn.toLowerCase()}.${lastNames[i].toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
    joinedAt: daysFrom(-joinedDaysAgo),
    status,
    roles,
    tier: i % 5 === 0 ? 'free' : i % 3 === 0 ? 'annual' : 'monthly',
    city: i % 6 === 0 ? 'Harbor City — North' : 'Harbor City — Central',
    avatarColor: avatarColors[i % avatarColors.length],
    weeklyKm: Math.round(between(8, 72)),
    attendanceRate: Math.round(attendanceRate * 100) / 100,
    eventsAttended,
    lastSeen: daysFrom(-lastSeenDays),
    churnRisk: Math.round(churnRisk * 100) / 100,
    communityScore: Math.round(30 + attendanceRate * 55 + (roles.length > 1 ? 10 : 0)),
    ltv: Math.round(between(40, 1400)),
    consents: (['profile.basic', 'activity.summary'] as Member['consents']).concat(
      rnd() > 0.35 ? ['activity.detailed'] : [],
      rnd() > 0.6 ? ['photos.appearances'] : [],
      rnd() > 0.75 ? ['marketing.brands'] : [],
      rnd() > 0.8 ? ['health.medical'] : [],
    ),
    connectedApps: [pick(appPool), ...(rnd() > 0.5 ? [pick(appPool)] : [])].filter((v, ix, a) => a.indexOf(v) === ix),
    prs: [
      { distance: '5K', time: `${Math.floor(between(17, 29))}:${String(Math.floor(between(10, 59))).padStart(2, '0')}` },
      { distance: '10K', time: `${Math.floor(between(37, 62))}:${String(Math.floor(between(10, 59))).padStart(2, '0')}` },
    ],
    volunteerHours: roles.includes('volunteer') ? Math.floor(between(6, 40)) : 0,
    tags: status === 'new' ? ['first-timer-followup'] : attendanceRate > 0.8 ? ['streak-holder'] : [],
  };
});

export const events: ClubEvent[] = [
  {
    id: 'evt_001', title: 'Saturday Long Run — Harbor Loop', type: 'long-run', status: 'published',
    date: daysFrom(2, 7), location: 'Harbor Gate, East Entrance', routeName: 'Harbor Loop 16K',
    distanceKm: 16, capacity: 90, registered: 64, checkedIn: 0, waitlist: 0, price: 0,
    pacers: ['Priya Sharma', 'Jonas Visser', 'Amara Ndiaye'], volunteers: ['Sofia Lindqvist', 'Ravi Patel'],
    weather: '16°C, light breeze', predictedAttendance: [58, 71],
    description: 'Classic Saturday long run. Three pace groups: 5:00, 5:45, 6:30 /km. Coffee after at Dock 7.',
  },
  {
    id: 'evt_002', title: 'Track Tuesday — 400m Repeats', type: 'track', status: 'published',
    date: daysFrom(5, 18), location: 'Olympia Track, Lane 1–4', routeName: 'Track — 8×400m',
    distanceKm: 8, capacity: 40, registered: 31, checkedIn: 0, waitlist: 0, price: 0,
    pacers: ['Priya Sharma'], volunteers: ['Owen Doyle'], weather: '19°C, clear',
    predictedAttendance: [26, 33],
    description: '8×400m at 5K effort, 90s recovery. Coach Priya leads. All paces welcome.',
  },
  {
    id: 'evt_003', title: '10K Time Trial + Summer Social', type: 'race', status: 'published',
    date: daysFrom(16, 9), location: 'Riverside Start Arch', routeName: 'Riverside Out-and-Back 10K',
    distanceKm: 10, capacity: 120, registered: 87, checkedIn: 0, waitlist: 6, price: 8,
    pacers: ['Jonas Visser', 'Freya Berg', 'Marco Ricci'], volunteers: ['Ravi Patel', 'Lena Fischer', 'Kofi Mensah'],
    weather: 'Forecast pending', predictedAttendance: [78, 96],
    description: 'Chip-timed 10K TT followed by the summer social. Ticket includes timing, photos, and first drink.',
  },
  {
    id: 'evt_004', title: 'Trail Sunday — Dune Crossing', type: 'trail', status: 'draft',
    date: daysFrom(23, 8), location: 'Dune Park, North Lot', routeName: 'Dune Crossing 21K',
    distanceKm: 21, capacity: 35, registered: 0, checkedIn: 0, waitlist: 0, price: 5,
    pacers: [], volunteers: [], weather: '—',
    description: 'Draft: technical trail half. Needs pacers and a sweep. Pacer sign-up open in app.',
  },
  {
    id: 'evt_005', title: 'Saturday Long Run — Canal Ring', type: 'long-run', status: 'completed',
    date: daysFrom(-5, 7), location: 'Canal Ring, Bridge 9', routeName: 'Canal Ring 14K',
    distanceKm: 14, capacity: 90, registered: 71, checkedIn: 63, waitlist: 0, price: 0,
    pacers: ['Priya Sharma', 'Marco Ricci'], volunteers: ['Sofia Lindqvist'], weather: '14°C, drizzle',
    description: 'Completed. 63 of 71 checked in (89%). Recap and gallery published.',
  },
  {
    id: 'evt_006', title: 'Track Tuesday — Ladder Session', type: 'track', status: 'completed',
    date: daysFrom(-9, 18), location: 'Olympia Track', routeName: 'Track — Ladder',
    distanceKm: 7, capacity: 40, registered: 29, checkedIn: 24, waitlist: 0, price: 0,
    pacers: ['Priya Sharma'], volunteers: [], weather: '17°C',
    description: 'Completed. 24 of 29 checked in (83%).',
  },
  {
    id: 'evt_007', title: 'New Member Welcome Run — 5K', type: 'social', status: 'completed',
    date: daysFrom(-12, 18), location: 'Clubhouse, Dock 7', routeName: 'Easy 5K Social',
    distanceKm: 5, capacity: 50, registered: 38, checkedIn: 35, waitlist: 0, price: 0,
    pacers: ['Amara Ndiaye'], volunteers: ['Ravi Patel', 'Owen Doyle'], weather: '18°C',
    description: 'Completed. 12 first-timers. Welcome journey enrolled all of them automatically.',
  },
];

export const registrations: Registration[] = members.slice(0, 40).map((m, i) => ({
  id: `reg_${String(i + 1).padStart(3, '0')}`,
  eventId: 'evt_001',
  memberId: m.id,
  registeredAt: daysFrom(-Math.floor(between(1, 6))),
  checkedInAt: null,
  waiverSigned: i % 7 !== 3,
}));

export const membershipPlans: MembershipPlan[] = [
  { id: 'plan_monthly', name: 'Club Membership — Monthly', price: 12, interval: 'month', members: 26, perks: ['All weekly runs', 'Benefits passport', 'Member feed'] },
  { id: 'plan_annual', name: 'Club Membership — Annual', price: 120, interval: 'year', members: 13, perks: ['Everything monthly', '2 months free', 'Race-entry priority', 'Kit discount'] },
];

const paymentDescriptions: Record<string, string[]> = {
  membership: ['Club Membership — Monthly', 'Club Membership — Annual'],
  ticket: ['10K Time Trial ticket', 'Trail Sunday ticket'],
  merch: ['Club singlet 2026', 'Harbor cap', 'Winter buff'],
  marketplace: ['Physio intake — Dr. Kaya', 'Gait analysis — StrideLab', 'Sports massage 45min'],
};

export const payments: Payment[] = Array.from({ length: 42 }, (_, i) => {
  const kind = (['membership', 'membership', 'membership', 'ticket', 'merch', 'marketplace'] as const)[i % 6];
  const desc = pick(paymentDescriptions[kind]);
  const amount = kind === 'membership' ? (desc.includes('Annual') ? 120 : 12) : kind === 'ticket' ? 8 : Math.round(between(18, 85));
  const status = i % 13 === 7 ? 'failed' : i % 17 === 11 ? 'pending' : 'succeeded';
  return {
    id: `pay_${String(i + 1).padStart(3, '0')}`,
    memberId: members[Math.floor(between(0, members.length - 1))].id,
    kind, description: desc, amount,
    fee: Math.round(amount * 0.005 * 100) / 100,
    status,
    date: daysFrom(-Math.floor(between(0, 30))),
  };
});

export const sponsors: Sponsor[] = [
  { id: 'spo_1', name: 'StrideLab Running Store', industry: 'Retail', contact: 'Sofia Lindqvist', stage: 'active', dealValue: 6000, nextStep: 'Q3 demo-shoe Saturday activation', lastTouch: daysFrom(-3), logoHue: 82 },
  { id: 'spo_2', name: 'Dock 7 Coffee', industry: 'Hospitality', contact: 'Bram de Vries', stage: 'active', dealValue: 1800, nextStep: 'Renew perk: 20% post-run coffee', lastTouch: daysFrom(-8), logoHue: 28 },
  { id: 'spo_3', name: 'Northshore Physio', industry: 'Health', contact: 'Dr. Emre Kaya', stage: 'renewal', dealValue: 3600, nextStep: 'Send Q2 redemption report', lastTouch: daysFrom(-12), logoHue: 200 },
  { id: 'spo_4', name: 'Velo Hotel Group', industry: 'Travel', contact: 'Ines Costa', stage: 'proposal', dealValue: 9000, nextStep: 'Pacer drafted proposal — review & send', lastTouch: daysFrom(-2), logoHue: 260 },
  { id: 'spo_5', name: 'Apex Sportswear', industry: 'Apparel', contact: 'Nadia Haddad', stage: 'negotiation', dealValue: 15000, nextStep: 'Counter on kit exclusivity clause', lastTouch: daysFrom(-1), logoHue: 340 },
  { id: 'spo_6', name: 'CityFuel Nutrition', industry: 'Nutrition', contact: 'Marco Ricci', stage: 'contacted', dealValue: 4000, nextStep: 'Intro call Thursday', lastTouch: daysFrom(-4), logoHue: 130 },
  { id: 'spo_7', name: 'Harbor Insurance', industry: 'Insurance', contact: 'Freya Berg', stage: 'lead', dealValue: 7500, nextStep: 'Qualify: audience fit 78%', lastTouch: daysFrom(-15), logoHue: 180 },
];

export const perks: Perk[] = [
  { id: 'perk_1', partner: 'Dock 7 Coffee', category: 'Coffee', offer: '20% off post-run coffee', redemptions: 214, monthlyLimit: null, active: true },
  { id: 'perk_2', partner: 'StrideLab Running Store', category: 'Retail', offer: '15% off shoes + free gait scan', redemptions: 89, monthlyLimit: null, active: true },
  { id: 'perk_3', partner: 'Northshore Physio', category: 'Recovery', offer: 'Intake session €25 (was €60)', redemptions: 41, monthlyLimit: 20, active: true },
  { id: 'perk_4', partner: 'Velo Hotel Group', category: 'Travel', offer: 'Race-weekend rate: −25%', redemptions: 12, monthlyLimit: null, active: true },
  { id: 'perk_5', partner: 'CityFuel Nutrition', category: 'Nutrition', offer: 'Free gel 4-pack with first order', redemptions: 67, monthlyLimit: 50, active: true },
  { id: 'perk_6', partner: 'Zen Recovery Studio', category: 'Recovery', offer: 'Ice bath + sauna €15', redemptions: 28, monthlyLimit: 30, active: false },
];

export const challenges: Challenge[] = [
  {
    id: 'chal_1', name: 'July Distance Club — 100K', metric: 'distance', target: 100, unit: 'km',
    endsAt: daysFrom(29), participants: 31,
    leaders: [
      { memberId: members[6].id, value: 84 },
      { memberId: members[11].id, value: 79 },
      { memberId: members[2].id, value: 71 },
      { memberId: members[19].id, value: 66 },
      { memberId: members[33].id, value: 58 },
    ],
  },
  {
    id: 'chal_2', name: 'Streak Week — 5 runs in 7 days', metric: 'runs', target: 5, unit: 'runs',
    endsAt: daysFrom(5), participants: 22,
    leaders: [
      { memberId: members[7].id, value: 5 },
      { memberId: members[14].id, value: 4 },
      { memberId: members[25].id, value: 4 },
    ],
  },
  {
    id: 'chal_3', name: 'Volunteer 10 — give back 10 hours', metric: 'hours', target: 10, unit: 'hrs',
    endsAt: daysFrom(45), participants: 9,
    leaders: [
      { memberId: members[9].id, value: 8 },
      { memberId: members[4].id, value: 6 },
    ],
  },
];

export const journeys: Journey[] = [
  { id: 'jrn_1', name: 'New Member Welcome Series', trigger: 'member.joined', status: 'active', steps: 6, enrolled: 12, completed: 148, conversionGoal: 'First check-in within 14 days', conversionRate: 0.78 },
  { id: 'jrn_2', name: 'Win-back — 4 weeks inactive', trigger: 'member.inactivity(28d)', status: 'active', steps: 4, enrolled: 9, completed: 63, conversionGoal: 'RSVP within 10 days', conversionRate: 0.41 },
  { id: 'jrn_3', name: 'Event Growth Pack — 10K TT', trigger: 'event.published(evt_003)', status: 'active', steps: 12, enrolled: 87, completed: 0, conversionGoal: 'Fill 120 capacity', conversionRate: 0.73 },
  { id: 'jrn_4', name: 'Membership Renewal — Annual', trigger: 'membership.expiring(30d)', status: 'active', steps: 5, enrolled: 4, completed: 31, conversionGoal: 'Renew before expiry', conversionRate: 0.86 },
  { id: 'jrn_5', name: 'Payment Dunning', trigger: 'payment.failed', status: 'active', steps: 3, enrolled: 2, completed: 17, conversionGoal: 'Recover within 7 days', conversionRate: 0.71 },
  { id: 'jrn_6', name: 'First-timer Follow-up', trigger: 'checkin.first', status: 'active', steps: 3, enrolled: 12, completed: 89, conversionGoal: 'Second attendance in 21 days', conversionRate: 0.64 },
  { id: 'jrn_7', name: 'Ambassador Invite', trigger: 'score.threshold(85)', status: 'paused', steps: 2, enrolled: 0, completed: 6, conversionGoal: 'Accept ambassador role', conversionRate: 0.5 },
];

export const vendors: Vendor[] = [
  { id: 'ven_1', name: 'Dr. Emre Kaya', service: 'Sports physiotherapy', rating: 4.9, bookings: 84, priceFrom: 45 },
  { id: 'ven_2', name: 'StrideLab', service: 'Gait analysis', rating: 4.8, bookings: 51, priceFrom: 35 },
  { id: 'ven_3', name: 'Coach Priya Sharma', service: '1:1 run coaching', rating: 5.0, bookings: 38, priceFrom: 60 },
  { id: 'ven_4', name: 'Fuel Kitchen', service: 'Sports nutrition plans', rating: 4.7, bookings: 22, priceFrom: 40 },
  { id: 'ven_5', name: 'Aperture North', service: 'Event photography', rating: 4.9, bookings: 16, priceFrom: 150 },
];

export const activityFeed: ActivityItem[] = [
  { id: 'act_1', memberId: members[1].id, kind: 'pr', text: 'set a 10K PR at the Canal Ring long run', date: daysFrom(-5, 10), meta: '43:12 — 1:04 faster' },
  { id: 'act_2', memberId: members[7].id, kind: 'run', text: 'completed Streak Week day 5', date: daysFrom(0, 6), meta: '8.2 km · 5:31/km' },
  { id: 'act_3', memberId: members[23].id, kind: 'joined', text: 'joined Harbor City Runners', date: daysFrom(0, 7), meta: 'invited by Leo Martins' },
  { id: 'act_4', memberId: members[12].id, kind: 'perk', text: 'redeemed 20% off at Dock 7 Coffee', date: daysFrom(-1, 9) },
  { id: 'act_5', memberId: members[4].id, kind: 'post', text: 'posted 14 photos to the Canal Ring gallery', date: daysFrom(-4, 12), meta: '2.1k views' },
  { id: 'act_6', memberId: members[30].id, kind: 'purchase', text: 'bought the Club singlet 2026', date: daysFrom(-1, 15) },
  { id: 'act_7', memberId: members[16].id, kind: 'checkin', text: 'checked in to Track Tuesday — Ladder', date: daysFrom(-9, 18) },
  { id: 'act_8', memberId: members[9].id, kind: 'run', text: 'logged a trail 21K from Garmin', date: daysFrom(-2, 8), meta: '21.4 km · 412m elev' },
];

export const weeklyMetrics: WeeklyMetric[] = [
  { week: 'W-11', wacm: 27, attendance: 51, newMembers: 2, revenue: 486, churned: 1 },
  { week: 'W-10', wacm: 29, attendance: 55, newMembers: 3, revenue: 512, churned: 0 },
  { week: 'W-9', wacm: 28, attendance: 49, newMembers: 1, revenue: 498, churned: 2 },
  { week: 'W-8', wacm: 31, attendance: 58, newMembers: 4, revenue: 604, churned: 0 },
  { week: 'W-7', wacm: 33, attendance: 61, newMembers: 3, revenue: 688, churned: 1 },
  { week: 'W-6', wacm: 32, attendance: 57, newMembers: 2, revenue: 645, churned: 1 },
  { week: 'W-5', wacm: 35, attendance: 66, newMembers: 5, revenue: 742, churned: 0 },
  { week: 'W-4', wacm: 36, attendance: 63, newMembers: 3, revenue: 758, churned: 1 },
  { week: 'W-3', wacm: 38, attendance: 71, newMembers: 4, revenue: 812, churned: 0 },
  { week: 'W-2', wacm: 37, attendance: 68, newMembers: 2, revenue: 794, churned: 1 },
  { week: 'W-1', wacm: 40, attendance: 74, newMembers: 5, revenue: 896, churned: 0 },
  { week: 'Now', wacm: 41, attendance: 63, newMembers: 3, revenue: 923, churned: 0 },
];

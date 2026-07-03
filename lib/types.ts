// Core domain types for the RunOS demo app.
// Mirrors docs/03-architecture/database-schema.md at demo fidelity.

export type ConsentScope =
  | 'profile.basic'
  | 'activity.summary'
  | 'activity.detailed'
  | 'health.medical'
  | 'location.live'
  | 'marketing.brands'
  | 'photos.appearances';

export type MemberStatus = 'active' | 'at-risk' | 'lapsed' | 'new';
export type MemberRole = 'member' | 'ambassador' | 'volunteer' | 'coach' | 'organizer';

export interface Member {
  id: string;
  name: string;
  email: string;
  joinedAt: string; // ISO date
  status: MemberStatus;
  roles: MemberRole[];
  tier: 'free' | 'monthly' | 'annual';
  city: string;
  avatarColor: string;
  weeklyKm: number;
  attendanceRate: number; // 0..1 last 12 weeks
  eventsAttended: number;
  lastSeen: string; // ISO date
  churnRisk: number; // 0..1
  communityScore: number; // 0..100
  ltv: number; // USD
  consents: ConsentScope[];
  connectedApps: string[];
  prs: { distance: string; time: string }[];
  volunteerHours: number;
  tags: string[];
}

export type EventStatus = 'draft' | 'published' | 'live' | 'completed';
export type EventType = 'long-run' | 'tempo' | 'social' | 'race' | 'track' | 'trail';

export interface ClubEvent {
  id: string;
  title: string;
  type: EventType;
  status: EventStatus;
  date: string; // ISO datetime
  location: string;
  routeName: string;
  distanceKm: number;
  capacity: number;
  registered: number;
  checkedIn: number;
  waitlist: number;
  price: number; // 0 = free
  pacers: string[];
  volunteers: string[];
  weather: string;
  description: string;
  predictedAttendance?: [number, number];
}

export interface Registration {
  id: string;
  eventId: string;
  memberId: string;
  registeredAt: string;
  checkedInAt: string | null;
  waiverSigned: boolean;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  members: number;
  perks: string[];
}

export type PaymentKind = 'membership' | 'ticket' | 'merch' | 'marketplace';
export type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  memberId: string;
  kind: PaymentKind;
  description: string;
  amount: number;
  fee: number;
  status: PaymentStatus;
  date: string;
}

export interface Sponsor {
  id: string;
  name: string;
  industry: string;
  contact: string;
  stage: 'lead' | 'contacted' | 'proposal' | 'negotiation' | 'active' | 'renewal';
  dealValue: number;
  nextStep: string;
  lastTouch: string;
  logoHue: number;
}

export interface Perk {
  id: string;
  partner: string;
  category: string;
  offer: string;
  redemptions: number;
  monthlyLimit: number | null;
  active: boolean;
}

export interface Challenge {
  id: string;
  name: string;
  metric: string;
  target: number;
  unit: string;
  endsAt: string;
  participants: number;
  leaders: { memberId: string; value: number }[];
}

export interface Journey {
  id: string;
  name: string;
  trigger: string;
  status: 'active' | 'paused' | 'draft';
  steps: number;
  enrolled: number;
  completed: number;
  conversionGoal: string;
  conversionRate: number;
}

export interface Vendor {
  id: string;
  name: string;
  service: string;
  rating: number;
  bookings: number;
  priceFrom: number;
}

export interface ActivityItem {
  id: string;
  memberId: string;
  kind: 'run' | 'checkin' | 'joined' | 'pr' | 'perk' | 'post' | 'purchase';
  text: string;
  date: string;
  meta?: string;
}

export interface WeeklyMetric {
  week: string; // label
  wacm: number;
  attendance: number;
  newMembers: number;
  revenue: number;
  churned: number;
}

export interface Club {
  id: string;
  name: string;
  slug: string;
  city: string;
  founded: string;
  memberCount: number;
  plan: 'starter' | 'club' | 'pro' | 'network';
  chapters: string[];
}

// Marketing page data — ported verbatim from site/index.html.

export type Surface = {
  k: string;
  h: string;
  p: string;
  cta: string;
  img: string;
};

export const SURFACES: Surface[] = [
  {
    k: 'Community',
    h: 'Know every runner. Not just the fast ones.',
    p: 'Every member gets one unified profile: attendance, activity, purchases, volunteer hours, milestones. Segment your crowd in two clicks — new joiners, streak-holders, the quietly-drifting. Message the right people instead of blasting everyone.',
    cta: 'See the member CRM',
    img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1400&q=80',
  },
  {
    k: 'Events',
    h: 'Publish in minutes. Check in with a QR. Done.',
    p: 'Build an event once, reuse it forever. Registrations, waivers, waitlists, routes, pacers, and weather in one flow. On the morning, members scan a QR and you see live attendance instead of counting heads in the rain.',
    cta: 'Build a test event',
    img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80',
  },
  {
    k: 'Money',
    h: 'Dues collected. Books balanced. Nobody chased.',
    p: "Memberships, tickets, and merch flow through Stripe straight to your club's account. Automatic reminders replace awkward DMs. Invoices, budgets, and payouts live in one ledger your treasurer will actually enjoy.",
    cta: 'See how payments work',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1400&q=80',
  },
  {
    k: 'Growth',
    h: 'Your club, on autopilot growth.',
    p: 'Landing pages, referral engines, email, SMS, and push — wired into journeys that welcome new members, revive lapsed ones, and fill events before you finish your coffee. Set the journey once. It runs every week without you.',
    cta: 'Explore Growth OS',
    img: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=1400&q=80',
  },
  {
    k: 'Engage',
    h: 'Make showing up feel like winning.',
    p: 'Challenges, leaderboards, rewards, and the benefits passport turn attendance into a game members want to play. Recognize your ambassadors automatically instead of remembering to.',
    cta: 'See challenges in action',
    img: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1400&q=80',
  },
  {
    k: 'Partners',
    h: 'Sponsors managed like deals, not favors.',
    p: 'A real sponsor CRM, a Brand Portal for your partners, and a vendor marketplace for physios, coaches, and nutritionists. Show sponsors verified reach and real ROI — and charge accordingly.',
    cta: 'Tour the Sponsor CRM',
    img: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1400&q=80',
  },
  {
    k: 'Intelligence',
    h: 'See next month before it happens.',
    p: 'Attendance prediction, churn risk, revenue forecasting, and anonymized benchmarks from clubs like yours. Stop guessing which members are fading. Start acting three weeks earlier.',
    cta: 'Preview the analytics',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1400&q=80',
  },
  {
    k: 'Platform',
    h: 'Your brand out front. Our engine underneath.',
    p: 'White-label websites and mobile apps, granular permissions, chapter management, integrations, and API access. Your members see your club. RunOS just makes it run.',
    cta: 'See white-label options',
    img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80',
  },
];

export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "Who owns our club's data?",
    a: 'You do. The club owns its data; each member controls what the club sees through consent settings they manage themselves. We never sell data. Brands only ever see aggregated, anonymized insights — never groups smaller than 50 people — unless a member individually opts into a specific campaign. If you leave, you export everything.',
  },
  {
    q: 'Does RunOS replace WhatsApp?',
    a: 'Only if you want it to. RunOS has its own feed and messaging, and many clubs move announcements there so they stop getting buried. But we also integrate with WhatsApp, Slack, and Discord. Most clubs run both for a while, then notice the group chat has gone quiet in a good way — the noise moved, the friendships stayed.',
  },
  {
    q: 'Do members have to pay for RunOS?',
    a: "No. Members never pay to use RunOS. The club subscribes; members get the app, their profile, the benefits passport, and consent controls free. Members only ever pay for things they'd pay for anyway — dues, event tickets, merch — set by the club, not by us.",
  },
  {
    q: 'How does migration from spreadsheets and Eventbrite work?',
    a: 'We import members, events, and payment history from spreadsheets, Eventbrite, Mailchimp exports, and most common tools. Starter and Club clubs use self-serve import with guided mapping. Founding clubs and Pro clubs get white-glove migration — we do it for you. Most clubs are fully live within a week.',
  },
  {
    q: "Do our members' Strava runs get shared automatically?",
    a: 'No. Members choose what syncs and what the club sees. By default the club sees summaries, not detailed routes or paces — and members can dial that up or down anytime. Medical details and live location are always opt-in. We support Strava, Garmin, COROS, Polar, Suunto, Apple Health, Google Health Connect, Fitbit, TrainingPeaks, and Zwift.',
  },
  {
    q: 'What happens if we cancel?',
    a: 'No lock-in. Cancel anytime from settings. You get a full export of your data — members, events, finances, everything — in standard formats. Your Stripe account is yours, so payment history stays with you. We keep your export available for 90 days after cancellation, then delete your data on request or per our retention policy.',
  },
  {
    q: "We're volunteers with zero budget. Is Starter really free?",
    a: "Really free. Under 50 members, core Community + Events, no time limit, no credit card. You'll see RunOS branding and pay the 2% platform fee only when money actually moves. When you outgrow 50 members, you'll be earning enough from dues and events to make Club an easy call.",
  },
  {
    q: 'Is RunOS only for road running clubs?',
    a: 'RunOS is built for running communities first — road, trail, track, triathlon crews, and university clubs. If your community meets, moves, and organizes events, the operating system fits. Multi-sport and franchise fitness communities run on our Network tier.',
  },
];

// The three pricing-relevant FAQs: members pay?, cancel?, platform fee?
export const PRICING_FAQS: Faq[] = [FAQS[2], FAQS[5], FAQS[6]];

export type ChatExchange = { u: string; a: string };

export const CHAT: ChatExchange[] = [
  {
    u: 'Plan October.',
    a: "Here's a draft month: 4 Saturday long runs (routes rotated from your library), a 10K time trial on the 18th, and a Halloween social on the 30th. Attendance forecast: 62–75 per Saturday. I've drafted all five event pages, the newsletter, and an Instagram carousel. Publish?",
  },
  {
    u: "Who's at risk of quitting?",
    a: "14 members show churn risk. 9 haven't attended in 4+ weeks after previously averaging 3 events a month. I've drafted a personal 'we miss you' message and a re-entry challenge invite for each. Review and send?",
  },
  {
    u: 'Draft a proposal for a local shoe store sponsorship.',
    a: 'Done. It shows your verified numbers — 450 members, 71% monthly active, 38 events last quarter — with three sponsorship tiers priced off similar clubs, plus a demo-shoe Saturday activation. Export as PDF?',
  },
];

export const INTEGRATIONS: string[] = [
  'Strava',
  'Garmin',
  'COROS',
  'Polar',
  'Suunto',
  'Apple Health',
  'Google Health Connect',
  'Fitbit',
  'TrainingPeaks',
  'Zwift',
  'Stripe',
  'Shopify',
  'Mailchimp',
  'WhatsApp',
  'Slack',
  'Discord',
];

export type Stat = { to: number; suffix: string; label: string };

export const STATS: Stat[] = [
  { to: 7, suffix: '→1', label: 'Apps collapsed into one login and one database' },
  { to: 10, suffix: 'min', label: 'From signup to your first published event' },
  { to: 20, suffix: '+', label: 'Native integrations, from Strava to Stripe' },
  { to: 8, suffix: 'hrs', label: 'Of weekly admin handed to automations and Pacer' },
];

export type Step = { num: string; title: string; body: string; img: string; alt: string };

export const STEPS: Step[] = [
  {
    num: '01 — Import',
    title: 'Bring your club',
    body: 'Members, events, and payment history flow in from spreadsheets, Eventbrite, and WhatsApp exports. Guided mapping, or white-glove — we do it for you.',
    img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    alt: 'Athlete lacing up on track',
  },
  {
    num: '02 — Automate',
    title: 'Wire it once',
    body: 'Every event auto-creates its landing page, registration, reminders, QR check-in, recap, and sponsor report. Nothing manual, ever again.',
    img: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80',
    alt: 'Runner at sunrise',
  },
  {
    num: '03 — Grow',
    title: 'Watch it compound',
    body: 'Referral loops, benefits partners, challenges, and churn-risk plays keep members showing up — and bring their friends with them.',
    img: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1200&q=80',
    alt: 'Runner training outdoors',
  },
];

export type Testimonial = { quote: string; initials: string; name: string; role: string };

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      '"Sunday used to be six hours of spreadsheets and chasing dues in DMs. Now the event publishes itself, reminders go out, and I just show up and run. The club grew past me — and that\'s finally fine."',
    initials: 'MO',
    name: 'Maya Okafor',
    role: 'Founder, Lagos Road Runners',
  },
  {
    quote:
      '"I asked Pacer to draft a proposal for our local shoe store. It pulled our real attendance, priced three tiers off clubs like ours, and exported a PDF. We signed our first paid sponsor a week later."',
    initials: 'PS',
    name: 'Priya Sharma',
    role: 'Chapter lead, second-city crew',
  },
  {
    quote:
      '"As a member? One app. My streaks, my perks, the Saturday route, my QR ticket. And I decide exactly what the club sees from my Strava — the switches are right there in my profile."',
    initials: 'LM',
    name: 'Leo Martins',
    role: 'Member, runs 4× a week',
  },
];

export type Tier = {
  name: string;
  audience: string;
  monthly: number | null; // null = custom pricing
  annual: number | null;
  priceLine: string | null; // fixed price line (Starter); null = billing note driven by toggle
  customPrice?: string;
  features: string[]; // homepage preview bullets
  fullFeatures: string[]; // /pricing complete list
  tagline: string;
  ctaLabel: string;
  featured?: boolean;
  badge?: string;
};

export const TIERS: Tier[] = [
  {
    name: 'Starter',
    audience: 'For new clubs under 50 members.',
    monthly: 0,
    annual: 0,
    priceLine: 'Free. Forever. Really.',
    features: [
      'Core Community + Events',
      'QR check-in & waivers',
      'Member profiles & feed',
      '2% platform fee on payments',
    ],
    fullFeatures: [
      'Core Community + Events',
      'QR check-in & waivers',
      'Member profiles & feed',
      'Self-serve import with guided mapping',
      'Pacer AI available as $29/mo add-on',
      '2% platform fee on payments',
    ],
    tagline: "Start here. Stay free as long as you're small.",
    ctaLabel: 'Start free',
  },
  {
    name: 'Club',
    audience: 'For growing clubs, up to 500 members.',
    monthly: 79,
    annual: 66,
    priceLine: null,
    features: [
      'Everything in Starter',
      'Growth OS — journeys, email, SMS',
      'Benefits passport & challenges',
      'All 20+ integrations',
      '1% platform fee',
    ],
    fullFeatures: [
      'Everything in Starter',
      'Growth OS — journeys, email, SMS',
      'Benefits passport & challenges',
      'All 20+ integrations',
      'Pacer AI available as $29/mo add-on',
      '1% platform fee',
    ],
    tagline: 'The club that runs itself, mostly.',
    ctaLabel: 'Start 14-day trial',
    badge: 'Most popular path',
  },
  {
    name: 'Pro',
    audience: 'For serious clubs, up to 2,000 members.',
    monthly: 199,
    annual: 166,
    priceLine: null,
    features: [
      'Everything in Club',
      'Pacer AI — unlimited',
      'White-label web + Sponsor CRM',
      'Predictions & benchmarks',
      '0.5% platform fee',
    ],
    fullFeatures: [
      'Everything in Club',
      'Pacer AI — unlimited',
      'White-label web presence',
      'Sponsor CRM + Brand Portal',
      'Predictions & benchmarks',
      'White-glove migration',
      '0.5% platform fee',
    ],
    tagline: 'Run it like a business. Keep it feeling like a club.',
    ctaLabel: 'Start 14-day trial',
    featured: true,
  },
  {
    name: 'Network',
    audience: 'For multi-chapter orgs, franchises, cities, and federations.',
    monthly: null,
    annual: null,
    priceLine: 'From $999/mo, billed annually',
    customPrice: 'Custom',
    features: [],
    fullFeatures: [
      'Everything in Pro',
      'Unlimited members & chapters',
      'White-label mobile app',
      'Full API access',
      'SSO / SAML',
      'Uptime SLA',
      'Dedicated CSM',
    ],
    tagline: 'Your federation, running on one engine.',
    ctaLabel: 'Talk to us',
  },
];

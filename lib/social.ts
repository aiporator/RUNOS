// PUBLISH & PROMOTE — social content engine, connector model, and post queue.
// generatePosts() is a pure function over event data: every event ships with a
// ready-to-review campaign (announce / reminder / recap) tailored per channel.
// The queue lives on globalThis like lib/store.ts so it survives dev reloads;
// swap it for the `social_posts` table + dispatcher workers described in
// docs/03-architecture/social-publishing.md when going live.
import { club, TODAY } from './seed';
import type { ClubEvent } from './types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Channel = 'instagram' | 'facebook' | 'x' | 'linkedin' | 'tiktok' | 'whatsapp';

export const CHANNELS: readonly Channel[] = [
  'instagram', 'facebook', 'x', 'linkedin', 'tiktok', 'whatsapp',
];

export type PostKind = 'announce' | 'reminder' | 'recap';

export const POST_KINDS: readonly PostKind[] = ['announce', 'reminder', 'recap'];

export interface SocialPost {
  id: string;
  channel: Channel;
  kind: PostKind;
  body: string;
  /** Channel-specific structured content: hashtags, carousel slides, TikTok shot list… */
  extras?: Record<string, string[] | string>;
  /** ISO datetime — when the content engine suggests this goes out. */
  suggestedAt: string;
}

// ---------------------------------------------------------------------------
// Content engine
// ---------------------------------------------------------------------------

function registrationLink(eventId: string): string {
  return `https://run.aiporate.com/c/${club.slug}/${eventId}`;
}

function shiftHours(iso: string, hours: number): string {
  return new Date(new Date(iso).getTime() + hours * 3_600_000).toISOString();
}

function eventDayLabel(iso: string): string {
  const d = new Date(iso);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${days[d.getUTCDay()]} ${d.getUTCDate()} ${months[d.getUTCMonth()]}, ${hh}:${mm}`;
}

const TYPE_HASHTAG: Record<ClubEvent['type'], string> = {
  'long-run': '#longrun',
  tempo: '#temporun',
  social: '#runclubsocial',
  race: '#raceday',
  track: '#trackworkout',
  trail: '#trailrunning',
};

/**
 * One tailored post per channel from event data. Pure — same event in, same
 * campaign out. Schedule: announce = now (demo TODAY), reminder = T-24h,
 * recap = T+2h after the start gun.
 */
export function generatePosts(event: ClubEvent, clubName: string): SocialPost[] {
  const when = eventDayLabel(event.date);
  const link = registrationLink(event.id);
  const spotsLeft = Math.max(0, event.capacity - event.registered);
  const priceLine = event.price === 0 ? 'Free for members' : `€${event.price} — includes the extras`;
  const announceAt = TODAY.toISOString(); // "now" in demo time
  const reminderAt = shiftHours(event.date, -24);
  const recapAt = shiftHours(event.date, 2);
  const pid = (channel: Channel, kind: PostKind): string => `sp_${event.id}_${channel}_${kind}`;

  const hashtags = [
    '#runclub', '#communityrun', TYPE_HASHTAG[event.type], '#harborcityrunners',
    `#${Math.round(event.distanceKm)}k`, '#runningcommunity', '#amsterdamrunning',
    '#weekendrun', '#runhappy',
  ];

  const posts: SocialPost[] = [
    // -- announce × 6 ---------------------------------------------------------
    {
      id: pid('instagram', 'announce'),
      channel: 'instagram',
      kind: 'announce',
      body: [
        `${event.title} is ON. 🏃`,
        '',
        `📍 ${event.location}`,
        `🗓 ${when}`,
        `📏 ${event.routeName} — ${event.distanceKm} km`,
        `💶 ${priceLine}`,
        '',
        `${event.description}`,
        '',
        `${spotsLeft > 0 ? `${spotsLeft} spots left — ` : 'Waitlist is open — '}link in bio to grab yours.`,
      ].join('\n'),
      extras: {
        hashtags,
        carousel: [
          `Slide 1 — Hero: bold title card "${event.title}" over last edition's best crowd shot`,
          `Slide 2 — The route: ${event.routeName} map with ${event.distanceKm} km + elevation callout`,
          `Slide 3 — The details: date, meeting point (${event.location}), pace groups`,
          'Slide 4 — Social proof: 3 member quotes + finish-line photos from last time',
          'Slide 5 — CTA: "Spots are limited. Link in bio." + club logo',
        ],
      },
      suggestedAt: announceAt,
    },
    {
      id: pid('facebook', 'announce'),
      channel: 'facebook',
      kind: 'announce',
      body: [
        `Friends of ${clubName} — the next one is on the calendar and we'd love to see you there. 💛`,
        '',
        `${event.title} takes over ${event.location} on ${when}. We're running the ${event.routeName} (${event.distanceKm} km), and as always there's a group for every pace — nobody runs alone and nobody gets dropped.`,
        '',
        event.description,
        '',
        `${priceLine}. ${spotsLeft > 0 ? `${event.registered} runners are already in and ${spotsLeft} spots remain` : 'The event is full but the waitlist moves fast'}, so bring a friend who's been "meaning to start running" — this is the run to start with.`,
        '',
        `Save your spot: ${link}`,
      ].join('\n'),
      extras: { link },
      suggestedAt: announceAt,
    },
    {
      id: pid('x', 'announce'),
      channel: 'x',
      kind: 'announce',
      body: `${event.title} 🏃 ${when} @ ${event.location}. ${event.distanceKm} km, every pace welcome. ${spotsLeft > 0 ? `${spotsLeft} spots left.` : 'Waitlist open.'} ${link}`,
      suggestedAt: announceAt,
    },
    {
      id: pid('linkedin', 'announce'),
      channel: 'linkedin',
      kind: 'announce',
      body: [
        `Community health is built one Saturday at a time.`,
        '',
        `At ${clubName}, we've watched a weekly run become the most reliable wellbeing habit in our members' calendars — better sleep, lower stress, and a social circle that shows up. Our next edition, ${event.title}, meets ${when} at ${event.location} for ${event.distanceKm} km with paced groups for every level.`,
        '',
        `If your team has been talking about wellness programs that people actually attend, come see what a community-run model looks like in practice. Colleagues, first-timers, and walkers-turned-runners all welcome.`,
        '',
        `Details and registration: ${link}`,
      ].join('\n'),
      extras: { link },
      suggestedAt: announceAt,
    },
    {
      id: pid('tiktok', 'announce'),
      channel: 'tiktok',
      kind: 'announce',
      body: `Video concept: "POV: you finally joined the run club" — fast-cut hype edit announcing ${event.title} (${when}), ending on the meet-up pin at ${event.location}.`,
      extras: {
        hook: `Text overlay, first 1.5s: "You've been saying 'I should join a run club' for 6 months. Here's your sign."`,
        shots: [
          `Shot 1 (0-3s): sunrise POV lacing up shoes, hard cut to the group at ${event.location}`,
          `Shot 2 (3-9s): fast-cut pack running the ${event.routeName} — smiles, high-fives, pace groups forming`,
          'Shot 3 (9-15s): finish-line cheers + coffee hangout, end card with date and "link in bio"',
        ],
        sound: 'Trending upbeat running-edit audio (or "Feel It" — check current trending sounds tab before posting)',
      },
      suggestedAt: announceAt,
    },
    {
      id: pid('whatsapp', 'announce'),
      channel: 'whatsapp',
      kind: 'announce',
      body: [
        `🏃 *${event.title}* — ${when}`,
        `📍 ${event.location} · ${event.distanceKm} km · ${event.price === 0 ? 'free' : `€${event.price}`}`,
        `${spotsLeft > 0 ? `⚡ ${spotsLeft} spots left.` : '⚡ Waitlist open.'} Register 👇`,
        link,
      ].join('\n'),
      extras: { link },
      suggestedAt: announceAt,
    },

    // -- reminder × IG / WhatsApp / X ----------------------------------------
    {
      id: pid('instagram', 'reminder'),
      channel: 'instagram',
      kind: 'reminder',
      body: [
        `Tomorrow. ⏰`,
        '',
        `${event.title} — ${when}, ${event.location}.`,
        '',
        `Kit check tonight: shoes by the door, bottle filled, alarm set. Pace groups announced at the start — arrive 15 min early to check in.`,
        '',
        `Last-minute spot? Link in bio.`,
      ].join('\n'),
      extras: { hashtags: hashtags.slice(0, 8) },
      suggestedAt: reminderAt,
    },
    {
      id: pid('whatsapp', 'reminder'),
      channel: 'whatsapp',
      kind: 'reminder',
      body: [
        `⏰ *Tomorrow:* ${event.title}`,
        `📍 ${event.location} — arrive 15 min early for check-in.`,
        `Weather: ${event.weather}. See you there! 🙌`,
        `Can't make it anymore? Free your spot: ${link}`,
      ].join('\n'),
      extras: { link },
      suggestedAt: reminderAt,
    },
    {
      id: pid('x', 'reminder'),
      channel: 'x',
      kind: 'reminder',
      body: `24h to go ⏰ ${event.title} — ${when} at ${event.location}. ${event.weather}. Check-in opens 15 min before the start. ${link}`,
      suggestedAt: reminderAt,
    },

    // -- recap × IG / Facebook ------------------------------------------------
    {
      id: pid('instagram', 'recap'),
      channel: 'instagram',
      kind: 'recap',
      body: [
        `That's a wrap on ${event.title}. 🧡`,
        '',
        `${event.registered} of you signed up, the ${event.routeName} delivered, and the post-run coffee queue was longer than the start line.`,
        '',
        `Photo gallery drops tonight — tag yourself and your crew. First-timers: you did the hard part. See you at the next one (link in bio).`,
      ].join('\n'),
      extras: {
        hashtags: hashtags.slice(0, 8),
        carousel: [
          'Slide 1 — Best crowd shot of the day with a big "DONE ✔" sticker',
          'Slide 2 — Start-line energy: the pack heading out',
          `Slide 3 — Route hero moment on the ${event.routeName}`,
          'Slide 4 — First-timers spotlight with their finish photos',
          'Slide 5 — "Next up" teaser card + link in bio CTA',
        ],
      },
      suggestedAt: recapAt,
    },
    {
      id: pid('facebook', 'recap'),
      channel: 'facebook',
      kind: 'recap',
      body: [
        `What a morning, ${clubName}. 🧡`,
        '',
        `${event.title} is in the books — ${event.distanceKm} km on the ${event.routeName}, every pace group full, and a coffee hangout that outlasted the run itself. To everyone who showed up for their very first club run today: that first one is the hardest, and you crushed it.`,
        '',
        `Full photo album lands in this group tonight — tag your running buddies. And if you watched from the sidelines this time, the next edition is already open: ${link}`,
      ].join('\n'),
      extras: { link },
      suggestedAt: recapAt,
    },
  ];

  return posts;
}

// ---------------------------------------------------------------------------
// Connector model — per-channel posting APIs + the aggregator shortcut.
// ---------------------------------------------------------------------------

export interface SocialConnector {
  channel: Channel;
  name: string;
  status: 'connected' | 'available';
  mode: 'native-api' | 'aggregator';
  note: string;
}

export const CONNECTORS: SocialConnector[] = [
  {
    channel: 'instagram',
    name: 'Instagram',
    status: 'connected',
    mode: 'native-api',
    note: 'Meta Graph API — requires an Instagram Business/Creator account linked to a Facebook Page.',
  },
  {
    channel: 'facebook',
    name: 'Facebook',
    status: 'available',
    mode: 'native-api',
    note: 'Meta Graph API — posts to the club Page; same Meta app + Business account as Instagram.',
  },
  {
    channel: 'x',
    name: 'X (Twitter)',
    status: 'available',
    mode: 'native-api',
    note: 'X API v2 — write access needs the paid Basic tier ($200/mo); free tier is read-only.',
  },
  {
    channel: 'linkedin',
    name: 'LinkedIn',
    status: 'available',
    mode: 'native-api',
    note: 'Community Management API — organization posts require the partner program review.',
  },
  {
    channel: 'tiktok',
    name: 'TikTok',
    status: 'available',
    mode: 'native-api',
    note: 'Content Posting API — app audit + approval required before public (non-draft) posting.',
  },
  {
    channel: 'whatsapp',
    name: 'WhatsApp',
    status: 'connected',
    mode: 'native-api',
    note: 'Business Cloud API — broadcasts go out as pre-approved message templates.',
  },
];

/** The one-integration shortcut, rendered separately from the native connectors. */
export const AGGREGATOR: { name: string; note: string } = {
  name: 'Postiz / Ayrshare (aggregator)',
  note: 'One API for all channels — fastest path to live posting. Self-hosted Postiz or Ayrshare SaaS.',
};

// ---------------------------------------------------------------------------
// Post queue — globalThis singleton (same pattern as lib/store.ts) so the
// queue survives Next.js dev hot-reloads. Seeded empty.
// ---------------------------------------------------------------------------

export type QueuedPostStatus = 'scheduled' | 'posted' | 'canceled';

export interface QueuedPost extends SocialPost {
  /** The originating generated-post id (queue items get their own `id`). */
  postId: string;
  scheduledFor: string;
  status: QueuedPostStatus;
}

interface SocialQueueState {
  items: QueuedPost[];
  seq: number;
}

const globalWithQueue = globalThis as typeof globalThis & { __runosSocialQueue?: SocialQueueState };

function getQueueState(): SocialQueueState {
  globalWithQueue.__runosSocialQueue ??= { items: [], seq: 0 };
  return globalWithQueue.__runosSocialQueue;
}

export function schedulePost(post: SocialPost, when: string): QueuedPost {
  const state = getQueueState();
  state.seq += 1;
  const item: QueuedPost = {
    ...post,
    id: `spq_${String(state.seq).padStart(3, '0')}`,
    postId: post.id,
    scheduledFor: when,
    status: 'scheduled',
  };
  state.items.push(item);
  return item;
}

export function listQueue(): QueuedPost[] {
  return [...getQueueState().items].sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor));
}

export function cancelQueued(id: string): QueuedPost | undefined {
  const item = getQueueState().items.find((q) => q.id === id);
  if (!item || item.status !== 'scheduled') return item;
  item.status = 'canceled';
  return item;
}

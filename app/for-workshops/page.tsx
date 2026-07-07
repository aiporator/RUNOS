import type { Metadata } from 'next';
import VerticalPage, { type VerticalPageConfig } from '@/components/marketing/vertical-page';
import { getVertical } from '@/lib/verticals';

export const metadata: Metadata = {
  title: 'RunOS for Workshops & Courses',
  description:
    'Publish a workshop, pottery course, or Töpferkurs. Fill the room. Repeat. Calendar-first scheduling, ticketing with lower fees, waitlists, reminders, an attendee CRM, and social promotion — automated. Built for one-person studios too.',
};

const workshop = getVertical('workshop');

const config: VerticalPageConfig = {
  vertical: workshop,
  kicker: 'For workshops & courses',
  hero: {
    headline: 'Publish a workshop. Fill the room.',
    accent: 'Repeat.',
    sub: workshop.sub,
  },
  heroImage: {
    src: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=2000&q=80',
    alt: 'Focused athlete at sunrise',
  },
  ctaImage: {
    src: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=2000&q=80',
    alt: 'Athlete lacing up on track',
  },
  pains: [
    {
      title: 'The monthly rebuild',
      body: 'Same workshop, same copy, same photos — rebuilt on Eventbrite every month, with 5% of every ticket gone in fees.',
    },
    {
      title: 'Attendees trapped in three tools',
      body: 'Registrations in one tool, emails in another, payments in a third. Nobody actually knows who came back.',
    },
    {
      title: 'Promotion eats the evening',
      body: 'The night before every session goes to captions, reminders, and copy-pasting links — instead of preparing the actual workshop.',
    },
    {
      title: 'Built for one person, not a team',
      body: "A pottery studio running one Saturday Töpferkurs a week doesn't need enterprise software — it needs the sign-up sheet, the reminder, and the payment to just work, alone, in ten minutes.",
    },
  ],
  features: [
    {
      title: 'Calendar-first scheduling with course series',
      body: 'Plan single sessions or a six-week series in one view. Duplicate last month in two clicks.',
    },
    {
      title: 'Ticketing with lower fees',
      body: 'Sell seats from your own page and keep more of every ticket than Eventbrite lets you.',
    },
    {
      title: 'Waitlists & reminders',
      body: 'Sold out? Waitlists fill drops automatically, and reminders make sure people actually show up.',
    },
    {
      title: 'Attendee CRM that remembers everyone',
      body: 'See who came to what across every workshop — your regulars never start from zero again.',
    },
    {
      title: 'Auto-generated landing page per session',
      body: 'Every session gets its own landing page with checkout built in. No page builder, no rebuild.',
    },
    {
      title: 'Social promotion queue',
      body: 'Captions, reminders, and recaps drafted for every session — reviewed and scheduled from one queue.',
    },
    {
      title: 'Live headcount for materials ordering',
      body: 'A confirmed-minus-cancellations count as of this morning, not the sign-up sheet from three weeks ago — so you buy the clay you actually need.',
    },
  ],
  howItWorks: {
    heading: 'Publish a session. Everything else already exists.',
    body: 'One page becomes the landing page, the ticket, the reminder, and the check-in — automatically, the moment it hits the calendar.',
    steps: [
      {
        title: 'Publish your session or course series',
        body: 'Title, date, capacity, price — one form. A single Töpferkurs or a six-week series works the same way.',
      },
      {
        title: 'Share the one link you get',
        body: "A landing page with ticketing built in exists the instant you publish — no page builder, no separate checkout to wire up.",
      },
      {
        title: 'Show up to a room that filled itself',
        body: "Waitlists backfill drops, reminders cut no-shows, and the headcount you see the morning-of is the one that's actually confirmed.",
      },
    ],
  },
  calendar: {
    heading: 'The calendar is the product. Fill it once, sell it forever.',
    body: 'Workshops live and die by the schedule, so RunOS starts there. Publish a session or a whole course series and everything downstream — landing page, tickets, waitlist, reminders — exists the moment it hits the calendar.',
    chips: [
      { label: 'Töpferkurs Sat 10:00', day: 7, tone: 'volt' },
      { label: 'Masterclass 19:00', day: 14, tone: 'warn' },
      { label: 'Course wk 3/6', day: 22, tone: 'info' },
    ],
    dottedDays: [2, 4, 10, 12, 17, 19, 25, 28, 30],
  },
  faqs: [
    {
      q: 'Do attendees need an app?',
      a: "No. Every session gets a public landing page — attendees register there and get an email ticket with a QR code. That's the whole flow. At the door, you scan and they're in.",
    },
    {
      q: 'Can I run a 6-week course?',
      a: 'Yes — create a course series and every session is scheduled, ticketed, and tracked together, with per-session check-in. You know exactly who showed up to week 4, and who needs a nudge before week 5.',
    },
    {
      q: 'What does it cost?',
      a: "Free under 50 attendees, no credit card. When you sell tickets, the fee is a fraction of Eventbrite's — and it shrinks as you grow. You keep more of every seat you fill.",
    },
    {
      q: "I'm one person running a pottery studio — is this overkill?",
      a: "No — it's built for exactly that. A solo Töpferkurs host publishing one Saturday session a week gets the same 60-second setup as anyone else: one page, one link to share, materials ordering based on who's actually confirmed. Nothing here assumes a team.",
    },
    {
      q: 'Can I export my attendee list?',
      a: 'Always. Your attendees are your data — export everything in standard formats anytime, and if you ever leave, you take the whole list with you. No hostage-taking.',
    },
  ],
  cta: {
    headline: 'Stop rebuilding the same page',
    accent: 'every month.',
    body: 'Publish your next workshop in under ten minutes. Free under 50 attendees, no credit card — and every session drafts its own promotion.',
  },
  craftBrowse: {
    heading: 'A pottery studio and a woodworking shop don\'t run the same way.',
    body: 'Materials, safety, capacity limits, and seasonality look different for every craft. Pick yours — the page is written for how it actually operates, not a template with the noun swapped.',
  },
};

export default function ForWorkshopsPage() {
  return <VerticalPage config={config} />;
}

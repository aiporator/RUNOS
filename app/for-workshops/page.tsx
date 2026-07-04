import type { Metadata } from 'next';
import VerticalPage, { type VerticalPageConfig } from '@/components/marketing/vertical-page';
import { getVertical } from '@/lib/verticals';

export const metadata: Metadata = {
  title: 'RunOS for Workshops & Courses',
  description:
    'Publish a workshop. Fill the room. Repeat. Calendar-first scheduling, ticketing with lower fees, waitlists, reminders, an attendee CRM, and social promotion — automated.',
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
  ],
  calendar: {
    heading: 'The calendar is the product. Fill it once, sell it forever.',
    body: 'Workshops live and die by the schedule, so RunOS starts there. Publish a session or a whole course series and everything downstream — landing page, tickets, waitlist, reminders — exists the moment it hits the calendar.',
    chips: [
      { label: 'Intro to Ceramics Sat 10:00', day: 7, tone: 'volt' },
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
      q: 'Can I export my attendee list?',
      a: 'Always. Your attendees are your data — export everything in standard formats anytime, and if you ever leave, you take the whole list with you. No hostage-taking.',
    },
  ],
  cta: {
    headline: 'Stop rebuilding the same page',
    accent: 'every month.',
    body: 'Publish your next workshop in under ten minutes. Free under 50 attendees, no credit card — and every session drafts its own promotion.',
  },
};

export default function ForWorkshopsPage() {
  return <VerticalPage config={config} />;
}

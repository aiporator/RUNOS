import type { Metadata } from 'next';
import VerticalPage, { type VerticalPageConfig } from '@/components/marketing/vertical-page';
import { getVertical } from '@/lib/verticals';

export const metadata: Metadata = {
  title: 'RunOS for Gyms & Studios',
  description:
    'Run the gym floor, not the spreadsheet. Class calendar with recurring schedules, memberships and packs with autopay, QR check-in, waitlists, and win-back automations — one system.',
};

const gym = getVertical('gym');

const config: VerticalPageConfig = {
  vertical: gym,
  kicker: 'For gyms & studios',
  hero: {
    headline: 'Run the gym floor,',
    accent: 'not the spreadsheet.',
    sub: gym.sub,
  },
  heroImage: {
    src: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=2000&q=80',
    alt: 'Athlete lacing up on track',
  },
  ctaImage: {
    src: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=2000&q=80',
    alt: 'Runner resting at sunset',
  },
  pains: [
    {
      title: 'The no-show class',
      body: 'Twelve booked, seven show, and nobody rebooks the empty spots — so you eat the difference, every single week.',
    },
    {
      title: 'Dues chased in DMs',
      body: "Half your revenue arrives as 'sorry, forgot!' bank transfers after three awkward messages. Every month, same members.",
    },
    {
      title: 'The whiteboard schedule',
      body: 'The schedule lives on a whiteboard nobody photographs — so the same ten people ask the same question in the group chat.',
    },
  ],
  features: [
    {
      title: 'Class calendar with recurring schedules',
      body: "Set Monday's 07:00 strength once — it repeats forever, with caps, coaches, and rooms attached.",
    },
    {
      title: 'Memberships & packs with autopay',
      body: 'Plans, punch cards, and class packs billed automatically through Stripe. Nobody gets chased, ever.',
    },
    {
      title: 'QR check-in at the door',
      body: 'Members scan and go. You see live attendance on your phone instead of a clipboard at the desk.',
    },
    {
      title: 'Waitlists that fill cancellations',
      body: 'Someone drops at 06:40? The first person on the waitlist gets the spot automatically — full class, zero texts.',
    },
    {
      title: 'Win-back automations for lapsed members',
      body: 'Members who stop showing up get a personal nudge before they cancel — not a survey after.',
    },
    {
      title: 'Coach permissions',
      body: 'Coaches manage their own classes and rosters without touching billing, settings, or anything else.',
    },
  ],
  howItWorks: {
    heading: 'Live in under ten minutes. No migration project.',
    body: 'You don\'t rebuild your gym in RunOS — you import what you have and let it run.',
    steps: [
      {
        title: 'Import your class schedule and member list',
        body: 'Paste your weekly timetable and a CSV of current members — no manual re-entry, no waiting on a migration team.',
      },
      {
        title: 'Turn on autopay and QR check-in',
        body: 'Connect Stripe for dues and packs, print or screen a QR code at the desk. Both are live the moment you flip them on.',
      },
      {
        title: 'The rest runs itself',
        body: 'Waitlists fill cancellations, reminders go out before class, and lapsed members get a nudge — automatically, every week, with nobody watching.',
      },
    ],
  },
  calendar: {
    heading: 'Your schedule is the business. Treat it like one.',
    body: 'Gyms and studios live in the calendar, so RunOS starts there. Build your weekly timetable once and it publishes itself — bookings, waitlists, check-ins, and reminders wired to every slot.',
    chips: [
      { label: 'Morning Strength 07:00', day: 2, tone: 'volt' },
      { label: 'Lunch HIIT 12:15', day: 9, tone: 'warn' },
      { label: 'Mobility 18:30', day: 16, tone: 'ok' },
    ],
    dottedDays: [4, 6, 11, 13, 18, 20, 23, 25, 27, 30],
  },
  faqs: [
    {
      q: 'Can members book from their phone?',
      a: 'Yes. Every gym gets a public booking page out of the box, and Pro and Network tiers include a white-label app with your branding. Members book classes, join waitlists, and check in with a QR — no front-desk calls, no DMs.',
    },
    {
      q: 'Do you handle class packs and memberships?',
      a: 'Both. Monthly plans, punch-card packs, drop-ins, and trials — billed automatically through Stripe straight to your account. Reminders go out before a card fails, not after, so revenue stops leaking through forgotten renewals.',
    },
    {
      q: 'What about waivers?',
      a: "Digital waivers are attached to a member's first booking. They sign once on their phone, the signed copy lives on their profile forever, and nobody can check in without one. No paper, no binder.",
    },
    {
      q: 'We already use spreadsheets and Instagram DMs.',
      a: 'Perfect — import your member spreadsheet as a CSV in minutes, and keep Instagram. RunOS drafts your class posts, stories, and reminders for you, so the DMs turn into bookings instead of bookkeeping.',
    },
  ],
  cta: {
    headline: 'Your gym deserves better than a',
    accent: 'whiteboard.',
    body: 'Set up your gym in under ten minutes. Free under 50 members, no credit card, no lock-in — and your first recurring class publishes itself.',
  },
};

export default function ForGymsPage() {
  return <VerticalPage config={config} />;
}

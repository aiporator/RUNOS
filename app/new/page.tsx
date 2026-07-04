// /new — the instant-events front door. One screen, sixty seconds, no account.
import type { Metadata } from 'next';
import CreateEventForm from './create-form';

export const metadata: Metadata = {
  title: 'Create your event in 60 seconds — RunOS',
  description:
    'Workshops, runs, classes, meetups — publish a shareable event page in under a minute. Up to 20 people free forever. No account, no credit card.',
};

export default function NewEventPage() {
  return <CreateEventForm />;
}

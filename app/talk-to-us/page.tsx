import type { Metadata } from 'next';
import BookCallForm from './book-call-form';

export const metadata: Metadata = {
  title: 'Talk to us — RunOS',
  description:
    'Book a call for a founding-club pilot, a Network-tier rollout, or a brand partnership. Pick a slot, tell us about your community, and we\'ll confirm by email.',
};

export default function TalkToUsPage() {
  return <BookCallForm />;
}

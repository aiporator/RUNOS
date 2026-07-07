import type { Metadata } from 'next';
import DiscoverView from './discover-view';

export const metadata: Metadata = {
  title: 'Discover runs and clubs — RunOS',
  description:
    'Browse open runs, classes, and workshops published on RunOS by city or type — RSVP in one tap, no account needed.',
};

export default function DiscoverPage() {
  return <DiscoverView />;
}

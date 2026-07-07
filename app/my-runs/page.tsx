import type { Metadata } from 'next';
import MyRunsView from './my-runs-view';

export const metadata: Metadata = {
  title: 'My runs — RunOS',
  description: 'Every event you\'ve hosted or RSVP\'d to, in one place — no account needed.',
  robots: { index: false, follow: true },
};

export default function MyRunsPage() {
  return <MyRunsView />;
}

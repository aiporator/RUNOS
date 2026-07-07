import { PageHeader } from '@/components/ui';
import EventForm from '../event-form';

export const dynamic = 'force-dynamic';

export default function NewEventPage() {
  return (
    <div>
      <PageHeader kicker="Operations" title="New event" sub="Starts as a draft — publish it when you're ready to open registration." />
      <EventForm />
    </div>
  );
}

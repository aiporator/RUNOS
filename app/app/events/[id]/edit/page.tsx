import { notFound } from 'next/navigation';
import { getEvent } from '@/lib/data';
import { PageHeader } from '@/components/ui';
import EventForm from '../../event-form';

export const dynamic = 'force-dynamic';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) notFound();

  return (
    <div>
      <PageHeader kicker="Operations" title={`Edit — ${event.title}`} sub="Changes apply immediately to the public event page." />
      <EventForm event={event} />
    </div>
  );
}

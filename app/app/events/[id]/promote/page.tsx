import { notFound } from 'next/navigation';
import { club, getEvent } from '@/lib/data';
import { generatePosts } from '@/lib/social';
import PromoteStudio from './promote-studio';

export default async function PromotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) notFound();

  const posts = generatePosts(event, club.name);

  return (
    <PromoteStudio
      event={{
        id: event.id,
        title: event.title,
        date: event.date,
        location: event.location,
        status: event.status,
      }}
      posts={posts}
    />
  );
}

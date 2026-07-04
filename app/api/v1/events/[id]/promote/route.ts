// GET /api/v1/events/{id}/promote — the auto-generated social campaign for an
// event: one tailored post per channel (announce × 6, reminder × 3, recap × 2).
import { auth, err, ok, unauthorized } from '@/lib/api';
import { club } from '@/lib/data';
import { generatePosts } from '@/lib/social';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { id } = await ctx.params;
  const event = getStore().getEvent(id);
  if (!event) return err(404, 'not_found', `No event with id ${id}.`);
  const posts = generatePosts(event, club.name);
  return ok(posts, { total: posts.length, event_id: event.id });
}

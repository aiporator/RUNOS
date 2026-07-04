// GET /api/v1/public/events/{id} — instant event detail + live stats.
// PUBLIC: no auth. The manageKey is never exposed here — only the creation
// response (and the host's manage link) carry it.
import { err, ok } from '@/lib/api';
import { FREE_CAPACITY, getInstantEvent, stats } from '@/lib/instant';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx): Promise<Response> {
  const { id } = await ctx.params;
  const event = getInstantEvent(id);
  const eventStats = stats(id);
  if (!event || !eventStats) return err(404, 'not_found', `No instant event with id ${id}.`);
  const { manageKey: _manageKey, ...publicEvent } = event;
  return ok({
    ...publicEvent,
    free: event.capacity <= FREE_CAPACITY,
    requiresUpgrade: event.capacity > FREE_CAPACITY,
    stats: {
      confirmed: eventStats.confirmed,
      waitlist: eventStats.waitlist,
      spots_left: eventStats.spotsLeft,
    },
  });
}

// PATCH /api/v1/integrations/{id} — toggle connected/disconnected
import { auth, err, ok, unauthorized } from '@/lib/api';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { id } = await ctx.params;
  const integration = getStore().toggleIntegration(id);
  if (!integration) return err(404, 'not_found', `No integration with id ${id}.`);
  return ok(integration);
}

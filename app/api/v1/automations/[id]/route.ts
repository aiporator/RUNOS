// PATCH /api/v1/automations/{id} — enable or disable an automation
import { auth, err, isRecord, ok, parseBody, unauthorized } from '@/lib/api';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { id } = await ctx.params;
  const parsed = await parseBody<{ enabled: boolean }>(req, (body) => {
    if (!isRecord(body) || typeof body.enabled !== 'boolean') {
      return 'Field "enabled" is required and must be a boolean.';
    }
    return { enabled: body.enabled };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const automation = getStore().setAutomationEnabled(id, parsed.value.enabled);
  if (!automation) return err(404, 'not_found', `No automation with id ${id}.`);
  return ok(automation);
}

// PATCH /api/v1/sponsors/{id} — move a sponsor through the pipeline.
// Stage must be one of the six pipeline stages.
import { auth, err, isRecord, ok, parseBody, unauthorized } from '@/lib/api';
import { getStore, SPONSOR_STAGES, type SponsorStage } from '@/lib/store';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { id } = await ctx.params;
  const parsed = await parseBody<{ stage: SponsorStage; next_step?: string }>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { stage, next_step } = body;
    if (!SPONSOR_STAGES.includes(stage as SponsorStage)) {
      return `Field "stage" is required and must be one of: ${SPONSOR_STAGES.join(', ')}.`;
    }
    if (next_step !== undefined && typeof next_step !== 'string') {
      return 'Field "next_step" must be a string.';
    }
    return { stage: stage as SponsorStage, next_step: next_step as string | undefined };
  });
  if (!parsed.ok) return err(400, 'invalid_stage', parsed.message);

  const sponsor = getStore().updateSponsorStage(id, parsed.value.stage, parsed.value.next_step);
  if (!sponsor) return err(404, 'not_found', `No sponsor with id ${id}.`);
  return ok(sponsor);
}

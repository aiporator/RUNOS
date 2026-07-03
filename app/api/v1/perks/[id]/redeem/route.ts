// POST /api/v1/perks/{id}/redeem — redeem a perk for a member.
// Perks are a member benefit: no marketing.brands consent is required.
// Monthly redemption limits are enforced (409 limit_reached).
import { auth, created, err, isRecord, parseBody, unauthorized } from '@/lib/api';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { id } = await ctx.params;
  const parsed = await parseBody<{ member_id: string }>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    if (typeof body.member_id !== 'string' || body.member_id.length === 0) {
      return 'Field "member_id" is required and must be a string.';
    }
    return { member_id: body.member_id };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const result = getStore().redeemPerk(id, parsed.value.member_id);
  switch (result.kind) {
    case 'redeemed':
      return created({
        object: 'perk_redemption',
        id: result.redemption.id,
        perk_id: result.redemption.perkId,
        member_id: result.redemption.memberId,
        status: 'redeemed',
        code_issued: result.redemption.codeIssued,
        redeemed_at: result.redemption.redeemedAt,
        redemptions_this_month: result.perk.redemptions,
        monthly_limit: result.perk.monthlyLimit,
      });
    case 'limit_reached':
      return err(
        409,
        'limit_reached',
        `Perk ${id} has reached its monthly redemption limit of ${result.perk.monthlyLimit}.`,
      );
    case 'perk_inactive':
      return err(409, 'perk_inactive', `Perk ${id} is not currently active.`);
    case 'perk_not_found':
      return err(404, 'not_found', `No perk with id ${id}.`);
    case 'member_not_found':
      return err(404, 'not_found', `No member with id ${parsed.value.member_id}.`);
  }
}

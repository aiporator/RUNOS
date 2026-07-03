// GET /api/v1/members/{id} — consent-filtered detail
// PATCH /api/v1/members/{id} — update status / tags / tier
import {
  auth,
  err,
  isRecord,
  isStringArray,
  ok,
  parseBody,
  serializeMember,
  unauthorized,
} from '@/lib/api';
import { getStore, type UpdateMemberInput } from '@/lib/store';
import type { MemberStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const MEMBER_STATUSES: readonly MemberStatus[] = ['active', 'at-risk', 'lapsed', 'new'];
const TIERS = ['free', 'monthly', 'annual'] as const;

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { id } = await ctx.params;
  const member = getStore().getMember(id);
  if (!member) return err(404, 'not_found', `No member with id ${id}.`);
  // Consent filtering: activity aggregates require `activity.summary`;
  // health/medical fields are never exposed via the public API.
  return ok(serializeMember(member));
}

export async function PATCH(req: Request, ctx: Ctx): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { id } = await ctx.params;
  const parsed = await parseBody<UpdateMemberInput>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { status, tags, tier } = body;
    if (status === undefined && tags === undefined && tier === undefined) {
      return 'Provide at least one of "status", "tags", "tier".';
    }
    if (status !== undefined && !MEMBER_STATUSES.includes(status as MemberStatus)) {
      return `Field "status" must be one of: ${MEMBER_STATUSES.join(', ')}.`;
    }
    if (tags !== undefined && !isStringArray(tags)) {
      return 'Field "tags" must be an array of strings.';
    }
    if (tier !== undefined && !TIERS.includes(tier as (typeof TIERS)[number])) {
      return `Field "tier" must be one of: ${TIERS.join(', ')}.`;
    }
    return {
      status: status as MemberStatus | undefined,
      tags: tags as string[] | undefined,
      tier: tier as UpdateMemberInput['tier'],
    };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const member = getStore().updateMember(id, parsed.value);
  if (!member) return err(404, 'not_found', `No member with id ${id}.`);
  return ok(serializeMember(member));
}

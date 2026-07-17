// POST /api/v1/members/bulk — one operation across many members:
// { ids: string[], action: "status" | "tag" | "tier" | "message", value: string }
import { auth, created, err, isRecord, isStringArray, parseBody, unauthorized } from '@/lib/api';
import { getStore, type BulkMemberInput } from '@/lib/store';
import type { MemberStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const ACTIONS: readonly BulkMemberInput['action'][] = ['status', 'tag', 'tier', 'message'];
const MEMBER_STATUSES: readonly MemberStatus[] = ['active', 'at-risk', 'lapsed', 'new'];
const TIERS = ['free', 'monthly', 'annual'] as const;

export async function POST(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const parsed = await parseBody<BulkMemberInput>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { ids, action, value } = body;
    if (!isStringArray(ids) || ids.length === 0) {
      return 'Field "ids" is required and must be a non-empty array of member ids.';
    }
    if (ids.length > 500) return 'At most 500 members per bulk operation.';
    if (!ACTIONS.includes(action as BulkMemberInput['action'])) {
      return `Field "action" is required and must be one of: ${ACTIONS.join(', ')}.`;
    }
    if (typeof value !== 'string' || value.trim().length === 0) {
      return 'Field "value" is required and must be a non-empty string.';
    }
    if (action === 'status' && !MEMBER_STATUSES.includes(value as MemberStatus)) {
      return `For action "status", value must be one of: ${MEMBER_STATUSES.join(', ')}.`;
    }
    if (action === 'tier' && !TIERS.includes(value as (typeof TIERS)[number])) {
      return `For action "tier", value must be one of: ${TIERS.join(', ')}.`;
    }
    return { ids, action: action as BulkMemberInput['action'], value: value.trim() };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const affected = getStore().bulkMembers(parsed.value);
  if (affected === 0) return err(404, 'not_found', 'None of the given ids matched a member.');
  return created({ affected, action: parsed.value.action });
}

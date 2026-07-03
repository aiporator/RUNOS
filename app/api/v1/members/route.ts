// GET /api/v1/members — list (filters: ?status, ?q; cursor pagination)
// POST /api/v1/members — create a member
import {
  auth,
  created,
  err,
  isRecord,
  isStringArray,
  ok,
  paginate,
  parseBody,
  serializeMember,
  unauthorized,
} from '@/lib/api';
import { getStore, type CreateMemberInput } from '@/lib/store';
import type { ConsentScope, MemberStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const MEMBER_STATUSES: readonly MemberStatus[] = ['active', 'at-risk', 'lapsed', 'new'];
const TIERS = ['free', 'monthly', 'annual'] as const;
const CONSENT_SCOPES: readonly ConsentScope[] = [
  'profile.basic',
  'activity.summary',
  'activity.detailed',
  'health.medical',
  'location.live',
  'marketing.brands',
  'photos.appearances',
];

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const url = new URL(req.url);
  const statusParam = url.searchParams.get('status');
  if (statusParam !== null && !MEMBER_STATUSES.includes(statusParam as MemberStatus)) {
    return err(400, 'invalid_status', `status must be one of: ${MEMBER_STATUSES.join(', ')}.`);
  }
  const members = getStore().listMembers({
    status: (statusParam as MemberStatus | null) ?? undefined,
    q: url.searchParams.get('q') ?? undefined,
  });
  const { page, meta } = paginate(members, req);
  return ok(page.map(serializeMember), meta);
}

export async function POST(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const parsed = await parseBody<CreateMemberInput>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { name, email, tier, city, tags, consents } = body;
    if (typeof name !== 'string' || name.trim().length === 0) {
      return 'Field "name" is required and must be a non-empty string.';
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Field "email" is required and must be a valid email address.';
    }
    if (tier !== undefined && !TIERS.includes(tier as (typeof TIERS)[number])) {
      return `Field "tier" must be one of: ${TIERS.join(', ')}.`;
    }
    if (city !== undefined && typeof city !== 'string') return 'Field "city" must be a string.';
    if (tags !== undefined && !isStringArray(tags)) {
      return 'Field "tags" must be an array of strings.';
    }
    if (consents !== undefined) {
      if (
        !isStringArray(consents) ||
        !consents.every((c) => CONSENT_SCOPES.includes(c as ConsentScope))
      ) {
        return `Field "consents" must be an array of scopes: ${CONSENT_SCOPES.join(', ')}.`;
      }
    }
    return {
      name: name.trim(),
      email,
      tier: tier as CreateMemberInput['tier'],
      city: city as string | undefined,
      tags: tags as string[] | undefined,
      consents: consents as ConsentScope[] | undefined,
    };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const store = getStore();
  if (store.listMembers().some((m) => m.email.toLowerCase() === parsed.value.email.toLowerCase())) {
    return err(409, 'email_taken', `A member with email ${parsed.value.email} already exists.`);
  }
  const member = store.createMember(parsed.value);
  return created(serializeMember(member));
}

// GET /api/v1/challenges — active challenges with leaderboards
// POST /api/v1/challenges — create a new challenge
import { auth, created, err, isRecord, ok, paginate, parseBody, unauthorized } from '@/lib/api';
import { getStore, type CreateChallengeInput } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { page, meta } = paginate(getStore().listChallenges(), req);
  return ok(page, meta);
}

export async function POST(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const parsed = await parseBody<CreateChallengeInput>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { name, metric, target, unit, endsAt } = body;
    if (typeof name !== 'string' || name.trim().length === 0) {
      return 'Field "name" is required and must be a non-empty string.';
    }
    if (typeof metric !== 'string' || metric.trim().length === 0) {
      return 'Field "metric" is required and must be a non-empty string.';
    }
    if (typeof target !== 'number' || target <= 0) {
      return 'Field "target" is required and must be a positive number.';
    }
    if (typeof unit !== 'string' || unit.trim().length === 0) {
      return 'Field "unit" is required and must be a non-empty string.';
    }
    if (typeof endsAt !== 'string' || Number.isNaN(Date.parse(endsAt))) {
      return 'Field "endsAt" is required and must be an ISO 8601 date.';
    }
    return { name: name.trim(), metric: metric.trim(), target, unit: unit.trim(), endsAt };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);
  const challenge = getStore().createChallenge(parsed.value);
  return created(challenge);
}

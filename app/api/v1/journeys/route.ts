// GET /api/v1/journeys — automation journeys
// POST /api/v1/journeys — create a new journey (starts as draft)
import { auth, created, err, isRecord, ok, paginate, parseBody, unauthorized } from '@/lib/api';
import { getStore, type CreateJourneyInput } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { page, meta } = paginate(getStore().listJourneys(), req);
  return ok(page, meta);
}

export async function POST(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const parsed = await parseBody<CreateJourneyInput>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { name, trigger, conversionGoal } = body;
    if (typeof name !== 'string' || name.trim().length === 0) {
      return 'Field "name" is required and must be a non-empty string.';
    }
    if (typeof trigger !== 'string' || trigger.trim().length === 0) {
      return 'Field "trigger" is required and must be a non-empty string.';
    }
    if (typeof conversionGoal !== 'string' || conversionGoal.trim().length === 0) {
      return 'Field "conversionGoal" is required and must be a non-empty string.';
    }
    return { name: name.trim(), trigger: trigger.trim(), conversionGoal: conversionGoal.trim() };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);
  const journey = getStore().createJourney(parsed.value);
  return created(journey);
}

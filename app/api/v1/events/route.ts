// GET /api/v1/events — list (filters: ?status, ?type; cursor pagination)
// POST /api/v1/events — create an event (starts as draft)
import { auth, created, err, isRecord, ok, paginate, parseBody, unauthorized } from '@/lib/api';
import { getStore, type CreateEventInput } from '@/lib/store';
import type { EventStatus, EventType } from '@/lib/types';

export const dynamic = 'force-dynamic';

const EVENT_STATUSES: readonly EventStatus[] = ['draft', 'published', 'live', 'completed'];
const EVENT_TYPES: readonly EventType[] = ['long-run', 'tempo', 'social', 'race', 'track', 'trail'];

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const type = url.searchParams.get('type');
  if (status !== null && !EVENT_STATUSES.includes(status as EventStatus)) {
    return err(400, 'invalid_status', `status must be one of: ${EVENT_STATUSES.join(', ')}.`);
  }
  if (type !== null && !EVENT_TYPES.includes(type as EventType)) {
    return err(400, 'invalid_type', `type must be one of: ${EVENT_TYPES.join(', ')}.`);
  }
  const events = getStore().listEvents({
    status: (status as EventStatus | null) ?? undefined,
    type: (type as EventType | null) ?? undefined,
  });
  const { page, meta } = paginate(events, req);
  return ok(page, meta);
}

export async function POST(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const parsed = await parseBody<CreateEventInput>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { title, type, date, location, routeName, distanceKm, capacity, price, description } =
      body;
    if (typeof title !== 'string' || title.trim().length === 0) {
      return 'Field "title" is required and must be a non-empty string.';
    }
    if (!EVENT_TYPES.includes(type as EventType)) {
      return `Field "type" is required and must be one of: ${EVENT_TYPES.join(', ')}.`;
    }
    if (typeof date !== 'string' || Number.isNaN(Date.parse(date))) {
      return 'Field "date" is required and must be an ISO 8601 datetime.';
    }
    for (const [key, value] of Object.entries({ location, routeName, description })) {
      if (value !== undefined && typeof value !== 'string') {
        return `Field "${key}" must be a string.`;
      }
    }
    for (const [key, value] of Object.entries({ distanceKm, capacity, price })) {
      if (value !== undefined && (typeof value !== 'number' || value < 0)) {
        return `Field "${key}" must be a non-negative number.`;
      }
    }
    return {
      title: title.trim(),
      type: type as EventType,
      date,
      location: location as string | undefined,
      routeName: routeName as string | undefined,
      distanceKm: distanceKm as number | undefined,
      capacity: capacity as number | undefined,
      price: price as number | undefined,
      description: description as string | undefined,
    };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);
  const event = getStore().createEvent(parsed.value);
  return created(event);
}

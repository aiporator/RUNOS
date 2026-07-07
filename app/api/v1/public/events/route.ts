// GET  /api/v1/public/events — discover instant events. PUBLIC: no auth.
//      ?q= filters by title/location substring, ?vertical= filters by vertical.
// POST /api/v1/public/events — create an instant event. PUBLIC: no auth, no
// account. This is the frictionless wedge — the whole point is zero setup.
import { created, err, isRecord, ok, paginate, parseBody } from '@/lib/api';
import {
  createInstantEvent,
  FREE_CAPACITY,
  listInstantEvents,
  type CreateInstantEventInput,
} from '@/lib/instant';
import { VERTICALS, type VerticalId } from '@/lib/verticals';

export const dynamic = 'force-dynamic';

const VERTICAL_IDS = VERTICALS.map((v) => v.id);

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') ?? undefined;
  const rawVertical = url.searchParams.get('vertical');
  const vertical =
    rawVertical && VERTICAL_IDS.includes(rawVertical as VerticalId)
      ? (rawVertical as VerticalId)
      : undefined;

  const events = listInstantEvents({ q, vertical }).map((e) => ({
    id: e.id,
    title: e.title,
    hostName: e.hostName,
    vertical: e.vertical,
    type: e.type,
    date: e.date,
    location: e.location,
    capacity: e.capacity,
    price: e.price,
    public_url: `/e/${e.id}`,
  }));
  const { page, meta } = paginate(events, req);
  return ok(page, meta);
}

export async function POST(req: Request): Promise<Response> {
  const parsed = await parseBody<CreateInstantEventInput>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { title, hostName, vertical, type, date, location, capacity, price, description } = body;
    if (typeof title !== 'string' || title.trim().length === 0) {
      return 'Field "title" is required and must be a non-empty string.';
    }
    if (typeof date !== 'string' || Number.isNaN(Date.parse(date))) {
      return 'Field "date" is required and must be an ISO 8601 datetime.';
    }
    if (
      typeof capacity !== 'number' ||
      !Number.isInteger(capacity) ||
      capacity < 1 ||
      capacity > 500
    ) {
      return 'Field "capacity" is required and must be an integer between 1 and 500.';
    }
    for (const [key, value] of Object.entries({ hostName, type, location, description })) {
      if (value !== undefined && typeof value !== 'string') {
        return `Field "${key}" must be a string.`;
      }
    }
    if (vertical !== undefined && !VERTICAL_IDS.includes(vertical as VerticalId)) {
      return `Field "vertical" must be one of: ${VERTICAL_IDS.join(', ')}.`;
    }
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return 'Field "price" must be a non-negative number.';
    }
    return {
      title: title.trim(),
      hostName: hostName as string | undefined,
      vertical: vertical as VerticalId | undefined,
      type: type as string | undefined,
      date,
      location: location as string | undefined,
      capacity,
      price: price as number | undefined,
      description: description as string | undefined,
    };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const event = createInstantEvent(parsed.value);
  return created({
    id: event.id,
    public_url: `/e/${event.id}`,
    manage_url: `/e/${event.id}/manage?key=${event.manageKey}`,
    free: event.capacity <= FREE_CAPACITY,
    requiresUpgrade: event.capacity > FREE_CAPACITY,
  });
}

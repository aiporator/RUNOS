// GET /api/v1/events/{id} — event detail
// PATCH /api/v1/events/{id} — update event fields (incl. status transitions)
import { auth, err, isRecord, ok, parseBody, unauthorized } from '@/lib/api';
import { getStore, type UpdateEventInput } from '@/lib/store';
import type { EventStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const EVENT_STATUSES: readonly EventStatus[] = ['draft', 'published', 'live', 'completed'];

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { id } = await ctx.params;
  const event = getStore().getEvent(id);
  if (!event) return err(404, 'not_found', `No event with id ${id}.`);
  return ok(event);
}

export async function PATCH(req: Request, ctx: Ctx): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { id } = await ctx.params;
  const parsed = await parseBody<UpdateEventInput>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const patch: UpdateEventInput = {};
    const { title, status, date, location, routeName, description, weather } = body;
    const { distanceKm, capacity, price } = body;
    if (status !== undefined) {
      if (!EVENT_STATUSES.includes(status as EventStatus)) {
        return `Field "status" must be one of: ${EVENT_STATUSES.join(', ')}.`;
      }
      patch.status = status as EventStatus;
    }
    if (date !== undefined) {
      if (typeof date !== 'string' || Number.isNaN(Date.parse(date))) {
        return 'Field "date" must be an ISO 8601 datetime.';
      }
      patch.date = date;
    }
    const strings = { title, location, routeName, description, weather } as const;
    for (const [key, value] of Object.entries(strings)) {
      if (value !== undefined && typeof value !== 'string') {
        return `Field "${key}" must be a string.`;
      }
    }
    if (typeof title === 'string') patch.title = title;
    if (typeof location === 'string') patch.location = location;
    if (typeof routeName === 'string') patch.routeName = routeName;
    if (typeof description === 'string') patch.description = description;
    if (typeof weather === 'string') patch.weather = weather;
    const numbers = { distanceKm, capacity, price } as const;
    for (const [key, value] of Object.entries(numbers)) {
      if (value !== undefined && (typeof value !== 'number' || value < 0)) {
        return `Field "${key}" must be a non-negative number.`;
      }
    }
    if (typeof distanceKm === 'number') patch.distanceKm = distanceKm;
    if (typeof capacity === 'number') patch.capacity = capacity;
    if (typeof price === 'number') patch.price = price;
    if (Object.keys(patch).length === 0) return 'Provide at least one updatable field.';
    return patch;
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const event = getStore().updateEvent(id, parsed.value);
  if (!event) return err(404, 'not_found', `No event with id ${id}.`);
  return ok(event);
}

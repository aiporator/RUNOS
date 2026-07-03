// GET /api/v1/events/{id}/registrations — list registrations for an event
// POST /api/v1/events/{id}/registrations — register a member (capacity-aware:
// full events push the member onto the waitlist).
import { auth, created, err, isRecord, ok, paginate, parseBody, unauthorized } from '@/lib/api';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { id } = await ctx.params;
  const store = getStore();
  if (!store.getEvent(id)) return err(404, 'not_found', `No event with id ${id}.`);
  const { page, meta } = paginate(store.listRegistrations(id), req);
  return ok(page, meta);
}

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

  const result = getStore().createRegistration(id, parsed.value.member_id);
  switch (result.kind) {
    case 'registered':
      return created({
        object: 'registration',
        ...result.registration,
        event: { id: result.event.id, registered: result.event.registered, capacity: result.event.capacity },
      });
    case 'waitlisted':
      // Per api-architecture.md §2.2: full events respond 409 capacity_exceeded
      // and the member is queued on the waitlist.
      return err(
        409,
        'capacity_exceeded',
        `Event ${id} is full (capacity ${result.event.capacity}). Member added to waitlist at position ${result.position}.`,
      );
    case 'already_registered':
      return err(
        409,
        'already_registered',
        `Member ${parsed.value.member_id} is already registered for event ${id} (${result.registration.id}).`,
      );
    case 'event_not_found':
      return err(404, 'not_found', `No event with id ${id}.`);
    case 'member_not_found':
      return err(404, 'not_found', `No member with id ${parsed.value.member_id}.`);
  }
}

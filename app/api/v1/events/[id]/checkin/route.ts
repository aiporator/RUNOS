// POST /api/v1/events/{id}/checkin — idempotent check-in for a registered
// member. First call marks the registration checked in and increments the
// event counter; repeat calls report already_checked_in without side effects.
import { auth, err, isRecord, ok, parseBody, unauthorized } from '@/lib/api';
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

  const result = getStore().checkIn(id, parsed.value.member_id);
  switch (result.kind) {
    case 'checked_in':
      return ok({
        checked_in: true,
        already_checked_in: false,
        first_time: result.firstTime,
        registration_id: result.registration.id,
        checked_in_at: result.registration.checkedInAt,
        event_checked_in: result.event.checkedIn,
      });
    case 'already_checked_in':
      return ok({
        checked_in: true,
        already_checked_in: true,
        first_time: false,
        registration_id: result.registration.id,
        checked_in_at: result.registration.checkedInAt,
        event_checked_in: result.event.checkedIn,
      });
    case 'not_registered':
      return err(
        409,
        'member_not_registered',
        `Member ${parsed.value.member_id} is not registered for event ${id}.`,
      );
    case 'event_not_found':
      return err(404, 'not_found', `No event with id ${id}.`);
    case 'member_not_found':
      return err(404, 'not_found', `No member with id ${parsed.value.member_id}.`);
  }
}

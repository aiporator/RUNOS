// POST /api/v1/public/events/{id}/rsvp — reserve a spot on an instant event.
// PUBLIC: no auth. Capacity check decides confirmed vs waitlist; duplicate
// emails get a friendly 200 { status: 'already_registered' } instead of a 409.
import { created, err, isRecord, ok, parseBody } from '@/lib/api';
import { addRsvp } from '@/lib/instant';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

interface RsvpBody {
  name: string;
  email: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request, ctx: Ctx): Promise<Response> {
  const { id } = await ctx.params;
  const parsed = await parseBody<RsvpBody>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { name, email } = body;
    if (typeof name !== 'string' || name.trim().length === 0) {
      return 'Field "name" is required and must be a non-empty string.';
    }
    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
      return 'Field "email" is required and must be a valid email address.';
    }
    return { name: name.trim(), email: email.trim() };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const result = addRsvp(id, parsed.value.name, parsed.value.email);
  if (result.kind === 'event_not_found') {
    return err(404, 'not_found', `No instant event with id ${id}.`);
  }
  if (result.kind === 'already_registered') {
    return ok({ status: 'already_registered', rsvp_id: result.rsvp.id });
  }
  return created({ status: result.rsvp.status, rsvp_id: result.rsvp.id });
}

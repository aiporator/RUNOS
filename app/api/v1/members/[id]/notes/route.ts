// GET /api/v1/members/{id}/notes — internal notes and messages logged for a member
// POST /api/v1/members/{id}/notes — add a note or message
import { auth, created, err, isRecord, ok, parseBody, unauthorized } from '@/lib/api';
import { getStore } from '@/lib/store';
import type { MemberNote } from '@/lib/types';

export const dynamic = 'force-dynamic';

const NOTE_KINDS: readonly MemberNote['kind'][] = ['note', 'message'];

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { id } = await ctx.params;
  if (!getStore().getMember(id)) return err(404, 'not_found', `No member with id ${id}.`);
  return ok(getStore().listMemberNotes(id));
}

export async function POST(req: Request, ctx: Ctx): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { id } = await ctx.params;
  const parsed = await parseBody<{ kind: MemberNote['kind']; body: string }>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { kind, body: text } = body;
    if (!NOTE_KINDS.includes(kind as MemberNote['kind'])) {
      return `Field "kind" is required and must be one of: ${NOTE_KINDS.join(', ')}.`;
    }
    if (typeof text !== 'string' || text.trim().length === 0) {
      return 'Field "body" is required and must be a non-empty string.';
    }
    return { kind: kind as MemberNote['kind'], body: text.trim() };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const note = getStore().addMemberNote(id, parsed.value.kind, parsed.value.body);
  if (!note) return err(404, 'not_found', `No member with id ${id}.`);
  return created(note);
}

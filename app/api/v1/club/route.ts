// GET /api/v1/club — club settings (chapters, ownership, plan, danger-zone status)
// PATCH /api/v1/club — apply exactly one settings action per request:
//   { "add_chapter": string } | { "transfer_to_email": string } | { "status": "active" | "pending_deletion" }
import { auth, err, isRecord, ok, parseBody, unauthorized } from '@/lib/api';
import { getStore } from '@/lib/store';
import type { Club } from '@/lib/types';

export const dynamic = 'force-dynamic';

type ClubAction =
  | { kind: 'add_chapter'; name: string }
  | { kind: 'transfer'; email: string }
  | { kind: 'status'; status: Club['status'] };

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  return ok(getStore().getClub());
}

export async function PATCH(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const parsed = await parseBody<ClubAction>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { add_chapter, transfer_to_email, status } = body;
    const provided = [add_chapter, transfer_to_email, status].filter((v) => v !== undefined);
    if (provided.length !== 1) {
      return 'Provide exactly one of "add_chapter", "transfer_to_email", or "status".';
    }
    if (add_chapter !== undefined) {
      if (typeof add_chapter !== 'string' || add_chapter.trim().length === 0) {
        return 'Field "add_chapter" must be a non-empty string.';
      }
      return { kind: 'add_chapter', name: add_chapter.trim() };
    }
    if (transfer_to_email !== undefined) {
      if (typeof transfer_to_email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(transfer_to_email)) {
        return 'Field "transfer_to_email" must be a valid email address.';
      }
      return { kind: 'transfer', email: transfer_to_email };
    }
    if (status !== 'active' && status !== 'pending_deletion') {
      return 'Field "status" must be "active" or "pending_deletion".';
    }
    return { kind: 'status', status };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const store = getStore();
  const action = parsed.value;
  if (action.kind === 'add_chapter') return ok(store.addChapter(action.name));
  if (action.kind === 'transfer') return ok(store.transferOwnership(action.email));
  return ok(action.status === 'pending_deletion' ? store.scheduleDeactivation() : store.cancelDeactivation());
}

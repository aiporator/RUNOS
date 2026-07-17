// GET /api/v1/history — the undo stack: every recent mutation, newest first.
import { auth, ok, unauthorized } from '@/lib/api';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  return ok(getStore().listHistory());
}

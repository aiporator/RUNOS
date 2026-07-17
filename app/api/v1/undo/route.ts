// POST /api/v1/undo — revert the most recent mutation (snapshot-based).
import { auth, err, ok, unauthorized } from '@/lib/api';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const undone = getStore().undo();
  if (!undone) return err(409, 'nothing_to_undo', 'No mutations left in the undo history.');
  return ok({ undone: undone.label, at: undone.at });
}

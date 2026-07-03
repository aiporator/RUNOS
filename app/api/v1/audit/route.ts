// GET /api/v1/audit — audit log of every mutation, most recent first.
import { auth, ok, paginate, unauthorized } from '@/lib/api';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { page, meta } = paginate(getStore().listAudit(), req);
  return ok(page, meta);
}

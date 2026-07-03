// GET /api/v1/perks — benefits passport (cursor pagination)
import { auth, ok, paginate, unauthorized } from '@/lib/api';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { page, meta } = paginate(getStore().listPerks(), req);
  return ok(page, meta);
}

// POST /api/v1/club/api-key — issue a new live API key, invalidating the old one
import { auth, ok, unauthorized } from '@/lib/api';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  return ok(getStore().rotateApiKey());
}

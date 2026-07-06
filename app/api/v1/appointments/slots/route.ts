// GET /api/v1/appointments/slots — next open call slots. PUBLIC, no auth.
import { ok } from '@/lib/api';
import { getUpcomingSlots } from '@/lib/appointments';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  return ok(getUpcomingSlots(6));
}

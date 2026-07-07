// GET /api/v1/staff — organizers, coaches, and other staff roles
// POST /api/v1/staff — invite a new staff member
import { auth, created, err, isRecord, isStringArray, ok, unauthorized, parseBody } from '@/lib/api';
import { getStore, type InviteStaffInput } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  return ok(getStore().listStaff());
}

export async function POST(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const parsed = await parseBody<InviteStaffInput>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { name, email, roles } = body;
    if (typeof name !== 'string' || name.trim().length === 0) {
      return 'Field "name" is required and must be a non-empty string.';
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Field "email" is required and must be a valid email address.';
    }
    if (roles !== undefined && !isStringArray(roles)) {
      return 'Field "roles" must be an array of strings.';
    }
    return { name: name.trim(), email, roles: (roles as string[] | undefined) ?? [] };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const store = getStore();
  if (store.listStaff().some((s) => s.email.toLowerCase() === parsed.value.email.toLowerCase())) {
    return err(409, 'email_taken', `${parsed.value.email} is already on staff.`);
  }
  const member = store.inviteStaff(parsed.value);
  return created(member);
}

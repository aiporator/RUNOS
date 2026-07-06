// POST /api/v1/appointments — request a call/demo (UNAUTHENTICATED — funnel).
// GET  /api/v1/appointments — list requests (Bearer auth; cursor pagination).
import { auth, created, err, isRecord, ok, paginate, parseBody, unauthorized } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface Appointment {
  id: string;
  name: string;
  email: string;
  org_name?: string;
  vertical?: string;
  phone?: string;
  slot_iso?: string;
  slot_label?: string;
  notes?: string;
  source?: string;
  status: 'requested';
  receivedAt: string;
}

interface CreateAppointmentInput {
  name: string;
  email: string;
  org_name?: string;
  vertical?: string;
  phone?: string;
  slot_iso?: string;
  slot_label?: string;
  notes?: string;
  source?: string;
}

// Stashed on globalThis so requests survive Next.js dev hot-reloads
// (same pattern as lib/store.ts / api/v1/leads).
const globalWithAppointments = globalThis as typeof globalThis & { __runosAppointments?: Appointment[] };

function getAppointments(): Appointment[] {
  globalWithAppointments.__runosAppointments ??= [];
  return globalWithAppointments.__runosAppointments;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { page, meta } = paginate(getAppointments(), req);
  return ok(page, meta);
}

export async function POST(req: Request): Promise<Response> {
  const parsed = await parseBody<CreateAppointmentInput>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { name, email, org_name, vertical, phone, slot_iso, slot_label, notes, source } = body;
    if (typeof name !== 'string' || name.trim().length === 0) {
      return 'Field "name" is required and must be a non-empty string.';
    }
    if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
      return 'Field "email" is required and must be a valid email address.';
    }
    for (const [key, value] of Object.entries({ org_name, vertical, phone, slot_iso, slot_label, notes, source })) {
      if (value !== undefined && typeof value !== 'string') {
        return `Field "${key}" must be a string.`;
      }
    }
    if (typeof slot_iso === 'string' && Number.isNaN(Date.parse(slot_iso))) {
      return 'Field "slot_iso" must be an ISO 8601 datetime.';
    }
    return {
      name: name.trim(),
      email: email.trim(),
      org_name: org_name as string | undefined,
      vertical: vertical as string | undefined,
      phone: phone as string | undefined,
      slot_iso: slot_iso as string | undefined,
      slot_label: slot_label as string | undefined,
      notes: notes as string | undefined,
      source: source as string | undefined,
    };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const appointments = getAppointments();
  const appointment: Appointment = {
    id: `appt_${String(appointments.length + 1).padStart(3, '0')}`,
    ...parsed.value,
    status: 'requested',
    receivedAt: new Date().toISOString(),
  };
  appointments.push(appointment);
  return created({ id: appointment.id, status: appointment.status });
}

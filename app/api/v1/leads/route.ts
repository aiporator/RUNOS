// POST /api/v1/leads — capture a funnel lead (UNAUTHENTICATED — it's the self-serve funnel)
// GET  /api/v1/leads — list captured leads (Bearer ros_ auth; cursor pagination)
import { auth, created, err, isRecord, ok, paginate, parseBody, unauthorized } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface Lead {
  id: string;
  email?: string;
  org_name: string;
  vertical: string;
  city?: string;
  member_count?: number;
  first_event_title?: string;
  source?: string;
  receivedAt: string;
}

interface CreateLeadInput {
  email?: string;
  org_name: string;
  vertical: string;
  city?: string;
  member_count?: number;
  first_event_title?: string;
  source?: string;
}

// Stashed on globalThis so leads survive Next.js dev hot-reloads
// (same pattern as lib/store.ts).
const globalWithLeads = globalThis as typeof globalThis & { __runosLeads?: Lead[] };

function getLeads(): Lead[] {
  globalWithLeads.__runosLeads ??= [];
  return globalWithLeads.__runosLeads;
}

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { page, meta } = paginate(getLeads(), req);
  return ok(page, meta);
}

export async function POST(req: Request): Promise<Response> {
  const parsed = await parseBody<CreateLeadInput>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { email, org_name, vertical, city, member_count, first_event_title, source } = body;
    if (typeof org_name !== 'string' || org_name.trim().length === 0) {
      return 'Field "org_name" is required and must be a non-empty string.';
    }
    if (typeof vertical !== 'string' || vertical.trim().length === 0) {
      return 'Field "vertical" is required and must be a non-empty string.';
    }
    if (email !== undefined && typeof email !== 'string') return 'Field "email" must be a string.';
    if (city !== undefined && typeof city !== 'string') return 'Field "city" must be a string.';
    if (
      member_count !== undefined &&
      (typeof member_count !== 'number' || !Number.isFinite(member_count) || member_count < 0)
    ) {
      return 'Field "member_count" must be a non-negative number.';
    }
    if (first_event_title !== undefined && typeof first_event_title !== 'string') {
      return 'Field "first_event_title" must be a string.';
    }
    if (source !== undefined && typeof source !== 'string') return 'Field "source" must be a string.';
    return {
      email,
      org_name: org_name.trim(),
      vertical: vertical.trim(),
      city,
      member_count,
      first_event_title,
      source,
    };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const leads = getLeads();
  const lead: Lead = {
    id: `lead_${String(leads.length + 1).padStart(3, '0')}`,
    ...parsed.value,
    receivedAt: new Date().toISOString(),
  };
  leads.push(lead);
  return created({ id: lead.id, status: 'captured' });
}

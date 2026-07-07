// GET /api/v1/sponsors — sponsor pipeline (cursor pagination)
// POST /api/v1/sponsors — add a sponsor to the pipeline (starts at "lead")
import { auth, created, err, isRecord, ok, paginate, parseBody, unauthorized } from '@/lib/api';
import { getStore, type CreateSponsorInput } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { page, meta } = paginate(getStore().listSponsors(), req);
  return ok(page, meta);
}

export async function POST(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const parsed = await parseBody<CreateSponsorInput>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { name, industry, contact, dealValue } = body;
    if (typeof name !== 'string' || name.trim().length === 0) {
      return 'Field "name" is required and must be a non-empty string.';
    }
    if (typeof industry !== 'string' || industry.trim().length === 0) {
      return 'Field "industry" is required and must be a non-empty string.';
    }
    if (typeof contact !== 'string' || contact.trim().length === 0) {
      return 'Field "contact" is required and must be a non-empty string.';
    }
    if (typeof dealValue !== 'number' || dealValue < 0) {
      return 'Field "dealValue" is required and must be a non-negative number.';
    }
    return { name: name.trim(), industry: industry.trim(), contact: contact.trim(), dealValue };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);
  const sponsor = getStore().createSponsor(parsed.value);
  return created(sponsor);
}

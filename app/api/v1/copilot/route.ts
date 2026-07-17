// POST /api/v1/copilot — ask Pacer a question: { query: string }
// Answers are computed server-side from the live store (deterministic, zero
// external spend). If ANTHROPIC_API_KEY is ever set in the environment, the
// upgrade path is to feed reply.facts through the official @anthropic-ai/sdk
// for natural-language synthesis — the computed facts stay the source of truth.
import { auth, err, isRecord, ok, parseBody, unauthorized } from '@/lib/api';
import { askCopilot } from '@/lib/copilot';

export const dynamic = 'force-dynamic';

export async function POST(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const parsed = await parseBody<{ query: string }>(req, (body) => {
    if (!isRecord(body) || typeof body.query !== 'string' || body.query.trim().length === 0) {
      return 'Field "query" is required and must be a non-empty string.';
    }
    if (body.query.length > 500) return 'Field "query" must be 500 characters or fewer.';
    return { query: body.query.trim() };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const reply = askCopilot(parsed.value.query);
  return ok({ ...reply, engine: 'deterministic' });
}

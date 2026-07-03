// Strava inbound webhook receiver (demo).
// GET  — subscription verification handshake: echoes hub.challenge.
// POST — receives activity/athlete events and fast-acks { received: true }.
// Webhook receivers are NOT Bearer-gated: Strava cannot send RunOS API keys.
// Production verifies the subscription via hub.verify_token and processes
// events asynchronously (see api-architecture.md §5.1).
import { err, isRecord, parseBody } from '@/lib/api';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

interface StravaEvent {
  object_type: 'activity' | 'athlete';
  aspect_type: 'create' | 'update' | 'delete';
  owner_id: number | string;
  object_id?: number | string;
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const challenge = url.searchParams.get('hub.challenge');
  if (!challenge) {
    return err(400, 'missing_challenge', 'Query parameter "hub.challenge" is required.');
  }
  // Strava expects the challenge echoed back verbatim.
  return Response.json({ 'hub.challenge': challenge });
}

export async function POST(req: Request): Promise<Response> {
  const parsed = await parseBody<StravaEvent>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { object_type, aspect_type, owner_id, object_id } = body;
    if (object_type !== 'activity' && object_type !== 'athlete') {
      return 'Field "object_type" must be "activity" or "athlete".';
    }
    if (aspect_type !== 'create' && aspect_type !== 'update' && aspect_type !== 'delete') {
      return 'Field "aspect_type" must be one of: create, update, delete.';
    }
    if (typeof owner_id !== 'number' && typeof owner_id !== 'string') {
      return 'Field "owner_id" is required.';
    }
    return {
      object_type,
      aspect_type,
      owner_id,
      object_id: typeof object_id === 'number' || typeof object_id === 'string' ? object_id : undefined,
    };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const event = parsed.value;
  getStore().recordAudit(
    `webhook.strava.${event.object_type}.${event.aspect_type}`,
    `strava:${event.owner_id}`,
  );
  // Fast-ack; real ingestion (pull full activity, normalize, dedup) is async.
  return Response.json({ received: true });
}

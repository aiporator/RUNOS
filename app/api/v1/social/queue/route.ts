// GET  /api/v1/social/queue — list scheduled/posted/canceled social posts (paginated)
// POST /api/v1/social/queue — queue a post: { post_id?, channel, kind, body, scheduled_for }
import { auth, created, err, isRecord, ok, paginate, parseBody, unauthorized } from '@/lib/api';
import {
  CHANNELS, POST_KINDS, listQueue, schedulePost,
  type Channel, type PostKind,
} from '@/lib/social';

export const dynamic = 'force-dynamic';

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const { page, meta } = paginate(listQueue(), req);
  return ok(page, meta);
}

interface QueueInput {
  post_id?: string;
  channel: Channel;
  kind: PostKind;
  body: string;
  scheduled_for: string;
}

export async function POST(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const parsed = await parseBody<QueueInput>(req, (raw) => {
    if (!isRecord(raw)) return 'Body must be a JSON object.';
    const { post_id, channel, kind, body, scheduled_for } = raw;
    if (post_id !== undefined && typeof post_id !== 'string') {
      return 'Field "post_id" must be a string when provided.';
    }
    if (typeof channel !== 'string' || !CHANNELS.includes(channel as Channel)) {
      return `Field "channel" must be one of: ${CHANNELS.join(', ')}.`;
    }
    if (typeof kind !== 'string' || !POST_KINDS.includes(kind as PostKind)) {
      return `Field "kind" must be one of: ${POST_KINDS.join(', ')}.`;
    }
    if (typeof body !== 'string' || body.trim().length === 0) {
      return 'Field "body" must be a non-empty string.';
    }
    if (typeof scheduled_for !== 'string' || Number.isNaN(Date.parse(scheduled_for))) {
      return 'Field "scheduled_for" must be an ISO 8601 datetime.';
    }
    return {
      post_id,
      channel: channel as Channel,
      kind: kind as PostKind,
      body,
      scheduled_for,
    };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const input = parsed.value;
  const item = schedulePost(
    {
      id: input.post_id ?? `sp_adhoc_${input.channel}_${input.kind}`,
      channel: input.channel,
      kind: input.kind,
      body: input.body,
      suggestedAt: input.scheduled_for,
    },
    input.scheduled_for,
  );
  return created(item);
}

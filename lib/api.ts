// Shared helpers for the RunOS public REST API v1 route handlers.
// Conventions follow docs/03-architecture/api-architecture.md §1.2:
// Stripe-style error envelope, opaque cursor pagination, Bearer auth.
import type { ConsentScope, Member } from './types';

// ---------------------------------------------------------------------------
// Response envelopes
// ---------------------------------------------------------------------------

export interface PageMeta {
  next_cursor: string | null;
  total: number;
  [key: string]: unknown;
}

/** 200 success envelope: `{ data, meta? }`. */
export function ok(data: unknown, meta?: Record<string, unknown>, init?: ResponseInit): Response {
  return Response.json(meta === undefined ? { data } : { data, meta }, init);
}

/** 201 convenience wrapper. */
export function created(data: unknown): Response {
  return ok(data, undefined, { status: 201 });
}

const ERROR_TYPES: Record<number, string> = {
  400: 'invalid_request_error',
  401: 'authentication_error',
  403: 'permission_error',
  404: 'invalid_request_error',
  409: 'conflict_error',
  429: 'rate_limit_error',
  500: 'api_error',
};

let requestSeq = 0;

/** Stripe-style error envelope: `{ error: { type, code, message, request_id } }`. */
export function err(status: number, code: string, message: string): Response {
  requestSeq += 1;
  return Response.json(
    {
      error: {
        type: ERROR_TYPES[status] ?? 'api_error',
        code,
        message,
        request_id: `req_${String(requestSeq).padStart(6, '0')}`,
        doc_url: `https://docs.runos.com/errors#${code}`,
      },
    },
    { status },
  );
}

/** Standard 401 for missing/invalid Bearer tokens. */
export function unauthorized(): Response {
  return err(
    401,
    'unauthorized',
    'Missing or invalid API key. Send "Authorization: Bearer ros_…" (demo token: ros_demo).',
  );
}

// ---------------------------------------------------------------------------
// Auth — demo Bearer tokens. Any token with the `ros_` prefix is accepted
// (production uses sha256-stored scoped PATs; see api-architecture.md §3).
// ---------------------------------------------------------------------------

export function auth(req: Request): string | null {
  const header = req.headers.get('authorization');
  if (!header) return null;
  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  if (!match) return null;
  const token = match[1];
  return token.startsWith('ros_') ? token : null;
}

// ---------------------------------------------------------------------------
// Pagination — ?limit (default 20, max 100) and ?cursor (opaque base64url
// index cursor). Returns the page plus meta { next_cursor, total }.
// ---------------------------------------------------------------------------

function encodeCursor(offset: number): string {
  return Buffer.from(JSON.stringify({ o: offset }), 'utf8').toString('base64url');
}

function decodeCursor(cursor: string): number {
  try {
    const parsed: unknown = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'o' in parsed &&
      typeof (parsed as { o: unknown }).o === 'number' &&
      Number.isInteger((parsed as { o: number }).o) &&
      (parsed as { o: number }).o >= 0
    ) {
      return (parsed as { o: number }).o;
    }
  } catch {
    // fall through — invalid cursors restart from the beginning
  }
  return 0;
}

export function paginate<T>(items: T[], req: Request): { page: T[]; meta: PageMeta } {
  const url = new URL(req.url);
  const rawLimit = Number(url.searchParams.get('limit') ?? '20');
  const limit = Number.isFinite(rawLimit) ? Math.min(100, Math.max(1, Math.trunc(rawLimit))) : 20;
  const cursor = url.searchParams.get('cursor');
  const offset = cursor ? decodeCursor(cursor) : 0;
  const page = items.slice(offset, offset + limit);
  const nextOffset = offset + limit;
  return {
    page,
    meta: {
      next_cursor: nextOffset < items.length ? encodeCursor(nextOffset) : null,
      total: items.length,
    },
  };
}

// ---------------------------------------------------------------------------
// Body parsing — safe JSON parse + validation, no `any`.
// The validator receives `unknown` and returns either the typed value or an
// error message string (discriminated union result).
// ---------------------------------------------------------------------------

export type ParseResult<T> = { ok: true; value: T } | { ok: false; message: string };

export async function parseBody<T>(
  req: Request,
  validate: (body: unknown) => T | string,
): Promise<ParseResult<T>> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return { ok: false, message: 'Request body must be valid JSON.' };
  }
  const result = validate(raw);
  if (typeof result === 'string') return { ok: false, message: result };
  return { ok: true, value: result };
}

/** Narrowing helper for request bodies. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

// ---------------------------------------------------------------------------
// Consent filtering — the API never widens what the club can see.
// Without `activity.summary`, activity aggregates (weeklyKm, prs) are
// stripped and the required scope is listed. Health/medical fields never
// appear in the public API (the demo model holds none).
// ---------------------------------------------------------------------------

export type PublicMember = Omit<Member, 'weeklyKm' | 'prs'> &
  Partial<Pick<Member, 'weeklyKm' | 'prs'>> & { consent_required?: ConsentScope[] };

export function serializeMember(member: Member): PublicMember {
  if (member.consents.includes('activity.summary')) {
    return { ...member };
  }
  const { weeklyKm: _weeklyKm, prs: _prs, ...rest } = member;
  return { ...rest, consent_required: ['activity.summary'] };
}

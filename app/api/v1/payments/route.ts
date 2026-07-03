// GET /api/v1/payments — list payments (?status filter; cursor pagination)
// POST /api/v1/payments — record a payment (computes 0.5% platform fee)
import { auth, created, err, isRecord, ok, paginate, parseBody, unauthorized } from '@/lib/api';
import { getStore, type CreatePaymentInput } from '@/lib/store';
import type { PaymentKind, PaymentStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const PAYMENT_KINDS: readonly PaymentKind[] = ['membership', 'ticket', 'merch', 'marketplace'];
const PAYMENT_STATUSES: readonly PaymentStatus[] = ['succeeded', 'pending', 'failed', 'refunded'];

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  if (status !== null && !PAYMENT_STATUSES.includes(status as PaymentStatus)) {
    return err(400, 'invalid_status', `status must be one of: ${PAYMENT_STATUSES.join(', ')}.`);
  }
  const payments = getStore().listPayments((status as PaymentStatus | null) ?? undefined);
  const { page, meta } = paginate(payments, req);
  return ok(page, meta);
}

export async function POST(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const parsed = await parseBody<CreatePaymentInput>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { member_id, kind, description, amount } = body;
    if (typeof member_id !== 'string' || member_id.length === 0) {
      return 'Field "member_id" is required and must be a string.';
    }
    if (!PAYMENT_KINDS.includes(kind as PaymentKind)) {
      return `Field "kind" is required and must be one of: ${PAYMENT_KINDS.join(', ')}.`;
    }
    if (typeof description !== 'string' || description.trim().length === 0) {
      return 'Field "description" is required and must be a non-empty string.';
    }
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
      return 'Field "amount" is required and must be a positive number.';
    }
    return {
      memberId: member_id,
      kind: kind as PaymentKind,
      description: description.trim(),
      amount,
    };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);

  const store = getStore();
  if (!store.getMember(parsed.value.memberId)) {
    return err(404, 'not_found', `No member with id ${parsed.value.memberId}.`);
  }
  const payment = store.createPayment(parsed.value);
  return created(payment);
}

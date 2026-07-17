// GET /api/v1/automations — automations plus recent runs
// POST /api/v1/automations — create an automation (enabled immediately)
import { auth, created, err, isRecord, ok, parseBody, unauthorized } from '@/lib/api';
import { getStore, type CreateAutomationInput } from '@/lib/store';
import type { AutomationStep, AutomationStepKind, AutomationTrigger } from '@/lib/types';

export const dynamic = 'force-dynamic';

const TRIGGERS: readonly AutomationTrigger[] = [
  'member.created', 'payment.succeeded', 'checkin.recorded',
  'registration.created', 'sponsor.stage_changed', 'challenge.created',
];
const STEP_KINDS: readonly AutomationStepKind[] = [
  'send_receipt', 'send_message', 'add_tag', 'notify_staff', 'enroll_journey', 'update_leaderboard',
];

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const store = getStore();
  return ok({ automations: store.listAutomations(), runs: store.listAutomationRuns().slice(0, 20) });
}

export async function POST(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const parsed = await parseBody<CreateAutomationInput>(req, (body) => {
    if (!isRecord(body)) return 'Body must be a JSON object.';
    const { name, trigger, steps } = body;
    if (typeof name !== 'string' || name.trim().length === 0) {
      return 'Field "name" is required and must be a non-empty string.';
    }
    if (!TRIGGERS.includes(trigger as AutomationTrigger)) {
      return `Field "trigger" is required and must be one of: ${TRIGGERS.join(', ')}.`;
    }
    if (!Array.isArray(steps) || steps.length === 0) {
      return 'Field "steps" is required and must be a non-empty array.';
    }
    const validated: AutomationStep[] = [];
    for (const raw of steps) {
      if (!isRecord(raw) || !STEP_KINDS.includes(raw.kind as AutomationStepKind)) {
        return `Every step needs a "kind" — one of: ${STEP_KINDS.join(', ')}.`;
      }
      if (raw.value !== undefined && typeof raw.value !== 'string') {
        return 'Step "value" must be a string when provided.';
      }
      validated.push({ kind: raw.kind as AutomationStepKind, value: raw.value as string | undefined });
    }
    return { name: name.trim(), trigger: trigger as AutomationTrigger, steps: validated };
  });
  if (!parsed.ok) return err(400, 'invalid_request', parsed.message);
  return created(getStore().createAutomation(parsed.value));
}

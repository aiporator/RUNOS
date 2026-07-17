'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Zap } from 'lucide-react';
import type { AutomationStepKind, AutomationTrigger } from '@/lib/types';
import { useToast } from '@/components/toast';

const AUTH_HEADERS = { 'content-type': 'application/json', authorization: 'Bearer ros_demo' };

export const TRIGGER_LABELS: Record<AutomationTrigger, string> = {
  'member.created': 'A member joins',
  'payment.succeeded': 'A payment succeeds',
  'checkin.recorded': 'Someone checks in',
  'registration.created': 'Someone registers for an event',
  'sponsor.stage_changed': 'A sponsor moves stage',
  'challenge.created': 'A challenge launches',
};

export const STEP_LABELS: Record<AutomationStepKind, string> = {
  send_receipt: 'Send a receipt',
  send_message: 'Send a message',
  add_tag: 'Add a tag',
  notify_staff: 'Notify staff',
  enroll_journey: 'Enroll in a journey',
  update_leaderboard: 'Update the leaderboard',
};

const STEPS_WITH_VALUE: AutomationStepKind[] = ['send_message', 'add_tag'];

const inputCls =
  'w-full rounded-xl border border-line bg-bg-3 px-3.5 py-2.5 text-[13px] text-paper outline-none transition placeholder:text-muted-2 focus:border-volt/40';
const labelCls = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted';

interface DraftStep {
  kind: AutomationStepKind;
  value: string;
}

export function AutomationBuilder() {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState<AutomationTrigger>('member.created');
  const [steps, setSteps] = useState<DraftStep[]>([{ kind: 'send_message', value: '' }]);

  function reset() {
    setName('');
    setTrigger('member.created');
    setSteps([{ kind: 'send_message', value: '' }]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch('/api/v1/automations', {
        method: 'POST',
        headers: AUTH_HEADERS,
        body: JSON.stringify({
          name: name.trim(),
          trigger,
          steps: steps.map((s) => ({ kind: s.kind, value: s.value.trim() || undefined })),
        }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok) {
        toast({ message: `Automation “${name.trim()}” is live`, tone: 'success', undoable: true });
        setOpen(false);
        reset();
        router.refresh();
      } else {
        toast({ message: json?.error?.message ?? 'Could not create the automation', tone: 'error' });
      }
    } catch {
      toast({ message: 'Could not create the automation — network error', tone: 'error' });
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-press inline-flex items-center gap-2 rounded-full bg-volt px-4 py-2.5 text-[13px] font-bold text-ink transition hover:shadow-[0_6px_20px_rgba(205,251,80,0.3)]"
      >
        <Zap className="h-4 w-4" aria-hidden /> New automation
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-line bg-bg-2 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="mb-5 flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-volt/15 text-volt">
            <Zap className="h-4.5 w-4.5" aria-hidden />
          </span>
          <div>
            <div className="font-display text-[16px] font-semibold">New automation</div>
            <div className="text-[12px] text-muted">When this happens, do that — it runs on real events.</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="atm-name">Name</label>
            <input
              id="atm-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Welcome every new runner"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="atm-trigger">When…</label>
            <select
              id="atm-trigger"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value as AutomationTrigger)}
              className={inputCls}
            >
              {(Object.keys(TRIGGER_LABELS) as AutomationTrigger[]).map((t) => (
                <option key={t} value={t}>{TRIGGER_LABELS[t]}</option>
              ))}
            </select>
          </div>

          <div>
            <span className={labelCls}>Then…</span>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    value={step.kind}
                    aria-label={`Step ${i + 1} action`}
                    onChange={(e) => {
                      const kind = e.target.value as AutomationStepKind;
                      setSteps((s) => s.map((x, j) => (j === i ? { kind, value: x.value } : x)));
                    }}
                    className={inputCls + ' flex-1'}
                  >
                    {(Object.keys(STEP_LABELS) as AutomationStepKind[]).map((k) => (
                      <option key={k} value={k}>{STEP_LABELS[k]}</option>
                    ))}
                  </select>
                  {STEPS_WITH_VALUE.includes(step.kind) && (
                    <input
                      value={step.value}
                      aria-label={`Step ${i + 1} value`}
                      onChange={(e) => setSteps((s) => s.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                      placeholder={step.kind === 'add_tag' ? 'tag name' : 'message text'}
                      className={inputCls + ' flex-1'}
                    />
                  )}
                  {steps.length > 1 && (
                    <button
                      type="button"
                      aria-label={`Remove step ${i + 1}`}
                      onClick={() => setSteps((s) => s.filter((_, j) => j !== i))}
                      className="grid h-9 w-9 flex-none place-items-center rounded-xl text-muted transition hover:bg-white/5 hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {steps.length < 5 && (
              <button
                type="button"
                onClick={() => setSteps((s) => [...s, { kind: 'notify_staff', value: '' }])}
                className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-volt transition hover:opacity-80"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden /> Add step
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full border border-line px-4 py-2 text-[13px] font-semibold text-muted transition hover:text-paper"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !name.trim()}
            className="rounded-full bg-volt px-5 py-2 text-[13px] font-bold text-ink transition disabled:opacity-50"
          >
            {busy ? 'Creating…' : 'Create & enable'}
          </button>
        </div>
      </form>
    </div>
  );
}

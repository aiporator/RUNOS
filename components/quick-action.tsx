'use client';

// Reusable client primitives for the /app organizer dashboard's CTAs. Every
// dashboard mutation goes through the real /api/v1/* REST API (same Bearer
// convention as promote-studio.tsx) and then router.refresh() so the server
// component re-reads the live store — no separate internal API surface.
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';

const AUTH_HEADERS = { 'content-type': 'application/json', authorization: 'Bearer ros_demo' };

export type QuickActionField = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'textarea' | 'date' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
};

const inputCls =
  'w-full rounded-xl border border-line bg-bg-3 px-3.5 py-2.5 text-[13.5px] text-paper outline-none transition placeholder:text-muted-2 focus:border-volt/60';
const labelCls = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted';

async function postJson(endpoint: string, method: string, body?: unknown): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch(endpoint, {
      method,
      headers: AUTH_HEADERS,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!res.ok) {
      const json = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
      return { ok: false, message: json?.error?.message ?? 'Something went wrong — try again.' };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: 'Network hiccup — try again.' };
  }
}

/** A button that opens a small modal form, POSTs/PATCHes it, then refreshes the page. */
export function QuickActionButton({
  label, className, title, description, endpoint, method = 'POST', fields, submitLabel = 'Save', extraBody,
}: {
  label: ReactNode;
  className: string;
  title: string;
  description?: string;
  endpoint: string;
  method?: 'POST' | 'PATCH';
  fields: QuickActionField[];
  submitLabel?: string;
  /** Fixed fields merged into every submission, alongside the form fields. */
  extraBody?: Record<string, unknown>;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const formData = new FormData(e.currentTarget);
    const body: Record<string, unknown> = { ...extraBody };
    for (const f of fields) {
      const raw = formData.get(f.name);
      if (raw === null || raw === '') continue;
      body[f.name] = f.type === 'number' ? Number(raw) : String(raw);
    }
    const result = await postJson(endpoint, method, body);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.message ?? 'Something went wrong.');
      return;
    }
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {label}
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-[200] grid place-items-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => !submitting && setOpen(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-[440px] rounded-card border border-line bg-bg-2 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-action-title"
          >
            <h2 id="quick-action-title" className="font-display text-[17px] font-semibold">{title}</h2>
            {description ? <p className="mt-1.5 text-[13px] text-muted">{description}</p> : null}
            <form onSubmit={(e) => void handleSubmit(e)} className="mt-5 space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className={labelCls} htmlFor={`qa-${f.name}`}>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      id={`qa-${f.name}`}
                      name={f.name}
                      required={f.required}
                      placeholder={f.placeholder}
                      defaultValue={f.defaultValue}
                      rows={3}
                      className={`${inputCls} resize-y`}
                    />
                  ) : f.type === 'select' ? (
                    <select
                      id={`qa-${f.name}`}
                      name={f.name}
                      required={f.required}
                      defaultValue={f.defaultValue}
                      className={`${inputCls} appearance-none`}
                    >
                      {(f.options ?? []).map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`qa-${f.name}`}
                      name={f.name}
                      type={f.type ?? 'text'}
                      required={f.required}
                      placeholder={f.placeholder}
                      defaultValue={f.defaultValue}
                      className={inputCls}
                    />
                  )}
                </div>
              ))}
              {error ? (
                <div className="rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-[12.5px] text-danger">
                  {error}
                </div>
              ) : null}
              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-2 text-[13px] font-semibold text-muted transition hover:text-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-volt px-5 py-2.5 font-display text-[13.5px] font-semibold text-ink transition disabled:cursor-wait disabled:opacity-60"
                >
                  {submitting ? 'Saving…' : submitLabel}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

/** A single-click action, optionally confirm-gated, that hits the API and refreshes. */
export function InstantActionButton({
  label, busyLabel = '…', className, endpoint, method = 'POST', body, confirmMessage,
}: {
  label: ReactNode;
  busyLabel?: ReactNode;
  className: string;
  endpoint: string;
  method?: 'POST' | 'PATCH';
  body?: Record<string, unknown>;
  confirmMessage?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleClick(): Promise<void> {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    setBusy(true);
    await postJson(endpoint, method, body);
    setBusy(false);
    router.refresh();
  }

  return (
    <button type="button" className={className} onClick={() => void handleClick()} disabled={busy}>
      {busy ? busyLabel : label}
    </button>
  );
}

/** Downloads a GET endpoint's response as a file (data export). */
export function ExportButton({ label, busyLabel = 'Exporting…', className, endpoint, filename }: {
  label: ReactNode;
  busyLabel?: ReactNode;
  className: string;
  endpoint: string;
  filename: string;
}) {
  const [busy, setBusy] = useState(false);

  async function handleClick(): Promise<void> {
    setBusy(true);
    try {
      const res = await fetch(endpoint, { headers: { authorization: 'Bearer ros_demo' } });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" className={className} onClick={() => void handleClick()} disabled={busy}>
      {busy ? busyLabel : label}
    </button>
  );
}

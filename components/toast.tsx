'use client';

// App-wide toast system with action buttons and a 10s Undo that hits the real
// snapshot-based POST /api/v1/undo. Mounted once in the /app layout.
import { useRouter } from 'next/navigation';
import {
  createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode,
} from 'react';

export interface ToastAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ToastInput {
  message: string;
  tone?: 'success' | 'error' | 'info';
  /** Show a 10s Undo button that reverts the last mutation via the API. */
  undoable?: boolean;
  actions?: ToastAction[];
}

interface Toast extends ToastInput {
  id: number;
  undone?: boolean;
}

const ToastContext = createContext<{ push: (t: ToastInput) => void } | null>(null);

export function useToast(): (t: ToastInput) => void {
  const ctx = useContext(ToastContext);
  return ctx?.push ?? (() => undefined);
}

const TOAST_TTL_MS = 10_000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const router = useRouter();

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback((input: ToastInput) => {
    idRef.current += 1;
    const toast: Toast = { id: idRef.current, tone: 'success', ...input };
    setToasts((t) => [...t.slice(-2), toast]);
    window.setTimeout(() => dismiss(toast.id), TOAST_TTL_MS);
  }, [dismiss]);

  async function handleUndo(id: number): Promise<void> {
    setToasts((t) => t.map((x) => (x.id === id ? { ...x, undone: true, message: 'Undoing…' } : x)));
    try {
      const res = await fetch('/api/v1/undo', {
        method: 'POST',
        headers: { authorization: 'Bearer ros_demo' },
      });
      const json = (await res.json().catch(() => null)) as { data?: { undone: string } } | null;
      setToasts((t) =>
        t.map((x) =>
          x.id === id
            ? { ...x, message: json?.data ? `Undone — ${json.data.undone.toLowerCase()}` : 'Nothing to undo', actions: undefined }
            : x,
        ),
      );
      router.refresh();
    } catch {
      setToasts((t) => t.map((x) => (x.id === id ? { ...x, message: 'Undo failed — try again', tone: 'error' } : x)));
    }
  }

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[300] flex w-[360px] max-w-[92vw] flex-col gap-2.5">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={[
              'pointer-events-auto rounded-card border px-4 py-3.5 shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-lg fade-up',
              t.tone === 'error'
                ? 'border-danger/40 bg-danger/15'
                : t.tone === 'info'
                  ? 'border-info/40 bg-bg-2/95'
                  : 'border-volt/35 bg-bg-2/95',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className={['mt-0.5 font-display text-[13px] font-bold', t.tone === 'error' ? 'text-danger' : 'text-volt'].join(' ')}>
                  {t.tone === 'error' ? '✕' : '✓'}
                </span>
                <span className="text-[13.5px] leading-snug text-paper/95">{t.message}</span>
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="flex-none text-[13px] text-muted-2 transition hover:text-paper"
              >
                ✕
              </button>
            </div>
            {(t.actions?.length || (t.undoable && !t.undone)) ? (
              <div className="mt-2.5 flex flex-wrap items-center gap-2 pl-6">
                {t.actions?.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => {
                      if (a.href) router.push(a.href);
                      a.onClick?.();
                      dismiss(t.id);
                    }}
                    className="rounded-full border border-line bg-bg-3 px-3 py-1 text-[12px] font-semibold text-paper transition hover:border-volt/40"
                  >
                    {a.label}
                  </button>
                ))}
                {t.undoable && !t.undone ? (
                  <button
                    type="button"
                    onClick={() => void handleUndo(t.id)}
                    className="rounded-full bg-volt/15 px-3 py-1 text-[12px] font-semibold text-volt transition hover:bg-volt/25"
                  >
                    Undo
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

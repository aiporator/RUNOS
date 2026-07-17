'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui';
import { useToast } from '@/components/toast';

const AUTH_HEADERS = { 'content-type': 'application/json', authorization: 'Bearer ros_demo' };

interface CopilotAction {
  label: string;
  href?: string;
  endpoint?: string;
  method?: 'POST' | 'PATCH';
  body?: Record<string, unknown>;
  successMessage?: string;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'pacer';
  text: string;
  done: boolean;
  actions?: CopilotAction[];
}

const SUGGESTIONS = ['Who hasn’t paid?', 'Who’s gone quiet?', 'Why is attendance down?', 'Plan next month'];

export function PacerChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [runningAction, setRunningAction] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const idRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  function reveal(msgId: number, text: string, actions: CopilotAction[]) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setMessages((m) => [...m, { id: msgId, role: 'pacer', text, done: true, actions }]);
      setBusy(false);
      return;
    }
    setMessages((m) => [...m, { id: msgId, role: 'pacer', text: '', done: false, actions }]);
    let i = 0;
    const interval = window.setInterval(() => {
      i = Math.min(text.length, i + 3);
      const finished = i >= text.length;
      const slice = text.slice(0, i);
      setMessages((m) => m.map((msg) => (msg.id === msgId ? { ...msg, text: slice, done: finished } : msg)));
      if (finished) {
        window.clearInterval(interval);
        setBusy(false);
      }
    }, 16);
    timersRef.current.push(interval);
  }

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;
    setBusy(true);
    setInput('');
    setMessages((m) => [...m, { id: ++idRef.current, role: 'user', text, done: true }]);
    setTyping(true);

    try {
      const res = await fetch('/api/v1/copilot', {
        method: 'POST',
        headers: AUTH_HEADERS,
        body: JSON.stringify({ query: text }),
      });
      const json = await res.json();
      setTyping(false);
      if (!res.ok) {
        reveal(++idRef.current, json?.error?.message ?? 'Something went wrong — try again.', []);
        return;
      }
      reveal(++idRef.current, json.data.text as string, (json.data.actions ?? []) as CopilotAction[]);
    } catch {
      setTyping(false);
      reveal(++idRef.current, 'I couldn’t reach the club data just now — try again in a moment.', []);
    }
  }

  async function runAction(msgId: number, action: CopilotAction) {
    if (action.href) {
      router.push(action.href);
      return;
    }
    if (!action.endpoint) return;
    const key = `${msgId}:${action.label}`;
    if (runningAction) return;
    setRunningAction(key);
    try {
      const res = await fetch(action.endpoint, {
        method: action.method ?? 'POST',
        headers: AUTH_HEADERS,
        body: action.body ? JSON.stringify(action.body) : undefined,
      });
      const json = await res.json().catch(() => null);
      if (res.ok) {
        toast({ message: action.successMessage ?? `${action.label} — done`, tone: 'success', undoable: true });
        router.refresh();
      } else {
        toast({ message: json?.error?.message ?? `${action.label} failed`, tone: 'error' });
      }
    } catch {
      toast({ message: `${action.label} failed — network error`, tone: 'error' });
    } finally {
      setRunningAction(null);
    }
  }

  return (
    <Card pad={false} className="flex h-[640px] flex-col overflow-hidden fade-up-2">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-line px-5 py-4">
        <span className="relative flex-none">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-volt font-display text-[17px] font-bold text-ink">
            P
          </span>
          <span className="pulse-dot absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-ok ring-2 ring-bg-2" />
        </span>
        <div className="min-w-0">
          <div className="font-display text-[15px] font-semibold leading-tight">Pacer</div>
          <div className="text-[11.5px] text-muted">grounded in your club&rsquo;s data</div>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-ok/25 bg-ok/10 px-2.5 py-1 text-[10.5px] font-semibold text-ok">
          online
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="thin-scroll flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.length === 0 && (
          <div>
            <div className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-muted">
              <Sparkles size={14} className="text-volt" /> Ask Pacer anything about your club
            </div>
            <p className="text-[12.5px] leading-relaxed text-muted-2">
              Every answer is computed live from your own members, events, and payments — and comes with buttons that
              actually do the work.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-line bg-bg-3 px-3 py-1.5 text-[12px] font-medium text-paper/85 transition hover:border-volt/40 hover:text-volt"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) =>
          msg.role === 'user' ? (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-volt px-3.5 py-2.5 text-[13px] font-medium leading-relaxed text-ink">
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={msg.id}>
              <div className="max-w-[94%] whitespace-pre-line rounded-2xl rounded-bl-md border border-line bg-bg-3 px-3.5 py-2.5 text-[13px] leading-relaxed text-paper/90">
                {msg.text}
                {!msg.done && <span className="ml-0.5 inline-block h-3.5 w-[7px] animate-pulse rounded-[2px] bg-volt align-middle" />}
              </div>
              {msg.done && msg.actions && msg.actions.length > 0 && (
                <div className="mt-2.5">
                  <div className="flex flex-wrap gap-2">
                    {msg.actions.map((a, i) => {
                      const key = `${msg.id}:${a.label}`;
                      const running = runningAction === key;
                      return (
                        <button
                          key={a.label}
                          onClick={() => runAction(msg.id, a)}
                          disabled={runningAction !== null}
                          className={cn(
                            'rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition disabled:opacity-50',
                            i === 0
                              ? 'bg-volt text-ink hover:shadow-[0_6px_20px_rgba(205,251,80,0.3)]'
                              : 'border border-line text-paper/85 hover:border-volt/40 hover:text-volt',
                          )}
                        >
                          {running ? 'Working…' : a.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-1.5 text-[10.5px] text-muted-2">Every button runs a real action — undo included.</div>
                </div>
              )}
              {msg.done && (
                <div className="mt-1.5 text-[10.5px] text-muted-2">
                  Sources: members table · events · payments (your club only)
                </div>
              )}
            </div>
          ),
        )}

        {typing && (
          <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md border border-line bg-bg-3 px-3.5 py-3">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted motion-reduce:animate-none"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        className="flex items-center gap-2 border-t border-line px-4 py-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Pacer…"
          aria-label="Message Pacer"
          className="min-w-0 flex-1 rounded-full border border-line bg-bg-3 px-4 py-2.5 text-[13px] text-paper outline-none transition placeholder:text-muted-2 focus:border-volt/40"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send message"
          className="grid h-10 w-10 flex-none place-items-center rounded-full bg-volt text-ink transition hover:shadow-[0_6px_20px_rgba(205,251,80,0.3)] disabled:opacity-40 disabled:hover:shadow-none"
        >
          <Send size={16} strokeWidth={2.25} />
        </button>
      </form>
    </Card>
  );
}

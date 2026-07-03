'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { atRiskMembers, club, mrr, totalPerkRedemptions, weeklyMetrics } from '@/lib/data';
import { cn, money, pct, relativeDays } from '@/lib/utils';
import { Card } from '@/components/ui';

interface PacerReply {
  text: string;
  actions?: string[];
}

interface ChatMessage {
  id: number;
  role: 'user' | 'pacer';
  text: string;
  done: boolean;
  actions?: string[];
}

const SUGGESTIONS = ['Plan October', "Who's at risk of quitting?", 'Draft sponsor proposal', 'Forecast revenue'];

const risk = atRiskMembers();
const top3 = risk.slice(0, 3);
const currentMrr = mrr();
const forecastMrr = Math.round(currentMrr * 1.06);
const now = weeklyMetrics[weeklyMetrics.length - 1];

const REPLIES: Record<'plan' | 'risk' | 'sponsor' | 'revenue' | 'fallback', PacerReply> = {
  plan: {
    text:
      `Here's my October draft for ${club.name}:\n\n` +
      `• 4 Saturday long runs — Oct 3, 10, 17 & 24, rotating Harbor Loop 16K and Canal Ring 14K\n` +
      `• 10K Time Trial — Oct 18, chip-timed, capacity 120\n` +
      `• Halloween Social Run — Oct 30, easy 5K in costume, Dock 7 afterparty\n\n` +
      `Based on your last 12 weeks (attendance grew from 51 to a 74 peak), I forecast 62–75 runners per Saturday. ` +
      `I've drafted all five event pages, the newsletter, and an IG carousel. Publish?`,
    actions: ['Publish drafts', 'Edit plan'],
  },
  risk: {
    text:
      `${risk.length} members are currently flagged at-risk. Top 3 by churn risk:\n\n` +
      top3
        .map(
          (m, i) =>
            `${i + 1}. ${m.name} — ${pct(m.churnRisk)} risk, last seen ${relativeDays(m.lastSeen)}, attendance ${pct(m.attendanceRate)}`,
        )
        .join('\n') +
      `\n\nThe common pattern is a 3+ week attendance gap. The Win-back journey converts 41% back to an RSVP within 10 days — ` +
      `or I can draft personal "we miss you" notes from Maya for each of them.`,
    actions: ['Enroll in Win-back', 'Draft personal notes'],
  },
  sponsor: {
    text:
      `Draft sponsor proposal — ${club.name}:\n\n` +
      `Verified numbers: ${club.memberCount} members, 71% monthly active, 38 events last quarter, ` +
      `${totalPerkRedemptions()} perk redemptions all-time.\n\n` +
      `• Community — €1,500/yr: logo on all event pages + one perk slot\n` +
      `• Partner — €4,000/yr: above + demo activations at 2 events + newsletter feature\n` +
      `• Title — €9,000/yr: above + naming rights to the 10K Time Trial + quarterly impact report\n\n` +
      `Export as PDF?`,
    actions: ['Export as PDF', 'Edit tiers'],
  },
  revenue: {
    text:
      `MRR is ${money(currentMrr)} today. My forecast for next month is ${money(forecastMrr)} (+6%). Drivers:\n\n` +
      `• 3–5 new members joining weekly, mostly on the €12 monthly plan\n` +
      `• Annual renewals converting at 86% through the renewal journey\n` +
      `• Dunning recovering 71% of failed payments within 7 days\n` +
      `• 10K Time Trial tickets adding ~€260 one-off\n\n` +
      `Main risk: the ${risk.length} at-risk members. The Win-back journey is already on it.`,
    actions: ['See full forecast'],
  },
  fallback: {
    text:
      `Here's what I found across your club's data: ${club.memberCount} members, with ${now.wacm} active this week — a record. ` +
      `MRR is ${money(currentMrr)}, and the 10K Time Trial is at 87/120 registered, pacing to sell out around Jul 12. ` +
      `Ask me to plan a month, forecast revenue, draft a sponsor proposal, or dig into any member or event.`,
  },
};

function replyFor(text: string): PacerReply {
  const t = text.toLowerCase();
  if (t.includes('october') || t.includes('plan')) return REPLIES.plan;
  if (t.includes('risk') || t.includes('quit') || t.includes('churn')) return REPLIES.risk;
  if (t.includes('sponsor') || t.includes('proposal')) return REPLIES.sponsor;
  if (t.includes('revenue') || t.includes('forecast') || t.includes('mrr')) return REPLIES.revenue;
  return REPLIES.fallback;
}

export function PacerChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const idRef = useRef(0);
  const timersRef = useRef<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  function send(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;
    setBusy(true);
    setInput('');
    setMessages((m) => [...m, { id: ++idRef.current, role: 'user', text, done: true }]);
    setTyping(true);

    const reply = replyFor(text);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const timeout = window.setTimeout(() => {
      setTyping(false);
      const msgId = ++idRef.current;

      if (reduced) {
        setMessages((m) => [...m, { id: msgId, role: 'pacer', text: reply.text, done: true, actions: reply.actions }]);
        setBusy(false);
        return;
      }

      setMessages((m) => [...m, { id: msgId, role: 'pacer', text: '', done: false, actions: reply.actions }]);
      let i = 0;
      const interval = window.setInterval(() => {
        i = Math.min(reply.text.length, i + 2); // ~8ms per character
        const finished = i >= reply.text.length;
        const slice = reply.text.slice(0, i);
        setMessages((m) => m.map((msg) => (msg.id === msgId ? { ...msg, text: slice, done: finished } : msg)));
        if (finished) {
          window.clearInterval(interval);
          setBusy(false);
        }
      }, 16);
      timersRef.current.push(interval);
    }, 1000);
    timersRef.current.push(timeout);
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
              Plans, forecasts, drafts, and member insights — every answer is computed from your own members, events,
              and payments.
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
                    {msg.actions.map((a, i) => (
                      <button
                        key={a}
                        className={cn(
                          'rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold transition',
                          i === 0
                            ? 'bg-volt text-ink hover:shadow-[0_6px_20px_rgba(205,251,80,0.3)]'
                            : 'border border-line text-paper/85 hover:border-volt/40 hover:text-volt',
                        )}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                  <div className="mt-1.5 text-[10.5px] text-muted-2">You review everything before it&rsquo;s sent.</div>
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
          send(input);
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

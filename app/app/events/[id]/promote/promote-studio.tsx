'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowLeft, Check, Clapperboard, Facebook, Instagram, Linkedin,
  MessageCircle, Twitter, X,
} from 'lucide-react';
import { Badge, Card, CardTitle, EmptyState, PageHeader } from '@/components/ui';
import { track } from '@/lib/analytics';
import { AGGREGATOR, CONNECTORS, type Channel, type PostKind, type SocialPost } from '@/lib/social';
import { cn, formatDateTime } from '@/lib/utils';

export interface PromoteEventProps {
  id: string;
  title: string;
  date: string;
  location: string;
  status: string;
}

interface QueueItem {
  id: string;
  channel: Channel;
  kind: PostKind;
  scheduledFor: string;
}

const CHANNEL_META: Record<Channel, { label: string; Icon: typeof Instagram }> = {
  instagram: { label: 'Instagram', Icon: Instagram },
  facebook: { label: 'Facebook', Icon: Facebook },
  x: { label: 'X', Icon: Twitter },
  linkedin: { label: 'LinkedIn', Icon: Linkedin },
  tiktok: { label: 'TikTok', Icon: Clapperboard },
  whatsapp: { label: 'WhatsApp', Icon: MessageCircle },
};

const KIND_TONE: Record<PostKind, 'volt' | 'warn' | 'info'> = {
  announce: 'volt',
  reminder: 'warn',
  recap: 'info',
};

const EXTRA_LABELS: Record<string, string> = {
  hashtags: 'Hashtags',
  carousel: 'Carousel — slide outline',
  shots: 'Shot list',
  hook: 'Hook',
  sound: 'Sound',
  link: 'Link',
};

const TABS: Array<'all' | Channel> = ['all', 'instagram', 'facebook', 'x', 'linkedin', 'tiktok', 'whatsapp'];

function autoGrow(el: HTMLTextAreaElement | null): void {
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${el.scrollHeight + 2}px`;
}

export default function PromoteStudio({ event, posts }: { event: PromoteEventProps; posts: SocialPost[] }) {
  const [tab, setTab] = useState<'all' | Channel>('all');
  const [bodies, setBodies] = useState<Record<string, string>>(() =>
    Object.fromEntries(posts.map((p) => [p.id, p.body])),
  );
  const [scheduled, setScheduled] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const visible = tab === 'all' ? posts : posts.filter((p) => p.channel === tab);

  function schedule(post: SocialPost): void {
    if (scheduled[post.id]) return;
    const body = bodies[post.id] ?? post.body;
    setQueue((q) => [
      ...q,
      { id: post.id, channel: post.channel, kind: post.kind, scheduledFor: post.suggestedAt },
    ].sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor)));
    setScheduled((s) => ({ ...s, [post.id]: true }));
    // Fire-and-forget: mirror into the server-side queue (demo token).
    fetch('/api/v1/social/queue', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer ros_demo' },
      body: JSON.stringify({
        post_id: post.id,
        channel: post.channel,
        kind: post.kind,
        body,
        scheduled_for: post.suggestedAt,
      }),
    }).catch(() => {});
    track('promote_scheduled', { channel: post.channel, kind: post.kind });
  }

  function cancel(id: string): void {
    setQueue((q) => q.filter((item) => item.id !== id));
    setScheduled((s) => ({ ...s, [id]: false }));
  }

  function copy(post: SocialPost): void {
    const body = bodies[post.id] ?? post.body;
    const hashtags = post.extras?.hashtags;
    const text = Array.isArray(hashtags) ? `${body}\n\n${hashtags.join(' ')}` : body;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(post.id);
    window.setTimeout(() => setCopiedId((c) => (c === post.id ? null : c)), 1500);
    track('promote_generated', { channel: post.channel });
  }

  return (
    <div>
      <Link
        href={`/app/events/${event.id}`}
        className="mb-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted transition hover:text-volt"
      >
        <ArrowLeft size={13} /> Back to event
      </Link>
      <PageHeader
        kicker="Growth"
        title={`Promote — ${event.title}`}
        sub="Every event ships with its own campaign. Review, tweak, schedule."
      />

      {/* Channel tabs */}
      <div className="mb-5 flex flex-wrap gap-2 fade-up-1">
        {TABS.map((t) => {
          const count = t === 'all' ? posts.length : posts.filter((p) => p.channel === t).length;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 font-display text-[12.5px] font-semibold transition',
                tab === t
                  ? 'border-volt/40 bg-volt/15 text-volt'
                  : 'border-line text-muted hover:border-volt/30 hover:text-paper',
              )}
            >
              {t === 'all' ? 'All' : CHANNEL_META[t].label}
              <span className="ml-1.5 text-[11px] opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 fade-up-2 xl:grid-cols-3">
        {/* Post previews */}
        <div className="space-y-4 xl:col-span-2">
          {visible.map((post) => {
            const { label, Icon } = CHANNEL_META[post.channel];
            const isScheduled = Boolean(scheduled[post.id]);
            return (
              <Card key={post.id} pad={false} className="overflow-hidden">
                <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-line bg-bg-3">
                    <Icon size={15} className="text-paper/85" />
                  </span>
                  <span className="font-display text-[14px] font-semibold">{label}</span>
                  <Badge tone={KIND_TONE[post.kind]}>{post.kind}</Badge>
                  <span className="ml-auto text-[11.5px] text-muted-2">
                    suggested {formatDateTime(post.suggestedAt)}
                  </span>
                </div>

                {/* Phone-frame-ish preview */}
                <div className="px-5 py-4">
                  <div className="mx-auto max-w-xl rounded-2xl border border-line bg-bg-3 p-4">
                    <textarea
                      ref={autoGrow}
                      value={bodies[post.id] ?? post.body}
                      onChange={(e) => {
                        const value = e.currentTarget.value;
                        setBodies((b) => ({ ...b, [post.id]: value }));
                        autoGrow(e.currentTarget);
                      }}
                      spellCheck={false}
                      rows={2}
                      aria-label={`${label} ${post.kind} post`}
                      className="thin-scroll w-full resize-none overflow-hidden bg-transparent text-[13.5px] leading-relaxed text-paper/95 outline-none placeholder:text-muted-2"
                    />

                    {post.extras &&
                      Object.entries(post.extras).map(([key, value]) => (
                        <div key={key} className="mt-3 border-t border-line/60 pt-3">
                          <div className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted-2">
                            {EXTRA_LABELS[key] ?? key}
                          </div>
                          {Array.isArray(value) ? (
                            key === 'hashtags' ? (
                              <div className="flex flex-wrap gap-1.5">
                                {value.map((h) => (
                                  <span
                                    key={h}
                                    className="rounded-full bg-info/10 px-2 py-0.5 text-[11.5px] font-medium text-info"
                                  >
                                    {h}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <ol className="space-y-1">
                                {value.map((line, i) => (
                                  <li key={line} className="flex gap-2 text-[12.5px] leading-relaxed text-muted">
                                    <span className="flex-none font-display text-[11px] font-bold text-volt">
                                      {i + 1}
                                    </span>
                                    {line}
                                  </li>
                                ))}
                              </ol>
                            )
                          ) : (
                            <p className="text-[12.5px] leading-relaxed text-muted">{value}</p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-3.5">
                  <button
                    type="button"
                    onClick={() => schedule(post)}
                    disabled={isScheduled}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-[13px] font-semibold transition',
                      isScheduled
                        ? 'cursor-default bg-volt/15 text-volt'
                        : 'bg-volt text-ink hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)]',
                    )}
                  >
                    {isScheduled ? (
                      <>
                        Scheduled <Check size={14} strokeWidth={3} />
                      </>
                    ) : (
                      'Schedule'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => copy(post)}
                    className="rounded-full border border-line px-4 py-2 font-display text-[13px] font-semibold text-paper transition hover:border-volt/40"
                  >
                    {copiedId === post.id ? 'Copied ✓' : 'Copy'}
                  </button>
                  <span className="ml-auto text-[11.5px] text-muted-2">
                    {post.kind === 'announce' ? 'goes out now' : post.kind === 'reminder' ? 'T-24h before start' : 'T+2h after start'}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Right column: queue + connectors */}
        <div className="space-y-4">
          <Card>
            <CardTitle action={<span className="text-[12px] text-muted">{queue.length} scheduled</span>}>
              Queue
            </CardTitle>
            {queue.length === 0 ? (
              <EmptyState
                title="Nothing scheduled yet"
                sub="Schedule your first post — it lands here with its send time."
              />
            ) : (
              <div className="space-y-2">
                {queue.map((item) => {
                  const { label, Icon } = CHANNEL_META[item.channel];
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-2.5 rounded-xl border border-line bg-bg-3 px-3 py-2.5"
                    >
                      <Icon size={14} className="flex-none text-paper/80" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[12.5px] font-medium">
                          {label} <Badge tone={KIND_TONE[item.kind]}>{item.kind}</Badge>
                        </div>
                        <div className="mt-0.5 text-[11.5px] text-muted">{formatDateTime(item.scheduledFor)}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => cancel(item.id)}
                        aria-label={`Cancel scheduled ${label} ${item.kind} post`}
                        className="grid h-6 w-6 flex-none place-items-center rounded-full text-muted-2 transition hover:bg-danger/15 hover:text-danger"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card>
            <CardTitle
              action={
                <span className="text-[12px] text-muted">
                  {CONNECTORS.filter((c) => c.status === 'connected').length} connected
                </span>
              }
            >
              Channels
            </CardTitle>
            <div className="space-y-1">
              {CONNECTORS.map((c) => (
                <div key={c.channel} className="flex items-start gap-2.5 rounded-lg px-1 py-2">
                  <span
                    className={cn(
                      'mt-1.5 h-2 w-2 flex-none rounded-full',
                      c.status === 'connected' ? 'bg-volt' : 'bg-white/25',
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium">{CHANNEL_META[c.channel].label}</div>
                    <div className="mt-0.5 text-[11.5px] leading-relaxed text-muted">{c.note}</div>
                  </div>
                  {c.status === 'available' && (
                    <button
                      type="button"
                      className="flex-none rounded-full border border-line px-3 py-1 text-[11.5px] font-semibold text-paper transition hover:border-volt/40"
                    >
                      Connect
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-info/25 bg-info/8 px-3.5 py-3">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold">{AGGREGATOR.name}</span>
                <Badge tone="info">recommended</Badge>
              </div>
              <p className="mt-1 text-[11.5px] leading-relaxed text-muted">{AGGREGATOR.note}</p>
            </div>
          </Card>
        </div>
      </div>

      <p className="mt-6 max-w-3xl text-[12.5px] leading-relaxed text-muted-2 fade-up-3">
        Posting requires connected accounts. In this demo, scheduling queues the post and shows exactly what would go
        out — wire Meta/LinkedIn/X/TikTok or a Postiz/Ayrshare aggregator key in Platform → Integrations to go live.
      </p>
    </div>
  );
}

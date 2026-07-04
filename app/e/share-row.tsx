'use client';

// Share row for instant events — copy link, WhatsApp, and an IG-style caption.
// The absolute URL is resolved at click time from window.location.origin so
// the same component works on any deploy.
import { useState } from 'react';
import { Check, Copy, MessageCircle, Sparkles } from 'lucide-react';
import { track } from '@/lib/analytics';
import { generateInstantCaption, type CaptionEvent } from '@/lib/instant';

const btnCls =
  'inline-flex items-center gap-2 rounded-full border border-line bg-bg-3 px-4 py-2.5 text-[13px] font-semibold text-paper transition hover:border-volt/50 hover:text-volt';

function fullUrl(path: string): string {
  return typeof window === 'undefined' ? path : window.location.origin + path;
}

export default function ShareRow({ path, event }: { path: string; event: CaptionEvent }) {
  const [copied, setCopied] = useState<'link' | 'caption' | null>(null);

  function flash(which: 'link' | 'caption'): void {
    setCopied(which);
    window.setTimeout(() => setCopied((c) => (c === which ? null : c)), 1600);
  }

  function copyLink(): void {
    void navigator.clipboard.writeText(fullUrl(path)).catch(() => {});
    track('instant_event_shared', { channel: 'copy_link' });
    flash('link');
  }

  function shareWhatsApp(): void {
    const text = `${event.title} — save your spot: ${fullUrl(path)}`;
    track('instant_event_shared', { channel: 'whatsapp' });
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  }

  function copyCaption(): void {
    const caption = generateInstantCaption(event, fullUrl(path));
    void navigator.clipboard.writeText(caption).catch(() => {});
    track('instant_event_shared', { channel: 'caption' });
    flash('caption');
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      <button type="button" onClick={copyLink} className={btnCls}>
        {copied === 'link' ? <Check size={14} className="text-volt" /> : <Copy size={14} />}
        {copied === 'link' ? 'Copied!' : 'Copy link'}
      </button>
      <button type="button" onClick={shareWhatsApp} className={btnCls}>
        <MessageCircle size={14} /> WhatsApp
      </button>
      <button type="button" onClick={copyCaption} className={btnCls}>
        {copied === 'caption' ? <Check size={14} className="text-volt" /> : <Sparkles size={14} />}
        {copied === 'caption' ? 'Caption copied!' : 'Copy caption'}
      </button>
    </div>
  );
}

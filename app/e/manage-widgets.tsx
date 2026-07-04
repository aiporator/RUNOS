'use client';

// Small client widgets for the host's manage page: the copyable public URL
// and the tracked upgrade CTA.
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Check, Copy } from 'lucide-react';
import { track } from '@/lib/analytics';

export function CopyLinkField({ path }: { path: string }) {
  const [url, setUrl] = useState(path);
  const [copied, setCopied] = useState(false);

  // Resolve the absolute URL after mount — avoids a hydration mismatch.
  useEffect(() => {
    setUrl(window.location.origin + path);
  }, [path]);

  function copy(): void {
    void navigator.clipboard.writeText(url).catch(() => {});
    track('instant_event_shared', { channel: 'manage_copy_link' });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        readOnly
        value={url}
        aria-label="Public event URL"
        onFocus={(e) => e.target.select()}
        className="w-full min-w-0 rounded-xl border border-line bg-bg-3 px-4 py-3 font-mono text-[12.5px] text-paper focus:border-volt/50 focus:outline-none"
      />
      <button
        type="button"
        onClick={copy}
        className="inline-flex flex-none items-center gap-1.5 rounded-full bg-volt px-4 py-2.5 font-display text-[13px] font-semibold text-ink transition hover:shadow-[0_8px_24px_rgba(205,251,80,0.3)]"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export function UpgradeCta() {
  return (
    <Link
      href="/start"
      onClick={() => track('instant_upgrade_clicked')}
      className="group inline-flex items-center gap-2 rounded-full bg-volt px-6 py-3 font-display text-[14.5px] font-semibold text-ink transition hover:shadow-[0_10px_32px_rgba(205,251,80,0.35)]"
    >
      Upgrade to a full workspace — free
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

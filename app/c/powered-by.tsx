'use client';

// Funnel loop — every public event page sells RunOS back to the visitor.
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { track } from '@/lib/analytics';

export default function PoweredByBanner() {
  return (
    <div className="mt-10 rounded-card border border-volt/25 bg-volt/6 p-6 text-center sm:p-8">
      <div className="mx-auto mb-3 flex items-center justify-center gap-2 font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-volt">
        <span className="pulse-dot h-2 w-2 rounded-full bg-volt" /> Powered by RunOS
      </div>
      <p className="mx-auto max-w-md text-[14.5px] text-muted">
        This page was auto-generated the moment the event was published — landing page, registration, reminders, and
        check-in included.
      </p>
      <Link
        href="/start"
        onClick={() => track('cta_clicked', { cta: 'public_event_powered_by' })}
        className="group mt-5 inline-flex items-center gap-2 rounded-full bg-volt px-6 py-3 font-display text-[14.5px] font-semibold text-ink transition hover:shadow-[0_10px_32px_rgba(205,251,80,0.35)]"
      >
        Run your own community free
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

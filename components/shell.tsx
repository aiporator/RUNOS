'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BarChart3, Bell, Calendar, CalendarPlus, Download, FileClock, Handshake, LayoutDashboard,
  Megaphone, QrCode, Rocket, Search, Settings2, Sparkles, Trophy, UserPlus, Users, Wallet, X, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/app/community', label: 'Community', icon: Users },
  { href: '/app/events', label: 'Events', icon: Calendar },
  { href: '/app/money', label: 'Money', icon: Wallet },
  { href: '/app/growth', label: 'Growth', icon: Rocket },
  { href: '/app/engage', label: 'Engage', icon: Trophy },
  { href: '/app/partners', label: 'Partners', icon: Handshake },
  { href: '/app/intelligence', label: 'Intelligence', icon: BarChart3 },
  { href: '/app/platform', label: 'Platform', icon: Settings2 },
];

const ACTIONS = [
  { label: 'New event', href: '/app/events/new', icon: CalendarPlus, keywords: 'create event run session' },
  { label: 'Invite member', href: '/app/community', icon: UserPlus, keywords: 'add member invite' },
  { label: 'Open check-in', href: '/app/events', icon: QrCode, keywords: 'qr scan door' },
  { label: 'New challenge', href: '/app/engage', icon: Trophy, keywords: 'launch challenge leaderboard' },
  { label: 'Add sponsor', href: '/app/partners', icon: Handshake, keywords: 'sponsor deal pipeline' },
  { label: 'New journey', href: '/app/growth', icon: Rocket, keywords: 'automation journey' },
  { label: 'Create payment link', href: '/app/money', icon: Wallet, keywords: 'charge payment invoice' },
  { label: 'Promote an event', href: '/app/events', icon: Megaphone, keywords: 'social posts campaign' },
  { label: 'Export club data', href: '/app/platform', icon: Download, keywords: 'export gdpr backup csv json' },
  { label: 'Invite staff', href: '/app/platform', icon: UserPlus, keywords: 'staff coach organizer roles' },
];

interface SearchHit {
  type: string;
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

const TYPE_LABEL: Record<string, string> = {
  member: 'Member', event: 'Event', sponsor: 'Sponsor', payment: 'Payment',
  challenge: 'Challenge', journey: 'Journey', staff: 'Staff', note: 'Note',
};

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [selected, setSelected] = useState(0);
  const router = useRouter();

  const navResults = useMemo(
    () => NAV.filter((n) => n.label.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  const actionResults = useMemo(
    () =>
      q.trim().length === 0
        ? ACTIONS.slice(0, 5)
        : ACTIONS.filter((a) => `${a.label} ${a.keywords}`.toLowerCase().includes(q.toLowerCase())),
    [q],
  );

  useEffect(() => {
    if (open) {
      setQ('');
      setHits([]);
      setSelected(0);
    }
  }, [open]);

  // Debounced universal search against the real store.
  useEffect(() => {
    if (q.trim().length < 2) {
      setHits([]);
      return;
    }
    const t = window.setTimeout(() => {
      fetch(`/api/v1/search?q=${encodeURIComponent(q)}`, { headers: { authorization: 'Bearer ros_demo' } })
        .then((r) => r.json() as Promise<{ data?: SearchHit[] }>)
        .then((json) => setHits(json.data ?? []))
        .catch(() => setHits([]));
    }, 140);
    return () => window.clearTimeout(t);
  }, [q]);

  const rows = useMemo(() => {
    const out: { key: string; icon?: typeof Zap; label: string; sub?: string; href: string; badge?: string }[] = [];
    for (const a of actionResults) out.push({ key: `act-${a.label}`, icon: a.icon, label: a.label, href: a.href, badge: 'Action' });
    for (const n of navResults) out.push({ key: `nav-${n.href}`, icon: n.icon, label: n.label, href: n.href, badge: 'Go to' });
    for (const h of hits) out.push({ key: `hit-${h.type}-${h.id}`, label: h.title, sub: h.subtitle, href: h.href, badge: TYPE_LABEL[h.type] ?? h.type });
    return out;
  }, [actionResults, navResults, hits]);

  useEffect(() => {
    setSelected((s) => Math.min(s, Math.max(0, rows.length - 1)));
  }, [rows]);

  if (!open) return null;

  const go = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-start justify-center bg-black/60 pt-[14vh] backdrop-blur-sm" onClick={onClose} role="presentation">
      <div
        className="w-[600px] max-w-[92vw] overflow-hidden rounded-card border border-line bg-bg-2 shadow-2xl fade-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <Sparkles size={16} className="text-volt" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(rows.length - 1, s + 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(0, s - 1)); }
              if (e.key === 'Enter' && rows[selected]) { e.preventDefault(); go(rows[selected].href); }
            }}
            placeholder="Search members, events, payments… or run an action"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-2"
          />
          <button onClick={onClose} aria-label="Close" className="text-muted hover:text-paper">
            <X size={16} />
          </button>
        </div>
        <div className="thin-scroll max-h-[380px] overflow-y-auto p-2">
          {rows.map((r, i) => (
            <button
              key={r.key}
              onClick={() => go(r.href)}
              onMouseEnter={() => setSelected(i)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                i === selected ? 'bg-volt/12 text-paper' : 'hover:bg-white/5',
              )}
            >
              {r.icon ? <r.icon size={15} className={i === selected ? 'text-volt' : 'text-muted'} /> : <Search size={15} className="text-muted-2" />}
              <span className="min-w-0 flex-1 truncate">
                {r.label}
                {r.sub ? <span className="ml-2 text-[12px] text-muted-2">{r.sub}</span> : null}
              </span>
              <span className="flex-none rounded border border-line px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-2">
                {r.badge}
              </span>
            </button>
          ))}
          {q.trim().length >= 2 && rows.length === 0 ? (
            <div className="px-3 py-6 text-center text-[13px] text-muted-2">Nothing matches “{q}”.</div>
          ) : null}
          {q && (
            <button
              onClick={() => go('/app/intelligence')}
              className="mt-1 flex w-full items-center gap-3 rounded-lg bg-volt/10 px-3 py-2.5 text-left text-sm text-volt hover:bg-volt/15"
            >
              <Zap size={15} />
              Ask Pacer: “{q}”
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 border-t border-line px-4 py-2 text-[10.5px] text-muted-2">
          <span><kbd className="rounded border border-line px-1">↑↓</kbd> navigate</span>
          <span><kbd className="rounded border border-line px-1">↵</kbd> open</span>
          <span><kbd className="rounded border border-line px-1">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

interface AuditRow {
  id: string;
  action: string;
  entity: string;
  at: string;
}

const ACTION_LABELS: Record<string, string> = {
  'member.created': 'New member joined',
  'member.updated': 'Member updated',
  'member.note_added': 'Note added to a member',
  'member.messaged': 'Message sent to a member',
  'event.created': 'Event created',
  'event.updated': 'Event updated',
  'registration.created': 'New registration',
  'registration.waitlisted': 'Registration waitlisted',
  'checkin.recorded': 'Check-in recorded',
  'payment.succeeded': 'Payment collected',
  'sponsor.created': 'Sponsor added to pipeline',
  'sponsor.stage_changed': 'Sponsor moved stage',
  'perk.redeemed': 'Perk redeemed',
  'challenge.created': 'Challenge launched',
  'journey.created': 'Journey created',
  'staff.invited': 'Staff invited',
  'integration.connected': 'Integration connected',
  'integration.disconnected': 'Integration disconnected',
  'club.chapter_added': 'Chapter added',
  'club.api_key_rotated': 'API key rotated',
  'club.ownership_transferred': 'Ownership transferred',
  'club.deactivation_scheduled': 'Deactivation scheduled',
  'club.deactivation_cancelled': 'Deactivation cancelled',
  'club.data_exported': 'Data export generated',
};

function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<AuditRow[] | null>(null);
  const [seen, setSeen] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setRows(null);
    fetch('/api/v1/audit?limit=8', { headers: { authorization: 'Bearer ros_demo' } })
      .then((r) => r.json() as Promise<{ data?: AuditRow[] }>)
      .then((json) => {
        setRows(json.data ?? []);
        setSeen((json.data ?? []).length);
      })
      .catch(() => setRows([]));
  }, [open]);

  useEffect(() => {
    const onClickAway = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onClickAway);
    return () => window.removeEventListener('mousedown', onClickAway);
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative grid h-8 w-8 place-items-center rounded-full border border-line text-muted transition hover:border-volt/40 hover:text-paper"
      >
        <Bell size={14} />
        {seen === 0 ? <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-volt" /> : null}
      </button>
      {open ? (
        <div className="absolute right-0 top-10 z-50 w-[340px] overflow-hidden rounded-card border border-line bg-bg-2 shadow-2xl fade-up">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <span className="font-display text-[13px] font-semibold">Activity</span>
            <FileClock size={13} className="text-muted-2" />
          </div>
          <div className="thin-scroll max-h-[320px] overflow-y-auto p-2">
            {rows === null ? (
              <div className="space-y-2 p-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="mk-shimmer h-9 rounded-lg" />
                ))}
              </div>
            ) : rows.length === 0 ? (
              <div className="px-3 py-6 text-center text-[12.5px] text-muted-2">
                Quiet so far — actions you take show up here instantly.
              </div>
            ) : (
              rows.map((r) => (
                <div key={r.id} className="flex items-start gap-2.5 rounded-lg px-3 py-2 hover:bg-white/4">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-volt" />
                  <div className="min-w-0">
                    <div className="truncate text-[13px]">{ACTION_LABELS[r.action] ?? r.action}</div>
                    <div className="font-mono text-[10.5px] text-muted-2">{r.entity}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (
        e.key === '/' &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target instanceof HTMLSelectElement)
      ) {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if (e.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[228px] flex-col border-r border-line bg-bg-2/60 px-4 py-5 md:flex">
        <Link href="/" className="mb-7 flex items-center gap-2.5 px-2 font-display text-lg font-bold tracking-tight">
          <span className="pulse-dot h-2.5 w-2.5 rounded-full bg-volt shadow-[0_0_12px_#cdfb50]" />
          RunOS
        </Link>
        <div className="mb-5 rounded-xl border border-line bg-bg-3 px-3 py-2.5">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-2">Club</div>
          <div className="mt-0.5 font-display text-[13.5px] font-semibold">Harbor City Runners</div>
          <div className="text-[11px] text-muted">Pro plan · 48 members</div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV.map((item) => {
            const active = item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors',
                  active ? 'bg-volt text-ink' : 'text-muted hover:bg-white/5 hover:text-paper',
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => setPaletteOpen(true)}
          className="mt-4 flex items-center gap-2.5 rounded-lg border border-line px-3 py-2 text-[12.5px] text-muted transition hover:border-volt/40 hover:text-paper"
        >
          <Search size={14} />
          Search &amp; commands
          <kbd className="ml-auto rounded border border-line px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </button>
      </aside>

      <div className="flex-1 md:pl-[228px]">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-bg/80 px-5 py-3 backdrop-blur-lg md:px-8">
          <div className="flex items-center gap-2 font-display text-sm font-semibold md:hidden">
            <span className="h-2 w-2 rounded-full bg-volt" /> RunOS
          </div>
          <div className="hidden text-[13px] text-muted md:block">
            Thursday, 2 July · <span className="text-paper">Saturday Long Run in 2 days — 64 registered</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-volt/30 bg-volt/10 px-3 py-1 text-[11.5px] font-semibold text-volt sm:block">
              WACM 41 · +8% w/w
            </span>
            <NotificationsBell />
            <span className="grid h-8 w-8 place-items-center rounded-full bg-volt font-display text-[12px] font-bold text-ink">
              MO
            </span>
          </div>
        </header>
        <main className="px-5 py-7 md:px-8">{children}</main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-line bg-bg-2/95 py-2 backdrop-blur-lg md:hidden">
        {NAV.slice(0, 5).map((item) => {
          const active = item.href === '/app' ? pathname === '/app' : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={cn('grid place-items-center gap-0.5 px-3 py-1 text-[10px]', active ? 'text-volt' : 'text-muted')}>
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

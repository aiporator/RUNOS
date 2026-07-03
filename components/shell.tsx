'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3, Calendar, Handshake, LayoutDashboard, Rocket, Search,
  Settings2, Sparkles, Trophy, Users, Wallet, X, Zap,
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

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const router = useRouter();
  const results = useMemo(
    () => NAV.filter((n) => n.label.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  useEffect(() => {
    if (open) setQ('');
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-start justify-center bg-black/60 pt-[16vh] backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-[560px] max-w-[92vw] overflow-hidden rounded-card border border-line bg-bg-2 shadow-2xl fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
          <Sparkles size={16} className="text-volt" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ask Pacer or jump to…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-2"
          />
          <button onClick={onClose} aria-label="Close" className="text-muted hover:text-paper">
            <X size={16} />
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto p-2 thin-scroll">
          {results.map((r) => (
            <button
              key={r.href}
              onClick={() => { router.push(r.href); onClose(); }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-white/5"
            >
              <r.icon size={15} className="text-muted" />
              {r.label}
            </button>
          ))}
          {q && (
            <button
              onClick={() => { router.push('/app/intelligence'); onClose(); }}
              className="mt-1 flex w-full items-center gap-3 rounded-lg bg-volt/10 px-3 py-2.5 text-left text-sm text-volt hover:bg-volt/15"
            >
              <Zap size={15} />
              Ask Pacer: “{q}”
            </button>
          )}
        </div>
      </div>
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
          Ask Pacer
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

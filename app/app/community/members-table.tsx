'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Download, MessageSquare, Search, Tag, UserCheck, X } from 'lucide-react';
import type { Member, MemberStatus } from '@/lib/types';
import { cn, money, pct, relativeDays } from '@/lib/utils';
import { Avatar, Badge, EmptyState, ProgressBar, Table } from '@/components/ui';
import { useToast } from '@/components/toast';

const AUTH_HEADERS = { 'content-type': 'application/json', authorization: 'Bearer ros_demo' };

const statusTone: Record<MemberStatus, 'ok' | 'info' | 'warn' | 'danger'> = {
  active: 'ok',
  new: 'info',
  'at-risk': 'warn',
  lapsed: 'danger',
};

const filters: Array<'all' | MemberStatus> = ['all', 'active', 'new', 'at-risk', 'lapsed'];

type BulkPanel = 'status' | 'tag' | 'message' | null;

export function MembersTable({ members }: { members: Member[] }) {
  const router = useRouter();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | MemberStatus>('all');
  const [sortDesc, setSortDesc] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [panel, setPanel] = useState<BulkPanel>(null);
  const [panelValue, setPanelValue] = useState('');
  const [bulkBusy, setBulkBusy] = useState(false);
  const lastIndexRef = useRef<number | null>(null);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members
      .filter((m) => status === 'all' || m.status === status)
      .filter((m) => !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
      .sort((a, b) => (sortDesc ? b.communityScore - a.communityScore : a.communityScore - b.communityScore));
  }, [members, query, status, sortDesc]);

  const allVisibleSelected = rows.length > 0 && rows.every((m) => selected.has(m.id));

  function toggleRow(id: string, index: number, shiftKey: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (shiftKey && lastIndexRef.current !== null) {
        const [from, to] = [Math.min(lastIndexRef.current, index), Math.max(lastIndexRef.current, index)];
        const turnOn = !prev.has(id);
        for (let i = from; i <= to; i++) {
          if (turnOn) next.add(rows[i].id);
          else next.delete(rows[i].id);
        }
      } else if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    lastIndexRef.current = index;
  }

  function toggleAll() {
    setSelected(allVisibleSelected ? new Set() : new Set(rows.map((m) => m.id)));
    lastIndexRef.current = null;
  }

  function clearSelection() {
    setSelected(new Set());
    setPanel(null);
    setPanelValue('');
    lastIndexRef.current = null;
  }

  async function runBulk(action: 'status' | 'tag' | 'message', value: string) {
    if (bulkBusy) return;
    setBulkBusy(true);
    const count = selected.size;
    try {
      const res = await fetch('/api/v1/members/bulk', {
        method: 'POST',
        headers: AUTH_HEADERS,
        body: JSON.stringify({ ids: [...selected], action, value }),
      });
      const json = await res.json().catch(() => null);
      if (res.ok) {
        const verb = action === 'status' ? `set to ${value}` : action === 'tag' ? `tagged “${value}”` : 'messaged';
        toast({ message: `${count} member${count === 1 ? '' : 's'} ${verb}`, tone: 'success', undoable: true });
        clearSelection();
        router.refresh();
      } else {
        toast({ message: json?.error?.message ?? 'Bulk action failed', tone: 'error' });
      }
    } catch {
      toast({ message: 'Bulk action failed — network error', tone: 'error' });
    } finally {
      setBulkBusy(false);
    }
  }

  function exportSelectedCsv() {
    const chosen = members.filter((m) => selected.has(m.id));
    const esc = (v: string | number) => `"${String(v).replaceAll('"', '""')}"`;
    const lines = [
      'id,name,email,status,tier,attendance_rate,community_score,ltv,last_seen',
      ...chosen.map((m) =>
        [m.id, m.name, m.email, m.status, m.tier, m.attendanceRate, m.communityScore, m.ltv, m.lastSeen].map(esc).join(','),
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members-${chosen.length}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ message: `Exported ${chosen.length} member${chosen.length === 1 ? '' : 's'} to CSV`, tone: 'success' });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email…"
            className="w-full rounded-full border border-line bg-bg-3 py-2 pl-9 pr-4 text-[13px] text-paper placeholder:text-muted-2 outline-none transition focus:border-volt/50"
          />
        </label>
        <div className="flex flex-wrap items-center gap-1.5">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setStatus(f)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[12px] font-semibold capitalize transition',
                status === f
                  ? 'border-volt/40 bg-volt/15 text-volt'
                  : 'border-line bg-bg-3 text-muted hover:border-volt/25 hover:text-paper',
              )}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSortDesc((v) => !v)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-3 px-3 py-1.5 text-[12px] font-semibold text-muted transition hover:border-volt/25 hover:text-paper"
        >
          {sortDesc ? <ArrowDownWideNarrow className="h-3.5 w-3.5" aria-hidden /> : <ArrowUpNarrowWide className="h-3.5 w-3.5" aria-hidden />}
          Community score
        </button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No members match"
          sub="Try a different search or clear the status filter."
        />
      ) : (
        <Table
          head={[
            <input
              key="all"
              type="checkbox"
              checked={allVisibleSelected}
              onChange={toggleAll}
              aria-label="Select all visible members"
              className="h-4 w-4 cursor-pointer accent-[#cdfb50]"
            />,
            'Member',
            'Status',
            'Attendance',
            'Weekly km',
            'Community score',
            'LTV',
            'Last seen',
          ]}
        >
          {rows.map((m, index) => (
            <tr
              key={m.id}
              onClick={() => router.push(`/app/community/${m.id}`)}
              className={cn('cursor-pointer transition hover:bg-white/4', selected.has(m.id) && 'bg-volt/6')}
            >
              <td className="py-3 pr-4" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selected.has(m.id)}
                  onClick={(e) => toggleRow(m.id, index, e.shiftKey)}
                  onChange={() => undefined}
                  aria-label={`Select ${m.name}`}
                  className="h-4 w-4 cursor-pointer accent-[#cdfb50]"
                />
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                  <Avatar name={m.name} color={m.avatarColor} size={34} />
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-medium">{m.name}</div>
                    <div className="truncate text-[11.5px] text-muted-2">{m.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 pr-4">
                <Badge tone={statusTone[m.status]}>{m.status}</Badge>
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-20">
                    <ProgressBar value={m.attendanceRate} tone={m.attendanceRate < 0.35 ? 'warn' : 'volt'} />
                  </div>
                  <span className="text-[12.5px] text-muted">{pct(m.attendanceRate)}</span>
                </div>
              </td>
              <td className="py-3 pr-4 text-[13px]">{m.weeklyKm} km</td>
              <td className="py-3 pr-4">
                <span className="font-display text-[14px] font-semibold text-volt">{m.communityScore}</span>
              </td>
              <td className="py-3 pr-4 text-[13px]">{money(m.ltv)}</td>
              <td className="py-3 pr-4 text-[12.5px] text-muted">{relativeDays(m.lastSeen)}</td>
            </tr>
          ))}
        </Table>
      )}

      {/* Floating bulk-action bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 w-[min(680px,calc(100vw-2rem))] -translate-x-1/2">
          {panel && (
            <form
              className="mb-2 flex items-center gap-2 rounded-2xl border border-line bg-bg-2 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              onSubmit={(e) => {
                e.preventDefault();
                if (panel === 'status') return;
                if (panelValue.trim()) void runBulk(panel, panelValue.trim());
              }}
            >
              {panel === 'status' ? (
                <>
                  <span className="text-[12px] font-semibold text-muted">Set status:</span>
                  {(['active', 'at-risk', 'lapsed', 'new'] as MemberStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={bulkBusy}
                      onClick={() => void runBulk('status', s)}
                      className="rounded-full border border-line bg-bg-3 px-3 py-1.5 text-[12px] font-semibold capitalize text-paper/85 transition hover:border-volt/40 hover:text-volt disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <input
                    autoFocus
                    value={panelValue}
                    onChange={(e) => setPanelValue(e.target.value)}
                    placeholder={panel === 'tag' ? 'Tag name, e.g. marathon-crew' : 'Message to send…'}
                    className="min-w-0 flex-1 rounded-full border border-line bg-bg-3 px-4 py-2 text-[13px] text-paper outline-none placeholder:text-muted-2 focus:border-volt/40"
                  />
                  <button
                    type="submit"
                    disabled={bulkBusy || !panelValue.trim()}
                    className="rounded-full bg-volt px-4 py-2 text-[12px] font-bold text-ink transition disabled:opacity-50"
                  >
                    {bulkBusy ? 'Working…' : panel === 'tag' ? 'Add tag' : 'Send'}
                  </button>
                </>
              )}
            </form>
          )}
          <div className="flex items-center gap-1.5 rounded-2xl border border-line bg-bg-2 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <span className="px-2.5 text-[12.5px] font-semibold text-volt">{selected.size} selected</span>
            <button
              type="button"
              onClick={() => { setPanel(panel === 'status' ? null : 'status'); setPanelValue(''); }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold transition',
                panel === 'status' ? 'bg-volt/15 text-volt' : 'text-paper/85 hover:bg-white/5',
              )}
            >
              <UserCheck className="h-3.5 w-3.5" aria-hidden /> Status
            </button>
            <button
              type="button"
              onClick={() => { setPanel(panel === 'tag' ? null : 'tag'); setPanelValue(''); }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold transition',
                panel === 'tag' ? 'bg-volt/15 text-volt' : 'text-paper/85 hover:bg-white/5',
              )}
            >
              <Tag className="h-3.5 w-3.5" aria-hidden /> Tag
            </button>
            <button
              type="button"
              onClick={() => { setPanel(panel === 'message' ? null : 'message'); setPanelValue(''); }}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold transition',
                panel === 'message' ? 'bg-volt/15 text-volt' : 'text-paper/85 hover:bg-white/5',
              )}
            >
              <MessageSquare className="h-3.5 w-3.5" aria-hidden /> Message
            </button>
            <button
              type="button"
              onClick={exportSelectedCsv}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold text-paper/85 transition hover:bg-white/5"
            >
              <Download className="h-3.5 w-3.5" aria-hidden /> CSV
            </button>
            <button
              type="button"
              onClick={clearSelection}
              aria-label="Clear selection"
              className="ml-auto grid h-8 w-8 place-items-center rounded-xl text-muted transition hover:bg-white/5 hover:text-paper"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

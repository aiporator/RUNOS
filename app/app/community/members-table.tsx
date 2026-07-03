'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDownWideNarrow, ArrowUpNarrowWide, Search } from 'lucide-react';
import type { Member, MemberStatus } from '@/lib/types';
import { cn, money, pct, relativeDays } from '@/lib/utils';
import { Avatar, Badge, EmptyState, ProgressBar, Table } from '@/components/ui';

const statusTone: Record<MemberStatus, 'ok' | 'info' | 'warn' | 'danger'> = {
  active: 'ok',
  new: 'info',
  'at-risk': 'warn',
  lapsed: 'danger',
};

const filters: Array<'all' | MemberStatus> = ['all', 'active', 'new', 'at-risk', 'lapsed'];

export function MembersTable({ members }: { members: Member[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | MemberStatus>('all');
  const [sortDesc, setSortDesc] = useState(true);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members
      .filter((m) => status === 'all' || m.status === status)
      .filter((m) => !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
      .sort((a, b) => (sortDesc ? b.communityScore - a.communityScore : a.communityScore - b.communityScore));
  }, [members, query, status, sortDesc]);

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
        <Table head={['Member', 'Status', 'Attendance', 'Weekly km', 'Community score', 'LTV', 'Last seen']}>
          {rows.map((m) => (
            <tr
              key={m.id}
              onClick={() => router.push(`/app/community/${m.id}`)}
              className="cursor-pointer transition hover:bg-white/4"
            >
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
    </div>
  );
}

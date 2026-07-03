'use client';

import { useMemo, useState } from 'react';
import type { PaymentKind, PaymentStatus } from '@/lib/types';
import { cn, formatDate, money } from '@/lib/utils';
import { Avatar, Badge, EmptyState, Table } from '@/components/ui';

export interface PaymentRow {
  id: string;
  memberName: string;
  avatarColor: string;
  description: string;
  kind: PaymentKind;
  amount: number;
  fee: number;
  status: PaymentStatus;
  date: string;
}

const kindTone: Record<PaymentKind, 'volt' | 'info' | 'warn' | 'ok'> = {
  membership: 'volt',
  ticket: 'info',
  merch: 'warn',
  marketplace: 'ok',
};

const statusTone: Record<PaymentStatus, 'ok' | 'warn' | 'danger' | 'muted'> = {
  succeeded: 'ok',
  pending: 'warn',
  failed: 'danger',
  refunded: 'muted',
};

const filters: Array<'all' | PaymentKind> = ['all', 'membership', 'ticket', 'merch', 'marketplace'];

export function PaymentsTable({ rows }: { rows: PaymentRow[] }) {
  const [kind, setKind] = useState<'all' | PaymentKind>('all');

  const visible = useMemo(
    () => rows.filter((r) => kind === 'all' || r.kind === kind),
    [rows, kind],
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setKind(f)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-[12px] font-semibold capitalize transition',
              kind === f
                ? 'border-volt/40 bg-volt/15 text-volt'
                : 'border-line bg-bg-3 text-muted hover:border-volt/25 hover:text-paper',
            )}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
        <span className="ml-auto text-[12px] text-muted-2">{visible.length} payments</span>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="No payments of this kind" sub="Try another filter — every euro that moves through the club lands in this ledger." />
      ) : (
        <Table head={['Member', 'Description', 'Kind', 'Amount', 'Fee', 'Status', 'Date']}>
          {visible.map((r) => (
            <tr key={r.id} className="transition hover:bg-white/4">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                  <Avatar name={r.memberName} color={r.avatarColor} size={30} />
                  <span className="truncate text-[13.5px] font-medium">{r.memberName}</span>
                </div>
              </td>
              <td className="py-3 pr-4 text-[13px] text-muted">{r.description}</td>
              <td className="py-3 pr-4">
                <Badge tone={kindTone[r.kind]}>{r.kind}</Badge>
              </td>
              <td className="py-3 pr-4 text-[13px] font-semibold">{money(r.amount)}</td>
              <td className="py-3 pr-4 text-[12.5px] text-muted">{money(r.fee)}</td>
              <td className="py-3 pr-4">
                <Badge tone={statusTone[r.status]}>{r.status}</Badge>
              </td>
              <td className="py-3 pr-4 text-[12.5px] text-muted">{formatDate(r.date)}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}

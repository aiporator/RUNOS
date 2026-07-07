import { Check } from 'lucide-react';
import {
  failedPayments, getMember, membershipPlans, mrr, payments, revenueThisMonth,
} from '@/lib/data';
import { money } from '@/lib/utils';
import { Badge, Card, CardTitle, KV, PageHeader, Stat } from '@/components/ui';
import { QuickActionButton } from '@/components/quick-action';
import { PaymentsTable, type PaymentRow } from './payments-table';

export const dynamic = 'force-dynamic';

export default function MoneyPage() {
  const allPayments = payments();
  const failed = failedPayments();
  const feesThisMonth = allPayments
    .filter((p) => p.status === 'succeeded')
    .reduce((s, p) => s + p.fee, 0);

  const monthlyPlan = membershipPlans.find((p) => p.interval === 'month');
  const annualPlan = membershipPlans.find((p) => p.interval === 'year');

  const rows: PaymentRow[] = [...allPayments]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((p) => {
      const m = getMember(p.memberId);
      return {
        id: p.id,
        memberName: m?.name ?? 'Unknown member',
        avatarColor: m?.avatarColor ?? '#7db8ff',
        description: p.description,
        kind: p.kind,
        amount: p.amount,
        fee: p.fee,
        status: p.status,
        date: p.date,
      };
    });

  return (
    <div>
      <PageHeader
        title="Money"
        sub="Memberships, payments, and payouts — one ledger."
        actions={
          <QuickActionButton
            label="Create payment link"
            className="rounded-full bg-volt px-5 py-2.5 font-display text-sm font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)]"
            title="Create a payment link"
            description="Charges immediately through Stripe and lands in the ledger below — share the confirmation with the member."
            endpoint="/api/v1/payments"
            fields={[
              { name: 'member_id', label: 'Member ID', required: true, placeholder: 'mem_001' },
              { name: 'kind', label: 'Kind', type: 'select', options: ['membership', 'ticket', 'merch', 'marketplace'], defaultValue: 'ticket' },
              { name: 'description', label: 'Description', required: true, placeholder: 'Race-weekend hotel add-on' },
              { name: 'amount', label: 'Amount (USD)', type: 'number', required: true, placeholder: '45' },
            ]}
            submitLabel="Create & charge"
          />
        }
      />

      <div className="grid gap-4 fade-up-1 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="MRR from memberships" value={money(mrr())} delta="+6% m/m" sub={`${monthlyPlan?.members ?? 0} monthly · ${annualPlan?.members ?? 0} annual`} />
        <Stat label="Revenue this month" value={money(revenueThisMonth())} sub="Memberships, tickets, merch & marketplace" />
        <Stat label="Platform fees" value={money(feesThisMonth)} sub="0.5% per transaction on the Pro plan" />
        <Stat label="Failed payments" value={String(failed.length)} delta="needs attention" deltaGood={false} sub="Dunning journey is retrying automatically" />
      </div>

      <div className="mt-6 fade-up-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-[15px] font-semibold">Membership plans</h2>
          <span className="text-[12px] text-muted">
            {monthlyPlan?.members ?? 0} monthly / {annualPlan?.members ?? 0} annual
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {membershipPlans.map((plan) => (
            <Card key={plan.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-display text-[14.5px] font-semibold">{plan.name}</div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="font-display text-[28px] font-bold leading-none tracking-tight">{money(plan.price)}</span>
                    <span className="text-[12.5px] text-muted">/ {plan.interval}</span>
                  </div>
                </div>
                <Badge tone="volt">{plan.members} members</Badge>
              </div>
              <ul className="mt-4 space-y-2 border-t border-line pt-4">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2.5 text-[13px] text-muted">
                    <Check className="h-3.5 w-3.5 flex-none text-volt" aria-hidden />
                    {perk}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 fade-up-3 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardTitle action={<span className="text-[12px] text-muted">last 30 days</span>}>
            Recent payments
          </CardTitle>
          <PaymentsTable rows={rows} />
        </Card>

        <div className="space-y-4">
          <Card>
            <CardTitle action={<Badge tone="danger">{failed.length} in dunning</Badge>}>Dunning</CardTitle>
            <div className="space-y-3">
              {failed.map((p) => {
                const m = getMember(p.memberId);
                return (
                  <div key={p.id} className="rounded-xl border border-line bg-bg-3 px-4 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-[13.5px] font-medium">{m?.name ?? 'Unknown member'}</span>
                      <span className="flex-none text-[13px] font-semibold text-danger">{money(p.amount)}</span>
                    </div>
                    <div className="mt-1 text-[12px] text-muted">{p.description}</div>
                    <div className="mt-1.5 text-[11.5px] text-muted-2">
                      Dunning journey step 2 of 3 · next retry in 2 days
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 rounded-lg border border-volt/25 bg-volt/8 px-3.5 py-3 text-[12.5px] leading-relaxed text-paper/90">
              <span className="font-semibold text-volt">Pacer:</span> the Payment Dunning journey recovers 71% of failed
              payments within 7 days — no action needed unless a card fails a third time.
            </div>
          </Card>

          <Card>
            <CardTitle>Payout</CardTitle>
            <div className="divide-y divide-line/60">
              <KV
                k="Stripe account"
                v={
                  <span className="inline-flex items-center gap-2">
                    <span className="text-[12.5px] text-muted">Connected · acct_•••4821</span>
                    <Badge tone="ok">Verified</Badge>
                  </span>
                }
              />
              <KV k="Next payout" v={<span>Tomorrow · <span className="text-volt">{money(486)}</span></span>} />
              <KV k="Payout schedule" v="Daily rolling" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

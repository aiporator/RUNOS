import {
  activeSponsorValue, perks, sponsorPipelineValue, sponsors, vendors,
} from '@/lib/data';
import type { Sponsor } from '@/lib/types';
import { cn, money, relativeDays } from '@/lib/utils';
import { Card, CardTitle, PageHeader, Stat, Table } from '@/components/ui';
import { InstantActionButton, QuickActionButton } from '@/components/quick-action';

export const dynamic = 'force-dynamic';

const stages: Array<Sponsor['stage']> = ['lead', 'contacted', 'proposal', 'negotiation', 'active', 'renewal'];

const stageDot: Record<Sponsor['stage'], string> = {
  lead: 'bg-muted-2',
  contacted: 'bg-info',
  proposal: 'bg-warn',
  negotiation: 'bg-warn',
  active: 'bg-volt',
  renewal: 'bg-ok',
};

export default function PartnersPage() {
  const allSponsors = sponsors();
  const activePerks = perks().filter((p) => p.active).length;
  const marketplaceBookings = vendors.reduce((s, v) => s + v.bookings, 0);
  const veloProposal = allSponsors.find((s) => s.name === 'Velo Hotel Group');

  return (
    <div>
      <PageHeader
        title="Partners"
        sub="Sponsor CRM and vendor marketplace — turn your verified audience into recurring partner revenue."
        actions={
          <QuickActionButton
            label="Add sponsor"
            className="rounded-full bg-volt px-5 py-2.5 font-display text-sm font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)]"
            title="Add a sponsor"
            description="Enters the pipeline at the Lead stage."
            endpoint="/api/v1/sponsors"
            fields={[
              { name: 'name', label: 'Company', required: true, placeholder: 'Trailhead Outfitters' },
              { name: 'industry', label: 'Industry', required: true, placeholder: 'Retail' },
              { name: 'contact', label: 'Contact', required: true, placeholder: 'Jordan Lee' },
              { name: 'dealValue', label: 'Deal value (USD)', type: 'number', required: true, placeholder: '5000' },
            ]}
            submitLabel="Add to pipeline"
          />
        }
      />

      <div className="grid gap-4 fade-up-1 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active sponsor value" value={money(activeSponsorValue())} delta="+2 deals" sub="Annualized · active + renewal stages" />
        <Stat label="Pipeline value" value={money(sponsorPipelineValue())} sub="Lead through negotiation" />
        <Stat label="Active perks" value={String(activePerks)} sub="Live in the benefits passport" />
        <Stat label="Marketplace bookings" value={String(marketplaceBookings)} delta="+18 this month" sub="Across all verified vendors" />
      </div>

      <Card className="mt-6 fade-up-2">
        <CardTitle action={<span className="text-[12px] text-muted">{allSponsors.length} sponsors · drag to move stage</span>}>
          Sponsor pipeline
        </CardTitle>
        <div className="thin-scroll -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
          {stages.map((stage) => {
            const inStage = allSponsors.filter((s) => s.stage === stage);
            return (
              <div key={stage} className="w-[248px] flex-none">
                <div className="mb-3 flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', stageDot[stage])} aria-hidden />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{stage}</span>
                  <span className="ml-auto text-[11.5px] text-muted-2">{inStage.length}</span>
                </div>
                <div className="space-y-3">
                  {inStage.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-[12px] text-muted-2">
                      No sponsors here
                    </div>
                  ) : (
                    inStage.map((s) => (
                      <div key={s.id} className="rounded-xl border border-line bg-bg-3 px-4 py-3.5 transition hover:border-volt/40">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-[13.5px] font-semibold">{s.name}</div>
                            <div className="text-[11.5px] text-muted-2">{s.industry}</div>
                          </div>
                          <span className="flex-none font-display text-[13px] font-semibold text-volt">{money(s.dealValue)}</span>
                        </div>
                        <div className="mt-2.5 text-[12px] leading-relaxed text-muted">{s.nextStep}</div>
                        <div className="mt-2 text-[11px] text-muted-2">last touch {relativeDays(s.lastTouch)}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="mt-6 grid gap-4 fade-up-3 xl:grid-cols-3">
        <Card>
          <CardTitle>Pacer brand-fit</CardTitle>
          <p className="text-[13px] leading-relaxed text-muted">
            <span className="font-semibold text-paper">Velo Hotel Group</span> is a 92% audience fit. Their proposal is
            drafted from your verified audience data — 450 members across chapters, 71% monthly active, and 12
            race-weekend perk redemptions already this quarter.
          </p>
          <div className="mt-4 rounded-lg border border-volt/25 bg-volt/8 px-3.5 py-3 text-[12.5px] leading-relaxed text-paper/90">
            <span className="font-semibold text-volt">Pacer:</span> the {money(9000)} proposal is ready in your drafts.{' '}
            {veloProposal && veloProposal.stage === 'proposal' ? (
              <InstantActionButton
                label="Review & send →"
                busyLabel="Sending…"
                className="ml-1 font-semibold text-volt hover:underline disabled:opacity-60"
                endpoint={`/api/v1/sponsors/${veloProposal.id}`}
                method="PATCH"
                body={{ stage: 'negotiation', next_step: 'Proposal sent — awaiting response' }}
              />
            ) : (
              <span className="ml-1 font-semibold text-ok">Sent ✓</span>
            )}
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardTitle action={<span className="text-[12px] text-muted">{vendors.length} verified vendors</span>}>
            Vendor marketplace
          </CardTitle>
          <Table head={['Vendor', 'Service', 'Rating', 'Bookings', 'From']}>
            {vendors.map((v) => (
              <tr key={v.id} className="transition hover:bg-white/4">
                <td className="py-3 pr-4 text-[13.5px] font-medium">{v.name}</td>
                <td className="py-3 pr-4 text-[13px] text-muted">{v.service}</td>
                <td className="py-3 pr-4 text-[13px]">
                  <span className="text-volt">★</span> {v.rating.toFixed(1)}
                </td>
                <td className="py-3 pr-4 text-[13px]">{v.bookings}</td>
                <td className="py-3 pr-4 text-[13px] font-semibold">{money(v.priceFrom)}<span className="font-normal text-muted-2">/session</span></td>
              </tr>
            ))}
          </Table>
          <p className="mt-3 border-t border-line pt-3 text-[11.5px] text-muted-2">
            RunOS takes a 10% platform commission on marketplace bookings — paid out with your daily payout.
          </p>
        </Card>
      </div>
    </div>
  );
}

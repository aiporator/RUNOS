import Link from 'next/link';
import { Coffee, Trophy } from 'lucide-react';
import { challenges, getMember, members, perks, totalPerkRedemptions } from '@/lib/data';
import { pct, relativeDays } from '@/lib/utils';
import { Avatar, Badge, Card, CardTitle, PageHeader, ProgressBar, Stat, Table } from '@/components/ui';

export default function EngagePage() {
  const totalParticipants = challenges.reduce((s, c) => s + c.participants, 0);
  const ambassadors = members.filter((m) => m.roles.includes('ambassador'));
  const topPerk = perks.find((p) => p.partner === 'Dock 7 Coffee');

  return (
    <div>
      <PageHeader
        kicker="Engage"
        title="Challenges, perks & ambassadors"
        sub="The flywheel that keeps members moving between events — challenges to chase, perks to redeem, ambassadors to spread the word."
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-volt px-5 py-2.5 font-display text-sm font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)]"
          >
            <Trophy className="h-4 w-4" aria-hidden />
            New challenge
          </button>
        }
      />

      <div className="grid gap-4 fade-up-1 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active challenges" value={String(challenges.length)} sub="Distance, streaks, and volunteering" />
        <Stat label="Challenge participants" value={String(totalParticipants)} delta="+9 this week" sub="Across all live challenges" />
        <Stat label="Perk redemptions" value={String(totalPerkRedemptions())} delta="+38 this month" sub="Benefits passport, all-time" />
        <Stat label="Ambassadors" value={String(ambassadors.length)} sub="Driving referrals and welcome runs" />
      </div>

      <h2 className="mb-4 mt-8 font-display text-lg font-semibold tracking-tight fade-up-2">Challenges</h2>
      <div className="grid gap-4 fade-up-2 xl:grid-cols-3">
        {challenges.map((c) => (
          <Card key={c.id}>
            <CardTitle action={<Badge tone="volt">ends {relativeDays(c.endsAt)}</Badge>}>{c.name}</CardTitle>
            <div className="mb-4 text-[12.5px] text-muted">
              {c.participants} participants · target {c.target} {c.unit}
            </div>
            <div className="space-y-3">
              {c.leaders.slice(0, 5).map((l, i) => {
                const m = getMember(l.memberId);
                if (!m) return null;
                return (
                  <div key={l.memberId} className="flex items-center gap-3">
                    <span className="w-4 flex-none text-center font-display text-[12px] font-bold text-muted-2">{i + 1}</span>
                    <Avatar name={m.name} color={m.avatarColor} size={30} />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-baseline justify-between gap-2">
                        <span className="truncate text-[13px] font-medium">{m.name}</span>
                        <span className="flex-none text-[12px] text-muted">
                          {l.value} {c.unit}
                        </span>
                      </div>
                      <ProgressBar value={l.value / c.target} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      <h2 className="mb-4 mt-8 font-display text-lg font-semibold tracking-tight fade-up-3">Benefits passport</h2>
      <div className="grid gap-4 fade-up-3 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardTitle action={<span className="text-[12px] text-muted">{perks.filter((p) => p.active).length} of {perks.length} live</span>}>
            Partner perks
          </CardTitle>
          <Table head={['Partner', 'Category', 'Offer', 'Redemptions', 'Monthly limit', 'Status']}>
            {perks.map((p) => (
              <tr key={p.id} className="transition hover:bg-white/4">
                <td className="py-3 pr-4 text-[13.5px] font-medium">{p.partner}</td>
                <td className="py-3 pr-4 text-[12.5px] text-muted">{p.category}</td>
                <td className="py-3 pr-4 text-[13px]">{p.offer}</td>
                <td className="py-3 pr-4 font-display text-[13.5px] font-semibold text-volt">{p.redemptions}</td>
                <td className="py-3 pr-4 text-[13px] text-muted">{p.monthlyLimit ?? '∞'}</td>
                <td className="py-3 pr-4">
                  <Badge tone={p.active ? 'ok' : 'muted'}>{p.active ? 'Active' : 'Paused'}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card className="border-volt/30 bg-gradient-to-b from-volt/10 to-transparent">
          <CardTitle action={<Coffee className="h-4 w-4 text-volt" aria-hidden />}>Top perk this month</CardTitle>
          <div className="font-display text-2xl font-bold tracking-tight">Dock 7 Coffee</div>
          <div className="mt-1 text-[13px] text-muted">{topPerk?.offer ?? '20% off post-run coffee'}</div>
          <div className="mt-5 flex items-baseline gap-2">
            <span className="font-display text-[40px] font-bold leading-none text-volt">{topPerk?.redemptions ?? 214}</span>
            <span className="text-[12.5px] text-muted">redemptions all-time</span>
          </div>
          <p className="mt-5 border-t border-volt/20 pt-4 text-[12.5px] leading-relaxed text-muted">
            The post-run coffee perk is the club&apos;s stickiest benefit — most Saturday long runs end at Dock 7.
            Bram is up for renewal; send the redemption report before the next sponsor call.
          </p>
        </Card>
      </div>

      <h2 className="mb-4 mt-8 font-display text-lg font-semibold tracking-tight fade-up-4">Ambassadors</h2>
      <div className="grid gap-4 fade-up-4 sm:grid-cols-2 xl:grid-cols-4">
        {ambassadors.map((m) => (
          <Link key={m.id} href={`/app/community/${m.id}`}>
            <Card className="h-full transition hover:border-volt/40">
              <div className="flex items-center gap-3">
                <Avatar name={m.name} color={m.avatarColor} size={44} />
                <div className="min-w-0">
                  <div className="truncate text-[14px] font-semibold">{m.name}</div>
                  <div className="text-[11.5px] text-muted">{m.city}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[12.5px]">
                <span className="text-muted">Community score</span>
                <span className="font-display text-[15px] font-bold text-volt">{m.communityScore}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[12.5px]">
                <span className="text-muted">Events attended</span>
                <span className="font-medium">{m.eventsAttended}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

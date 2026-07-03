import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { ambassadorCandidates, atRiskMembers, club, members, newMembers } from '@/lib/data';
import { pct } from '@/lib/utils';
import { Avatar, Card, CardTitle, PageHeader, Stat } from '@/components/ui';
import { MembersTable } from './members-table';

export default function CommunityPage() {
  const total = club.memberCount;
  const active = members.filter((m) => m.status === 'active').length;
  const joined = newMembers();
  const ambassadors = members.filter((m) => m.roles.includes('ambassador'));
  const candidates = ambassadorCandidates();

  const segments = [
    { label: 'Streak-holders', count: members.filter((m) => m.tags.includes('streak-holder')).length },
    { label: 'First-timer follow-up', count: members.filter((m) => m.tags.includes('first-timer-followup')).length },
    { label: 'Quietly drifting', count: atRiskMembers().length },
    { label: 'Volunteers', count: members.filter((m) => m.roles.includes('volunteer')).length },
    { label: 'Ambassador candidates', count: candidates.length },
  ];

  return (
    <div>
      <PageHeader
        kicker="Community"
        title="Members"
        sub={`${total} members · ${active} active · ${joined.length} joined this month · every runner, one profile.`}
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-volt px-5 py-2.5 font-display text-sm font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)]"
          >
            <UserPlus className="h-4 w-4" aria-hidden />
            Invite members
          </button>
        }
      />

      <div className="grid gap-4 fade-up-1 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total members" value={String(total)} delta={`+${joined.length} m/m`} sub="Across both chapters" />
        <Stat label="Active" value={pct(active / total)} sub={`${active} members engaged in the last 6 weeks`} />
        <Stat label="New this month" value={String(joined.length)} sub="All enrolled in the welcome journey" />
        <Stat label="Ambassadors" value={String(ambassadors.length)} sub={`${candidates.length} more candidates flagged by Pacer`} />
      </div>

      <Card className="mt-6 fade-up-2">
        <CardTitle action={<span className="text-[12px] text-muted">click a row to open the profile</span>}>
          Member directory
        </CardTitle>
        <MembersTable members={members} />
      </Card>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <Card className="fade-up-3">
          <CardTitle action={<span className="text-[12px] text-muted">auto-updated by Pacer</span>}>Segments</CardTitle>
          <div className="flex flex-wrap gap-2">
            {segments.map((s) => (
              <span
                key={s.label}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-3 px-3.5 py-2 text-[12.5px] font-medium transition hover:border-volt/30"
              >
                {s.label}
                <span className="rounded-full bg-volt/15 px-2 py-0.5 font-display text-[11px] font-bold text-volt">{s.count}</span>
              </span>
            ))}
          </div>
          <p className="mt-4 border-t border-line pt-4 text-[12.5px] leading-relaxed text-muted">
            Segments refresh nightly from attendance, activity, and journey data — use them as audiences in Engage
            or as targets for a Pacer broadcast.
          </p>
        </Card>

        <Card className="fade-up-4">
          <CardTitle action={<span className="text-[12px] text-muted">score ≥ 78, not yet ambassadors</span>}>
            Ambassador candidates
          </CardTitle>
          <div className="space-y-3">
            {candidates.slice(0, 5).map((m) => (
              <Link
                key={m.id}
                href={`/app/community/${m.id}`}
                className="flex items-center gap-3 rounded-lg px-1 py-1 transition hover:bg-white/4"
              >
                <Avatar name={m.name} color={m.avatarColor} size={34} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-medium">{m.name}</div>
                  <div className="text-[11.5px] text-muted">{m.eventsAttended} events attended</div>
                </div>
                <span className="font-display text-[15px] font-bold text-volt">{m.communityScore}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-volt/25 bg-volt/8 px-3.5 py-3 text-[12.5px] leading-relaxed text-paper/90">
            <span className="font-semibold text-volt">Pacer suggests:</span> invite the top 3 this week — members
            invited within a month of crossing score 80 accept the ambassador role 2× more often.
          </div>
        </Card>
      </div>
    </div>
  );
}

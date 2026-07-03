import { Plus } from 'lucide-react';
import { club } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Avatar, Badge, Card, CardTitle, KV, PageHeader, Table } from '@/components/ui';

interface Integration {
  name: string;
  detail: string;
  connected: boolean;
}

const integrations: Integration[] = [
  { name: 'Strava', detail: '34 members syncing', connected: true },
  { name: 'Garmin', detail: '12 members syncing', connected: true },
  { name: 'Apple Health', detail: '9 members syncing', connected: true },
  { name: 'COROS', detail: 'Activity sync', connected: false },
  { name: 'Polar', detail: 'Activity sync', connected: false },
  { name: 'Suunto', detail: 'Activity sync', connected: false },
  { name: 'Fitbit', detail: 'Activity sync', connected: false },
  { name: 'TrainingPeaks', detail: 'Training plans', connected: false },
  { name: 'Zwift', detail: 'Indoor sessions', connected: false },
  { name: 'Stripe', detail: 'Payouts daily', connected: true },
  { name: 'Shopify', detail: 'Merch storefront', connected: false },
  { name: 'WhatsApp', detail: 'Announcements bridge', connected: true },
  { name: 'Mailchimp', detail: 'Email campaigns', connected: false },
  { name: 'Slack', detail: 'Organizer alerts', connected: false },
  { name: 'Discord', detail: 'Community server', connected: false },
];

interface StaffRow {
  name: string;
  roles: string[];
  color: string;
  lastActive: string;
}

const staff: StaffRow[] = [
  { name: 'Maya Okafor', roles: ['Owner'], color: '#cdfb50', lastActive: 'today' },
  { name: 'Priya Sharma', roles: ['Organizer', 'Coach'], color: '#7db8ff', lastActive: 'today' },
  { name: 'Sofia Lindqvist', roles: ['Content'], color: '#ff9d7a', lastActive: 'yesterday' },
  { name: 'Ravi Patel', roles: ['Volunteer-coordinator'], color: '#b78bff', lastActive: '3d ago' },
];

const chapterSplit = [34, 14];

const ghostButton =
  'rounded-full border border-line bg-bg-3 px-3 py-1.5 text-[12px] font-semibold text-muted transition hover:border-volt/25 hover:text-paper';

export default function PlatformPage() {
  return (
    <div>
      <PageHeader
        title="Platform"
        sub="Settings, integrations, chapters, and your white-label brand."
      />

      <div className="fade-up-1">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-[15px] font-semibold">Integrations</h2>
          <span className="text-[12px] text-muted">
            {integrations.filter((i) => i.connected).length} connected · {integrations.length} available
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {integrations.map((i) => (
            <Card key={i.name} className="flex items-center justify-between gap-3 !p-4">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn('h-2 w-2 flex-none rounded-full', i.connected ? 'bg-volt' : 'bg-muted-2')}
                  aria-hidden
                />
                <div className="min-w-0">
                  <div className={cn('truncate text-[13.5px] font-semibold', !i.connected && 'text-muted')}>{i.name}</div>
                  <div className="truncate text-[11.5px] text-muted-2">
                    {i.connected ? `Connected · ${i.detail}` : i.detail}
                  </div>
                </div>
              </div>
              {i.connected ? (
                <Badge tone="ok">Connected</Badge>
              ) : (
                <button type="button" className={ghostButton}>Connect</button>
              )}
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 fade-up-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardTitle action={<button type="button" className={ghostButton}>Invite staff</button>}>
            Staff &amp; roles
          </CardTitle>
          <Table head={['Person', 'Roles', 'Last active']}>
            {staff.map((s) => (
              <tr key={s.name} className="transition hover:bg-white/4">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} color={s.color} size={34} />
                    <span className="text-[13.5px] font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex flex-wrap gap-1.5">
                    {s.roles.map((r) => (
                      <Badge key={r} tone={r === 'Owner' ? 'volt' : 'muted'}>{r}</Badge>
                    ))}
                  </div>
                </td>
                <td className="py-3 pr-4 text-[12.5px] text-muted">{s.lastActive}</td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card>
          <CardTitle action={<span className="text-[12px] text-muted">{club.memberCount} members</span>}>Chapters</CardTitle>
          <div className="space-y-3">
            {club.chapters.map((chapter, i) => (
              <div key={chapter} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-bg-3 px-4 py-3.5">
                <div>
                  <div className="text-[13.5px] font-medium">{chapter}</div>
                  <div className="text-[11.5px] text-muted-2">{chapterSplit[i] ?? 0} members</div>
                </div>
                <Badge tone={i === 0 ? 'volt' : 'info'}>{i === 0 ? 'HQ' : 'Chapter'}</Badge>
              </div>
            ))}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line px-4 py-3.5 text-[12.5px] font-semibold text-muted transition hover:border-volt/30 hover:text-paper"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Add chapter
            </button>
          </div>
          <p className="mt-4 border-t border-line pt-3 text-[11.5px] leading-relaxed text-muted-2">
            Chapters share your brand, plans, and sponsor deals — each with its own events calendar and organizers.
          </p>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 fade-up-3 xl:grid-cols-3">
        <Card>
          <CardTitle action={<Badge tone="ok">Live</Badge>}>White-label</CardTitle>
          <div className="divide-y divide-line/60">
            <KV k="Domain" v="harborcityrunners.run" />
            <KV
              k="Brand colors"
              v={
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-4 w-4 rounded border border-line bg-volt" aria-hidden />
                  <span className="h-4 w-4 rounded border border-line bg-ink" aria-hidden />
                  <span className="h-4 w-4 rounded border border-line bg-paper" aria-hidden />
                </span>
              }
            />
            <KV k="Member app" v="Published · v2.4" />
            <KV
              k="Stores"
              v={
                <span className="inline-flex gap-1.5">
                  <Badge tone="muted">iOS · App Store</Badge>
                  <Badge tone="muted">Android · Play</Badge>
                </span>
              }
            />
          </div>
        </Card>

        <Card>
          <CardTitle>API access</CardTitle>
          <div className="divide-y divide-line/60">
            <KV
              k="Live key"
              v={
                <span className="inline-flex items-center gap-2">
                  <code className="rounded bg-white/6 px-2 py-0.5 font-mono text-[12px] text-muted">ros_live_••••••••7f2a</code>
                  <button type="button" className={ghostButton}>Rotate</button>
                </span>
              }
            />
            <KV k="Webhook endpoint" v={<span className="text-[12.5px] text-muted">hooks.harborcityrunners.run/runos</span>} />
            <KV k="Rate limit" v="600 req/min (Pro)" />
            <KV
              k="Data export"
              v={
                <span className="inline-flex items-center gap-2">
                  <span className="text-[12px] text-muted">Full club export (GDPR Art. 20) — JSON/CSV</span>
                  <button type="button" className={ghostButton}>Export</button>
                </span>
              }
            />
          </div>
        </Card>

        <Card className="border-danger/30">
          <CardTitle action={<Badge tone="danger">Careful</Badge>}>Danger zone</CardTitle>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-bg-3 px-4 py-3.5">
              <div>
                <div className="text-[13.5px] font-medium">Transfer ownership</div>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted-2">
                  Hand the club to another organizer. Billing, payouts, and API keys move with it.
                </p>
              </div>
              <button type="button" className={ghostButton}>Transfer</button>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3.5">
              <div>
                <div className="text-[13.5px] font-medium text-danger">Delete club</div>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted-2">
                  Permanently removes members, events, and payment history after a 30-day grace period.
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-danger/30 bg-danger/10 px-3 py-1.5 text-[12px] font-semibold text-danger transition hover:bg-danger/20"
              >
                Delete
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

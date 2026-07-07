import { Plus } from 'lucide-react';
import { club, integrations, staff } from '@/lib/data';
import { cn, formatDate } from '@/lib/utils';
import { Avatar, Badge, Card, CardTitle, KV, PageHeader, Table } from '@/components/ui';
import { ExportButton, InstantActionButton, QuickActionButton } from '@/components/quick-action';

export const dynamic = 'force-dynamic';

const chapterSplit = [34, 14];

const ghostButton =
  'rounded-full border border-line bg-bg-3 px-3 py-1.5 text-[12px] font-semibold text-muted transition hover:border-volt/25 hover:text-paper disabled:opacity-60';

function maskKey(key: string): string {
  return `${key.slice(0, 12)}••••••••${key.slice(-4)}`;
}

export default function PlatformPage() {
  const org = club();
  const allIntegrations = integrations();
  const allStaff = staff();

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
            {allIntegrations.filter((i) => i.connected).length} connected · {allIntegrations.length} available
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {allIntegrations.map((i) => (
            <Card key={i.id} className="flex items-center justify-between gap-3 !p-4">
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
                <InstantActionButton
                  label="Disconnect"
                  busyLabel="…"
                  className={ghostButton}
                  endpoint={`/api/v1/integrations/${i.id}`}
                  method="PATCH"
                  confirmMessage={`Disconnect ${i.name}?`}
                />
              ) : (
                <InstantActionButton
                  label="Connect"
                  busyLabel="…"
                  className={ghostButton}
                  endpoint={`/api/v1/integrations/${i.id}`}
                  method="PATCH"
                />
              )}
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 fade-up-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardTitle
            action={
              <QuickActionButton
                label="Invite staff"
                className={ghostButton}
                title="Invite staff"
                description="They'll get organizer access — roles and permissions can be adjusted anytime."
                endpoint="/api/v1/staff"
                fields={[
                  { name: 'name', label: 'Name', required: true, placeholder: 'Elif Demir' },
                  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'elif@harborcityrunners.run' },
                  { name: 'roles', label: 'Role', type: 'select', options: ['Organizer', 'Coach', 'Content', 'Volunteer-coordinator'], defaultValue: 'Organizer' },
                ]}
                submitLabel="Send invite"
              />
            }
          >
            Staff &amp; roles
          </CardTitle>
          <Table head={['Person', 'Roles', 'Last active']}>
            {allStaff.map((s) => (
              <tr key={s.id} className="transition hover:bg-white/4">
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
                    {s.status === 'invited' ? <Badge tone="info">invited</Badge> : null}
                  </div>
                </td>
                <td className="py-3 pr-4 text-[12.5px] text-muted">{s.lastActive}</td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card>
          <CardTitle action={<span className="text-[12px] text-muted">{org.memberCount} members</span>}>Chapters</CardTitle>
          <div className="space-y-3">
            {org.chapters.map((chapter, i) => (
              <div key={chapter} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-bg-3 px-4 py-3.5">
                <div>
                  <div className="text-[13.5px] font-medium">{chapter}</div>
                  <div className="text-[11.5px] text-muted-2">{chapterSplit[i] ?? 0} members</div>
                </div>
                <Badge tone={i === 0 ? 'volt' : 'info'}>{i === 0 ? 'HQ' : 'Chapter'}</Badge>
              </div>
            ))}
            <QuickActionButton
              label={
                <>
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                  Add chapter
                </>
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line px-4 py-3.5 text-[12.5px] font-semibold text-muted transition hover:border-volt/30 hover:text-paper"
              title="Add a chapter"
              description="Shares your brand, plans, and sponsor deals with the rest of the club."
              endpoint="/api/v1/club"
              method="PATCH"
              fields={[{ name: 'add_chapter', label: 'Chapter name', required: true, placeholder: 'Harbor City — East' }]}
              submitLabel="Add chapter"
            />
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
                  <code className="rounded bg-white/6 px-2 py-0.5 font-mono text-[12px] text-muted">{maskKey(org.apiKey)}</code>
                  <InstantActionButton
                    label="Rotate"
                    busyLabel="…"
                    className={ghostButton}
                    endpoint="/api/v1/club/api-key"
                    method="POST"
                    confirmMessage="Rotate the live API key? Anything using the old key will stop working immediately."
                  />
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
                  <ExportButton
                    label="Export"
                    className={ghostButton}
                    endpoint="/api/v1/club/export"
                    filename="runos-export.json"
                  />
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
              <QuickActionButton
                label="Transfer"
                className={ghostButton}
                title="Transfer ownership"
                description={`Currently owned by ${org.ownerEmail}. This takes effect immediately.`}
                endpoint="/api/v1/club"
                method="PATCH"
                fields={[{ name: 'transfer_to_email', label: 'New owner email', type: 'email', required: true, placeholder: 'priya@harborcityrunners.run' }]}
                submitLabel="Transfer ownership"
              />
            </div>
            {org.status === 'pending_deletion' ? (
              <div className="flex items-center justify-between gap-4 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3.5">
                <div>
                  <div className="text-[13.5px] font-medium text-danger">
                    Deletion scheduled for {org.deletionScheduledAt ? formatDate(org.deletionScheduledAt) : 'soon'}
                  </div>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted-2">
                    Members, events, and payment history will be permanently removed on that date.
                  </p>
                </div>
                <InstantActionButton
                  label="Cancel deletion"
                  busyLabel="…"
                  className="rounded-full border border-line bg-bg-3 px-3 py-1.5 text-[12px] font-semibold text-paper transition hover:border-volt/40 disabled:opacity-60"
                  endpoint="/api/v1/club"
                  method="PATCH"
                  body={{ status: 'active' }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3.5">
                <div>
                  <div className="text-[13.5px] font-medium text-danger">Delete club</div>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted-2">
                    Permanently removes members, events, and payment history after a 30-day grace period.
                  </p>
                </div>
                <InstantActionButton
                  label="Delete"
                  busyLabel="…"
                  className="rounded-full border border-danger/30 bg-danger/10 px-3 py-1.5 text-[12px] font-semibold text-danger transition hover:bg-danger/20 disabled:opacity-60"
                  endpoint="/api/v1/club"
                  method="PATCH"
                  body={{ status: 'pending_deletion' }}
                  confirmMessage="Schedule this club for deletion in 30 days? You can cancel anytime before then."
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

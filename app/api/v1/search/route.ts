// GET /api/v1/search?q= — universal search across every entity the club owns.
// Returns typed hits with a deep link each, capped per type, for the ⌘K palette.
import { auth, err, ok, unauthorized } from '@/lib/api';
import { getStore } from '@/lib/store';

export const dynamic = 'force-dynamic';

export interface SearchHit {
  type: 'member' | 'event' | 'sponsor' | 'payment' | 'challenge' | 'journey' | 'staff' | 'note';
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

const PER_TYPE = 5;

export async function GET(req: Request): Promise<Response> {
  if (!auth(req)) return unauthorized();
  const q = new URL(req.url).searchParams.get('q')?.trim().toLowerCase() ?? '';
  if (q.length < 2) return err(400, 'query_too_short', 'Provide ?q= with at least 2 characters.');

  const store = getStore();
  const hits: SearchHit[] = [];
  const match = (...fields: (string | undefined)[]) =>
    fields.some((f) => f?.toLowerCase().includes(q));

  for (const m of store.listMembers()) {
    if (hits.filter((h) => h.type === 'member').length >= PER_TYPE) break;
    if (match(m.name, m.email, ...m.tags)) {
      hits.push({ type: 'member', id: m.id, title: m.name, subtitle: `${m.status} · ${m.email}`, href: `/app/community/${m.id}` });
    }
  }
  for (const e of store.listEvents()) {
    if (hits.filter((h) => h.type === 'event').length >= PER_TYPE) break;
    if (match(e.title, e.location, e.routeName)) {
      hits.push({ type: 'event', id: e.id, title: e.title, subtitle: `${e.status} · ${e.location}`, href: `/app/events/${e.id}` });
    }
  }
  for (const s of store.listSponsors()) {
    if (hits.filter((h) => h.type === 'sponsor').length >= PER_TYPE) break;
    if (match(s.name, s.industry, s.contact)) {
      hits.push({ type: 'sponsor', id: s.id, title: s.name, subtitle: `${s.stage} · ${s.industry}`, href: '/app/partners' });
    }
  }
  for (const p of store.listPayments()) {
    if (hits.filter((h) => h.type === 'payment').length >= PER_TYPE) break;
    const member = store.getMember(p.memberId);
    if (match(p.description, member?.name)) {
      hits.push({ type: 'payment', id: p.id, title: p.description, subtitle: `${member?.name ?? 'Unknown'} · $${p.amount} · ${p.status}`, href: '/app/money' });
    }
  }
  for (const c of store.listChallenges()) {
    if (hits.filter((h) => h.type === 'challenge').length >= PER_TYPE) break;
    if (match(c.name, c.metric)) {
      hits.push({ type: 'challenge', id: c.id, title: c.name, subtitle: `${c.participants} participants`, href: '/app/engage' });
    }
  }
  for (const j of store.listJourneys()) {
    if (hits.filter((h) => h.type === 'journey').length >= PER_TYPE) break;
    if (match(j.name, j.trigger)) {
      hits.push({ type: 'journey', id: j.id, title: j.name, subtitle: `${j.status} · ${j.enrolled} enrolled`, href: '/app/growth' });
    }
  }
  for (const s of store.listStaff()) {
    if (hits.filter((h) => h.type === 'staff').length >= PER_TYPE) break;
    if (match(s.name, s.email, ...s.roles)) {
      hits.push({ type: 'staff', id: s.id, title: s.name, subtitle: s.roles.join(', '), href: '/app/platform' });
    }
  }
  for (const m of store.listMembers()) {
    if (hits.filter((h) => h.type === 'note').length >= PER_TYPE) break;
    for (const n of store.listMemberNotes(m.id)) {
      if (match(n.body)) {
        hits.push({ type: 'note', id: n.id, title: n.body.slice(0, 60), subtitle: `${n.kind} on ${m.name}`, href: `/app/community/${m.id}` });
        break;
      }
    }
  }

  return ok(hits, { total: hits.length, q });
}

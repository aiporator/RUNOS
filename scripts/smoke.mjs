#!/usr/bin/env node
// RunOS smoke tests — run against a server: `npm run start` then `npm run smoke`.
// Covers routes, demo API contract, and instant-events flow. Live Supabase flows
// (signup/RSVP) must be tested in a deployed environment (see DEPLOYMENT.md).

const BASE = process.env.SMOKE_BASE ?? 'http://localhost:3000';
const AUTH = { Authorization: 'Bearer ros_demo', 'Content-Type': 'application/json' };

let passed = 0;
let failed = 0;
const failures = [];

function check(name, cond, detail = '') {
  if (cond) {
    passed++;
  } else {
    failed++;
    failures.push(`✗ ${name} ${detail}`);
  }
}

async function get(path, headers = {}) {
  const res = await fetch(BASE + path, { headers });
  let body = null;
  try { body = await res.json(); } catch { /* html */ }
  return { status: res.status, body };
}

async function post(path, data, headers = AUTH) {
  const res = await fetch(BASE + path, { method: 'POST', headers, body: JSON.stringify(data) });
  let body = null;
  try { body = await res.json(); } catch { /* html */ }
  return { status: res.status, body };
}

async function page(path) {
  const res = await fetch(BASE + path);
  return res.status;
}

// ---------- routes ----------
const PAGES_200 = ['/', '/pricing', '/for-gyms', '/for-workshops', '/demo', '/start', '/new',
  '/signup', '/e/ie_demo1', '/c/harbor-city-runners', '/c/harbor-city-runners/evt_003',
  '/app', '/app/community', '/app/events', '/app/events/calendar', '/app/events/evt_001/checkin',
  '/app/events/evt_003/promote', '/app/intelligence', '/robots.txt', '/sitemap.xml', '/openapi.json'];
for (const p of PAGES_200) {
  check(`GET ${p} → 200`, (await page(p)) === 200);
}
check('GET /e/nope → 404', (await page('/e/nope')) === 404);
check('GET /app/community/nope → 404', (await page('/app/community/nope')) === 404);

// ---------- demo API contract ----------
{
  const h = await get('/api/v1/health');
  check('health ok', h.status === 200 && h.body?.status === 'ok');

  const unauth = await get('/api/v1/members');
  check('members without auth → 401', unauth.status === 401 && unauth.body?.error?.code === 'unauthorized');

  const members = await get('/api/v1/members?status=at-risk&limit=2', AUTH);
  check('members list filtered', members.status === 200 && Array.isArray(members.body?.data) && members.body.data.every((m) => m.status === 'at-risk'));

  const reg = await post('/api/v1/events/evt_001/registrations', { member_id: 'mem_044' });
  check('registration created', reg.status === 201 && reg.body?.data?.memberId === 'mem_044');

  const ci1 = await post('/api/v1/events/evt_001/checkin', { member_id: 'mem_044' });
  check('first check-in', ci1.status === 200 || ci1.status === 201, `got ${ci1.status}`);
  check('first check-in not duplicate', ci1.body?.data?.already_checked_in === false);

  const ci2 = await post('/api/v1/events/evt_001/checkin', { member_id: 'mem_044' });
  check('second check-in idempotent', ci2.body?.data?.already_checked_in === true);

  const promo = await get('/api/v1/events/evt_003/promote', AUTH);
  check('promote campaign generated', promo.status === 200 && Array.isArray(promo.body?.data) && promo.body.data.length >= 10);

  const metrics = await get('/api/v1/metrics', AUTH);
  check('metrics read model', metrics.status === 200 && Array.isArray(metrics.body?.data?.wacm));

  const strava = await get('/api/v1/webhooks/strava?hub.challenge=smoke123&hub.mode=subscribe');
  check('strava handshake echo', strava.body?.['hub.challenge'] === 'smoke123');
}

// ---------- instant events flow ----------
{
  const created = await post('/api/v1/public/events', {
    title: 'Smoke Test Run', hostName: 'CI', vertical: 'running-club', type: 'social',
    date: '2026-12-01T09:00:00Z', location: 'Test Park', capacity: 10, price: 0,
  }, { 'Content-Type': 'application/json' });
  check('instant event created', created.status === 201 && created.body?.data?.free === true);
  const id = created.body?.data?.id;

  if (id) {
    check('instant public page 200', (await page(`/e/${id}`)) === 200);
    const rsvp = await post(`/api/v1/public/events/${id}/rsvp`, { name: 'Smoke', email: 'smoke@test.dev' }, { 'Content-Type': 'application/json' });
    check('instant rsvp confirmed', rsvp.body?.data?.status === 'confirmed');
    const dup = await post(`/api/v1/public/events/${id}/rsvp`, { name: 'Smoke', email: 'smoke@test.dev' }, { 'Content-Type': 'application/json' });
    check('instant rsvp dedupe', dup.body?.data?.status === 'already_registered');
  }

  const big = await post('/api/v1/public/events', {
    title: 'Big Run', hostName: 'CI', vertical: 'running-club', type: 'race',
    date: '2026-12-01T09:00:00Z', capacity: 80,
  }, { 'Content-Type': 'application/json' });
  check('capacity >20 flags upgrade', big.body?.data?.requiresUpgrade === true);

  const leads = await post('/api/v1/leads', { org_name: 'Smoke Club', vertical: 'gym' }, { 'Content-Type': 'application/json' });
  check('lead captured (no auth)', leads.status === 201 && leads.body?.data?.status === 'captured');
}

console.log(`\nSmoke: ${passed} passed, ${failed} failed`);
if (failures.length) {
  console.log(failures.join('\n'));
  process.exit(1);
}

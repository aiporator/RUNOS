#!/usr/bin/env node
// RunOS smoke tests — run against a server: `npm run start` then `npm run smoke`.
// Covers routes, demo API contract, and the instant-events flow (in-memory,
// no database required — see DEPLOYMENT.md for the persistence roadmap).

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
const PAGES_200 = ['/', '/pricing', '/for-gyms', '/for-workshops', '/for-runners', '/demo', '/start', '/new', '/talk-to-us',
  '/articles', '/articles/seven-app-problem', '/articles/materials-supply-costs', '/cities', '/cities/berlin', '/cities/amsterdam',
  '/discover', '/my-runs', '/workshops', '/workshops/pottery', '/workshops/woodworking', '/workshops/textile',
  '/e/ie_demo1', '/c/harbor-city-runners', '/c/harbor-city-runners/evt_003',
  '/app', '/app/community', '/app/events', '/app/events/calendar', '/app/events/evt_001/checkin',
  '/app/events/evt_003/promote', '/app/intelligence', '/app/automations', '/robots.txt', '/sitemap.xml', '/openapi.json'];
for (const p of PAGES_200) {
  check(`GET ${p} → 200`, (await page(p)) === 200);
}
check('GET /e/nope → 404', (await page('/e/nope')) === 404);
check('GET /app/community/nope → 404', (await page('/app/community/nope')) === 404);
check('GET /articles/nope → 404', (await page('/articles/nope')) === 404);
check('GET /cities/nope → 404', (await page('/cities/nope')) === 404);
check('GET /workshops/nope → 404', (await page('/workshops/nope')) === 404);

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

// ---------- discovery (runner-facing browse, no auth) ----------
{
  const berlinEvent = await post('/api/v1/public/events', {
    title: 'Smoke Berlin Loop', hostName: 'CI', vertical: 'running-club', type: 'social',
    date: '2026-12-02T07:00:00Z', location: 'Tempelhofer Feld, Berlin', capacity: 15, price: 0,
  }, { 'Content-Type': 'application/json' });
  check('discovery seed event created', berlinEvent.status === 201);

  const list = await get('/api/v1/public/events?limit=50');
  check('public events list (no auth)', list.status === 200 && Array.isArray(list.body?.data) && list.body.data.length > 0);

  const filtered = await get('/api/v1/public/events?q=Berlin');
  check('public events filtered by city', filtered.status === 200 && filtered.body.data.some((e) => e.location.includes('Berlin')));

  const byVertical = await get('/api/v1/public/events?vertical=running-club');
  check('public events filtered by vertical', byVertical.status === 200 && byVertical.body.data.every((e) => e.vertical === 'running-club'));
}

// ---------- appointments (lead → booked call) ----------
{
  const slots = await get('/api/v1/appointments/slots');
  check('appointment slots listed', slots.status === 200 && Array.isArray(slots.body?.data) && slots.body.data.length === 6);
  const slot = slots.body?.data?.[0];

  const unauth = await get('/api/v1/appointments');
  check('appointments without auth → 401', unauth.status === 401);

  const badEmail = await post('/api/v1/appointments', { name: 'Smoke', email: 'not-an-email' }, { 'Content-Type': 'application/json' });
  check('appointment invalid email rejected', badEmail.status === 400);

  const appt = await post('/api/v1/appointments', {
    name: 'Smoke Partner', email: 'partner@smoke.dev', org_name: 'Smoke Club', vertical: 'running-club',
    slot_iso: slot?.iso, slot_label: slot?.label, source: 'smoke_test',
  }, { 'Content-Type': 'application/json' });
  check('appointment requested (no auth)', appt.status === 201 && appt.body?.data?.status === 'requested');

  const list = await get('/api/v1/appointments', AUTH);
  check('appointments list (auth)', list.status === 200 && list.body?.data?.some((a) => a.email === 'partner@smoke.dev'));
}

// ---------- workshop-type pages (craft-specific discovery) ----------
{
  const potteryEvent = await post('/api/v1/public/events', {
    title: 'Smoke Wheel Throwing Basics', hostName: 'CI', vertical: 'workshop', type: 'workshop',
    date: '2026-12-04T10:00:00Z', location: 'Smoke Ceramics Studio', capacity: 8, price: 0,
  }, { 'Content-Type': 'application/json' });
  check('pottery-keyword event created', potteryEvent.status === 201);

  check('pottery workshop page 200 (with live event)', (await page('/workshops/pottery')) === 200);
}

// ---------- V4: undo engine, history, universal search ----------
{
  const created = await post('/api/v1/members', { name: 'Undo Smoke', email: 'undo.smoke@test.dev' });
  check('undo-test member created', created.status === 201 && created.body?.data?.name === 'Undo Smoke');

  const history = await get('/api/v1/history', AUTH);
  check('history lists the mutation', history.status === 200 && history.body?.data?.[0]?.label === 'Member added');

  const undone = await post('/api/v1/undo', {});
  check('undo reverts last mutation', undone.status === 200 && undone.body?.data?.undone === 'Member added');

  const after = await get('/api/v1/members?q=undo.smoke', AUTH);
  check('undone member is gone', after.status === 200 && after.body?.data?.length === 0);

  const search = await get('/api/v1/search?q=maya', AUTH);
  check('universal search finds member', search.status === 200 && search.body?.data?.some((h) => h.type === 'member' && h.title.includes('Maya')));

  const searchNoAuth = await get('/api/v1/search?q=maya');
  check('search requires auth', searchNoAuth.status === 401);

  const shortQ = await get('/api/v1/search?q=a', AUTH);
  check('search rejects short query', shortQ.status === 400);
}

// ---------- V5: copilot, bulk actions, automations ----------
{
  const noAuth = await post('/api/v1/copilot', { query: 'who has not paid?' }, { 'Content-Type': 'application/json' });
  check('copilot requires auth', noAuth.status === 401);

  const badBody = await post('/api/v1/copilot', { nope: true });
  check('copilot rejects missing query', badBody.status === 400);

  const unpaid = await post('/api/v1/copilot', { query: 'who has not paid this month?' });
  check('copilot unpaid intent', unpaid.status === 200 && unpaid.body?.data?.intent === 'unpaid'
    && typeof unpaid.body.data.text === 'string' && Array.isArray(unpaid.body.data.actions));

  const attendance = await post('/api/v1/copilot', { query: 'why is attendance down?' });
  check('copilot attendance intent', attendance.status === 200 && attendance.body?.data?.intent === 'attendance');

  const quiet = await post('/api/v1/copilot', { query: 'who has gone quiet lately?' });
  check('copilot inactive intent has real action', quiet.status === 200 && quiet.body?.data?.intent === 'inactive'
    && quiet.body.data.actions.every((a) => a.href || a.endpoint));
}

{
  const membersRes = await get('/api/v1/members?limit=2', AUTH);
  const ids = (membersRes.body?.data ?? []).map((m) => m.id);
  check('two members fetched for bulk test', ids.length === 2);

  const badAction = await post('/api/v1/members/bulk', { ids, action: 'explode', value: 'x' });
  check('bulk rejects unknown action', badAction.status === 400);

  const badStatus = await post('/api/v1/members/bulk', { ids, action: 'status', value: 'vip' });
  check('bulk rejects invalid status value', badStatus.status === 400);

  const bulk = await post('/api/v1/members/bulk', { ids, action: 'status', value: 'at-risk' });
  check('bulk status update affects both', bulk.status === 201 && bulk.body?.data?.affected === 2);
  await post('/api/v1/undo', {});

  const msg = await post('/api/v1/members/bulk', { ids, action: 'message', value: 'Smoke bulk hello' });
  check('bulk message affects both', msg.status === 201 && msg.body?.data?.affected === 2);
  const audit = await get('/api/v1/audit?limit=3', AUTH);
  check('bulk message is one audit entry', audit.status === 200
    && audit.body?.data?.some((e) => e.action === 'member.bulk_messaged'));
  await post('/api/v1/undo', {});
}

{
  const list = await get('/api/v1/automations', AUTH);
  check('automations list has seeds', list.status === 200
    && list.body?.data?.automations?.some((a) => a.id === 'atm_001' && a.enabled));

  const runsBefore = list.body?.data?.automations?.find((a) => a.id === 'atm_001')?.runs ?? 0;
  const pay = await post('/api/v1/payments', { member_id: 'mem_001', kind: 'merch', description: 'Smoke automation tee', amount: 25 });
  check('payment recorded (automation trigger)', pay.status === 201);

  const after = await get('/api/v1/automations', AUTH);
  const atm1 = after.body?.data?.automations?.find((a) => a.id === 'atm_001');
  check('payment triggered receipt automation', after.status === 200 && atm1?.runs === runsBefore + 1);
  check('automation run logged with steps', after.body?.data?.runs?.[0]?.automationId === 'atm_001'
    && after.body.data.runs[0].steps.length === 2);

  const notes = await get('/api/v1/members/mem_001/notes', AUTH);
  check('receipt note reached the member', notes.status === 200
    && notes.body?.data?.some((n) => String(n.body ?? n.text ?? '').includes('Receipt: $25')));
  await post('/api/v1/undo', {});

  const toggleRes = await fetch(BASE + '/api/v1/automations/atm_003', {
    method: 'PATCH', headers: AUTH, body: JSON.stringify({ enabled: true }),
  });
  const toggleBody = await toggleRes.json().catch(() => null);
  check('automation toggle enables', toggleRes.status === 200 && toggleBody?.data?.enabled === true);
  await post('/api/v1/undo', {});

  const createBad = await post('/api/v1/automations', { name: 'x', trigger: 'nope', steps: [] });
  check('automation create validates trigger', createBad.status === 400);

  const createOk = await post('/api/v1/automations', {
    name: 'Smoke welcome', trigger: 'member.created', steps: [{ kind: 'add_tag', value: 'smoke' }],
  });
  check('automation created', createOk.status === 201 && createOk.body?.data?.enabled === true);
  await post('/api/v1/undo', {});
}

console.log(`\nSmoke: ${passed} passed, ${failed} failed`);
if (failures.length) {
  console.log(failures.join('\n'));
  process.exit(1);
}

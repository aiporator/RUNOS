# RunOS v1.0 — Production Report

Date: 2026-07-05 · Branch: `claude/clubos-product-vision-35afwj`

## Verification results (all machine-verified this session)

| Gate | Result |
|---|---|
| TypeScript (strict) | ✅ 0 errors |
| ESLint (next/core-web-vitals) | ✅ 0 errors (5 advisory warnings: intentional `<img>` on marketing pages, font-loading pattern, one hooks-deps note) |
| Production build | ✅ 55 routes compile |
| Smoke suite (`npm run smoke`) | ✅ 39/39 — routes, demo API contract (auth/401, registration, idempotent check-in, promote, metrics, Strava handshake), instant events (create → RSVP → dedupe → upgrade flag), lead capture |
| Browser sweep (32 routes × desktop 1440px + mobile 390px) | ✅ 0 page errors, 0 unexpected console errors, 0 hydration warnings, 404s only where intended |
| Supabase RLS (live-tested as `anon` role) | ✅ public reads of orgs/published events; RSVP insert allowed; attendee rows invisible to anon (0 rows); counts via security-definer function; duplicate email rejected |
| PostHog | ✅ Dashboard 793128 with 4 insights; events wired: signup_completed, account_created, club_created, event_created, event_published, live_event_published, public_page_viewed, rsvp_started, live_rsvp_submitted, event_cancelled, csv_exported, + funnel/wedge events |

## Completed in the v1.0 hardening pass

- Organizer quick actions on the live dashboard (`/my`): copy share link, per-event **Export
  CSV** (attendees, owner-only via RLS), **Cancel** with confirmation dialog (+ Republish),
  **Duplicate** (prefills the form), status flashes with `role="status"`.
- Cancelled events badge + they disappear from the public page (published=false).
- RSVP form: `rsvp_started` on first focus, aria-labels, duplicate handling, waitlist state.
- SEO/platform baseline: favicon (`app/icon.svg`), `robots.txt` (disallows /my, /app, /api),
  `sitemap.xml`, `metadataBase`, Open Graph + Twitter cards, canonical.
- ESLint installed and gated; all errors fixed.
- Smoke test suite (`scripts/smoke.mjs`, `npm run smoke`).
- Docs: `DEPLOYMENT.md` (env, Vercel, Supabase setup, local dev, troubleshooting, ops),
  README quickstart, pilot runbook (already present).

## Known limitations (v1, stated plainly)

1. **No transactional email.** RSVP confirmations, waitlist promotions, cancellations, and
   reminders are not sent — organizers message their group directly (the runbook says so).
   Requires an email provider key + custom SMTP; deliberately not faked.
2. **No automatic waitlist promotion** (depends on email + an attendee-cancel flow).
3. **No app-side rate limiting** on public inserts (RSVPs/leads). Supabase Auth has built-in
   limits; add middleware/WAF if abuse appears.
4. **One organizer per club; no event edit-in-place** (cancel + duplicate covers the pilot).
5. `/app` organizer OS runs on seeded demo data — it is the product tour; live clubs operate
   on `/my` + `/r/`. Migrating `/app` onto live data is the next engineering phase.
6. No automated unit/integration test framework — coverage is the smoke suite + browser
   sweep. Add Vitest/Playwright test harness as the codebase stabilizes post-pilot.

## Performance summary

Shared JS baseline ~102 kB; typical page first-load 103–120 kB; heaviest routes are
Intelligence (219 kB, recharts) and live pages (~237–241 kB, supabase-js) — all lazy to
their routes via App Router code-splitting. Marketing images are remote Unsplash with
`loading="lazy"`. Real Core Web Vitals must be measured post-deploy (Vercel Analytics or
PostHog Web Vitals) — not measurable in this sandbox.

## Security summary

- RLS verified end-to-end as the anon role (see table above); attendee PII owner-only.
- Only public client keys in the repo (Supabase anon + PostHog project key — public by
  design); no service-role key, no server secrets; `.env*` gitignored with `.env.example`.
- React escaping throughout; no `dangerouslySetInnerHTML` on user content; inputs validated
  (required fields, email type, capacity bounds 1–1000 DB-checked, price ≥ 0 DB-checked).
- SQL injection: no string-built SQL — supabase-js parameterized + demo store in-memory.
- CSRF: no cookie-authenticated mutating endpoints (Supabase uses bearer tokens).
- Remaining: rate limiting (above), SOC 2 roadmap per security doc.

## Database summary

Supabase project `srujvjjncrszhaaxepxf` (eu-north-1): `runos_orgs`, `runos_events`
(indexed org_id+starts_at), `runos_rsvps` (unique event+email), `runos_leads`,
`runos_event_stats()` security definer. Migration `runos_pilot_schema` in history.
Seeded pilot: `pilot@aiporate.com` / club `harbor-city-runners-live`.

## Deployment checklist (the only remaining steps — ~30 min, manual)

1. Vercel: import repo → deploy → add domain `run.aiporate.com` (CNAME).
2. Supabase Auth: Site URL → production domain; choose email-confirmation mode.
3. **Post-deploy manual walkthrough** (cannot be automated from this sandbox because its
   proxy blocks `*.supabase.co`; browsers/Vercel are unaffected):
   signup → create club → publish run → open `/r/<slug>` incognito → RSVP → duplicate RSVP
   rejected → count updates in `/my` → Export CSV → Cancel → gone from public page →
   Republish → verify PostHog events arriving.
4. Optional before 20-club scale: custom SMTP, Sentry.

## Release notes — v1.0

- Live mode: accounts, club workspaces, event publishing, public club pages, 10-second
  RSVP with waitlist + dedupe, CSV export, cancel/republish/duplicate — on Supabase + RLS.
- Instant events: 60-second event pages, free ≤ 20 people, no account.
- Full organizer OS demo (8 surfaces incl. Pacer AI, QR check-in) as the guided tour.
- Marketing site + funnel (demo, wizard, verticals) fully instrumented in PostHog.
- REST API v1 (21 demo + 3 public endpoints) with OpenAPI spec.

## Recommendation

**READY FOR PUBLIC LAUNCH at pilot scale (the first 20 clubs)** — contingent on executing
the deployment checklist above and passing the 15-minute post-deploy manual walkthrough.
Every gate that can be verified from this environment has been verified and passes. The
items that cannot (production deploy, live-domain E2E, real email, Core Web Vitals field
data) are explicitly listed and take under an hour of operator time.

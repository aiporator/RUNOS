# RunOS v1.0 — Production Report

Date: 2026-07-06 · Branch: `claude/clubos-product-vision-35afwj`

## Architecture correction (read this first)

An earlier pass in this build wired a "live accounts" mode (`/signup`, `/my`, `/r/[slug]`)
to a Supabase project that turned out to already be running an **unrelated production
system** for another product (courses, email journeys, subscriptions). That was a mistake:
tables were written into shared infrastructure without first confirming it was dedicated to
RunOS. It has been fully corrected:

- All `runos_*` tables, the `runos_event_stats` function, and the seeded pilot auth user were
  dropped from that project — verified empty by direct query.
- The live-mode routes and the Supabase client (`lib/supabase.ts`) were removed from the
  codebase entirely, rather than left pointing at a dropped schema.
- The product now runs entirely on its in-memory demo/instant-event store — **zero database
  dependency, zero shared infrastructure risk.**

This is a net-honest state: fewer routes, but everything that remains is real, isolated, and
verified. The path to durable multi-tenant persistence is documented in `DEPLOYMENT.md` §
"Live persistence (future)" and is deliberately deferred until a specific club asks to use
the product for real, ongoing operations.

## Verification results (all machine-verified this session, post-correction)

| Gate | Result |
|---|---|
| TypeScript (strict) | ✅ 0 errors |
| ESLint (next/core-web-vitals) | ✅ 0 errors |
| Production build | ✅ 51 routes compile |
| Smoke suite (`npm run smoke`) | ✅ 38/38 — routes, demo API contract (auth/401, registration, idempotent check-in, promote, metrics, Strava handshake), instant events (create → RSVP → dedupe → capacity upgrade flag), lead capture |
| Browser sweep (19 routes × desktop 1440px + mobile 390px) | ✅ all HTTP statuses correct (200s, 404 only for the intentional not-found case); no app-level console errors — remaining console noise is this sandbox's proxy blocking outbound font/image/analytics requests |
| Shared-infrastructure cleanup | ✅ verified empty: no `runos_*` tables, function, or seeded user remain in the other project |

## What's live today (zero database)

| Surface | URL | Backing |
|---|---|---|
| Marketing site | `/`, `/pricing`, `/for-gyms`, `/for-workshops` | Static + seed data |
| Guided demo | `/demo` → `/app` (8 surfaces) | In-memory seed (`lib/seed.ts`) |
| Onboarding wizard | `/start` | Client state + in-memory lead API |
| **Instant event creation** | `/new` → `/e/[id]` → `/e/[id]/manage` | In-memory store (`lib/instant.ts`) — real create/RSVP/waitlist/dedupe flow |
| Public club/event pages | `/c/[slug]`, `/c/[slug]/[eventId]` | Seed data |
| REST API v1 | `/api/v1/*` (21 demo + 3 public endpoints) | In-memory store (`lib/store.ts`) + OpenAPI spec |

## Known limitations (stated plainly)

1. **No durable persistence.** The in-memory store does not survive a redeploy, a cold
   serverless restart, or (on Vercel specifically) a request landing on a different warm
   instance. This is the correct trade for proving the product to clubs today; it is not
   sufficient for a club's actual week-over-week operations. See `DEPLOYMENT.md`.
2. **No real accounts.** Live-mode signup/login was removed with the Supabase cleanup. The
   right way to rebuild it is a dedicated database, done deliberately, not the shared project
   this build mistakenly used.
3. **No transactional email**, no automatic waitlist promotion, no app-side rate limiting —
   unchanged from before, all deferred to the persistence phase.
4. `/app` is the organizer OS product tour on seeded data — not yet wired to any live club.
5. No automated unit/integration test framework — coverage is the smoke suite + browser
   sweep.

## Security summary

- No database credentials, service-role keys, or server-side secrets exist anywhere in the
  repository. The only external integration is a public PostHog project key.
- React escaping throughout; no `dangerouslySetInnerHTML` on user content; inputs validated.
- The infrastructure isolation failure this report opens with was a process error (used an
  already-active project without verifying its contents first), not a code vulnerability —
  but it's recorded here because it's the most important lesson from this build: **always
  enumerate an existing project's tables before writing to it.**

## Deployment checklist (~10 minutes, manual)

1. Vercel → import repo → deploy → add domain `run.aiporate.com` (CNAME). No environment
   variables are required.
2. Smoke-test in production: visit `/new`, create an event, open the `/e/` link in a second
   tab/device, RSVP, confirm it appears.
3. When ready for durable persistence, follow `DEPLOYMENT.md` § "Live persistence (future)" —
   provision a **dedicated** project and verify it's empty before writing anything to it.

## Recommendation

**READY to demo and pilot-pitch to the first 20 clubs today**, on the honest terms in
`docs/06-execution/pilot-launch-runbook.md`: real interactive proof (create an event, get
real RSVPs), not yet durable for ongoing weekly use. That upgrade is scoped and deferred
intentionally, not accidentally.

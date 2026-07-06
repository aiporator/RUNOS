# RunOS — Deployment & Operations Guide

## Stack at a glance

| Layer | Tech | Notes |
|---|---|---|
| Web app | Next.js 15 (App Router), React 19, TypeScript strict, Tailwind | 51 routes: marketing, funnel, demo workspace, instant events, API |
| Data | In-memory seeded store (`lib/seed.ts`, `lib/store.ts`, `lib/instant.ts`) | Powers `/app` tour, `/new` → `/e/[id]` instant events, `/api/v1/*` demo API. **Zero database required.** |
| Analytics | PostHog EU (`lib/analytics.ts`) | Dashboard "RunOS Funnel" (id 793128) |

**No database dependency today, by design.** An earlier pass wired a live-accounts mode to
Supabase, but it was built against a shared project that turned out to already run an
unrelated production system — that code and its schema have been removed entirely (see
"Live persistence (future)" below for the right way to add it back). Everything currently in
this repo runs the proof-of-concept path: realistic, interactive, shareable — on a single
running Node process, no external service required beyond PostHog analytics.

## Environment variables

Only one integration ships today, and it's optional:

```
NEXT_PUBLIC_POSTHOG_KEY=…        # PostHog project key (public, safe client-side)
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

A working default is baked in for the pilot. There are **no server-side secrets** in this
codebase and no database credentials of any kind.

## Deploy to Vercel

1. Vercel → Add New Project → import `aiporator/RUNOS`, branch of choice. Next.js auto-detected.
2. (Optional) set the PostHog env vars above.
3. Domains → add `run.aiporate.com` → create the CNAME Vercel shows on the aiporate.com DNS.

That's it — no database setup, no auth provider config. Deploy and it works.

### Important caveat: in-memory state on serverless

`lib/store.ts` and `lib/instant.ts` hold state in a `globalThis`-scoped module variable. This
is reliable as long as requests land on the **same warm process** — true for `npm start` on a
single machine, and true in practice for a short demo session on Vercel (repeated requests
within a few minutes usually hit the same warm serverless instance). It is **not** guaranteed
across:
- a cold start after inactivity,
- a new deployment,
- Vercel routing a request to a different regional instance.

**What this means in practice:** an instant event created via `/new` may not be visible to a
different visitor's request if it lands on a different instance, and any created event is
lost on redeploy or a cold restart. This is fine — even good — for live demo calls and short
pilot tests. It is not durable enough for clubs to run their actual weekly operations on for
weeks at a time. See "Live persistence (future)" below for the upgrade path.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npx next lint      # eslint (core-web-vitals)
npm run build && npm start
npm run smoke      # assertions against the running server
```

## Testing

`npm run smoke` covers: all routes (200/404), the demo API contract (auth, registration,
idempotent check-in, promote, metrics, Strava handshake), and the full instant-events flow
(create → RSVP → dedupe → capacity upgrade flag). Everything it tests runs with zero external
dependencies, so it's safe to run in any CI environment including this one.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Instant event "not found" after creating it | Hit a different serverless instance (see caveat above) — retry in the same browser tab/session, or run locally / on a persistent host for a live demo |
| An event you created earlier is gone | Server restarted or redeployed — in-memory state does not survive this by design |
| PostHog events missing | Ad-blocker in your browser, or key/host overridden incorrectly |

## Live persistence (future) — how to do this correctly

When a club is ready to actually run their weekly operations on RunOS (not just try it), the
right move is a **dedicated** database — not a shared project used by another product. Steps:

1. Provision a dedicated Postgres project (Supabase free tier, Neon, or similar) that belongs
   to RunOS alone. Never reuse a project that already serves another application — confirm
   with `select table_name from information_schema.tables` before writing anything into an
   existing project.
2. Apply the multi-tenant schema in `docs/03-architecture/database-schema.md` (RLS policies,
   `club_id` on every tenant table).
3. Swap `lib/store.ts` / `lib/instant.ts` internals for real queries — the function signatures
   are already the repository interface, so this is a scoped swap, not a rewrite.
4. Add real auth (magic link or email/password) scoped to that dedicated project.
5. Re-verify with a full manual walkthrough (signup → create club → publish → public RSVP →
   data survives a redeploy) before onboarding real clubs onto it.

## Operations notes

- **Monitoring:** PostHog for product analytics; add Sentry (connector available) for error
  tracking as a fast follow once real user traffic exists.
- **Rate limiting:** none app-side yet — add before opening `/new` and the lead-capture API
  to high-volume public traffic.

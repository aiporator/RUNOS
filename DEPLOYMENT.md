# RunOS — Deployment & Operations Guide

## Stack at a glance

| Layer | Tech | Notes |
|---|---|---|
| Web app | Next.js 15 (App Router), React 19, TypeScript strict, Tailwind | 55 routes: marketing, funnel, demo workspace, live mode, API |
| Live data | Supabase (Postgres + Auth + RLS) | Tables `runos_orgs/events/rsvps/leads`, function `runos_event_stats` |
| Demo data | In-memory seeded store (`lib/seed.ts`, `lib/store.ts`, `lib/instant.ts`) | Powers `/app` tour, `/e/` instant events, `/api/v1/*` demo API |
| Analytics | PostHog EU (`lib/analytics.ts`) | Dashboard "RunOS Funnel" (id 793128) |

## Environment variables

All client-side public keys (protected by RLS / project settings). Working defaults are baked
in for the pilot; override to rotate:

```
NEXT_PUBLIC_SUPABASE_URL=…       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=…  # anon public key (never the service_role key)
NEXT_PUBLIC_POSTHOG_KEY=…        # PostHog project key
NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

There are **no server-side secrets** in this codebase. Never add the Supabase `service_role`
key to any `NEXT_PUBLIC_` variable or client file.

## Deploy to Vercel (production)

1. Vercel → Add New Project → import `aiporator/RUNOS`, branch of choice. Next.js auto-detected.
2. (Optional) set the env vars above.
3. Domains → add `run.aiporate.com` → create the CNAME Vercel shows on the aiporate.com DNS.
4. Supabase dashboard → Authentication → URL Configuration → Site URL = `https://run.aiporate.com`.
5. Decide email confirmation (Auth → Providers → Email): OFF for instant pilot onboarding, or
   ON (flow supports it). Default Supabase SMTP ≈ 4 emails/hour — add custom SMTP (e.g. Resend)
   before scale.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npx next lint      # eslint (core-web-vitals)
npm run build && npm start
npm run smoke      # 40+ assertions against the running server
```

## Supabase setup (fresh project)

Apply the two migrations in order (SQL editor or CLI):
1. `runos_pilot_schema` — tables, RLS policies, `runos_event_stats()` (see migration history
   in the current project, or `docs/03-architecture/database-schema.md` for the full future schema).
2. Optional seed: pilot user + demo club (see `docs/06-execution/pilot-launch-runbook.md`).

**RLS model (verified):** orgs and published events are publicly readable; RSVPs are
insert-only for anon; attendee rows are readable only by the club owner; counts exposed via
the security-definer stats function; leads are insert-only.

## Testing

- `npm run smoke` — routes (200/404), demo API contract (auth, registration, idempotent
  check-in, promote, metrics, Strava handshake), instant-events flow (create → RSVP → dedupe
  → upgrade flag), lead capture.
- **Must be tested manually post-deploy** (Supabase is reachable from browsers/Vercel but not
  from every CI sandbox): signup → club creation → publish run → public page RSVP → CSV
  export → cancel/republish. Checklist in `docs/06-execution/pilot-launch-runbook.md`.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Signup returns "check your email" | Email confirmation is ON in Supabase Auth — expected; or turn it off for the pilot |
| No emails arriving | Default Supabase SMTP rate limit (~4/hr) — configure custom SMTP |
| Public page shows no events | Event `published=false` (cancelled) or wrong slug |
| RSVP "already on the list" | Duplicate email for that event (unique constraint) — expected |
| Live pages empty locally | Corporate proxy blocking `*.supabase.co` — works in browser/Vercel |
| PostHog events missing | Ad-blocker in your browser, or key/host overridden incorrectly |

## Operations notes

- **Backups:** Supabase daily backups on all tiers; export via dashboard before schema changes.
- **Rate limiting:** none app-side yet (v1 limitation) — Supabase Auth has built-in limits;
  add middleware or Vercel WAF rules if abuse appears.
- **Monitoring:** PostHog for product analytics; add Sentry (connector available) for error
  tracking as a fast follow.

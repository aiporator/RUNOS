# Pilot Launch Runbook — First 20 Running Clubs

> Goal: 20 real clubs planning real runs on RunOS live mode within 30 days.
> Live mode is built and verified: **create account → create club → plan first run →
> public page → real RSVPs**, backed by Supabase Postgres with row-level security.

## What's live right now

| Flow | URL | Backend |
|---|---|---|
| Create account + club | `/signup` | Supabase Auth (email/password) + `runos_orgs` |
| Plan your first run | `/my` | `runos_events` (publish → live instantly) |
| Public club page + RSVP | `/r/[slug]` | `runos_rsvps` — anyone can register, only the owner sees the list |
| Instant one-off events | `/new` → `/e/[id]` | demo store (no account path) |

**Security model (verified):** public pages expose org name + published events + registration
*counts* only. Attendee names/emails are readable exclusively by the club owner (RLS policy).
Anonymous visitors can insert RSVPs but never read them. Duplicate emails are rejected per event.

**Test account (seeded):** `pilot@aiporate.com` / `RunOSpilot2026!` → club "Harbor City
Runners" at `/r/harbor-city-runners-live` with one published Saturday long run.

## Go-live checklist (once, ~30 minutes)

1. **Deploy:** import the repo into Vercel → attach `run.aiporate.com`. No env vars strictly
   required (Supabase/PostHog public keys have baked-in defaults; override via `.env.example`
   vars if you rotate keys).
2. **Supabase auth settings** (dashboard → Authentication):
   - Set Site URL to `https://run.aiporate.com` (email confirmation links redirect here).
   - Decide on email confirmation: OFF = instant onboarding (recommended for pilot);
     ON = keep, the signup flow already handles the confirm-then-sign-in path.
   - Default Supabase SMTP is rate-limited (~4 emails/hour) — fine for a trickle, add a
     custom SMTP (Resend free tier) before pushing 20 clubs in one day.
3. **Smoke test in production:** sign up with a fresh email, create a club, publish a run,
   open `/r/<your-slug>` in an incognito window, RSVP, watch the count appear in `/my`.
4. **Watch the funnel:** PostHog dashboard "RunOS Funnel" — `account_created`,
   `live_event_published`, `live_rsvp_submitted` are already instrumented.

## The 20-club sprint (the playbook)

**Week 1 — warm 5 (white-glove):**
- Source: clubs you personally know + local parkrun-adjacent crews. Offer: "I'll set your
  whole club up while we're on a 20-minute call. Free forever under 50 members."
- On the call: `/signup` → publish their real Saturday run → send the `/r/` link to their
  WhatsApp group before the call ends. The first real RSVP arriving live is the magic moment.

**Week 2–3 — outbound 10:**
- Instagram DM to run-club accounts (100–1,000 followers, active weekly posts). Script:
  *"Your Saturday run deserves better than a pinned WhatsApp message. We built a free page
  for clubs like yours — registration, capacity, reminders. Takes 5 minutes: [link]. Want me
  to set it up for you?"*
- Every RSVP'd runner on any pilot page sees "Powered by RunOS — start your club free."

**Week 4 — referral 5:**
- Ask each live club for one intro to another club ("who do you race with?").
- Publish the first mini case study (with permission): "X club moved Saturday sign-ups from
  WhatsApp chaos to one link — here's what changed."

**Weekly cadence:** 15-minute check-in message to each club; track per-club: events
published, RSVPs, RSVP-to-show rate (ask them), and the one thing they wish it did.
That wish-list is the sprint backlog's ground truth.

## Success criteria (day 30)

- 20 clubs signed up · ≥ 14 published ≥ 1 run · ≥ 8 published ≥ 3 runs (habit formed)
- ≥ 300 total RSVPs across pilot clubs
- ≥ 5 clubs answering "very disappointed" to "if RunOS went away" (Sean Ellis question)
- A ranked wish-list to drive the next build phase (likely: reminders via email, recurring
  events, member import — all already spec'd in the roadmap)

## Known limits of live mode v1 (say them out loud to pilots)

- One club per account; no co-organizers yet (roadmap H1).
- No automated reminder emails yet — clubs share the link in their existing channels.
- The full workspace at `/app` is the product tour (seeded demo data), not yet wired to
  live clubs — pilots run on `/my` + `/r/`. Migrating `/app` onto live data is the next
  engineering phase and the pilot's feedback decides its order.

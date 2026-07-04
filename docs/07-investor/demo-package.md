# RunOS — Investor Demo Package

> For a seed conversation at **$2M+**. Every claim below maps to something the investor can
> click, run, or read in this repository — not a mockup, not a deck promise.
> Companion docs: [Investor Narrative](../01-vision/investor-narrative.md) ·
> [Pitch Deck](../01-vision/investor-pitch-deck.md) · [36-Month Roadmap](../06-execution/roadmap-36-months.md)

---

## Why we are further than a deck-stage seed

Most seed decks sell a plan. This is a **plan plus a working system**. The asymmetry to show:

| Typical seed-stage | RunOS today |
|---|---|
| Product vision slide | 28-document product bible: IA, wireframes, DB schema (executable SQL), API spec, security/GDPR model, 36-month roadmap, sprint-level backlog |
| Figma prototype | Working Next.js platform: 43 live routes, all 8 product surfaces, production build green |
| "We'll have AI" | Pacer answers "Plan October" and "Who is at risk of quitting?" with the club's real numbers, cited sources, review-before-send |
| "API-first (someday)" | 21 REST endpoints live: auth, pagination, consent-filtered reads, idempotent check-in, audit log, Strava webhook handshake + OpenAPI 3.1 |
| One vertical | Vertical engine shipped: running clubs, gyms, studios, workshops, communities — same OS, adapted nouns, event types, and marketing pages |
| "We'll figure out distribution" | The funnel is built AND instrumented: /demo → /start wizard → lead API → PostHog events; every public event page carries a "Powered by RunOS" growth loop |
| Feature list | Moat mechanics implemented: consent scopes on every profile, k≥50 anonymized benchmarks in-product, social campaign auto-generation per event |

**The one-liner:** *"We're raising at demo-day maturity with post-seed execution evidence:
the category thesis, the full product blueprint, and a working platform — built before the round."*

## The 12-minute live demo (script)

Run `npm install && npm run build && npm start` → localhost:3000. Or the deployed URL.

1. **Cold open — the site** (`/`): "Strava owns activity… nobody owns the operating system."
   Scroll the eight surfaces. *Beat: category creation, not another app.*
2. **The funnel works** (`/demo` → `/start`): pick "Workshops", name it, import a CSV, draft
   the first event. *Beat: self-serve PLG motion is built; every step emits a PostHog event —
   show the funnel dashboard live if traffic exists.*
3. **The organizer OS** (`/app`): dashboard — WACM north-star, churn watch, Pacer's read.
   *Beat: one login replaces seven apps.*
4. **The wow: event day** (`/app/events/evt_001/checkin`): QR mission control, press
   Start simulation — live arrivals, first-timer badges. *Beat: operational software, not a CRM skin.*
5. **The moat: consent** (`/app/community/mem_008`): the 7-scope consent panel. *Beat:
   consented data layer = defensible data asset regulators and members both accept.*
6. **The brain: Pacer** (`/app/intelligence`): ask "Plan October", then "Who's at risk of
   quitting?" — real names, real forecast, sources cited. *Beat: the club's digital COO;
   marginal cost near zero, priced into Pro.*
7. **The revenue surface** (`/app/partners`): sponsor pipeline kanban, €47.9k pipeline;
   vendor marketplace with 10% take. *Beat: SaaS is the wedge, transactions are the business.*
8. **The expansion: verticals** (`/for-gyms`, `/for-workshops`, `/app/events/calendar`):
   calendar-first scheduling, recurring schedules. *Beat: TAM extends from run clubs to every
   community that meets — same engine.*
9. **Distribution compounding** (`/c/harbor-city-runners/evt_003`): public event page →
   "Powered by RunOS" → `/start`. Then `/app/events/evt_003/promote`: 11 auto-drafted posts
   across 6 channels, scheduling queue. *Beat: every event a club publishes markets RunOS
   and itself.*
10. **Close with the end game**: 50,000 clubs · 18M runners · 500 brands · 150 countries.
    The ask and use of funds (below).

## Proof inventory (what diligence can verify today)

- **Build:** `npm run build` → 43 routes, zero errors. TypeScript strict throughout.
- **API:** `curl` examples in `app/api/README.md` all work against the running server;
  OpenAPI at `/openapi.json`. Registration mutates state; check-in is idempotent; audit log records every mutation.
- **Analytics:** canonical event taxonomy live in `lib/analytics.ts` (demo_started,
  wizard_completed, lead_captured, promote_scheduled, public_rsvp_submitted…), flowing to PostHog EU.
- **Architecture readiness:** multi-tenant Postgres schema with RLS policies written
  (`docs/03-architecture/database-schema.md`); the in-memory store's function signatures are
  the repository interface — the swap is scoped, not a rewrite.
- **Security & privacy posture:** GDPR Art. 9 handling, consent revocation propagation,
  k≥50 anonymization, SOC 2 timeline (`docs/03-architecture/security-and-privacy.md`).
- **GTM machinery:** pricing with gating logic, founding-club offer, funnels with 7-touch
  sequences, enterprise kit with MEDDICC + battlecards (`docs/05-business/`).

## Honest maturity statement (use it — it builds trust)

Working platform on seeded demo data; production multi-tenancy, Stripe money movement, and
live tracker OAuth are the first 90 days of the raise (H1 of the roadmap, sprint backlog
already written). We show this table ourselves before being asked:

| Layer | Status |
|---|---|
| Product surfaces (8) + funnel + verticals | ✅ Built, demoable end-to-end |
| REST API + OpenAPI + audit | ✅ Built, live-verified |
| Analytics instrumentation | ✅ Live (PostHog EU) |
| Postgres + RLS multi-tenancy | 📐 Schema written, swap scoped |
| Stripe Connect payments | 📐 Flows designed, fee logic implemented in API |
| Strava/Garmin OAuth ingestion | 📐 Connector architecture + webhook handshake built |
| Social posting (native APIs / Postiz-Ayrshare) | 📐 Content engine + queue built, dispatcher spec'd |

## Use of a $2M+ round (18–24 months, from the narrative memo)

- ~55% engineering (2 squads: productionize data layer, payments, ingestion, member mobile app)
- ~20% GTM (founding-club program in 5 cities, benefits-network density, first brand pilots)
- ~15% founder-led sales + customer success (white-glove migrations as a weapon)
- ~10% buffer/compliance (SOC 2 Type I, DPAs, pentest)
- Milestones it buys: 500 clubs · $60k MRR · 45k WACM · first brand revenue (the Q1–Q4 OKR arc in `docs/05-business/kpi-framework-and-okrs.md`)

## Data room index

`docs/00-foundation` brief · `01-vision` narrative + deck · `02-product` UX ·
`03-architecture` tech/DB/API/security/social · `04-intelligence` Pacer/automations/network ·
`05-business` pricing/KPI/GTM/funnel/enterprise · `06-execution` roadmap/specs/backlog ·
this file. Codebase = the live exhibit.

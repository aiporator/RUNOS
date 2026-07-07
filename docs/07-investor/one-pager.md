# RunOS — Investor One-Pager

**The operating system for communities that move.** | An Aiporate.com brand |
run.aiporate.com | start@aiporate.com

---

## The problem

Community sport is booming — run clubs, gyms, studios, workshop organizers — but every one
of them runs on the same duct tape: WhatsApp for chatter, Strava for activity, Eventbrite
for tickets (taking 5%+), Google Sheets for members, Instagram for reach, PayPal for dues.
Seven tools, zero of them connected, and one exhausted volunteer acting as the API between
them. When that volunteer burns out, the community stalls. Strava owns activity. WhatsApp
owns communication. Eventbrite owns events. **Nobody owns the operating system.**

## The solution

**RunOS is the connective layer**: one login, one database, one workflow. Members, events,
payments, sponsors, growth automations, and an AI chief-of-staff ("Pacer") that predicts
attendance, flags churn, drafts sponsor proposals from verified data, and plans whole months.
Every published event auto-creates its landing page, registration, QR check-in, reminders,
and a full social campaign across six channels.

**Three doors, one engine:**
1. **Solo** — anyone creates an event page in 60 seconds, free ≤ 20 people, no account, real
   RSVPs from real people (the Luma-style wedge that Eventbrite taxes) — **live today, try it**
2. **Workspace** — clubs, gyms, studios, workshop organizers (Starter free < 50 members → Club $79 → Pro $199/mo)
3. **Network** — multi-chapter orgs, franchises, cities, federations (from $999/mo)

## Why now

Run-club and community-fitness participation is at an all-time high post-2020; brands are
shifting spend from paid ads to verified communities; organizers have professionalized their
ambitions but not their tooling. The category (community operating system) is unowned.

## The moat — compounding in order

1. **Workflow lock-in** — replace 7 tools; switching cost grows with every automation wired
2. **Consented data layer** — every runner controls 7 sharing scopes; the club gets an
   operational view no third party has; GDPR-native by design
3. **Network effects** — benefits passport (local perks), brand marketplace, and anonymized
   cross-club benchmarks (k≥50): each club makes every club smarter
4. **Distribution loops built-in** — every public event page and every attendee ticket says
   "Powered by RunOS"; every social post is drafted by us

## Business model

SaaS tiers + platform fee that *shrinks* as clubs grow (2% → 0.5%), ticket fees below
Eventbrite, 10% marketplace commission, brand-side SaaS ($499+/mo per seat) and campaign
fees, AI add-on ($29/mo). Model: ~80/20 SaaS-to-transactions in year 1 → 55/45 by year 3.
Target LTV:CAC ≥ 5:1 self-serve, ≥ 3:1 sales-assisted; NRR engine 110%+.

## Where we are — further than a deck

**The platform is built, not promised** (all verifiable in the repo today):
- 52-route production web platform: all 8 product surfaces, organizer calendar, QR check-in
  mission control, Pacer AI, sponsor CRM, benefits engine, white-label settings
- Complete self-serve funnel: instant demo → onboarding wizard → lead API, fully
  instrumented in PostHog with live dashboards
- 24-endpoint REST API + OpenAPI 3.1, consent-filtered reads, idempotent check-in, audit log
- Micro-events wedge **live and testable right now**: create a real event at /new, share the
  link, real people RSVP — plus a social campaign generator (11 posts / 6 channels per event)
- 30+ document execution bible: multi-tenant Postgres schema design (RLS), security/GDPR
  model, 36-month roadmap, sprint-level backlog, GTM playbooks, enterprise sales kit

**Honest maturity:** the product runs today on an in-memory data layer by design — real
interactions, no durable storage yet. Multi-tenant Postgres (schema already designed),
accounts, and payments (Stripe Connect) are the first 90 days post-raise — the sprint
backlog is already written. We'd rather show a smaller number of things that are completely
real than a larger number staged behind a login.

## The raise

**$2.5M seed** → 18–24 months of runway. ~55% engineering (2 squads), ~20% GTM
(founding-club program: 50 clubs across Amsterdam, London, Berlin, NYC, Austin), ~15%
founder-led sales & white-glove migrations, ~10% compliance/buffer (SOC 2 Type I).

**Milestones it buys (year-1 OKR arc):** 50 founding clubs (Q1) → 500 organizations,
~$60k MRR, 45,000 weekly-active community members, first brand revenue (Q4).

## The end game

50,000 clubs · 18M runners · 500 brands · 150 countries — then the same OS for every
community that meets and moves (CommunityOS). Every run, every class, every workshop,
every community — flowing through one operating system.

## Try it yourself

- **Create a real event, get a real RSVP:** `/new` → publish → share the link → `/e/[id]`
- **The full organizer OS:** `/demo` → `/app` (CRM, QR check-in, Pacer AI, sponsors)
- **A club's public page:** `/c/harbor-city-runners`

---

*Data room: this repository · Contact: start@aiporate.com*

# RunOS — Canonical Product Brief

> **This document is the single source of truth.** Every other document in this repository
> must agree with the decisions recorded here. If a document contradicts this brief, the
> brief wins. Changes to naming, pricing, personas, module names, or stack happen here first.

---

## 1. The One-Liner

**RunOS is the operating system for running communities.**

Strava owns activity. WhatsApp owns communication. Instagram owns attention. Eventbrite owns
events. Shopify owns merchandise. HubSpot owns customer data. **Nobody owns the operating
system.** RunOS is the connective layer that lets running clubs manage, scale, monetize, and
own their communities from a single platform — one login, one database, one workflow, one
ecosystem.

- **Company / platform name:** RunOS (the white-label layer is marketed to clubs' members
  under each club's own brand — "Powered by RunOS")
- **Tagline:** *The Operating System for Running Communities*
- **Category we create:** Community Operating System (vertical OS for run clubs)
- **Positioning:** Infrastructure, not another app. We don't compete with Strava, WhatsApp,
  or Eventbrite — we orchestrate them and own the workflow layer above them.

## 2. Core Philosophy

Running clubs don't need another app. They need **one source of truth**.

1. One source of truth — one login, one database, one workflow, one ecosystem.
2. Automate everything repetitive.
3. Every action creates valuable data.
4. **Data belongs to the club and is shared only with member consent.** Members control
   granular sharing; clubs get the operational view; the network gets only anonymized,
   aggregated insight.
5. Every module connects to every other module.
6. Every workflow is measurable.
7. Every screen reduces operational friction.
8. Mobile-first with desktop power.
9. Enterprise-grade architecture.
10. Multi-tenant SaaS supporting thousands of clubs.

## 3. Canonical Personas

Use these names and roles consistently in every journey, wireframe, spec, and story:

| Persona | Name | Role | Core job-to-be-done |
|---|---|---|---|
| **Organizer** | Maya Okafor | Founder & head organizer, "Lagos Road Runners" (450 members) | Run the club like a professional org without drowning in spreadsheets, WhatsApp threads, and unpaid admin hours |
| **Member / Runner** | Leo Martins | Marketing manager, runs 4×/week, joined via a friend | Belong, improve, get recognized, unlock perks — without managing five apps |
| **Brand Manager** | Sofia Lindqvist | Field marketing lead at a running-shoe brand | Reach real, verified running audiences with measurable ROI instead of spreadsheet-and-hope sponsorships |
| **Vendor** | Dr. Emre Kaya | Sports physiotherapist | Fill his calendar with high-intent local athletes; get paid and reviewed in one place |
| **City / Enterprise** | Amsterdam Active (city sports office) | Municipal health & tourism program | Discover, fund, and measure community sport initiatives |
| **Chapter lead** | Priya Sharma | Volunteer captain of a club's second-city chapter | Run her chapter with autonomy inside the parent club's system |

## 4. Canonical Module Map

Eight product surfaces (top-level nav), containing all modules. Use these exact surface
names everywhere:

1. **Community** — CRM, member profiles, unified runner profile, community feed, messaging,
   segments, community score, volunteer management
2. **Events** — event builder, registrations, QR check-in, waivers, routes library, pacers,
   equipment, weather, live attendance, emergency/medical (consented), waitlists
3. **Money** — memberships, payments (Stripe Connect), finance, invoices, budget,
   merchandise (Shopify + native light commerce), ticket fees
4. **Growth** — Growth OS automations, customer journey builder, funnel builder, landing
   pages, email/SMS/push, referral engine, surveys, content generation
5. **Engage** — challenges, rewards, benefits passport (exclusive perks), ambassador
   management, gamification, leaderboards
6. **Partners** — sponsor CRM, Brand Portal, vendor marketplace, campaign manager,
   partnership ROI reporting, City Portal
7. **Intelligence** — analytics, attendance prediction, churn prediction, revenue
   forecasting, network intelligence (anonymized cross-club benchmarks), AI assistant
   ("**Pacer**", the club's digital COO)
8. **Platform** — settings, permissions, integrations, API access, white-label websites &
   mobile apps, multi-chapter & franchise management, knowledge base

## 5. The AI Assistant

- **Name: Pacer** — "your club's digital COO."
- Surfaces: omnipresent command bar (⌘K), chat panel, inline "draft for me" actions,
  proactive digests.
- Canonical capabilities: attendance prediction, churn risk lists, ambassador candidate
  scoring, brand-fit matching, sponsor proposal drafting, event landing pages, Instagram
  carousels, newsletters, revenue forecasts, monthly planning ("Plan October").
- Grounding: RAG over the club's own data + anonymized network benchmarks; never exposes
  another club's raw data.

## 6. Data Layer & Integrations (the moat)

**Fitness ingestion:** Strava, Garmin, COROS, Polar, Suunto, Apple Health, Google Health
Connect, Fitbit, TrainingPeaks, Zwift.
**Business:** Stripe (payments — Stripe Connect for club payouts), Shopify (merch),
Mailchimp, HubSpot, Meta, TikTok, Google Analytics, Slack, Discord, WhatsApp.

Canonical ingestion model: per-provider connectors normalize into a unified `activities`
schema; consent scopes govern what the club sees (see §9). Every workout, race, pace, PR,
kilometer, and check-in lives inside RunOS, owned by the club, controlled by the member.

**Unified Runner Profile** — one profile aggregating: identity, membership, activity,
attendance, purchases, events, friends, volunteer hours, challenges, rewards, coach notes,
nutrition, goals, brand interactions, merch history, race history, content appearances,
community score, lifetime value.

## 7. Canonical Pricing (subject to GTM testing, but use these numbers everywhere)

| Tier | Price | For | Headline limits |
|---|---|---|---|
| **Starter** | Free | New clubs < 50 members | Core Community + Events, RunOS branding, 2% platform fee on payments |
| **Club** | $79/mo (or $790/yr) | Growing clubs | 500 members, Growth OS, benefits passport, integrations, 1% platform fee |
| **Pro** | $199/mo (or $1,990/yr) | Serious clubs | 2,000 members, Pacer AI unlimited, white-label web, Sponsor CRM + Brand Portal, predictions, 0.5% platform fee |
| **Network** | Custom (from $999/mo) | Multi-chapter orgs, franchises, cities, federations | Unlimited, white-label mobile app, API access, SSO, SLA, dedicated CSM |

**Other revenue lines:** marketplace commission (10% on vendor bookings), brand-side SaaS
(Brand Portal seats from $499/mo + campaign fees), payment processing margin, ticket fees
(2% + $0.30 per paid registration on Starter/Club), premium AI add-on for Starter/Club
($29/mo), API access, enterprise licensing.

## 8. Canonical Tech Stack

- **Frontend:** Next.js (App Router) + React, TypeScript, Tailwind + design tokens;
  mobile: React Native (Expo) — one codebase powering the white-label member apps.
- **Backend:** TypeScript, NestJS modular monolith → service extraction later; REST + 
  webhooks public API (OpenAPI), tRPC internal; GraphQL deferred.
- **Data:** PostgreSQL 16, multi-tenant via `club_id` + Row-Level Security; pgvector for
  AI embeddings; Redis (cache/queues); ClickHouse for analytics events; S3-compatible
  object storage.
- **Async:** event bus (outbox pattern → NATS/Kafka later), BullMQ workers, Temporal for
  long-running automations/journeys.
- **AI:** Anthropic Claude models via API for Pacer (generation, planning, agents) +
  classical ML (gradient boosting) for churn/attendance/LTV predictions.
- **Payments:** Stripe Connect (destination charges; club is merchant of record for
  memberships/tickets; RunOS takes application fee).
- **Infra:** containers on AWS (ECS/EKS), Terraform, multi-region-ready, EU + US data
  residency options.

## 9. Permission & Consent Model (canonical)

- **Tenancy:** Organization (club) → Chapters → Members. Multi-chapter = one org, many
  chapters, shared or separate billing.
- **Staff roles:** Owner, Admin, Organizer, Coach, Finance, Content, Volunteer-coordinator,
  Read-only. Role = bundle of granular permissions; custom roles on Pro+.
- **Member consent scopes** (member-controlled, per-club): `profile.basic`,
  `activity.summary`, `activity.detailed`, `health.medical`, `location.live`,
  `marketing.brands`, `photos.appearances`. Defaults are conservative; medical and brand
  scopes are always opt-in.
- **Brand/vendor access:** aggregated & anonymized only, unless a member explicitly opts
  into a campaign. Cities see only aggregate dashboards.
- **Network intelligence:** cross-club data is anonymized + k-anonymity thresholds (no
  segment smaller than 50 shown).

## 10. North-Star & Metric Language

- **North-star metric:** **Weekly Active Community Members (WACM)** — members who attended,
  logged, posted, redeemed, or transacted in the last 7 days, across all clubs.
- Input trees: club acquisition → activation ("first 3 events published, 30% members
  joined") → engagement (WACM) → monetization (GMV + SaaS MRR) → network effects
  (benefits redemptions, brand campaigns, marketplace GMV).
- The end-game numbers used in narrative docs: 50,000 clubs, 18M runners, 500 brands,
  150 countries.

## 11. Brand Voice (for all copy)

- Voice: confident, warm, athletic; "we run the boring stuff so you can run the club."
- Never corporate-cold, never bro-hustle. Short sentences. Verbs over adjectives.
- Design references: Linear (quality), Notion (flexibility), Stripe (clarity), Apple
  (restraint), Superhuman (speed). Mobile-first, dark-mode-first for member surfaces,
  light-first for organizer desktop.

## 12. Document Map

| Area | Folder | Contents |
|---|---|---|
| Vision & narrative | `docs/01-vision/` | Product vision, brand strategy, investor narrative, pitch deck |
| Product & UX | `docs/02-product/` | IA, user journeys, wireframes, UI system & tokens, onboarding, demo flow |
| Architecture | `docs/03-architecture/` | Technical architecture, database schema, API, permissions, security & privacy, integrations |
| Intelligence | `docs/04-intelligence/` | AI features (Pacer), automation engine, network intelligence |
| Business | `docs/05-business/` | Monetization & pricing, KPIs & OKRs, GTM, sales funnel, landing copy, enterprise sales |
| Execution | `docs/06-execution/` | 36-month roadmap, feature specs (stories + acceptance criteria), sprint backlog |

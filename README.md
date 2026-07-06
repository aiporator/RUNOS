# RunOS — The Operating System for Running Communities

> Strava owns activity. WhatsApp owns communication. Instagram owns attention.
> Eventbrite owns events. Shopify owns merchandise. HubSpot owns customer data.
> **Nobody owns the operating system. That's RunOS.**

Running clubs don't need another app. They need **one source of truth** — one login,
one database, one workflow, one ecosystem. RunOS is the connective layer that lets
running clubs manage, scale, monetize, and own their communities, while every runner
controls exactly what they share.

This repository is both the **working product** (Next.js platform: marketing site, funnel,
organizer workspace demo, instant events, REST API) and the **product bible** — the complete
execution blueprint for design, engineering, and go-to-market teams. It runs with **zero
database dependency** today — everything is a real, interactive, shareable prototype backed
by an in-memory store, by deliberate design. See `DEPLOYMENT.md` for the durable-persistence
roadmap once a club is ready to run real operations on it.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck    # TypeScript strict — 0 errors
npx next lint        # ESLint (core-web-vitals) — 0 errors
npm run build        # production build — 55 routes
npm start && npm run smoke   # smoke assertions against the running server
```

**Key surfaces:** `/` marketing · `/demo` instant product tour · `/start` onboarding wizard ·
`/new` 60-second event creator (real create → share → RSVP, no account) ·
`/talk-to-us` book a real call slot (lead + appointment capture, no calendar dependency) ·
`/app` full organizer OS (seeded demo) ·
`/api/v1/*` REST API (`app/api/README.md`, OpenAPI at `/openapi.json`).

**Deploy:** see [`DEPLOYMENT.md`](DEPLOYMENT.md). **Pilot playbook:**
[`docs/06-execution/pilot-launch-runbook.md`](docs/06-execution/pilot-launch-runbook.md).

---

## Start Here

**[`docs/00-foundation/canonical-brief.md`](docs/00-foundation/canonical-brief.md)** —
the single source of truth for naming, personas, module map, pricing, stack, and the
consent model. Every other document must agree with it.

## Document Map

### 01 — Vision & Narrative
| Doc | What's inside |
|---|---|
| [Product Vision](docs/01-vision/product-vision.md) | The big vision, problem, thesis, flywheel, horizons, end game, core principles |
| [Brand Strategy](docs/01-vision/brand-strategy.md) | Positioning, naming rationale, voice & tone, messaging architecture, visual direction, white-label brand rules |
| [Investor Narrative](docs/01-vision/investor-narrative.md) | The fundraising memo: market shift, wedge, moat stack, TAM/SAM/SOM, unit economics, risks & counters |
| [Investor Pitch Deck](docs/01-vision/investor-pitch-deck.md) | 16 slides, fully scripted: headlines, visuals, speaker notes |

### 02 — Product & UX
| Doc | What's inside |
|---|---|
| [Information Architecture](docs/02-product/information-architecture.md) | Sitemaps for all four apps, the 8 surfaces, screen inventory, global patterns |
| [User Journeys](docs/02-product/user-journeys.md) | End-to-end journeys for Maya, Leo, Sofia, Emre, Priya — aha moments and time-to-value |
| [UX Wireframes](docs/02-product/ux-wireframes.md) | Annotated wireframes for the ~15 highest-stakes screens |
| [UI System & Design Tokens](docs/02-product/ui-system-and-design-tokens.md) | Full token set (JSON), component inventory, white-label theming, accessibility |
| [Onboarding Flow](docs/02-product/onboarding-flow.md) | Club, member, brand, vendor onboarding — screen by screen, with copy and activation metrics |
| [Demo Flow](docs/02-product/demo-flow.md) | The scripted 12-minute sales demo + 3-minute self-serve tour + seed data spec |

### 03 — Architecture
| Doc | What's inside |
|---|---|
| [Technical Architecture](docs/03-architecture/technical-architecture.md) | System diagram, module boundaries, multi-tenancy & RLS, scaling path, infra, key sequences |
| [Database Schema](docs/03-architecture/database-schema.md) | Full PostgreSQL DDL by domain, ERDs, RLS policies, partitioning & analytics strategy |
| [API Architecture](docs/03-architecture/api-architecture.md) | Public REST + webhooks, auth, rate limits, connector architecture for all 20 integrations |
| [Permission Model](docs/03-architecture/permission-model.md) | RBAC matrix, member consent scopes, brand/vendor/city access, enforcement layers |
| [Security & Privacy](docs/03-architecture/security-and-privacy.md) | Threat model, GDPR design, health-data controls, minors, SOC 2 roadmap, anonymization spec |
| [Integrations](docs/03-architecture/integrations.md) | Per-integration specs, activity normalization & dedup, club importers |

### 04 — Intelligence
| Doc | What's inside |
|---|---|
| [AI Features (Pacer)](docs/04-intelligence/ai-features.md) | The club's digital COO: capability catalog, RAG/agent architecture, privacy rules, rollout |
| [Automation Engine](docs/04-intelligence/automation-engine.md) | Growth OS runtime: triggers/conditions/actions, journey builder, Event Growth Pack, recipe library |
| [Network Intelligence](docs/04-intelligence/network-intelligence.md) | Cross-club benchmarks, recommendations, privacy pipeline, the compounding moat |

### 05 — Business
| Doc | What's inside |
|---|---|
| [Monetization & Pricing](docs/05-business/monetization-and-pricing.md) | 10 revenue lines, tier gating matrix, offer design, unit economics, NRR engine |
| [KPI Framework & OKRs](docs/05-business/kpi-framework-and-okrs.md) | Metric tree from WACM down, guardrails, first-year OKRs, event taxonomy |
| [GTM Strategy](docs/05-business/gtm-strategy.md) | Beachhead, motion sequencing, growth loops, channel plan, founding-club launch playbook |
| [Sales Funnel](docs/05-business/sales-funnel.md) | Club + brand funnels, nurture sequences, objection matrix, pipeline stages |
| [Landing Page Copy](docs/05-business/landing-page-copy.md) | Complete homepage, /for-brands, pricing, founding-club program copy |
| [Enterprise Sales Assets](docs/05-business/enterprise-sales-assets.md) | Network-tier sales kit: MEDDICC, discovery bank, ROI calculator, battlecards, RFP library |

### 06 — Execution
| Doc | What's inside |
|---|---|
| [36-Month Roadmap](docs/06-execution/roadmap-36-months.md) | Six outcome-based horizons: own the workflow → the ecosystem → the category |
| [Feature Specifications](docs/06-execution/feature-specifications.md) | Full specs for the 6 MVP features: stories, acceptance criteria, analytics, consent touchpoints |
| [Sprint Backlog](docs/06-execution/sprint-backlog.md) | Sprint 0–8 ticket-level backlog: by sprint 8 a founding club runs end-to-end on RunOS |

---

## The Shape of the Company

| | |
|---|---|
| **Category** | Community Operating System (vertical OS for run clubs) |
| **Wedge** | Organizer pain — replace 7 apps and one exhausted volunteer |
| **Moat** | Consented data layer + benefits network + cross-club intelligence + white-label switching costs |
| **North star** | Weekly Active Community Members (WACM) |
| **AI** | Pacer — the club's digital COO |
| **Pricing** | Starter (free) · Club $79/mo · Pro $199/mo · Network (custom) |
| **End game** | 50,000 clubs · 18M runners · 500 brands · 150 countries |

*Positioning rule: RunOS is infrastructure, not another app. We don't compete with
Strava, WhatsApp, or Eventbrite — we orchestrate them and own the workflow layer above.*

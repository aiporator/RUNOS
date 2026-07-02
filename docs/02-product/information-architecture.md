# RunOS — Information Architecture

> Owner: UX Director / Head of Product Design
> Status: v1.0 — execution-ready. Conforms to `docs/00-foundation/canonical-brief.md`.
> Scope: full sitemap for the Organizer web app, Member app, Brand Portal, Vendor Portal, and marketing site; global patterns; UX object model; navigation and permission rules.

---

## 1. The Four Apps (plus the marketing site)

| App | Audience | Form factor | Brand | Design bias |
|---|---|---|---|---|
| **Organizer web app** | Maya, Priya, club staff | Desktop-first, responsive down to tablet; critical flows work on mobile web | RunOS brand | Light-first, density-tunable, keyboard-driven |
| **Member app** | Leo and every runner | Mobile-first (React Native / Expo), white-labeled per club | Club's brand ("Powered by RunOS") | Dark-mode-first, thumb-reachable, glanceable |
| **Brand Portal** | Sofia and brand teams | Web, desktop-first | RunOS brand | Light, report-grade polish, export-friendly |
| **Vendor Portal** | Emre and service vendors | Web, mobile-friendly | RunOS brand | Light, calendar-centric, minimal chrome |
| **Marketing site** | Prospective organizers, brands, vendors | Web | RunOS brand | Conversion-focused, product-truthful |

One identity system underneath: a single RunOS account can hold multiple roles (Leo can be a member of two clubs and a chapter lead of one; Maya is Owner of Lagos Road Runners and a member elsewhere). Role and club context determine which app experience you land in.

---

## 2. Organizer Web App — Full Sitemap

Top-level navigation = the eight canonical surfaces, preceded by **Today** (the home dashboard) and followed by the Pacer panel toggle. Left rail on desktop; bottom sheet nav on tablet/mobile web.

```
RunOS Organizer
├── Today                       ← home dashboard (not a surface; the daily cockpit)
├── 1. Community
├── 2. Events
├── 3. Money
├── 4. Growth
├── 5. Engage
├── 6. Partners
├── 7. Intelligence
├── 8. Platform
└── Pacer (⌘K / side panel — omnipresent, not a nav destination)
```

### 2.0 Today (home)

| Screen | Purpose (one line) |
|---|---|
| Today dashboard | The daily cockpit: next event, action queue, live KPIs, Pacer digest — everything Maya needs before coffee ends. |
| Action queue | Unified inbox of things needing a human decision (approvals, replies, at-risk members, failed payments). |
| Weekly digest | Pacer's Monday summary: what happened, what's at risk, what to do — readable in 90 seconds. |

### 2.1 Community

Modules: CRM, member profiles, unified runner profile, community feed, messaging, segments, community score, volunteer management.

```
Community
├── Members (CRM)
│   ├── Member list (table + board views, saved views)
│   ├── Member profile (Unified Runner Profile — canonical Member detail)
│   ├── Import center (CSV / WhatsApp export / Strava club)
│   └── Merge & dedupe
├── Segments
│   ├── Segment list
│   └── Segment builder (filter composer, live count)
├── Feed
│   ├── Feed moderation view
│   └── Post composer (announcements, pinned posts, polls)
├── Messaging
│   ├── Inbox (DMs, group threads, broadcast history)
│   └── Broadcast composer (channel picker: push / email / SMS / WhatsApp)
├── Community Score
│   └── Score dashboard (formula, trend, member distribution)
└── Volunteers
    ├── Volunteer roster
    ├── Shift board (per-event volunteer slots)
    └── Hours ledger
```

| Screen | Purpose |
|---|---|
| Member list | Find, filter, and act on any member in under 3 seconds; bulk actions and saved views. |
| Member profile | The Unified Runner Profile: one page that answers "who is this person to our club?" |
| Import center | Turn a spreadsheet, WhatsApp export, or Strava club into a living CRM in one sitting. |
| Merge & dedupe | Resolve duplicate people created by multi-source import without losing history. |
| Segment list | Reusable audiences ("lapsed 30d", "5K-pace women", "volunteers") that power Growth and Engage. |
| Segment builder | Compose filters across profile, activity, attendance, and purchase data with a live member count. |
| Feed moderation | See the club feed as members see it; pin, remove, or reply as the club. |
| Post composer | Publish an announcement, photo drop, or poll to the member feed and selected channels. |
| Inbox | Every member conversation in one place; assignable to staff; SLA hints. |
| Broadcast composer | One message, many channels, per-member channel preference respected. |
| Score dashboard | Understand community health (attendance × posting × redemption) and who drives it. |
| Volunteer roster / shift board / hours ledger | Staff events with volunteers, track hours, thank people automatically. |

### 2.2 Events

Modules: event builder, registrations, QR check-in, waivers, routes library, pacers, equipment, weather, live attendance, emergency/medical (consented), waitlists.

```
Events
├── Calendar (month/week/agenda; the surface's home)
├── Event list (upcoming / past / drafts, filterable)
├── Event builder (create/edit — canonical Event detail in edit mode)
│   ├── Basics (title, type, date, location, route)
│   ├── Registration (capacity, tickets/price, waitlist, waiver)
│   ├── Logistics (pacers, volunteers, equipment checklist)
│   ├── Comms (auto reminders, landing page, share kit)
│   └── Review & publish
├── Event overview (published event: registrations, page stats, comms status)
├── Live Day (check-in mission control)
│   ├── QR scan station view
│   ├── Live attendance board
│   └── Emergency panel (consented medical + emergency contacts; break-glass)
├── Routes library (route cards: map, distance, elevation, surface, safety notes)
├── Recurring series manager (templates + exceptions)
└── Waivers (templates, signature status per event)
```

| Screen | Purpose |
|---|---|
| Calendar | See the club's rhythm at a glance; drag to reschedule; weather overlaid. |
| Event list | Operational list of everything planned and past, with registration fill bars. |
| Event builder | Publish a professional event in under 4 minutes; Pacer drafts copy and picks routes. |
| Event overview | Single pane for a published event: who's coming, comms sent, page conversion. |
| Live Day | Run event morning from a phone: scan, watch numbers climb, handle exceptions. |
| QR scan station | Full-screen scanner for volunteers; works offline, syncs when back. |
| Live attendance board | Real-time checked-in count vs. RSVPs, no-show list forming live. |
| Emergency panel | Break-glass access to consented medical info and emergency contacts; fully audited. |
| Routes library | Reusable route cards so "Tuesday 8K river loop" is one click, not a WhatsApp debate. |
| Recurring series manager | Set the weekly run once; manage exceptions, holiday skips. |
| Waivers | One template, auto-attached, signature tracking; unsigned = flagged at check-in. |

### 2.3 Money

Modules: memberships, payments (Stripe Connect), finance, invoices, budget, merchandise (Shopify + native light commerce), ticket fees.

```
Money
├── Overview (revenue dashboard: MRR, GMV, payouts, fees)
├── Memberships
│   ├── Plans (tiers, pricing, benefits mapping)
│   ├── Subscribers (status, renewals, dunning)
│   └── Membership detail (canonical Membership detail)
├── Payments
│   ├── Transactions ledger
│   ├── Payouts (Stripe Connect payout schedule + status)
│   └── Refunds & disputes
├── Invoices (create, send, track — sponsors and B2B)
├── Budget (event and annual budgets, actual vs. plan)
└── Merch
    ├── Store (native light commerce: products, drops)
    ├── Shopify sync (connection, product mapping)
    └── Orders (canonical Order detail lives here)
```

| Screen | Purpose |
|---|---|
| Money overview | Answer "how is the club doing financially?" in one screen: MRR, event GMV, next payout. |
| Plans | Design membership tiers and what each unlocks (perks, event pricing, merch discounts). |
| Subscribers | Every membership's state: active, past-due (dunning), canceling, renewal dates. |
| Membership detail | One membership's full story: payments, plan changes, dunning attempts, notes. |
| Transactions ledger | Search any payment ever; export for the treasurer. |
| Payouts | When money lands in the club's bank, itemized; Stripe Connect status. |
| Refunds & disputes | Handle exceptions fast with policy presets. |
| Invoices | Send professional invoices to sponsors; auto-reminders; paid status. |
| Budget | Plan an event or year; RunOS fills in actuals automatically. |
| Store / Shopify sync / Orders | Sell the club singlet without becoming an e-commerce manager. |

### 2.4 Growth

Modules: Growth OS automations, customer journey builder, funnel builder, landing pages, email/SMS/push, referral engine, surveys, content generation.

```
Growth
├── Automations (Growth OS)
│   ├── Automation list (active/paused, health)
│   ├── Automation builder (canvas: trigger → conditions → actions — canonical Automation detail)
│   └── Templates gallery (recipes: "welcome series", "win-back lapsed 30d", "post-event thanks")
├── Journeys (multi-week lifecycle canvases; built on the same canvas as Automations)
├── Funnels (funnel builder + conversion reports)
├── Landing pages
│   ├── Page list
│   └── Page editor (block-based; Pacer drafts from event/campaign data)
├── Campaign sends (one-off email / SMS / push composer + history)
├── Referrals (program setup, leaderboard, reward rules)
├── Surveys (NPS, post-event, custom; results explorer)
└── Content studio (Pacer-generated newsletters, Instagram carousels, captions)
```

| Screen | Purpose |
|---|---|
| Automation list | Every robot working for the club, with run counts and health status. |
| Automation builder | Visual trigger→condition→action canvas; test mode; plain-language summary sentence. |
| Templates gallery | Start from proven recipes; one-click install with club data pre-wired. |
| Journeys | Design the 90-day new-member experience once; watch cohorts flow through it. |
| Funnels | Define steps (visit → RSVP → attend → join) and see where people fall out. |
| Page list / editor | Ship a beautiful event or membership landing page in minutes, on-brand. |
| Campaign sends | One-off broadcasts with audience picker, preview per channel, send-time optimizer. |
| Referrals | Turn Leo inviting friends into a measured, rewarded engine. |
| Surveys | Ask, collect, and see results tied back to member profiles. |
| Content studio | Pacer drafts the newsletter and the carousel; humans approve and post. |

### 2.5 Engage

Modules: challenges, rewards, benefits passport (exclusive perks), ambassador management, gamification, leaderboards.

```
Engage
├── Challenges
│   ├── Challenge list
│   ├── Challenge builder (goal type, dates, eligibility, prizes)
│   └── Challenge detail (progress, leaderboard, joiners — canonical Challenge detail)
├── Benefits Passport
│   ├── Perk catalog (club + network perks)
│   ├── Perk editor (canonical Perk detail in edit mode)
│   └── Redemptions log
├── Rewards & badges (rule list: "10 attendances → Bronze", badge artwork manager)
├── Leaderboards (attendance, distance, streaks; period pickers; fairness settings)
└── Ambassadors
    ├── Ambassador roster (active ambassadors, their reach & contribution)
    ├── Candidate scoring (Pacer-ranked candidates with reasons)
    └── Ambassador toolkit (assets, tracked links, perk grants)
```

| Screen | Purpose |
|---|---|
| Challenge list / builder / detail | Create "October 100K" in 2 minutes; watch participation live. |
| Perk catalog | Everything members can unlock — club-negotiated and network-wide perks. |
| Perk editor | Define a perk: value, eligibility tier, redemption method (QR/code/link), inventory. |
| Redemptions log | Proof of perk usage — the data that powers brand ROI stories. |
| Rewards & badges | Automate recognition so nobody's 100th run goes unnoticed. |
| Leaderboards | Friendly competition with guardrails (pace-adjusted, opt-out respected). |
| Ambassador roster / scoring / toolkit | Find, appoint, and equip the members who grow the club. |

### 2.6 Partners

Modules: sponsor CRM, Brand Portal (organizer-facing controls), vendor marketplace, campaign manager, partnership ROI reporting, City Portal.

```
Partners
├── Sponsors (Sponsor CRM)
│   ├── Pipeline (kanban: lead → contacted → proposal → active → renewal)
│   ├── Sponsor detail (org record: contacts, deals, deliverables, reports)
│   └── Proposal composer (Pacer drafts from real club data)
├── Campaigns
│   ├── Campaign list (active, pending approval, completed)
│   ├── Campaign detail (canonical Campaign detail: deliverables, audience, results)
│   └── Approval queue (brand-initiated campaigns awaiting club consent)
├── Brand reports (shareable ROI report builder + sent-report tracker)
├── Marketplace
│   ├── Vendor directory (browse/search local vendors)
│   ├── Vendor detail (services, reviews, book)
│   └── Bookings (club-level bookings: physio at Saturday run, etc.)
└── City Portal (organizer view: programs the club participates in, grant reporting)
```

| Screen | Purpose |
|---|---|
| Sponsor pipeline | Treat sponsorship like sales: stages, values, next steps, never-drop-a-ball. |
| Sponsor detail | Everything about one sponsor: contract, deliverables checklist, sent reports. |
| Proposal composer | Pacer turns real attendance/audience data into a proposal PDF in one minute. |
| Campaign list / detail | Manage every brand activation: what was promised, what ran, what it did. |
| Approval queue | Clubs stay in control: no brand campaign touches members without club approval. |
| Brand reports | Generate the ROI report that gets sponsors to renew; share as live link or PDF. |
| Vendor directory / detail / bookings | Book vetted local services (physio, photographer, coach) with payments handled. |
| City Portal (organizer view) | Participate in municipal programs; report aggregates without spreadsheet pain. |

### 2.7 Intelligence

Modules: analytics, attendance prediction, churn prediction, revenue forecasting, network intelligence (anonymized cross-club benchmarks), AI assistant (Pacer).

```
Intelligence
├── Analytics home (KPI wall: WACM, attendance, revenue, growth; drill-in)
├── Reports
│   ├── Attendance report (by event type, weekday, weather, cohort)
│   ├── Membership report (growth, churn, LTV, cohort retention)
│   ├── Revenue report (streams, forecasts vs. actuals)
│   └── Engagement report (feed, challenges, redemptions)
├── Predictions
│   ├── Attendance forecast (next events, with confidence + drivers)
│   ├── Churn radar (at-risk member list with reasons and one-click plays)
│   └── Revenue forecast (12-month, scenario sliders)
├── Benchmarks (network intelligence: anonymized cross-club comparisons, k≥50)
└── Pacer home (chat history, saved answers, scheduled digests, capability catalog)
```

| Screen | Purpose |
|---|---|
| Analytics home | The club's vitals in one glance; every number clicks through to its report. |
| Attendance / Membership / Revenue / Engagement reports | Deep, filterable answers to the four questions boards ask. |
| Attendance forecast | Know Saturday's turnout on Wednesday; staff and order accordingly. |
| Churn radar | A ranked list of at-risk members with the reason and a suggested play. |
| Revenue forecast | See 12 months ahead; drag scenario sliders (price change, member growth). |
| Benchmarks | "Clubs like yours retain 8% better with a welcome series" — anonymized, k-anonymity ≥ 50. |
| Pacer home | The assistant's front door: history, saved prompts, digest schedule. |

### 2.8 Platform

Modules: settings, permissions, integrations, API access, white-label websites & mobile apps, multi-chapter & franchise management, knowledge base.

```
Platform
├── Club settings (profile, locale, timezone, legal entity, data residency)
├── Team & permissions (staff list, roles: Owner/Admin/Organizer/Coach/Finance/Content/
│   Volunteer-coordinator/Read-only; custom roles on Pro+; audit log)
├── Chapters
│   ├── Chapter list (health tiles per chapter)
│   ├── Chapter detail (leads, members, delegated permissions, shared vs. local settings)
│   └── Franchise controls (brand kit enforcement, template push, rollup reporting)
├── Integrations (connector gallery: Strava, Garmin, COROS, Polar, Suunto, Apple Health,
│   Google Health Connect, Fitbit, TrainingPeaks, Zwift, Stripe, Shopify, Mailchimp,
│   HubSpot, Meta, TikTok, Google Analytics, Slack, Discord, WhatsApp)
├── White-label
│   ├── Brand kit (logo, colors, typography → semantic token overrides; contrast guardrails)
│   ├── Website builder (club public site)
│   └── Mobile app config (Network tier: app icon, splash, store listing)
├── API & webhooks (keys, scopes, webhook endpoints, delivery log)
├── Billing (RunOS plan, usage, invoices — the club's own subscription)
└── Knowledge base (help center, onboarding checklist, "Setup Score")
```

---

## 3. Member App — Sitemap (mobile-first, white-labeled)

Bottom tab bar, five tabs. Club brand everywhere; RunOS appears only as "Powered by RunOS" in settings/about.

```
Member App (club-branded)
├── Home (feed)
│   ├── Club feed (posts, event cards, kudos, photo drops)
│   ├── Story-style event recaps
│   └── Notification center
├── Events
│   ├── Upcoming list + calendar
│   ├── Event detail (info, route map, who's going, RSVP)
│   ├── My ticket (QR check-in ticket; offline-capable, wallet pass)
│   └── Past events (results, photos, my splits)
├── Train (activity)
│   ├── My activity (synced runs, streaks, PRs)
│   ├── Challenges (browse, joined, challenge detail with progress + leaderboard)
│   ├── Leaderboards (club, chapter, friends)
│   └── Connect tracker (Strava/Garmin/COROS/Polar/Suunto/Apple Health/…)
├── Perks (Benefits Passport)
│   ├── Passport home (unlocked perks, tier progress)
│   ├── Perk detail (what/where/how, redemption QR or code)
│   └── Redemption history
└── Me (profile)
    ├── My profile (public card + stats)
    ├── Membership (plan, payment method, renewal, receipts)
    ├── Privacy & consent (the seven scopes, per-club, plain-language toggles)
    ├── Friends & invites (referral link, invite contacts)
    └── Settings (notifications per type, language, connected accounts, about)
```

Screen purposes worth calling out:

| Screen | Purpose |
|---|---|
| Home feed | Replace the 400-message WhatsApp thread with one calm, relevant stream. |
| Event detail | Everything needed to decide and commit in 10 seconds: when, where, route, who's going, RSVP. |
| My ticket | The QR that gets Leo checked in with zero fumbling — offline, brightness-boosted, in the wallet. |
| Challenge detail | Progress ring, leaderboard, days left — the reason to run today. |
| Passport home | Tangible membership value: "your membership paid for itself" made visible. |
| Privacy & consent | Granular scopes in plain language; the trust surface that makes the data moat ethical. |

---

## 4. Brand Portal — Sitemap

```
Brand Portal (RunOS-branded, per brand workspace)
├── Home (portfolio dashboard: active campaigns, spend, reach, redemptions)
├── Discover
│   ├── Audience explorer (anonymized, aggregated segments; k≥50 enforced)
│   └── Club discovery (browse clubs open to partnerships; fit score)
├── Campaigns
│   ├── Campaign list
│   ├── Campaign builder (objective → audience → offer/perk → budget → clubs → submit for club approval)
│   └── Campaign detail (live results: impressions, redemptions, event presence, UGC)
├── Reports (ROI reports per campaign & quarterly rollups; PDF/CSV export; share links)
├── Assets (creative library, offer codes, perk artwork)
└── Account (team seats, billing — from $499/mo, plan, notifications)
```

Design rule: the Brand Portal never shows an individual member. Smallest visible cohort = 50 (k-anonymity), unless a member explicitly opted into a campaign — then only their campaign-scoped interactions appear.

---

## 5. Vendor Portal — Sitemap

```
Vendor Portal (RunOS-branded)
├── Home (this week: bookings, earnings, response-needed)
├── Listing
│   ├── Profile & services (bio, credentials, service menu, pricing, photos)
│   └── Availability (calendar sync, bookable slots, service radius)
├── Bookings
│   ├── Requests (accept/decline, propose new time)
│   ├── Calendar (confirmed bookings; club events he's attached to)
│   └── Booking detail (client, service, location, notes, status)
├── Earnings (payouts via Stripe Connect, 10% marketplace commission shown transparently, statements)
├── Reviews (received reviews, response tool)
└── Account (verification/credentials, notifications, payout settings)
```

---

## 6. Marketing Site — Sitemap

```
runos.com
├── Home (hero: "The Operating System for Running Communities"; product tour)
├── Product
│   ├── For organizers (the 8 surfaces, each with a section)
│   ├── For members (white-label app showcase)
│   ├── Pacer AI (assistant showcase)
│   └── Integrations (connector wall)
├── Solutions
│   ├── Run clubs · Multi-chapter & franchises · Cities & federations
│   ├── Brands (→ Brand Portal signup)
│   └── Vendors (→ Vendor Portal signup)
├── Pricing (Starter Free / Club $79 / Pro $199 / Network custom; fee table; FAQ)
├── Customers (case studies, wall of clubs)
├── Resources (blog, playbooks, help center, API docs, changelog)
├── Company (about, careers, press, trust center: security/privacy/DPA)
└── CTAs: “Start free” (organizer signup) · “Book a demo” · “I got an invite” (member deep link)
```

---

## 7. Global Patterns

### 7.1 Command bar (⌘K) with Pacer

One input, three behaviors, zero mode-switching:

1. **Navigate** — type a screen or object name: `mem leo` → Leo Martins' profile. Fuzzy, ranked by recency and role.
2. **Act** — verbs are first-class: `create event`, `refund order #1042`, `pause automation welcome series`. Actions show their permission requirement; hidden if not permitted.
3. **Ask Pacer** — any input that isn't a match for navigate/act, or anything after `?` or natural language, routes to Pacer inline: `? who's likely to churn this month`. Answers render in the bar with a "open full answer in Pacer panel" affordance.

Rules: opens in <100 ms (results streamed); last 5 commands cached; `⌘K` everywhere including modals; on the Member app, pull-down search plays the same role (navigate + ask, no admin verbs).

### 7.2 Notification center

- Bell icon, top right (Organizer/Brand/Vendor); Home-tab inbox on Member app.
- Two tabs: **Needs action** (approvals, failed payments, flagged posts, campaign requests) and **FYI** (milestones, digests, mentions).
- Every notification is actionable inline where possible (Approve / Snooze / Assign) — no dead-end notifications.
- Per-type channel routing in settings (in-app / email / push / SMS); Pacer digest can absorb low-priority classes ("batch these into my Monday digest").

### 7.3 Global search

- `⌘K` covers 90% of cases; full search page (`/search`) for filtered, cross-object results.
- Results grouped by object type (Members, Events, Orders, Campaigns, Pages, Help articles), permission-trimmed at query time.
- Search indexes respect consent scopes: staff without `health.medical` grant never see medical fields even in search snippets.

### 7.4 Settings architecture

Three concentric rings, always accessed the same way (avatar menu → Settings):

1. **My account** (personal, follows the human across clubs): profile, security/2FA, notification preferences, language, connected identities.
2. **Club settings** (per club, permission-gated): everything under Platform (§2.8).
3. **Chapter settings** (subset of club settings delegated to chapter leads: local events defaults, local perks, local comms; parent controls the delegation matrix).

Rule: a setting lives in exactly one ring. If two roles need it, deep-link, don't duplicate.

### 7.5 Multi-chapter switcher

- Club/chapter switcher in the top-left corner (Notion-style workspace switcher): club logo + chapter name, `⌘⇧O` to open.
- Scope pill on every screen header showing current context: `Lagos Road Runners · All chapters` or `· Abuja chapter`.
- "All chapters" is a real scope: lists aggregate, dashboards roll up, creates default to prompting for a chapter.
- Priya (chapter lead) sees only her chapter plus explicitly shared org-level resources (brand kit, routes library, templates); the switcher shows only what she can enter.

---

## 8. UX Object Model

The nine objects users touch, and the canonical detail-view layout for each. **Every object detail view uses the same skeleton** so the product feels like one system:

```
┌──────────────────────────────────────────────────────────────┐
│ Header: identity (avatar/icon + name) · status badge ·       │
│         primary action · overflow (⋯) · Pacer "ask about ⌄"  │
├───────────────────────────────┬──────────────────────────────┤
│ Main column (tabs)            │ Context rail                 │
│ Tab 1: Overview (always)      │ · Key facts (created, owner) │
│ Tab 2..n: object-specific     │ · Related objects            │
│ + Activity/timeline tab (all) │ · Pacer insights card        │
└───────────────────────────────┴──────────────────────────────┘
```

| Object | Header identity / status | Primary action | Overview tab shows | Other tabs | Context rail highlights |
|---|---|---|---|---|---|
| **Member** | Avatar, name, membership badge (Active/Lapsed/Guest) | Message | Unified Runner Profile summary: attendance streak, last activity, LTV, community score, consent scopes granted | Activity, Events, Money (payments/orders), Engagement (challenges/perks/badges), Notes & consent | Churn risk (Pacer), segments they're in, friends in club |
| **Event** | Type icon, title, status (Draft/Published/Live/Past) | Publish → Check-in (state-dependent) | RSVP fill bar, page conversion, comms status, route card, weather | Registrations, Logistics (pacers/volunteers/equipment), Comms, Results & photos | Attendance forecast (Pacer), similar past events, sponsor attached |
| **Run/Activity** | Sport icon, title ("Morning Run"), source badge (Strava/Garmin/…) | Give kudos (member) / n/a (staff see summary only) | Distance, time, pace, elevation, splits (visibility per consent scope: `activity.summary` vs `activity.detailed`) | Splits & map (if `activity.detailed`), Linked event | Contributes-to: challenges, streaks, leaderboards |
| **Membership** | Member avatar + plan name, status (Active/Past-due/Canceled) | Record payment / Retry charge | Plan, price, renewal date, payment method, dunning state | Payments history, Plan changes, Communications | Perks unlocked by this plan, LTV, Pacer save-offer suggestion |
| **Campaign** | Brand logo + campaign name, status (Requested/Approved/Live/Done) | Approve (organizer) / Launch (brand) | Objective, audience definition (aggregate), offer/perk, dates, budget | Deliverables, Results (reach, redemptions, event presence), Assets | Consent note ("members see this only if opted into `marketing.brands`"), club approval trail |
| **Perk** | Partner logo + perk name, status (Active/Scheduled/Expired) | Edit / Feature in passport | Value, eligibility (tier/segment), redemption method, inventory, redemption count | Redemptions log, Placement (where it appears) | Linked campaign/sponsor, redemption trend sparkline |
| **Challenge** | Challenge art + name, status (Upcoming/Live/Ended) | Announce / View leaderboard | Goal, dates, joined count, completion %, prize | Leaderboard, Participants, Rules | Pacer: participation forecast, suggested boost actions |
| **Order** | Order # + buyer avatar, status (Paid/Fulfilled/Refunded) | Fulfill / Refund | Items, totals, fees breakdown (platform fee visible), fulfillment state | Payments, Shipping/pickup, Timeline | Buyer's member profile link, related event (if ticket) |
| **Automation** | Automation icon + name, status (Active/Paused/Error) | Pause/Resume | Plain-language sentence ("When a member misses 3 weekly runs, send…"), runs last 30d, success rate | Canvas (builder), Run history (per-member trace), Versions | Affected segment size, Pacer improvement suggestions |

Object-model rules:

- **Everything links.** Any object reference anywhere is a hover-card + click-through (member chips in a registration list open the Member detail as a slide-over, not a page navigation).
- **Slide-over first, full page on demand.** Detail views open as right-side sheets from lists (preserving list context); `↵` or "expand" promotes to full page with a URL.
- **Timeline is universal.** Every object has an Activity tab with the same event-log component; entries are permission-filtered.
- **Pacer is ambient on every object.** The context rail always includes one Pacer card scoped to that object ("Ask Pacer about this event").

---

## 9. Navigation Depth Rules

1. **Three levels, hard cap:** Surface → List/Workspace → Detail. Tabs inside a detail don't count as depth; they never navigate away.
2. **Any object in ≤2 interactions** from anywhere via ⌘K (open bar → pick result).
3. **Lists own state.** Filters, sort, column config, and scroll position persist per saved view; back always returns exactly where you left.
4. **No modal-in-modal.** One sheet layer max; anything deeper becomes a full page.
5. **URLs for everything.** Every screen, saved view, and detail (including slide-overs) has a shareable URL; permissions decide what the recipient sees.
6. **Breadcrumbs only at level 3** (detail pages); levels 1–2 rely on the nav rail highlight and scope pill.
7. **Mobile web organizer:** same IA, bottom nav with Today + 4 most-used surfaces (per-role default: Events, Community, Money, Intelligence) and a "More" grid.

---

## 10. Empty States Philosophy

Empty states are the onboarding. Every empty state must contain, in order:

1. **What this will become** — a miniature illustration of the populated state (real UI, ghosted, not clip-art).
2. **One primary action** — the single next step, never a menu of five.
3. **A Pacer assist** — where AI can seed it: "Ask Pacer to draft your first event" / "Import from Strava club".
4. **A time promise where honest** — "First event live in ~4 minutes."

Anti-patterns banned: blank tables with just "No data"; empty states that only link to docs; sad-face illustrations. Empty ≠ error: error states get diagnostics + retry; empty states get momentum.

Special case — **demo data mode**: new clubs can toggle "Show me with sample data" on any analytics/Intelligence screen (clearly watermarked "Sample"), so value is visible before data accrues. One click clears it.

---

## 11. Permissions-Aware UI Rules

Roles: Owner, Admin, Organizer, Coach, Finance, Content, Volunteer-coordinator, Read-only (+ custom on Pro+). Consent scopes: `profile.basic`, `activity.summary`, `activity.detailed`, `health.medical`, `location.live`, `marketing.brands`, `photos.appearances`.

1. **Hide navigation, disable actions.** Whole surfaces/screens a role can't use are hidden from nav (Finance doesn't see Growth). Within a screen a role can see, unavailable actions render disabled with a tooltip naming the required role — discoverability without dead ends.
2. **Consent trims fields, never rows.** A member always appears in the CRM (`profile.basic` is the membership baseline); columns/fields gated by ungranted scopes render as a locked chip: `🔒 Not shared — activity.detailed`. Clicking explains the scope and offers "Request access" (sends the member a consent prompt; never auto-grants).
3. **Medical is break-glass only.** `health.medical` data appears nowhere in lists or search. It is reachable only from Live Day → Emergency panel, requires a typed reason, and writes an immutable audit entry the member can see.
4. **Aggregates degrade gracefully.** Brand Portal and City Portal views suppress any segment under k=50 with an explicit "Cohort too small to display" cell — never approximate, never omit silently.
5. **Pacer inherits the asker's permissions.** Pacer answers are computed against the current user's role and the members' consent scopes; it will say "I can see 312 of 450 members' pace data (consent)" rather than silently narrowing.
6. **Chapter scoping is a filter, not a fork.** Priya's UI is the same organizer app with scope pinned to her chapter and org-level write actions removed; shared resources appear read-only with a "Managed by Lagos Road Runners HQ" badge.
7. **Audit affordance everywhere.** Any permission-sensitive view has a "Who can see this?" link in the overflow menu showing the effective access list — trust is a feature.

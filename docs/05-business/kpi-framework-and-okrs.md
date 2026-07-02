# RunOS — KPI Framework & OKRs

> Conforms to `docs/00-foundation/canonical-brief.md`. North star: **WACM — Weekly Active Community Members** — members who attended, logged, posted, redeemed, or transacted in the last 7 days, across all clubs. Financial model figures reconcile 1:1 with `docs/05-business/monetization-and-pricing.md`.

---

## 1. The Metric Tree

WACM sits on top because it is the one number every persona moves: Maya publishes events, Leo shows up, Sofia funds perks, Dr. Emre Kaya takes bookings — all of it lands in WACM. Everything below is an input; everything to the right of monetization is an output.

```
                                  WACM (North Star)
                 Weekly Active Community Members, trailing 7 days
                                        |
        +---------------+---------------+---------------+----------------+
        |               |               |               |                |
   ACQUISITION      ACTIVATION      ENGAGEMENT       RETENTION      MONETIZATION
        |               |               |               |                |
  - Club signups   - Club           - WACM/club     - Member W4      - MRR
  - Signup->       activation rate  - Events        retention        - GMV
    migration      (3 events pub.   published/club  - Club logo      - Take-rate rev
    starts         + 30% members    - Attendance    retention        - ARPU
  - Member         joined + Stripe  rate            - NRR            - Add-on attach
    invites sent   connected)       - Posts+        - Churn-risk     - Tier upgrade
  - Referral       - Member         reactions/WACM  clubs flagged    rate
    conversions    activation rate  - Tracker-      - Resurrection
  - CAC by         (joined +        connected %     rate
    channel        tracker OR       - Challenge
                   first check-in)  participation
                                        |
                                  NETWORK EFFECTS
                                        |
                     - Perk redemptions / week (benefits passport)
                     - Brand campaigns run / active brand seats
                     - Marketplace bookings & GMV
                     - Cross-club benchmark coverage (k>=50)
                                        |
                              GUARDRAILS (counter-metrics)
          notification fatigue | consent opt-outs | admin time-in-app (down)
          support tickets/club | refund rate | payment disputes | Pacer error rate
```

Reading rule: a KR may only ever target a node in this tree or a guardrail. If a proposed metric isn't on the tree, either add it here first (with owner + definition) or don't chase it.

---

## 2. Metric Definitions (formula, source, owner, cadence)

Sources: **CH** = ClickHouse analytics events (see §5 naming), **PG** = PostgreSQL tables (`clubs`, `members`, `memberships`, `events`, `registrations`, `checkins`, `activities`, `payments`, `subscriptions`, `perk_redemptions`, `bookings`, `campaigns`, `consents`, `notifications`, `tickets_support`).

### 2.1 North star

| Metric | Formula | Source | Owner | Cadence |
|---|---|---|---|---|
| **WACM** | COUNT(DISTINCT member_id) with ≥1 qualifying event in trailing 7 days; qualifying = `event_checkin_scanned` OR `activity_logged` OR `post_created`/`comment_created` OR `perk_redeemed` OR `payment_completed` | CH: the 5 qualifying events, deduped by member_id | Head of Product | Daily (trailing-7 computed nightly), reviewed weekly |
| WACM per club | WACM grouped by club_id; club-level median and mean reported | CH, joined to PG `clubs` | Head of Product | Weekly |

### 2.2 Acquisition

| Metric | Formula | Source | Owner | Cadence |
|---|---|---|---|---|
| Club signups | COUNT(`club_created`) per week, by channel (utm) and city | CH `club_created`; PG `clubs` | Head of Growth | Weekly |
| Signup → migration started | clubs with `migration_started` ÷ `club_created`, 14-day window | CH | Head of Growth | Weekly |
| Member invites sent | COUNT(`member_invited`) per club per week | CH | Head of Growth | Weekly |
| Invite → join rate | `member_joined` with invite_id ÷ `member_invited`, 30-day window | CH | Head of Growth | Weekly |
| Referral conversions | `referral_converted` (referred club reaches club-activated) ÷ `referral_sent` | CH | Head of Growth | Weekly |
| CAC by channel | Channel spend (incl. referral credits) ÷ new paying clubs attributed, monthly | Finance ledger + CH attribution | Head of Growth + Finance Lead | Monthly |

### 2.3 Activation (canonical definitions — never redefine)

| Metric | Formula | Source | Owner | Cadence |
|---|---|---|---|---|
| **Club activation rate** | Clubs where, within 30 days of `club_created`: COUNT(`event_published`) ≥ 3 AND joined_members ÷ imported_roster ≥ 30% AND `stripe_connected` fired ÷ all clubs created that cohort-month | CH events; PG `clubs.activated_at` set by nightly job | Head of Product (onboarding squad) | Weekly cohort view |
| **Member activation rate** | Members where `member_joined` AND (`tracker_connected` OR first `event_checkin_scanned`) within 14 days ÷ members joined that cohort-week | CH; PG `members.activated_at` | Head of Product | Weekly cohort view |
| Time-to-activation (club) | Median days `club_created` → `clubs.activated_at` | PG | Head of Product | Weekly |
| Stripe connect rate | `stripe_connected` ÷ `club_created`, 30-day window | CH | Head of Product | Weekly |

### 2.4 Engagement

| Metric | Formula | Source | Owner | Cadence |
|---|---|---|---|---|
| Events published per active club | COUNT(`event_published`) ÷ clubs with ≥1 publish, weekly | CH | Head of Product | Weekly |
| Attendance rate | COUNT(`event_checkin_scanned`) ÷ COUNT(`event_registration_completed`) per event, club-weighted | CH; PG `registrations`, `checkins` | Head of Product | Weekly |
| Posts + reactions per WACM | (`post_created` + `comment_created` + `reaction_added`) ÷ WACM, weekly | CH | Community Lead | Weekly |
| Tracker-connected % | Members with ≥1 active fitness connector ÷ joined members | PG `integrations_members` | Head of Product | Weekly |
| Challenge participation | Members with `challenge_joined` active ÷ joined members, per club | CH; PG | Community Lead | Weekly |
| Pacer weekly usage | Clubs with ≥1 `pacer_action_applied` ÷ paying clubs, weekly | CH | AI Lead | Weekly |

### 2.5 Retention

| Metric | Formula | Source | Owner | Cadence |
|---|---|---|---|---|
| Member W4 retention | Members active (WACM-qualifying) in week 4 after activation ÷ activated cohort | CH cohort query | Head of Product | Weekly cohorts, monthly review |
| Club logo retention (annualized) | 1 − (paying clubs cancelled ÷ paying clubs at period start), monthly → annualized | PG `subscriptions` | CRO | Monthly |
| **NRR** | Cohort subscription MRR month 12 ÷ month 0 (bridge: start + upgrades + add-ons − downgrades − churn); target 110% exiting Y1 | PG `subscriptions`, `payments`; finance model | CRO + Finance Lead | Monthly, cohort bridge quarterly |
| Churn-risk clubs flagged | Clubs <20% weekly-active members for 3 consecutive weeks | CH rollup | CRO (CS) | Weekly |
| Resurrection rate | Flagged clubs returning to ≥20% weekly-active within 8 weeks ÷ flagged | CH | CRO (CS) | Monthly |

### 2.6 Monetization

| Metric | Formula | Source | Owner | Cadence |
|---|---|---|---|---|
| **MRR** | Σ active subscription amounts (tiers + $29 AI add-on + Brand Portal seats), normalized monthly (annual ÷ 12) | PG `subscriptions` (Stripe webhook-fed) | Finance Lead | Daily, reviewed weekly |
| **GMV** | Σ `payment_completed`.amount through Stripe Connect (memberships, tickets, marketplace, merch), monthly | PG `payments`; CH | Finance Lead | Weekly |
| Take-rate revenue | Σ application fees: platform fee (2%/1%/0.5%) + ticket fees (2% + $0.30 Starter/Club) + marketplace 10% + merch take + processing margin | PG `payments.application_fee`; Stripe reports | Finance Lead | Weekly |
| Blended ARPU | (MRR + take-rate revenue) ÷ total clubs | Derived | Finance Lead | Monthly |
| Add-on attach rate | Clubs with active AI add-on ÷ (Starter + Club clubs) | PG `subscriptions` | Head of Growth | Weekly |
| Tier upgrade rate | `subscription_upgraded` ÷ paying clubs, monthly | CH; PG | CRO | Monthly |

### 2.7 Network effects

| Metric | Formula | Source | Owner | Cadence |
|---|---|---|---|---|
| Perk redemptions / week | COUNT(`perk_redeemed`), by club and perk partner | CH; PG `perk_redemptions` | Partnerships Lead | Weekly |
| Brand campaigns run | COUNT(`campaign_launched`) per quarter; active brand seats = seats with ≥1 campaign or report view in 30 days | CH; PG `campaigns` | Partnerships Lead | Monthly |
| Marketplace bookings & GMV | COUNT(`marketplace_booking_completed`), Σ amounts, take = 10% | PG `bookings`, `payments` | Partnerships Lead | Weekly |
| Benchmark coverage | % of clubs in a network-intelligence segment meeting k-anonymity ≥ 50 | CH aggregation job | Data Lead | Monthly |

---

## 3. Counter-Metrics / Guardrails

Growth that degrades trust is churn on a delay. Every experiment ships with the relevant guardrail attached; a guardrail breach overrides a winning primary metric.

| Guardrail | Definition & measurement | Threshold | Owner | Cadence |
|---|---|---|---|---|
| **Notification fatigue rate** | (`notification_opened` ÷ `notification_sent`) trending down >10% over 4 weeks, OR push/email opt-outs ÷ recipients >2%/mo, per club and per journey | Opt-outs <2%/mo; open-rate decay <10%/4wk | Head of Growth | Weekly |
| **Consent opt-out rate** | `consent_scope_revoked` ÷ active grants per scope per month (watch `marketing.brands` and `activity.detailed` hardest — they fund the brand side) | <1.5%/mo any scope; any spike >3% triggers campaign audit | Data Lead (privacy) | Weekly |
| **Club admin weekly time-in-app (must go DOWN)** | Median weekly active-session minutes for staff-role users per club, from CH session heartbeats (30s idle timeout), cohort-controlled by club size. We sell time back; if Maya's hours rise as her club grows, the product is failing its core promise | Down quarter-over-quarter for same-size cohort; target: 450-member club run in <4 hrs/wk by Q4 | Head of Product | Monthly |
| **Support tickets per club** | Tickets opened ÷ active clubs, monthly, split onboarding vs. ongoing | <0.8/club/mo ongoing; onboarding tickets down 20% QoQ | CS Lead | Weekly |
| **Refund rate** | `refund_issued` ÷ `payment_completed` (count and value), split subscriptions vs. tickets; includes 60-day-guarantee refunds tracked separately | <1.5% value overall; guarantee refunds <6% of founding cohort | Finance Lead | Monthly |
| **Payment dispute rate** | Stripe disputes ÷ charges | <0.3% | Finance Lead | Monthly |
| **Pacer quality** | Thumbs-down rate on `pacer_action_applied` outputs; hallucination reports | <5% negative; zero cross-club data leaks (hard fail) | AI Lead | Weekly |
| **Member spam perception** | Unsubscribe rate on club sends; club-level sending caps enforced by Growth OS | <0.5% per send | Head of Growth | Weekly |

---

## 4. Company OKRs — First 4 Quarters Post-Launch

Shared arc (canonical): **Q1 50 founding clubs / $6k MRR / 4,000 WACM → Q2 150 / $18k / 12,000 → Q3 300 / $36k / 25,000 → Q4 500 / $60k / 45,000.** MRR = tiers + AI add-on + brand seats. The tier-mix math below is the same model as the monetization doc; WACM-per-club assumptions are shown so every KR reconciles.

### Q1 — "Prove the wedge"

**Objective: Fifty founding clubs run better on RunOS than on anything they ran before.**

Model: 50 founding clubs = 35 Club @ $49 + 15 Pro @ $129 → $3,650 sub MRR; +25 AI add-ons ($725); +3 founding brand seats ($1,497 at ~$499 blend) = **$5,872 ≈ $6k MRR**. WACM: 35 Club-tier clubs × ~65 weekly-active + 15 Pro clubs × ~115 = 2,275 + 1,725 = **4,000** (members still migrating; ~55–60% of rosters live by quarter end).

- KR1: 50 founding clubs signed, migrated, and live across Amsterdam, London, Berlin, NYC, Austin (10/city); ≥80% reach club-activated (3 events published + 30% members joined + Stripe connected) within 30 days.
- KR2: $6k MRR exiting Q1 (35 founding Club, 15 founding Pro, ≥25 AI add-ons, 3 founding brand seats).
- KR3: 4,000 WACM (≥80 per founding club average); member activation ≥60% of joined members (tracker connected or first check-in within 14 days).
- KR4: Median club admin time-in-app ≤5 hrs/wk by week 12, down from ≥7 at migration (guardrail-as-KR: the promise is time back).
- KR5: 60-day-guarantee refunds ≤3 clubs (≤6% of cohort); support tickets ≤1.5/club/mo by quarter end.

### Q2 — "Prove it repeats without white gloves"

**Objective: Turn founding love into a self-serve engine that activates clubs we never talk to.**

Model: 150 clubs = 36 Starter + 71 Club (35 founding + 36 list) + 31 Pro (15 founding + 16 list) + 12 chapters (3 Network orgs). Subs: $4,559 + $5,119 + $3,600 = $13,278; +35 add-ons ($1,015); +7 brand seats ($3,493) = **$17,786 ≈ $18k MRR**. WACM: 36×11 + 71×80 + 31×165 + 12×70 = 396 + 5,680 + 5,115 + 840 = **12,031 ≈ 12,000**.

- KR1: 150 clubs on platform; ≥45% of new self-serve clubs reach club-activated within 30 days with zero human touch.
- KR2: $18k MRR (100+ paying clubs, first 3 Network orgs signed, 7 brand seats live).
- KR3: 12,000 WACM; member W4 retention ≥55% for activated members.
- KR4: ≥25% of new club signups arrive via referral (give 2 months / get 2 months) or member-to-organizer virality; blended self-serve CAC ≤$700 with LTV:CAC ≥5:1.
- KR5: First 3 brand campaigns shipped through the Brand Portal with `marketing.brands` opt-in ≥30% in participating clubs and consent opt-out staying <1.5%/mo.

### Q3 — "Prove the money layers"

**Objective: Make the platform earn beyond the subscription — every active club moves money through RunOS.**

Model: 300 clubs = 97 Starter + 120 Club (35F + 85) + 55 Pro (15F + 40) + 28 chapters (7 Network orgs). Subs: $8,430 + $9,895 + $9,100 = $27,425; +75 add-ons ($2,175); +13 brand seats ($6,487) = **$36,087 ≈ $36k MRR**. WACM: 97×11 + 120×85 + 55×205 + 28×88 = 1,067 + 10,200 + 11,275 + 2,464 = **25,006 ≈ 25,000**.

- KR1: 300 clubs; club activation rate holds ≥45% while volume doubles; time-to-activation median ≤14 days.
- KR2: $36k MRR; AI add-on attach ≥30% of eligible (Starter+Club) clubs; ≥10 Club→Pro upgrades in the quarter triggered by Sponsor CRM, predictions, or member cap.
- KR3: 25,000 WACM; ≥70% of paying clubs use Pacer weekly (≥1 applied action).
- KR4: Take-rate revenue ≥$8.5k/mo exiting Q3 (platform fees + ticket fees + processing margin) with GMV ≥$450k/mo through Stripe Connect; marketplace beta live in 5 cities with ≥150 bookings.
- KR5: Guardrails hold at 2× scale: support tickets <0.8/club/mo, notification opt-outs <2%/mo, admin time-in-app down QoQ for same-size cohorts.

### Q4 — "Prove the machine"

**Objective: Five hundred clubs, one repeatable growth machine, and a network that starts paying for itself.**

Model: 500 clubs = 155 Starter + 200 Club (35F + 165) + 85 Pro (15F + 70) + 60 chapters (15 Network orgs). Subs: $14,750 + $15,865 + $19,500 = $50,115; +125 add-ons ($3,625); +13 brand seats ($6,487) = **$60,227 ≈ $60k MRR**. WACM: 155×11 + 200×88 + 85×240 + 60×90 = 1,705 + 17,600 + 20,400 + 5,400 = **45,105 ≈ 45,000**.

- KR1: 500 clubs (≥300 paying entities incl. 15 Network orgs); club activation ≥50%; ≥35% of new clubs from referral/word-of-mouth.
- KR2: $60k MRR exiting Q4; add-on attach ≥35%; NRR ≥110% on the Q1–Q2 paying cohorts (worked bridge published: start $10k → +$2.8k expansion − $1.8k churn/downgrade = $11k).
- KR3: 45,000 WACM (≥90 per club average); member W4 retention ≥60%; ≥10,000 perk redemptions in the quarter.
- KR4: Transaction + brand revenue ≥$14k/mo exiting Q4 (≈19% of total run-rate — on track for the Y2 65/35 mix); GMV ≥$750k/mo.
- KR5: Year-2 machine loaded: enterprise pipeline ≥10 qualified Network/city opportunities (Amsterdam Active profile), brand waitlist ≥20 seats, and all five guardrails inside threshold for 8 consecutive weeks.

Consistency checks across the arc: paying-club count grows 50 → 101 → 182 → 300; implied WACM per club 80 → 80 → 83 → 90 (rises as Engage features and challenges land); MRR per paying entity stays ~$118–200, driven by mix not price increases. Q1 numbers assume no Starter clubs (founding program is paid-only); Starter opens with self-serve in Q2.

---

## 5. Instrumentation Plan

### 5.1 Event naming convention

`object_action`, snake_case, past tense, e.g. `club_created`, `event_published`. Rules:

- Object first, action second; no plural objects; no gerunds (`club_creating` never).
- Every event carries the standard envelope: `event_id (uuidv7)`, `occurred_at`, `club_id`, `member_id` (nullable), `actor_role`, `session_id`, `source` (web/mobile/api/system), `app_version`.
- Consent-gated payloads: events never carry data outside the member's granted scopes; health/location payloads only under `health.medical` / `location.live`.
- Written to Postgres outbox → event bus → ClickHouse `events` table; schema changes go through the analytics events registry (PR-reviewed).
- New events require: owner, description, properties, and the tree node they feed. No orphan events.

### 5.2 The 40 core analytics events

| # | Event | Key properties (beyond envelope) | Feeds |
|---|---|---|---|
| 1 | `club_created` | city, country, source_channel, utm, referrer_club_id | Acquisition |
| 2 | `migration_started` | source_system (sheets/whatsapp/eventbrite/other), roster_size | Acquisition |
| 3 | `migration_completed` | members_imported, events_imported, duration_days | Activation |
| 4 | `stripe_connected` | account_country, payout_currency | Activation (club) |
| 5 | `club_activated` | days_since_created, events_published, joined_pct | Activation (club) |
| 6 | `member_invited` | invite_channel (link/email/sms/qr), invite_id | Acquisition |
| 7 | `member_joined` | invite_id, join_source, consent_scopes_granted[] | Acquisition |
| 8 | `member_activated` | activation_path (tracker/checkin), days_since_join | Activation (member) |
| 9 | `tracker_connected` | provider (strava/garmin/coros/polar/suunto/apple/google/fitbit/trainingpeaks/zwift) | Activation, Engagement |
| 10 | `activity_logged` | provider, distance_m, duration_s, activity_type | WACM, Engagement |
| 11 | `event_created` | event_type, capacity, is_paid, price | Engagement |
| 12 | `event_published` | event_id, channels[] | Activation (club), Engagement |
| 13 | `event_registration_completed` | event_id, is_paid, price, waitlisted | Engagement, GMV |
| 14 | `event_checkin_scanned` | event_id, method (qr/manual), minutes_before_start | WACM, Attendance |
| 15 | `waitlist_joined` | event_id, position | Engagement |
| 16 | `post_created` | post_type (text/photo/route), has_media | WACM, Engagement |
| 17 | `comment_created` | parent_type | WACM, Engagement |
| 18 | `reaction_added` | target_type, reaction | Engagement |
| 19 | `message_sent` | thread_type (dm/group/announcement) | Engagement |
| 20 | `challenge_joined` | challenge_id, challenge_type | Engagement |
| 21 | `challenge_completed` | challenge_id, days_to_complete | Engagement, Retention |
| 22 | `perk_redeemed` | perk_id, partner_id, perk_value_usd | WACM, Network |
| 23 | `payment_completed` | amount, currency, payment_type (membership/ticket/booking/merch), application_fee, tier_fee_pct | WACM, GMV, Take-rate |
| 24 | `refund_issued` | payment_id, reason_code, is_guarantee_refund | Guardrail |
| 25 | `membership_started` | plan_id, amount, interval | GMV, Retention |
| 26 | `membership_cancelled` | plan_id, tenure_days, reason_code | Retention |
| 27 | `subscription_started` | tier, interval (mo/yr), is_founding, ppp_band, price | MRR |
| 28 | `subscription_upgraded` | from_tier, to_tier, trigger (cap/pacer/sponsor_crm/predictions/white_label/other) | MRR, Expansion |
| 29 | `subscription_downgraded` | from_tier, to_tier, reason_code | NRR |
| 30 | `subscription_cancelled` | tier, tenure_days, reason_code, wacm_last_4wk | Churn |
| 31 | `addon_activated` | addon (ai_premium), tier | MRR, Attach |
| 32 | `referral_sent` | referrer_club_id, channel | Acquisition |
| 33 | `referral_converted` | referred_club_id, days_to_activation | Acquisition |
| 34 | `pacer_prompt_submitted` | surface (cmd_k/chat/inline), intent_class | Pacer usage |
| 35 | `pacer_action_applied` | action_type (draft/plan/forecast/segment), edited_before_apply, feedback (up/down/none) | Pacer usage, Guardrail |
| 36 | `automation_triggered` | journey_id, trigger_type, actions_count | Growth OS |
| 37 | `notification_sent` / `notification_opened` (pair, one schema) | channel (push/email/sms), journey_id, opened_at (nullable) | Guardrail |
| 38 | `consent_scope_granted` / `consent_scope_revoked` (pair, one schema) | scope (profile.basic/activity.summary/activity.detailed/health.medical/location.live/marketing.brands/photos.appearances), granted (bool) | Guardrail, Network |
| 39 | `campaign_launched` | brand_id, campaign_type (perk/activation/sampling), clubs_targeted, opt_in_required | Network, Brand revenue |
| 40 | `marketplace_booking_completed` | vendor_id, service_type, amount, commission_amount | Network, GMV |

(37 and 38 are send/receive and grant/revoke pairs sharing one schema each; the registry counts them as the 40 core events.)

### 5.3 Dashboard inventory

| Dashboard | Audience | Key charts | Refresh |
|---|---|---|---|
| **North Star** | Whole company (office screen + weekly email) | WACM trend + WoW delta; WACM per club distribution; qualifying-action mix (attend/log/post/redeem/transact); city split | Nightly |
| **Growth Funnel** | Growth team, CEO | Signups by channel; signup→migration→activated funnel; time-to-activation; referral loop (sent→converted); CAC by channel vs. LTV:CAC | Nightly |
| **Activation & Onboarding** | Product (onboarding squad), CS | Club activation cohort curves; the three activation components separately (events published, 30% joined, Stripe connected); member activation by path; drop-off step analysis | Nightly |
| **Revenue** | Finance, CRO, exec | MRR waterfall (new/expansion/contraction/churn); MRR by line (tiers/add-on/brand seats); GMV and take-rate revenue by line; ARPU; NRR cohort bridge | Daily (Stripe-fed) |
| **Retention & Health** | CS, CRO | Member W4/W12 retention curves; club logo retention; churn-risk flag list (<20% weekly-active ×3wk); resurrection rate; admin time-in-app by cohort | Weekly |
| **Network Effects** | Partnerships, exec | Perk redemptions; active brand seats & campaigns; marketplace bookings/GMV; benchmark k-anonymity coverage | Weekly |
| **Guardrails** | Everyone (pinned to Growth Funnel & North Star) | Notification fatigue; consent opt-outs by scope; support tickets/club; refund & dispute rates; Pacer feedback | Weekly, alert-on-threshold in Slack |
| **Pacer Ops** | AI Lead | Prompts by intent; apply rate; edit-before-apply rate; thumbs-down rate; inference cost per club | Daily |

All dashboards live in the BI layer over ClickHouse + Postgres replicas; every chart links to its metric definition in §2 (single-definition rule — no chart may embed its own formula variant).

### 5.4 Experiment review cadence

- **Weekly growth meeting** (60 min, Tuesdays, owner: Head of Growth; attendees: product, data, CS, CRO): 10 min North Star + guardrails; 20 min experiment readouts (ship/kill/iterate decisions logged); 20 min next-week experiment queue against the tree; 10 min activation cohort review.
- **Decision rules:** every experiment pre-registers hypothesis, tree node, primary metric, guardrail(s), and minimum detectable effect before launch. Ship if primary metric wins at ≥95% confidence with no guardrail breach; kill if flat/negative at sample; iterate at most once per hypothesis. A guardrail breach overrides a winning primary metric — automatic stop.
- **Minimum sample guidance:** club-level experiments need ≥100 clubs per arm for conversion metrics (below that, run sequential/Bayesian with a decision at 80% probability-of-superiority and label the result "directional"); member-level experiments need ≥1,000 members per arm; time-boxed max 4 weeks — no peeking-based early ships before minimum sample except for guardrail stops. In Q1–Q2, most club-level ideas won't reach sample: run them as before/after cohort comparisons and say so honestly in the log.
- **Monthly metrics review** (exec): OKR tracking vs. the §4 arc, NRR bridge, mix-shift vs. plan.
- **Quarterly:** re-baseline WACM-per-club assumptions and guardrail thresholds; retire stale events from the registry.

One rule above all: we measure what members feel. If WACM grows while admin hours rise or consent opt-outs climb, we are borrowing growth from trust — and the tree says stop.

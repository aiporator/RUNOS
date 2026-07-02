# RunOS — Integration Strategy

> Canonical integration set (brief §6). Fitness: Strava, Garmin, COROS, Polar, Suunto,
> Apple Health, Google Health Connect, Fitbit, TrainingPeaks, Zwift. Business: Stripe,
> Shopify, Mailchimp, HubSpot, Meta, TikTok, Google Analytics, Slack, Discord, WhatsApp.
> Connector runtime architecture: `api-architecture.md` §5. This doc covers strategy,
> per-integration specs, normalization, and importers.

---

## 1. Prioritized Rollout

| Wave | Integrations | Rationale |
|---|---|---|
| **1 — MVP (launch)** | **Stripe**, **Strava**, **WhatsApp export import**, CSV import, Apple Health + Google Health Connect (SDK-based) | Stripe is the business (memberships/tickets — no revenue without it). Strava is where ~90% of club runners already log — the single highest-coverage ingestion source and the activation moment ("my club sees my runs"). WhatsApp export import is the **"bring your club" wedge**: every target club lives in a WhatsApp group today; importing it is day-one migration, requires no API partnership, zero external risk. Apple/Google SDK paths cost little (in-app), cover watchless phone-runners, and hedge Strava API risk. |
| **2 — engagement (launch +3 mo)** | Garmin, Slack, Discord, Mailchimp export, Eventbrite/Meetup import | Garmin = biggest native-device population and best-quality data (also reduces Strava API dependence). Slack/Discord meet clubs' existing comms. Eventbrite/Meetup import completes "bring your club." |
| **3 — monetization (launch +6 mo)** | Shopify, WhatsApp Business Cloud API (outbound), COROS, Polar, Fitbit | Merch (Money surface), owned messaging channel, next device cohorts. |
| **4 — growth & partners (launch +9–12 mo)** | HubSpot, Meta, TikTok, Google Analytics, Suunto, TrainingPeaks, Zwift | Brand-side value (audiences, attribution) once member consent base exists; long-tail devices. |

Sequencing principles: (1) ingestion breadth before business-tool depth — the unified
activity layer is the moat; (2) file-import paths before partnership-gated APIs (Garmin/
COROS/Suunto/TrainingPeaks approvals take months — applications filed in wave 1, shipped
when approved); (3) nothing brand-facing before the consent system is proven in
production.

---

## 2. Per-Integration Specs — Wave 1

### 2.1 Stripe (Connect)

- **Business value:** all money movement — memberships, paid registrations, ticket fees,
  marketplace commissions, RunOS application fees. Club = merchant of record.
- **Auth:** Stripe Connect **Standard** onboarding per club (`stripe_account_id` on
  `organizations`); platform secret key per cell; webhooks signed per endpoint secret.
- **Data in:** `payment_intent.*`, `charge.*`, `invoice.*`, `customer.subscription.*`,
  `payout.*`, `account.updated`, disputes. **Data out:** PaymentIntents (destination
  charge + `application_fee_amount`), Subscriptions (plans), Refunds, Products/Prices.
- **Sync:** webhooks (primary, signed, deduped by event id) + nightly reconciliation
  poll (`/v1/payment_intents?created…`) to catch missed events.
- **Constraints/quotas:** generous (100 req/s live) — not a risk. Real constraints:
  KYC/onboarding friction for clubs (mitigate: embedded onboarding, status tracking on
  `account.updated`), SCA flows, per-country capability differences.
- **Failure modes:** webhook signature mismatch (alert — likely secret rotation drift);
  account restricted → payments paused UI state + club task; dispute → Finance
  notification with evidence pack (registration + check-in trail).
- **MVP:** memberships + paid registrations + refunds + payouts view. **Later:** tax
  (Stripe Tax), Terminal for on-site sales, usage-based invoicing for Network tier.

### 2.2 Strava

- **Business value:** highest-coverage activity source; activation moment for members;
  fuels challenges, leaderboards, community score, PRs.
- **Auth:** OAuth2 per member (`read`, `activity:read` scopes; `activity:read_all` only
  when the member enables private-activity sharing). Tokens vaulted, refresh-rotated.
- **Data in:** activities (summary + detail incl. splits, HR with consent), athlete
  profile basics, deauthorization events. **Data out:** none (we do not write to Strava).
- **Sync:** Strava Webhook Events API (one subscription per app): `activity create/
  update/delete`, `athlete deauthorize`. Fast-ack < 2 s, enqueue, pull full activity via
  API. Poll fallback (6 h) for missed webhooks.
- **API constraints — honest assessment (the riskiest dependency in the portfolio):**
  - Default app quota **200 requests/15 min, 2,000/day** — supports only ~1,500–2,000
    active connected members/app without an increase. Mitigations: request rate
    increase early; strict budget tracker (backfills deferred at 80%); *one* detail
    fetch per activity; never poll when webhooks work.
  - **Strava API Agreement restrictions (compliance section):**
    - Data may be shown **to the authenticating athlete and, per current terms, in
      limited club/leaderboard contexts** — treat member-to-member visibility of
      Strava-sourced data conservatively: Strava-sourced fields shown to organizers/
      other members are limited to what our consent scopes *and* Strava's terms both
      allow; where terms are stricter (e.g., no public display, no leaderboards from
      private data), the connector marks fields `display_restricted` and serializers
      honor it.
    - **No AI/ML training on Strava data** (2024 terms) — Strava-sourced activities are
      excluded from model training sets; Pacer may reference them at inference for the
      club's own operations only. Enforced by a `training_prohibited` flag on
      `activity_sources.provider='strava'` rows honored by the ML pipeline.
    - No resale/sublicensing of Strava data; brand-facing surfaces must never include
      Strava-derived raw data (aggregates computed over *all* sources are kept
      provider-agnostic and k-anonymous, which we assess as compliant; reviewed with
      counsel before Brand Portal GA).
    - Deauthorization webhook → purge Strava-sourced raw payloads within 48 h (retain
      RunOS-native derived aggregates only where our own consent covers them).
    - Branding: "Compatible with Strava" logo rules; link-backs on activity views.
  - **Strategic hedge:** Garmin/COROS/Apple/Google direct paths reduce Strava
    exclusivity; import architecture never assumes Strava permanence.
- **Failure modes:** quota exhaustion (budgeter + backfill deferral); webhook
  subscription dropped (watchdog re-subscribes); token revoked (re-auth prompt);
  athlete deletes activity (delete webhook → soft-delete + re-aggregate).
- **MVP:** connect, webhook ingest, summary normalize, dedup, PR detection, 30 d
  backfill. **Later:** longer backfill on approval, `activity:read_all` opt-in flow.

### 2.3 WhatsApp (export import first; Business API in wave 3)

- **Business value:** every target club runs on WhatsApp groups. Import = instant
  migration ("bring your club" in 10 minutes); outbound API later = owned messaging.
- **Wave 1 — group export parser (no API, no partnership risk):** see §9.2.
- **Wave 3 — WhatsApp Business Cloud API:** auth via Meta Business verification +
  system-user token; template messages (pre-approved) for event reminders, waitlist
  promotions, renewal nudges — **opt-in members only**, per-channel suppression.
  Constraints: conversation-based pricing (cost model per club, passed through or
  tier-capped), 24 h customer-service window rules, template review latency (days),
  quality-rating throttling (monitor + auto-slow on rating drop). Failure modes:
  template rejection (fallback to SMS/email step in journeys), number quality
  degradation (per-club sender isolation on Network tier).
- **MVP:** import parser + invite flow. **Later:** two-way inbox in Community messaging.

### 2.4 Apple Health / Google Health Connect (SDK push)

- **Business value:** covers phone-only runners (no watch, no Strava) — large share of
  casual club members; zero external API risk.
- **Auth:** on-device permission prompts (HealthKit read: workouts, distance, HR with
  `activity.detailed`; Health Connect equivalents). No server-side tokens.
- **Sync:** `sdk_push` — RN app background delivery observers upload new workouts to
  `/ingest/sdk` with device-generated ids; server normalizes like any provider.
- **Constraints:** iOS background execution windows (uploads may lag hours — set
  expectations in UI); Health Connect ~30 d history window (backfill limited); Google
  Play & App Store health-data policy reviews (privacy declarations, no ads use —
  aligned with our consent model anyway).
- **Failure modes:** permission partially granted (per-field nulls, summary-tier
  fallback); duplicate vs. watch/Strava (fingerprint dedup — this pair is the #1 dup
  source).
- **MVP:** workouts summary tier. **Later:** detailed tier (HR/splits), sleep/readiness
  (only if a coaching feature demands it — data minimization first).

---

## 3. Per-Integration Specs — Waves 2–4 (condensed one-pagers)

| Integration | Value | Auth | Data in / out | Sync | Constraints & risks (honest) | Failure modes | MVP → Later |
|---|---|---|---|---|---|---|---|
| **Garmin** | Best-quality native data; big device base; Strava hedge | OAuth via Garmin Connect Developer Program (**approval required — apply wave 1**) | In: activity summaries+details push, backfill. Out: none | Push (their POST to us) + backfill API | Program approval latency (weeks–months); evaluation env quotas small; production fine | Push endpoint down → Garmin retries 24 h, then backfill catch-up job | Summary+detail ingest → training-status metrics |
| **Slack** | Organizer notifications where staff already live | OAuth bot token per workspace | Out: notifications (new member, registrations, payment fails). In: slash commands (`/runos today`) | Push (chat.postMessage), events API for commands | Rate: 1 msg/s/channel — batch digests | Token revoked → disable + re-auth task | Notifications → command reads |
| **Discord** | Same for community-native clubs; member-facing announcements | Bot OAuth per server | Out: announcements, event embeds w/ RSVP link. In: none (v1) | Push | Rate limits per route; embeds only, no member data in public channels | 429 storms → global bot queue | Announcements → role sync for members |
| **Mailchimp** | Clubs with existing lists keep their ESP while migrating | OAuth2 | Out: consented contacts + segments/tags. In: campaign stats, unsubscribes | Push on segment change (debounced) + hourly stats poll | Batch endpoints; unsubscribe sync is compliance-critical (must flow back to suppression within 1 h) | Merge-field mapping drift → mapping UI + validation | One-way export + suppression sync → two-way tags |
| **Eventbrite / Meetup (import)** | Migrate existing event history + attendees | OAuth2 (Eventbrite); Meetup API is partnership-gated — fall back to CSV/ICS import | In: events, attendees, orders (Eventbrite) | One-shot import + optional ongoing poll during transition | Meetup API access is unreliable post-2020s changes — **CSV path is the committed one**; Eventbrite API solid | Partial imports → resumable import jobs w/ report | One-shot import → parallel-run sync |
| **Shopify** | Real merch ops (clubs outgrow native light commerce) | OAuth public app per shop | In: orders, products, customers (matched by email w/ consent). Out: club collection/products metadata | Webhooks + nightly reconciliation | Webhook delivery not guaranteed → reconciliation mandatory; API version pinning (quarterly deprecations); protected customer data approval needed for PII | Order webhook missed → nightly diff; customer match ambiguity → manual review queue | Order→profile linkage (LTV) → native storefront blocks embedding Shopify checkout |
| **COROS / Polar / Suunto** | Device coverage (serious/trail runners); Strava hedge | OAuth2, partner programs (approval needed) | In: workouts | COROS: push+poll; Polar: notify-then-pull transactions; Suunto: push | Small quotas, approval latency; Polar has **no deep backfill** (only post-consent data) — set UI expectation | Poll cursor corruption → cursor reset + dedup absorbs re-reads | Summary tier → detail tier |
| **Fitbit** | Casual-runner coverage | OAuth2 | In: activity logs | Subscriptions webhook + pull | 150 req/h/user (ample); Google account migration churn | Subscription lapse → daily verify job | Summary only |
| **TrainingPeaks** | Coach-centric clubs; structured training | OAuth2 (partner-gated) | In: completed workouts. Out (later): planned workouts | Hourly poll | Partnership approval; B2B pricing | — | Read-only ingest → plan push |
| **Zwift** | Indoor/winter engagement | OAuth2 (developer program **waitlist — treat as best-effort**) | In: virtual rides/runs | Poll | Access uncertainty is the risk; primary path = members' Zwift→Strava/Garmin auto-sync, which we already ingest | n/a | Via-Strava labeling (`virtual_run`) → direct API if granted |
| **HubSpot** | Network-tier orgs with sales/CRM ops | OAuth2 | Two-way: members ↔ contacts, deals for sponsorships | Webhooks + poll | API call budgets per portal; conflict resolution (RunOS wins member-controlled fields) | Sync loops → change-source tagging | One-way out → two-way |
| **Meta / TikTok** | Brand campaigns + club growth ads: custom audiences, conversions | OAuth (Marketing API); TikTok equivalent | Out: **hashed** emails of `marketing.brands`-consented members; conversion events. In: campaign metrics | Batch push (audience replace) + daily metrics pull | Consent gate absolute (minors excluded structurally); audience min sizes (~100–1,000) align with our k≥50+ floors; app review for marketing scopes | Audience rejected → size/quality report to club | Metrics pull first; audiences only after consent volume exists |
| **Google Analytics** | White-label site + funnel attribution | Measurement protocol + OAuth for reads | Out: server-side events (no PII). In: acquisition reports | Streaming out; daily pull | GA4 quotas fine; consent-mode for EU visitors | — | Pageview/conversion events → full funnel reports |

---

## 4. Activity Normalization Spec

### 4.1 Unified activity schema

Canonical target = `activities` + `activity_laps` + `activity_sources`
(`database-schema.md` §3). Normalization contract:

```ts
interface UnifiedActivity {
  member_id: string;
  sport: "run" | "trail_run" | "virtual_run" | "walk" | "ride" | "swim" | "other";
  started_at: string;            // RFC3339 UTC (provider-local converted; tz kept)
  timezone?: string;             // IANA
  summary: {                     // requires activity.summary
    distance_m: number;          // meters, integer
    moving_time_s: number;
    elapsed_time_s?: number;
    elevation_gain_m?: number;
    avg_pace_s_per_km?: number;  // derived if absent: moving_time_s / (distance_m/1000)
    is_race: boolean;            // provider race flag OR workout_type mapping
    name?: string;
  };
  detail?: {                     // stored only with activity.detailed
    avg_hr?: number; max_hr?: number; avg_cadence?: number; calories?: number;
    polyline?: string;           // Google encoded
    start_latlng?: [number, number];   // rounded 3dp at rest
    laps?: Lap[];                // provider laps, else auto 1km/1mi splits
  };
  source: { provider: Provider; provider_activity_id: string; raw: unknown };
}
```

**Unit handling:** SI internally, always (meters, seconds, meters elevation). Providers
convert at the adapter edge (Strava m/s pace → s/km; imperial provider fields → SI).
Display units are a *presentation* concern (member/club locale preference); never stored.
Pace stored as s/km integers; formatting (`5:09/km`, `8:18/mi`) client-side.

**Sport mapping:** each adapter ships an explicit provider-type → sport table
(e.g. Strava `Run`→`run`, `TrailRun`→`trail_run`, `VirtualRun`→`virtual_run`); unmapped
types → `other` + telemetry counter (drives mapping backlog).

### 4.2 Dedup rules (same run from watch + Strava)

Fingerprint computed at ingest:

```
fingerprint = sha1(member_id
             + floor(epoch(start_utc) / 300)          # 5-minute start bucket
             + round(distance_m / 200)                 # 200 m distance bucket
             + sport_group)                            # run-family collapses run/trail/virtual
```

Match algorithm on ingest of activity B when fingerprint (or ±1 adjacent start bucket)
matches existing A for the same member:

1. Confirm: `|start_A − start_B| ≤ 10 min` AND `|dist_A − dist_B| ≤ max(300 m, 3%)`.
2. If confirmed → **merge**: keep one canonical `activities` row; attach B as an
   `activity_sources` row. Canonical source priority (richness):
   `garmin = coros = polar = suunto > strava > apple_health = google_health_connect >
   fitbit > trainingpeaks > zwift > manual`. If B outranks A's canonical source, promote
   B's data (recompute summary/detail from B, keep A's id — external references stay
   stable).
3. If not confirmed → distinct activity (two short runs same morning are legitimate).
4. Late arrivals (backfills) run the same path — dedup is order-independent.
5. Manual entries always lose to device sources; member can force-split a wrong merge
   (audit-logged, fingerprint pair added to a never-merge list).

### 4.3 PR detection

- On canonical create/update: for each distance key
  (`1k, 1mi, 5k, 10k, half_marathon, marathon`) where `distance_m ≥ key × 0.995`,
  candidate time = best-effort:
  - with detail laps/streams: best rolling window (Strava `best_efforts` used directly
    when present);
  - summary-only: qualifies only if total distance within [key, key × 1.02] (treat the
    whole run as the effort; conservative — avoids fake PRs from long runs).
- Compare vs. current `personal_records` (superseded_by IS NULL); if faster → insert new
  PR row, link superseded, emit `pr.achieved` (Growth automations: "congratulate on
  club feed" — only if `activity.summary` granted; feed post requires member's
  visibility setting).
- `longest_run` PR on distance. Race-flagged activities also feed race history on the
  runner profile.
- Recompute path: activity delete/merge triggers PR re-evaluation for affected keys.

---

## 5. "Bring Your Club" Importers

All importers share: dry-run preview → column/entity mapping → validation report →
commit as resumable BullMQ job → import report (created/merged/skipped + reasons) →
undo window (24 h, soft-delete batch tag). Imported people arrive as `members` with
`status='invited'`, `user_id NULL`, **minimal consent (`profile.basic` only implied for
club-held data under the club's existing controller relationship)** — full scopes are
requested from the member at account claim.

### 5.1 CSV importer

- Accepts any CSV/XLSX; header auto-mapping (fuzzy match: "e-mail", "Email Address" →
  `email`) with manual override UI; per-row validation (email format, phone E.164
  normalization, dup detection against existing members by email/phone).
- Dedup on commit: exact email match → merge-update (fill blanks only); no email → phone;
  neither → create with `needs_review` tag.
- Template CSVs published for common sources (Google Sheets member lists, Heylo,
  ClubExpress).

### 5.2 WhatsApp group export parser

- Input: the standard WhatsApp "Export chat (without media)" `.txt` (member uploads —
  no WhatsApp API involved; the organizer already possesses this data as group admin).
- Parser handles iOS/Android format variants + locales (timestamp formats, LTR/RTL,
  "Messages and calls are end-to-end encrypted" banners, system messages).
- Extracted per participant: display name/phone (as visible), first/last seen, message
  count, activity-by-week (engagement prior!). **Message bodies are used transiently for
  counting only and are discarded — never stored** (privacy by design; the club needs a
  roster, not a chat archive).
- Output: candidate member list ranked by engagement, phone-based dedup vs. existing
  members → creates `invited` members (`source='whatsapp_import'`) → organizer triggers
  the invite campaign (WhatsApp share-link message the organizer posts back to the
  group + SMS/email where available).
- Edge cases: contacts saved by nickname (name cleanup UI), phone-less entries (skip w/
  report), group > 1,024 members (multiple exports merged).

### 5.3 Strava club — scrape-free import (member invite flow)

- **We do not scrape Strava club pages** (API terms + robots). Instead:
  1. Organizer connects their own Strava account; we read the club id they administer
     and public member *count* only (sizing).
  2. RunOS generates a club join link + QR + a ready-to-post Strava club discussion
     post / Instagram asset ("Lagos Road Runners now runs on RunOS — join here").
  3. Each member joins via the link and OAuths their *own* Strava — proper per-athlete
     consent, fully within API terms.
  4. Activation tracker shows invite-funnel conversion (posted → visited → joined →
     connected) and nudge templates at each drop-off.
- Honest trade-off: slower than scraping, but the only sustainable, terms-compliant
  path — and it front-loads the consent relationship we need anyway.

### 5.4 Eventbrite / Meetup event import

- **Eventbrite (API):** OAuth → list organizer's events → import events (title,
  description, venue, schedule, ticket tiers → `events` + `membership`-free tickets),
  attendees → members (email dedup), orders → historical `orders` (unlinked from Stripe,
  marked `source='eventbrite_import'`... financial rows read-only). Optional
  transition mode: keep polling upcoming Eventbrite events for 90 days while the club
  migrates registration to RunOS.
- **Meetup:** API access is partnership-gated and unstable — committed path is the
  organizer's CSV attendee export + ICS calendar import (same pipeline as CSV importer,
  plus `events` creation from ICS). If API access lands, upgrade to one-shot API import.
- Both: imported past events populate attendance history on runner profiles
  (`events_attended`), which seeds community score and churn features from day one —
  the import is not just a roster copy, it bootstraps Intelligence.

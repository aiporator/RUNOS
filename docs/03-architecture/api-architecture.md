# RunOS — API Architecture

> Per canonical brief §8: **REST + webhooks public API (OpenAPI), tRPC internal;
> GraphQL deferred.** API access is a Network-tier entitlement (PATs available on Pro for
> read-mostly scopes); Brand Portal and Vendor tokens are scoped separately.

---

## 1. API Strategy

| Surface | Protocol | Consumers | Contract |
|---|---|---|---|
| Internal app API | **tRPC** over HTTPS | Organizer web, member RN app, white-label sites, portals | TypeScript end-to-end types; not versioned (deployed atomically with clients); zod-validated |
| Public API | **REST v1** (`https://api.runos.com/v1`, EU: `https://api.eu.runos.com/v1`) | Network-tier clubs, partners, integrators | OpenAPI 3.1 spec published at `/v1/openapi.json`; SDKs generated (TS, Python) |
| Outbound webhooks | HTTPS POST, HMAC-signed | Customer endpoints | Event catalog §7 |
| Inbound webhooks | Provider-specific receivers under `https://hooks.runos.com/{provider}` | Strava, Stripe, Garmin, Shopify, … | See `integrations.md` |

Region routing: a club's API host is its residency cell; `api.runos.com` 301-redirects
requests for EU-homed clubs to `api.eu.runos.com` (clients should use the host returned
at key creation).

### 1.1 Versioning

- URL major version (`/v1`). Breaking changes → `/v2`, run in parallel ≥ 12 months.
- Additive changes (new fields, new endpoints, new enum values on documented
  "open" enums) are **not** breaking. Clients must ignore unknown fields.
- Deprecations announced via `Deprecation` + `Sunset` response headers and the changelog.

### 1.2 Conventions

- IDs: prefixed ULIDs (`mem_…`, `evt_…`). Timestamps: RFC 3339 UTC. Money: integer minor
  units + `currency`.
- **Pagination:** cursor-based everywhere.
  `GET /v1/members?limit=50&cursor=eyJr...` →
  ```json
  { "data": [...], "has_more": true, "next_cursor": "eyJrIjoibWVtXzAxSjkifQ" }
  ```
  `limit` 1–100 (default 25). Cursors are opaque, signed, expire after 24 h.
- **Idempotency:** all `POST` endpoints accept `Idempotency-Key: <uuid/ulid>` (required
  for payments/registrations/check-ins). First response is stored 24 h and replayed for
  retries with the same key + body hash; a reused key with a different body returns
  `409 idempotency_key_reuse`.
- **Error envelope** (Stripe-style, every non-2xx):
  ```json
  {
    "error": {
      "type": "invalid_request_error",
      "code": "capacity_exceeded",
      "message": "Event evt_01J8… is full (capacity 120).",
      "param": "event_id",
      "doc_url": "https://docs.runos.com/errors#capacity_exceeded",
      "request_id": "req_01J8ZKQ9…"
    }
  }
  ```
  `type ∈ {invalid_request_error, authentication_error, permission_error, consent_error,
  rate_limit_error, conflict_error, api_error}`. `consent_error` is deliberate and
  distinct: the caller lacks a member consent grant, not a role permission.
- `request_id` on every response header (`X-Request-Id`) and error body; traceable in
  support.

### 1.3 Rate limits (per club, token buckets in Redis; per-key sub-limits)

| Tier | Sustained | Burst | Webhook endpoints | Notes |
|---|---|---|---|---|
| Starter / Club (PAT read-only, if enabled) | 60 req/min | 120 | 1 | — |
| Pro (PATs) | 300 req/min | 600 | 3 | — |
| Network | 1,000 req/min | 2,000 | 10 | Custom on request |
| Brand Portal tokens | 120 req/min | 240 | 2 | Aggregate endpoints only |
| Vendor tokens | 120 req/min | 240 | 1 | Booking endpoints only |

Headers on every response: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`.
`429` includes `Retry-After`. Write endpoints for check-in bursts (`/check-ins/batch`)
have a separate, higher bucket (event-day traffic must not throttle).

---

## 2. Resource Map (public REST v1)

```
/v1/members                      /v1/memberships          /v1/webhook-endpoints
/v1/members/{id}                 /v1/membership-plans     /v1/api-keys (mgmt UI only)
/v1/members/{id}/activities      /v1/payments             /v1/perks
/v1/members/{id}/consents        /v1/payouts              /v1/perks/{id}/redemptions
/v1/segments                     /v1/orders               /v1/challenges
/v1/events                       /v1/invoices             /v1/campaigns          (marketing)
/v1/events/{id}/registrations    /v1/products             /v1/brand-campaigns    (brand tokens)
/v1/events/{id}/check-ins        /v1/registrations/{id}   /v1/bookings           (vendor tokens)
/v1/events/{id}/check-ins/batch  /v1/activities           /v1/reports/aggregates (brand/city)
```

All collection endpoints support `?filter[...]`, cursor pagination, and
`?expand=` for one-level expansions (e.g. `?expand=member`).

### 2.1 Members

```
GET  /v1/members?filter[status]=active&filter[chapter_id]=chp_…&filter[tag]=pacer
POST /v1/members
GET  /v1/members/{id}
PATCH /v1/members/{id}
DELETE /v1/members/{id}            → soft delete (status change), 204
```

`POST /v1/members` (scope `members:write`):

```json
// request
{
  "display_name": "Leo Martins",
  "email": "leo@example.com",
  "chapter_id": "chp_01J8ZH3T5E9WQ2NKM4R7V6XBGD",
  "tags": ["morning-crew"],
  "send_invite": true
}
// 201 response
{
  "id": "mem_01J8ZK2W7C9XQ4NPM6T3R8VBHE",
  "object": "member",
  "status": "invited",
  "display_name": "Leo Martins",
  "email": "leo@example.com",
  "chapter_id": "chp_01J8ZH3T5E9WQ2NKM4R7V6XBGD",
  "tags": ["morning-crew"],
  "consents": { "profile.basic": "granted" },
  "joined_at": "2026-07-02T09:14:03Z",
  "profile": null
}
```

`GET /v1/members/{id}` returns `profile` (runner-profile aggregates) **only** the fields
unlocked by the member's consent grants; ungranted sections are `null` with
`"consent_required": ["activity.summary"]` listed. Emergency/medical fields never appear
in the public API.

### 2.2 Events & Registrations

```
GET/POST /v1/events        GET/PATCH/DELETE /v1/events/{id}     POST /v1/events/{id}/publish
GET/POST /v1/events/{id}/registrations      POST /v1/registrations/{id}/cancel
```

`POST /v1/events/{id}/registrations` (scope `registrations:write`, `Idempotency-Key`
required):

```json
// request
{ "member_id": "mem_01J8ZK…", "ticket_type": "general",
  "answers": { "pace_group": "5:30" } }
// 201 (paid event)
{
  "id": "reg_01J8ZKT4…", "object": "registration",
  "event_id": "evt_01J8ZKQ0…", "member_id": "mem_01J8ZK…",
  "status": "pending_payment", "ticket_type": "general",
  "payment": {
    "id": "pay_01J8ZKT5…", "amount": 2500, "currency": "eur",
    "application_fee": 55, "client_secret": "pi_3N…_secret_…"
  },
  "registered_at": "2026-07-02T09:20:11Z"
}
// 409 when full
{ "error": { "type": "conflict_error", "code": "capacity_exceeded",
  "message": "Event is full. Member added to waitlist at position 4.",
  "param": "event_id", "request_id": "req_…" } }
```

### 2.3 Check-ins (batch, offline replay-safe)

```
POST /v1/events/{id}/check-ins            (single)
POST /v1/events/{id}/check-ins/batch      (offline sync; up to 500 items)
GET  /v1/events/{id}/check-ins
```

```json
// batch request (Idempotency-Key: device+batch hash)
{ "check_ins": [
  { "client_checkin_id": "01J8ZKY7QT…", "member_id": "mem_01J8…",
    "scanned_at": "2026-07-02T06:58:41Z", "method": "qr" }
]}
// 200
{ "accepted": 118, "duplicates": 2, "rejected": [
  { "client_checkin_id": "01J8ZKY9…", "code": "member_not_registered" } ] }
```

### 2.4 Activities (read-only, consent-filtered)

```
GET /v1/activities?filter[since]=2026-06-01T00:00:00Z&filter[member_id]=mem_…
GET /v1/members/{id}/activities
```

Response shape depends on the member's grants — **the API never widens what the club
itself can see**:

```json
{
  "id": "act_01J8ZM0Q…", "object": "activity",
  "member_id": "mem_01J8ZK…", "sport": "run",
  "started_at": "2026-07-01T05:31:00Z",
  "summary": { "distance_m": 12030, "moving_time_s": 3721,
               "elevation_gain_m": 86, "avg_pace_s_per_km": 309, "is_race": false },
  "detailed": null,
  "consent_level": "summary",
  "source": { "provider": "strava" }
}
```

With `activity.detailed` granted, `detailed` carries HR/cadence/laps/polyline. Without
`activity.summary`, the activity is not returned at all. No write endpoint: activities
enter via connectors only (plus internal manual entry).

### 2.5 Memberships & Payments

```
GET/POST /v1/membership-plans      GET /v1/memberships?filter[status]=past_due
POST /v1/memberships               POST /v1/memberships/{id}/cancel
GET /v1/payments                   GET /v1/payments/{id}    POST /v1/payments/{id}/refund
GET /v1/payouts
```

```json
// GET /v1/payments/{id}
{
  "id": "pay_01J8ZKT5…", "object": "payment",
  "purpose": "registration", "reference_id": "reg_01J8ZKT4…",
  "member_id": "mem_01J8ZK…",
  "amount": 2500, "application_fee": 55, "currency": "eur",
  "status": "succeeded",
  "stripe": { "payment_intent_id": "pi_3N…" },
  "created_at": "2026-07-02T09:20:12Z"
}
```

Refunds (`payments:refund` scope, Finance/Admin/Owner only) are asynchronous: `202` with
`status: "pending"`, completion via `payment.refunded` webhook.

### 2.6 Perks & Campaigns

```
GET/POST /v1/perks                 POST /v1/perks/{id}/redemptions
GET /v1/perks/{id}/redemptions     GET/POST /v1/campaigns    POST /v1/campaigns/{id}/send
```

```json
// POST /v1/perks/prk_…/redemptions
{ "member_id": "mem_01J8ZK…" }
// 201
{ "id": "prx_01J8ZN1V…", "object": "perk_redemption", "perk_id": "prk_01J8ZN0K…",
  "member_id": "mem_01J8ZK…", "status": "redeemed",
  "code_issued": "RUNOS-4F7Q-XK2M", "redeemed_at": "2026-07-02T10:02:44Z" }
```

### 2.7 Brand / City aggregate reports (brand & city tokens only)

```
GET /v1/reports/aggregates?metric=active_runners&period=2026-06&club_id=org_…
```

Returns only k-anonymous aggregates (`cohort_size >= 50`); smaller segments return
`403 consent_error / k_anonymity_floor`. See `permission-model.md` §6.

### 2.8 Webhook endpoint management

```
GET/POST /v1/webhook-endpoints     PATCH/DELETE /v1/webhook-endpoints/{id}
POST /v1/webhook-endpoints/{id}/rotate-secret
GET /v1/webhook-endpoints/{id}/deliveries
```

---

## 3. Authentication & Authorization

| Actor | Mechanism | Notes |
|---|---|---|
| Organizer web / portals | Session cookie (HttpOnly, SameSite=Lax) over tRPC; short-lived JWT access + rotating refresh; SSO (SAML/OIDC) on Network tier; MFA per security policy | |
| Member RN app (incl. white-label) | OAuth2 authorization-code + PKCE against RunOS identity; white-label apps get per-club OAuth client IDs; tokens carry `club_id` claim so one binary serves many clubs | Sign in with Apple/Google supported |
| Public API — machine | **PATs** (`rk_live_…` / `rk_test_…`), sha256-stored, scoped, expiring | Pro (read-mostly) and Network |
| Public API — third-party apps | **OAuth2** authorization-code with granular scopes; club admin consents on install | Marketplace apps |
| Brand Portal API | Brand-scoped tokens (`bk_live_…`) bound to `brand_account_id`; only `reports:aggregate`, `brand-campaigns:*` scopes | Never member-level data |
| Vendor API | Vendor tokens (`vk_live_…`) bound to `vendor_id`; `bookings:*`, `services:*` | Member contact revealed only after confirmed booking |

**Scopes** (subset): `members:read`, `members:write`, `events:read`, `events:write`,
`registrations:write`, `check-ins:write`, `activities:read` (consent-filtered),
`memberships:read`, `payments:read`, `payments:refund`, `perks:write`,
`campaigns:write`, `webhooks:manage`, `reports:aggregate`.

Every request resolves to a **policy context** `{club_id, actor_kind, actor_id, scopes,
role permissions, consent view}`; enforcement is layered (policy engine → RLS → consent
filter) per `permission-model.md` §7.

---

## 4. Outbound Webhook System

- **Signing:** `RunOS-Signature: t=1719900000,v1=hex(hmac_sha256(secret, t + "." + body))`.
  Reject if `|now - t| > 5 min` (replay). Secret rotation keeps old secret valid 24 h
  (`v1` computed with both; header may carry two `v1` entries).
- **Delivery:** POST JSON (CloudEvents-style envelope, same as §3 of
  `technical-architecture.md` minus internal fields), 10 s timeout, expect 2xx.
- **Retries:** exponential backoff with jitter — 30 s, 2 m, 10 m, 1 h, 4 h, 12 h, 24 h
  (8 attempts, ~42 h). After exhaustion → `dead`; endpoint auto-paused after 7 days of
  100% failure; club notified. Manual redelivery from dashboard/API for 30 days.
- **Ordering:** best-effort per resource; consumers must treat events as unordered and
  fetch current state via API when it matters (`data` includes resource `id` + minimal
  snapshot).
- **Event catalog (public subset):**

| Type | Fired when |
|---|---|
| `member.created` / `member.updated` / `member.deleted` | CRM changes |
| `member.consent_changed` | Any consent grant/revoke (scope + status, no data) |
| `event.published` / `event.updated` / `event.cancelled` | Events |
| `registration.created` / `registration.confirmed` / `registration.cancelled` / `waitlist.promoted` | Registrations |
| `checkin.recorded` | QR/manual check-in |
| `activity.ingested` | Consent-permitting summary payload only |
| `membership.activated` / `membership.renewed` / `membership.lapsed` | Memberships |
| `payment.succeeded` / `payment.failed` / `payment.refunded` / `payout.settled` | Money |
| `perk.redeemed`, `challenge.completed`, `referral.converted` | Engage/Growth |
| `booking.created` / `booking.completed` | Marketplace (vendor endpoints) |

Webhook payloads honor consent exactly like the REST API (shared serializer).

---

## 5. Integration Connector Architecture

Connectors live in the Platform module (`platform/connectors/<provider>`), each
implementing a common interface:

```ts
interface Connector {
  provider: Provider;
  auth: OAuth2Def | ApiKeyDef | SdkDef;
  syncModes: ("webhook" | "poll" | "sdk_push")[];
  verifyWebhook?(req): VerifiedEvent[];       // fast-ack, enqueue
  pull?(connection, cursor): Page<RawRecord>; // poll/backfill
  normalize(raw): UnifiedRecord;              // → activities / orders / contacts
  rateBudget: TokenBucketSpec;                // per-app + per-connection
}
```

Shared infrastructure: OAuth token vault (envelope-encrypted, auto-refresh with
single-flight locks), `sync_cursors`, per-provider BullMQ queues with `club_id` fair
grouping, circuit breakers (open on 5xx/429 streaks → backoff, status surfaced in
Platform → Integrations UI), dead-letter review queue.

### 5.1 Fitness providers

| Provider | Auth | Sync | Rate limits (honest assessment) | Dedup key | Backfill |
|---|---|---|---|---|---|
| **Strava** | OAuth2 (per member) | Webhook (subscription API) + on-demand pull of full activity | App-level 200 req/15 min & 2,000/day default — **the binding constraint at scale**; request Strava rate increase early; webhook fast-ack < 2 s. API Agreement restricts data use/display (see `integrations.md` §3.1 compliance) | `provider_activity_id`; cross-provider fingerprint | 30 d default, up to 1 y on request, budgeted trickle (respect daily cap) |
| **Garmin** | OAuth1.0a/OAuth2 (Garmin Connect Developer Program — requires approved partnership) | Push (Health/Activity API push notifications) | Approval process is the risk, not quotas; production keys gated on review | `summaryId` | Garmin backfill endpoint, 90 d windows |
| **COROS** | OAuth2 (COROS Open Platform, partnership approval) | Webhook push + poll fallback | Modest quotas; poll hourly fallback | provider workout id | 90 d |
| **Polar** | OAuth2 (AccessLink) | Pull-after-notification (webhook says "new data", then transaction-based pull) | Transaction API is fiddly (commit protocol); low quotas | `transaction-id` + exercise id | Limited (AccessLink exposes only new data post-consent — **no deep backfill**; state this in UI) |
| **Suunto** | OAuth2 (Suunto Apps/partner API) | Webhook + poll | Partner approval required | workout key | 30 d |
| **Apple Health** | On-device (HealthKit) — **SDK push** from RN app; no server API | `sdk_push`: app uploads new workouts (background delivery) | No server quotas; constraint is iOS background execution | UUID from HealthKit + fingerprint | Device-side query up to consented history |
| **Google Health Connect** | On-device (Android) — SDK push | `sdk_push` | 30-day on-device history window — backfill limited | client record id + fingerprint | ≤ 30 d |
| **Fitbit** | OAuth2 | Webhook (subscriptions) + pull | 150 req/h per user — fine | log id | 1 y, trickled |
| **TrainingPeaks** | OAuth2 (partner approval) | Poll (hourly) | Partner-gated | workout id | 90 d |
| **Zwift** | OAuth2 (Zwift Developer, **restricted access — waitlist risk**) | Poll; fallback: members auto-sync Zwift→Strava/Garmin and we ingest there | Uncertain; treat as best-effort | fitness fingerprint | via Strava/Garmin path |

**Cross-provider dedup** (same run from watch + Strava): fingerprint =
`(member_id, round(start_time, 5 min), round(distance_m, 200 m), sport)`; on collision
the richer source becomes canonical (priority: Garmin/COROS/Polar/Suunto native > Strava
> Apple/Google > Fitbit), others link as `activity_sources.is_canonical=false`. Full
spec in `integrations.md` §8.2.

### 5.2 Business providers

| Provider | Auth | Sync | Notes |
|---|---|---|---|
| **Stripe** | Connect OAuth/onboarding (Standard) per club | Webhooks (signed) + API | Payments backbone; destination charges + application fees |
| **Shopify** | OAuth (public app) per club shop | Webhooks (orders/products) + reconciliation poll nightly | Mirror products/orders read-mostly; native light commerce stays canonical for RunOS-sold items |
| **Mailchimp** | OAuth2 | Push segments/contacts out; poll campaign stats | Export-only of consented contacts (`marketing` lawful basis) |
| **HubSpot** | OAuth2 | Two-way contacts sync (member ↔ contact), poll + webhooks | Field mapping UI; RunOS wins conflicts on member-controlled fields |
| **Meta / TikTok** | OAuth (Marketing APIs) | Push custom audiences (hashed emails, `marketing.brands`-consented members only); pull ad metrics | Strict consent gate; hashed upload only |
| **Google Analytics** | OAuth / measurement protocol | Push events (page/funnel) from white-label sites | No PII in events |
| **Slack / Discord** | OAuth (bot) | Push notifications (new member, event published); slash-command reads | |
| **WhatsApp** | WhatsApp Business Cloud API | Template messages out (opt-in only); group-export **file import** (no group-message API) | Conversation-based pricing; templates pre-approved |

### 5.3 Failure-mode playbook (all connectors)

- Token expired/revoked → connection `status=error`, member/organizer notified once,
  re-auth deep link; no data loss (cursor preserved).
- Provider outage → circuit open, exponential retry, backlog drains through fair queues;
  ingestion-lag SLO alert at p95 > 60 s.
- Payload schema drift → raw stored in `activity_sources.raw`, normalize errors go to
  dead-letter with alert; replayable after adapter fix.
- Quota exhaustion → per-app budget tracker throttles preemptively at 80%, defers
  backfills before real-time.

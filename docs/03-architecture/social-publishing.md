# Social Publishing — PUBLISH & PROMOTE Architecture

> Status: demo implemented (`lib/social.ts`, `/app/events/{id}/promote`, `/api/v1/events/{id}/promote`, `/api/v1/social/queue`). This document specifies the production integration path.

Every event on RunOS ships with its own campaign: the moment an organizer publishes an event, the content engine generates one tailored post per channel (announce for all six channels, reminders for Instagram/WhatsApp/X, recaps for Instagram/Facebook). The organizer reviews, tweaks, and schedules — RunOS handles the rest.

## 1. Architecture

```
content engine ──▶ review UI ──▶ post queue ──▶ dispatcher workers ──▶ channel adapters
(generatePosts)   (Promote      (social_posts   (retry/backoff,       (Meta, X, LinkedIn,
 pure fn per       studio)       table)          idempotency keys)     TikTok, WhatsApp
 event                                                                 — or aggregator)
```

- **Content engine** — `generatePosts(event, clubName)` is a pure function over event data (title, route, capacity, price, weather, registrations). Same event in, same campaign out; no LLM call required for v1, though the engine is the natural seam to add one (Pacer rewrites per club tone-of-voice).
- **Review UI** — the Promote studio. Nothing is ever auto-posted without a human clicking Schedule; edited bodies are what gets queued, not the generated originals.
- **Queue** — `social_posts` rows with `status` (`scheduled → dispatching → posted | failed | canceled`), `scheduled_for`, `channel`, `body`, `extras` (jsonb), and `idempotency_key`. The demo keeps this on `globalThis` (see `lib/social.ts`) behind the same repository-shaped functions.
- **Dispatcher workers** — poll due posts (or receive Temporal timer callbacks), claim a row with `SELECT … FOR UPDATE SKIP LOCKED`, call the channel adapter, and record the platform post ID. Failures retry with exponential backoff + jitter (30s → 2m → 10m → 1h, max 5 attempts), then park as `failed` with the provider error surfaced in the studio. Idempotency keys prevent double-posting when a worker dies mid-dispatch.
- **Channel adapters** — one module per channel implementing `publish(post, connection): Promise<{ externalId }>`. Adapters normalize media upload, rate limits, and error taxonomies behind a single interface, so the dispatcher never knows which platform it is talking to.

## 2. Per-channel API requirements

| Channel | API | Requirements & gotchas |
|---|---|---|
| Instagram | Meta Graph API (`/{ig-user-id}/media` → `media_publish`) | IG **Business/Creator** account linked to a Facebook Page; app review for `instagram_content_publish`; carousels = up to 10 children; ~50 API-published posts / 24h |
| Facebook | Meta Graph API (`/{page-id}/feed`, `/photos`) | Page access token via the same Meta app; `pages_manage_posts` permission; scheduling supported natively via `scheduled_publish_time` |
| X (Twitter) | X API v2 (`POST /2/tweets`) | Write access requires the **paid Basic tier** (~$200/mo, 3k posts/mo); Free tier is effectively read-only; 280-char limit enforced by the content engine |
| LinkedIn | Community Management API (`/rest/posts`) | Posting as an organization requires the **Community Management** product + partner review; tokens are member-scoped with 60-day expiry (refresh flow required) |
| TikTok | Content Posting API | App **audit/approval required** before posting publicly (unaudited apps post as private drafts only); video upload is chunked; the engine ships a concept (hook/shots/sound), not a rendered video |
| WhatsApp | Business Cloud API | Broadcasts to members must use **pre-approved message templates**; per-number messaging tiers; opt-in required — this is member messaging, not public posting |

## 3. The aggregator shortcut

Native adapters mean five app reviews across four companies before the first live post. An aggregator collapses that to **one REST call**:

- **Postiz (self-hosted)** — open source, runs in our infra, no per-post fees, we own the OAuth apps and data. Tradeoff: we operate it (upgrades, queue health), and we still need our own platform app approvals for some channels.
- **Ayrshare (SaaS)** — fastest possible path: their platform apps are already approved; one API key, one `POST /post` with a `platforms[]` array. Tradeoffs: per-club cost scales with the network, their rate limits pool across tenants, media transits a third party (DPA required), and we depend on their channel coverage.

The adapter interface makes this a routing decision, not an architecture decision: `mode: 'native-api' | 'aggregator'` on the connection decides which adapter the dispatcher picks per post. Clubs can start on the aggregator and migrate channels to native adapters without touching the queue.

## 4. Auth & token storage

Channel credentials are per-club rows in **`integration_connections`** (see `database-schema.md` §10): `provider`, `external_account_id`, encrypted `access_token`/`refresh_token` (AES-256-GCM via KMS envelope encryption, never logged, never sent to the client), `scopes`, and `expires_at`. A refresh worker rotates tokens ahead of expiry (LinkedIn's 60-day and Meta's long-lived-token windows are the tight ones) and flips the connection to `reauth_required` on refresh failure, which surfaces as a banner in the Promote studio's Channels card.

## 5. Scheduling

Suggested times come from the content engine (announce = now, reminder = T-24h, recap = T+2h) and are editable. Execution rides the existing automation engine: each scheduled post is a **Temporal timer** (durable, survives deploys) targeting the dispatcher activity, rather than a cron sweep. Club-level **quiet hours** (default 22:00–07:00 club-local) shift sends to the next allowed window; reminders never shift past T-2h. Recap timers re-check that the event actually ran (status `completed`) before dispatching.

## 6. Compliance

- **Platform ToS**: post only through official APIs — no headless-browser automation, ever (account-ban risk for the *club's* accounts). Respect per-channel API rate limits at the adapter layer.
- **No engagement-bait automation**: RunOS schedules organic club content; it does not auto-like, auto-follow, auto-comment, or mass-DM. Those are ToS violations on every platform and off the roadmap by policy.
- **Consent**: posting from the club's own organization accounts requires **no per-member consent** — it's the club speaking, not members' data. The line is member-identifying content: photos/tags follow the existing `photos.appearances` consent scope, and WhatsApp broadcasts require recorded opt-in (enforced by the Cloud API template model anyway).

## 7. Rollout

1. **v1 — copy/manual (shipped in demo)**: generated campaign + queue + Copy button. Organizers paste into native apps. Zero external approvals; immediate value.
2. **v2 — aggregator**: Postiz self-hosted (default) or Ayrshare key per club; the dispatcher goes live behind the existing queue. One integration lights up all six channels.
3. **v3 — native adapters**: migrate high-volume channels (Meta first — best ROI and one app review covers IG+FB, then WhatsApp templates for reminders) to direct APIs for lower cost, higher rate limits, and richer features (carousels, first-comment hashtags, native scheduling).

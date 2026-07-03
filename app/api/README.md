# RunOS API v1 (demo)

REST API over the demo store. Full machine-readable spec: [`/openapi.json`](/openapi.json).

## Auth

Every endpoint except `GET /api/v1/health` requires a bearer token starting with `ros_`:

```
Authorization: Bearer ros_demo
```

Missing/invalid token → `401 { "error": { "code": "unauthorized", ... } }`.

## Conventions

- **Envelope:** success `{ "data": ..., "meta": ... }`, errors `{ "error": { "code", "message" } }` (Stripe-style).
- **Pagination:** `?limit=` (default 20, max 100) and `?cursor=` (opaque, from `meta.next_cursor`).
- **Consent filtering:** `GET /members/:id` strips activity fields (`weeklyKm`, `prs`) unless the member granted `activity.summary`. Health-scope data is never exposed via the API at all.
- **Idempotency:** check-in is idempotent — a second call returns `already_checked_in` without double-counting.
- The in-memory store is the repository interface; swap its functions for Postgres per `docs/03-architecture/database-schema.md` without touching the routes.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/health` | Liveness (no auth) |
| GET, POST | `/api/v1/members` | List (`?status`, `?q`) / create |
| GET, PATCH | `/api/v1/members/:id` | Read (consent-filtered) / update status, tags, tier |
| GET, POST | `/api/v1/events` | List (`?status`) / create |
| GET, PATCH | `/api/v1/events/:id` | Read / update |
| GET, POST | `/api/v1/events/:id/registrations` | List / register (capacity → waitlist) |
| POST | `/api/v1/events/:id/checkin` | QR check-in (idempotent) |
| GET, POST | `/api/v1/payments` | List / create (computes 0.5% platform fee) |
| GET | `/api/v1/sponsors` | List sponsor pipeline |
| PATCH | `/api/v1/sponsors/:id` | Stage transition (validated) |
| GET | `/api/v1/perks` | Benefits passport |
| POST | `/api/v1/perks/:id/redeem` | Redeem (respects monthly limit → 409) |
| GET | `/api/v1/challenges` | Challenges + leaderboards |
| GET | `/api/v1/journeys` | Growth OS journeys |
| GET | `/api/v1/metrics` | WACM series, MRR, revenue, counts |
| GET | `/api/v1/audit` | Mutation audit log (newest first) |
| GET, POST | `/api/v1/webhooks/strava` | Strava verification handshake / activity events |

## Examples

```bash
# Liveness
curl -s http://localhost:3000/api/v1/health

# List at-risk members
curl -s -H "Authorization: Bearer ros_demo" \
  "http://localhost:3000/api/v1/members?status=at-risk&limit=5"

# Register a member for the Saturday long run
curl -s -X POST -H "Authorization: Bearer ros_demo" -H "Content-Type: application/json" \
  -d '{"member_id":"mem_004"}' \
  http://localhost:3000/api/v1/events/evt_001/registrations

# Check them in on event morning (idempotent)
curl -s -X POST -H "Authorization: Bearer ros_demo" -H "Content-Type: application/json" \
  -d '{"member_id":"mem_004"}' \
  http://localhost:3000/api/v1/events/evt_001/checkin

# Redeem a perk
curl -s -X POST -H "Authorization: Bearer ros_demo" -H "Content-Type: application/json" \
  -d '{"member_id":"mem_007"}' \
  http://localhost:3000/api/v1/perks/perk_1/redeem

# Club metrics (the analytics read model)
curl -s -H "Authorization: Bearer ros_demo" http://localhost:3000/api/v1/metrics
```

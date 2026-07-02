# RunOS — Security & Privacy

> Scope: platform-wide. Crown jewels, in order: (1) health/medical data, (2) minors'
> data, (3) payment data, (4) mass member PII (18M-runner end-game). RunOS does **not**
> claim HIPAA compliance; health data is handled under GDPR Art. 9 heightened controls.

---

## 1. Threat Model (STRIDE)

### 1.1 Assets & trust boundaries

Boundaries: internet ↔ edge (CloudFront/WAF); edge ↔ API; API ↔ DB (RLS); cell ↔ cell
(residency); RunOS ↔ integration providers; RunOS ↔ brand/vendor/city actors; staff ↔
member data (consent).

### 1.2 STRIDE by crown jewel

| Threat | Health/medical | Minors | Payment | Mass PII |
|---|---|---|---|---|
| **S**poofing | Fake organizer accessing emergency panel → MFA for any role holding `events.emergency.view`; panel only during live, checked-in events | Adult posing as guardian → guardian email verification + payment-card or ID-lite check on guardian account | Stripe webhook forgery → signature verification, event-id dedup | Credential stuffing on member logins → rate limits, breached-password checks, optional MFA |
| **T**ampering | Alteration of medical notes → append-only versions, audit log | Forged parental consent record → signed consent artifacts (who/when/IP/version), immutable | Amount manipulation → amounts computed server-side only; PaymentIntents created server-side; client only confirms | Mass update abuse via API → scoped PATs, write scopes rare, anomaly alerts on bulk mutations |
| **R**epudiation | "I never saw her medical data" → every read audit-logged, member-visible | Guardian denies consenting → stored consent artifact w/ verification trail | Chargeback disputes → Stripe evidence trail + registration/check-in records | Staff denies export → `community.members.export` audit-logged w/ row counts + IP |
| **I**nfo disclosure | **Top risk.** Leak via logs/AI prompts/exports → field-level encryption, log PII scrubber, Pacer context excludes Art. 9 data categorically, exports exclude medical always | Minor's data in brand cohort → minors excluded from all brand/marketing paths at query level (hard predicate) | Card data exposure → SAQ-A posture: card data never touches RunOS (Stripe Elements/SDK tokenization only) | Cross-tenant leak → RLS + isolation tests + nightly fuzzing; IDOR → ULIDs + object-level authz checks in policy engine |
| **D**oS | Emergency panel down at race start → check-in/emergency paths on separate high-priority queue + offline roster cache | — | Webhook flood → per-source rate limits, queue isolation | Scraping white-label sites → WAF bot rules, per-IP limits, no member PII on public pages |
| **E**levation | Coach → medical via role editing → guardrails: custom roles cannot self-grant; consent gate independent of RBAC | Volunteer sees minor roster → minors flagged, restricted fields for all roles except Owner/Admin/Organizer with training flag | Finance → refunds fraud → refund velocity alerts, 4-eyes over threshold ($500) | RLS bypass via `runos_batch` role → CODEOWNERS gate, no interactive access, session recording on break-glass |

Abuse cases beyond STRIDE: stalking via live location (per-event scope, auto-expiry,
sweeper-role-only view); harasser exports roster (export permission Owner/Admin only +
watermarked CSVs + audit); brand attempts re-identification from aggregates (k ≥ 50,
rounding, noise, contractual prohibition + audit of query patterns).

---

## 2. Security Controls

| Domain | Control |
|---|---|
| Encryption in transit | TLS 1.2+ everywhere (external + service-to-service); HSTS; mTLS for internal NATS/Temporal traffic |
| Encryption at rest | AES-256 (Aurora, S3, ClickHouse volumes, Redis). **Field-level envelope encryption** (KMS data keys, per-tenant key derivation) for: OAuth tokens, medical fields, TOTP secrets, webhook secrets |
| Key management | AWS KMS, per-cell CMKs (EU keys never leave EU); annual rotation; key deletion is part of cell decommission runbook |
| Secrets | AWS Secrets Manager + IAM task roles; no secrets in env files/repos; gitleaks in CI; 90-day rotation for provider API secrets |
| SSO / MFA | Staff: TOTP/WebAuthn MFA required for Owner/Admin/Finance and anyone with `events.emergency.view` or `platform.*`; SAML/OIDC SSO on Network tier with SCIM deprovisioning. Members: optional MFA, Sign in with Apple/Google |
| Session policy | Access JWT 15 min; refresh 30 d rotating with reuse detection (revoke family); absolute session 90 d; org-context switch re-authorizes; admin sessions idle-timeout 12 h; device list + remote sign-out |
| AppSec | zod validation at every boundary; parameterized SQL only (no string SQL passes review); CSP + Trusted Types on web; dependency scanning (Renovate + `npm audit` gate + Socket); SAST (Semgrep ruleset incl. RLS-context misuse rules); secrets scanning; container image scanning (Trivy) |
| Vulnerability management | SLA: critical 48 h, high 7 d, medium 30 d, low 90 d; runtime CVE watch on base images; public `security.txt` + VDP inbox, bug bounty from GA |
| Pentesting | External pentest **2×/year** (one full-scope, one focused: multi-tenancy & consent bypass); red-team exercise annually from year 2 |
| Backups | Encrypted, cross-AZ, restore-tested quarterly (see DR in `technical-architecture.md` §6.5) |
| Access to prod | SSO + MFA + short-lived credentials (no static keys); break-glass accounts vaulted, alarmed, session-recorded; support access to tenant data via time-boxed, member-notified impersonation with audit |

### SOC 2 roadmap

| Phase | Timeline | Milestones |
|---|---|---|
| Readiness | M0–M6 | Controls mapped (Security + Availability + Confidentiality TSCs), Vanta/Drata instrumented, policies ratified, vendor DPAs collected |
| **Type I** | M9 | Point-in-time audit passed; report available to Network-tier prospects |
| Observation | M9–M15 | 6-month evidence window, quarterly access reviews, tabletop IR exercises |
| **Type II** | M15–M18 | 6–12-month period report; annual renewals thereafter. ISO 27001 evaluated at M18 for EU enterprise/city deals |

---

## 3. GDPR Compliance Design

### 3.1 Roles & lawful bases

RunOS is **processor** for club member data (clubs are controllers; DPA + SCCs part of
ToS) and **controller** for platform accounts, billing, and anonymized network
intelligence (legitimate interest, works on anonymized data only).

| Data category | Lawful basis (club as controller) | Notes |
|---|---|---|
| Identity & membership (`profile.basic`) | Contract (membership) | Minimal set to operate membership |
| Activity summary/detailed | **Consent** (scopes) | Withdrawable per §4 of `permission-model.md` |
| Health/medical (`health.medical`) | **Art. 9(2)(a) explicit consent** | Separate, specific, re-confirmed yearly; never bundled; processed only for event-safety purpose |
| Live location | Consent, per event | Auto-expiring |
| Marketing (email/SMS/brand) | Consent (`marketing.brands` for brand-related; soft opt-in rules per channel/jurisdiction for club's own messaging) | Suppression lists honored across channels |
| Payments | Contract + legal obligation (bookkeeping) | Retention per tax law (7–10 y), exempt from erasure |
| Photos/appearances | Consent | Takedown workflow on revoke |
| Audit logs / security | Legitimate interest | PII-minimized, access-restricted |

Data minimization: consent tiers physically limit what is stored (detailed tier
downgraded at rest 30 d after revocation); GPS start points rounded at rest; EXIF
stripped; logs scrubbed; Pacer prompts exclude special-category data by construction.

DPAs: club-facing DPA (RunOS as processor, subprocessor list published, 30-day change
notice), and RunOS's own DPAs with subprocessors (AWS, Stripe, Anthropic, Twilio, SES,
ClickHouse Cloud, …). EU residency: EU-homed clubs' member data stored and processed in
the EU cell (`technical-architecture.md` §4.5); transfers to US subprocessors (e.g.
Stripe) covered by SCCs/DPF.

**HIPAA:** not claimed, not marketed. RunOS is not a covered entity/BA. Nevertheless
`health.medical` data gets HIPAA-inspired controls: field-level encryption, access
audit visible to the data subject, purpose limitation (emergency panel only), yearly
re-consent, 72 h hard-delete on revocation.

### 3.2 DSRs (data subject requests)

Self-service on the member Privacy page; requests also accepted via club (controller)
or privacy@runos.com. Identity verified via authenticated session (or documented manual
process). All DSRs run as **Temporal workflows** (auditable, retryable, deadline-tracked;
statutory 30 d, target 7 d).

**Export (Art. 15/20):** workflow collects per-domain JSON + CSV (profile, consents,
activities incl. raw source payloads, registrations, check-ins, payments metadata,
messages, redemptions, participations) → bundled ZIP in S3 → time-limited signed URL
(72 h) → audit-logged. Club-level export (controller tooling) excludes medical always.

**Deletion (Art. 17) and how it propagates:**

```mermaid
sequenceDiagram
    participant M as Member (or club on member's behalf)
    participant T as Temporal DSR workflow
    participant PG as Postgres (cell)
    participant CH as ClickHouse
    participant S3 as S3
    participant EXT as Downstream (Mailchimp, HubSpot, Meta audiences, Stripe)
    M->>T: erasure request (7-day grace/cancel window)
    T->>PG: anonymize member: PII columns → tombstone values; sever user link;\nhard-delete medical, coach notes, consents' free text, messages content;\nretain financial rows (legal hold) keyed to anonymized member id
    T->>PG: insert member_id into erasure_tombstones (blocks bus replays)
    T->>CH: lightweight DELETE across mirrors WHERE member_id = ?
    T->>S3: delete media/exports/waiver PDFs* (*waivers kept if legal-claims basis, PII-minimized)
    T->>EXT: API deletes: Mailchimp/HubSpot contact, replace Meta/TikTok audiences,\nStripe customer PII redaction request (Stripe retains its own legal records)
    T->>M: confirmation with per-store completion report
```

- **Backups:** PITR/backup blobs are immutable; erased IDs live in
  `erasure_tombstones`, and the **restore runbook replays tombstones as the final step
  of any restore** — so deletion survives a restore. Backups age out ≤ 35 d; the
  tombstone list is retained. This "delete on restore" approach is documented in the DPA
  (standard, defensible pattern).
- Financial/audit records are retained under legal obligation but re-keyed to an
  anonymized member id with PII columns cleared.
- Club offboarding: full-tenant export offered; tenant data hard-deleted 60 d after
  contract end (30 d grace + 30 d cold), same propagation.

---

## 4. Minors Policy

- Age captured at join (`date_of_birth`); minors = under 16 (configurable to national
  digital-consent age 13–16 for GDPR Art. 8; US clubs: under-13 blocked entirely —
  COPPA avoidance — and 13–17 treated as minors).
- **Parental consent flow:** minor signup pauses → guardian email invite → guardian
  creates/links account, verifies email, reviews each consent scope, signs waiver as
  guardian → member activates. Consent artifacts store guardian identity, IP, time,
  consent-text version.
- **Restricted features for minors (hard-coded, not configurable):** no
  `marketing.brands` (invisible to all brand surfaces incl. aggregates), no
  `location.live`, no marketplace bookings without guardian approval, no public
  leaderboard visibility outside the club, no DMs from staff without guardian cc'd
  channel, photos default to no-appear (guardian may opt in).
- Guardians hold the member's Privacy page: view data, manage scopes, export, delete.
- At age of majority: scopes reset to member control with a re-consent prompt; guardian
  link removed.

---

## 5. Incident Response & Breach Notification

**Severities:** SEV1 confirmed breach/active exploitation of member data; SEV2 suspected
breach or crown-jewel vulnerability exposed; SEV3 contained security bug; SEV4 policy
violation/near-miss.

**Plan outline (full runbook in internal wiki, exercised 2×/year):**

1. **Detect & triage** — on-call (24/7 PagerDuty) + security lead; declare severity in
   ≤ 30 min; open incident channel + timeline doc scribe.
2. **Contain** — revoke credentials/tokens, isolate workloads, block indicators at WAF,
   feature-flag off affected surfaces; preserve forensics (snapshot before rebuild).
3. **Assess** — data categories, tenants, member counts, special categories (medical,
   minors) flagged explicitly — they change notification calculus.
4. **Eradicate & recover** — patch, rotate secrets (all potentially exposed), restore
   integrity from backups, heightened monitoring 30 d.
5. **Notify** —
   - Clubs (controllers): **without undue delay**, target ≤ 24 h from confirmation, with
     enough detail for their own Art. 33 duties. RunOS-as-processor duty: Art. 33(2).
   - Supervisory authority (where RunOS is controller): ≤ 72 h from awareness.
   - Members: directly (on clubs' instruction or where RunOS is controller) when high
     risk to rights/freedoms — always for medical/minor data exposure.
   - Also as applicable: card brands via Stripe, US state AG laws, insurers, law
     enforcement.
6. **Post-incident** — blameless RCA ≤ 5 business days, corrective actions tracked to
   closure, disclosure page updated if user-facing.

---

## 6. Anonymization Spec — Network Intelligence

Network intelligence (brief §4, §9): cross-club benchmarks with **no segment smaller
than 50** ever shown.

- **Pipeline:** per-cell nightly job computes club-level and segment-level aggregates
  from ClickHouse → strips all identifiers (no member ids, no club ids in cross-club
  rows; club sees itself vs. "clubs like yours" cohorts of ≥ 20 clubs) → writes to the
  global benchmarks store. Raw/member-level data never leaves its cell.
- **k-anonymity ≥ 50 (members) / ≥ 20 (clubs):** any aggregate whose contributing
  distinct-member count < 50 (or distinct-club count < 20 for cross-club stats) is
  suppressed, not rounded. Enforced in the aggregate gate library used by network
  intelligence, brand reports, and city dashboards alike — one implementation, three
  consumers.
- **Aggregation rules:** counts, sums, means, medians, deciles only; no min/max (outlier
  re-identification); no free-text passthrough; time buckets ≥ 1 week; geography ≥ city
  level; age in 10-year bands; cross-dimensional cells re-checked against the floor
  after every group-by (not just the top-level cohort).
- **Differential-privacy-lite noise:** for published segments with 50 ≤ n < 250, add
  calibrated Laplace noise (sensitivity 1, ε = 1.0 per metric-period) to counts and
  round to nearest 5; means reported only with n ≥ 100. This blunts differencing attacks
  between overlapping cohorts without full DP accounting; documented honestly as
  "DP-inspired noise," not formal DP.
- **Query auditing:** brand/city aggregate queries are logged with cohort hashes;
  automated detection of complementary-cohort probing (many near-identical cohorts
  differing by one filter) → throttle + review.
- **Contractual layer:** brand/city ToS prohibit re-identification attempts; violation =
  termination + liability. Technical + legal, never legal alone.

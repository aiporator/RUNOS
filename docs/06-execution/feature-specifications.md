# RunOS — MVP Feature Specifications

> **Scope:** the 6 MVP-critical features for H1 ("Own the club workflow"), followed by one-page specs for the H2 wave, and the definition-of-done / quality bar.
> **Source of truth:** [`docs/00-foundation/canonical-brief.md`](../00-foundation/canonical-brief.md). Personas (Maya, Leo, Sofia, Emre, Priya), surfaces, consent scopes, pricing, and stack terms in this doc must match the brief exactly.
> **Stack context:** Next.js (App Router) + React + TypeScript + Tailwind tokens; NestJS modular monolith; PostgreSQL 16 with `club_id` + RLS; Redis + BullMQ; ClickHouse for analytics events; Stripe Connect; Expo for mobile (H2).
> **Conventions:** all analytics events are `snake_case`, emitted to ClickHouse with `club_id`, `actor_id`, `actor_role`, `ts`, and are consent-safe (no scope-gated payloads). All user-facing errors are actionable ("what happened + what to do").

---

## Table of Contents

1. [F1 — Club onboarding & member import](#f1--club-onboarding--member-import)
2. [F2 — Member CRM & unified runner profile](#f2--member-crm--unified-runner-profile)
3. [F3 — Event builder + registration + QR check-in](#f3--event-builder--registration--qr-check-in)
4. [F4 — Memberships & payments](#f4--memberships--payments)
5. [F5 — Strava connector & activity normalization](#f5--strava-connector--activity-normalization)
6. [F6 — Community feed + messaging basics](#f6--community-feed--messaging-basics)
7. [Next wave one-pagers](#next-wave-one-page-specs)
8. [Definition of Done & quality bar](#definition-of-done--quality-bar)

---

## F1 — Club onboarding & member import

**Surface:** Platform (onboarding) + Community. **Tier:** all tiers.

### Overview

The first 30 minutes decide whether a club activates. Onboarding takes Maya from signup to a functioning club: club profile created, staff invited, members imported from wherever they live today — CSV, a WhatsApp chat export, or plain invite links — and a white-label club web page published. The importer is the wedge that moves the source of truth from spreadsheets and WhatsApp into RunOS. Members imported here are **provisional contacts** until they claim their profile; claiming is where consent is granted (see F2).

### User stories

- As **Maya (Organizer)**, I want to create my club and see a checklist of what's left, so that I know I'm 30 minutes from a working club, not 3 weeks.
- As **Maya**, I want to upload the messy CSV I exported from Google Sheets and map its columns to RunOS fields, so that my 450 members arrive without retyping.
- As **Maya**, I want to upload a WhatsApp chat export (.txt/.zip) and get a deduplicated contact list with names and phone numbers, so that my real member list — which only exists in WhatsApp — becomes data.
- As **Maya**, I want a shareable invite link (and QR code) I can post in the WhatsApp group, so that members join and claim their own profiles.
- As **Maya**, I want imported duplicates detected and merge suggestions shown, so that "Leo M", "Leo Martins", and "+234801…" don't become three people.
- As **Leo (Member)**, I want the invite link to take me through a fast join flow where I control what I share, so that joining feels like 60 seconds, not a form audit.
- As **Priya (Chapter lead)**, I want to be invited as staff with an Organizer role scoped to what Maya grants, so that I can help onboard without owning billing. *(Full chapter hierarchy is H4; in MVP Priya is staff with an Organizer role.)*

### Functional requirements

1. **Club creation:** name, slug (auto-suggested, editable, globally unique), city + country, logo upload, primary color, member-count estimate, weekly run schedule (free text). Creates the org tenant, assigns creator as Owner.
2. **Onboarding checklist** (persistent card on dashboard until complete): ① club profile ② invite staff ③ import members ④ publish first event ⑤ set up payments ⑥ publish club page. Each item deep-links; checklist state drives the activation metric ("first 3 events published, 30% members joined").
3. **Staff invites:** email invite with role selection from the canonical roles (Owner, Admin, Organizer, Coach, Finance, Content, Volunteer-coordinator, Read-only). Invites expire in 14 days, resendable, revocable.
4. **CSV importer:**
   - Accepts `.csv` up to 10 MB / 10,000 rows; UTF-8, Latin-1 auto-detected; delimiter auto-detected (`,` `;` `\t`).
   - Column-mapping UI: auto-suggests mappings (fuzzy header match: "e-mail", "Email Address" → email); required = at least one of email/phone; optional = first/last name, joined date, membership status, tags, emergency contact name/phone.
   - Validation pass before commit: per-row errors (invalid email, unparseable phone, missing both identifiers) shown in a review table; Maya can fix inline, skip rows, or download an errors CSV.
   - Import runs as a BullMQ job; progress UI (n of N); result summary: created / merged / skipped / failed.
5. **WhatsApp export importer:** accepts WhatsApp chat export (`.txt` or `.zip` containing txt). Parses participant names and phone numbers from message headers (both `+234 801 234 5678 - Name:` and saved-contact-name formats, 12h/24h timestamps, iOS + Android export variants). Produces contact candidates: phone (E.164-normalized against club country), display name, message count (used as an "active member" hint, then discarded — **message content is never stored**). Maya reviews the candidate list (select/deselect) before import.
6. **Invite links:** club-level default link + named links (e.g. "April flyer") for source attribution; optional per-link cap and expiry; QR code render + PNG download. Link opens the member join flow (F2 profile claim).
7. **Deduplication & merge:** on import, match by exact email, E.164 phone, then fuzzy name (trigram ≥ 0.85) within the club. Exact matches auto-merge (fields fill blanks only, never overwrite); fuzzy matches queue as merge suggestions with side-by-side diff, Maya approves/rejects each. Merges are reversible for 30 days (audit log).
8. **Provisional contacts vs. members:** imported people are `status=provisional` — visible to staff in CRM, **not** contactable via member-facing surfaces, no consent scopes granted. They become `status=member` when they claim via invite/claim email. Claim emails are only sent when Maya explicitly triggers "invite imported members" (bulk or per-person) — importing alone never emails anyone.
9. **Club page publish:** one-click white-label web page at `{slug}.runos.club` (custom domain on Pro): logo, colors, about, weekly schedule, upcoming public events, join button. "Powered by RunOS" footer on Starter/Club per brief.

### Acceptance criteria

**Club creation & checklist**
- Given a new user signs up, when they complete club creation, then a tenant is created, they hold the Owner role, and the dashboard shows the 6-item checklist with item ① complete.
- Given a slug collision, when Maya types a taken slug, then an inline error with 3 available suggestions appears before submit.
- Given all 6 checklist items complete, when the last completes, then the checklist collapses into a dismissible "You're live" card and `club_onboarding_completed` fires.

**CSV import**
- Given a valid 450-row CSV, when Maya maps columns and confirms, then a progress indicator shows during processing and a summary reports created/merged/skipped/failed counts within 60 s.
- Given a CSV where 12 rows lack both email and phone, when validation runs, then those 12 rows are flagged "no way to identify this person," excluded by default, and downloadable as an errors CSV; the other rows import.
- Given a CSV with `;` delimiters and Latin-1 encoding, when uploaded, then detection handles both and names with diacritics render correctly.
- Given a CSV over 10 MB or 10,000 rows, when uploaded, then upload is rejected pre-parse with the limit stated and a suggestion to split the file.
- Given a duplicate upload of the same file, when the import commits, then previously imported rows resolve as merges (0 new duplicates created).
- Given an import job crash mid-run, when the job retries, then no row is imported twice (idempotency by file hash + row index) and Maya sees "resumed" not a duplicate summary.
- Given a malicious CSV containing `=HYPERLINK(...)` formula content, when stored and later re-exported, then values are formula-escaped (CSV-injection safe).

**WhatsApp import**
- Given an Android WhatsApp export with 300 participants, when uploaded, then a candidate list with names + E.164 phones appears, sorted by message count, with all selected by default.
- Given an iOS-format export, when uploaded, then parsing succeeds (both header formats supported).
- Given phone numbers without country codes, when parsed, then they normalize against the club's country code and ambiguous numbers are flagged for review rather than guessed silently.
- Given the export contains message text, when import completes, then no message content exists anywhere in RunOS storage (verified by test) — only name, phone, and a discarded activity hint.
- Given a `.zip` export containing media, when uploaded, then media files are ignored, never stored, and only the chat `.txt` is parsed.
- Given an unparseable file, when uploaded, then Maya gets "This doesn't look like a WhatsApp export" with a help link showing how to export a chat.

**Invite links & claim**
- Given a named invite link with a cap of 100, when the 101st person opens it, then they see "This link has reached its limit — contact your organizer" and the join is blocked.
- Given an expired link, when opened, then a friendly expiry message appears with the club's public page linked.
- Given Leo opens a valid link, when he completes the join flow, then his member record is `status=member`, joined-via source records the link name, and Maya sees him in CRM within 5 s.
- Given Leo joins via link and a provisional contact exists with his phone number, when he verifies that phone, then his account links to the existing record (history preserved) instead of creating a duplicate.

**Dedup & merge**
- Given two imports where "leo.martins@x.com" appears in both, when the second commits, then exactly one record exists and blank fields were filled without overwriting existing values.
- Given a fuzzy match ("Leo M" / "Leo Martins", no shared identifier), when import completes, then a merge suggestion appears in a review queue; nothing merges without approval.
- Given Maya approves a merge and regrets it, when she opens the merged record within 30 days, then "Unmerge" restores both originals.

**Provisional contact rules & club page**
- Given provisional contacts exist, when any staff attempts to include them in member-facing messaging, then the audience picker shows them excluded with the count and reason ("not yet joined — send invites instead").
- Given Maya clicks "invite imported members," when confirmed with a shown recipient count, then claim emails send (rate-limited, unsubscribable) and `member_invites_sent` fires with count.
- Given a Starter club publishes its page, when viewed, then it renders at `{slug}.runos.club` under the club's brand with "Powered by RunOS" footer, loads with LCP < 2.5 s on 4G, and shows only events marked public.

### Non-functional requirements

- Import throughput ≥ 100 rows/s; UI never blocks (jobbed via BullMQ).
- Importer files stored in S3-compatible object storage, encrypted, auto-deleted after 30 days.
- All imports write an audit log entry (who, when, file hash, counts).
- Club page: static-generated with revalidation ≤ 60 s; Lighthouse ≥ 90 performance/accessibility.
- Rate limits: 10 import jobs per club per day; invite emails ≤ 1 claim email per contact per 7 days.

### Analytics events

`club_created`, `onboarding_step_completed` (step), `staff_invite_sent` / `staff_invite_accepted` (role), `import_started` / `import_completed` / `import_failed` (source: csv|whatsapp, rows, created, merged, skipped), `merge_suggestion_resolved` (approved|rejected), `invite_link_created` / `invite_link_opened` / `invite_link_joined` (link_name), `member_invites_sent`, `club_page_published`, `club_onboarding_completed`.

### Permissions & consent touchpoints

- Club creation → Owner. Import/merge/invite: Owner, Admin, Organizer. Staff invites & role assignment: Owner, Admin. Club page publish: Owner, Admin, Content.
- **Consent:** importing grants *no* consent scopes — provisional contacts have none. `profile.basic` is granted only by the member during profile claim (F2). Emergency-contact fields from CSV are stored staff-visible under legitimate-interest basis, flagged for the member to confirm/remove at claim. WhatsApp message content is never ingested (data-minimization).

### Out of scope (MVP)

Instagram/Strava-club followers import; Mailchimp/HubSpot sync (H2 integrations); automatic recurring CSV sync; multi-chapter routing of imports (H4); SMS invites (email + link only in MVP); custom domains on Starter/Club.

---

## F2 — Member CRM & unified runner profile

**Surface:** Community. **Tier:** all tiers (segment depth grows with tier).

### Overview

The CRM is Maya's operational view of every member; the unified runner profile is the member-owned record underneath it. One person, one profile per club, aggregating identity, membership, activity, attendance, events, and (over time) purchases, challenges, and more — with the brief's rule enforced in the data model: **data belongs to the club and is shared only with member consent.** The consent scopes UI is part of this feature: what Maya sees of Leo is a strict function of what Leo granted.

### User stories

- As **Maya (Organizer)**, I want a searchable, filterable member list (status, membership, tags, last seen, attendance), so that I can answer "who hasn't shown up in 6 weeks?" in seconds.
- As **Maya**, I want a member detail view showing timeline (joined, attended, paid, posted), so that every conversation starts with context instead of archaeology.
- As **Maya**, I want to add private staff notes and tags, so that "recovering from injury — check in gently" travels with the person, not with my memory.
- As **Maya**, I want saved segments ("lapsed 30 days", "new this month"), so that the same filters power future messaging and automations.
- As **Leo (Member)**, I want to claim and edit my own profile, so that my name, photo, and emergency contact are mine to control.
- As **Leo**, I want a consent screen that says in plain words what the club can see, defaulting to conservative, so that sharing my running data is my choice, made scope by scope.
- As **Leo**, I want to change or revoke any scope later and see the effect immediately, so that consent is a living control, not a signup ritual.
- As **Priya (Chapter lead)**, I want my staff view to respect my role's permissions, so that I see attendance and profiles but not finance data.

### Functional requirements

1. **Member list:** virtualized table (450+ rows smooth), search (name/email/phone), filters (status: provisional/member/lapsed/alumni; membership plan/state; tags; joined date range; last-attended range), sort, multi-select bulk actions (tag, invite, export CSV). Default saved views: All, New this month, Lapsed 30+ days, Provisional.
2. **Member detail:** header (photo, name, pronouns opt., status, membership badge, consent-scope indicators), tabs: **Overview** (key stats: events attended, last seen, member since, activity summary *if consented*), **Timeline** (unified chronological events: joined, RSVPs, check-ins, payments, posts, notes), **Profile** (fields), **Notes** (staff-only, attributed, timestamped), **Consent & data** (staff-facing read-only view of granted scopes — never editable by staff).
3. **Unified runner profile (data model v1):** identity (name, photo, contacts), membership (plan, state, since), activity (from connectors, consent-gated), attendance (check-ins), events (RSVPs), emergency/medical (consent-gated `health.medical`), tags, notes, source attribution. Schema reserves the brief's full profile surface (purchases, challenges, volunteer hours, community score, LTV…) as nullable extensions — additive, no migration rewrites later.
4. **Consent scopes UI (member-facing):** during profile claim and afterwards in Settings → Privacy, per the canonical scopes:
   - `profile.basic` — name, photo, contact visibility to club staff. *(Required to be a member; granted at claim with explicit notice.)*
   - `activity.summary` — weekly distance, run count, PBs. Default **off**.
   - `activity.detailed` — individual activities: pace, routes, splits. Default **off**; requires `activity.summary`.
   - `health.medical` — medical notes, emergency info visibility to organizers at events. **Always opt-in**, extra confirmation step.
   - `location.live` — live location during events. **Off**; MVP shows it as "coming soon — you'll decide then" (no live-location feature ships in MVP, but the scope model includes it).
   - `marketing.brands` — brand campaign eligibility. **Always opt-in**; MVP copy explains no brand features exist yet ("nothing is shared today; this is your future setting").
   - `photos.appearances` — being tagged in club photos/content. Default **off**.
   - Each scope: plain-language description, "who sees this" line, example, toggle. Changes apply immediately and are audit-logged (who, what, when, prior value).
5. **Enforcement:** consent is enforced at the API layer (field-level filtering by scope), not the UI. Staff views render "Not shared — [member] hasn't granted this" states rather than blanks. Revocation hides data from staff views immediately; underlying member-owned data is retained for the member.
6. **Segments (saved filters):** name + filter definition; live count; usable as messaging audience (F6). Dynamic (recomputed at use), not snapshots.
7. **Member self-service:** edit profile fields, photo, emergency contact, consent scopes; download-my-data (JSON export, jobbed); leave club (soft-delete to alumni, consent scopes auto-revoked); delete-my-data request (30-day grace, then anonymize per privacy policy).

### Acceptance criteria

**CRM list & detail**
- Given a club with 450 members, when Maya opens the member list, then first meaningful paint of rows < 1 s and scrolling stays at 60 fps (virtualized).
- Given Maya filters `last attended > 42 days ago` AND `membership = active`, then the list, count, and export all reflect the compound filter, and she can save it as a segment in ≤ 2 clicks.
- Given Maya bulk-selects 40 members and applies tag "marathon-2026", then all 40 are tagged in one operation and the timeline of each records the tag addition.
- Given a member detail view, when Leo has granted only `profile.basic`, then the Overview shows identity/membership/attendance but the activity block renders the "Not shared" state — never zeros that could be mistaken for data.
- Given a staff note is written by Priya, when another staff member views it, then it shows author + timestamp; when Leo views his own profile, then **no notes tab exists** (notes are never member-visible).
- Given Priya holds the Organizer role, when she opens a member's detail, then finance tab/fields are absent (not disabled — absent), per role permissions.

**Consent scopes**
- Given Leo claims his profile via invite link, when he reaches the consent step, then `profile.basic` is presented as required-with-notice and all other scopes default off, with `health.medical` and `marketing.brands` requiring an extra explicit confirmation if enabled.
- Given Leo enables `activity.detailed` without `activity.summary`, when he toggles it, then `activity.summary` is auto-enabled with an inline explanation (dependency made visible, not silent).
- Given Leo revokes `activity.summary` at 14:00, when Maya refreshes his profile at 14:00:05, then activity data is gone from her view and the API returns no activity fields for staff callers (verified at API layer, not UI).
- Given Leo revokes a scope, when he views his own profile, then his own data remains fully visible to him (revocation affects club visibility, not member ownership).
- Given any scope change, when it commits, then an immutable audit record exists (member, scope, old→new, timestamp) and is visible to the member in Settings → Privacy → History.
- Given a staff member of any role, when they view the Consent & data tab, then scopes are read-only — no staff-side toggle exists anywhere in the product.
- Given Leo granted `health.medical`, when an Organizer views him in an event's check-in context, then emergency contact + medical notes are visible with a "shared by member — event use only" banner; when viewed by Content or Read-only roles, then they are not visible (role ∩ consent, both required).

**Self-service & lifecycle**
- Given Leo requests "download my data," when the job completes (< 15 min), then he receives a signed, expiring link to a JSON export covering all data categories including audit history.
- Given Leo leaves the club, when he confirms, then his status becomes alumni, all consent scopes revoke, he disappears from member-facing surfaces, and staff see an alumni record with historical attendance (aggregate history is club operational data) but no profile fields beyond name.
- Given Leo requests deletion, when 30 days pass without cancellation, then his personal fields are anonymized ("Departed member"), payments records are retained per financial-compliance rules, and the deletion is logged.
- Given a member exists in two clubs (post-MVP scenario guard), when schemas are reviewed, then consent scopes are stored **per-club** (per brief: member-controlled, per-club) — a grant to Lagos Road Runners never leaks to another club.

**Edge cases**
- Given two staff edit the same profile field concurrently, when the second saves, then last-write-wins with a conflict toast showing the other editor's change (no silent loss).
- Given a provisional contact (never claimed), when staff view them, then only imported fields show, with a "hasn't joined yet — data from import" banner and no consent indicators (nothing was granted).
- Given a member with no email (phone-only), when Maya triggers any email action on them, then the UI excludes them with a visible count and reason.

### Non-functional requirements

- Field-level consent filtering enforced in one middleware layer with 100% test coverage of scope × role matrix (property-based tests).
- P95 member-list query < 300 ms at 2,000 members/club (Pro-tier headroom); search via Postgres trigram index.
- Audit log append-only (no update/delete grants on the table).
- WCAG 2.1 AA on list and consent UI; consent screens readable at grade-8 reading level (copy review required).

### Analytics events

`member_profile_claimed`, `member_profile_updated`, `consent_scope_changed` (scope, granted:boolean — never the data itself), `crm_search_performed`, `segment_created` / `segment_used` (context), `staff_note_added`, `member_left_club`, `data_export_requested`, `deletion_requested` / `deletion_completed`, `bulk_action_performed` (action, count).

### Permissions & consent touchpoints

- List/detail read: all staff roles except where fields are gated (Finance data → Owner/Admin/Finance; medical → Owner/Admin/Organizer/Coach **and** `health.medical` granted).
- Notes: create/read Owner/Admin/Organizer/Coach; Read-only sees none.
- Consent UI is member-only; the entire scope model per canonical brief §9 is implemented here and consumed by F3 (medical at check-in), F5 (activity gating), F6 (messaging identity).

### Out of scope (MVP)

Community score & LTV display (H2/H3), volunteer management, coach training notes, custom fields, custom roles (Pro+, H3), cross-club member identity graph, member-to-member profile visibility settings beyond feed basics (F6 covers feed identity).

---

## F3 — Event builder + registration + QR check-in

**Surface:** Events. **Tier:** all tiers (paid registrations subject to ticket fees: 2% + $0.30 on Starter/Club).

### Overview

Events are the heartbeat of a running club and the highest-frequency staff workflow. Maya builds an event in under 3 minutes, members RSVP in two taps, and on a cold Saturday morning check-in works instantly — **including with no connectivity** — via QR scan. Check-ins are the ground truth for attendance, the activation metric, Pacer's future training data, and the verified-audience claim that Partners monetizes in H3.

### User stories

- As **Maya (Organizer)**, I want to create a recurring Saturday run once, so that 52 events exist without 52 forms.
- As **Maya**, I want event types (group run, race, social, workshop) with sensible defaults, so that setup is fast and reporting is comparable.
- As **Maya**, I want capacity limits with a waitlist that auto-promotes, so that popular sessions manage themselves.
- As **Maya**, I want a waiver attached to events, signed once per version per member, so that liability is handled without paper.
- As **Maya**, I want a check-in mode on my phone that scans member QR codes and works offline, so that 120 people get checked in at a park with one bar of signal.
- As **Maya**, I want live attendance counts and a post-event summary, so that I know what happened without counting heads.
- As **Leo (Member)**, I want to RSVP in two taps from the feed or my phone, and get my QR pass, so that turning up is the only hard part.
- As **Leo**, I want event reminders and the meeting-point map, so that I never show up at the wrong gate again.
- As **Priya (Chapter lead)**, I want to run check-in as an Organizer on my own device simultaneously with Maya, so that two lines move at once.

### Functional requirements

1. **Event builder:** title, type (group run / race / social / workshop / other), description (rich text), date/time + timezone, duration, location (place search + pin + meeting-point note), capacity (optional), visibility (public = on club page / members-only), cover image, pace groups (optional labels), waiver requirement (select a club waiver), paid ticket toggle (price → F4 payment rails), RSVP deadline (optional). Draft → publish states; edit after publish with "notify registrants?" prompt for material changes (time, location, cancellation).
2. **Recurrence:** weekly/biweekly/monthly patterns, end-by date or count (≤ 52 instances materialized); edits offer "this event / this and future / all."
3. **Registration/RSVP:** members: 2-tap RSVP (going / can't go) from web, club page, or (H2) app; guests on public events: name + email lightweight registration, flagged as guest and convertible to member later. Capacity full → waitlist join; auto-promote in join order on spots opening, with notification and a claim window of 4 h (configurable) before passing to next.
4. **Waivers:** club waiver documents (versioned, rich text). First RSVP to a waiver-gated event requires signature (typed name + checkbox, timestamped, IP-logged); signature persists per waiver version; new version → re-sign on next RSVP. Signed waivers exportable per event (PDF).
5. **Member QR pass:** stable per-member-per-club signed QR (rotating signature, 24 h validity window refreshed on load) in web profile and (H2) app wallet; also embedded in reminder email. One QR works for all the club's events — check-in resolves the event contextually.
6. **Check-in mode (staff PWA):** full-screen scanner (camera) + manual search fallback (name list with tap-to-check-in), running counter (checked-in / registered / walk-ins), walk-in add (creates guest or matches member), undo. Multiple staff devices concurrently.
7. **Offline check-in:** check-in mode pre-caches the event roster + QR verification keys on open (or on explicit "prepare for offline"). Offline: scans validate against cached signed payloads, queue locally (IndexedDB), visibly marked "will sync." On reconnect: sync with dedup (same member checked in on two offline devices = one check-in, first-timestamp wins). Cache TTL 24 h.
8. **Emergency info at check-in:** for members with `health.medical` granted, a discreet indicator in check-in mode opens emergency contact/medical notes (Organizer/Coach/Owner/Admin only, access audit-logged) — the brief's "emergency/medical (consented)" capability.
9. **Live attendance & post-event:** organizer dashboard tile with live count during event window; post-event summary (attended, no-show rate, first-timers, walk-ins) on the event page; attendance writes to member timelines (F2).

### Acceptance criteria

**Builder & recurrence**
- Given Maya creates a "Saturday Long Run" weekly recurring event with 30 instances, when she publishes, then 30 instances exist, each independently editable, and the club page shows the next upcoming ones.
- Given Maya edits the time of one instance choosing "this and future," then earlier instances are untouched, that and later instances update, and registrants of changed instances get the notify prompt flow.
- Given Maya cancels a published event with 40 registrants, when she confirms (typed confirmation), then registrants are notified, RSVPs marked cancelled-by-club, paid tickets auto-refund via F4, and the event shows "Cancelled" (never deleted).
- Given an event in draft, when a member somehow hits its URL, then a 404-equivalent "not available" renders (drafts leak nothing).

**Registration, capacity, waitlist**
- Given a members-only event, when a logged-out guest opens it, then they see a join-the-club prompt, not an RSVP.
- Given capacity 50 with 50 going, when Leo RSVPs, then he joins the waitlist at a shown position, and `waitlist_joined` fires.
- Given a going member cancels, when the spot opens, then waitlist #1 is notified and holds a 4 h claim window; if unclaimed, the spot passes to #2 and #1 is marked lapsed-claim.
- Given two members RSVP simultaneously for the last spot, when both submit, then exactly one gets the spot (DB-level constraint) and the other lands on the waitlist with a clear message — never an error page.
- Given the RSVP deadline passed, when Leo tries to RSVP, then the action is disabled with the deadline shown, and walk-in remains possible at check-in.

**Waivers**
- Given Leo's first RSVP to a waiver-gated event, when he taps Going, then the waiver interposes; declining aborts the RSVP (no partial state).
- Given Leo signed waiver v1 and the club publishes v2, when he RSVPs to the next gated event, then v2 interposes; his v1 signature history is retained.
- Given a guest registers for a public waiver-gated event, then the waiver applies to guests identically.
- Given Maya exports waivers for an event, then the export contains signer name, timestamp, waiver version and text hash for every registrant — and no non-registrant data.

**QR & check-in (online)**
- Given Leo shows his QR from the reminder email, when any staff device scans it, then check-in confirms in < 1 s with name + photo flash for visual verification.
- Given a QR from a member of *another* club, when scanned, then it is rejected "not a member of this club" (signature namespace per club).
- Given Leo was already checked in, when scanned again, then the device shows "already checked in at 08:03" (no duplicate, no error tone drama).
- Given a walk-in who is a lapsed provisional contact, when staff add them by name, then the check-in links to the existing record and flags them "walk-in".
- Given two staff devices checking in simultaneously, then counters converge on all devices within 5 s of each scan.
- Given a member with `health.medical` granted, when checked in by an Organizer, then the discreet indicator is available and every open of the medical panel writes an audit record; given the scanning staff is Content-role (shouldn't run check-in anyway — mode requires Organizer+), then check-in mode itself is inaccessible.

**Offline check-in**
- Given Maya opened check-in mode on Wi-Fi and lost all connectivity at the park, when she scans 120 QRs offline, then every scan validates locally in < 1 s, shows "queued — will sync," and the local counter increments.
- Given the same member scanned on two offline devices, when both reconnect, then exactly one check-in exists with the earlier timestamp; the second device shows a reconciliation note.
- Given a QR whose signature window expired (> 24 h old cache on member side), when scanned offline, then staff see "can't verify offline — use name search," and manual check-in queues normally.
- Given the device battery dies mid-queue, when check-in mode reopens, then the queued check-ins persist (IndexedDB) and sync on next connectivity.
- Given connectivity flaps (offline → online → offline), when syncing, then partial syncs are idempotent and no check-in is lost or duplicated (server dedup on `event_id + member_id`).
- Given a roster change after cache (new RSVP while device offline), when an uncached member's valid QR is scanned offline, then the scan validates by signature alone, queues with "not on cached roster — verify name," and reconciles on sync.

**Live attendance & summary**
- Given an event ends, when Maya opens it next morning, then the summary shows attended / registered / no-show rate / first-timers / walk-ins, and each attendee's timeline (F2) shows the check-in.

### Non-functional requirements

- Check-in scan-to-confirm P95 < 1 s online and offline; scanner works in low light (torch toggle).
- Check-in PWA functions on 3-year-old mid-range Android; camera permission fallback to manual search.
- QR signatures: per-club key, HMAC, rotated; offline validation requires no member PII in the QR payload (opaque member token only).
- Event pages (public) LCP < 2.5 s on 4G; SSG with revalidation.
- All times timezone-explicit; DST-crossing recurrences keep local wall-clock time.

### Analytics events

`event_created` (type, recurring, paid, capacity_set), `event_published` / `event_cancelled`, `event_rsvp` (going|cant_go|guest), `waitlist_joined` / `waitlist_promoted` / `waitlist_claim_lapsed`, `waiver_signed` (version), `checkin_mode_opened` (offline_prepared), `member_checked_in` (method: qr|manual|walkin, offline:boolean), `checkin_synced` (queued_count), `medical_info_viewed` (audit mirror), `event_summary_viewed`.

### Permissions & consent touchpoints

- Create/edit/publish events: Owner, Admin, Organizer; Content may draft but not publish; Coach may view rosters.
- Check-in mode: Owner, Admin, Organizer, Coach.
- Medical panel: Organizer+ **and** member's `health.medical` grant; every access audit-logged (F2 rules).
- Public events expose only: event details + aggregate count — never attendee identities to non-members.
- `location.live` is **not** used in MVP (no live tracking); meeting point is static club data.

### Out of scope (MVP)

Routes library, pacer assignment, equipment tracking, weather integration, live location tracking, ticketing seat classes / promo codes, multi-day events, external calendar 2-way sync (ICS download only in MVP), kiosk self-check-in mode, SMS reminders (email + push-later only).

---

## F4 — Memberships & payments

**Surface:** Money. **Tier:** all tiers; platform fee varies (Starter 2%, Club 1%, Pro 0.5% per canonical pricing; ticket fees 2% + $0.30 per paid registration on Starter/Club).

### Overview

Money is where RunOS shifts from convenient to indispensable — and how monetization aligns with club success. Clubs define membership plans; members pay by card/local methods via **Stripe Connect destination charges with the club as merchant of record**; RunOS takes the application fee per tier. Includes club payout onboarding, recurring billing, dunning basics, and the finance view Maya's treasurer actually trusts. Event ticket payments (F3) ride the same rails.

### User stories

- As **Maya (Organizer)**, I want to connect my club's bank account through a guided flow, so that payouts work without me learning what KYC means.
- As **Maya**, I want to create membership plans (annual, monthly, student), so that our real-world pricing maps 1:1 into RunOS.
- As **Maya**, I want members' payment status visible in the CRM, so that "who's paid?" stops being a spreadsheet reconciliation night.
- As **Maya**, I want failed payments retried and members nudged automatically, so that involuntary churn doesn't require me to chase anyone.
- As **Maya (or her Finance-role treasurer)**, I want a finance view of charges, fees, refunds, and payouts, so that the books close in minutes.
- As **Leo (Member)**, I want to join a plan and pay in under a minute with my saved card, and manage/cancel it myself, so that membership feels like a subscription, not a bank transfer to a stranger.
- As **Leo**, I want receipts automatically, so that expense claims are painless.

### Functional requirements

1. **Club payment onboarding:** Stripe Connect account creation via Stripe-hosted onboarding; status tracking (pending / restricted / active) with plain-language guidance; **degraded mode** — clubs can create plans and events before activation; checkout is disabled with "payments activating" messaging until active.
2. **Membership plans:** name, price, currency (club's currency, one per club in MVP), interval (monthly / annual / one-time season), description/benefits list, member cap per plan (optional), visibility (public/hidden), grace period on failure (default 7 days), proration **off** in MVP (plan changes take effect at renewal). Archive (no new joins, existing continue).
3. **Checkout:** Stripe Checkout (hosted) with destination charge to the club's connected account + application fee per tier; supports card + local payment methods Stripe offers in the club's country; saved payment method for renewals; guest checkout not allowed for memberships (must claim/hold member profile — links payment to person).
4. **Subscription lifecycle:** active → past_due (failed payment) → grace → lapsed → cancelled; member-initiated cancel (end of period), staff-initiated cancel/comp (comped = active without billing, labeled); reactivation.
5. **Dunning basics:** on failure — Stripe smart retries (up to 4 over 14 days) + RunOS emails at fail day 0, 3, 7 ("update your card" link to Stripe billing portal); status surfaces in CRM (past_due badge) and member's own view; auto-lapse at grace end with notification to member and a digest to staff.
6. **Refunds:** full or partial refund per charge by Owner/Admin/Finance with reason; application fee refunded proportionally per Stripe rules; ticket refunds triggered automatically by event cancellation (F3).
7. **Finance view:** transactions table (charge, member, plan/event, gross, Stripe fee, RunOS platform fee, net), payout list with drill-down to composing charges, monthly summary (MRR-equivalent for club, new/lost members by plan), CSV export. Every number labeled and reconciles to Stripe dashboard.
8. **Platform fees:** application fee computed per club tier at charge time (Starter 2% / Club 1% / Pro 0.5%); ticket fee 2% + $0.30 per paid registration on Starter/Club; fee schedule versioned so tier changes never retro-apply.
9. **Webhook processing:** all state changes driven by Stripe webhooks (idempotent consumers, outbox pattern, replay-safe); UI never trusts client-side redirect alone.

### Acceptance criteria

**Onboarding & degraded mode**
- Given a new club, when Maya starts payment setup, then she's routed through Stripe-hosted onboarding and returns to a status page reflecting Stripe's real state within 30 s of webhook receipt.
- Given onboarding is `restricted` (missing document), then Maya sees which requirement is missing in plain language with a "resolve on Stripe" link — never a raw error code.
- Given payments are not active, when a member views a plan, then a "payments activating — leave your interest" state renders and interested members are queued and notified when checkout opens.

**Plans & checkout**
- Given Maya creates "Annual — ₦25,000/yr", when published, then it appears on the club page join flow and member app with formatted local currency.
- Given Leo checks out on Club tier at $79-tier fee schedule, when payment succeeds, then: the charge lands on the club's connected account minus a 1% application fee, Leo's membership is active, his CRM record shows the plan, a receipt email sends, and all of this survives Leo closing the browser before redirect (webhook-driven).
- Given Leo's card is declined at checkout, then he sees Stripe's actionable message and no membership state is created.
- Given a plan with cap 100 at 100 active members, when the 101st attempts checkout, then checkout is blocked pre-Stripe with a waitlist-interest option.
- Given a club on Starter (2%), when it upgrades to Club mid-month, then charges after the upgrade moment use 1% and earlier charges are untouched (versioned fee schedule).

**Lifecycle & dunning**
- Given Leo's renewal fails, when the webhook arrives, then status = past_due, the day-0 email sends with a billing-portal link, CRM badge appears, and Stripe retries proceed.
- Given Leo updates his card on day 2, when the retry succeeds, then status returns to active, dunning emails stop, and the timeline records the recovery.
- Given all retries fail and the 7-day grace ends, then status = lapsed, Leo is notified, staff digest includes him, and member-only surfaces treat him per club policy (member remains, membership benefits flagged lapsed — access rules are club-config later; MVP just flags).
- Given Leo cancels mid-period, then membership stays active to period end (shown date), auto-renew is off, and he can reactivate before period end in one click.
- Given Maya comps a scholarship member, then the member shows active with a "comped" label and $0 in finance reporting (never inflates revenue).

**Refunds & finance**
- Given Maya refunds ₦10,000 of a ₦25,000 charge, then the member gets a partial refund + email, finance view shows the negative entry, and the application fee is proportionally reversed.
- Given a cancelled paid event (F3) with 40 paid registrants, then 40 refunds process automatically with per-refund status visible and a completion digest to staff; any individual refund failure is listed with a retry action.
- Given the treasurer (Finance role) opens the finance view for March, then gross, Stripe fees, RunOS fees, refunds, and net reconcile exactly to the Stripe dashboard for the same period (integration test with Stripe test clocks).
- Given a webhook is delivered twice (Stripe at-least-once), then processing is idempotent — no duplicate memberships, emails, or ledger rows.
- Given webhooks are delayed 10 minutes, then the checkout success page shows "confirming payment…" (pending state), never a false failure.

**Permissions**
- Given a Content-role staffer, when they open Money, then the surface is not accessible; given Finance role, then they see finance + refunds but cannot edit plans or Stripe settings (Owner/Admin only).

### Non-functional requirements

- PCI scope: SAQ-A (Stripe-hosted checkout/portal only; RunOS never touches PANs).
- Money amounts stored as integer minor units + currency; no floats anywhere in money paths (lint-enforced).
- Ledger rows immutable append-only; corrections are new entries.
- Webhook consumer P95 < 2 s; failed webhooks alarm within 30 minutes for the on-call.
- All money mutations audit-logged with actor; refunds require typed amount confirmation.

### Analytics events

`payments_onboarding_started` / `payments_activated`, `plan_created` / `plan_archived`, `checkout_started` / `checkout_completed` / `checkout_failed` (plan|ticket, amount, currency), `membership_activated` / `membership_past_due` / `membership_recovered` / `membership_lapsed` / `membership_cancelled` (initiator), `membership_comped`, `refund_issued` (full|partial, auto|manual), `dunning_email_sent` (day), `finance_export_generated`.
*(Amounts in analytics are aggregates-safe; no card data ever.)*

### Permissions & consent touchpoints

- Stripe settings + plan management: Owner, Admin. Refunds + finance view: Owner, Admin, Finance. Read-only sees summary tiles only.
- Payment status visibility in CRM follows staff roles (Finance data gated per F2).
- Members always see their own full payment history and manage their own billing; no consent scope gates a member's own money data.
- Financial records retained per statutory requirements even after member deletion (F2 deletion carve-out, disclosed in privacy policy).

### Out of scope (MVP)

Invoices & budget module (H3), multi-currency per club, proration & mid-cycle plan changes, discount/promo codes, family/duo plans, cash/offline payment recording (H2 candidate), payouts scheduling controls (Stripe defaults), tax handling beyond Stripe defaults (Stripe Tax in H5), merchandise (H3, Shopify).

---

## F5 — Strava connector & activity normalization

**Surface:** Platform (integrations) + Community (profile data). **Tier:** all tiers.

### Overview

The Strava connector is the first proof of the data-layer moat: members connect once, and their running life flows into their unified runner profile — normalized into the canonical `activities` schema that every future connector (Garmin, Apple Health, COROS, Polar, Suunto, Fitbit, TrainingPeaks, Zwift…) will share. What the *club* sees is governed strictly by consent scopes: `activity.summary` and `activity.detailed`. Dedup ensures the same run arriving from two sources (later horizons) counts once. This feature is member-value-first: Leo connects for challenges and recognition; Maya gets consented insight; Pacer gets its future training data.

### User stories

- As **Leo (Member)**, I want to connect Strava in two taps via OAuth, so that my runs show up in my club profile without manual logging.
- As **Leo**, I want to choose exactly what my club sees — summary stats vs. detailed activities — and change my mind anytime, so that connecting doesn't mean surrendering.
- As **Leo**, I want my recent history (last 90 days) backfilled on connect, so that my profile isn't empty on day one.
- As **Leo**, I want to disconnect and know precisely what happens to my data, so that leaving is as clean as joining.
- As **Maya (Organizer)**, I want consented activity summaries in the CRM ("ran 3× this week"), so that I can spot the quietly-fading member before they're gone.
- As **Maya**, I want club-level aggregate stats (weekly km, active runners), so that I can celebrate the community's collective effort — even including non-consented members in *anonymous aggregate counts only*.

### Functional requirements

1. **OAuth connect:** Strava OAuth (scopes: `read,activity:read`) from member Settings → Connections; per-member tokens (encrypted at rest), refresh handling, revocation detection. Connect flow immediately continues into the consent step: connecting Strava **requires** choosing club-sharing level (`activity.summary` on/off, `activity.detailed` on/off) — connection without any club sharing is valid (member-private mode: data powers only the member's own view + anonymous aggregates).
2. **Ingestion:** Strava webhook subscription (activity create/update/delete + athlete deauth) as primary; polling fallback (BullMQ scheduled, respects rate limits) for webhook gaps; 90-day backfill on connect (paged, rate-limit-aware, queued).
3. **Canonical `activities` schema (v1):** `id`, `member_id`, `club_id`, `source` (strava|manual|…), `source_activity_id`, `sport_type` (run|trail_run|walk|other kept but non-run excluded from run stats), `started_at` (+tz), `elapsed_s`, `moving_s`, `distance_m`, `avg_pace_s_per_km`, `elevation_gain_m`, `is_race`, `name`, `polyline` (detailed-only), `splits` (detailed-only), `raw_ref` (S3 pointer to source payload), `dedup_key`, `visibility_computed`. Additive-safe for future providers.
4. **Normalization rules:** unit conversion to metric canonical; pace computed from moving time; timezone from activity, fallback member profile; treadmill/virtual runs flagged; manual Strava entries ingested but flagged `source_subtype=manual`; absurd-value guards (pace < 2:00/km or distance > 400 km → flagged `quarantined`, excluded from stats, visible to member with "looks off — include anyway?").
5. **Deduplication:** `dedup_key` = member + started_at (±90 s window) + distance (±2%) + sport; first-write wins, later duplicates linked not duplicated; source priority order config (for H2 multi-source: Garmin > Strava > Apple Health for the same physical run — priority applied when a higher-priority duplicate arrives, stats recompute). Updates/deletes from Strava propagate (edit updates fields; delete tombstones and recomputes).
6. **Consent filtering (the hard rule):** club-facing reads resolve through the F2 consent layer:
   - No scope → staff see nothing individual; member's data still contributes to **anonymous aggregate club counts** (count of active runners, total km — no names, minimum group size 10 to display).
   - `activity.summary` → staff see rolling summaries (weekly runs, distance, longest run, PB flags) — no individual activities, no routes, no timestamps beyond week granularity.
   - `activity.detailed` → staff see individual activities with pace/date/name; **polylines/routes and start locations are excluded from staff view in MVP** regardless of scope (route data is member-private until a considered routes feature ships).
   - Scope revocation triggers immediate recompute of staff-visible materializations (≤ 60 s).
7. **Member experience:** activities list + weekly summary in own profile; connection health (last sync, reconnect prompt on token failure); disconnect flow with explicit choice — "remove my synced data from the club" (default) or "keep contributed history" — and clear copy on each.
8. **Club aggregate widget:** dashboard tile — this week: active runners, total km, top distance (only among consented members for named stats; anonymous totals include all, threshold ≥ 10).

### Acceptance criteria

**Connect & consent**
- Given Leo taps Connect Strava, when OAuth succeeds, then he lands on the sharing-level step with both scopes defaulted **off** and clear copy per scope; completing with both off still finishes the connection (member-private mode).
- Given Leo denies OAuth on Strava's side, then he returns to Connections with a neutral "connection not completed" state (no error drama, no partial record).
- Given Leo enables `activity.detailed`, then `activity.summary` auto-enables with inline explanation (dependency, mirrors F2).
- Given the connection succeeds, then 90-day backfill queues and Leo sees a progress note ("importing your last 3 months…") that resolves without a page refresh when done.

**Ingestion & normalization**
- Given Leo finishes a run on Strava, when the webhook arrives, then the activity appears in his RunOS profile within 60 s, normalized (metric, pace computed, timezone correct).
- Given Leo edits the run's title/distance on Strava, then the RunOS copy updates within 5 minutes; given he deletes it, then it tombstones and his weekly stats recompute.
- Given a ride (sport=Ride), then it is stored but excluded from run stats and run-based surfaces.
- Given an activity with pace 1:30/km, then it quarantines: excluded from stats and staff views, visible to Leo with an include-anyway override.
- Given Strava webhooks are down for 6 h, then polling fallback backfills the gap with zero duplicates (dedup_key), and an ops alert fired at 30 min of webhook silence.
- Given Strava rate limits hit during backfill, then the job backs off per headers and resumes; total backfill for a 90-day/100-activity athlete completes < 30 min under normal limits.

**Dedup**
- Given the same physical run arrives twice from Strava (webhook replay + poll), then exactly one activity exists.
- Given (H2 scenario, tested now via fixture) a Garmin copy of an existing Strava run arrives with higher source priority, then the Garmin version becomes canonical, the Strava one links as duplicate, and weekly stats change by zero.
- Given two genuinely distinct runs 20 minutes apart same day, then both persist (window is ±90 s, not same-day).

**Consent filtering**
- Given Leo has no activity scopes granted, when Maya opens his profile, then the activity area shows the "Not shared" state; when the API is called directly with staff auth, then activity fields are absent from the response (enforced server-side, integration-tested).
- Given `activity.summary` only, when Maya views Leo, then she sees weekly rollups and PB badges but no individual activity rows; the CRM filter "active runners this week" includes him.
- Given `activity.detailed`, when Maya views Leo's activities, then no polyline/route/start-location data is present in any staff-facing payload (contract test).
- Given Leo revokes `activity.summary` at 09:00, when any staff surface loads at 09:01, then his individual/summary data is gone; the anonymous aggregate tile still counts him; and his own profile view is unchanged.
- Given the club has 8 members with connected sources, when the aggregate tile would render, then it shows "not enough runners yet to show stats" (threshold 10).

**Disconnect & deauth**
- Given Leo disconnects choosing "remove my synced data," then all his activities (and links) delete, staff/aggregate stats recompute, and the S3 raw payloads delete within 24 h.
- Given Leo revokes access from Strava's own settings, when the deauth webhook arrives, then RunOS marks the connection revoked, stops syncing, notifies Leo, and applies his last on-record data preference.
- Given a token refresh fails permanently, then the connection shows "needs reconnecting" in Leo's settings with a one-tap fix and no staff-visible error.

### Non-functional requirements

- Strava API budget: stay < 80% of rate allocation at 25k connected members (per-endpoint budget doc + load test); global concurrency limiter on the connector worker pool.
- Tokens: AES-encrypted at rest, per-member, never logged; raw payloads in S3 with 30-day lifecycle unless activity retained.
- Webhook endpoint: verified per Strava spec, idempotent, P95 processing < 2 s.
- Consent × visibility matrix has 100% automated coverage (same property-test harness as F2).
- Connector is provider-abstracted behind an `ActivityProvider` interface — adding Garmin (H2) must require no changes to normalization, dedup, or consent layers (architecture test: the interface is the only Strava import in core modules).

### Analytics events

`connector_connected` / `connector_disconnected` (provider, data_removed:boolean), `connector_reauth_required`, `activity_ingested` (provider, sport, backfill:boolean — no distance/pace payloads), `activity_deduplicated` (providers), `activity_quarantined`, `backfill_completed` (count, duration), `aggregate_tile_viewed`, `consent_scope_changed` (mirrored from F2 when scope ∈ activity.*).

### Permissions & consent touchpoints

- Connect/disconnect: member-only, always. Staff cannot connect on a member's behalf, ever.
- Staff visibility: strictly `activity.summary` / `activity.detailed` per F2 enforcement layer; roles alone grant nothing.
- Anonymous aggregates: k-threshold ≥ 10 in-club (network-level k ≥ 50 rule arrives with network intelligence, H3).
- Data deletion on disconnect honors the member's explicit choice; deauth-via-Strava applies stored preference and confirms by email.

### Out of scope (MVP)

Garmin, Apple Health and all other connectors (H2+); GPX/manual activity upload (H2 candidate); routes library & maps display; segments/efforts; kudos/comments ingestion; posting *to* Strava; club Strava-account ingestion; training load / fitness scores; challenge integration (H2 challenges will consume this schema).

---

## F6 — Community feed + messaging basics

**Surface:** Community. **Tier:** all tiers.

### Overview

The feed is the club's front porch — the reason Leo opens RunOS between events — and messaging is Maya's megaphone with delivery she can finally see. MVP is deliberately "feed light" per the roadmap: organizer announcements, event threads, member posts with basic composer, reactions and comments, plus targeted announcements to segments with email fan-out and (web) push. It must be better than WhatsApp at exactly two things — signal (structured, searchable, tied to events) and reach measurement — while linking out to WhatsApp gracefully rather than fighting it.

### User stories

- As **Maya (Organizer)**, I want to post announcements pinned to the top of the feed and pushed to members' email/notifications, so that "race registration closes Friday" reaches everyone, not the 40% who scrolled past it in WhatsApp.
- As **Maya**, I want to send an announcement to a segment (F2) — e.g., "lapsed 30 days" — so that outreach is targeted, not broadcast spam.
- As **Maya**, I want to see reach (delivered/opened) per announcement, so that I know what landed.
- As **Maya**, I want every event to have its own thread, so that "where exactly do we meet?" has one home instead of fifty group-chat scrolls.
- As **Leo (Member)**, I want a feed of my club's life — announcements, event threads, member posts — so that belonging has a place.
- As **Leo**, I want to post a photo from Saturday's run and react to others, so that recognition is lightweight and warm.
- As **Leo**, I want notification controls per channel and type, so that RunOS never becomes the app I muted.
- As **Priya (Chapter lead)**, I want to post announcements with my Organizer role, so that comms don't bottleneck on Maya.

### Functional requirements

1. **Feed:** club-scoped, reverse-chronological with pinned announcements on top; post types: **announcement** (staff), **member post** (text ≤ 2,000 chars + up to 4 images), **event card** (auto-generated on publish, RSVP inline), **event thread digest** (surfacing active threads). Infinite scroll, pull-to-refresh (web + H2 app parity).
2. **Composer:** text + image upload (client-resize, EXIF-stripped incl. GPS), @mention members (respecting F2 visibility), link previews. Posting requires `status=member`.
3. **Event threads:** every published event has a thread (comments on the event); posts in-thread surface to participants' notifications per settings; thread locked automatically 7 days post-event (read-only archive).
4. **Reactions & comments:** reaction set (👏 🔥 ❤️ 💪 😂), threaded one level (comment + replies), edit window 15 min (edited label), delete own.
5. **Announcements:** staff compose with audience picker — all members or a saved segment (F2); channels: feed (always) + email fan-out (optional toggle) + web push (optional); schedule-send; per-announcement reach panel (audience count, delivered, email opens, feed views). Quiet hours default 21:00–08:00 club-local for push (queued, not dropped).
6. **Notifications:** in-app inbox + web push (VAPID) + transactional email digests; member settings matrix: type (announcements / event threads I'm in / mentions / RSVP updates) × channel (push / email); sane defaults (announcements: all channels; threads: push only; mentions: all). Unsubscribe link in every email (marketing-law compliant); transactional (receipts, waivers, dunning) not unsubscribable, clearly separated.
7. **Moderation basics:** staff (Organizer+) can pin/unpin, delete any post/comment (reason logged, author notified), mute a member from posting (duration-based); member report button routes to staff inbox. Deleted content tombstones ("removed by organizers").
8. **WhatsApp bridge (pragmatic, not integration):** every announcement/event gets a "share to WhatsApp" deep link producing a clean summary + link back to RunOS — RunOS feeds the group chat instead of pretending it doesn't exist.

### Acceptance criteria

**Feed & posts**
- Given Leo opens the feed, when it loads, then pinned announcements render first, followed by reverse-chronological items, P95 initial load < 1.5 s.
- Given Leo posts 4 photos from Saturday's run, when uploaded, then images are resized client-side, EXIF (incl. GPS) is stripped server-verified, and the post appears in the feed immediately (optimistic) and for others within 5 s.
- Given a provisional contact (never claimed profile), then they can neither view nor post to the feed (member-only surface).
- Given Leo @mentions "Pri", when he selects Priya, then Priya gets a mention notification per her settings; given he mentions a member who left the club, then the mention renders as plain text.
- Given Leo edits his post at minute 14, then the edit saves with an "edited" label; at minute 16, then editing is unavailable (delete + repost remains possible).
- Given a member is muted for 7 days, when they try to post, then a clear notice with the end date shows; reacting remains allowed.

**Event threads**
- Given Maya publishes an event (F3), then an event card appears in the feed with inline RSVP and a linked thread.
- Given Leo comments "which gate?" in the thread, then attendees with thread notifications on get pushed, and the comment lives on the event page and the feed digest.
- Given the event ended 7 days ago, then the thread shows a locked banner and accepts no new comments.
- Given an event is cancelled, then the event card updates to cancelled state in every feed placement (no stale RSVP buttons).

**Announcements & reach**
- Given Maya composes an announcement to segment "lapsed 30+ days" (population 61) with email on, when she reviews, then the audience count (61) is shown pre-send, and after send the reach panel shows delivered/opens updating as webhooks arrive.
- Given the segment is dynamic and 3 members re-engaged between composing and sending, then send-time evaluation uses the fresh population (58) and the reach panel reflects it.
- Given push quiet hours (22:30 club time), when the announcement sends, then feed + email deliver now and push queues until 08:00.
- Given Priya (Organizer) schedules an announcement for Friday 18:00, then it publishes on time, attributed to Priya; given she deletes the schedule beforehand, then nothing sends.
- Given an email bounce for a member, then the reach panel counts it, the member's email gets flagged `bouncing` in CRM, and repeat sends skip flagged addresses with a visible count.
- Given a member unsubscribed from announcement emails, then they still see the feed post and push (per their settings) but receive no email, and the reach panel's audience math shows the split.

**Notifications & moderation**
- Given Leo turns off everything except mentions, then an announcement produces no push/email for him but appears in feed and inbox badge.
- Given a member reports a post, then staff inbox receives it with a link; given an Organizer deletes it with reason, then the author is notified with the reason, and a tombstone renders where it was.
- Given a deleted comment mid-thread, then replies remain with the tombstone as parent (thread integrity).
- Given web push permission is denied at browser level, then RunOS shows a settings hint instead of a broken toggle, and email/inbox channels are unaffected.

**Abuse & limits**
- Given a member posts 10 times in a minute, then rate limiting kicks in with a cool-down message (limits: 10 posts/hr, 60 comments/hr, configurable).
- Given an uploaded image fails content-type sniffing (fake .jpg), then upload is rejected; given > 10 MB, then rejected pre-upload with the limit stated.

### Non-functional requirements

- Feed pagination cursor-based; media via CDN with responsive srcsets; feed images lazy-loaded (LCP budget respected).
- Email via transactional provider with per-club sending identity ("Lagos Road Runners via RunOS"); SPF/DKIM/DMARC configured; deliverability monitored.
- Push: web push MVP; the notification service abstraction must accommodate Expo push (H2) without schema change.
- All content XSS-sanitized server-side; link previews fetched server-side (SSRF-guarded).
- Feed availability independent of connector/payment subsystems (module isolation in the NestJS monolith).

### Analytics events

`post_created` (type, images), `post_deleted` (by: author|staff), `reaction_added` (emoji), `comment_created` (thread_type), `announcement_sent` (audience: all|segment, channels, audience_count), `announcement_reach_viewed`, `email_delivered` / `email_opened` / `email_bounced` (announcement_id), `push_delivered` / `push_opened`, `notification_settings_changed`, `member_muted` / `content_reported`, `whatsapp_share_clicked` (object_type).

### Permissions & consent touchpoints

- Post/react/comment: members. Announcements + pin + moderation: Owner, Admin, Organizer; Content can compose/schedule but sends require Organizer+ approval? — **No:** Content may send announcements (that's the role's purpose) but cannot moderate/mute. Read-only: read.
- Feed identity uses `profile.basic` (name + photo — the membership-required scope). `photos.appearances`: when staff (Content) post club photos and tag members, tagging requires the member's `photos.appearances` grant; untagged members in photos are not identified by RunOS (no face detection in MVP or planned).
- Email/SMS-adjacent compliance: announcement emails are club-to-member communications with unsubscribe; `marketing.brands` is **not** touched by F6 (no brand content exists in MVP).
- Emergency/medical, activity, location scopes: not surfaced in feed at all.

### Out of scope (MVP)

DMs / member-to-member private messaging, group chats, SMS channel (H2 Growth OS), polls, member post scheduling, rich video upload (link embeds only), algorithmic ranking (chronological + pins only), cross-club/global feeds, Instagram auto-posting, Pacer draft assist in composer (H2), full moderation tooling (word filters, appeal flows).

---

# Next Wave One-Page Specs

*Lighter specs for the H2 wave; each graduates to a full spec (F-format above) one sprint before build.*

## W1 — Growth OS journey builder

**Overview.** Visual automation canvas in **Growth**: trigger → wait → condition → action. v1 triggers: member joined, first event attended, no attendance 30 d, membership lapsed, tag added. v1 actions: send email, send SMS, add tag, notify staff. Runs on Temporal; every journey has per-step analytics and a global per-member frequency cap.

**Key stories.**
- As **Maya**, I want a "new member welcome" journey (welcome email → wait 3 d → if no event RSVP, nudge), so that onboarding members stops depending on my memory.
- As **Maya**, I want to see where members are inside a journey and step-level conversion, so that I can fix the step that leaks.
- As **Leo**, I want communications to respect my notification settings and stop when I do the thing, so that automation never feels like spam.

**Top acceptance criteria.**
- Given a published journey, when a member meets the trigger, then they enter exactly once (idempotent per member per journey unless re-entry explicitly enabled).
- Given Leo completes the goal mid-journey (RSVPs), then he exits at the next evaluation and receives no further steps.
- Given a journey is edited while members are in-flight, then in-flight members finish on the prior version; new entrants use the new one (versioned definitions).
- Given the frequency cap (default ≤ 3 automated messages/member/week) would be exceeded, then the step defers and the journey log records why.
- Given SMS to a member without a verified phone or without SMS consent, then the step is skipped-with-reason, never errored.
- Given a journey deleted, then in-flight members exit gracefully with audit records.

---

## W2 — Event Growth Pack

**Overview.** One-toggle automation bundle attached to any event: announce (on publish) → reminder (T-48 h) → last call (T-6 h, only to non-registrants if capacity remains) → day-after recap + review ask → no-show "we missed you." Each message Pacer-draftable, Maya-editable, per-step on/off. The flagship proof that Growth OS = outcomes, not canvases.

**Key stories.**
- As **Maya**, I want to switch on the Growth Pack when publishing, so that a full promo/reminder cycle runs without me writing five messages at 11 pm.
- As **Maya**, I want the pack to report its lift (registrations, attendance vs. similar events), so that I trust it enough to leave it on.
- As **Leo**, I want reminders that carry the QR pass and meeting point, so that the message is useful, not noise.

**Top acceptance criteria.**
- Given the pack is enabled at publish, then all steps schedule relative to event time and reschedule automatically if the event time changes; cancellation cancels all pending steps and sends the cancellation notice instead.
- Given Leo registered after the announce step, then he receives reminders but never "last call" (audience rules per step: registrants vs. non-registrants).
- Given the event fills to capacity, then "last call" auto-skips.
- Given quiet hours, then push steps queue; email sends; SMS respects quiet hours strictly.
- Given the recap step, then it includes attendance stats and a photo prompt, and the review ask links a 2-tap rating whose results land on the event summary.

---

## W3 — Challenges

**Overview.** **Engage** module v1: club-created challenges — distance (200 km in October), streak (run 3×/week for 4 weeks), attendance (6 club events in 6 weeks) — powered by the canonical `activities` schema (F5) + check-ins (F3). Leaderboard, progress, completion badges on the runner profile. Joining a challenge is the flagship *contextual consent moment* for `activity.summary`.

**Key stories.**
- As **Maya**, I want to launch a monthly distance challenge with a start/end and a leaderboard, so that the club has a shared pulse between events.
- As **Leo**, I want my Strava runs to count automatically and my progress visible, so that participation is zero-effort and the badge means something.
- As **Leo**, I want joining the challenge to ask for exactly the sharing it needs (summary, not detailed), so that consent stays proportionate.

**Top acceptance criteria.**
- Given Leo joins a distance challenge without `activity.summary`, then a contextual consent ask explains "the challenge needs your weekly totals," and declining leaves him unjoined with no scope change.
- Given a quarantined activity (F5), then it never counts toward a challenge.
- Given an activity is deleted at source mid-challenge, then progress recomputes (leaderboards eventually-consistent ≤ 5 min).
- Given a tie at challenge end, then ranking ties are shared (no arbitrary ordering), and completion badges issue to all qualifiers.
- Given Leo revokes `activity.summary` mid-challenge, then his progress freezes, he's marked "paused (sharing off)," and the leaderboard excludes him from that moment.
- Given a manual Strava entry (`source_subtype=manual`), then club setting decides inclusion (default: excluded from ranked leaderboards, included in personal progress) — anti-cheat lever without accusation UX.

---

## W4 — Perks / benefits passport (v1, local)

**Overview.** **Engage**: club-sourced local benefits — Maya lists the deals she already has (café discount, physio intro rate with Emre, run-store %) — members redeem via QR/code with per-perk limits. No network, no brands: pure local value that seeds H3's Partners supply. Club-tier feature per canonical pricing.

**Key stories.**
- As **Maya**, I want to add local perks with terms and a redemption limit, so that membership visibly pays for itself.
- As **Leo**, I want a passport screen of my perks and a redemption QR, so that value is one tap away at the counter.
- As **Emre (Vendor)**, I want a simple redemption verification (scan or 6-digit code) with a monthly count, so that honoring the deal is trivial and measurable — before I ever hear the word "marketplace."

**Top acceptance criteria.**
- Given a perk limited to 1×/member/month, when Leo redeems twice in a month, then the second attempt shows "next available on {date}."
- Given a lapsed membership (F4), then perk redemption is blocked with a renew prompt (perks are the retention lever).
- Given Emre verifies a code, then verification works on his phone's browser with no account required (signed short-lived URL per perk), and Maya's perk dashboard counts it within a minute.
- Given a perk expires or is archived, then it disappears from passports and pending QR codes invalidate.
- Given redemption data, then Emre sees only counts — never member identities (aggregate-only per canonical brief §9 brand/vendor rule).

---

## W5 — Pacer content generation (Pacer v1, generation half)

**Overview.** **Intelligence**: Pacer's first surface — "draft for me" inline actions + ⌘K command bar. Generates event descriptions, announcement copy, newsletters, Instagram captions from club context (event data, recent activity, club voice settings). Anthropic Claude via API, RAG over the club's own data only. Human always edits/approves; nothing auto-sends. Metered on Starter/Club (premium AI add-on $29/mo), unlimited later on Pro.

**Key stories.**
- As **Maya**, I want "draft this event description" to produce copy in my club's voice with the facts right (date, place, distance), so that publishing stops being a writing task.
- As **Maya**, I want ⌘K → "write October newsletter" to draft from what actually happened (events, milestones, new members), so that the newsletter writes itself and I just make it mine.
- As **Priya**, I want drafts grounded in *our* club only, so that Pacer never leaks or invents another club's details.

**Top acceptance criteria.**
- Given a draft request on an event, then generated copy contains the correct date/time/location (fact-checked against the record post-generation; mismatches regenerate or flag).
- Given generation, then a visible "AI draft — review before sending" state persists until a human edits or explicitly accepts; accept/edit/discard is logged for quality metrics.
- Given club data grounding, then retrieval is scoped by `club_id` at the RAG layer (tenant isolation tested at the retrieval boundary, per canonical rule: never another club's raw data).
- Given a Starter/Club club without the AI add-on, then 10 free drafts/month with a meter and upgrade path; Pro unlimited.
- Given the model produces content referencing a member, then member names only appear if sourced from feed-public content (never from consent-gated data; contract test on the retrieval allowlist).
- Given the API is down, then drafting degrades to templates with a status note — composing is never blocked.

---

## W6 — Sponsor CRM (Partners v1, club-side)

**Overview.** **Partners**: pipeline for the sponsorships clubs already chase — sponsor records, deal stages (prospect → conversation → proposal → agreed → active → renewal), deliverables checklist (logo on page, posts, event presence), value tracking, and a Pacer-drafted proposal one-pager using club stats (member count, attendance rate, aggregate reach — anonymized numbers only). Pro-tier feature per canonical pricing; the bottom-up wedge that de-risks the H3 chicken-and-egg (see roadmap R2).

**Key stories.**
- As **Maya**, I want a pipeline of my sponsor conversations with next-step reminders, so that the local shoe store deal stops dying in my DMs.
- As **Maya**, I want a proposal one-pager generated from real club stats, so that I pitch like an org, not a hobby.
- As **Sofia (Brand)** — receiving, not using, the product yet — I want the proposal's numbers to be verifiable ("450 members, 78% avg attendance, verified by RunOS"), so that this club stands out from spreadsheet-and-hope pitches. *(Sofia's own surface, Brand Portal, is H3.)*

**Top acceptance criteria.**
- Given a sponsor deal moves to "agreed," then a deliverables checklist is required (templates provided), and each deliverable has an owner + due date feeding staff reminders.
- Given the proposal generator, then it uses only aggregate club stats (counts, rates) — a contract test asserts no member-level or consent-gated data can enter the proposal context.
- Given a deal marked active with value $2,000/season, then Partners reporting shows sponsorship value alongside deliverable completion (the seed of partnership ROI reporting).
- Given a renewal date within 60 days, then the deal auto-surfaces in a renewals view with a Pacer-drafted renewal summary of delivered value.
- Given a club downgrades from Pro, then Sponsor CRM becomes read-only (export available) — never deleted.

---

# Definition of Done & Quality Bar

*Applies to every ticket in every squad. "Done" means all of this — not "code merged."*

## Definition of Done (per ticket/feature)

1. **Acceptance criteria pass** — every Given/When/Then in the spec demonstrated, edge cases included; PM sign-off recorded on the ticket.
2. **Tests:**
   - Unit tests for logic; **integration tests for every API endpoint** touched (happy + auth + tenant-isolation cases).
   - **RLS / tenant-isolation test**: any new table or query path ships with a cross-tenant access test (attempt access with another `club_id` — must fail). No exceptions.
   - **Consent-matrix test**: any surface touching scope-gated data adds cases to the shared scope × role property-test harness.
   - E2E (Playwright) for the critical flows the ticket affects (the six golden flows: onboard, import, publish event, pay, check in, connect Strava).
   - Coverage: changed-code line coverage ≥ 80%; money paths ≥ 95%.
3. **Analytics** — events in the spec implemented, named per convention, verified in the ClickHouse dev sink; dashboards updated if the event feeds a north-star input.
4. **Security & privacy** — no new PII in logs; authz check at controller layer (deny-by-default); audit-log entries where the spec requires; secrets via env/secret manager only.
5. **Observability** — new endpoints/jobs emit traces + error reporting; alerts wired where the spec sets SLOs (webhooks, sync, check-in).
6. **Docs** — API changes in OpenAPI; feature flags documented; runbook entry for anything with an operational failure mode (importers, webhooks, connectors, dunning).
7. **Feature flag** — non-trivial features ship dark behind a flag; founding-cohort ramp plan noted on the ticket.
8. **Design review** — matches design tokens and approved specs; a designer has seen the built thing (not the screenshot) before ramp.
9. **No new debt unlogged** — shortcuts taken are ticketed into the debt backlog at merge time (see sprint backlog, tech-debt budget).

## Accessibility (a11y) bar

- **WCAG 2.1 AA** on all member- and organizer-facing surfaces. Automated axe checks in CI (zero criticals to merge); manual keyboard pass per feature before ramp.
- Full keyboard operability (visible focus, logical order, no traps); touch targets ≥ 44 px on mobile surfaces.
- Contrast ≥ 4.5:1 text / 3:1 UI in **both** dark-first member and light-first organizer themes (brand rule, canonical brief §11).
- Screen-reader labels on all interactive elements; live regions for dynamic counters (check-in counts, feed updates); reduced-motion respected.
- Consent screens: plain language at grade-8 reading level, screen-reader-tested — consent that can't be perceived isn't consent.
- One assistive-tech smoke test (VoiceOver or NVDA) per feature epic before GA.

## Performance budgets

| Surface | Budget |
|---|---|
| Public club/event pages | LCP < 2.5 s on simulated 4G / mid-range Android; CLS < 0.1; Lighthouse perf ≥ 90 |
| Organizer app (desktop) | Route transitions < 400 ms P95; member list first rows < 1 s at 2,000 members |
| API | P95 < 300 ms reads, < 600 ms writes (per-endpoint SLOs in OpenAPI annotations) |
| Check-in scan | Scan → confirm < 1 s P95, online **and** offline |
| Feed initial load | < 1.5 s P95; images lazy + CDN |
| Webhooks (Stripe/Strava) | P95 processing < 2 s; alert at 30 min silence/backlog |
| JS bundle | Organizer app route-split; initial route ≤ 250 KB gz; public pages ≤ 150 KB gz |

Budgets enforced by CI (Lighthouse CI on public pages, k6 smoke on API) — a budget regression is a failing check, not a discussion.

## Test expectations (pyramid & policy)

- **Unit** (fast, many): domain logic, normalization, fee math, dedup keys.
- **Integration** (every endpoint): NestJS testing module + real Postgres (testcontainers) — RLS must be on in tests (no superuser test connections).
- **Contract**: consent filtering (staff payload shape per scope), Stripe webhook fixtures (incl. duplicates + out-of-order), Strava webhook fixtures, provider-interface conformance for connectors.
- **E2E** (few, golden): the six golden flows run on every merge to main; full regression nightly.
- **Property-based**: consent scope × role matrix; money integer-math invariants (no path where fees + net ≠ gross).
- **Chaos-lite (pre-GA gates)**: offline check-in sync storm; webhook replay flood; import crash-resume.
- Flaky test policy: quarantine within 24 h, fix or delete within one sprint; a quarantined golden-flow test blocks the ramp of anything touching that flow.

## Release quality gates

- CI green (types, lint, tests, axe, budgets) → preview deploy → PM/design acceptance on preview → flag-dark merge → founding-cohort ramp (≤ 10 clubs) → 48 h error/metric watch → GA ramp.
- Sev-1 (data leak, money error, check-in down on event morning): fix-forward or rollback within 2 h; blameless postmortem within 3 days; consent or tenant-isolation bugs are **always Sev-1**.

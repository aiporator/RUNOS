# RunOS Enterprise Sales Assets — Network Tier

> Scope: Network tier (custom, from $999/mo). Unlimited members, white-label mobile app, API access, SSO, SLA, dedicated CSM.
> All numbers, names, and claims match `docs/00-foundation/canonical-brief.md`.
> Audience: AEs, sales engineering, CS leadership. Internal use.

---

## 1. ICP Profiles

### 1.1 Multi-chapter run crews

- **Firmographics:** 3–25 chapters across cities or countries; 1,000–15,000 total members; central founding team of 2–8 plus volunteer chapter leads (the Priya Sharma role); revenue from dues, events, merch, and 1–5 brand sponsorships; often an LLC or nonprofit that grew out of one founder's club.
- **Pain:** Every chapter reinvents the stack. Central team has no visibility into chapter attendance or finances. Brand deals negotiated centrally can't be verified locally. Chapter leads burn out and take institutional knowledge with them. Data lives in 15 WhatsApp groups and 9 spreadsheets.
- **Buying committee:** Founder/CEO (economic buyer), head of operations (champion, usually), chapter leads (users, can veto by non-adoption), sometimes a fractional finance person.
- **Trigger events:** New city launch; a chapter lead quitting; a brand demanding better reporting before renewing; a data incident (lost member list, payment dispute); annual planning.
- **Deal size range:** $999–$3,500/mo depending on chapters and members; typical entry ~$1,500/mo.

### 1.2 Franchise fitness communities

- **Firmographics:** 10–200 locations under a franchise or license model; corporate HQ with marketing, ops, and franchise-success teams; franchisees own local P&L; 5,000–100,000 total members.
- **Pain:** Brand consistency vs local autonomy. HQ can't see which locations are healthy until royalties dip. No shared member profile when members travel between locations. Franchisees buy random local tools; HQ eats the support burden.
- **Buying committee:** VP Operations or Franchise Success (economic buyer), CMO (brand/white-label stakeholder), IT lead (security/SSO), franchise advisory council (influencer), legal (DPA).
- **Trigger events:** Franchise expansion round; franchisee satisfaction survey pain; brand refresh requiring a unified member app; a competitor franchise launching a slick app.
- **Deal size range:** $2,500–$10,000+/mo; longest sales cycle (3–9 months) but highest LTV and lowest churn.

### 1.3 Race series organizers

- **Firmographics:** 3–30 events per year, 500–50,000 participants per event; year-round training community as retention engine; revenue from registrations, sponsors, merch, expo booths; 5–50 staff, seasonal spikes.
- **Pain:** Community goes dark between races. Registration platforms take fees and give back nothing operationally. Sponsor reporting is post-event guesswork. No unified profile linking a runner's training, past races, and purchases.
- **Buying committee:** Race director/owner (economic buyer), marketing lead (champion), sponsorship director (strong influencer — Sponsor CRM is their dream), registration ops manager.
- **Trigger events:** Registration platform fee hike; a headline sponsor asking for engagement data; launching a training-program product; year-round membership ambitions.
- **Deal size range:** $999–$5,000/mo plus meaningful platform-fee volume on registrations.

### 1.4 City sports offices (reference: Amsterdam Active)

- **Firmographics:** Municipal health, sport, and tourism programs; budget authority from public funds; goals in participation, public health, and event tourism; 10–100 staff; procurement-driven buying.
- **Pain:** They fund community sport but can't measure it. Grant reporting is self-submitted PDFs. No live view of which programs actually get residents moving. Data privacy rules make most vendor tools a non-starter.
- **Buying committee:** Program director (economic buyer), policy/data officer (decision criteria owner), procurement officer (process gatekeeper), legal/privacy officer (GDPR veto), sometimes an elected official as sponsor.
- **Trigger events:** New public-health targets; budget cycle planning; a flagship city race or "active city" initiative; EU funding requiring measurable outcomes.
- **Deal size range:** $1,500–$8,000/mo via annual contracts; procurement adds 2–6 months but renewals are near-automatic. Key: cities see **aggregate dashboards only** — never member-level data. This is a feature, not a concession; lead with it.

### 1.5 National federations

- **Firmographics:** National governing bodies for athletics/running; 50–2,000 affiliated clubs; membership licensing revenue; small permanent staff, large volunteer structure; often decades-old legacy systems.
- **Pain:** Affiliated clubs are invisible between annual license renewals. Member data quality is poor. National sponsors want reach the federation can't demonstrate. Clubs resent the federation because it takes fees and gives back paperwork.
- **Buying committee:** Secretary general/CEO (economic buyer), club development director (champion), IT manager (integration with legacy licensing), board (final approval), major sponsor (external influencer).
- **Trigger events:** Sponsor renewal negotiations; digital-transformation mandates; membership decline reports; a rival sport's federation shipping a member app.
- **Deal size range:** $3,000–$15,000+/mo; structure as federation-funded with per-club rollout tiers. Longest cycle, biggest moat: winning a federation seeds hundreds of clubs.

---

## 2. Qualification Framework — MEDDICC for RunOS

| Letter | RunOS meaning | What good looks like |
|---|---|---|
| **M — Metrics** | Quantified value in their language: admin hours saved, chapter visibility, WACM lift, sponsorship revenue growth, tool spend consolidated. | Champion agrees in writing to 2–3 target numbers, e.g. "cut chapter admin from 10 hrs/week to 6" or "increase sponsorship revenue 25% with verified reporting." We can baseline each metric today. |
| **E — Economic buyer** | The person who can approve $12k–$120k/yr without escalating. Founder/CEO for crews, VP Ops for franchises, program director for cities. | We've met them, they've stated the problem in their own words, and they've reacted to a price range without flinching or ghosting. |
| **D — Decision criteria** | Their written or implicit checklist: white-label depth, SSO, data residency (EU/US), consent model, migration effort, chapter autonomy, API. | Criteria are documented and we've influenced them — e.g. added "member-level consent controls" and "k-anonymity for brand data" as criteria, which only we meet cleanly. |
| **D — Decision process** | Steps from evaluation to signature: security review, procurement, legal (DPA), board approval, pilot gate. | Mapped with names and dates. We know whether a pilot is required, who signs, and what the paper process is. A mutual action plan (section 7) exists and both sides update it. |
| **I — Identify pain** | The bleeding: volunteer burnout, chapter opacity, unverifiable sponsor reporting, member churn, fee leakage to point tools. | Pain is quantified ("we lost two chapter leads this year; each took 6 months to replace") and tied to a trigger event. The buyer says the cost of doing nothing out loud. |
| **C — Champion** | Someone with influence and personal stake — typically head of ops or club development director — who sells when we're not in the room. | They've been tested: they set up internal meetings, share internal docs, rehearse the pitch with us, and defend us against the "just use spreadsheets" faction. |
| **C — Competition** | Who else is in: Heylo, status quo (Eventbrite + spreadsheets), custom app agency, generic community tools, or internal build. | Named and mapped. We've planted landmines (section 10) matching the actual competitor, and the champion repeats them unprompted. |

**Qualification gate:** Do not forecast a Network deal beyond 20% probability until M, I, and Champion are solid. Do not issue a pilot proposal until Economic buyer and Decision process are mapped.

---

## 3. Discovery Question Bank (25)

### Current stack (5)
1. Walk me through what happens between "let's hold an event" and "everyone got home safe" — every tool and every person touched.
2. How many separate tools does one chapter use today, and who pays for each?
3. Where does the authoritative member list live, and how confident are you it's accurate right now?
4. What did your last tool migration look like, and what would make you never do one again?
5. If your most organized volunteer left tomorrow, what knowledge leaves with them?

### Chapter operations (5)
6. How does a new chapter get started today — what do you hand them, and what do they improvise?
7. What can headquarters see about a chapter's health without asking the chapter lead?
8. Where do chapter leads have autonomy, and where must they follow central rules?
9. How long does a chapter lead last before burning out, and what usually breaks them?
10. When a chapter struggles, how long before you know — and how do you find out?

### Data and reporting (4)
11. What report do you wish you could produce today but can't?
12. When a sponsor or your board asks "how many active members do you really have," what do you tell them, and how sure are you?
13. How do you handle member privacy today — consent, GDPR requests, medical info at events?
14. Who inside and outside the org needs data from you, and what format do they demand?

### Monetization (4)
15. What are your revenue lines today — dues, registrations, merch, sponsorship — and which one frustrates you most?
16. How much do you pay in platform and processing fees across all your current tools?
17. What would you charge sponsors if you could prove attendance and engagement per activation?
18. Have you ever lost or under-priced a sponsorship because you couldn't verify your audience?

### Member experience (4)
19. What does a new member's first two weeks look like — and where do you lose them?
20. If I asked ten of your members what they get for their dues, what would they say?
21. Do members ever complain about how many apps they need? What have you tried?
22. What percentage of members are active in a given week — and do you trust that number?

### Procurement and security (3)
23. What does your security and privacy review process look like, and who runs it?
24. Do you require SSO, data residency (EU/US), or a DPA — and has a vendor ever failed your review?
25. What's your procurement path and timeline: who signs, at what threshold, and what paper do they need?

---

## 4. ROI Calculator Spec

### Inputs

| Input | Description | Default |
|---|---|---|
| `chapters` | Number of chapters/locations | 12 |
| `members` | Total members across org | 4,800 |
| `admin_hours_week` | Admin hours per chapter per week (all volunteers/staff) | 10 |
| `hourly_cost` | Loaded hourly cost of that time (staff rate or volunteer-replacement rate) | $30 |
| `events_month` | Paid events per month, org-wide | 40 |
| `tool_spend_month` | Current monthly spend across all tools (event platform, email, forms, storage, etc.) | $850 |
| `sponsorship_rev_year` | Current annual sponsorship revenue | $60,000 |
| `avg_dues_year` | Average annual dues per member | $100 |
| `churn_rate` | Current annual member churn | 25% |

### Formulas

- **Admin time saved** = `chapters × admin_hours_week × 40% × hourly_cost × 52`
  (40% reduction is the conservative benchmark from automating events, payments, comms, and reporting; use 30% for skeptical buyers, never above 50%.)
- **Tool consolidation** = `tool_spend_month × 12 × 70%`
  (RunOS replaces roughly 70% of a typical stack; Stripe processing remains, some keep a niche tool.)
- **Retention lift** = `members × avg_dues_year × 5 percentage-point churn reduction`
  (Driven by churn prediction, re-engagement journeys, and benefits passport; cap the modeled lift at 5 pts.)
- **Sponsorship uplift** = `sponsorship_rev_year × 25%`
  (Verified audience reporting via Sponsor CRM + Brand Portal supports renewals at higher rates and new tiers; use 15% if sponsorship is immature.)
- **Total annual value** = sum of the four lines.
- **RunOS annual cost** = quoted Network price × 12.
- **ROI multiple** = total annual value ÷ RunOS annual cost. **Payback months** = RunOS annual cost ÷ (total annual value ÷ 12).

### Worked example — 12-chapter org, 4,800 members

Using defaults and a Network quote of $1,800/mo:

| Value line | Math | Annual value |
|---|---|---|
| Admin time saved | 12 × 10 hrs × 40% × $30 × 52 | **$74,880** |
| Tool consolidation | $850 × 12 × 70% | **$7,140** |
| Retention lift | 4,800 × $100 × 5% | **$24,000** |
| Sponsorship uplift | $60,000 × 25% | **$15,000** |
| **Total annual value** | | **$121,020** |
| RunOS cost | $1,800 × 12 | **$21,600** |
| **ROI multiple** | $121,020 ÷ $21,600 | **5.6x** |
| **Payback** | | **~2.1 months** |

### Output narrative template

> "Across your `{chapters}` chapters and `{members}` members, RunOS returns an estimated **`{total_value}` per year** against a **`{runos_cost}`** investment — a **`{roi}x` return, paying back in `{payback}` months**. The biggest line is people: **`{admin_savings}`** of volunteer and staff time back, which is really `{admin_hours_saved}` hours a week your chapter leads spend leading instead of administrating. Add **`{retention_value}`** from keeping just 5% more members, **`{sponsorship_value}`** from sponsorships you can finally verify, and **`{tool_savings}`** in tools you stop paying for. Every input above is yours to change — the model is deliberately conservative."

**Rule:** Always send the calculator with editable inputs. A number the buyer computed themselves is a number they defend in their own budget meeting.

---

## 5. Security Review Pack — Outline

Maps to the security and privacy documentation in `docs/03-architecture/`. Pack contents, in order:

1. **Architecture overview** — multi-tenant SaaS on AWS (ECS/EKS, Terraform-managed); PostgreSQL 16 with tenant isolation via `club_id` + Row-Level Security enforced at the database layer; Redis, ClickHouse (analytics), S3-compatible object storage.
2. **Tenant isolation** — RLS policy model, org → chapter → member hierarchy, staff role matrix (Owner, Admin, Organizer, Coach, Finance, Content, Volunteer-coordinator, Read-only; custom roles on Pro+).
3. **Consent model** — the seven member-controlled scopes (`profile.basic`, `activity.summary`, `activity.detailed`, `health.medical`, `location.live`, `marketing.brands`, `photos.appearances`); conservative defaults; medical and brand scopes always opt-in; brand/vendor access aggregated and anonymized with a k-anonymity threshold of 50; cities see aggregate dashboards only.
4. **Data residency** — EU and US residency options; region pinning per organization; multi-region-ready infrastructure.
5. **Identity and access** — SSO (SAML/OIDC) on Network tier; SCIM roadmap position; MFA; session and API-token policies.
6. **Encryption** — TLS 1.2+ in transit; AES-256 at rest; key management; secrets handling.
7. **GDPR and privacy** — lawful bases, data-subject rights workflows (access, rectification, erasure, portability), retention schedules, privacy-by-design summary.
8. **Subprocessors** — current list (AWS, Stripe, Anthropic for Pacer AI, email/SMS providers), DPAs in place, change-notification process.
9. **Application security** — SDLC controls, dependency scanning, annual third-party penetration test (executive summary shareable under NDA), responsible disclosure policy.
10. **Availability** — SLA terms on Network (uptime commitment, credits), status page, RTO/RPO, backup and disaster-recovery posture.
11. **DPA** — standard Data Processing Agreement available for signature; SCCs for international transfers.
12. **Compliance roadmap** — current attestations and dated roadmap (e.g. SOC 2 progress); never overstate; procurement respects honest roadmaps and punishes discovered fiction.

**Usage rule:** Send the pack proactively the moment security review appears in the decision process. Beating the questionnaire to the punch shortens Network cycles by weeks.

---

## 6. Pilot Proposal Template — 90 Days

**Title:** RunOS Network Pilot — `{Org name}`

**Purpose.** Prove, with `{Org}`'s own data, that RunOS reduces chapter admin load and lifts weekly member engagement — before a full rollout decision.

**Scope.**
- Duration: 90 days from go-live (not from signature; migration time doesn't burn pilot time).
- Chapters: 2 (recommend one strong chapter and one struggling chapter — a fair test, and the contrast is the story).
- Included: full Network feature set for pilot chapters — Community, Events, Money (Stripe Connect), Growth, Engage, Intelligence with Pacer, white-label web; SSO if required for the review.
- RunOS provides: white-glove migration for both chapters, chapter-lead training (2 live sessions), dedicated CSM, weekly check-ins.
- `{Org}` provides: an executive sponsor, one pilot owner, chapter-lead participation, data exports for migration within 10 days of signature.

**Success criteria.** Agreed now, measured together, written down:

1. **Activation (both chapters, by day 30):** 3 events published, 30% of members joined the platform, Stripe connected. This is the standard RunOS activation definition — if a chapter can't activate, the pilot pauses rather than limps.
2. **Engagement (by day 90):** Weekly Active Community Members (WACM — members who attended, logged, posted, redeemed, or transacted in the past 7 days) at or above `{X}%` of pilot-chapter members, or a `{Y}%` lift over the day-30 baseline.
3. **Operational (by day 90):** Chapter-lead reported admin hours down at least 30% vs the pre-pilot baseline survey.
4. Optional per deal: one sponsor report generated from verified data; one Growth journey live per chapter.

**Pilot pricing.** `{$X,XXX}` for the 90-day pilot (recommend 50% of the quoted monthly Network rate × 3, credited in full against year one on conversion). Never free: free pilots get no executive attention and die of indifference.

**Exit / convert terms.**
- **Convert:** Success criteria met → both parties execute the pre-agreed Network order form (`{$X,XXX}`/mo, terms attached as Exhibit A) within 15 days of pilot end. Pilot fee credits to year one. Remaining chapters onboard per the mutual action plan.
- **Exit:** Criteria not met, or either party walks → RunOS delivers a full data export (members, events, financial records, standard formats) within 10 business days and deletes `{Org}` data on request. No further obligation.
- **No zombie state:** If day 90 passes without a decision, pilot pricing continues month-to-month for a maximum of 30 days, then access ends and export triggers automatically.

---

## 7. Mutual Action Plan Template

Work backward from the target signature/go-live date. Share it live; both sides edit.

| # | Milestone | Owner (RunOS) | Owner (Customer) | Target date | Status |
|---|---|---|---|---|---|
| 1 | Discovery complete; metrics and pain documented | AE | Champion | T-60 | |
| 2 | Demo to full buying committee | AE + SE | Champion (invites) | T-52 | |
| 3 | Pilot chapters selected; baselines surveyed | CSM | Pilot owner | T-45 | |
| 4 | ROI model reviewed with economic buyer | AE | Economic buyer | T-42 | |
| 5 | Security review pack submitted | SE | Security/privacy lead | T-40 | |
| 6 | Security review passed; DPA redlines resolved | SE + Legal | Legal/privacy | T-25 | |
| 7 | Pilot proposal + pre-agreed order form (Exhibit A) issued | AE | — | T-21 | |
| 8 | Procurement process confirmed (PO path, signer) | AE | Procurement | T-14 | |
| 9 | Pilot signed | AE | Economic buyer | T-7 | |
| 10 | Data exports delivered for migration | CSM | Pilot owner | T+3 | |
| 11 | Migration complete; chapter leads trained | CSM | Chapter leads | T+14 | |
| 12 | Pilot go-live (90-day clock starts) | CSM | Pilot owner | T+15 | |
| 13 | Day-30 activation checkpoint | CSM | Pilot owner | T+45 | |
| 14 | Day-60 executive review (WACM trend, admin survey) | AE + CSM | Economic buyer | T+75 | |
| 15 | Day-90 results readout; convert/exit decision | AE | Economic buyer | T+105 | |
| 16 | Network order form executed; rollout plan for remaining chapters | AE | Economic buyer | T+120 | |

**Rules:** Every milestone has one named owner per side — a role is not an owner. Any slipped date gets a cause and a new date within 48 hours. A MAP the customer stops updating is a deal that stopped; treat it as a red flag, not paperwork.

---

## 8. Pricing and Negotiation Guardrails

**Floors.**
- Never below **$999/mo** on any Network deal, any term, any logo. The floor is the floor.
- Discount ceiling: **20%**, and only for a 2-year prepaid commitment. One-year prepay caps at 10%.
- Pilots are paid (see section 6). "Free pilot" is not a discount, it's a donation.

**Approval matrix.**

| Discount | Approver |
|---|---|
| 0–10% | AE (self-approve, log in CRM) |
| 10–20% | Head of Sales |
| >20% or any non-standard term (fee waivers, custom SLA, IP terms) | CEO |

**Trade, don't cave.** When pushed on price, concede things that cost us little and bind the relationship:

- **Payment terms:** annual or 2-year prepay for the discount they want; net-60 for procurement comfort.
- **Case-study rights:** 5% consideration for a named, quotable case study with metrics.
- **Pilot length:** extend the pilot 30 days instead of cutting price — time is cheaper than precedent.
- **Rollout ramp:** phased pricing that steps up as chapters onboard (starts lower, ends at full rate) instead of a flat discount.
- **Training/onboarding scope:** extra chapter-lead sessions or a second white-glove wave.
- Never trade: the platform-fee structure, data-ownership terms, the consent model, or the k-anonymity threshold. These are the product.

**Anchor discipline:** Quote with the ROI model open (section 4). A $1,800/mo ask beside a $121,020/yr value line is not a price conversation; it's an allocation conversation.

---

## 9. Competitive Battlecards

### 9.1 vs Heylo

- **Where they win:** Simple, fast setup for a single club; free-feeling entry; organizer familiarity; lightweight event + group chat replacement done well.
- **Where we win:** Full operating system, not a group tool — Money (Stripe Connect + memberships), Growth automations, Sponsor CRM + Brand Portal, Intelligence with predictions and Pacer, true multi-chapter management, white-label mobile app, API/SSO/SLA. Heylo has no answer at Network scale.
- **Landmines to plant:** "Ask any vendor how a 12-chapter org gets one view of chapter health." "Ask how sponsorship reporting works — can a brand verify attendance?" "Ask what happens to your data model when chapters need separate billing but shared members."
- **Trap-setting questions:** "When a sponsor asks for verified engagement numbers, what will you export?" "Who owns the member relationship if you ever leave — and in what format?" "How will chapter 9 differ from chapter 1 in their setup?"
- **Proof points:** Eight connected surfaces on one database; ROI model showing sponsorship uplift Heylo can't touch; founding clubs migrating up from lighter tools as they scale.

### 9.2 vs status quo (Eventbrite + spreadsheets)

- **Where they win:** Zero perceived switching cost; everyone knows the tools; "it works" (it does not, but it feels free); no procurement needed.
- **Where we win:** The status quo's cost is enormous and hidden — volunteer hours, ticket fees, member churn nobody measures, sponsor deals under-priced for lack of proof. We make the invisible bill visible, then delete most of it. Migration is white-glove, so the switching cost they fear is the one we've removed.
- **Landmines to plant:** "Add up what Eventbrite took in fees last year." "What happens to the spreadsheet when its owner takes a real vacation?" "How would you even calculate weekly active members today?"
- **Trap-setting questions:** "How many admin hours across all chapters, per week, honestly?" "Who was the last volunteer to quit, and what did replacing them cost?" "If your board asked for member retention by chapter, how long to produce it — and would you trust it?"
- **Proof points:** ROI worked example (5.6x, ~2-month payback); 60-day money-back guarantee and free migration on founding deals; the fee comparison line by line.

### 9.3 vs custom app agencies

- **Where they win:** Total bespoke control; "exactly what we dreamed"; appeals to orgs with budget and a strong internal product opinion; one-time capex framing can suit grant funding.
- **Where we win:** Cost and time to value — agencies quote $80k–$400k and 6–12 months before version one, then charge maintenance forever; RunOS is live in weeks at a fraction of year-one agency cost. We ship improvements weekly across all customers; their app is frozen the day the contract ends. Integrations (10 fitness sources, Stripe Connect, the full business stack), consent infrastructure, and network intelligence are years of work they'd rebuild badly.
- **Landmines to plant:** "Ask for the 5-year total cost including maintenance, hosting, app-store compliance, and the GDPR work." "Ask who fixes it when Apple changes review rules." "Ask how they'll implement member-level consent and k-anonymity for brand data."
- **Trap-setting questions:** "What happens to the roadmap after launch — who pays for version 1.1?" "How many fitness-device integrations are in the quote?" "Who handles a data-subject erasure request at 2 a.m.?"
- **Proof points:** White-label mobile app on Network delivers the branded-app dream without the agency bill; API access covers genuine custom needs on top of a maintained platform; live product demo vs their slideware.

### 9.4 vs generic community tools (HubSpot/Circle-style)

- **Where they win:** Brand trust and existing licenses ("we already have HubSpot"); horizontal flexibility; big ecosystems; IT familiarity; strong for content-first communities.
- **Where we win:** Vertical depth generic tools will never build — QR event check-in, routes and pacers, fitness ingestion from Strava/Garmin/COROS and seven more, benefits passport, sponsor marketplace, attendance prediction, race-day operations. Configuring a generic tool into a fake RunOS costs more than RunOS and still can't sync a run. And we integrate with HubSpot and Mailchimp — keep them for what they're good at.
- **Landmines to plant:** "Ask how a member's Garmin activity reaches the community profile." "Ask what event check-in looks like at 6:55 a.m. with 80 runners and one volunteer." "Ask what the consultant configuration quote is, and who maintains it."
- **Trap-setting questions:** "Who on your team will own the custom objects and workflows this requires?" "How will members experience it on their phones at a Saturday run?" "What does 'weekly active member' mean in that tool, and can it count attendance?"
- **Proof points:** Side-by-side demo of event morning flow; unified runner profile spanning identity, activity, attendance, purchases, and volunteer hours; the HubSpot integration itself — we orchestrate, not compete.

---

## 10. Case Study Template

**Structure (use for every case study):**
1. Title with the number in it
2. Customer snapshot (org, size, city, tier)
3. Before: the stack and the pain, in the customer's voice
4. Trigger: why now
5. Rollout: what happened in the first 30/60/90 days
6. Results: 3–5 metrics against baseline
7. Quote from the economic buyer
8. What's next + CTA

**Example narrative (illustrative, using canonical personas):**

> ### Lagos Road Runners cut admin time 40% and doubled sponsor revenue in two seasons
>
> **Snapshot:** Lagos Road Runners. 450 members. Founder: Maya Okafor. Tier: Pro.
>
> **Before:** "We were a seven-app club," says Maya Okafor, who founded Lagos Road Runners and watched it grow past what one volunteer team could hold. WhatsApp for announcements, Strava for runs, Eventbrite for registrations, Google Sheets as the member list, Instagram for reach, Mailchimp for a newsletter that shipped quarterly at best, PayPal for dues. "I was the integration layer. Sunday nights were data entry."
>
> **Trigger:** Two things in one month: a volunteer co-organizer stepped down, and a running-shoe brand asked for engagement numbers before renewing a sponsorship. "I couldn't answer the brand's question. That scared me more than the workload."
>
> **Rollout:** Migration took six days — members, three years of event history, and payment records imported. Week one: first event published with QR check-in. Week three: dues moved to Stripe through Money, and the chase-the-payment DMs stopped. Day 30: the club hit standard activation — events published, over 30% of members joined, Stripe connected — and Pacer flagged its first churn-risk list. "Fourteen names. I knew twelve of them were drifting. The other two surprised me, and both came back after one message."
>
> **Results after two seasons:**
> - Admin time: ~12 hours/week to ~7 — a 40% reduction, measured by the same weekly log Maya kept before.
> - Weekly Active Community Members: 41% → 63% of the club.
> - Dues collection: 68% → 96% on time.
> - Sponsorship revenue: doubled — the shoe brand renewed at a higher tier after seeing verified attendance and redemption reporting from the Sponsor CRM, and a second brand signed through the Brand Portal.
> - Member growth: 450 → 610, absorbed without adding volunteers.
>
> **Quote:** "RunOS didn't make the club bigger. It made the club possible at this size. I got my Sunday nights back, and our sponsors finally see what I always knew was there."
>
> **Next:** Lagos Road Runners is opening a second chapter — on the same system, with a chapter lead who inherits a running operation instead of a pile of spreadsheets.

---

## 11. RFP Response Library — Top 20 Questions, Canonical Answers

1. **Who owns the data?**
The customer organization owns its data; individual members control what the organization sees via consent scopes. RunOS is a processor. Full export in standard formats at any time, including at termination.

2. **Describe your multi-tenant isolation.**
PostgreSQL 16 with tenant isolation enforced via `club_id` and Row-Level Security at the database layer, within a multi-tenant SaaS architecture on AWS. Organization → chapter → member hierarchy with role-based staff permissions.

3. **What is your consent and privacy model for individual members?**
Seven member-controlled scopes: profile.basic, activity.summary, activity.detailed, health.medical, location.live, marketing.brands, photos.appearances. Conservative defaults; medical and brand scopes always opt-in; members change settings anytime.

4. **How is data shared with third parties such as sponsors?**
Brands and vendors receive aggregated, anonymized data only, with a k-anonymity threshold of 50 (no smaller segment is ever shown), unless a member explicitly opts into a specific campaign. Cities and enterprise observers see aggregate dashboards only.

5. **Where is data hosted? Do you support data residency?**
AWS, with EU and US data residency options. An organization's region is pinned at provisioning.

6. **What uptime do you commit to?**
Network tier includes a contractual SLA with uptime commitment and service credits, a public status page, and documented RTO/RPO with tested backups. Specific figures are in the SLA schedule of the order form.

7. **Do you support SSO?**
Yes — SAML/OIDC SSO on the Network tier, plus MFA for all accounts.

8. **What integrations are supported?**
Fitness: Strava, Garmin, COROS, Polar, Suunto, Apple Health, Google Health Connect, Fitbit, TrainingPeaks, Zwift. Business: Stripe, Shopify, Mailchimp, HubSpot, Meta, TikTok, Slack, Discord, WhatsApp. Plus a REST + webhooks public API (OpenAPI) on Network.

9. **Describe your API.**
REST with webhooks, OpenAPI-documented, token-authenticated, rate-limited, versioned. Available on the Network tier for custom integrations and data warehousing.

10. **How do payments work and who is merchant of record?**
Stripe Connect with destination charges; the club/organization is merchant of record for memberships and tickets, and payouts go directly to the organization's Stripe account. RunOS takes a platform application fee (0.5% at Pro-level economics; Network per contract).

11. **What is your pricing model?**
Network tier: custom platform subscription from $999/mo based on chapters and members, including unlimited members, white-label mobile app, API, SSO, SLA, and a dedicated CSM; plus platform fees on transactions per contract. Annual prepay available.

12. **What is the implementation timeline?**
Typical Network rollout: white-glove migration and first chapters live within 2–3 weeks of data delivery; standard activation (3 events published, 30% of members joined, Stripe connected) targeted by day 30 per chapter; full multi-chapter rollout phased per the mutual action plan.

13. **What training do you provide?**
Live onboarding for administrators and chapter leads, role-based training sessions, an in-product knowledge base, and a dedicated CSM on Network who runs enablement through rollout and beyond.

14. **What support tiers exist?**
Starter/Club: in-app and email support. Pro: priority support. Network: dedicated CSM, priority queue, SLA-backed response times, and named escalation contacts.

15. **How do you handle GDPR data-subject requests?**
Documented workflows for access, rectification, erasure, and portability; member self-service covers most requests directly; DPA with SCCs available for signature; subprocessor list published with change notifications.

16. **Is the platform accessible?**
Web and mobile surfaces are built to WCAG 2.1 AA targets — semantic markup, keyboard navigation, contrast-checked design tokens, screen-reader support — with accessibility included in design review. Current conformance statement available on request.

17. **What happens at contract exit? How do we get our data out?**
Full export of members, events, financial records, and content in standard formats (CSV/JSON) within 10 business days of request; your Stripe account and payment history remain yours; data deletion on request following export, per the DPA retention terms. No exit fees.

18. **Do you use AI, and on what data?**
Yes — Pacer, the AI assistant, is grounded in the customer's own data plus anonymized cross-club benchmarks (RAG). It never accesses or exposes another organization's raw data. AI processing uses Anthropic Claude models via API under our subprocessor terms; customer data is not used to train third-party foundation models.

19. **Describe your security testing.**
Secure SDLC with dependency and code scanning, annual third-party penetration testing (executive summary under NDA), and a responsible-disclosure policy. Encryption: TLS 1.2+ in transit, AES-256 at rest.

20. **Can the platform be branded as ours?**
Yes. Network includes white-label web and a white-label mobile app under your brand in the app stores — your name, your identity, "Powered by RunOS." Members experience your organization, not our platform.

---

*End of enterprise sales kit. Companion docs: `landing-page-copy.md` (this folder), GTM plan, and the sales funnel doc in `docs/05-business/`; security detail in `docs/03-architecture/`.*

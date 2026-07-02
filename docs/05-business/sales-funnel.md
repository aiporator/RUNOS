# RunOS Sales Funnel & Conversion System

> Status: Execution-ready v1.0 | Owner: Growth/CRO | Numbers source of truth: `docs/00-foundation/canonical-brief.md` and `docs/05-business/gtm-strategy.md`
> Design principle (Suby): every stage exists to move one specific person one specific step. If a stage doesn't convert, it gets rebuilt, not defended. North star downstream of everything here: **WACM**.

---

## 1. Funnel Architecture: Three Funnels

We run three distinct funnels for three distinct buyers. They share a CRM but never share messaging.

1. **Club self-serve (PLG):** Maya-persona organizers who sign themselves up. Starter free → activate → upgrade.
2. **Club sales-assisted:** ICP clubs 100–1,000 members (Club/Pro) and Network-tier orgs. Demo-led, human-closed.
3. **Brand Portal:** Sofia-persona brand managers. Insight-led, pilot-closed, case-study-compounded.

### 1.1 Club self-serve funnel — stage flow and targets

| Stage | Definition | Conversion target | Monthly at Q4 scale |
|---|---|---|---|
| Traffic | Unique visitors to runos.com club pages | — | 20,000 |
| Lead | Operating Manual download OR club health audit completed | 8% of traffic | 1,600 |
| MQL | Lead with ICP-fit score ≥ 3 (club size, city, money motion) | 45% of leads | 720 |
| Trial (Starter signup) | Club workspace created | 25% of MQLs (+ direct signups) | 200 |
| Activated | **Club activated:** 3 events published + 30% of members joined + Stripe connected | 60% within 21 days | 120 |
| Paid | Upgrade to Club/Pro or premium AI add-on within 90 days | 20% of activated | ~25/mo |
| Expansion | Tier upgrade, annual plan, AI add-on, member-cap growth | 25% of paid within 12 months | compounding |

### 1.2 Club sales-assisted funnel — stage flow and targets

| Stage | Definition | Conversion target |
|---|---|---|
| Traffic/outbound touch | Outbound contact, expo lead, referral, partner intro | — |
| Lead | Replied or booked via demo page | 8% of outbound touches; 60% of expo/referral leads |
| MQL/SQL | ICP-fit confirmed + pain admitted on discovery | 70% of leads |
| Demo | Live demo delivered (organizer + at least one co-organizer) | 75% of SQLs show |
| Trial/pilot | 14-day guided trial with migration started | 65% of demos |
| Activated | Club activated (same canonical definition) | 80% of guided trials |
| Paid | Club $79/mo, Pro $199/mo (founding: $49/$129 locked for life) | 70% of activated trials → net **demo→paid ≈ 36%** |
| Expansion | Club→Pro, annual prepay, Network conversion for multi-chapter | 30% of paid in 12 months |

### 1.3 Brand Portal funnel — stage flow and targets

| Stage | Definition | Conversion target |
|---|---|---|
| Traffic | Brand-page visits, wrap-report forwards, expo/industry contacts | — |
| Lead | Audience-insights teaser report requested | 12% of brand-page traffic |
| MQL | Brand with active running/community budget + 5 launch-city presence | 50% of leads |
| Discovery call | 30-min insight walkthrough | 60% of MQLs |
| Pilot | $5k pilot campaign signed (guaranteed deliverables, §6) | 35% of discovery calls |
| Live campaign | Campaign delivered + wrap report | 95% of pilots |
| Paid seat | Brand Portal seat from $499/mo + campaign fees | 60% of completed pilots |
| Expansion | Multi-city campaigns, always-on perks, annual commitments | 50% of seats in 12 months |

---

## 2. Club Funnel Detail: The Math to the OKR Arc

**OKR arc:** Q1 = 50 clubs / $6k MRR · Q2 = 150 / $18k · Q3 = 300 / $36k · Q4 = 500 / $60k, with WACM 4,000 → 45,000.

**Working the math backwards (net new paid+activated clubs needed): Q1 +50, Q2 +100, Q3 +150, Q4 +200** (ignoring churn buffer; add 10% gross to cover early churn).

- **Q1 (founder-led):** 50 founding clubs = 140 demos at 36% demo→paid = ~12 demos/week. Sourced: 60% founder outbound (Strava/IG lists), 25% warm intros, 15% expo/content. Self-serve funnel exists but is not counted on.
- **Q2 (community joins):** +100 → 60 sales-assisted (165 demos, referral + partner sourced ≥ 30%) + 40 self-serve conversions (200 Starter signups/mo ramping, 60% activation, 20% paid — cohorts maturing from M4–M6 signups).
- **Q3 (PLG on):** +150 → 70 sales-assisted + 80 self-serve (requires ~330 Starter signups/mo by M8; loops B/E supply ~60% of that traffic).
- **Q4:** +200 → 80 sales-assisted (incl. Network) + 120 self-serve (400+ signups/mo; referral program contributing 12 clubs/mo per GTM channel plan).

**MRR check at Q4:** 500 clubs ≈ 240 paid (Club-heavy mix: ~170 Club × avg $70 blended founding/list + ~60 Pro × $180 + 3 Network × $1,200) + AI add-ons (~50 × $29) + platform/ticket fees ≈ **$60k MRR**. Consistent.

**Funnel flow (club side):**

```
Traffic (SEO event pages, IG recaps, expos, outreach, referrals, partners)
   → Lead magnet: "Run Club Operating Manual" ebook
     + free Club Health Audit tool (10 questions → scored report:
       admin hours lost, revenue left on table, churn risk)
   → Landing page (see below)
   → TWO paths, chosen by club size:
       <100 members  → self-serve Starter trial path
       100+ members  → "Book a demo" path (speed-to-lead <5 min)
   → Activation (3 events + 30% members + Stripe)
   → Paid → Expansion (Club→Pro→Network; monthly→annual; AI add-on)
```

**Landing page skeleton (club funnel):** Headline: "Run the club. We'll run the boring stuff." Sub: "One login for events, payments, members, and sponsors — instead of WhatsApp chaos and Sunday-night spreadsheets." Hero CTA split: "Get the free Operating Manual" (lead) / "See RunOS in 20 minutes" (demo). Proof band: founding-club logos + "10 hours of admin saved per week" stat + migration-story video. Risk reversal: 60-day money-back guarantee, free white-glove migration. Audit tool embedded as interactive section ("How healthy is your club? 10 questions, 2 minutes").

**Activation is the funnel.** The trial's only job is the three canonical activation events. Every nurture touch below drives exactly one of them. Trials that hit activation convert to paid at 70%+; trials that don't convert under 10%. We therefore staff a "migration concierge" on every sales-assisted trial and instrument activation-step drop-off as the top weekly growth metric.

---

## 3. Email/SMS Sequence: 7-Touch Trial Nurture (self-serve + guided trials)

Trigger: Starter/trial workspace created. Exit: club activated → move to upgrade track; or paid → onboarding track. All sends stop-on-conversion per goal.

| # | Day | Channel | Subject / opener | Copy skeleton (brand voice) | Goal | CTA |
|---|---|---|---|---|---|---|
| 1 | 0 (within 10 min) | Email | "Your club's new HQ is ready" | Welcome to RunOS, [first name]. Your club now has one home for events, members, and money. First move: publish your next run — it takes four minutes, and we pre-filled what we could. Do that today and your members can RSVP tonight. We run the boring stuff. You run the club. | First event published | Button: "Publish your first run" |
| 2 | 1 | Email | "Bring your people (we made it painless)" | Nice — your workspace is live. Now the part that matters: your members. Upload your WhatsApp export or spreadsheet and we'll build clean profiles automatically. Clubs that invite members in week one see 3× more RSVPs. Your crew is one import away. | Member import + invites sent | Button: "Import your member list" |
| 3 | 3 | SMS | — | RunOS: [X] members already joined [Club name]. Publish your next 2 runs so they land on a full calendar → [short link] | 3 events published | Link to event builder |
| 4 | 5 | Email | "Get paid without the awkward chasing" | Chasing membership fees over DM is nobody's favorite run. Connect Stripe once and dues, event tickets, and merch flow in automatically — payouts straight to the club account. Takes about six minutes. One founding club recovered [$X] in unpaid dues the first month. Money should be the easy part. | Stripe connected | Button: "Connect Stripe" |
| 5 | 8 | Email | "Meet Pacer, your club's digital COO" | You've met the basics. Now meet Pacer. Ask it to draft next week's newsletter, predict Saturday's attendance, or build an Instagram recap of yesterday's run. Organizers tell us this is the moment RunOS stops feeling like a tool and starts feeling like a teammate. Try one command. | Pacer first use (engagement) | Button: "Ask Pacer to plan your week" |
| 6 | 11 | Email + SMS nudge | "You're [1 step] from a fully-running club" | Dynamic checklist email: shows exactly which activation steps are done and which one remains, with a one-click path to finish it. You're closer than you think — [remaining step] takes under ten minutes. Reply to this email and a real human will do it with you on a 15-minute call. No pitch. Just setup. | Complete remaining activation step | Dynamic deep link + "Book 15-min setup call" |
| 7 | 14 | Email | "Keep it. Here's what changes (and what it costs)" | Two weeks in: [X] events, [Y] members, [Z] RSVPs — your club's numbers, not ours. Here's what's next: stay free on Starter under 50 members, or unlock Growth OS and the benefits passport on Club at $79/mo (founding clubs: $49 locked for life). 60-day money-back guarantee either way. Whatever you choose, the data is yours. | Paid conversion or explicit Starter continuation | Button: "Upgrade to Club" / link: "Stay on Starter" |

Non-activated at day 14 → drop to a bi-weekly "organizer tips" track with one reactivation offer at day 30 (free 15-min concierge migration).

## 3b. Email Sequence: 7-Touch Demo-Request Nurture (sales-assisted)

Trigger: demo requested. SLA: **speed-to-lead under 5 minutes** — touch 1 is a human call attempt, sequence covers the gaps. Exit: demo attended → post-demo track.

| # | Day | Channel | Subject / opener | Copy skeleton | Goal | CTA |
|---|---|---|---|---|---|---|
| 1 | 0 (<5 min) | Phone + SMS fallback | — | Call. If no answer, SMS: "Hi [name], [rep] from RunOS — saw you want a demo for [club]. Grab a time here and I'll come prepared with your club's setup already mocked up → [calendar link]" | Demo booked | Calendar link |
| 2 | 0 (+1 hr) | Email | "Your RunOS demo — pick a time (I'll do the homework)" | Thanks for raising your hand, [name]. Before we meet, I'll look at [club]'s Instagram and public schedule so the demo shows *your* club in RunOS, not a generic one. Twenty minutes, no slides, real product. Pick a slot that suits your training schedule. | Demo booked | Calendar embed |
| 3 | 1 | Email | "What [similar club] did with their Sunday evenings" | Quick story while you pick a time. [Founding club], [size] members in [city], moved off WhatsApp + spreadsheets in one afternoon — we did the migration for them. Their organizer got back roughly ten hours a week and their event no-show rate dropped by a third. The full story is three minutes: [case study]. Your club's version of this is what the demo is for. | Consume proof; book | Case-study link + calendar |
| 4 | 3 | SMS | — | "[Name] — still holding a founding-club slot for [city] ([n] left of 10). Want me to pencil you for [day/time]? — [rep], RunOS" | Demo booked | Reply YES / calendar |
| 5 | 5 | Email | "The 10 questions that predict if your club will burn out its founder" | We built a free Club Health Audit from patterns across [N] clubs. Ten questions, two minutes, and you get a scored report: admin hours lost, revenue left on the table, churn risk. Bring your score to the demo and we'll walk through fixing the red flags live. Useful even if you never buy anything from us. | Audit completed (deepens intent + discovery data) | "Run the free audit" |
| 6 | 8 | Email | "Should I close your file?" (Suby-style breakup, warm) | No hard feelings, [name] — run clubs are busy and inboxes are worse. If the timing's wrong, tell me and I'll check back next season. If you're still curious, here's my calendar one last time. Either way: the Operating Manual and the audit stay free, and I'm cheering for [club] regardless. | Force a yes/no | Calendar link + "reply 'later'" |
| 7 | 12 | Email | "Founding pricing closes for [city] — the details in writing" | Last one from me. The founding-club offer in plain terms: white-glove free migration, Club at $49/mo or Pro at $129/mo locked for life, 60-day money-back guarantee. Ten clubs per city; [city] has [n] slots left. When they're gone the offer is gone — that's not a countdown timer trick, it's how our city density model works. Door's open until it isn't. | Book or close-lost | Calendar link |

No-show recovery: 2-touch mini-sequence (SMS at +10 min "life happens — rebook here"; email next morning with 90-second product video).

---

## 4. Objection Matrix

| # | Objection | Root fear | Response talk track (use verbatim, adapt names) | Proof asset |
|---|---|---|---|---|
| 1 | "We manage fine with WhatsApp." | Change effort exceeds pain | "Totally — WhatsApp is great at chat, and you keep using it. It's just bad at everything else you're doing with it: RSVPs buried under 200 messages, no idea who actually shows up, payments chased by DM. How many hours did last week's event admin take you? [Answer.] That's what we take off your plate — the chat can stay." | Side-by-side "one event: WhatsApp vs RunOS" video (3 min); admin-hours calculator in audit tool |
| 2 | "Our members won't pay." | Pricing the community kills it | "Most of your members already pay for running — shoes, races, Strava. They don't pay *you* because there's nothing structured to pay for. Clubs on RunOS don't start with dues; they start with paid events and merch, where paying is normal. The benefits passport usually pays for membership by itself — one physio discount covers a month. And Starter is free; prove it before you charge anyone." | Founding-club revenue story ("first $1,000 in 60 days"); benefits-passport perk sheet for their city |
| 3 | "Data privacy?" | Exposing members' personal/health data | "Best objection there is, and we built for it. The data belongs to your club and your members — not us, not brands. Members control granular consent scopes; medical and brand-marketing data are always opt-in. Brands only ever see anonymized aggregates, never below a 50-person threshold. EU clubs' data stays in the EU. And if you leave, you export everything." | Privacy & consent one-pager (from `docs/03-architecture` security docs); DPA template; consent-scopes screenshot |
| 4 | "We're volunteers, we have no budget." | Personal financial exposure | "You shouldn't pay out of pocket — and you don't have to. Starter is free forever under 50 members. Above that, RunOS is designed to fund itself: 2% on paid registrations means the platform is paid by the money it collects for you, not by you. Founding clubs at $49/mo typically cover it with one paid event a month. If it doesn't pay for itself in 60 days, money back." | ROI worksheet; 60-day guarantee terms; founding pricing sheet |
| 5 | "Switching is too much work — years of spreadsheets and chats." | Migration pain, data loss | "That's exactly why founding clubs get white-glove migration — free. You send us the exports; we do the rest, usually inside 48 hours. You don't rebuild anything. One organizer told us the migration took her twenty minutes of effort — the time to send us three files." | Migration-story video; 48-hour migration SLA doc; importer demo |
| 6 | "Isn't this just Strava? Our club already has a Strava club." | Redundant tool, member confusion | "Keep Strava — we plug into it. Strava owns the activity; nobody owns the operations. Strava won't take membership payments, run your check-ins, manage your sponsors, or tell you who's about to churn. RunOS syncs everyone's runs in automatically and handles the club around the running. They're teammates, not rivals." | Integrations page (Strava, Garmin, COROS, Polar + 6 more); unified-runner-profile demo |
| 7 | "Our members won't adopt another app." | Rollout flops, organizer embarrassed | "Fair — app fatigue is real. Two things: members don't need a new habit to get value; RSVPs and payments work from a link, and the app is *your club's brand*, not ours. Second, the passport gives them a selfish reason to open it — perks at [local cafe/physio]. Clubs that launch with 3 perks see 30% of members join in week one, which is exactly our activation bar." | Member-adoption playbook; white-label app screenshots; week-one adoption stats |
| 8 | "There are free tools — Heylo, Meetup, Google Forms, Discord." | Overpaying for something duct tape does | "You can absolutely duct-tape five free tools together — that's what you're doing now, and it costs you the thing you can't buy back: your Sunday evenings. Free tools also mean five databases that don't talk: you can't see that Leo attended 12 runs, bought a shirt, and hasn't shown up in three weeks. One source of truth is the product. And our free tier is a real free tier if that's where you are today." | "True cost of free tools" comparison sheet; churn-risk (Pacer) demo showing cross-module data |
| 9 | "Are we locked into a contract?" | Trapped in a bad decision | "No lock-in. Monthly plans cancel anytime from settings — no call required. Annual plans exist only because they're two months cheaper, and even those carry the 60-day money-back guarantee. Founding pricing is locked for life in your favor, not ours; the lock binds us, not you. And your data exports at any time." | Terms one-pager; cancellation-flow screenshot; guarantee terms |
| 10 | "What if RunOS shuts down? Startups die." | Rebuilding everything on rubble | "Honest risk, so here's the honest answer. One: your data is exportable at all times in open formats — members, events, finances — so the worst case is going back to spreadsheets with better spreadsheets. Two: payments run on Stripe Connect under *your* club's account; your money never sits with us. Three: we're built on boring, durable economics — 500 clubs across five cities on paid plans — not ad-burn. But the export button is the real answer: we keep you by being good, not by holding your data hostage." | Data-portability policy; Stripe Connect architecture explainer; company traction snapshot |

---

## 5. Brand Portal Funnel (Sofia Lindqvist)

**Positioning:** "Stop sponsoring spreadsheets. Reach verified running audiences and measure every euro."

**Stage 1 — Lead magnet: the audience-insights teaser report.** Anonymized, aggregated running-audience data (k-anonymity ≥ 50, per the canonical consent model): city-level runner demographics, weekly activity patterns, gear-purchase intent signals, event-attendance trends. Gated behind work email + brand qualification. It is the report Sofia cannot get anywhere else, because nobody else has consented, verified, cross-club community data. Distribution: outbound to named brand list, expo conversations, LinkedIn organic from the "State of Run Clubs" data report, and — the compounding channel — forwarded campaign wrap reports (Loop D in `gtm-strategy.md`).

**Stage 2 — Discovery call:** 30 minutes walking Sofia through her city's teaser data, ending on: "Want to see what a campaign against this audience actually returns?"

**Stage 3 — Pilot campaign offer ($5k, guaranteed deliverables).** The Suby-style risk-reversed entry offer, in writing:

> **RunOS Brand Pilot — $5,000, 6 weeks, one city.** Guaranteed deliverables: activation at 5+ club events (minimum 500 verified attendee interactions), a benefits-passport perk placement reaching every member in the city network, opt-in product-trial cohort (minimum 100 consented runners), and a full wrap report: verified reach, check-ins, redemptions, sentiment, and cost-per-engaged-runner. If we miss the guaranteed minimums, we extend the campaign free until we hit them.

Pilot capacity: 2/quarter from Q3 (per GTM calendar), scaling with city MVD.

**Stage 4 — The case-study engine.** Every campaign becomes three sales assets, by contract (case-study rights clause in the pilot agreement, brand-anonymized version always permitted):
1. **Wrap report** (for the brand — designed to be forwarded; RunOS-branded footer with teaser-report CTA),
2. **Public case study** (metrics + method, for the brand funnel and PR),
3. **Vertical benchmark row** (feeds the next teaser report: "shoe-brand campaigns average X redemptions per 1,000 members").

This makes marginal brand CAC fall with every campaign — the funnel literally manufactures its own top-of-funnel.

**Stage 5 — Seat conversion:** post-wrap-report meeting; offer: Brand Portal seat from $499/mo (always-on audience dashboards, perk placement, campaign self-serve) with pilot fee credited against the first quarter for pilots signed within 30 days of wrap.

**Stage targets (recap from §1.3):** teaser-report leads → 50% MQL → 60% discovery → 35% pilot → 60% seat. To hit 4 brands on Brand Portal by M10 (GTM calendar): ~40 MQL brand leads by M8 → ~24 discovery calls → ~8 pilots → ~5 seats. Named-account list of 100 brands built by M5.

---

## 6. Sales Assets Inventory & CRM Pipeline

### 6.1 Asset inventory

| Asset | Funnel stage | Owner | Notes |
|---|---|---|---|
| "Run Club Operating Manual" ebook | Club: lead | Content lead | Flagship magnet; updated quarterly |
| Club Health Audit tool | Club: lead/MQL | Growth eng | Scored report doubles as discovery doc |
| Club landing page + city variants | Club: traffic→lead | Growth | 5 city versions with local proof |
| Demo environment ("[Club name] on RunOS" pre-mock) | Club: demo | AE team | Personalized per demo, 15-min prep SLA |
| Migration-story videos (per city) | Club: consideration | Content lead | 3-min organizer testimonials |
| Case-study library (10 by M8) | All: proof | Content lead | Tagged by objection they answer |
| ROI worksheet + admin-hours calculator | Club: objection handling | Growth | Pairs with objections #1, #4 |
| Privacy & consent one-pager + DPA template | Club/Network: legal | Founder/legal | Objection #3; Network procurement |
| Founding-offer terms sheet | Club: close | CRO | $49/$129 lifetime lock, guarantee terms |
| 60-day guarantee terms | Club/Brand: close | CRO | Risk reversal, plain language |
| Comparison sheet ("true cost of free tools") | Club: objection | Content lead | Objection #8 |
| White-label member app screenshots/demo | Club Pro / Network: demo | Product mktg | Objection #7 |
| Audience-insights teaser report (per city) | Brand: lead | Data + brand AE | Refreshed monthly from network intelligence |
| Brand pilot offer one-pager ($5k, guarantees) | Brand: pilot close | Brand AE | Signed as SOW |
| Campaign wrap-report template | Brand: expansion + Loop D | Brand AE | Forward-optimized design |
| "State of Run Clubs" annual data report | Brand + PR: traffic | Data + content | M10 flagship |
| Amsterdam Active case study | Network: proof | Founder AE | City-office anchor (M11) |
| Network-tier pilot proposal template ($3k/90-day) | Network: pilot | Founder AE | Pre-agreed success criteria |
| Organizer webinar ("WhatsApp to RunOS in 20 min") | Club: MQL→trial | Community mgr | Monthly, recorded |
| Referral kit (in-product + email templates) | Expansion/advocacy | Growth | §7 mechanics |

### 6.2 CRM pipeline stages (HubSpot-style)

**Club sales-assisted pipeline:**

| Stage | Exit criteria | SLA |
|---|---|---|
| 1. New lead | Contact info + source captured; ICP score computed | Speed-to-lead **<5 min** for demo requests; <4 business hours for all others |
| 2. Qualified (SQL) | ICP-fit ≥ 5 (per GTM §1.2); pain admitted; no disqualifiers; decision-maker identified | Qualify within 2 business days |
| 3. Demo scheduled | Calendar hold with organizer + 1 co-organizer invited | Demo within 7 days of request |
| 4. Demo done / trial open | Demo delivered; guided trial created; migration files requested | Trial live within 24h of demo |
| 5. Activation in progress | Migration done (48h SLA); activation checklist owned by migration concierge | Activated within 21 days or escalation |
| 6. Proposal / founding offer | Terms sheet sent; guarantee + pricing confirmed verbally | Follow-up within 48h of send |
| 7. Closed-won | Payment method live; handoff-to-CS doc complete | CS welcome within 1 business day |
| 8. Closed-lost | Reason coded (12-option taxonomy); recycle date set | Win-back sequence at +90 days |

**Handoff rules:**
- **Marketing → Sales:** MQL threshold = ICP-fit ≥ 3 AND (audit completed OR demo requested OR 100+ members declared). Auto-routed to city-owning rep; rejected MQLs must carry a coded reason back to marketing within 24h (closed-loop).
- **Sales → CS:** closed-won requires a handoff doc: activation status, promised terms (founding lock, guarantee dates), migration notes, expansion signals (multi-chapter ambitions → Network flag). CS confirms receipt; no "silent handoffs."
- **Self-serve → Sales (PQL escalation):** Starter club crosses 80 members, connects Stripe, or requests white-label → flagged as product-qualified lead; rep outreach within 1 business day, positioned as help, never as a toll booth.
- **Club → Brand cross-referral:** a club's existing sponsor mentioned in Sponsor CRM → brand AE may request a warm intro only with the club's consent.

**Brand pipeline stages:** Lead → Teaser delivered → Discovery → Pilot proposed → Pilot live → Wrap delivered → Seat negotiation → Closed-won/lost. Key SLAs: teaser delivered within 1 business day of request; wrap report within 5 business days of campaign end (the wrap IS the sales asset — late wraps kill Loop D).

---

## 7. Referral Program: Give 2 Months / Get 2 Months

**Offer:** A club on any paid plan refers another club. When the referred club completes its first paid month, the referred club gets **2 months free** and the referring club gets **2 months free** (credited, not cash).

**Eligibility:**
- Referrer: any club on Club/Pro/Network in good standing (no failed payments); Starter clubs may refer and *bank* credit, applied when they upgrade (upgrade incentive by design).
- Referee: new RunOS organization (no prior paid workspace; no shared Stripe account or overlapping admin emails with an existing paid org), must reach paid status within 90 days of referral click.

**Tracking:** unique referral link + code per club (in-product "Refer a club" surface in Growth); attribution: last-touch referral link with a 90-day cookie AND code-at-checkout fallback; conflicts resolve to code. All referral state lives in the CRM as first-class objects (referral → status: clicked / signed up / activated / paid / credited).

**Payout logic:** credits auto-apply to the next invoice(s); referrer credit issued only after the referee's first paid invoice **settles + 30 days** (clears the refund window from the 60-day guarantee overlap: if the referee refunds within 60 days, unapplied referrer credit is reversed). Credits stack to a max of **12 months banked** per club per year; credits are non-transferable and expire 24 months after issue. Network-tier referrals: fixed $500 credit instead (custom pricing makes "2 months" ambiguous).

**Anti-gaming rules:**
- No self-referrals: matching payment method, Stripe account, admin email domain (non-generic), or device fingerprint auto-voids the referral, flagged for human review.
- Referee must reach **club activated** (canonical: 3 events + 30% members + Stripe) before referrer credit issues — dead workspaces earn nothing.
- Rate cap: max 6 credited referrals per club per rolling year without manual review (a genuinely connected super-referrer gets whitelisted, a farm gets removed).
- Public code-dumping (coupon sites) voids that code; codes are per-club and revocable.
- All voids logged with reasons; monthly gaming audit owned by Growth.

**Viral coefficient assumption:** 25% of paid clubs make ≥1 successful referral per year; average 1.3 successful referrals among those → **K ≈ 0.33 annually** on the paid base. Not self-sustaining alone — by design; it is a CAC subsidizer (referral CAC ≈ $160 vs $350 outbound, per GTM channel plan) and a retention lever (banked credit raises switching cost). Review K quarterly; if K > 0.5 sustained, increase referral prominence in onboarding; if K < 0.2, test doubling the give-side only (give 4 / get 2) before touching the get side.

---

## 8. Operating Rules (how this document is used)

1. Every conversion target above is a hypothesis with an owner; review monthly against actuals in the growth review, and rewrite the number — not the narrative — when reality disagrees.
2. No new asset, sequence, or stage may be added without naming the single conversion it exists to move.
3. Copy changes must pass the brand-voice test: confident, warm, athletic; short sentences; verbs over adjectives; never corporate-cold, never bro-hustle. We run the boring stuff so they can run the club — including this funnel.

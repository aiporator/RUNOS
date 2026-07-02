# RunOS Go-To-Market Strategy

> Status: Execution-ready v1.0 | Owner: Growth | Source of truth for all numbers: `docs/00-foundation/canonical-brief.md`
> North star: **WACM — Weekly Active Community Members** (attended, logged, posted, redeemed, or transacted in the last 7 days).

---

## 1. Beachhead Strategy

### 1.1 The wedge

We win by owning one segment completely before touching any other: **urban social run clubs with 100–1,000 members in five launch cities — Amsterdam, London, Berlin, New York City, Austin.**

Why this segment, and no other, first:

1. **Acute, daily, unpriced pain.** These clubs run on WhatsApp threads, Google Sheets, Linktree, and a volunteer's Sunday evenings. Registration is a form. Payments are Tikkies, Venmo requests, or cash in an envelope. Attendance is a headcount from memory. The organizer (our Maya Okafor) spends 10–15 hours a week on admin she hates. The pain is not "nice-to-solve" — it is the reason organizers burn out and clubs die. We run the boring stuff so she can run the club.
2. **Monetization readiness.** At 100+ members, clubs start charging: memberships, paid events, merch drops, sponsor conversations. They have revenue but no rails. RunOS is the rails — Stripe Connect memberships, ticket fees, merch, Sponsor CRM. A club with money moving through it has a reason to pay $79–$199/mo and generates platform-fee revenue on top.
3. **Density powers the network.** The benefits passport, vendor marketplace, and brand campaigns only work when clubs cluster geographically. Ten clubs and fifteen merchants in one city create redemptions; one club in fifty cities creates nothing. Urban social clubs concentrate in exactly the neighborhoods where merchants (cafes, physios, running stores) want foot traffic.
4. **They are findable.** Urban social run clubs are loud by design: public Strava clubs, Instagram accounts with schedules in bio, listings on race-expo boards. We can build a named account list of 200+ clubs per city in a week.
5. **They talk to each other.** Organizers co-host events, share pacers, and sit in the same founder WhatsApp groups. One delighted Maya is worth three cold demos. This is the substrate for community-led growth in Motion 2.

### 1.2 ICP definition

**Firmographic attributes:**

| Attribute | Target |
|---|---|
| Segment | Independent social run club (not a race brand, not a coach's client list) |
| Members | 100–1,000 (sweet spot 200–600; Club and Pro tiers) |
| Geography | Within metro area of Amsterdam, London, Berlin, NYC, or Austin |
| Cadence | 2+ recurring weekly runs plus monthly social/special events |
| Team | 1 founder-organizer + 2–10 volunteer captains/pacers |
| Money motion | Charges for something today (membership, paid events, merch) or explicitly wants to within 6 months |
| Channels today | WhatsApp/Telegram group + Instagram + Google Form/Sheet + (often) a public Strava club |

**Behavioral attributes (scored in CRM, 1 point each; ICP-fit = 5+):**

- Posts a weekly schedule publicly (operational maturity)
- Has waitlisted or capped an event in the last 90 days (demand exceeds ops)
- Has run at least one sponsored or brand-supported event (monetization intent)
- Organizer has publicly complained about admin/WhatsApp chaos (pain admission)
- Instagram following > member count (growth headroom)
- Collects any money from members today (Stripe-ready)
- Multi-neighborhood or second-chapter ambitions (Network-tier seed)

**Explicit disqualifiers (do not sell, politely route to Starter self-serve or decline):**

- **Solo coaches** selling 1:1 training plans — they need a coaching CRM, not a community OS
- **Virtual-only challenge groups** with no physical events — no check-ins, no benefits redemptions, no WACM engine
- **One-off race organizers** — event-ticketing buyers who churn after race day; Eventbrite's problem, not ours
- **Clubs under 30 members** — below activation threshold economics; self-serve Starter only, never sales time
- **Clubs run by a race brand or gym as a marketing channel** — the "club" is a funnel for someone else's product; decision-maker incentives don't match
- **Track/athletics federations' competitive squads** — selection-based, coach-driven, federation software incumbents; revisit via Network tier only if they approach us

### 1.3 What winning the beachhead looks like

Per canonical OKR arc: **Q1 = 50 founding clubs, $6k MRR, 4,000 WACM. Q2 = 150 clubs, $18k MRR, 12,000 WACM. Q3 = 300 clubs, $36k MRR, 25,000 WACM. Q4 = 500 clubs, $60k MRR, 45,000 WACM.** Beachhead is "won" when in each launch city we have 10+ activated clubs, 15+ benefit merchants, and 1+ paying brand campaign — the minimum viable network (see §5).

---

## 2. Motion Sequencing

Four motions, layered — each motion is added, not swapped. Transitions are triggered by numbers, not vibes.

### Motion 1: Founder-led sales (Month 0 → ~Month 5)

The founding team personally recruits the 50 founding clubs. Every demo done by a founder. Every migration white-glove. Goal is not efficiency — it is learning velocity: objection library, activation friction, pricing validation, the first 20 case studies.

- Weekly operating rhythm: 25 outbound touches per founder per week, 8 demos/week team-wide, 3 closes/week.
- Founders attend one club run per week per city (local hires cover non-HQ cities from Month 2).

**Exit triggers (all three must be true):**
1. **50 founding clubs signed** (Q1 OKR hit), and
2. **Founder-sourced pipeline falls below 40% of new pipeline** for 4 consecutive weeks (referrals + inbound are taking over), and
3. **Demo→paid conversion ≥ 35%** with a documented, repeatable talk track (sales is transferable).

### Motion 2: Community-led growth (Month 3 → ongoing)

Founding organizers become the sales force. Mechanisms:

- **Founders' Council:** monthly call with 15 most-engaged founding organizers; roadmap input in exchange for advocacy.
- **Referral program:** give 2 months free / get 2 months free (mechanics in `sales-funnel.md` §8).
- **Organizer community:** a RunOS-run space where club founders across cities swap playbooks — the "Run Club Operating Manual" (our lead magnet) is the seed content.
- **Co-hosted city events:** quarterly multi-club runs per city, RunOS-powered check-in as live demo.

**Exit trigger (to add Motion 3):** referral + community-sourced clubs ≥ 30% of monthly new clubs AND 150 total clubs reached (Q2 OKR) AND activation playbook drives 60%+ of new clubs to "club activated" (3 events published + 30% of members joined + Stripe connected) within 21 days without human help.

### Motion 3: Self-serve PLG (Month 6 → ongoing)

Starter tier (free, <50 members) becomes the top of funnel at scale, powered by the growth loops in §3. Product work required before flipping this on: self-serve onboarding that reaches activation unaided, in-product upgrade prompts at member-cap and feature-gate moments, and the WhatsApp/spreadsheet importer as a one-click migration.

- Free→paid conversion target: 20% of Starter clubs upgrade within 90 days (they hit the 50-member cap or want Growth OS).
- Premium AI add-on ($29/mo) attached to 15% of Starter/Club as an expansion lever.

**Exit trigger (to add Motion 4):** self-serve signups ≥ 100 clubs/month AND 300 total clubs (Q3 OKR) AND aggregate audience across clubs ≥ 25,000 WACM — the minimum audience a brand manager (Sofia) will pay to reach.

### Motion 4: Partner- and brand-led (Month 9 → ongoing)

Two-sided flywheel: brands and vendors bring money and perks that make clubs stickier; clubs bring the audience brands want.

- **Brand Portal sales** (seats from $499/mo + campaign fees) to running-shoe, apparel, nutrition, and insurance brands — Sofia Lindqvist profile.
- **Vendor marketplace** (10% commission) recruiting the Dr. Emre Kaya profile: physios, coaches, nutritionists, photographers.
- **Channel partnerships:** running stores and race organizers as referral partners (see §4).
- **Network tier outbound** to multi-chapter orgs and city offices (see §6) runs in parallel from Month 4 but scales here.

There is no exit — Motions 1–4 stack into the steady-state growth machine. Founder time shifts to Network-tier deals and brand-side enterprise.

---

## 3. Growth Loops

Five compounding loops, Balfour-style: each output feeds its own input. For every loop: cycle steps, cycle time, and the amplification factor (new units generated per unit entering the loop per cycle).

### Loop A — Member-invite loop (white-label exposure)

```
┌─> 1. Club runs on RunOS; members use the club's white-label
|      app/web ("Powered by RunOS")
|   2. Runner (Leo) visits a friend's club or races in another
|      city; sees the same smooth check-in/benefits experience
|   3. Leo tells his other club's organizer: "why don't we
|      have this?"
|   4. Organizer requests a demo / starts Starter
└─  5. New club onboards; its members become carriers ──> back to 1
```

- **Key assumption:** 8% of active members belong to or regularly visit a second running community; 5% of those trigger an organizer inquiry per quarter.
- **Cycle time:** ~90 days. **Amplification:** 1 club with 300 WACM → ~1.2 new club inquiries per quarter → **~0.4 new activated clubs per club per quarter** at 35% inquiry→close.

### Loop B — Event loop (public landing pages)

```
┌─> 1. Club publishes events; RunOS auto-generates SEO-tuned
|      public landing pages ("Saturday Long Run — Prenzlauer
|      Berg") + social share cards
|   2. Non-members find pages via Google ("run club berlin
|      saturday") and Instagram shares; register as guests
|   3. Guests attend, QR check-in creates a profile; post-event
|      journey invites them to join the club
|   4. Guests convert to members; membership revenue and WACM grow
└─  5. Bigger club runs more and bigger events ──> back to 1
```

- **Key assumption:** each published event landing page draws 40 non-member visits/month; 10% register as guests; 30% of attending guests join within 60 days.
- **Cycle time:** ~30 days. **Amplification:** a club running 8 events/month adds **~10 net new members/month** from public pages — plus every new member raises WACM and platform-fee GMV. Secondary effect: 2% of guest registrants are organizers scouting tools → feeds club acquisition.

### Loop C — Benefits loop (local perks density)

```
┌─> 1. Merchants (cafes, physios, stores) list perks in the
|      benefits passport
|   2. Perks make membership tangibly valuable; clubs promote
|      them; members join and stay for the passport
|   3. Members redeem in-store; RunOS shows the merchant
|      verified foot-traffic and revenue attribution
|   4. Merchant renews and refers neighboring merchants;
|      RunOS city team recruits lookalikes with the proof
└─  5. Richer perk catalog attracts more members/clubs ──> back to 1
```

- **Key assumption:** average member redeems 1.5 perks/month; a merchant seeing 50+ redemptions/month refers or convinces 0.5 new merchants per quarter.
- **Cycle time:** ~60 days. **Amplification:** 15 merchants + 10 clubs in a city → ~25% self-sourced merchant growth per quarter after seeding; each 5 new merchants lifts member activation rate an assumed 3 points (perks are cited in member onboarding).

### Loop D — Brand loop (campaign reports as spores)

```
┌─> 1. Brand (Sofia) runs a campaign via Brand Portal
|   2. Campaign wrap report: verified reach, check-ins,
|      redemptions, ROI — the measurement she's never had
|   3. Sofia forwards the report internally (budget defense)
|      and it circulates at industry events/peers
|   4. A competing or adjacent brand manager asks "what tool
|      made this?" → requests the audience-insights teaser
└─  5. New brand signs a pilot; more campaigns produce more
       reports ──> back to 1
```

- **Key assumption:** each wrap report is seen by 4 external marketers; 10% request the teaser report; 25% of those pilot.
- **Cycle time:** ~120 days (brand budget cycles). **Amplification:** **0.1 new brand per campaign report** — with 10 campaigns/quarter in Q4, that is 1 organic brand per quarter on top of outbound; each brand adds campaign fees and makes clubs stickier (sponsor revenue is a retention anchor for Pro).

### Loop E — Content loop (auto-recaps on Instagram)

```
┌─> 1. Event happens; Pacer auto-generates a recap: stats,
|      photos, PR shoutouts, IG carousel — organizer posts
|      in one tap, tagged @runos + club handle
|   2. Members share/re-post (they're in it); recap reaches
|      members' followers — local runners
|   3. Local runners follow the club, show up as guests
|      (feeds Loop B); some are organizers of other clubs
|   4. Organizers see production-quality content they can't
|      make themselves; investigate RunOS
└─  5. More clubs → more events → more recaps ──> back to 1
```

- **Key assumption:** 70% of events get a posted recap; average recap reaches 2,500 accounts (member amplification); 0.5% of reach converts to a club follow or guest registration; 1 in 40 recaps triggers an organizer inquiry.
- **Cycle time:** ~7 days (fastest loop). **Amplification:** a 10-club city posting 60 recaps/month generates ~150k monthly reach, ~750 guest/follow actions, and **~1.5 organizer inquiries/month** — at zero marginal cost.

**Loop interaction:** E feeds B (guests), B feeds A (members), C makes B convert better (perks in the join pitch), D pays for everything above. Instrument each loop's conversion edge in the analytics stack from day one; the loop assumptions above are the first experiments backlog.

---

## 4. Channel Plan

LTV reference for ratios: blended paid-club LTV ≈ $2,400 (Club/Pro mix at founding and list pricing, 30-month average lifetime, plus platform-fee margin). Targets per canonical brief: **LTV:CAC ≥ 5:1 self-serve/community, ≥ 3:1 outbound/sales-assisted; payback ≤ 6 months self-serve, ≤ 12 months Network.**

| Channel | Motion | Monthly volume hypothesis (steady state, Q3–Q4) | CAC hypothesis | LTV:CAC | Scale / kill rule |
|---|---|---|---|---|---|
| Run-club founder communities (organizer Slack/WhatsApp groups, Reddit r/RunClubs, founder meetups) | Community-led; value-first posts, Operating Manual, AMAs | 15 clubs/mo | $120 (content + community manager time) | ~20:1 | Scale while cost per activated club < $300; never kill — floor channel |
| Race expos (marathon/half expos in 5 cities; booth + organizer happy hour) | Founder-led → sales-assisted | 8 clubs/mo (lumpy; 15–25 leads per expo, 35% demo, 40% close) | $450 (booth amortized + travel + swag) | ~5:1 | Scale if cost per signed club < $600 and 2+ Network-tier leads per expo; kill a city's expo program after 2 expos below 10 leads |
| Strava club outreach (scrape public clubs 100+ members in launch cities; personalized organizer outreach) | Founder-led outbound | 12 clubs/mo (500 touches, 8% demo, 30% close) | $350 (SDR time + tooling) | ~7:1 | Scale while reply rate > 6%; kill/retool if demo rate < 4% for 6 weeks |
| IG/TikTok organic via club content (Loop E; recap engine + @runos account) | PLG | 20 Starter signups/mo → 5 paid conversions/mo | $90 per paid club (content ops allocated) | ~25:1 | Scale with recap adoption; kill nothing — optimize recap posting rate |
| Partnerships — running stores & race organizers (store staff refer clubs; race orgs bundle RunOS for club-entry blocks; rev-share 15% year one) | Partner-led | 10 clubs/mo across 20 active partners | $280 (partner enablement + rev-share) | ~8:1 | Scale a partner after 2 referred clubs in a quarter; drop partners with 0 referrals in 2 quarters |
| Referrals (give 2 months free / get 2 months free) | Community-led | 12 clubs/mo at 500-club base (≈25% of base refers 1/yr) | $160 (2 months credit + 2 months given ≈ 4 × $40 blended margin cost) | ~15:1 | Scale always; audit for gaming monthly (rules in `sales-funnel.md` §8) |
| Paid social (retargeting only — visitors of Operating Manual / audit tool) | PLG support | 6 paid clubs/mo | $500 | ~5:1 | Cap at 15% of budget; kill cold paid prospecting entirely until Q4 test |

Portfolio rule: no channel may exceed 35% of new-club volume for two consecutive quarters (concentration risk); community + PLG channels must supply ≥ 50% of volume by Q4 or CAC math breaks the $60k-MRR plan.

---

## 5. Launch Playbook: 5-City Founding-Club Program

### 5.1 The founding offer (Hormozi-grade, use verbatim)

> **The RunOS Founding 50.** 50 clubs across Amsterdam, London, Berlin, NYC, and Austin. You get: white-glove free migration (we move your WhatsApp list, spreadsheets, and payment records for you — zero hours of your time), founding pricing locked for life (**Club at $49/mo forever, Pro at $129/mo forever**), a 60-day money-back guarantee, direct line to the founders, and your club's name in the product forever. We only take 10 clubs per city. When they're gone, they're gone.

Why it works: risk reversal (60-day guarantee + we do the migration), scarcity that is real (density strategy genuinely caps per-city slots), price anchor (lifetime lock makes churn irrational), status (founding badge, Founders' Council).

### 5.2 Minimum viable density (MVD)

The benefits passport and event loop need local mass before they feel alive. **MVD per city = 10 activated clubs + 15 benefit merchants + 2,000 WACM.** Below MVD, the passport looks empty and the network story is a promise; above it, redemptions and cross-club events make the product self-evidently better than WhatsApp. City budgets and staffing unlock in phases keyed to MVD, and we do not start paid brand campaigns in a city until MVD is reached.

Merchant recruitment formula per city: 5 running/sports stores, 4 cafes/brunch spots on popular route endpoints, 3 physio/recovery studios (marketplace vendors double as perk providers), 2 nutrition/smoothie, 1 wildcard (barber, bookshop, sauna). Merchant offer: free listing, verified foot-traffic dashboard, first 90 days commission-free on marketplace bookings.

### 5.3 City selection rationale

| City | Why |
|---|---|
| **Amsterdam** | HQ advantage; densest run-club culture per capita in Europe; compact geography = fastest MVD; Amsterdam Active (city sports office) is our canonical City/Enterprise design partner for Network tier; EU data residency showcase |
| **London** | Largest run-club scene in Europe; hundreds of ICP clubs; brand HQ concentration (Sofia-persona buyers) for Motion 4; marathon ecosystem for expo channel |
| **Berlin** | Strong social-club scene, price-sensitive (validates Club tier value), Berlin Marathon expo; second EU proof point beyond Benelux |
| **New York City** | US beachhead; the global epicenter of the social-run-club boom; media amplification; NYRR ecosystem adjacency; US data residency showcase |
| **Austin** | Control experiment: mid-size US metro, tight geography, strong running + tech culture, cheap MVD — proves the model works outside mega-cities before Series-A-scale expansion |

### 5.4 Week-by-week launch sequence (per city; run cities in two waves — Wave 1: Amsterdam + NYC from Week 1; Wave 2: London, Berlin, Austin from Week 5)

| Week | Actions |
|---|---|
| W-2 | Build named list: 200 clubs (Strava/IG scrape + manual QA), 60 merchants, 20 vendors; recruit 1 local City Lead (contract) |
| W-1 | Warm intros hunt: map every 1st/2nd-degree connection to listed clubs; seed 5 organizer conversations; book venue for launch run |
| W1 | Outbound wave 1 (50 personalized organizer touches); founder attends 3 club runs as guest; first 5 demos |
| W2 | Sign first 3 founding clubs; begin white-glove migrations (48h SLA per club); merchant outreach wave 1 (20 touches) |
| W3 | First club goes live end-to-end (events + Stripe + check-in); capture migration story content; 5 merchants signed |
| W4 | "Founding Run" city event: multi-club social run, RunOS QR check-in live demo, merchants sample perks; press/local-media invite |
| W5 | Outbound wave 2 informed by objection library; referral asks to live founding clubs; 6 clubs signed target |
| W6 | First benefits redemptions; publish city case study #1 ("How [club] killed its spreadsheet"); vendor marketplace seeds (3 vendors) |
| W7 | Push laggard migrations to activation (3 events published, 30% members joined, Stripe connected); organizer roundtable dinner |
| W8 | City hits 10 founding clubs (slots closed publicly); 15 merchants; MVD checkpoint review; hand daily ops to City Lead; founders move focus to next wave / Network deals |

Post-W8 cadence per city: monthly multi-club event, weekly merchant adds, quarterly Founders' Council input.

---

## 6. Network-Tier Sales Motion

**Targets:** multi-chapter orgs (10+ chapter city collectives), franchise/parkrun-style networks, city sports offices (canonical example: **Amsterdam Active**), national running federations. Pricing custom from $999/mo — unlimited members, white-label mobile app, API access, SSO, SLA, dedicated CSM.

**Outbound plan:**
- Named-account list of 60: 25 multi-chapter club orgs, 15 franchise-style networks, 12 city sports/health offices, 8 federations. Tiered A/B/C by member count and budget signal.
- Sequence: warm-intro-first (board members, founding organizers who know them), then 5-touch exec outreach (letter-quality email → LinkedIn → case study send → event invite → call). One AE-founder pairing owns all Network deals through Q4.
- Anchor proof: Amsterdam Active design partnership (aggregate city dashboard, funded-program measurement) becomes the city-office case study; the largest founding multi-chapter club becomes the franchise case study.

**Expected cycle length: 90–180 days** (city offices and federations at the long end — procurement, DPAs, sometimes tenders). Pipeline math: 4× coverage; to close 3 Network deals by Q4, hold 12 qualified opportunities from Month 4.

**Champion profiles:**
- *Multi-chapter org:* the founder/ED drowning in per-chapter WhatsApp chaos; cares about consistency, chapter-lead autonomy (Priya Sharma persona), consolidated finances.
- *City office:* program manager with a community-health KPI and no measurement layer; cares about aggregate dashboards (privacy-preserving — cities see aggregates only), funding-allocation evidence.
- *Federation/franchise:* operations director; cares about brand control (white-label mobile app), membership data ownership, SSO.

**Land-and-expand path:** Land with 2–3 pilot chapters or one funded city program at a 90-day paid pilot ($3k flat) with pre-agreed success criteria (chapter activation, WACM lift, one consolidated report). Expand: all chapters on annual Network contract → white-label mobile app rollout → API/SSO integration → brand-side introductions (a federation brings national sponsors → Brand Portal cross-sell). CSM-led QBRs; expansion target 130% net revenue retention on Network cohort.

---

## 7. International Sequencing & Localization

**Sequencing principle:** density before breadth. No new market until the prior wave's cities hit MVD.

- **Phase 1 (Months 0–12):** the five launch cities only. NL/UK/DE/US.
- **Phase 2 (Months 12–18):** density fill in launch countries — Rotterdam, Utrecht; Manchester, Birmingham; Hamburg, Munich; LA, Chicago, Miami. Same language/currency rails, near-zero localization cost.
- **Phase 3 (Months 18–24):** Paris, Copenhagen, Stockholm, Dublin, Toronto — pulled by inbound signal (Starter signups and member-invite loop inquiries are the market-entry oracle: enter when a city shows 10+ organic Starter clubs).
- **Phase 4 (Month 24+):** LATAM (São Paulo, Mexico City) and APAC (Singapore, Sydney) — running-boom markets, entered with PPP pricing.

**Localization plan:**
- **Languages:** English at launch (organizer surfaces); member-facing surfaces localized first — Dutch and German in Phase 1 (member apps), French, Spanish, Portuguese, Danish/Swedish in Phases 3–4. Pacer-generated content (recaps, newsletters) generates in the club's chosen language from day one.
- **Currencies:** EUR, GBP, USD at launch via Stripe Connect multi-currency; local pricing display (Club = €79/£69 equivalents held stable, not FX-floating).
- **Payment methods:** iDEAL (NL — non-negotiable for Amsterdam), SEPA Direct Debit (DE/EU memberships), Bacs (UK), cards + Apple/Google Pay everywhere; Pix and local methods at Phase 4 via Stripe.
- **Data residency:** EU and US residency options per the canonical stack (AWS multi-region); EU club data stays in EU — a stated selling point for German clubs, city offices, and federations; DPAs templated by Month 4 for Network deals.
- **PPP pricing reference:** maintain a purchasing-power-parity table for Phase 4 markets (reference: Big Mac-style index, ~40–60% of list in BR/MX); founding-style lifetime locks reused as each new market's launch offer. PPP applies to SaaS tiers only, never to platform-fee percentages.

---

## 8. 12-Month GTM Calendar

Aligned to the OKR arc: Q1 = 50 clubs / $6k MRR / 4,000 WACM · Q2 = 150 / $18k / 12,000 · Q3 = 300 / $36k / 25,000 · Q4 = 500 / $60k / 45,000.

| Month | Cities | Campaigns | Events / expos | Content | Hiring | Milestone |
|---|---|---|---|---|---|---|
| M1 | Amsterdam, NYC live | Founding 50 outbound wave 1; Operating Manual launch | 3 club-run guest visits/city | "Run Club Operating Manual" ebook + club health audit tool live; 2 migration stories | City Lead AMS, City Lead NYC (contract) | 8 founding clubs signed |
| M2 | AMS, NYC | Founding 50 wave 2; merchant recruitment sprint | AMS + NYC Founding Runs | 4 case studies; recap engine (Loop E) in every live club | Growth engineer | 20 founding clubs; first benefits redemptions |
| M3 | +London, Berlin, Austin | Wave-2 city outbound; referral program live | LDN/BER/AUS Founding Runs; first organizer roundtables | City guides ("Best run clubs in X" SEO); objection-library webinar | City Leads LDN/BER/AUS | **Q1: 50 clubs, $6k MRR, 4,000 WACM**; Founders' Council formed |
| M4 | 5 cities | Network-tier outbound opens (60 named accounts); Amsterdam Active pilot kickoff | London Marathon expo booth + organizer happy hour | Amsterdam Active pilot announcement; Loop-B SEO pages indexed | AE (founder-paired, Network + sales-assisted) | 75 clubs; 3 Network opps qualified |
| M5 | 5 cities | Partnerships program: 10 running stores + 3 race organizers signed | Multi-club city runs ×5 | First brand teaser report (audience-insights) shipped to 20 brands | Community manager (organizer community) | 105 clubs; Motion 1→2 exit triggers reviewed |
| M6 | 5 cities | Self-serve PLG launch: Starter open + importer + upgrade prompts | Berlin city event; NYC summer series | Self-serve onboarding videos; "WhatsApp to RunOS in 20 minutes" | Content lead | **Q2: 150 clubs, $18k MRR, 12,000 WACM**; all 5 cities at MVD |
| M7 | 5 cities + density fill scouting | First paid brand pilot campaigns (2 brands, $5k-style pilots) | Austin trail series; vendor marketplace push (Emre-profile recruiting) | Brand pilot wrap reports (Loop D fuel); premium AI add-on campaign | CSM #1 (Network + Pro accounts) | 190 clubs; 2 brand pilots live |
| M8 | 5 cities | Referral blitz ("Founding clubs: give 2 months, get 2 months"); Strava outreach wave 3 | Berlin Marathon expo | 10-case-study library complete; churn-save playbook | SDR #1 | 230 clubs; first Network deal closed |
| M9 | 5 cities | Brand Portal seat sales open (from $499/mo); marketplace commission live | NYC Marathon expo prep; multi-club fall races | Network-intelligence teaser: first cross-club benchmark report (k-anonymized) | Brand-side AE | **Q3: 300 clubs, $36k MRR, 25,000 WACM** |
| M10 | 5 cities + Phase-2 city shortlist | Holiday challenge campaign (Engage surface showcase); PPP/localization build for member apps (NL/DE) | NYC Marathon expo booth + Founding Run flagship | "State of Run Clubs" data report (PR asset from network intelligence) | CSM #2 | 370 clubs; 4 brands on Brand Portal |
| M11 | 5 cities | Annual-plan push ($790/$1,990 prepay, cash-flow campaign); win-back sequence | City sports-office roundtable (Amsterdam Active case study as anchor) | Amsterdam Active case study published; federation whitepaper | Head of Growth (backfill founder) | 440 clubs; 2nd + 3rd Network deals |
| M12 | 5 cities; Phase-2 wave announced | Year-one founding retrospective campaign; Founding 50 alumni showcase | "RunOS Live" — first cross-city organizer summit (all 5 cities streamed) | Year-one WACM report; 2027 roadmap public post | Sales lead (Network) | **Q4: 500 clubs, $60k MRR, 45,000 WACM** |

**Operating cadence around the calendar:** weekly growth review (loop metrics + channel CAC), monthly city MVD review, quarterly motion-transition review against the triggers in §2. Every number in this document is a hypothesis with an owner and a review date — the triggers, not the calendar, are the contract.

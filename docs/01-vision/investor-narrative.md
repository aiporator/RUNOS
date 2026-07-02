# RunOS Investor Narrative

> **Status:** Canonical narrative memo. Consistent with [`docs/00-foundation/canonical-brief.md`](../00-foundation/canonical-brief.md). Companion: [`investor-pitch-deck.md`](investor-pitch-deck.md). Numbers marked *(assumption)* are explicit, challengeable inputs — see §3.4 for assumption risk.

---

## 1. The Memo

### 1.1 The market shift: communities became the product

Three shifts are converging, and each one is measured in budgets, not vibes.

**First, the run-club boom.** Running clubs have become the defining social institution of the post-pandemic decade — the new third place, the new nightlife, credibly the new dating app. Club formation and club size are compounding across every major city on earth. But here is the observation everyone misses: a 450-member run club is not a hobby anymore. It is a small business with recurring events, real money flows, sponsors, merchandise, volunteers, chapters, and safety obligations — **operated with consumer tools and unpaid labor.** Maya Okafor, founder of Lagos Road Runners (450 members), spends 10–20 hours a week on spreadsheets, WhatsApp triage, manual payment reconciliation, and hand-built sponsor decks. Multiply her by every club on the planet: that is the largest pool of unpaid, automatable operational work in consumer life today.

**Second, the creator-economy playbook arrived at communities.** Shopify professionalized merchants. Substack professionalized writers. Nothing has professionalized *community organizers* — even though they hold the scarcest asset in the modern economy: recurring, real-world, high-trust human attention. Organizers now expect to monetize and scale; the infrastructure doesn't exist.

**Third, brands are fleeing paid ads toward communities.** CAC inflation, cookie death, and ad blindness are pushing field-marketing and sponsorship budgets toward verified, local, authentic communities — exactly what run clubs are. But brands can't buy what can't be measured, and clubs can't sell what they can't prove. Sofia Lindqvist, field marketing lead at a running-shoe brand, wants verified running audiences with closed-loop ROI. Today she gets a guessed-at PowerPoint and pays in shoes. That mismatch is a market waiting for rails.

### 1.2 The wedge: organizer pain

We enter through the person with the most acute, most frequent, most underserved pain: **the organizer.** RunOS Year 1 is ruthlessly simple — give Maya one system for members, events, and money (roster + feed + messaging; event builder + QR check-in + waivers; memberships + Stripe Connect payments), with **Pacer**, the club's AI digital COO, automating the repetitive work: drafting, predicting attendance, flagging churn, reconciling payments, planning the month.

The wedge works because it is **single-player.** A club gets 10–15 hours/week of value with zero network required, on a free Starter tier, activating at a canonical bar we can measure (*first 3 events published, 30% of members joined*). Organizers are densely networked with each other — clubs recruit clubs — so the wedge also self-distributes.

### 1.3 The expansion: data layer → benefits → marketplace → network

Every workflow the wedge captures emits structured, consented data into one place: the **Unified Runner Profile** (identity, membership, activity from 10+ sources led by Strava and Garmin, attendance, purchases, community score, lifetime value). That data layer sequences four expansions:

1. **Data layer (Year 1):** fitness ingestion + workflow exhaust → the only complete, consented picture of a running community in existence.
2. **Benefits (Year 1–2):** the **benefits passport** — perks funded by brands, redeemed by verified members, measured end-to-end. Members like Leo Martins finally get something for their loyalty; brands get conversion, not impressions.
3. **Marketplace (Year 2):** vendors like Dr. Emre Kaya (sports physio) fill their calendars with high-intent local athletes; RunOS takes 10% of bookings. Brand Portal seats (from $499/mo) plus campaign fees open the brand-side SaaS line.
4. **Network (Year 3):** anonymized cross-club **network intelligence** (k-anonymity, no segment under 50) makes every club smarter; the **City Portal** lets programs like Amsterdam Active fund and measure community sport; multi-chapter tooling (chapter leads like Priya Sharma) wins federations and franchises on the Network tier.

The north-star metric across all of it: **Weekly Active Community Members (WACM)** — members who attended, logged, posted, redeemed, or transacted in the last 7 days, across all clubs. WACM is the input to every revenue line.

### 1.4 The moat stack

Moats compound in this order:

| Layer | Mechanism | Why it's hard to copy |
|---|---|---|
| **Integration depth** | 10+ fitness sources normalized into one activities schema; Stripe Connect money flows; Shopify, WhatsApp, Mailchimp, Meta orchestration | Years of connector grind + workflow context no horizontal tool will do for one vertical |
| **Consented data** | Member-controlled scopes; club-owned data; verified profiles | The *legitimate* dataset — can't be scraped or bought; trust can't be retrofitted |
| **Network effects** | Cross-club benchmarks improve Pacer for everyone; benefits passport gets richer with each brand; runner profiles travel between clubs | Classic data + marketplace + membership network effects, stacked |
| **Switching costs** | The club's entire operating history — payments, waivers, attendance, automations — lives in one system of record | Leaving RunOS = re-fragmenting the club; organizers remember the before-times |
| **White-label lock-in** | Pro/Network clubs ship *their own* branded apps and sites "Powered by RunOS" | The club's member-facing brand is built on our rails — Shopify-grade stickiness |

---

## 2. Market Sizing (bottom-up, assumptions exposed)

### 2.1 The build

**Population layer** *(assumptions)*:

| Input | Value | Basis / risk |
|---|---|---|
| Regular runners worldwide | ~620M | Industry participation estimates range 400–800M; we use midpoint. **Risk: medium** — definitional ("regular") |
| Runners affiliated with an organized club/crew | ~8% → ~50M | Higher in EU/UK (federation data), lower in emerging markets. **Risk: high** — the least verified number in this memo |
| Average club/crew size | ~110 members | Long tail of 20–50-member crews, fat head of 300–1,000-member clubs. **Risk: medium** |
| **Organized running communities (clubs, crews, chapters)** | **~450,000–500,000** | Derived; treat as ±40% |

**Revenue-per-club layer** (mature platform, per average club per year) *(assumptions)*:

| Line | Math | $/club/yr |
|---|---|---|
| Club SaaS | Tier mix at maturity: 55% Starter (free), 30% Club ($790/yr eq.), 12% Pro ($1,990/yr eq.), 3% Network ($12k+/yr) → blended | ~$840 |
| Payments & ticket fees | 110 members × $70/yr dues+tickets+merch through platform = $7.7k GMV × ~1.3% blended take (platform fee 2%/1%/0.5% by tier + 2% + $0.30 ticket fees + processing margin) | ~$100 |
| Marketplace (10% commission) | 8% of members book 1 vendor session/yr @ $55 | ~$48 |
| Brand-side SaaS + campaigns (allocated) | Brand Portal seats from $499/mo + campaign fees, allocated across active clubs | ~$250 |
| Premium AI add-on ($29/mo on Starter/Club) + API/enterprise licensing | 6% attach on eligible tiers + long tail | ~$75 |
| **Blended potential** | | **~$1,300** |

### 2.2 TAM / SAM / SOM

| | Definition | Math | Result |
|---|---|---|---|
| **TAM (running)** | All organized running communities worldwide, all revenue lines | ~475k clubs × ~$1,300 + standalone brand-side headroom (~$0.3B as brand budgets shift) | **~$0.9–1.2B ARR** |
| **TAM (category)** | Community OS for all organized community sport (the reserved CommunityOS expansion: cycling, triathlon, hyrox, fitness crews — ~3–4M clubs) | 3.5M clubs × ~$1,300 + brand-side | **~$5–7B ARR** |
| **SAM** | Digitally active running clubs ≥50 members in NA + EU/UK + AU/NZ + top LATAM/Africa/Asia metros, reachable via self-serve + inside sales | ~130k clubs × ~$1,800 (richer tier mix in these markets) | **~$230M ARR** |
| **SOM (5 yr)** | 25,000 clubs on platform; ~45% on paid tiers; corresponding GMV, marketplace, and 150+ brands | 25k × blended ~$1,750 + brand-side scaling | **~$45–60M ARR** |

**We are honest that the running-only TAM is ~$1B, not $10B.** The venture case rests on (a) capturing a vertical with winner-take-most network dynamics, (b) the take-rate on a large GMV pool growing underneath the SaaS (18M runners transacting), and (c) the CommunityOS expansion into all community sport once the running network is won — the same shape as Shopify's move from snowboards to everything.

### 2.3 The end-game check

The canonical end-game — **50,000 clubs, 18M runners, 500 brands, 150 countries** — implies at the above per-club economics roughly **$65M from club-side SaaS + fees, ~$60M from 500 brands (avg ~$120k/yr in seats + campaigns), plus marketplace and enterprise licensing → ~$130–180M ARR** with strong gross margins and category ownership. That is the running-vertical prize alone; it is also the launchpad, not the ceiling.

### 2.4 Where the sizing is most fragile

1. **Club-affiliation rate (8%)** — the single highest-leverage assumption; a 4% reality halves TAM. Mitigant: our wedge targets the *existing* organized clubs we can count directly (federations, parkrun-style networks, Meetup/Strava club listings), not the derived number.
2. **Paid-tier mix** — 45% paid at SOM assumes free→paid conversion near best-in-class PLG. Mitigant: upgrade triggers are structural (member caps, white-label, Sponsor CRM), not cosmetic.
3. **Brand budget shift pace** — brand-side revenue depends on sponsorship dollars moving to measurable channels; timing risk more than direction risk.

---

## 3. Business Model & Unit Economics

### 3.1 Revenue architecture (canonical pricing)

| Line | Pricing | Margin profile |
|---|---|---|
| Club SaaS | Starter free · Club $79/mo ($790/yr) · Pro $199/mo ($1,990/yr) · Network custom from $999/mo | 82–85% gross |
| Platform fee on payments | 2% (Starter) · 1% (Club) · 0.5% (Pro) | ~45% after processing costs |
| Ticket fees | 2% + $0.30 per paid registration (Starter/Club) | ~50% |
| Marketplace commission | 10% on vendor bookings | ~85% |
| Brand-side SaaS | Brand Portal seats from $499/mo + campaign fees | 70–75% (campaign ops) |
| Premium AI add-on | $29/mo (Starter/Club) | ~75% after inference costs |
| API access & enterprise licensing | Custom | 85%+ |

### 3.2 Unit economics targets (18–24 month targets, not claims)

| Metric | Self-serve (Starter→Club) | Sales-assisted (Pro) | Network (enterprise) |
|---|---|---|---|
| CAC | ≤ $300 (content, referral, community) | ≤ $1,200 | $8k–15k |
| Year-1 revenue / paying club | ~$950 (SaaS + fees) | ~$2,300 | $15k+ |
| Gross-margin LTV (4-yr paying life, 80% blended GM) | ~$3,000 | ~$7,400 | $50k+ |
| LTV : CAC | ≥ 8:1 | ≥ 5:1 | ≥ 3:1 |
| CAC payback | < 6 months | < 12 months | < 14 months |
| Net revenue retention | ≥ 105% (tier upgrades + GMV growth + add-ons) | ≥ 115% | ≥ 120% (chapter expansion) |

**Why NRR is the quiet star:** clubs grow (member-cap upgrades), transact more (fee lines scale with GMV), and attach more (AI add-on, marketplace, Brand Portal exposure) — revenue expands without new logos.

### 3.3 The economic alignment

The model only monetizes when clubs win: platform fees *fall* as clubs upgrade (2% → 0.5%), and the expansion lines (benefits, marketplace, brand campaigns) pay clubs and members before they pay us. Target state: **the average Pro club earns more through RunOS (sponsorships, memberships collected, merch margin) than it pays RunOS** — which converts pricing objections into ROI conversations and makes churn economically irrational.

---

## 4. Competitive Landscape

### 4.1 The 2×2

Axes: **workflow depth** (how much of the club's operating reality the product runs) × **network value** (how much value comes from other participants on the platform).

```mermaid
quadrantChart
    title Workflow depth × Network value
    x-axis Low workflow depth --> High workflow depth
    y-axis Low network value --> High network value
    quadrant-1 The OS position
    quadrant-2 Audience without operations
    quadrant-3 Point tools
    quadrant-4 Deep tools without network
    Strava Clubs: [0.22, 0.85]
    Eventbrite: [0.35, 0.6]
    Heylo: [0.45, 0.3]
    Circle / Mighty Networks-style: [0.4, 0.22]
    Chief-style curated networks: [0.2, 0.55]
    RaceRoster / Wild Apples-style race platforms: [0.38, 0.4]
    WhatsApp + Sheets status quo: [0.12, 0.1]
    Club-management legacy (per-vertical): [0.6, 0.12]
    RunOS: [0.88, 0.82]
```

### 4.2 Read on each player

| Player | What they own | Why they don't become the OS |
|---|---|---|
| **Strava (Clubs)** | The activity graph and runner attention | Consumer social DNA; clubs are a retention feature, not a customer. No money flows, no CRM, no waivers, no sponsor tooling. We ingest Strava; we don't fight it. |
| **Heylo** | Group-chat-plus for run clubs; closest conceptual neighbor | Communication-first, thin on money/sponsors/intelligence; validates the market while leaving the workflow + monetization + data layers open. Must-watch. |
| **Circle / Mighty Networks (community platforms)** | Horizontal paid-community software | Built for content creators' *online* communities; no fitness data, no events ops (pacers, routes, QR check-in, waivers), no local sponsor economy. Horizontal can't out-vertical a vertical. |
| **Chief-style curated networks** | Premium membership networks | A community *business*, not community *infrastructure*; shows willingness-to-pay for belonging, doesn't sell software to organizers. |
| **Eventbrite** | Ticketing strangers at scale | Transactional, not relational: no membership, no retention, no profile continuity between events. Our Events surface is one of eight. |
| **RaceRoster / Wild Apples-style race platforms** | Race registration & timing | Serve race *directors* on event day; clubs live the other 364 days. Partner surface more than competitor. |
| **Legacy club management (per-vertical: golf, swim, gyms)** | Deep admin for other verticals | Prove vertical OS economics; none has running's culture, data sources, or brand demand. |
| **WhatsApp + Sheets (the real incumbent)** | Free, familiar, everywhere | Our actual competition. Beaten only by 10x workflow relief with zero-dollar entry — hence free Starter + Pacer. |

**Positioning sentence:** everyone else owns a *slice* (activity, chat, tickets, races); RunOS owns the *workflow layer above the slices* — and the consented data layer beneath them.

---

## 5. Risks and Honest Counters

| Risk | Honest version of the concern | Mitigation |
|---|---|---|
| **Chicken-and-egg** | Brands won't come without club scale; the marketplace could stay empty for years | The wedge is deliberately single-player: clubs get full workflow value with zero network. Brand/marketplace lines activate city-by-city (density beats totals — 30 clubs in one metro is a sellable audience for Sofia and a full calendar for Emre). Sequencing is Year 1 workflow → Year 2 ecosystem, not simultaneous. |
| **Strava API dependency** | Strava could restrict its API (it has tightened terms before) and cut off activity ingestion | Ten ingestion sources (Garmin, COROS, Polar, Suunto, Apple Health, Google Health Connect, Fitbit, TrainingPeaks, Zwift) behind one normalized schema — no single point of failure. More fundamentally: our irreplaceable data (attendance, payments, consent, community graph) is *generated inside RunOS*, not imported. Worst case costs us convenience, not the moat. We are additive to Strava (we drive activity uploads), not extractive. |
| **Club churn / volunteer turnover** | Clubs die when founders burn out; volunteer-run orgs are flaky customers | RunOS attacks the *cause* of club death (organizer burnout). Structural mitigations: org-level accounts with staff roles (Owner/Admin/Organizer/…) so clubs outlive founders; the activation bar (3 events, 30% joined) pushes clubs past the fragility zone; the system-of-record data (waivers, payments, history) makes dissolution costlier than continuity. Target: logo churn concentrated in never-activated Starter clubs, where CAC ≈ 0. |
| **Low willingness-to-pay** | Volunteer organizers famously don't pay for software | Three answers. (1) Free Starter matches the incumbent's price (zero) and monetizes via 2% platform fee. (2) Paid tiers are priced against *club revenue we enable* — a club collecting $15k/yr in dues through RunOS doesn't blink at $79/mo. (3) The end-state buyer isn't only the club: brands ($499+/mo seats), vendors (10%), and cities (Network) pay because clubs are there. Clubs are partly the *supply side* we subsidize. |
| **Platform trust / data backlash** | One privacy scandal in a health-adjacent dataset kills the network | Consent scopes enforced in the data layer, conservative defaults, always-opt-in medical & brand scopes, k-anonymity ≥50, aggregate-only brand/city access, EU+US residency. Privacy is a headline feature and a sales weapon, not a compliance chore. |
| **Big-player entry (Strava launches club tools)** | The obvious "what if" | Possible; but it requires Strava to build B2B DNA (payments, CRM, waivers, sponsor sales, white-label) orthogonal to its consumer model — the classic innovator's-dilemma trade. Our speed target: be the system of record for thousands of clubs before anyone with distribution decides to care. |

---

## 6. The Ask (framing template)

> *Template — insert final figures at raise time. The shape below assumes a Series A of $8–12M; scale proportionally.*

**We are raising [$X]M to run an 18–24 month plan with one objective: make RunOS the system of record for [3,000+] clubs and prove the second engine (brand + marketplace revenue) in [5] launch metros.**

### Milestones this capital buys (the next-round story)

| By month | Milestone | Proves |
|---|---|---|
| M6 | Community + Events + Money GA; Pacer v1; activation ≥ 40% of new clubs hit the bar | Wedge works |
| M12 | [1,000+] active clubs, [150k+] WACM, ≥ [25]% clubs on paid tiers, NRR ≥ 105% | PLG engine + willingness-to-pay |
| M18 | Brand Portal live with [20+] paying brands; marketplace live in [5] metros; benefits passport redemptions at scale | Second engine ignites |
| M24 | [$X]M ARR run-rate across ≥3 revenue lines; first Network-tier orgs (multi-chapter/city) live | Category leadership; Series B ready |

### Use of funds shape (18–24 months)

| Allocation | % | What it funds |
|---|---|---|
| Product & engineering | 50% | 8-surface platform depth, integrations grind (10 fitness + business connectors), white-label infra, enterprise-grade security/residency |
| AI & data | 12% | Pacer (Claude-powered generation/planning/agents), churn/attendance/LTV models, network intelligence with k-anonymity |
| Go-to-market | 20% | PLG engine (content, referral, SEO), city-density launches, 2–3 club-side AEs, brand-side founding sales |
| Community & customer success | 10% | Club onboarding & activation, organizer community, lighthouse-club program |
| G&A / ops / legal | 8% | Multi-country payments/compliance, privacy counsel, data residency |

**Why this team, one line:** infrastructure discipline (multi-tenant, consent-first, Stripe-Connect-native architecture from commit one) + product craft at the Linear/Stripe bar + genuine standing in the running community — the three things this company cannot be built without.

**The closing frame:** Strava owns activity. WhatsApp owns communication. Eventbrite owns events. Shopify owns merchandise. **Nobody owns the operating system.** The team that wins the workflow wins the data; the team that wins the data wins the network; the team that wins the network owns the category. That is the position this round buys.

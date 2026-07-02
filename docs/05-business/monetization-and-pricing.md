# RunOS — Monetization & Pricing

> Conforms to `docs/00-foundation/canonical-brief.md`. If anything here disagrees with the brief, the brief wins. All dollar figures USD. All monthly figures are exit run-rates unless labeled otherwise.

---

## 1. Revenue Architecture: The 10 Lines

RunOS makes money the way the product creates value: first by replacing the organizer's tool stack (SaaS), then by sitting inside the money flows we unlock (transaction), then by monetizing the network we build (brand, marketplace, enterprise). Ten lines, one architecture.

**Definition used everywhere in this doc:** MRR = contracted recurring revenue (club SaaS tiers + premium AI add-on + brand-side SaaS seats). Take-rate and campaign revenue are reported separately as transaction + brand revenue and are *not* inside MRR.

### 1.1 Line-by-line

| # | Revenue line | Mechanism | Who pays | Activates (36-mo roadmap) | Gross margin | Why that margin |
|---|---|---|---|---|---|---|
| 1 | **SaaS tiers** (Starter free, Club $79/mo, Pro $199/mo, Network from $999/mo) | Monthly/annual subscription per club org | Maya (organizer); Amsterdam Active / franchises for Network | Phase 1, Month 1 (launch) | 87% | Standard multi-tenant SaaS; COGS = AWS, Postgres/ClickHouse, support. Pacer inference on Pro is metered internally but small vs. price |
| 2 | **Premium AI add-on** — $29/mo on Starter/Club | Unlocks Pacer beyond the free monthly allowance (drafting, planning, predictions-lite) | Maya, on Starter/Club | Phase 1, Month 4 | 70% | Claude API inference is real COGS; capped context + caching keeps it at ~$8–9/club/mo at typical usage |
| 3 | **Marketplace commission — 10%** on vendor bookings | Application fee on Stripe Connect when a member books Dr. Emre Kaya through the club's vendor marketplace | Vendor (deducted from payout) | Beta Month 10; GA Phase 3, Month 13 | 90% | Pure take-rate; COGS is Stripe processing on our fee slice + dispute handling |
| 4 | **Brand-side SaaS** — Brand Portal seats from $499/mo + campaign fees | Sofia's team subscribes to the Brand Portal (audience insight, campaign manager, ROI reporting); campaign fees per activation on top | Brand (Sofia Lindqvist) | Seats: Month 7 (pilot), GA Month 10. Campaign fees: pilots Month 10, GA Month 13 | 85% (seats), 75% (campaigns) | Seats are SaaS; campaigns carry success-management labor |
| 5 | **Payment processing margin** | Spread between our blended processing price and Stripe's cost on volume routed through Stripe Connect (~0.10–0.15% capture) | Absorbed inside processing cost paid by club/member | Phase 1, Month 2 (with Stripe Connect) | 90% | Near-pure spread; COGS is reconciliation tooling and fraud/dispute ops |
| 6 | **Ticket fees** — 2% + $0.30 per paid registration on Starter/Club | Per-registration application fee at checkout; **waived on Pro and Network** (upgrade trigger) | Registrant (surfaced as a booking fee) or club (absorbs it — club's choice) | Phase 1, Month 2 | 75% | The $0.30 fixed component partially covers Stripe's fixed fee; small-ticket events compress margin |
| 7 | **Membership fees processing** — platform fee on dues | The tiered platform fee (Starter 2%, Club 1%, Pro 0.5%, Network 0.5% custom) applied to membership dues and other club payments collected via Stripe Connect | Club (deducted from payout) | Phase 1, Month 2 | 88% | Application-fee take on money already flowing; COGS = payout ops + support |
| 8 | **Merchandise** (Shopify integration + native light commerce) | Shopify: referral/affiliate rev share on connected stores. Native light commerce: 5% take on orders processed in-platform | Club (native take) / Shopify (referral) | Phase 3, Month 14 | 60% native / 95% referral | Native carries order support and payment COGS; referral is nearly free money |
| 9 | **API access** | Metered/committed API plans for partners and Network customers building on the public REST API | Network customers, integration partners, cities | Phase 3, Month 18 (public API GA) | 90% | Compute + rate-limit infra; near-zero marginal cost |
| 10 | **Enterprise licensing** | Annual contracts: cities (Amsterdam Active), federations, franchise HQs — white-label mobile, SSO, SLA, data residency, dedicated CSM. Includes City Portal licenses | City sports offices, federations, franchise HQs | Pilot Month 9; GA Phase 4, Month 20; scaled Months 25–36 | 80% | CSM and solutions-engineering labor per account; still software-margin at core |

### 1.2 Activation map on the 36-month roadmap

| Phase | Months | Lines live | Logic |
|---|---|---|---|
| Phase 1 — Founding wedge | 1–6 | 1, 5, 6, 7 (+2 at M4) | Get 50 founding clubs paying and moving money. SaaS + payment rails only. Don't monetize a network that doesn't exist yet |
| Phase 2 — Self-serve engine | 7–12 | + 4 (seats), marketplace beta, campaign pilots, enterprise pilot | Brands and vendors arrive once we have verified audiences worth paying for |
| Phase 3 — Network monetization | 13–24 | + 3 (GA), 8, 9, campaign fees GA | GMV lines scale with WACM; API opens the platform |
| Phase 4 — Ecosystem | 25–36 | + 10 at scale; international PPP bands widen | Enterprise licensing and brand spend become co-primary engines |

### 1.3 Three-year revenue mix shift

Classification: **SaaS** = lines 1 + 2 + Brand Portal seats (recurring software). **Transaction + brand** = lines 3, 5, 6, 7, 8, 9 + campaign fees + line 10.

| Revenue bucket | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Club SaaS (tiers + AI add-on) | 68% | 52% | 42% |
| Brand Portal seats (SaaS) | 12% | 13% | 13% |
| **SaaS subtotal** | **~80%** | **~65%** | **~55%** |
| Membership platform fees + payment margin | 9% | 10% | 10% |
| Ticket fees | 7% | 8% | 8% |
| Marketplace commission | 1% | 6% | 9% |
| Campaign fees | 3% | 6% | 9% |
| Merch + API access | <1% | 2% | 4% |
| Enterprise licensing | <1% | 3% | 5% |
| **Transaction + brand subtotal** | **~20%** | **~35%** | **~45%** |

The shift is deliberate: SaaS buys us distribution and data; transaction and brand revenue scale with WACM, not with sales headcount. By Year 3 roughly half of revenue grows when members show up to run — which is exactly what the product optimizes.

---

## 2. Pricing Page Spec

### 2.1 Tier table (page hero)

| | **Starter** | **Club** | **Pro** | **Network** |
|---|---|---|---|---|
| Price | **Free** | **$79/mo** · $790/yr (2 months free) | **$199/mo** · $1,990/yr (2 months free) | **Custom, from $999/mo** |
| For | New clubs finding their feet | Growing clubs done with spreadsheets | Serious clubs with sponsors and scale | Multi-chapter orgs, franchises, cities, federations |
| Member cap | < 50 | 500 | 2,000 | Unlimited |
| Platform fee on payments | 2% | 1% | 0.5% | 0.5% (custom) |
| Ticket fee (paid registrations) | 2% + $0.30 | 2% + $0.30 | Waived | Waived |
| Branding | RunOS branding | RunOS branding | White-label web | White-label web + mobile app |
| Pacer AI | Trial allowance | Allowance (+$29/mo unlimited add-on) | **Unlimited** | Unlimited |
| CTA | Start free | Start 14-day trial | Start 14-day trial | Talk to us |

Sub-line under the table, in brand voice: *"We run the boring stuff so you can run the club. Start free. Upgrade when your club outgrows you."*

### 2.2 Full feature gating matrix (all 8 surfaces)

| Surface / module | Starter | Club | Pro | Network |
|---|---|---|---|---|
| **COMMUNITY** | | | | |
| Member CRM + unified runner profile | Yes (<50 members) | Yes (500) | Yes (2,000) | Yes (unlimited) |
| Community feed + messaging | Yes | Yes | Yes | Yes |
| Segments | 3 saved segments | Unlimited | Unlimited + dynamic AI segments | Unlimited, cross-chapter |
| Community score | View only | Full | Full + trends | Full, cross-chapter rollup |
| Volunteer management | — | Yes | Yes | Yes |
| **EVENTS** | | | | |
| Event builder + registrations + QR check-in | Yes (4 events/mo) | Unlimited | Unlimited | Unlimited |
| Waivers, waitlists, routes library | Waivers only | Yes | Yes | Yes |
| Pacers, equipment, weather, live attendance | — | Yes | Yes | Yes |
| Emergency/medical (consented, `health.medical`) | — | Yes | Yes | Yes |
| **MONEY** | | | | |
| Payments (Stripe Connect) | Yes, 2% fee | Yes, 1% fee | Yes, 0.5% fee | Yes, 0.5% custom |
| Memberships (recurring dues) | 1 plan | 5 plans | Unlimited plans | Unlimited, per-chapter billing |
| Ticket fees | 2% + $0.30 | 2% + $0.30 | Waived | Waived |
| Finance, invoices, budget | Basic ledger | Yes | Yes + revenue forecasting hooks | Yes + consolidated multi-chapter |
| Merchandise (Shopify + native light commerce) | — | Native light commerce | + Shopify integration | + franchise merch programs |
| **GROWTH** | | | | |
| Growth OS automations | — | 10 active automations | Unlimited | Unlimited |
| Customer journey builder + funnel builder | — | Yes | Yes + multi-branch | Yes, cross-chapter |
| Landing pages | 1 page, RunOS branding | 10 pages | Unlimited, white-label | Unlimited, white-label |
| Email/SMS/push | Email only, 500/mo | 5,000 email + SMS/push metered | 25,000 email + SMS/push included | Custom volumes |
| Referral engine + surveys + content generation | Referral only | Yes | Yes | Yes |
| **ENGAGE** | | | | |
| Challenges + leaderboards + gamification | 1 active challenge | Unlimited | Unlimited | Unlimited, network challenges |
| Rewards | — | Yes | Yes | Yes |
| Benefits passport (exclusive perks) | — | **Yes** | Yes + premium perk pool | Yes + city/federation perks |
| Ambassador management | — | — | Yes | Yes |
| **PARTNERS** | | | | |
| Sponsor CRM | — | — | **Yes** | Yes |
| Brand Portal (club side: receive campaigns) | — | Opt-in to network campaigns | **Full: pitch, host, report** | Full |
| Vendor marketplace | Browse | Book (10% commission to vendors) | Book + featured placements | Book + curated vendor pools |
| Campaign manager + partnership ROI reporting | — | — | Yes | Yes |
| City Portal | — | — | — | **Yes** |
| **INTELLIGENCE** | | | | |
| Analytics dashboards | Core (attendance, growth) | Full club analytics | Full + cohorts | Full + cross-chapter |
| Attendance prediction, churn prediction, revenue forecasting | — | — | **Yes** | Yes |
| Network intelligence (anonymized benchmarks) | — | Teaser card | **Full benchmarks** | Full + city aggregates |
| Pacer AI ("your club's digital COO") | Trial: 20 actions/mo | 50 actions/mo; **$29/mo add-on = unlimited** | **Unlimited** | Unlimited + custom playbooks |
| **PLATFORM** | | | | |
| Roles & permissions | Owner/Admin/Organizer | All 8 staff roles | + Custom roles | + SSO (SAML/OIDC) |
| Integrations (Strava, Garmin, Mailchimp, Slack, WhatsApp…) | 2 fitness connectors | **All connectors** | All + priority sync | All + custom connectors |
| White-label website | — | — | **Yes** | Yes |
| White-label mobile app | — | — | — | **Yes** |
| API access | — | — | Read-only keys | **Full API + webhooks** |
| Multi-chapter & franchise management | — | — | 2 chapters | **Unlimited** |
| Support & SLA | Community + docs | Email, 24h | Priority, 8h | **SLA + dedicated CSM** |

### 2.3 Gating logic (why each wall is where it is)

Every gate is placed where a club *feels* it right as it grows — never before.

- **Starter → Club pull:** the 50-member cap and the 2% platform fee. The moment a free club works, it hits both. Growth OS, the benefits passport, and the full integration set are the carrots; the cap and the fee are the sticks. A 100-member club moving $1,000/mo saves $10/mo in fees and unlocks the automations that save Maya her Sunday.
- **Club → Pro pull (the big one):** five stacked triggers, each tied to a real growth moment:
  1. **Pacer unlimited.** Club-tier organizers hit the 50-action allowance in week two once they taste "Plan October." The $29 add-on is the bridge; Pro dissolves it into the tier ($29 add-on + $79 = $108 vs. $199 with everything below — the add-on is deliberately a half-step, not a destination).
  2. **Sponsor CRM + Brand Portal.** The first time a local shop offers Maya $500, she has nowhere professional to put it on Club tier. Sponsor money only flows on Pro — and one mid-size sponsorship pays for a year of Pro.
  3. **White-label web.** Clubs with real brands want their name, not ours.
  4. **Predictions.** Attendance, churn, and revenue forecasting are visible-but-locked cards on Club dashboards ("Pacer predicts 62 runners Saturday — unlock on Pro").
  5. **Member cap 500 → 2,000 + platform fee 1% → 0.5% + ticket fees waived.** A 500-member club selling 100 paid registrations/mo at $15 saves ~$45/mo in ticket + platform fees alone by upgrading. The fee step-down means the more money a club moves, the cheaper Pro effectively gets — expansion is built into the fee schedule.
- **Pro → Network pull:** unlimited members, the white-label **mobile** app (the thing members actually ask for), multi-chapter/franchise management beyond 2 chapters (Priya Sharma's chapter gets real autonomy), full API, SSO, SLA, dedicated CSM, City Portal. Nobody buys Network for features; they buy it because they became an organization.
- **What we never gate:** safety (waivers on every tier), consent controls (all seven scopes on every tier), and data export. Data belongs to the club. Holding it hostage is not a retention strategy; being indispensable is.

---

## 3. The Grand Slam Offer (Club Onboarding)

### 3.1 Naming

**"The Founding 50"** — the founding-club program for the first 50 clubs across Amsterdam, London, Berlin, New York City, and Austin. Ten clubs per city. That's it.

### 3.2 The value stack (what Maya sees)

Headline: *"Everything your club runs on. Set up for you. At a price that never goes up."*

| Line item | What it is | Dollar value |
|---|---|---|
| White-glove migration | We move your members, events, waivers, and payment history out of WhatsApp threads, Google Sheets, and Eventbrite. Done-for-you in 14 days | $1,500 |
| Founding onboarding sprint | 3 working sessions: club setup, first 3 events published, Stripe connected, automations live | $900 |
| Pacer launch pack | 12 pre-built automations + your first month of newsletters, event pages, and Instagram carousels drafted by Pacer | $750 |
| 90-day growth playbook | The referral engine, benefits passport, and challenge calendar configured for your city | $600 |
| Founding-club badge + roadmap council | Your club's name in the product, quarterly call that steers the roadmap | $500 |
| Founding pricing, locked for life | Club at **$49/mo forever** (list $79) or Pro at **$129/mo forever** (list $199) | $360–$840/yr, every year, forever |
| **Total stacked value (year one)** | | **$5,090+** |
| **You pay** | | **$49/mo (Club) or $129/mo (Pro)** |

### 3.3 Risk reversal

Three layers, so the risk sits with us, not Maya:

1. **Free migration service.** If moving is the reason you'd say no, we removed it. Our team does the move, you approve it.
2. **60-day money-back guarantee.** Run two full months of events on RunOS. If your club isn't measurably easier to run, we refund every subscription dollar. No form, no call, one email.
3. **Founding pricing locked for life.** The price you join at is the price you keep — through every feature we ever ship. If we raise prices later (we will), founding clubs never feel it.

### 3.4 Urgency and scarcity (real, enforced, published)

- **50 clubs. 5 cities. 10 per city.** A public counter on the landing page per city ("Berlin: 3 spots left"). When a city fills, it closes — waitlist only.
- **Cohort deadline:** each city's founding cohort onboards together in a 4-week sprint; miss the window, join at list price.
- **Why the scarcity is honest:** white-glove migration is human labor. We genuinely cannot do more than 50 well. Say exactly that on the page.

### 3.5 The brand-side offer (for Sofia)

**"First Verified Mile"** — the founding brand program for the Brand Portal.

Headline: *"Stop sponsoring logos. Start reaching runners who actually show up."*

| Line item | What it is | Dollar value |
|---|---|---|
| Brand Portal seat, founding rate | Audience insights (aggregated + consented only), campaign manager, ROI reporting — $499/mo list, founding brands lock $399/mo for year one | $1,200/yr saved |
| First campaign fee waived | Launch your first perk or activation across founding clubs at no campaign fee | $2,500 |
| Verified-audience audit | Anonymized benchmark report: weekly-active runners, event attendance, redemption behavior in your launch cities | $3,000 |
| Dedicated campaign strategist for the first activation | We co-build the offer, the drop, and the measurement plan | $1,500 |
| **Total stacked value** | | **$8,200** |
| **You pay** | | **$399/mo (12-month founding term)** |

Risk reversal for Sofia: if the first campaign doesn't beat her current sponsorship CPA benchmark (agreed in writing at kickoff), the next campaign's fee is waived too. Scarcity: 10 founding brand seats total (2 per launch city vertical: footwear, apparel, nutrition, recovery, local retail). Guardrail that keeps trust: brands only ever see aggregated, anonymized data unless a member opts in via `marketing.brands` — that's in the offer copy, because verified consent *is* the product.

---

## 4. Packaging Edge Cases

| Case | Policy |
|---|---|
| **Nonprofits & schools** | 20% off Club and Pro (monthly or annual) with registered nonprofit / school documentation. Not stackable with founding pricing (founding is already deeper). Platform and ticket fees unchanged — they fund the rails |
| **Founding-club program terms** | 50 clubs max; must complete migration within 45 days of signup; founding price is locked for life on the tier purchased (upgrading Club→Pro moves to founding Pro $129/mo while founding seats remain, list price after program closes); price lock survives feature additions; lapsed accounts >90 days forfeit the lock; 60-day money-back guarantee from first paid day |
| **Regional pricing (PPP bands)** | Applied automatically by club billing country, subscription only (platform fees, ticket fees, marketplace commission unchanged). **Band A ×1.0:** US, UK, NL, DE, and peer markets — Club $79, Pro $199. **Band B ×0.7:** Southern/Eastern EU, upper-middle-income LatAm — Club $55, Pro $139. **Band C ×0.5:** Nigeria, India, SE Asia and peer markets — Club $39, Pro $99 (Lagos Road Runners pays $39/mo at Club). Anti-arbitrage: band follows Stripe Connect payout country. Network is always custom-quoted |
| **Annual incentive** | 2 months free, everywhere it's shown: Club $790/yr (vs. $948 monthly), Pro $1,990/yr (vs. $2,388). Annual also unlocks priority migration scheduling. PPP bands apply the same ×12−2 math (Band C Club: $390/yr) |
| **Referral** | Give 2 months free, get 2 months free: referred club gets 2 free months on any paid tier; referring club gets 2 free months credited on activation of the referred club (club activated = 3 events published + 30% of members joined + Stripe connected). Credits stack up to 12 months/year |

---

## 5. Unit Economics Model

### 5.1 The reconciled Q4 (Month-12 exit) base

This is the same model the OKR doc uses. Tier mix at 500 clubs (Network chapters count toward club count):

| Tier | Clubs | Subscription math | Sub MRR |
|---|---|---|---|
| Starter | 155 | Free | $0 |
| Club | 200 | 35 founding × $49 + 165 × $79 | $1,715 + $13,035 = **$14,750** |
| Pro | 85 | 15 founding × $129 + 70 × $199 | $1,935 + $13,930 = **$15,865** |
| Network | 15 orgs (~60 chapters) | 15 × $1,300 avg | **$19,500** |
| **Subscriptions** | **500** | | **$50,115** |
| AI add-on | 125 attached (25 Starter, 100 Club; 35% of eligible) | 125 × $29 | **$3,625** |
| Brand Portal seats | 13 | 13 × $499 avg | **$6,487** |
| **Total MRR** | | | **$60,227 ≈ $60k** ✓ |

### 5.2 Take-rate revenue at Q4 exit (not in MRR) — worked GMV math

Assumptions per average club per month, Q4:

| Tier | Membership/payments GMV | Platform fee | Paid registrations | Ticket fee revenue |
|---|---|---|---|---|
| Starter | $150 | 2% → $3.00 | 5 × $15 avg | 5 × ($0.30 + 2%×$15) = **$3.00** |
| Club | $1,500 | 1% → $15.00 | 40 × $15 avg | 40 × $0.60 = **$24.00** |
| Pro | $5,000 | 0.5% → $25.00 | 120 (fee waived) | $0 |
| Network chapter | $2,000 | 0.5% → $10.00 | waived | $0 |

Totals at Q4 mix:

| Line | Math | $/mo |
|---|---|---|
| Membership platform fees (line 7) | 155×$3 + 200×$15 + 85×$25 + 60×$10 | **$6,190** |
| Ticket fees (line 6) | 155×$3 + 200×$24 | **$5,265** |
| Payment processing margin (line 5) | ~0.12% on ~$750k/mo processed volume (memberships + tickets) | **$900** |
| Campaign fee pilots (line 4b) | 1/mo × $2,000 | **$2,000** |
| Marketplace beta (line 3) | ~50 bookings × $60 × 10% | **$300** |
| **Transaction + brand (non-MRR)** | | **$14,655** |

**Q4 total revenue run-rate: $60,227 + $14,655 ≈ $74.9k/mo (~$899k ARR run-rate).** Full-year Year 1 revenue ≈ $270k recurring + $65k transactional ≈ $335k → **~80/20 SaaS vs. transaction+brand** ✓ (matches §1.3).

### 5.3 Per-tier ARPU build-up (Q4, per club per month)

| Component | Starter | Club | Pro | Network (per org) |
|---|---|---|---|---|
| Subscription | $0 | $73.75 (blend of founding + list) | $186.65 (blend) | $1,300 |
| AI add-on (attach-weighted) | $4.68 (25/155 × $29) | $14.50 (100/200 × $29) | included | included |
| Platform fee | $3.00 | $15.00 | $25.00 | $40.00 (4 chapters × $10) |
| Ticket fees | $3.00 | $24.00 | $0 | $0 |
| Processing margin (allocated) | $0.40 | $2.00 | $5.50 | $8.00 |
| **ARPU** | **$11.08** | **$129.25** | **$217.15** | **$1,348** |

### 5.4 Blended ARPU by year

| Year | Clubs (exit) | MRR (exit) | Transaction+brand $/mo (exit) | Blended ARPU/club/mo (all clubs incl. free) | Blended ARPU/paying entity |
|---|---|---|---|---|---|
| Y1 | 500 | $60k | $15k | **$150** | $250 (300 paying: 200 Club + 85 Pro + 15 Network) |
| Y2 | 1,800 | $210k | $115k (marketplace GA, merch, campaigns) | **$181** | $290 |
| Y3 | 4,000 | $520k | $420k (brand + marketplace + enterprise at scale) | **$235** | $355 |

ARPU rises without raising list prices: mix shifts to Pro/Network, add-on attach grows, and take-rate revenue compounds with GMV per club. That is the engine — clubs get bigger, we earn more, they pay a *lower percentage* of their money flow. Aligned incentives.

### 5.5 Gross margin by line (restated) and blended

| Line | GM | Y1 weight | Y3 weight |
|---|---|---|---|
| SaaS tiers | 87% | 68% | 42% |
| AI add-on | 70% | 5% | 4% |
| Brand seats | 85% | 12% | 13% |
| Platform fees + processing margin | 88–90% | 9% | 10% |
| Ticket fees | 75% | 7% | 8% |
| Marketplace | 90% | 1% | 9% |
| Campaign fees | 75% | 3% | 9% |
| Merch + API | 60–95% | <1% | 4% |
| Enterprise licensing | 80% | <1% | 5% |
| **Blended GM** | | **~84%** | **~82%** |

Margin holds through the mix shift because the transaction lines we scale are high-margin take-rates, not fulfillment businesses.

### 5.6 LTV : CAC and payback targets by channel

| Channel | Typical tier landed | CAC target | Monthly gross margin/account | LTV (48-mo horizon, churn-adjusted) | LTV:CAC target | Payback target |
|---|---|---|---|---|---|---|
| Community-led (founding program, referrals, run-crew word of mouth) | Club | ≤ $450 | ~$110 (85% of $129 ARPU) | ~$4,300 | **≥ 5:1** | **≤ 6 months** (actual ~4) |
| Self-serve content/SEO/product-led (Starter → Club) | Club | ≤ $700 | ~$110 | ~$4,300 | **≥ 5:1** | ≤ 6 months |
| Sales-assisted outbound (Pro) | Pro | ≤ $2,900 | ~$185 (85% of $217) | ~$8,700 | **≥ 3:1** | ≤ 12 months |
| Enterprise / Network | Network | ≤ $13,000 | ~$1,080 (80% of $1,348) | ~$45,000 | ≥ 3:1 | **≤ 12 months** |
| Brand-side sales | Brand seat | ≤ $6,000 | ~$425 + campaign margin | ~$18,000 | ≥ 3:1 | ≤ 12 months |

Rules: referral cost (2 months free × 2) is charged to CAC of the referred club (~$158 at Club founding pricing — the cheapest channel we have, protect it). Any channel below 3:1 for two consecutive quarters gets paused, not "optimized."

---

## 6. Expansion Revenue Engine (NRR)

### 6.1 Targets

**NRR 110% exiting Year 1 → 120% Year 2 → 125%+ Year 3.**

### 6.2 The four expansion mechanics (in order of contribution)

1. **Member-count growth → tier upgrades.** The referral engine, challenges, and benefits passport grow the member base; caps at 50/500/2,000 convert member growth into MRR mechanically. This is the flywheel: our Growth surface literally manufactures our own expansion revenue.
2. **Tier upgrades on capability walls.** Club→Pro on Sponsor CRM, Pacer unlimited, predictions, white-label (see §2.3). Pro→Network on chapters and the mobile app.
3. **Add-on attach.** $29 AI add-on on Starter/Club; target attach 35% of eligible clubs by Q4, 45% by Y2 (the add-on doubles as the Pro on-ramp).
4. **GMV growth inside the account.** More members → more dues, tickets, bookings, merch → take-rate revenue grows with zero sales effort. (Reported alongside NRR as "net revenue expansion incl. take-rate," but the headline NRR is subscription-only for comparability.)

### 6.3 Worked NRR bridge (subscription MRR, 12 months)

Cohort: 100 paying clubs that started in Q2 of Year 1, starting MRR **$10,000** (avg $100/club: mix of Club, Pro, add-ons).

| Bridge component | Clubs affected | MRR impact |
|---|---|---|
| Starting cohort MRR (month 0) | 100 | **$10,000** |
| Churn (clubs leaving) | −16 clubs over 12 mo (~1.4%/mo logo churn, skews to smallest accounts) | −$1,350 |
| Downgrades (Pro→Club, add-on off) | 5 clubs | −$450 |
| **Gross retention** | | **$8,200 (82%)** |
| Tier upgrades Club→Pro (sponsor money, predictions, cap) | 9 clubs × avg +$120 | +$1,080 |
| Member-cap upgrades within/into tiers | 6 clubs | +$620 |
| AI add-on attach during year | 28 clubs × $29 | +$810 |
| Pro→Network conversion | 1 org | +$290 (blended) |
| **Expansion subtotal** | | **+$2,800** |
| **Ending cohort MRR (month 12)** | | **$11,000** |
| **NRR** | | **$11,000 / $10,000 = 110%** ✓ |

Path to 120%/125%: gross retention rises to ~87% as founding-cohort quality and activation discipline compound (activated clubs — 3 events + 30% joined + Stripe connected — churn at roughly a third the rate of non-activated); expansion rises as marketplace and merch land inside existing accounts and the Pro mix deepens. Every quarter, the growth team publishes this exact bridge per cohort.

### 6.4 Operating the engine

- **Expansion is product-triggered, not sales-triggered:** in-app upgrade prompts fire on cap-proximity (80% of member cap), locked-card interactions (predictions, Sponsor CRM), and Pacer allowance exhaustion. Sales touches only Pro→Network and brand-side.
- **Churn defense = activation + WACM:** accounts falling below 20% weekly-active members for 3 consecutive weeks enter a Pacer-driven win-back journey; CSM alert on Pro+.
- **Counter-guardrail:** no dark patterns. Downgrades are one click, exports always work, and the 60-day guarantee is honored without friction. We keep clubs because Saturday morning runs better on RunOS — not because leaving is hard.

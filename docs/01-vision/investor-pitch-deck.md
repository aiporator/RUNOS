# RunOS Investor Pitch Deck — 16 Slides, Build-Ready

> **Status:** Canonical. Consistent with [`docs/00-foundation/canonical-brief.md`](../00-foundation/canonical-brief.md) and [`investor-narrative.md`](investor-narrative.md).
> **Format notes for the designer:** 16:9, dark "asphalt" background with "chalk" type and one flare-orange accent (see [`brand-strategy.md`](brand-strategy.md) §6). One idea per slide. Numbers in tabular figures. Anything in `[brackets]` is a template field to fill with live data at raise time.
> **Delivery target:** 18 minutes of talk + Q&A. Speaker notes below are what to SAY, roughly verbatim.

---

## Slide 1 — Cold Open / Hook

**TITLE:** *(no visible title — logo only, bottom corner)*

**Headline sentence:** **Strava owns activity. WhatsApp owns communication. Eventbrite owns events. Shopify owns merchandise. Nobody owns the operating system.**

**Body bullets:** none. The cascade is the slide.

**Visual to build:** Black slide. The five lines appear one at a time (build on click), each as a single large line of text: logo-word of each company in its own muted gray wordmark style + "owns X". The final line — "**Nobody owns the operating system.**" — lands alone, larger, in flare orange, with everything above dimming to 30%. After a beat, a small RunOS wordmark fades in bottom-right with the tagline *The Operating System for Running Communities*.

**Speaker notes:** "Think about a running club — maybe you've seen them take over your city's parks every Saturday morning. Strava owns their activity data. WhatsApp owns their communication. Instagram owns their attention. Eventbrite owns their events. Shopify owns their merch. Six companies own six slices of that club's life. [pause] Nobody owns the operating system. Nobody owns the layer where the club actually *runs*. That layer is worth more than any slice — and that's what we're building. We're RunOS."

---

## Slide 2 — Problem

**TITLE:** Running a club is a second unpaid job

**Headline sentence:** **Meet Maya: 450 members, 8 disconnected tools, 15 hours a week of unpaid admin.**

**Body bullets:**
- Maya Okafor founded Lagos Road Runners — 450 members, real money, real sponsors, real safety obligations
- Her stack: spreadsheets, 4 WhatsApp groups, Google Forms, Venmo screenshots, hand-built PowerPoint sponsor decks
- The costs: organizer burnout kills clubs · members churn silently · sponsor money stays small and unmeasurable · the club's own data evaporates across silos

**Visual to build:** Left half: a warm documentary photo of a real club organizer at 10:30 PM, laptop open, phone in hand. Right half: her actual "stack" rendered as 8 floating, disconnected app tiles (Sheets, WhatsApp ×4 badge "214 unread", Forms, Venmo, Instagram, PowerPoint, Eventbrite, Strava) with broken/dashed lines between them. Bottom strip: three stat callouts — "10–20 hrs/week unpaid admin" · "8 tools, 0 sources of truth" · "sponsorship paid in shoes, not cash".

**Speaker notes:** "This is Maya. She founded Lagos Road Runners four years ago; it's 450 members now. That's not a hobby — that's a small business: recurring events, dues, sponsors, merch, waivers, volunteers. And she runs it on this. [gesture at the tiles] Tuesday morning she wakes up to 214 unread WhatsApp messages. Lunch break, she builds a Google Form and prays she orders the right number of bananas — last month 140 people showed up when she planned for 60. Evening, a shoe brand asks for her audience data and she opens PowerPoint and starts *guessing*. Maya is the CRM, the treasurer, the events team, and the sponsorship agency — unpaid, after her real job. Multiply Maya by hundreds of thousands of clubs worldwide. That's the problem."

---

## Slide 3 — Why Now

**TITLE:** Three curves crossing

**Headline sentence:** **The run-club boom, the creator-economy of communities, and brands fleeing paid ads are converging — and AI just made the solution buildable.**

**Body bullets:**
- **Run-club boom:** clubs became the third place of a generation — formation and size compounding in every major city
- **Creator-economy of communities:** organizers now expect to professionalize and monetize, like merchants (Shopify) and writers (Substack) before them — the tooling doesn't exist
- **Brands → communities:** CAC inflation + cookie death push sponsorship budgets to verified local communities — which today can't prove anything
- **AI unlock:** an "AI COO" grounded in a club's own data was a demo two years ago; it ships today

**Visual to build:** Three upward curves on one chart (stylized, labeled, no fake precision): "clubs formed", "community monetization tools adoption", "brand $ shifting from paid social" — converging toward a marked intersection point labeled "2026". Below the chart, a fourth element set apart: a small chip reading "LLMs + commodity fintech rails = buildable now".

**Speaker notes:** "Why does this company happen now and not five years ago? Three demand curves and one supply unlock. Demand: running clubs exploded post-pandemic into the default way a generation socializes. The organizers of those clubs watched creators professionalize on Shopify and Substack and expect the same for communities. And brands — brands are desperate to escape paid social and buy *real* community, but they can't buy what can't be measured. Supply: two years ago, the 'digital COO' we'll show you was science fiction. Today, language models grounded in a club's own structured data, plus Stripe Connect, plus device APIs, make it a product. The window is open right now."

---

## Slide 4 — Product: The OS

**TITLE:** RunOS — one login, one database, one workflow, one ecosystem

**Headline sentence:** **Eight surfaces run the whole club; Pacer, the club's AI COO, runs the repetitive work.**

**Body bullets:**
- **Community · Events · Money · Growth · Engage · Partners · Intelligence · Platform** — every operational job, one system
- **Pacer** drafts, predicts, reconciles, and plans: attendance prediction, churn-risk lists, sponsor proposals, newsletters, "Plan October"
- Infrastructure, not another app: orchestrates Strava, Garmin, WhatsApp, Stripe, Shopify — owns the workflow above them
- White-label: on Pro/Network, members see *the club's* app — "Powered by RunOS"

**Visual to build:** Product-real hero: an organizer-console screenshot (light UI) center-stage showing the home dashboard with the ⌘K Pacer command bar invoked. Around it, a ring of the 8 surface icons, each connected to a central "one database" node. Bottom-left inset: a member phone (dark UI) skinned as "Lagos Road Runners" with a subtle "Powered by RunOS" footer — visually proving white-label. No lorem ipsum: real-looking club data.

**Speaker notes:** "RunOS is the operating system: eight surfaces covering everything a club does — members and CRM, events with QR check-in and waivers, money on Stripe Connect, growth automations, engagement and challenges, sponsors and partners, analytics and predictions, and the platform layer with white-label apps. One login, one database — so everything joins with everything. And woven through all of it is Pacer, the club's digital COO. Pacer doesn't chat; Pacer *works*: it predicts Saturday's attendance, flags the fourteen members about to churn, drafts the sponsor proposal, and plans October. And here's the positioning that matters: we don't replace Strava or WhatsApp — we orchestrate them. To Maya's members, RunOS can be invisible: they see the Lagos Road Runners app, powered by us. Infrastructure, not another app."

---

## Slide 5 — Demo Storyboard

**TITLE:** Maya's Tuesday, before and after

**Headline sentence:** **The same club day — 15 hours of admin collapsed into three taps.**

**Body bullets** *(rendered as the storyboard frames, not bullets)*:
1. **6:05 AM — Pacer digest:** "2 members welcomed, 3 payments reconciled, Saturday at 87 registered / 121 predicted, 14 churn risks — start win-back?" → tap **Yes**
2. **12:40 PM — Event review:** Pacer pre-built Saturday's long run from the recurring template — route, pacers, waiver, QR check-in, weather watch → tap **Publish** (feed + push + club site update, automatically)
3. **7:00 PM — Sponsor proposal:** brand inquiry sits in Sponsor CRM; Pacer drafted the proposal from live verified data → edit two lines, tap **Send Brand Portal link**
4. **7:10 PM — Done.** Evening returned. Every action just became data: attendance, revenue, consent-safe audience proof

**Visual to build:** A 4-frame filmstrip, left to right, each frame an actual product screen (phone for frames 1–2, desktop for frame 3, photo of a sunset run for frame 4). Under each frame, a timestamp chip and the single action taken ("Yes" / "Publish" / "Send"). A thin "time saved" bar above the strip fills from "15 hrs/week" toward "~0" across the frames. *(If presenting live, this slide is replaced by a 3-minute live demo following exactly this script.)*

**Speaker notes:** "Let me show you the product the way Maya feels it. [Frame 1] Tuesday, 6:05 AM — instead of 214 WhatsApp messages, one Pacer digest: overnight work already done, one decision needed. She taps yes and goes for her own run. [Frame 2] Lunch: Saturday's event isn't created, it's *reviewed* — Pacer built it from the club's template: route from the library, pacer assignments, waiver, QR check-in. One tap: publish. It hits the feed, the right pace groups' phones, and the club website simultaneously. [Frame 3] Evening: that shoe brand from slide two? Their inquiry is in the Sponsor CRM, and the proposal is drafted from *live, consented, verified* data — 450 members, 61% weekly-active, real attendance numbers. She sends a live portal link, not a guessed PDF. [Frame 4] It's 7:10 PM and Maya's day as an unpaid admin is over. And notice what happened underneath: every one of those moments generated structured data. Which brings me to the moat."

---

## Slide 6 — Data Moat

**TITLE:** The data layer is the moat

**Headline sentence:** **Every action creates consented, verified data that converges in one place — the Unified Runner Profile — and can't be scraped, bought, or fast-followed.**

**Body bullets:**
- **Unified Runner Profile:** identity + membership + activity (10+ sources) + attendance + purchases + community score + lifetime value — a picture that exists nowhere else
- **Ingestion depth:** Strava, Garmin, COROS, Polar, Suunto, Apple Health, Google Health Connect, Fitbit, TrainingPeaks, Zwift → one normalized schema
- **Consent architecture as strategy:** data belongs to the club, shared only with member consent (granular scopes); network sees only anonymized aggregates, k-anonymity ≥ 50
- Consented + verified is exactly what brands can safely buy — the *legitimate* dataset wins

**Visual to build:** Layer diagram, bottom-up: Layer 1 "10 device/app connectors" (logo row) → funnel into Layer 2 "normalized activities schema + workflow exhaust (check-ins, payments, redemptions)" → Layer 3 a single glowing profile card "Unified Runner Profile (Leo Martins)" showing field groups → Layer 4 three outbound gates labeled with lock icons: "Club: operational view" / "Member: granular consent scopes" / "Network & brands: anonymized aggregates only, k≥50". The locks are visually prominent — the governance *is* the moat.

**Speaker notes:** "Here's what those three taps actually built. Every check-in, kilometer, payment, and perk redemption lands in one schema, joined into one profile per runner — the Unified Runner Profile. Nobody else has this picture. Strava sees runs but not payments or attendance. Eventbrite sees a ticket but not a relationship. We see the whole club — and, crucially, we see it *legitimately*. Data belongs to the club; members control granular consent scopes; medical and brand-marketing data is always opt-in; the network layer only ever sees anonymized aggregates with a hard k-anonymity floor of fifty. That's not a compliance slide — that's the strategy. Consented, verified community data is the one asset a competitor cannot scrape, cannot buy, and cannot retrofit trust into. It compounds every single day we operate."

---

## Slide 7 — Business Model

**TITLE:** SaaS + take-rate + brand-side: three engines, one flywheel

**Headline sentence:** **Clubs subscribe, transactions carry a fee, and brands pay to reach what only we can verify — with fees that *fall* as clubs grow.**

**Body bullets:**
- **Club SaaS:** Starter free · Club $79/mo · Pro $199/mo · Network from $999/mo custom
- **Transaction lines:** platform fee 2% → 1% → 0.5% by tier · ticket fees 2% + $0.30 (Starter/Club) · marketplace 10% on vendor bookings
- **Brand-side SaaS:** Brand Portal seats from $499/mo + campaign fees · plus $29/mo AI add-on, API access, enterprise licensing
- Alignment: clubs earn *through* RunOS (dues, sponsors, merch) more than they pay RunOS → NRR ≥ [105–120]% by motion

**Visual to build:** Left: the four-tier pricing ladder as ascending steps (Starter/Club/Pro/Network with prices), each step annotated with its platform fee (2% / 1% / 0.5% / custom) showing the fee *decreasing* as the ladder rises. Right: a revenue-mix donut labeled "at scale" with three bands — Club SaaS, transaction take (payments+tickets+marketplace), brand-side — deliberately unnumbered on the donut, with target gross margins per band as small chips (≈83% / ≈50% / ≈73%).

**Speaker notes:** "Three engines. Engine one: club SaaS — free to start, $79 for growing clubs, $199 for serious clubs with white-label web and Pacer unlimited, custom Network tier from $999 for multi-chapter orgs, franchises, and cities. Engine two: a take-rate on the money we move — platform fees on payments, ticket fees, ten percent on marketplace bookings. Notice the design: our platform fee *drops* from two percent to half a percent as clubs upgrade — we deliberately trade fee for subscription, so growing clubs always feel the model working *for* them. Engine three, the one with the best long-term shape: brands. Brand Portal seats from $499 a month plus campaign fees — because we're the only place a brand can buy verified, consented running audiences with closed-loop ROI. And the punchline: a Pro club typically earns more through RunOS than it pays us. When your customer profits from your invoice, churn becomes irrational."

---

## Slide 8 — Traction Plan / Early Proof *(template)*

**TITLE:** What we can already prove

**Headline sentence:** **[N] clubs, [N] members, [N]% weekly-active — and every week the flywheel data gets stronger.** *(fill with live numbers; below is the canonical structure)*

**Body bullets** *(the five proof rows — populate at raise time)*:
- Clubs on platform: **[N]** ([N]% via club-to-club referral) · pipeline: **[N]**
- Activation: **[N]%** of new clubs hit the bar — *first 3 events published, 30% of members joined*
- North star: **[N] WACM** (Weekly Active Community Members), growing **[N]%** week-over-week
- Monetization: **[$N] MRR** + **[$N] GMV** processed · **[N]%** of clubs on paid tiers
- Lighthouse proof: **[Club name, city, member count]** — "[one-sentence organizer quote about hours saved / money earned]"

**Visual to build:** A single WACM growth curve as the hero (weekly, log or linear as flattering-but-honest), with event pins on the curve ("first paid club", "first sponsor deal closed via platform", "first 1,000-member org"). Below, a 4-tile KPI row (clubs / activation % / MRR+GMV / referral %). Right column: one lighthouse-club card with photo, logo, and the quote.

**Speaker notes:** "Here's what's real today. [Walk the numbers left to right — clubs, then the number I care most about: activation. A club that publishes three events and gets thirty percent of its members joined almost never leaves; that's our activation bar and we hit it with [N] percent of new clubs.] Our north star is WACM — weekly active community members: people who actually attended, logged, redeemed, or paid in the last seven days. Not screen time — real community life. It's growing [N] percent week over week. And the early referral share matters strategically: organizers know organizers, so clubs recruit clubs — [N] percent of our clubs came from other clubs. [Tell the lighthouse story in two sentences: what the club looked like before, the number that changed.]"

---

## Slide 9 — Market Size

**TITLE:** A $1B wedge into a $5–7B category

**Headline sentence:** **~500,000 running communities ≈ $1B ARR — and the same OS extends to all community sport: $5–7B.**

**Body bullets:**
- Bottom-up: ~620M runners → ~8% club-affiliated → **~500k clubs/crews** × ~$1,300 blended potential/club/yr (SaaS + fees + marketplace + brand-side allocation)
- **TAM (running): ~$0.9–1.2B** · **SAM (reachable digital clubs, NA/EU/UK/AU + top metros): ~$230M** · **SOM (5 yr): $45–60M**
- **Category TAM:** ~3.5M community-sport clubs (cycling, tri, hyrox, fitness) under the reserved CommunityOS umbrella → **$5–7B**
- Honest flag: club-affiliation rate (8%) is the fragile assumption — our GTM targets *countable* clubs, not the derived number

**Visual to build:** Left: concentric TAM/SAM/SOM circles with the three dollar figures. Right: the bottom-up math as a visible 4-line calculation stack (620M runners → ×8% → ÷110 avg size → ×$1,300) — showing the work builds credibility. Beneath: a horizontal expansion arrow "RunOS (running) → CommunityOS (all community sport)" with the $5–7B chip at its tip. A small amber "assumption risk" marker sits honestly next to the 8% figure.

**Speaker notes:** "We size this bottom-up and we'll show our work. Roughly 620 million people run regularly. Around eight percent are affiliated with an organized club or crew — that's the number we'd challenge hardest ourselves, so our go-to-market targets clubs we can literally count through federations and platform listings, not this derived figure. It nets out to about half a million communities, worth about $1,300 a year each across SaaS, transaction fees, marketplace, and the brand-side allocation. So: honest running TAM around a billion dollars in ARR. The venture-scale answer is what the wedge opens: the identical OS — events, money, sponsors, consented data — works for cycling clubs, tri clubs, hyrox crews, fitness communities. We've reserved CommunityOS as the umbrella for exactly that expansion. Win running first; running is where the cultural energy and the brand money is *right now*."

---

## Slide 10 — Competition

**TITLE:** Everyone owns a slice; nobody owns the workflow

**Headline sentence:** **On workflow depth × network value, the top-right corner is empty — that's the OS position.**

**Body bullets** *(kept minimal — the 2×2 carries the slide)*:
- Strava Clubs: massive network, near-zero club operations — we ingest it, we don't fight it
- Heylo & community tools (Circle-style): chat/content-first, thin on money, sponsors, intelligence
- Eventbrite / RaceRoster-style: transactions with strangers, no relationship layer
- The real incumbent: **WhatsApp + spreadsheets** — beaten only by 10× relief at $0 entry (free Starter)

**Visual to build:** A clean 2×2: x-axis "workflow depth →", y-axis "network value →". Plot muted-gray logos: Strava Clubs (top-left), Chief-style networks (upper-left-mid), Eventbrite (center-left-high), RaceRoster/Wild Apples-style (center), Heylo (center-low), Circle/Mighty-style (low-mid), WhatsApp+Sheets (bottom-left, drawn as a taped-together doodle for wit), legacy club-management (bottom-right). RunOS alone top-right in flare orange with a subtle "moat ring". Under the chart, one line: *"Slices vs. the OS."*

**Speaker notes:** "Two axes that matter: how much of the club's operating reality you run, and how much value comes from everyone else on the platform. Strava has an enormous network but doesn't run clubs — no payments, no CRM, no waivers; it's our data source and distribution neighbor, not our enemy. Heylo is the closest conceptual neighbor — group communication for run clubs — which validates the market while leaving money, sponsors, and intelligence open. Horizontal community tools can't out-vertical a vertical: they'll never build pace groups, QR check-in, or a running-brand marketplace. Eventbrite sells tickets to strangers. And the honest answer to 'who do you lose deals to?' is a WhatsApp group and a spreadsheet — which is why Starter is free and the wedge is ten-times relief, not ten-percent improvement. The top-right corner — deep workflow *and* compounding network — is empty. We're taking it."

---

## Slide 11 — Network Effects / End Game

**TITLE:** The flywheel, then the network

**Headline sentence:** **More members → more consented data → better AI, benefits, and brand campaigns → more value → more members — ending at 50,000 clubs, 18M runners, 500 brands, 150 countries.**

**Body bullets:**
- Four stacked effects: **data** (benchmarks sharpen Pacer for every club) · **marketplace** (more clubs ⇄ more brands/vendors) · **membership** (Leo's profile travels between clubs and cities) · **switching costs** (system of record + white-label)
- Year 1 own the club workflow → Year 2 own the ecosystem/marketplace → Year 3 own the network/category
- End game: **50,000 clubs · 18M runners · 500 brands · 150 countries** — the rails of community sport

**Visual to build:** Center: the flywheel as a circular diagram with four arc segments (members → data → AI/benefits/brands → value →) rotating into each other, Pacer glyph at the hub. Right: a three-step horizon staircase (Y1 workflow / Y2 ecosystem / Y3 network) climbing toward a stat band across the top in large tabular figures: 50,000 clubs · 18M runners · 500 brands · 150 countries.

**Speaker notes:** "Here's how this compounds. Every new member makes the data layer richer. Richer data makes Pacer smarter and the benefits passport more valuable — for *every* club, because network intelligence benchmarks are shared, anonymized. That attracts brands, whose perks and campaigns make membership more valuable, which attracts members. Four network effects stack on top of each other: data, marketplace, membership — Leo moves from Lagos to London and his runner profile gives him instant belonging in a new club — and plain old switching costs, because we're the system of record with the club's own branded app on our rails. The sequence is deliberate: year one, own the workflow. Year two, own the ecosystem. Year three, own the network — at which point 'Community Operating System' is a category with one obvious leader. The end game we run toward: fifty thousand clubs, eighteen million runners, five hundred brands, a hundred and fifty countries. At that point we're not a SaaS tool — we're the rails of community sport."

---

## Slide 12 — GTM

**TITLE:** Clubs recruit clubs; density unlocks the second engine

**Headline sentence:** **A free, single-player wedge spreads organizer-to-organizer; city density then switches on brands, vendors, and cities.**

**Body bullets:**
- **PLG wedge:** free Starter (<50 members) → 10-min setup → activation bar (3 events, 30% joined) → structural upgrade triggers (member caps, white-label, Sponsor CRM)
- **Community-led distribution:** organizers are densely networked — referral engine, lighthouse clubs, "Powered by RunOS" on every Starter club surface
- **City-density playbook:** launch metro-by-metro; ~30 clubs in one metro = sellable audience for Sofia (Brand Portal) + full calendar for Emre (marketplace)
- **Enterprise lane:** multi-chapter orgs, franchises, federations, city programs (Amsterdam Active) on Network tier — inbound from the density base

**Visual to build:** A three-stage funnel drawn horizontally as a relay: Stage 1 "Land" (free club signs up — icon: single club pin), Stage 2 "Expand" (pins multiply across one city map with referral lines between them; a threshold marker "~30 clubs = density"), Stage 3 "Monetize the network" (brand, vendor, and city icons plugging into the dense map). Under each stage, its motion + owner (self-serve / community team / brand & enterprise sales).

**Speaker notes:** "Go-to-market matches how this world actually works. Land: a club starts free in ten minutes — no network needed, pure single-player value, and we push every club to the activation bar because activated clubs don't churn. Expand: organizers all know each other — they share routes, they co-host races — so the referral engine and the 'Powered by RunOS' footer on free-tier clubs do the selling, backed by lighthouse clubs in each city. And here's the part I want you to remember: we launch city by city, because thirty clubs in one metro is the magic threshold — that's when Sofia at the shoe brand has an audience worth a campaign and Emre the physio has a full calendar. Density, not totals, unlocks engine two and three. Enterprise — federations, franchise clubs, city programs like Amsterdam Active — arrives as inbound once we're visibly the rails in their market."

---

## Slide 13 — Team *(template)*

**TITLE:** Built by people who run the boring stuff — and run

**Headline sentence:** **Infrastructure discipline, product craft at the Linear/Stripe bar, and real standing in the running community — in one founding team.**

**Body bullets** *(populate per person; keep to 4–6 people max)*:
- **[Name], CEO** — [infrastructure/marketplace/vertical-SaaS credential]; [running-community credential, e.g., founded/leads a [N]-member club]
- **[Name], CTO** — [multi-tenant/payments/data-platform credential]; [scale credential]
- **[Name], CPO/Design** — [craft credential: consumer-quality product at scale]
- **[Name], Head of Community/GTM** — [organizer-network credential]
- Advisors/angels: [club founders, brand-side marketing leader, marketplace operator]

**Visual to build:** Photo row — but not corporate headshots: each founder photographed *at a run* (bib, trail, 6 AM light), with a small "credential chip" pair under each (one professional, one community — e.g., "ex-[Company] payments" / "pacer, [Club]"). This visual argues culture-fit without a word.

**Speaker notes:** "Three things have to be true of the team that wins this, and you should grill us on all three. One: infrastructure discipline — multi-tenant architecture, consent enforced in the data layer, Stripe Connect done right — because clubs trust us with money, waivers, and medical flags from day one. Two: craft — our buyer is an exhausted volunteer at 10:30 PM; software at the Linear and Stripe bar isn't vanity here, it's the difference between adoption and abandonment. Three: standing in the community — this market is bought at Saturday-morning runs, not through cold email, and [we are of this world: tell the one-sentence personal club story]. [Then one proof line per founder, fast.]"

---

## Slide 14 — Financial Trajectory *(shape)*

**TITLE:** The shape of the next five years

**Headline sentence:** **SaaS leads early, the take-rate scales with GMV underneath, and brand-side becomes the margin engine — three lines, one direction.** *(illustrative shape; live model in the data room)*

**Body bullets:**
- Y1–2: club SaaS dominates; prove activation → paid conversion ≥ [25]% and NRR ≥ 105%
- Y2–3: transaction lines scale with GMV (dues, tickets, merch, marketplace) — revenue grows without new logos
- Y3–5: brand-side (seats + campaigns) compounds on network density → blended gross margin trends toward ~[78]%
- SOM checkpoint: **$45–60M ARR at 25,000 clubs (yr 5)** · unit targets: self-serve CAC ≤ $300, payback < 6 mo, LTV:CAC ≥ 8:1

**Visual to build:** A stacked-area chart, 5-year horizon, three bands in the brand data palette: "Club SaaS" (largest early), "Transaction take" (widening from Y2), "Brand-side" (steepening from Y3) — explicitly labeled "illustrative shape, model in data room" to stay honest. Right sidebar: a 4-row unit-economics chip stack (CAC / payback / LTV:CAC / NRR targets).

**Speaker notes:** "I'll describe shape, not false precision — the live model is in the data room. Early revenue is club SaaS: that's deliberate, because it's the line that proves the wedge and it's the line we control. From year two, the transaction lines widen underneath it — as clubs move their dues, tickets, and merch through us, revenue grows with GMV even with zero new logos; that's where net revenue retention above one hundred five comes from. From year three, the brand side compounds on city density — it's the highest-margin line and the one that scales with the *network*, not headcount. The unit economics we hold ourselves to: sub-$300 self-serve CAC, payback under six months, LTV to CAC north of eight. The five-year checkpoint: twenty-five thousand clubs, forty-five to sixty million in ARR — with the category expansion still entirely ahead of us."

---

## Slide 15 — The Ask

**TITLE:** The round

**Headline sentence:** **We're raising [$X]M for 18–24 months with one objective: become the system of record for [3,000+] clubs and prove the brand-side engine in [5] metros.**

**Body bullets:**
- **Use of funds:** ~50% product & engineering (8 surfaces, integrations, white-label, security) · 12% AI & data (Pacer, predictions, network intelligence) · 20% GTM (PLG + city launches + founding brand sales) · 10% community & success · 8% G&A
- **Milestones:** M6 wedge GA + activation ≥ [40]% → M12 [1,000+] clubs, [150k] WACM, ≥ [25]% paid, NRR ≥ 105% → M18 Brand Portal with [20+] brands + marketplace in [5] metros → M24 [$X]M ARR run-rate across 3 revenue lines, first Network-tier orgs
- Round: [$X]M · [instrument/terms] · [committed: $X from Y] · closing [date]

**Visual to build:** Left: use-of-funds as a single horizontal segmented bar (5 segments, labeled, percentages). Right: a milestone timeline (M6 → M12 → M18 → M24) drawn as a running track with four checkpoint flags, each flag carrying its headline metric. Bottom-right: a terms chip row (raise, instrument, committed, close date).

**Speaker notes:** "The ask: [$X] million, sized for eighteen to twenty-four months of ruthless focus. Half of it builds product — the eight surfaces to depth, the integration grind that *is* the moat, and enterprise-grade trust. A fifth funds go-to-market: the self-serve engine plus the city-density playbook. Twelve percent goes to Pacer and the data layer, because the AI COO is our sharpest wedge and our benchmarks are our compounding asset. The milestones this buys are the next round's story: by month twelve, a thousand clubs and a proven paid engine; by month eighteen, the second engine — brands and marketplace — demonstrably alive in five metros; by month twenty-four, [$X] million ARR across three revenue lines. [State committed amount and timing plainly. Then stop talking about money.]"

---

## Slide 16 — Closing Vision

**TITLE:** *(no visible title)*

**Headline sentence:** **Every club on the rails. Every runner with one profile. Every brand buying what's real. The operating system for running communities — then for every community that moves.**

**Body bullets:** none. Two lines only:
- 50,000 clubs · 18M runners · 500 brands · 150 countries
- **RunOS** — *The Operating System for Running Communities*

**Visual to build:** Full-bleed documentary photo: a huge Saturday-morning club run at dawn, hundreds of runners, city skyline — shot from behind the crowd so the viewer is *in* it. The four end-game figures fade in across the sky in large tabular numerals, then resolve to the RunOS wordmark + tagline. Final click: the slide-1 cascade returns as a single quiet line at the bottom — *"Nobody owned the operating system. Now somebody does."*

**Speaker notes:** "Let me end where we started. Six companies own six slices of a running club's life, and for years, nobody owned the operating system — so a generation of Mayas paid for it with their evenings, their spreadsheets, and their burnout. We're building the layer where communities actually run: fifty thousand clubs, eighteen million runners with one profile each, five hundred brands buying real, consented audiences, across a hundred and fifty countries. Running first — because that's where the movement is — and then every community that moves, under the CommunityOS umbrella we've already reserved. Strava owns activity. WhatsApp owns communication. Eventbrite owns events. [pause] We own the operating system. Thank you."

---

## Appendix pointers (data room, not deck)

- Full market model & assumption sensitivities → [`investor-narrative.md`](investor-narrative.md) §2
- Consent & permission model detail → canonical brief §9
- Pricing detail & revenue lines → canonical brief §7
- Roadmap & specs → `docs/06-execution/`

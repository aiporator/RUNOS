# RunOS — Micro-Events Wedge ("Solo")

> Conforms to `docs/00-foundation/canonical-brief.md` §7 and `docs/05-business/monetization-and-pricing.md`. Solo sits **below** Starter on the ladder — it is an acquisition surface, not a revenue line. Nothing here changes canonical tier pricing.

**One line:** create any event page free in 60 seconds, up to 20 people, no account — and let the product ladder you into the operating system.

---

## 1. Thesis: the PLG ladder

Eventbrite proved demand at the bottom of the market, then taxed it to death: a 20-person paid workshop pays service + processing fees on every ticket, wrapped in an interface built for 2,000-person conferences. Luma and Partiful won the consumer event page by being fast, beautiful, and free — but they *stop at the event page*. A Luma host who becomes a weekly organizer with members, dues, and sponsors has to leave Luma to grow. That's the gap Solo exploits: **the ladder continues.**

The ladder, each rung an observed behavior, not a sales motion:

1. **Solo instant event** — `/new` → publish in 60 seconds, ≤20 attendees, free, no account. A URL, RSVPs, done.
2. **Recurring organizer** — she runs a second and third event, wants a calendar and attendee memory ("who came last time?"). Both require identity → she creates a free account. Still $0.
3. **Community workspace (Starter)** — the attendee list becomes a member list. Starter is free under 50 members (canonical). One click converts events + RSVPs into a workspace.
4. **Club / Pro** — money starts moving (dues, paid tickets, sponsors) and automations earn their keep. Canonical pricing applies: Club $79/mo, Pro $199/mo, 2%→1%→0.5% platform fee.
5. **Network** — chapters, franchises, cities.

Positioning sentence for all channels: *"Luma gives you an event page. RunOS gives you an event page that grows into an operating system."*

Solo also feeds every vertical wedge (`lib/verticals.ts`): running clubs, gyms, fitness studios, workshops & courses, community & meetups — the instant creator asks nothing about vertical up front but infers it from the event, so the upgrade prompt can speak the right nouns ("your attendees" vs "your members" vs "your clients").

## 2. Free rules & abuse guardrails

**The rules (publish them, verbatim, on /pricing and /new):**

- **≤20 attendees per event, free forever.** Unlimited events. No account required to publish.
- **>20 attendees** requires a (free) Starter workspace — the gate is the workspace, not a credit card.
- Paid ticketing is **not** available on Solo. Money movement starts at Starter (2% platform fee + 2% + $0.30 ticket fee per canonical pricing). This keeps Solo out of payments compliance scope entirely.

**Why 20:** it covers the honest majority of micro-events — pottery workshops (8–12 seats), dinner parties, PT group sessions, book clubs, birthday drinks, first meetups. Data from the category (Partiful's median event, Meetup's median RSVP count) clusters well under 20. Crucially, the cap is crossed by *success*, not by time or feature hunger — the upgrade trigger is "your event is popular," the single best moment to ask someone to lean in.

**Abuse guardrails (ship with v1, not after):**

- **Rate limits:** 3 events/hour and 10/day per IP; 30/day per fingerprint (IP + UA hash). Excess → email-verification wall, not a hard block.
- **Content moderation basics:** keyword/URL denylist at publish time; Claude-based classification (spam / scam / adult / hate) on title + description async within 60s of publish — flagged pages get `noindex` + interstitial pending review. One-click "Report this event" in the public footer.
- **Link hygiene:** external links in descriptions are `rel="nofollow ugc"` until the organizer verifies an email — kills the SEO-spam incentive.
- **Expiry:** unclaimed anonymous events are archived 30 days after the event date (claim-by-email keeps them alive). Prevents graveyard buildup and squatting.
- **No email blast on Solo:** organizers can message RSVPs only via the event page update feed (attendees opted in by RSVPing). Bulk custom email starts at Starter — this is both an upgrade carrot and a spam firewall.

## 3. Unit economics of free

**Marginal cost per instant event:** a static-ish Next.js page render (edge-cached), a few DB rows, and later ~20 transactional emails (RSVP confirmations + one reminder). At SES/Resend rates (~$0.0001/email) plus infra amortization: **~$0.02–0.05 per event, all-in.** Even 10,000 events/month is ~$500 — noise against a single funded CAC channel.

**CAC math — the "Powered by RunOS" loop.** Every event page and every RSVP confirmation carries "Powered by RunOS — create yours free." Assumptions (mark to measure in PostHog after week 4):

- 12 RSVPs per event (median), each views the page ~1.5× → ~18 branded impressions/event
- 2% of attendee impressions click through (event-adjacent audience, high intent) → ~0.36 clicks/event
- 25% of clicks create their own event → **K ≈ 0.09 new organizers per event** from attendees alone, before share-loops (organizer shares link in WhatsApp/IG → non-attendee impressions roughly double reach)

K < 1, so Solo is not self-sustaining virality — it's a **CAC discounter**: if 6% of Solo organizers convert to a Starter workspace (see §5) and workspaces convert to paid at our canonical Starter→Club rate, each dollar of channel spend aimed at "create an event" buys workspace pipeline at a fraction of the cost of "set up your club" campaigns, because the ask is 60 seconds instead of a migration.

**Acquisition messaging vs Eventbrite:** a 20-person workshop at $25/ticket on Eventbrite pays roughly $2 service + processing per ticket ≈ **$40 of fees on a $500 event — an 8% tax**. Solo: $0 (free events). When she's ready to charge, Starter's 2% + $0.30 is still a fraction of it. Line for ads: **"They tax your 20-person workshop. We don't."**

## 4. Upgrade triggers, instrumented

Every trigger = a tracked event + an in-product prompt. Prompts are one sentence, dismissible, never modal-blocking.

| Trigger | Tracked event | Prompt copy (verbatim) |
|---|---|---|
| RSVP #21 attempted | `instant_capacity_hit` | Attendee side: "This event is full." Organizer side: "21 people want in. Open a free workspace to lift the 20-person cap — takes one click, your RSVPs come with you." |
| 3rd event created (same fingerprint/email) | `instant_third_event` | "Third event! Want a calendar, your past attendees, and one link for everything you run? Create your free workspace — everything you've made moves over." |
| RSVP export attempt | `instant_export_attempt` | "Your attendee list lives in a workspace. Create one free and export everyone — plus see who came to what." |
| Recurring toggle touched | `instant_recurring_attempt` | "Repeating events need a home. A free workspace gives you a calendar, reminders, and attendee memory." |
| Payment/price field touched | `instant_payment_attempt` | "Want to charge for this? Workspaces collect payments straight to your bank — 2% only when money moves, no monthly fee under 50 members." |

All prompts fire `instant_upgrade_prompt_shown` (property: `trigger`) and clicking fires `instant_upgrade_clicked` → into the existing wizard, pre-filled from the event (vertical inferred, org name suggested from event title).

## 5. Funnel & metrics

**Canonical funnel (PostHog event names):**

`instant_event_created` → `instant_rsvp` → `instant_event_shared` → `instant_upgrade_clicked` → `wizard_completed`

**Healthy-wedge targets (first 90 days post-launch):**

- ≥150 instant events/week by day 90 (week 1 baseline whatever launch delivers; watch slope, not level)
- Median ≥8 RSVPs/event; <25% zero-RSVP events (zero-RSVP share is the spam/quality canary)
- ≥40% of events shared via the share sheet (`instant_event_shared`)
- Upgrade prompt CTR ≥12% on `instant_capacity_hit`, ≥6% blended
- **Event→workspace conversion 5–8%** (`wizard_completed` / distinct organizers, 30-day window) — below 4% the wedge is a toy; above 8% raise Solo's prominence sitewide
- Attendee-side loop: ≥1.5% of RSVPers click "Powered by RunOS" (feeds K from §3)

**PostHog dashboard additions ("Micro-Events Wedge"):** funnel insight over the 5 events above (30-day window, weekly cohorts); trends for events created/week split by inferred vertical; zero-RSVP share; prompt CTR by `trigger` property; organizer→workspace conversion cohort table; one retention insight — organizers returning to create event #2 within 21 days.

## 6. Launch plan

**Where micro-organizers live:**

1. **WhatsApp community admins** — run everything in a group chat, plan events in a pinned message. Play: shareable event links that unfurl beautifully in WhatsApp (OG image with date/venue/RSVP count). Copy for community-admin groups and FB groups: *"Stop planning events in a pinned message. Free event page in 60 seconds, RSVPs included, no app needed — your group just taps a link."*
2. **Instagram workshop teachers** (ceramics, photography, yoga, cooking) — "link in bio, DM to book" is their whole stack. Play: partner with 20 micro-creators (2k–20k followers), each gets a story template + their real event link. Copy: *"DM-to-book is costing you seats. One link in bio: pottery workshop, 10 spots, Saturday. They tap, they're in, you see the list."*
3. **Meetup refugees & university societies** — Meetup's organizer fee ($200+/yr) makes 20-person groups uneconomic; societies have zero budget by definition. Play: Reddit (r/socialskills, city subs), student-union newsletters at 10 target universities. Copy: *"Meetup wants $200/year to host your 15-person book club. We want $0. Free event pages, unlimited, no account — and if it grows into a real community, the whole OS is waiting."*

**SEO play:** every public event page (`/e/[id]`) is an indexable long-tail surface — title + city + vertical generate queries like "pottery workshop amsterdam" or "beginner run club berlin." Ship: server-rendered pages with `Event` schema.org markup, city/vertical browse pages (`/events/amsterdam/workshops`) once density supports them (≥10 events/cell), `noindex` until an event is moderation-cleared and has ≥1 RSVP (quality floor). This is a 6–12 month compounding channel, not a launch spike — instrument `instant_event_created` with `referrer=organic` from day one.

## 7. Risks & honest counters

- **Consumer-grade support load.** Thousands of anonymous organizers can't get founder-grade support. Counter: Solo gets docs + Pacer-powered self-serve answers only; human support starts at Starter. Publish this openly — it's also an upgrade carrot.
- **Brand dilution vs the B2B OS positioning.** "Birthday page tool" and "operating system for clubs" strain against each other. Counter: separate visual entry (the `/new` creator and public event pages are their own lighter surface), same engine underneath; the homepage section is one band, framed as "just need one event page?" — explicitly the small door into the same house. Sales-facing materials never lead with Solo.
- **Spam events.** Free + anonymous + public URLs is a spam magnet. Counter: §2 guardrails (rate limits, async Claude moderation, nofollow-until-verified, noindex-until-quality, 30-day expiry). Watch zero-RSVP share weekly.
- **Luma incumbency.** Luma is loved, fast, and free — we won't out-Luma Luma on event pages alone. Counter: (a) verticals — Luma is generic; we speak gym, studio, run-club, and workshop natively, down to the nouns; (b) the ladder — Luma's ceiling is a calendar; our organizer's third event lands her in a CRM, payments, and automations she didn't have to migrate to. We compete for the organizer's *next year*, not just her next Thursday.
- **Cannibalization of Starter signups.** Some would-be workspace signups will take the lazier Solo path. Counter: acceptable — Solo→Starter conversion is instrumented (§4/§5), and a Solo organizer we ladder up is cheaper than a cold Starter signup we had to convince.

**Decision checkpoint (day 90):** if events/week slope is positive, zero-RSVP <25%, and event→workspace ≥4%, invest (browse pages, paid creator partnerships). If not, keep Solo as a passive surface and redirect effort to the founding-club motion — the wedge must earn its roadmap slots.

# Pilot Launch Runbook — Proving RunOS to the First 20 Running Clubs

> Goal: 20 real conversations where a real club sees RunOS actually work, before investing in
> durable multi-tenant persistence. This runbook covers the proof path available **today,
> with zero database setup** — see `DEPLOYMENT.md` § Live persistence for what comes after.

## What's live right now (no database, deploy today)

| Flow | URL | What it proves |
|---|---|---|
| The vision, in one page | `/` | Category pitch, all 8 surfaces, pricing |
| Guided product tour | `/demo` → `/app` | Full organizer OS: CRM, events, QR check-in, Pacer AI, sponsors — seeded, always works |
| **Create a real event** | `/new` | 60-second event creation, live preview, capacity-aware free/upgrade badge |
| **Share it, get real RSVPs** | `/e/[id]` | Public page a club can text to their real WhatsApp group; real names/emails RSVP, waitlist kicks in at capacity |
| Host view | `/e/[id]/manage?key=…` | Stats, attendee list, share tools |
| Onboarding wizard | `/start` | Vertical picker, CSV import UX, first-event planning — captures interest via the lead API |

**The honest limit:** all of the above runs on a single in-memory store (see
`DEPLOYMENT.md`). It's genuinely interactive and shareable — a club can create their real
Saturday run and watch friends RSVP live on a call — but data does not durably survive a
server restart or redeploy. That's the right trade for *proving* the product; it is not yet
the right foundation for a club's actual multi-week operations.

## The pitch to a club (what to actually say)

> "Look at your Saturday run in 60 seconds — no signup, nothing to install." Walk through
> `/new` live, publish it, hand them the `/e/xxx` link and ask them to text it to two people
> right now. Watch the RSVP land. **That's the moment that sells it** — not a slide, an
> actual working link with actual friends registering.

Then show `/demo` for "and here's everything else once you're running the whole club through
one system" — the CRM, the QR check-in, Pacer drafting a sponsor proposal.

## The 20-club sprint

**Week 1 — warm 5 (white-glove calls):**
Source clubs you know personally. On the call: open `/new`, create their actual next run
together, send the `/e/` link to their WhatsApp group live. Capture interest via `/start`
(feeds the lead API — no DB needed, it's the same in-memory store).

**Week 2–3 — outbound 10 (Instagram DM):**
Script: *"Your Saturday run deserves better than a pinned WhatsApp message. I built this —
takes 60 seconds, no signup: [runos.link]/new. Want to see it work for your club?"*

**Week 4 — referral 5:**
Ask every warm club for one intro. Publish a short case study if permission allows.

**Weekly tracking:** events created per club, RSVPs per event, and — critically — whether
they ask "can I use this every week?" That question is the signal to invest in real
persistence (see `DEPLOYMENT.md`), not before.

## Success criteria (day 30)

- 20 real conversations had, 20 real event pages created and shared
- ≥ 8 clubs whose members actually RSVP'd (proof the link-sharing motion works)
- ≥ 5 clubs asking "how do we use this for real / every week" — the signal to build durable
  persistence for those specific clubs first
- A ranked wish-list from real conversations, feeding the next build phase

## What NOT to do yet

Don't onboard 20 clubs expecting their data to persist for weeks — it won't, by design, until
the dedicated-database work in `DEPLOYMENT.md` is done. Be upfront about this: "this is the
working prototype — if you love it, you're club #1 on the real version." Clubs respect
honesty about what's real vs. what's next far more than a broken promise.

# RunOS — UX Wireframes (Highest-Stakes Screens)

> Owner: UX Director / Head of Product Design
> Status: v1.0 — execution-ready. Conforms to `docs/00-foundation/canonical-brief.md` and `information-architecture.md`.
> Contents: 16 wireframes. Each includes layout, key components, primary action, states (empty/loading/error), and the Superhuman test (what makes it fast).

Annotation convention: `①②③…` markers in the wireframe map to the callout list below it. Desktop frames are ~12-col; mobile frames are a single 390-pt column. All components reference `ui-system-and-design-tokens.md`.

---

## ORGANIZER WEB APP

### W1. Today Dashboard (Organizer home)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ①[LRR ▾]  Today  Community Events Money Growth Engage Partners Intel Platform│
│                                              ②[⌘K Ask or jump to… ] 🔔 ◉MO │
├────────────────────────────────────────────────────────────────────────────┤
│ Good morning, Maya. ③ Scope: Lagos Road Runners · All chapters ▾           │
│                                                                            │
│ ④┌ NEXT EVENT ───────────────────────────┐ ⑤┌ PACER DIGEST ─────────────┐ │
│  │ Sat 07:00 · Saturday Long Run 12K      │  │ ✦ 3 things today           │ │
│  │ ▓▓▓▓▓▓▓▓░░ 84/100 RSVPs                │  │ • 7 members at churn risk  │ │
│  │ ☀ 22° · Route: River Loop              │  │   → [Review list]          │ │
│  │ Forecast attendance: 71 (±6)           │  │ • Harbor Sports report due │ │
│  │ [Open Live Day]      [Message RSVPs]   │  │   Friday → [Draft it]      │ │
│  └────────────────────────────────────────┘  │ • Oct 100K sign-ups +38%   │ │
│ ⑥┌ ACTION QUEUE (5) ─────────────────────┐  └────────────────────────────┘ │
│  │ ⚠ 2 failed membership payments  [Fix]  │ ⑦┌ THIS WEEK ────────────────┐ │
│  │ ✋ Campaign approval: NoxRun    [View] │  │ WACM      312  ▲ 4.2%  ╱╲╱ │ │
│  │ 💬 3 unanswered member messages [Open] │  │ Attendance 76%  ▲ 1.1% ╱─╱ │ │
│  └────────────────────────────────────────┘  │ MRR     $1,840  ▲ $95  ╱╱─ │ │
│ ⑧ Recent: [Ana joined] [Order #1042 paid] [Tue Run recap posted]  …        │
└────────────────────────────────────────────────────────────────────────────┘
```

- ① Club/chapter switcher (⌘⇧O) with the 8 surfaces as top-level nav.
- ② Command bar trigger — navigate / act / ask Pacer in one field.
- ③ Scope pill: every number below is honest about its scope.
- ④ Next Event card: the one thing that matters most today; state-aware CTA (before: Message RSVPs → day-of: Open Live Day).
- ⑤ Pacer digest: max 3 items, each with a one-click resolution action.
- ⑥ Action queue: only human-decision items; everything else is automated or FYI.
- ⑦ KPI tiles with 7-day sparklines; click-through to Intelligence reports.
- ⑧ Ambient activity ticker (dismissable).

**Primary action:** the state-aware Next Event CTA.
**States:** *Empty* (new club): card ④ becomes "Publish your first event — ~4 min [Start] ✦ or ask Pacer to draft it"; KPI tiles offer "Show with sample data". *Loading:* skeleton tiles, numbers never jump (reserve layout). *Error:* per-card inline retry; the rest of the dashboard still renders (no full-page failure).
**Superhuman test:** loads from cache in <400 ms then revalidates; every card actionable without navigation; `g t` returns here from anywhere; digest readable in 90 seconds.

---

### W2. Member CRM List (Community → Members)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Community ▸ Members            ①[Saved views: All · Lapsed 30d · New ▾]  ⊕ │
│ ②[Filter: Membership=Active ×] [Attendance <2/mo ×] [+ Add filter]  ③ 450 ✓│
│ ④[table ▦ | board ▤]                         [Import ▾] [⑤ Bulk actions ▾] │
├────────────────────────────────────────────────────────────────────────────┤
│ ☐ Name           Status   Streak  Last active  LTV    Risk⑥   Consent⑦    │
│ ☐ ◉ Leo Martins  Active   🔥 6wk   Today        $128   ● Low   ◍ 4/7       │
│ ☐ ◉ Ana Duarte   Active   —       2d ago       $342   ● Low   ◍ 5/7       │
│ ☐ ◉ Tunde A.     Lapsed   —       34d ago      $96    ● High  ◍ 2/7       │
│ ☐ ◉ Zara K.      Guest    —       6d ago       $0     ● Med   ◍ 2/7       │
│   … (virtualized)                                                          │
├────────────────────────────────────────────────────────────────────────────┤
│ ⑧ 2 selected: [Message] [Add to segment] [Export] [Tag ▾]                  │
└────────────────────────────────────────────────────────────────────────────┘
```

- ① Saved views persist filters/sort/columns; shareable URLs.
- ② Filter chips compose across profile, activity, attendance, money data.
- ③ Live count updates as filters change — this *is* the segment builder seed ("Save as segment").
- ④ Table/board toggle (board = lifecycle stages for win-back workflows).
- ⑤ Bulk actions permission-trimmed by role.
- ⑥ Churn risk from Intelligence, sortable — Pacer explains on hover.
- ⑦ Consent indicator: granted scopes count; locked fields render 🔒 chips in columns, never hidden rows.
- ⑧ Selection bar floats; keyboard: `x` select, `⇧↓` range.

**Primary action:** open a member (row click → slide-over profile, W3).
**States:** *Empty:* ghosted table + "Your members will live here. [Import from CSV / WhatsApp / Strava club]" (primary) — the import path IS the empty state. *Loading:* skeleton rows, header interactive immediately. *Error:* toast + retained last-good data, "retry" inline.
**Superhuman test:** virtualized list handles 10k members at 60fps; type-ahead filter (`/` focuses filter); row open in <150 ms via prefetch on hover; every bulk action keyboardable.

---

### W3. Member Profile — Unified Runner Profile (slide-over / full page)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ◉ Leo Martins  ①[Active member · Club plan]   ②[Message] [⋯] [✦ Ask Pacer]│
│ Joined Mar 2026 · via Ana Duarte · Abuja chapter                           │
├──────────────────────────────────────────────┬─────────────────────────────┤
│ ③ Overview | Activity | Events | Money | Engagement | Notes & consent     │
│                                              │ ⑦ CONTEXT                   │
│ ④┌ Streak 🔥6wk ┐┌ Attend 82% ┐┌ LTV $128 ┐ │ Segments: New-ish · 5K pace │
│  └──────────────┘└────────────┘└───────────┘ │ Friends here: Ana +3        │
│ ⑤ ACTIVITY (scope: activity.summary ✓)       │ Volunteer hrs: 4            │
│  This wk 32km · Avg pace 5:12 · PRs: 10K 44:0│ ⑧ ✦ PACER                   │
│  Detailed splits  🔒 Not shared —            │ "Leo is an ambassador       │
│  activity.detailed [Request access]          │  candidate: top-decile      │
│ ⑥ TIMELINE                                   │  attendance, 4 referrals."  │
│  ▸ Today   Checked in · Tuesday Track        │  [Invite as ambassador]     │
│  ▸ Mon     Redeemed perk · Harbor Sports 20% │                             │
│  ▸ Oct 12  Joined challenge · October 100K   │                             │
└──────────────────────────────────────────────┴─────────────────────────────┘
```

- ① Status badge + plan; lapsed/at-risk states recolor the header strip.
- ② Primary action = Message; `✦ Ask Pacer` scopes the assistant to this member.
- ③ Canonical object tabs (see IA §8); Notes & consent tab shows granted scopes with grant dates and the audit trail.
- ④ Stat tiles: the three numbers that define the relationship.
- ⑤ Consent-trimmed fields render as locked chips with a "Request access" flow (member gets a consent prompt — never auto-granted).
- ⑥ Universal timeline component, permission-filtered.
- ⑦ Context rail: related objects, always linkable.
- ⑧ Pacer insight card with a one-click action.

**Primary action:** Message.
**States:** *Empty* (new member): timeline shows "Leo just joined — say hi 👋 [Send welcome]". *Loading:* header instant (from list cache), body skeletons. *Error:* section-level retry.
**Superhuman test:** opens as slide-over preserving list scroll; `j/k` moves between members without closing; all data above the fold answers "who is this person to us?" without scrolling.

---

### W4. Event Builder

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ◂ Events   New event ①[Draft · autosaved 12s ago]        [Preview] [Publish]│
├───────────────┬────────────────────────────────────────────────────────────┤
│ ② STEPS       │ BASICS                                                     │
│ ● Basics      │ Title   [Saturday Long Run — River Loop      ] ③[✦ Draft]  │
│ ○ Registration│ Type    [Group run ▾]   Date [Sat 18 Jul] [07:00–09:00]    │
│ ○ Logistics   │ Location[Marina Gate, pin 📍]  ☀ forecast 22°              │
│ ○ Comms       │ Route   ④[River Loop 12K ▾]  ┌──────────────┐              │
│ ○ Review      │         12.0km · 84m elev    │  ~~map~~     │              │
│               │                              └──────────────┘              │
│ ⑤ Setup Score │ Description                                                │
│ ▓▓▓▓▓▓░░ 6/8  │ [Easy-paced long run along the river. All paces…]         │
│               │ ⑥ Pace groups [5:00] [5:45] [6:30] [+ add]                 │
│               │                                              [Next: Reg →] │
├───────────────┴────────────────────────────────────────────────────────────┤
│ ⑦ ✦ Pacer: "Your last 6 Saturday runs averaged 71 attendees. Suggested     │
│    capacity: 100. Want me to write the description and share kit?" [Yes]   │
└────────────────────────────────────────────────────────────────────────────┘
```

- ① Continuous autosave; Draft/Published state explicit; Publish validates all steps.
- ② Stepper is navigation, not a wizard-jail — jump to any step anytime; steps show completeness dots.
- ③ Inline Pacer draft for any text field.
- ④ Routes library picker with map preview; "create new route" inline.
- ⑤ Event-level completeness meter (waiver attached? reminder scheduled?).
- ⑥ Structured pace groups feed check-in grouping and member-app filtering.
- ⑦ Pacer footer suggestion uses the club's real history — dismissable, never blocking.

**Primary action:** Publish (validates; then swaps to "Share kit" success sheet with pre-written WhatsApp/IG copy).
**States:** *Empty:* new-event screen pre-fills from the club's most common pattern ("Looks like Saturdays 07:00 are your thing"). *Loading:* n/a (local-first draft). *Error:* publish failures itemized per step with jump-links; draft never lost.
**Superhuman test:** template + Pacer draft = publishable in <4 min; `⌘Enter` publishes; duplicate-last-event is one command (`⌘K → duplicate`).

---

### W5. Event Live Day — Check-in Mission Control

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ● LIVE · Saturday Long Run 12K · 07:00   ①[Scan mode ▣] [② Board] [⋯]     │
├──────────────────────────────┬─────────────────────────────────────────────┤
│ ③  CHECKED IN                │ ④ SCAN / SEARCH                             │
│                              │ ┌─────────────────────────┐                 │
│        68 / 84               │ │      [ camera view ]    │                 │
│      ▓▓▓▓▓▓▓▓░░ 81%          │ │   aim at member QR      │                 │
│  walk-ins +6 · waitlist 3    │ └─────────────────────────┘                 │
│                              │ or type name [Le…] → Leo Martins [✓ Check in]│
│ ⑤ RECENT                     │ ⑥ ✅ Leo Martins — 3rd run this month       │
│ ✅ Leo M. · 06:52            │    Pace group 5:45 · waiver ✓               │
│ ✅ Ana D. · 06:51            ├─────────────────────────────────────────────┤
│ ⚠ Zara K. · waiver unsigned  │ ⑦ [+ Walk-in] [Groups] [🚨 Emergency panel] │
│ ✅ Tunde A. · 06:49          │ ⑧ ⓘ Offline-ready · 2 scans queued to sync  │
└──────────────────────────────┴─────────────────────────────────────────────┘
```

- ① Scan mode = full-screen camera for volunteer stations (one-tap volunteer handoff link, no login needed, scoped token).
- ② Board view for the organizer watching numbers.
- ③ Big count is the emotional heartbeat; walk-ins and waitlist handled without leaving.
- ④ Fallback name search for phone-died members — 2 keystrokes to a match.
- ⑤ Exception rows (unsigned waiver, unpaid ticket) surface amber with one-tap resolve.
- ⑥ Check-in confirmation is celebratory and informative (streak, pace group).
- ⑦ Emergency panel = break-glass to consented `health.medical` + emergency contacts; typed reason required; audited.
- ⑧ Offline-first: scans queue locally, sync banner shows honesty about state.

**Primary action:** scan (camera is live by default on mobile).
**States:** *Empty* (pre-event): countdown + checklist (volunteers assigned? kit packed?). *Loading:* attendance numbers from local store instantly. *Error/offline:* full function offline; banner ⑧; conflicts resolved by server timestamp, dupes ignored gracefully.
**Superhuman test:** scan-to-green under 400 ms; usable one-handed on a phone in sunlight (max-contrast mode auto-enabled outdoors); one person can run a 100-person check-in alone (Priya test).

---

### W6. Growth OS — Automation Builder

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ◂ Automations   Win-back: lapsed 30 days   ①[● Active ▾]  [Test run] [Save]│
│ ②“When a member hasn’t attended for 30 days, send a personal nudge,        │
│   wait 7 days, and if still inactive, offer a bring-a-friend pass.”        │
├────────────────────────────────────────────────────────────┬───────────────┤
│ ③ CANVAS                                                   │ ⑤ INSPECTOR   │
│  ┌ TRIGGER ─────────────┐                                  │ Step: Send    │
│  │ ⚡ No attendance 30d  │                                  │ message       │
│  └──────────┬───────────┘                                  │ Channel:      │
│  ┌ CONDITION┴──────────┐                                   │ [Push→Email ▾]│
│  │ ◇ Membership=Active │                                   │ (member pref) │
│  └──────────┬──────────┘                                   │ Template:     │
│  ┌ ACTION ──┴──────────┐   ┌ WAIT ──┐   ┌ BRANCH ────────┐ │ [We miss you… │
│  │ ✉ Send message      ├──▶│ 7 days ├──▶│ attended since? │ │  ✦ Rewrite]   │
│  └─────────────────────┘   └────────┘   │ yes→End         │ │ Send window:  │
│                                         │ no →🎁 Grant perk│ │ [18:00-20:00] │
│                                         └────────────────┘ │               │
├────────────────────────────────────────────────────────────┴───────────────┤
│ ④ ▶ Runs 30d: 41 · completed 28 · converted 11 (27%) · errors 0   [History]│
└────────────────────────────────────────────────────────────────────────────┘
```

- ① Status control: Active/Paused; edits to an active automation create a draft version (never live-edit).
- ② Plain-language sentence auto-generated from the canvas — the trust check ("is it doing what I think?").
- ③ Canvas: trigger (⚡) → conditions (◇) → actions (✉🎁⏱); snap-to-grid, auto-layout; node palette on `⌥` drag or `/`.
- ④ Live performance strip; History opens per-member run traces (why did Leo get/not get this?).
- ⑤ Inspector edits the selected node; channel honors member preference cascade; Pacer rewrites copy inline.

**Primary action:** Save (→ "Activate" if draft).
**States:** *Empty:* templates gallery first ("Start from a recipe: Welcome series · Win-back · Post-event thanks"), blank canvas second. *Loading:* canvas skeleton. *Error:* invalid nodes outlined red with itemized issues panel; automation cannot activate with errors; runtime errors pause the automation + notify.
**Superhuman test:** recipe → activated in <2 min; Test run executes against a sample member with full trace in seconds; plain-language sentence means zero-doubt activation.

---

### W7. Sponsor CRM + Brand Report

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Partners ▸ Sponsors  ①[Pipeline ▤ | List ▦]      [+ Sponsor] [✦ Draft proposal]│
├────────────────────────────────────────────────────────────────────────────┤
│ ② LEAD (3)      CONTACTED (2)   PROPOSAL (2)    ACTIVE (2)     RENEWAL (1) │
│ ┌ NoxRun     ┐  ┌ HydraFuel  ┐  ┌ Harbor     ┐  ┌ Stride Co ┐  ┌ Harbor  ┐ │
│ │ shoe brand │  │ $ ?        │  │ Sports     │  │ $2.4k/yr  │  │ Sports  │ │
│ │ fit ✦ 87   │  │ next: call │  │ $1.2k ask  │  │ ▓▓▓▓░ 4/5 │  │ due 30d │ │
│ └────────────┘  └────────────┘  │ 👁 viewed 2d│  │ deliverbls│  │ [report]│ │
│                                 └────────────┘  └───────────┘  └─────────┘ │
├────────────────────────────────────────────────────────────────────────────┤
│ ③ BRAND REPORT — Harbor Sports · Q3        [Share link] [PDF] [👁 3 views] │
│ ┌ Reach ──────┐ ┌ Redemptions ─┐ ┌ Event presence ┐ ┌ Content ─────┐       │
│ │ 412 members │ │ 134 (32%)    │ │ 6 events ·     │ │ 12 posts     │       │
│ │ 38k passport│ │ $2,680 driven│ │ 1,020 check-ins│ │ 41k reach    │       │
│ │ impressions │ │ vs bench +9pp│ │ banner+booth   │ │ (consented)  │       │
│ └─────────────┘ └──────────────┘ └────────────────┘ └──────────────┘       │
│ ④ ✦ Pacer: “Renewal talking point: redemptions beat network benchmark by   │
│   9pp; propose a 20% larger Q4 package at $1,450.”  [Insert into email]    │
└────────────────────────────────────────────────────────────────────────────┘
```

- ① Pipeline kanban is the default; `✦ Draft proposal` opens the Pacer proposal composer pre-filled with real attendance/reach/redemption data.
- ② Cards show the one next step + Pacer fit score for leads; proposal cards show viewed-status (👁) — negotiation intelligence.
- ③ Brand report is a live shareable artifact (link stays fresh; PDF snapshot for procurement); every number links to methodology.
- ④ Pacer renewal coach: benchmark-grounded, one-click insertion into the renewal email.

**Primary action:** `✦ Draft proposal` (pipeline) / `Share link` (report).
**States:** *Empty:* "Sponsors fund clubs that can prove value. You already have the proof. [✦ Draft your first proposal]" with a ghosted pipeline. *Loading:* kanban skeleton columns. *Error:* report share-link failures fall back to PDF export; stale-data badge if metrics >24 h old.
**Superhuman test:** proposal from zero to sendable PDF in ~60 seconds; report link answers a sponsor's "what did we get?" before they finish asking; drag-between-stages autosaves with undo.

---

### W8. Pacer AI Panel

```
┌──────────────────────────── main app (dimmed) ────────────┬───────────────┐
│                                                           │ ✦ PACER       │
│                                                           │ ①[context:    │
│                                                           │  Sat Long Run]│
│                                                           │───────────────│
│                                                           │ You: Who won't│
│                                                           │ show Saturday?│
│                                                           │───────────────│
│                                                           │ ② Forecast: 71│
│                                                           │ of 84 RSVPs.  │
│                                                           │ 13 likely no- │
│                                                           │ shows, top    │
│                                                           │ driver: first-│
│                                                           │ timers w/ no  │
│                                                           │ friend going. │
│                                                           │ ③[View the 13]│
│                                                           │ ④[✉ Nudge them]│
│                                                           │ ⑤ ⓘ Based on  │
│                                                           │ 62 club events│
│                                                           │ + benchmarks  │
│                                                           │───────────────│
│                                                           │ ⑥[Ask Pacer…] │
│                                                           │ ⑦ /plan /draft│
└───────────────────────────────────────────────────────────┴───────────────┘
```

- ① Context chip: Pacer states what it's scoped to (current object/screen); clearable to club-wide.
- ② Answers are numbers + reasons, streamed; never a wall of prose.
- ③④ Every answer carries object actions: open the segment, run the action. Actions requiring permission show the requirement; Pacer inherits the asker's role and members' consent scopes.
- ⑤ Grounding disclosure: what data the answer used ("your club's data + anonymized network benchmarks — never another club's raw data").
- ⑥ Input accepts natural language; `⌘K` short-answers inline, panel for depth.
- ⑦ Slash shortcuts for canonical capabilities: /plan October, /draft proposal, /newsletter, /carousel, /forecast.

**Primary action:** the suggested action button on each answer (④).
**States:** *Empty:* capability catalog as tappable examples grouped by surface ("Try: 'draft a sponsor proposal for…'"). *Loading:* streaming tokens + "checking your attendance data…" step indicators. *Error:* "I couldn't reach your analytics just now" + retry; degraded mode still allows drafting from cached context; never fabricates — says what it can't see.
**Superhuman test:** `⌘K` → question → streamed first token <1.5 s; every answer actionable in one click; panel persists across navigation (conversation follows you).

---

### W9. Analytics Home (Intelligence)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Intelligence ▸ Analytics   ①[Last 90 days ▾] [All chapters ▾]  [Share] [⋯] │
├────────────────────────────────────────────────────────────────────────────┤
│ ②┌ WACM ─────┐ ┌ Attendance ┐ ┌ MRR ───────┐ ┌ Churn risk ┐               │
│  │ 312       │ │ 76%        │ │ $1,840     │ │ 23 members │               │
│  │ ▲4.2% ╱╲╱╱│ │ ▲1.1% ╱─╲╱ │ │ ▲$95  ╱╱── │ │ ▼3    ╲╲─╲ │               │
│  └───────────┘ └────────────┘ └────────────┘ └────────────┘               │
│ ③ ATTENDANCE BY WEEK            ④ REVENUE MIX                              │
│  90┤      ╭─╮    forecast▒▒     Memberships ▓▓▓▓▓▓▓▓ 58%                   │
│  60┤ ╭─╮ ╭╯ ╰╮ ╭─╮ ▒▒▒         Events      ▓▓▓▓ 27%                       │
│  30┤─╯ ╰─╯   ╰─╯ ╰─▒▒▒         Merch       ▓▓ 11%                         │
│    └──────────────────▶        Sponsors    ▓ 4%                            │
│ ⑤ ✦ INSIGHTS                                                               │
│  • Tuesday track attendance −18% since dark evenings → try 1h earlier?     │
│  • Members who join a challenge in month 1 retain 2.3× better              │
│ ⑥ Benchmarks: your 30d retention 87% · clubs like yours 82% (k≥50) [More]  │
└────────────────────────────────────────────────────────────────────────────┘
```

- ① Global period + scope controls apply to the whole page; shareable state URL.
- ② Stat tiles: value, delta vs. previous period, sparkline; every tile clicks through to its full report.
- ③ Charts follow data-viz rules (`ui-system-and-design-tokens.md` §7): forecast bands visually distinct (hatched), never fake precision.
- ④ Revenue mix as horizontal bars (readable, not pie).
- ⑤ Pacer insights: correlation → suggested experiment, each dismissable or actionable.
- ⑥ Network intelligence teaser: anonymized benchmarks, k-anonymity always labeled.

**Primary action:** click-through any tile to its report.
**States:** *Empty:* sample-data mode toggle (watermarked "Sample") + "your first insights appear after ~2 weeks of activity". *Loading:* tiles resolve independently (streamed), skeletons hold layout. *Error:* per-widget retry; global "data freshness" indicator if the pipeline lags.
**Superhuman test:** above-the-fold answers the board meeting in one glance; period switch <300 ms (pre-aggregated); every number explains itself on hover (definition tooltip).

---

## MEMBER APP (mobile, white-labeled — shown in club brand)

### W10. Home Feed

```
┌──────── 390pt ────────┐
│ ①◉ Harbor City Runners│
│    Hey Leo 🔥 6-wk    │
│    streak      🔔 ②   │
├───────────────────────┤
│ ③┌ SAT · 07:00 ─────┐ │
│  │ Saturday Long Run │ │
│  │ 12K · River Loop  │ │
│  │ 23 going · Ana +2 │ │
│  │ [ I'm going ✓ ]   │ │
│  └───────────────────┘ │
│ ④┌ October 100K ────┐ │
│  │ ◔ 64/100km · 9d   │ │
│  │ you're #12 ▲3     │ │
│  └───────────────────┘ │
│ ⑤ ◉ Coach Maya · 2h   │
│   Track tips for Tue…  │
│   ♡ 24  💬 6           │
│ ⑥ ◉ Ana finished her  │
│   first half! 21.1km  │
│   ♡ 89  💬 31  🎉      │
│ ⑦ 🎁 New perk: 20% at  │
│   Harbor Sports [View] │
├───────────────────────┤
│ ⑧ Home Events Train   │
│    Perks  Me          │
└───────────────────────┘
```

- ① Club-branded header (club token overrides); personal streak = daily hook.
- ② Notification center (member flavor: kudos, reminders, unlocks).
- ③ Next-event card pinned first with one-tap RSVP — never buried by feed content.
- ④ Live challenge progress card (ring + rank delta).
- ⑤⑥ Feed: club posts + member milestones (milestones auto-generated only from consented `activity.summary`, and only classes the member enabled).
- ⑦ Perk unlock cards deep-link to passport.
- ⑧ Five-tab bar; center tabs reachable by thumb.

**Primary action:** RSVP on the next-event card.
**States:** *Empty* (just joined): welcome card + next event + "connect your tracker" card — never a blank feed. *Loading:* cached feed instantly, silent refresh. *Error/offline:* cached content + offline banner; RSVP queues and syncs.
**Superhuman test:** cold open → content <1 s; RSVP in one tap without leaving feed; feed is calm — max one brand/perk card per session view.

---

### W11. Event Detail + RSVP

```
┌──────── 390pt ────────┐
│ ◂  ①┌ route map ────┐ │
│     │  ~~~~~~~~     │ │
│     │ 12K · 84m ↗   │ │
│     └───────────────┘ │
│ Saturday Long Run     │
│ ② Sat 18 Jul · 07:00  │
│ 📍 Marina Gate [Maps] │
│ ☀ 22° at start        │
│ ③ Pace groups:        │
│ [5:00] [5:45✓] [6:30] │
│ ④ ◉◉◉◉◉ +18 going     │
│    Ana & 2 friends    │
│ ⑤ Bring: water, cap.  │
│ Waiver signed ✓       │
├───────────────────────┤
│ ⑥ [ I'm going → ]     │
│    free · 16 spots    │
└───────────────────────┘
```

- ① Route hero: map, distance, elevation — the runner's first three questions.
- ② Logistics block with native handoffs (Maps, calendar).
- ③ Pace-group picker doubles as RSVP metadata (feeds Live Day grouping).
- ④ Social proof: friends first, then count. Tapping shows the (privacy-respecting) attendee list.
- ⑤ Practical details + waiver status inline (sign in-flow if missing — one screen, not a PDF).
- ⑥ Sticky RSVP button with price/capacity honesty; paid events show price + Apple/Google Pay.

**Primary action:** I'm going (→ instant confirm sheet: added to calendar ✓, ticket ready ✓, "invite a friend" link).
**States:** *Full:* button becomes [Join waitlist · #4 in line] with honest odds. *Loading:* hero shimmer. *Error:* RSVP retry with queued intent; *Canceled:* banner + one-tap "see alternatives".
**Superhuman test:** decision-to-commit in ≤10 s; everything above the fold; RSVP works offline (queued).

---

### W12. QR Check-in Ticket

```
┌──────── 390pt ────────┐
│ ◂ Saturday Long Run   │
│   Sat 07:00 · Marina  │
│                       │
│  ①┌───────────────┐   │
│    │  ▓▓ ▓  ▓▓▓  │   │
│    │  ▓ ▓▓▓  ▓ ▓ │   │
│    │  ▓▓  ▓ ▓▓ ▓ │   │
│    │   QR CODE    │   │
│    └───────────────┘   │
│  ② Leo Martins        │
│     Pace group 5:45   │
│     Waiver ✓          │
│                       │
│ ③ [ Add to Wallet ]   │
│ ④ ⓘ Works offline     │
│ ⑤ Can't scan? Code:   │
│    HCR-8412           │
└───────────────────────┘
```

- ① QR fills the width; screen brightness auto-boosts; stays awake; high-contrast on any club theme (white tile guaranteed).
- ② Identity + pace group + waiver state — what the scanning volunteer needs at a glance.
- ③ Wallet pass (Apple/Google) with lock-screen relevance 1 h before start.
- ④ Offline honesty: token pre-issued, no network needed at the park.
- ⑤ Human-readable fallback code for the name-search path (W5 ④).

**Primary action:** none — the screen *is* the action. Secondary: Add to Wallet.
**States:** *Pre-event:* countdown chip. *Checked-in:* full-screen success (✅ + streak + "you're runner #34 today") replacing the QR. *Error:* invalid/expired ticket shows reason + "find me by name" instructions. *Loading:* never — ticket cached at RSVP time.
**Superhuman test:** reachable in ≤2 taps from lock screen (wallet) or app open; zero network dependency; scan-to-green <400 ms end-to-end.

---

### W13. Profile + Consent Controls

```
┌──────── 390pt ────────┐
│ ◉ Leo Martins         │
│ Member since Mar 2026 │
│ 🔥6wk · 214km · 4 🏅   │
├───────────────────────┤
│ Membership            │
│ Club plan · renews    │
│ 1 Mar [Manage]        │
├───────────────────────┤
│ ① PRIVACY & SHARING   │
│ What Harbor City      │
│ Runners can see:      │
│ ②┌───────────────────┐│
│ ││Basic profile    ✓ ││
│ ││name, photo —      ││
│ ││needed to be a     ││
│ ││member             ││
│ │├───────────────────┤│
│ ││Weekly summary   ✓ ││
│ ││distance & runs —  ││
│ ││counts toward      ││
│ ││challenges  [off]  ││
│ │├───────────────────┤│
│ ││Detailed workouts ✗││
│ ││routes & splits    ││
│ ││[turn on]          ││
│ │├───────────────────┤│
│ ││Medical info      ✗││
│ ││③ only visible in  ││
│ ││emergencies, always││
│ ││audited  [set up]  ││
│ │├───────────────────┤│
│ ││Brand offers      ✗││
│ ││Live location     ✗││
│ ││Photos of me      ✓││
│ └┴───────────────────┘│
│ ④ [See access log]    │
└───────────────────────┘
```

- ① Framed as "what your club can see", per-club — not a legal settings dump. Maps 1:1 to the seven canonical scopes (`profile.basic`, `activity.summary`, `activity.detailed`, `health.medical`, `location.live`, `marketing.brands`, `photos.appearances`).
- ② Each scope card: plain-language name, what it includes, why it's useful, current state, single toggle. Value stated without pressure; turning off never nags.
- ③ Medical scope explains the break-glass model in one sentence.
- ④ Access log: every time staff viewed gated data (esp. medical break-glass) — radical transparency as the trust moat.

**Primary action:** per-scope toggle (instant effect, undoable).
**States:** *Loading:* current grants cached. *Error:* toggle reverts visually + retry toast — never silently fails on a privacy control. *Pending request:* if staff requested a scope, a highlighted card explains who asked and why, with Allow / Deny equal weight.
**Superhuman test:** any scope changed in ≤3 taps from app open; comprehension test target: 90% of users can correctly state what each granted scope shares.

---

### W14. Benefits Passport

```
┌──────── 390pt ────────┐
│ PERKS                 │
│ ①┌ Your passport ───┐ │
│  │ Club tier: Silver │ │
│  │ ▓▓▓▓▓▓░░ 2 runs   │ │
│  │ to Gold           │ │
│  │ ② value redeemed  │ │
│  │    $34 this year  │ │
│  └───────────────────┘ │
│ ③ UNLOCKED (4)        │
│ ┌─────────┐┌─────────┐│
│ │Harbor   ││Emre Kaya││
│ │Sports   ││Physio   ││
│ │20% off  ││10% off  ││
│ │[Redeem] ││[Book]   ││
│ └─────────┘└─────────┘│
│ ④ LOCKED (3)          │
│ ┌─────────┐┌─────────┐│
│ │🔒 Race   ││🔒 NoxRun ││
│ │entry    ││trial    ││
│ │Gold tier││opt-in ⑤ ││
│ └─────────┘└─────────┘│
├───────────────────────┤
│ Home Events Train     │
│ [Perks] Me            │
└───────────────────────┘
```

- ① Tier progress makes the passport a game, not a coupon folder.
- ② "Value redeemed" = the membership-pays-for-itself receipt.
- ③ Unlocked perks: partner logo, value, one verb (Redeem opens the store-mode QR/code screen — big, bright, cashier-legible).
- ④ Locked perks create pull ("2 runs to Gold").
- ⑤ Brand perks gated on `marketing.brands` show an explicit opt-in explainer instead of silently appearing — consent honored at the perk level.

**Primary action:** Redeem on an unlocked perk.
**States:** *Empty:* "Your club is setting up perks" + the tier meter still visible (progress exists before perks do). *Loading:* card skeletons. *Error:* redemption failures give the fallback code; redemptions are idempotent (re-tap safe).
**Superhuman test:** at the till: app open → scannable redemption ≤3 s; redeemed state syncs instantly to the organizer's Redemptions log.

---

### W15. Challenge Detail

```
┌──────── 390pt ────────┐
│ ◂ OCTOBER 100K        │
│ ①    ◔ 64 / 100 km    │
│      9 days left      │
│   on pace? ~just~ ✦   │
│ ② "18K this week      │
│    keeps you on track"│
├───────────────────────┤
│ ③ LEADERBOARD  [♀|all]│
│  10 ◉ Zara K.   71km  │
│  11 ◉ Ana D.    68km  │
│ ▶12 ◉ You       64km  │
│  13 ◉ Tunde A.  61km  │
│ ④ friends only ▾      │
├───────────────────────┤
│ ⑤ ACTIVITY COUNTED    │
│ Tue Track 8K ✓ synced │
│ Sun Long 14K ✓ Strava │
├───────────────────────┤
│ ⑥ 🏅 Finisher badge + │
│ free race-day photo   │
│ ⑦ [ Log a run ]       │
└───────────────────────┘
```

- ① Progress ring is the hero; honest pace status.
- ② Pacer nudge: specific, achievable, never shaming.
- ③ Leaderboard defaults to "around you" (±2 ranks) not the top 10 — motivation for the middle of the pack; filters for fairness views.
- ④ Friends-only toggle keeps it social, not intimidating.
- ⑤ Counted-activity list builds trust in the sync ("my run counted").
- ⑥ Prize visibility sustains motivation.
- ⑦ Manual log fallback for members without a connected tracker (flagged as manual on leaderboards per club fairness settings).

**Primary action:** contextual — [Join challenge] pre-join; [Log a run] / passive tracking post-join.
**States:** *Pre-join:* hero + friends already in + [Join]. *Ended:* results + badge ceremony screen + "next challenge" teaser. *Loading:* ring animates in from cache. *Error:* sync-lag notice ("Strava can take ~15 min") instead of a scary zero.
**Superhuman test:** progress visible <1 s from tap; sync trust handled by ⑤; joining is one tap with scopes already granted (no mid-flow consent wall — challenge join uses `activity.summary` granted at onboarding).

---

## BRAND PORTAL

### W16. Campaign Dashboard (Brand Portal home)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ ◆ NoxRun · Brand Portal      ①[Q3 2026 ▾]        [+ New campaign] ◉SL     │
├────────────────────────────────────────────────────────────────────────────┤
│ ②┌ Active campaigns ┐┌ Verified reach ┐┌ Redemptions ┐┌ Cost/trial ┐      │
│  │ 3                ││ 4,120 runners  ││ 486 (11.8%)  ││ $6.40      │      │
│  │ 2 pending appr.  ││ across 9 clubs ││ ▲ vs bench   ││ ▼ vs paid  │      │
│  └──────────────────┘└────────────────┘└──────────────┘│  social    │      │
│ ③ CAMPAIGNS                                            └────────────┘      │
│  Name              Clubs  Status        Redemptions  Spend    ROI          │
│  Stability trial   4      ● Live        212/wk ╱╲╱   $2.1k    [Report]     │
│  Autumn 10% perk   9      ● Live        183/wk ╱─╱   $1.4k    [Report]     │
│  Track night spons 2      ◐ 1 approval… —            $800     [Nudge]      │
│ ④ AUDIENCE PULSE (aggregated · k≥50)                                       │
│  Segment: “urban 30-45k/wk runners, Lagos+Abuja” — 1,240 runners           │
│  ⚠ “sub-3h marathoners, Abuja” — cohort too small to display (k<50)        │
│ ⑤ ✦ Suggested: clubs with fit score >80 open to Q4 partnerships: 6 [View] │
└────────────────────────────────────────────────────────────────────────────┘
```

- ① Period scoping; workspace-level view across all campaigns and clubs.
- ② KPI tiles in marketing language (reach, redemption rate, cost-per-trial vs. the brand's own benchmark) — every number links to methodology.
- ③ Campaign rows: status includes club-approval progress (◐) with a polite [Nudge]; Report opens the same live report artifact clubs see (one source of truth).
- ④ Audience pulse enforces k-anonymity visibly — suppressed cohorts say so explicitly, never approximate.
- ⑤ Pacer-for-brands suggests next clubs by fit score; contact always flows through club approval.

**Primary action:** + New campaign.
**States:** *Empty* (explore mode): sample-data watermarked dashboard + "Launch your first campaign" wizard entry; audience explorer live with aggregate-only data. *Loading:* independent tile resolution. *Error:* stale-metric badges; approval-status failures degrade to email notification fallback.
**Superhuman test:** Sofia's Monday check-in ≤60 s: portfolio health above the fold, one click to any report, export to QBR deck in two clicks.

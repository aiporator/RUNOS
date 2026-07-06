// Content marketing — real, substantive articles for organic search and the
// GTM playbook's "content loop" (see docs/05-business/gtm-strategy.md).
// Static data by design, same pattern as lib/verticals.ts: no CMS dependency,
// swap for a headless CMS query once there's an editorial team to run one.

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] };

export interface Article {
  slug: string;
  title: string;
  dek: string;
  category: 'Ops' | 'Growth' | 'Product' | 'Privacy' | 'Playbook';
  readMinutes: number;
  publishedAt: string; // ISO date, no time — editorial date, not a timestamp
  body: ArticleBlock[];
  cta: { label: string; href: string };
}

export const ARTICLES: Article[] = [
  {
    slug: 'seven-app-problem',
    title: 'The seven-app problem: why your club runs on duct tape',
    dek: 'WhatsApp for chatter, Strava for miles, Eventbrite for tickets, Sheets for members, Instagram for reach, PayPal for dues. Seven tools, zero of them talking to each other.',
    category: 'Ops',
    readMinutes: 5,
    publishedAt: '2026-05-04',
    body: [
      { type: 'p', text: 'Ask any organizer how their club actually runs and you get the same answer in a different order every time: a WhatsApp group for chatter, Strava for who ran what, Eventbrite for the race-day ticket, a Google Sheet for the member list, Instagram for reach, and PayPal or Venmo for dues. Seven tools. None of them know the other six exist.' },
      { type: 'p', text: "That gap gets bridged by a person, not software. Someone copies RSVP counts from Eventbrite into the Sheet. Someone screenshots the WhatsApp poll into a caption. Someone manually reconciles who paid dues against who showed up. That person is usually a volunteer with a full-time job elsewhere, and the club's entire operating capacity is bounded by how much of their evening they have left." },
      { type: 'h2', text: 'The tools are excellent. The seams are the problem.' },
      { type: 'p', text: "This isn't a knock on any one tool — Strava is genuinely the best place to log a run, and WhatsApp is genuinely the best place for a group chat. The failure mode is structural: each tool optimizes for its own slice and has no reason to talk to the others. Eventbrite doesn't know a member's attendance history. Strava doesn't know who owes dues. Nobody owns the connective layer, so a human has to be it." },
      { type: 'list', items: [
        'A new member has to be re-entered in the Sheet, added to WhatsApp, and told where to find the Strava club — three separate onboarding steps, one for each disconnected tool.',
        'Attendance lives in someone\'s head or a Sheet nobody else can find, so "who\'s at risk of drifting away" is a guess, not a report.',
        'Eventbrite\'s 5%+ ticket fee is a tax on the one part of the stack that touches money — paid by a nonprofit club, to a company that has no idea the club exists.',
      ] },
      { type: 'h2', text: 'What changes when it\'s one system' },
      { type: 'p', text: "The fix isn't a better spreadsheet template. It's collapsing the seams: one member record that events, payments, and communications all read from and write to. Publish an event once and the landing page, registration, reminders, and QR check-in all exist automatically, because they're views onto the same data — not five separate configurations a volunteer has to keep in sync by hand." },
      { type: 'quote', text: 'Strava owns activity. Eventbrite owns events. Nobody owns the operating system underneath a running club — that\'s the actual gap.' },
      { type: 'p', text: "You can see the smallest version of this collapse in under a minute: create a real event, get a real RSVP, no account required. It's the same engine that runs the full club workspace underneath, just with the training wheels of a login removed." },
    ],
    cta: { label: 'Create a real event in 60 seconds — no account →', href: '/new' },
  },
  {
    slug: 'qr-checkin-vs-clipboard',
    title: 'QR check-in vs. the clipboard: what actually changes on race morning',
    dek: 'A clipboard tells you who signed a piece of paper. A QR check-in tells you who\'s actually there, in real time, on every device your volunteers are holding.',
    category: 'Product',
    readMinutes: 4,
    publishedAt: '2026-05-18',
    body: [
      { type: 'p', text: "Every organizer has run the clipboard at least once: a printed roster, a pen tied to it with string, and a volunteer squinting to match a name against a list in the dark at 6:15am. It works, technically. It also doesn't scale past about thirty people before the line backs up and the pen goes missing." },
      { type: 'h2', text: 'The clipboard\'s real failure mode isn\'t the paper' },
      { type: 'p', text: "It's that the data dies the moment the event ends. Someone has to retype the roster into a spreadsheet afterward — or, more often, nobody does, and 'who actually showed up' becomes a question nobody can answer three weeks later when you're deciding who to invite back for a smaller, more committed group." },
      { type: 'list', items: [
        'QR check-in: scan → confirmed, instantly, on the same device every volunteer already has in their pocket.',
        'Idempotent by design — the same person scanning twice doesn\'t double-count, so nobody has to babysit the register.',
        'The count updates live for every volunteer at every entry point, not just the one holding the clipboard.',
        'Attendance becomes a permanent record automatically — no retyping, no "I\'ll do it later" that never happens.',
      ] },
      { type: 'h2', text: 'Why this matters more than it sounds like it should' },
      { type: 'p', text: "Attendance history is the input to almost everything else an organizer wants to do: knowing who's drifting away before they quit silently, knowing which members to ask for a testimonial, knowing whether a sponsor's activation actually reached people. A clipboard that gets thrown out after the event throws all of that away with it." },
      { type: 'p', text: 'This is one of the smaller surfaces in the product, and one of the easiest to underrate until you\'ve run a 200-person race morning with a spreadsheet instead. It\'s live in the full organizer workspace today — the demo walks through mission control, live arrival feed included.' },
    ],
    cta: { label: 'See the QR check-in mission control in the demo →', href: '/demo' },
  },
  {
    slug: 'real-cost-of-eventbrite-fees',
    title: 'The real cost of Eventbrite fees for community organizers',
    dek: 'A 5%+ ticket fee sounds small until you add up a season of races, workshops, and socials — and realize the fee doesn\'t shrink as the club grows. It grows with it.',
    category: 'Growth',
    readMinutes: 4,
    publishedAt: '2026-06-01',
    body: [
      { type: 'p', text: "Ticketing fees are usually framed as a rounding error: a few percent, easy to shrug off against the convenience of not building your own registration flow. But a running club or workshop studio isn't selling one ticket — it's selling hundreds across a season, and a flat percentage fee doesn't get cheaper as volume goes up. It gets bigger, in absolute terms, exactly when the club can least afford to keep paying a tax on its own growth." },
      { type: 'h2', text: 'Fees that grow against you vs. fees that shrink with you' },
      { type: 'p', text: 'The alternative worth asking for is a platform fee structure that moves the other direction: higher on a small club just getting started (when the absolute dollars are tiny anyway), and lower as the club scales past the point where a fixed percentage starts to really hurt. A fee that shrinks from 2% down to 0.5% as a club grows is a fundamentally different incentive than one that\'s flat no matter what.' },
      { type: 'list', items: [
        'Ticketing fees below the standard ~5%+, waived entirely on the higher tiers once a club is running at scale.',
        'A platform fee that moves 2% → 1% → 0.5% as membership grows — the platform makes money by the club growing, not by taxing every transaction at the same rate forever.',
        'No fee at all on the free tier: any one-off event under 20 people costs nothing, permanently, no trial period expiring.',
      ] },
      { type: 'h2', text: 'The honest version of this argument' },
      { type: 'p', text: "This only holds up if the alternative platform is actually solving a bigger problem than ticketing — otherwise it's just a different vendor taking a cut. The pitch here is that the same system handling the ticket also handles the member record, the reminders, the check-in, and the social promotion, so the fee is buying the collapse of six tools into one, not just a marginally cheaper checkout page." },
      { type: 'quote', text: 'Members never pay. The club subscribes, and the platform fee shrinks as the club grows — the incentive points the same direction as the organizer\'s.' },
    ],
    cta: { label: 'See the full pricing breakdown →', href: '/pricing' },
  },
  {
    slug: 'consent-not-compliance',
    title: 'Consent, not compliance: how member data should actually work',
    dek: 'GDPR compliance is a checkbox exercise if it stops at a cookie banner. The harder, more useful version gives every member real control over exactly what a club can see.',
    category: 'Privacy',
    readMinutes: 5,
    publishedAt: '2026-06-15',
    body: [
      { type: 'p', text: "Most consumer software treats privacy as a compliance cost: the minimum disclosure required to avoid a fine, buried in a settings page nobody visits. For a running club, that's the wrong frame entirely — the data in question is often genuinely sensitive (health metrics, location patterns, contact details for minors in youth programs) and it's being handled by a volunteer organizer, not a corporate data team with a legal department." },
      { type: 'h2', text: 'What "scoped consent" actually means in practice' },
      { type: 'p', text: 'Rather than one blanket privacy policy a member agrees to once and forgets, the right model is a small number of independently revocable scopes: does the club see your weekly mileage? Your PRs? Your contact email for sponsor offers? Each scope is a separate, visible toggle a member controls at any time — not a single all-or-nothing agreement.' },
      { type: 'list', items: [
        'Activity summary (weekly km, PRs) — off by default; a member opts in if they want the club to see their training trend.',
        'Contact sharing for sponsor perks — separate from event communications, so a discount code offer doesn\'t require handing over the same access as a race-day reminder.',
        'Health-scope data (if collected at all) never flows through the general API — it\'s architecturally separated, not just policy-separated.',
      ] },
      { type: 'h2', text: 'Why this is a moat, not just a compliance line item' },
      { type: 'p', text: "A club that can honestly tell members 'you control exactly what we see, scope by scope' earns a level of trust that a generic events platform never has a reason to build, because ticketing software doesn't need an ongoing relationship with the attendee. A community operating system does — and the consent model is what makes that relationship durable instead of extractive." },
      { type: 'p', text: "This is also, bluntly, a defensibility argument: a consented data layer that members actively trust is hard for a competitor to copy by just shipping a similar feature list, because trust is earned over time, not deployed in a sprint." },
    ],
    cta: { label: 'Read the permission model in the architecture docs →', href: '/pricing' },
  },
  {
    slug: 'whatsapp-group-to-workspace',
    title: 'From WhatsApp group to workspace: a migration playbook',
    dek: 'You don\'t need to migrate your whole club in one weekend. Here\'s the order that actually works, in five steps, none of which require your members to do anything.',
    category: 'Playbook',
    readMinutes: 6,
    publishedAt: '2026-06-22',
    body: [
      { type: 'p', text: "The instinct when adopting new club software is to try to move everything at once: import every member, recreate every past event, migrate the whole group chat history. That's exactly the amount of work that causes organizers to give up halfway through a Sunday afternoon and go back to the spreadsheet. The migration that actually sticks is smaller and sequenced." },
      { type: 'h2', text: 'Step 1 — publish one real event, change nothing else' },
      { type: 'p', text: "Before touching the member list or announcing anything, publish a single upcoming run, class, or workshop as a real event. This gets you a shareable public page, registration, and QR check-in for one session, with zero disruption to how the club currently communicates. If this step doesn't feel effortless, stop here — nothing downstream will feel effortless either." },
      { type: 'h2', text: 'Step 2 — import members without re-onboarding anyone' },
      { type: 'p', text: 'A CSV of names and emails (or a pasted list straight from the group chat) becomes the member list in under a minute — nobody has to create an account, set a password, or download anything. This is deliberately the lowest-friction step in the whole migration: the organizer does it once, alone, and nothing changes from the member\'s side yet.' },
      { type: 'h2', text: 'Step 3 — let the automations run on the next event, not a backlog' },
      { type: 'p', text: "Reminders, the social campaign draft, and check-in only need to work on the next event — there's no requirement to backfill history for events that already happened. Momentum comes from one good live example, not from perfectly reconstructing the past." },
      { type: 'h2', text: 'Step 4 — keep the WhatsApp group. Seriously.' },
      { type: 'list', items: [
        'The group chat stays exactly where it is — nothing here replaces the social layer members already like.',
        'What moves is the operational load: who\'s registered, who\'s paid, who checked in, what the reminder sequence says.',
        'Members experience one new thing at a time (a nicer event page, then a QR code, then a reminder) rather than a single jarring "we switched platforms" announcement.',
      ] },
      { type: 'h2', text: 'Step 5 — bring the volunteer who was the API into the loop last' },
      { type: 'p', text: 'The person manually reconciling spreadsheets and screenshots is usually the most skeptical of a new tool, reasonably so — they\'ve been burned by "this will save you time" promises before. Show them the reduced version of their own job after steps 1–4 are already live, rather than asking them to take that on faith up front.' },
      { type: 'quote', text: 'The founding-club program does this migration white-glove — but the same five steps work solo, in an afternoon, for any organizer willing to start with one event.' },
    ],
    cta: { label: 'Start the onboarding wizard →', href: '/start' },
  },
  {
    slug: 'what-a-digital-chief-of-staff-does',
    title: 'What a digital chief of staff actually does for a volunteer-run club',
    dek: 'Pacer doesn\'t replace the organizer. It does the unglamorous analysis work nobody has time for on top of a full-time job: predicting attendance, flagging churn, drafting the sponsor pitch.',
    category: 'Product',
    readMinutes: 5,
    publishedAt: '2026-06-29',
    body: [
      { type: 'p', text: 'Most "AI for X" pitches are vague on purpose, because a specific claim is easier to disprove. So here\'s a specific one: a club\'s digital chief of staff should be able to look at the member and event data a club already has, and answer three questions an organizer genuinely doesn\'t have time to work out by hand every week.' },
      { type: 'h2', text: 'Question 1 — who\'s about to churn, before they say anything' },
      { type: 'p', text: "A member who's gone from weekly to monthly to nothing over eight weeks rarely announces it. They just stop showing up, and by the time an organizer notices the gap in the attendance sheet, the member has usually already mentally left. Pacer's job is to surface that drift pattern early enough that a personal check-in message actually has a chance of working." },
      { type: 'h2', text: 'Question 2 — how many people will actually show up' },
      { type: 'p', text: "RSVP counts and actual attendance are different numbers, and the gap between them is exactly the information an organizer needs to plan capacity, order the right amount of water, or decide whether to open a waitlist. A prediction grounded in this club's own historical show-up rate — not an industry-wide average — is the useful version of this." },
      { type: 'h2', text: 'Question 3 — what does the sponsor pitch actually say' },
      { type: 'p', text: "Most volunteer organizers have never written a sponsorship proposal and don't have a template. Drafting one from the club's real, verified data — member count, weekly active rate, past event attendance — turns a blank page into a five-minute edit instead of a multi-hour research project the organizer keeps postponing." },
      { type: 'list', items: [
        'Attendance and churn predictions grounded in this club\'s own history, not generic benchmarks.',
        'Sponsor proposal drafts pulled from verified club data, not invented statistics.',
        'A full month planned out — event cadence, content calendar, and outreach — in one sitting instead of scattered across a week.',
      ] },
      { type: 'p', text: "None of this replaces the organizer's judgment about their own community — it replaces the hours of manual analysis that judgment currently has to compete with for time." },
    ],
    cta: { label: 'Ask Pacer a question in the live demo →', href: '/demo' },
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function otherArticles(slug: string, count = 2): Article[] {
  return ARTICLES.filter((a) => a.slug !== slug).slice(0, count);
}

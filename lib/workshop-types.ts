// Workshop-type landing pages — one per craft, for organizers who search
// "[craft] class software" rather than the generic "workshop software."
// Each entry carries real, craft-specific operating detail (not a template
// with the noun swapped) so the page reads as written for that instructor.

export type WorkshopTypeId =
  | 'pottery'
  | 'woodworking'
  | 'cooking'
  | 'photography'
  | 'painting'
  | 'jewelry'
  | 'floristry'
  | 'textile';

export interface WorkshopType {
  id: WorkshopTypeId;
  slug: string;
  name: string;
  /** The German-market term, since Töpferkurse etc. are real search terms in the cities we're launching in. */
  germanTerm?: string;
  tagline: string;
  /** What's operationally different about running this craft as a business — grounded, specific. */
  detail: { title: string; body: string };
  /** The materials-cost angle, specific to this craft. */
  materials: { title: string; body: string };
  /** A second craft-specific operating concern (safety, perishables, scheduling, etc). */
  secondPain: { title: string; body: string };
  sampleSession: string;
  /** Substring keywords used to match live instant events on this craft. */
  keywords: string[];
}

export const WORKSHOP_TYPES: WorkshopType[] = [
  {
    id: 'pottery',
    slug: 'pottery',
    name: 'Pottery & Ceramics',
    germanTerm: 'Töpferkurs',
    tagline: 'Wheels, kilns, and a waitlist that never stops filling.',
    detail: {
      title: 'The kiln sets your calendar, not the sign-up sheet',
      body: 'A glaze firing takes 8–12 hours and a bisque firing another 6–8 — the kiln schedule, not demand, decides how many sessions a studio can actually run in a month. That constraint has to shape the booking calendar itself, not fight it after the fact.',
    },
    materials: {
      title: 'Clay and glaze bought for the sign-up sheet, not the room',
      body: 'Clay ordered for sixteen registrations and used by eleven doesn\'t get refunded — it gets reused if you\'re lucky, wasted if the glaze was already mixed. Ordering off same-day confirmed headcount instead of the week-old sheet is most of the fix.',
    },
    secondPain: {
      title: 'Greenware breaks between sessions if nobody\'s watching',
      body: 'A piece left to dry unevenly between a Tuesday throw and a Thursday trim cracks — and the person who notices first is usually the student, not the instructor. Session-to-session tracking of whose piece is at what stage is a real operational need, not a nice-to-have.',
    },
    sampleSession: 'Intro to Wheel Throwing — Saturday Session',
    keywords: ['pottery', 'ceramic', 'ceramics', 'clay', 'töpfer', 'wheel throwing', 'kiln'],
  },
  {
    id: 'woodworking',
    slug: 'woodworking',
    name: 'Woodworking',
    germanTerm: 'Holzwerkstatt',
    tagline: 'Sharp tools, real liability, and lumber that isn\'t cheap to over-order.',
    detail: {
      title: 'A waiver isn\'t paperwork here — it\'s the first five minutes',
      body: 'Table saws and chisels mean every attendee needs a safety waiver on file before they touch a tool, checked at the door by whoever\'s running that session — not assumed signed because they registered online three weeks ago.',
    },
    materials: {
      title: 'Lumber bought per board-foot doesn\'t forgive a guess',
      body: 'A cutting board class priced for ten needs ten blanks of a specific dimension — not "about ten." Ordering off a stale registration count means either wasted stock or a student standing at an empty bench.',
    },
    secondPain: {
      title: 'Shop capacity is a headcount, not a room size',
      body: 'A shop with six benches can\'t safely run twelve people through table-saw instruction regardless of how many tickets get sold — capacity has to cap at the tool count, not the room\'s square footage.',
    },
    sampleSession: 'Beginner Cutting Board — Saturday Workshop',
    keywords: ['woodworking', 'wood shop', 'carpentry', 'furniture making', 'holzwerkstatt'],
  },
  {
    id: 'cooking',
    slug: 'cooking',
    name: 'Cooking & Culinary',
    germanTerm: 'Kochkurs',
    tagline: 'Perishables, food safety, and a kitchen that\'s rented by the hour.',
    detail: {
      title: 'Ingredients expire whether or not the class fills',
      body: 'Fish bought Thursday for a Saturday class doesn\'t hold if three people cancel Friday night — a cooking class\'s materials cost is the least forgiving of any craft here, and the ordering window is the shortest.',
    },
    materials: {
      title: 'A per-head grocery order needs a same-day headcount',
      body: 'Proteins, produce, and dairy bought for the registration count from a week ago is either wasted or short. The closer the order happens to the actual session, against the actual confirmed count, the less goes in the bin.',
    },
    secondPain: {
      title: 'The venue is rented, and the clock is real',
      body: 'A shared commercial kitchen booked for a three-hour window means setup, teaching, and cleanup all have to fit — reminders that get people there on time aren\'t a nice touch, they\'re the difference between finishing the menu and not.',
    },
    sampleSession: 'Handmade Pasta from Scratch — Evening Class',
    keywords: ['cooking', 'culinary', 'baking', 'kitchen class', 'kochkurs', 'cooking class'],
  },
  {
    id: 'photography',
    slug: 'photography',
    name: 'Photography',
    germanTerm: 'Fotokurs',
    tagline: 'Weather-dependent sessions and a gear list nobody wants to re-type.',
    detail: {
      title: 'An outdoor session has a rain plan or it has a no-show problem',
      body: 'A golden-hour shoot rescheduled for weather needs everyone notified fast, not found out about by showing up to an empty meeting point — reminders and reschedule messages have to go out in one push, not one-by-one.',
    },
    materials: {
      title: 'Gear checklists are the "materials list" here',
      body: '"Bring a camera with manual mode, a 50mm if you have one" only works if every registrant actually sees it before showing up — attached to the confirmation, not buried in a welcome email nobody reopens.',
    },
    secondPain: {
      title: 'Small groups are the point, not a limitation',
      body: 'A street photography walk stops working past eight or ten people — the instructor can\'t actually critique a shot over someone\'s shoulder in a crowd of twenty. Capacity caps here protect the product, not just the room.',
    },
    sampleSession: 'Golden Hour Street Photography Walk',
    keywords: ['photography', 'photo walk', 'camera class', 'fotokurs', 'photo workshop'],
  },
  {
    id: 'painting',
    slug: 'painting',
    name: 'Painting & Fine Art',
    germanTerm: 'Malkurs',
    tagline: 'Ventilation, drying time, and a course that builds week over week.',
    detail: {
      title: 'A multi-week course only works if attendance compounds',
      body: 'Week 4 of an oil painting course assumes everyone has the week 3 canvas still drying — a student who missed week 2 is genuinely behind, not just absent. Tracking who\'s on which week matters more here than in a drop-in format.',
    },
    materials: {
      title: 'Paint and canvas are a real per-seat cost, ordered ahead',
      body: 'Oils, canvases, and solvents bought for a fixed class size don\'t flex to a last-minute sign-up the way a digital product would — knowing the real headcount a few days out, not the day of, is what materials ordering needs here.',
    },
    secondPain: {
      title: 'Oils and solvents need a ventilated room, not any room',
      body: 'Not every rented space is suitable for solvent-based media — that\'s a room-booking constraint specific to this craft, and it shapes which sessions can run where before a single ticket sells.',
    },
    sampleSession: 'Intro to Oil Painting — 4-Week Course',
    keywords: ['painting', 'paint class', 'fine art', 'malkurs', 'art class', 'watercolor'],
  },
  {
    id: 'jewelry',
    slug: 'jewelry',
    name: 'Jewelry Making',
    germanTerm: 'Schmuckkurs',
    tagline: 'Small parts, shared tools, and metal that\'s priced by the gram.',
    detail: {
      title: 'Tool stations, not seats, are the real capacity limit',
      body: 'A soldering station or a rolling mill is shared across a class — capacity is set by how many stations exist, not how many chairs fit in the room, which is a different math than most workshop formats.',
    },
    materials: {
      title: 'Silver and gemstones are priced per gram, ordered per head',
      body: 'Metal stock bought for a confirmed class size, at current market price, is a materials cost that moves week to week — ordering against a stale headcount is a more expensive mistake here than in most crafts.',
    },
    secondPain: {
      title: 'Small components are easy to lose, hard to replace mid-session',
      body: 'A dropped clasp or a misplaced stone can stall a station for the rest of a session — an instructor\'s prep list has to account for spares in a way a painting or pottery class doesn\'t.',
    },
    sampleSession: 'Silver Ring Making — Beginner Workshop',
    keywords: ['jewelry', 'jewellery', 'silversmith', 'schmuckkurs', 'metalsmithing'],
  },
  {
    id: 'floristry',
    slug: 'floristry',
    name: 'Floristry & Flower Arranging',
    germanTerm: 'Blumenbinden',
    tagline: 'Same-day stock, no restocking, and a class that has to sell out to work.',
    detail: {
      title: 'Flowers are bought the morning of, not the week before',
      body: 'Fresh stock sourced same-day means the order to the wholesaler happens hours before the class, off whatever the confirmed count is at that moment — there\'s no "order early and adjust later" option.',
    },
    materials: {
      title: 'Unsold stems are a loss, not inventory',
      body: 'A bouquet-making class that under-fills doesn\'t get to save the extra flowers for next week — floristry has the least forgiving materials margin of any craft here, which makes accurate same-day headcount the whole game.',
    },
    secondPain: {
      title: 'A seasonal flower list changes the class every month',
      body: 'What\'s available in March isn\'t what\'s available in October — session descriptions and material lists need to be easy to update each time, not locked into a template written once.',
    },
    sampleSession: 'Seasonal Bouquet Workshop — Saturday Morning',
    keywords: ['floristry', 'flower arranging', 'florist', 'blumenbinden', 'bouquet workshop'],
  },
  {
    id: 'textile',
    slug: 'textile',
    name: 'Textile & Sewing',
    germanTerm: 'Nähkurs',
    tagline: 'Shared machines, pattern sizing, and a course that spans real weeks.',
    detail: {
      title: 'Machine availability caps the room before seats do',
      body: 'A sewing studio with eight machines can\'t run a twelve-person class safely, no matter the floor space — the same shared-equipment math as woodworking or jewelry, with its own capacity ceiling to respect.',
    },
    materials: {
      title: 'Fabric is bought by the yard, per pattern, per size',
      body: 'A beginner garment course needs fabric cut to size ahead of time for each attendee — ordering the right yardage means knowing who\'s actually coming and what they signed up to make, not a generic headcount.',
    },
    secondPain: {
      title: 'A multi-week course needs continuity tracking, not just attendance',
      body: 'Week 5 of a garment-construction course assumes everyone finished week 4\'s step — a student who missed a session needs a specific catch-up, not a generic "see you next week."',
    },
    sampleSession: 'Beginner Garment Construction — 6-Week Course',
    keywords: ['sewing', 'textile', 'fabric class', 'nähkurs', 'garment making', 'quilting'],
  },
];

export function getWorkshopType(slug: string): WorkshopType | undefined {
  return WORKSHOP_TYPES.find((w) => w.slug === slug);
}

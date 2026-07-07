// Shared template for vertical marketing pages (/for-gyms, /for-workshops, …).
// Server component — interactive bits come from existing client components
// (MarketingNav, Reveal, PricingSection, FaqAccordion).

import Link from 'next/link';
import MarketingNav from './nav';
import MarketingFooter from './footer';
import Reveal from './reveal';
import ParallaxBg from './parallax';
import PricingSection from './pricing-section';
import FaqAccordion from './faq';
import type { Faq } from './data';
import { arr, btnGhost, btnVolt, label } from './styles';
import type { Vertical } from '@/lib/verticals';
import { VerticalIcon } from '@/components/icons/vertical-icons';
import { WorkshopTypeIcon } from '@/components/icons/workshop-type-icons';
import { WORKSHOP_TYPES } from '@/lib/workshop-types';

export type VerticalPain = { title: string; body: string };
export type VerticalFeature = { title: string; body: string };

export type CalendarChipTone = 'volt' | 'warn' | 'info' | 'ok';

export type VerticalCalendarChip = {
  label: string;
  /** Day of month (1–30) the chip sits on. Keep chips in the left half of the week so labels have room. */
  day: number;
  tone: CalendarChipTone;
};

export type VerticalPageConfig = {
  vertical: Vertical;
  /** Small kicker under the emoji, e.g. "For gyms & studios". */
  kicker: string;
  hero: {
    /** Plain part of the headline. */
    headline: string;
    /** Volt-highlighted tail of the headline. */
    accent: string;
    sub: string;
  };
  pains: VerticalPain[];
  features: VerticalFeature[];
  calendar: {
    heading: string;
    body: string;
    chips: VerticalCalendarChip[];
    /** Days of month that get a volt activity dot. */
    dottedDays: number[];
  };
  faqs: Faq[];
  cta: {
    headline: string;
    accent: string;
    body: string;
  };
  /** Optional — renders a "browse by craft" band linking into /workshops/[type]. Workshops page only. */
  craftBrowse?: { heading: string; body: string };
  /** Optional — a 3-step "how it works" walkthrough, tailored per vertical. */
  howItWorks?: {
    heading: string;
    body: string;
    steps: { title: string; body: string }[];
  };
  /** Optional — full-bleed hero photo, same treatment as the homepage hero. */
  heroImage?: { src: string; alt: string };
  /** Optional — full-bleed photo behind the final CTA band. */
  ctaImage?: { src: string; alt: string };
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function VerticalHero({ config }: { config: VerticalPageConfig }) {
  const { vertical, kicker, hero, heroImage } = config;
  return (
    <header className="relative isolate overflow-hidden bg-bg pb-[110px] pt-[190px]">
      {heroImage ? (
        <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#1a2410] to-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage.src}
            alt={heroImage.alt}
            loading="eager"
            className="mk-kenburns h-full w-full object-cover [filter:saturate(0.85)_contrast(1.05)]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,13,10,0.62)_0%,rgba(12,13,10,0.4)_38%,rgba(12,13,10,0.94)_88%,#0c0d0a_100%)]" />
        </div>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-[#12170a] via-bg to-bg" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_65%_0%,rgba(205,251,80,0.1),transparent_70%)]" />
        </>
      )}
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <div className="mk-fade-up mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl border border-volt/25 bg-volt/8">
          <VerticalIcon id={vertical.id} className="h-8 w-8 text-volt" />
        </div>
        <span className="mk-fade-up mb-[22px] inline-flex items-center gap-2.5 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-volt">
          {kicker}
        </span>
        <h1
          className="mk-fade-up mx-auto max-w-[20ch] font-display text-[clamp(38px,5.6vw,76px)] font-semibold leading-[1.05] tracking-[-0.02em]"
          style={{ animationDelay: '0.1s' }}
        >
          {hero.headline} <em className="not-italic text-volt">{hero.accent}</em>
        </h1>
        <p
          className="mk-fade-up mx-auto mt-6 max-w-[52ch] text-[clamp(16px,1.5vw,19px)] text-muted"
          style={{ animationDelay: '0.2s' }}
        >
          {hero.sub}
        </p>
        <div
          className="mk-fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: '0.3s' }}
        >
          <Link href="/start" className={`group ${btnVolt}`}>
            Start free <span className={arr}>→</span>
          </Link>
          <Link href="/demo" className={`group ${btnGhost}`}>
            Try the live demo <span className={arr}>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Pains — "Sound familiar?"                                           */
/* ------------------------------------------------------------------ */

function PainsSection({ config }: { config: VerticalPageConfig }) {
  return (
    <section className="bg-bg-2 py-[110px]">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="mb-[60px] max-w-[640px]">
          <span className={`${label} text-muted`}>Sound familiar?</span>
          <h2 className="font-display text-[clamp(30px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            You didn&apos;t sign up for the admin.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {config.pains.map((pain, i) => (
            <Reveal
              key={pain.title}
              delay={i === 0 ? undefined : (Math.min(i, 2) as 1 | 2)}
              className="rounded-card border border-white/10 bg-white/[0.04] px-[30px] py-[34px] transition-all duration-500 ease-out-expo hover:-translate-y-2 hover:border-volt/40 hover:bg-white/[0.07]"
            >
              <article>
                <span className="mb-5 block font-display text-sm font-bold text-volt">
                  0{i + 1}
                </span>
                <h3 className="mb-2.5 font-display text-[21px] font-semibold leading-[1.15] tracking-[-0.02em]">
                  {pain.title}
                </h3>
                <p className="text-[15px] leading-[1.65] text-muted">{pain.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works — 3-step walkthrough                                   */
/* ------------------------------------------------------------------ */

function HowItWorksSection({ config }: { config: VerticalPageConfig }) {
  if (!config.howItWorks) return null;
  const { heading, body, steps } = config.howItWorks;
  return (
    <section className="bg-paper-2 py-[120px] text-ink">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="mx-auto mb-[70px] max-w-[640px] text-center">
          <span className={`${label} text-muted-dark`}>How it works</span>
          <h2 className="mb-[18px] font-display text-[clamp(30px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            {heading}
          </h2>
          <p className="text-muted-dark">{body}</p>
        </Reveal>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i === 0 ? undefined : (i as 1 | 2)}
              className="relative"
            >
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-ink font-display text-[17px] font-bold text-volt">
                {i + 1}
              </div>
              <h3 className="mb-2.5 font-display text-[19px] font-semibold leading-[1.15] tracking-[-0.01em]">
                {step.title}
              </h3>
              <p className="max-w-[36ch] text-[14.5px] leading-[1.65] text-muted-dark">
                {step.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Features — "One system"                                             */
/* ------------------------------------------------------------------ */

function FeaturesSection({ config }: { config: VerticalPageConfig }) {
  const { vertical } = config;
  return (
    <section className="bg-paper py-[120px] text-ink">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-[70px] grid grid-cols-1 items-end gap-10 lg:grid-cols-2">
          <Reveal>
            <span className={`${label} text-muted-dark`}>One system</span>
            <h2 className="font-display text-[clamp(32px,4.2vw,54px)] font-semibold leading-[1.05] tracking-[-0.02em]">
              Everything the {vertical.nouns.org} needs. Nothing it doesn&apos;t.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="max-w-[42ch] text-muted-dark lg:justify-self-end">
              One login, one database — every {vertical.nouns.event},{' '}
              {vertical.nouns.member}, and payment in the same place, wired together so the
              busywork runs itself.
            </p>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {config.features.map((feature, i) => (
            <Reveal
              key={feature.title}
              delay={i % 3 === 0 ? undefined : ((i % 3) as 1 | 2)}
              className="rounded-card border border-line-dark bg-white px-7 py-8 transition-all duration-500 ease-out-expo hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(16,18,8,0.12)]"
            >
              <article className="flex items-start gap-[13px]">
                <span className="mk-check !mt-1" aria-hidden="true" />
                <div>
                  <h3 className="mb-2 font-display text-lg font-semibold leading-[1.2] tracking-[-0.01em]">
                    {feature.title}
                  </h3>
                  <p className="text-[14.5px] leading-[1.6] text-muted-dark">{feature.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Browse by craft — /for-workshops only, links into /workshops/[type] */
/* ------------------------------------------------------------------ */

function CraftBrowseSection({ config }: { config: VerticalPageConfig }) {
  if (!config.craftBrowse) return null;
  const { heading, body } = config.craftBrowse;
  return (
    <section className="bg-bg-2 py-[100px]">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="mb-[50px] max-w-[640px]">
          <span className={`${label} text-muted`}>Built for your specific craft</span>
          <h2 className="mb-3 font-display text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            {heading}
          </h2>
          <p className="text-[15px] leading-[1.65] text-muted">{body}</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {WORKSHOP_TYPES.map((w) => (
            <Link
              key={w.slug}
              href={`/workshops/${w.slug}`}
              className="group flex flex-col items-center gap-2.5 rounded-card border border-line bg-white/[0.03] p-5 text-center transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-volt/40"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl border border-volt/25 bg-volt/8">
                <WorkshopTypeIcon id={w.id} className="h-[22px] w-[22px] text-volt" />
              </div>
              <span className="font-display text-[13px] font-semibold transition-colors group-hover:text-volt">
                {w.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Calendar-first — the differentiator                                 */
/* ------------------------------------------------------------------ */

const CHIP_TONES: Record<CalendarChipTone, string> = {
  volt: 'bg-volt text-ink',
  warn: 'bg-warn text-ink',
  info: 'bg-info text-ink',
  ok: 'bg-ok text-ink',
};

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
const CALENDAR_CELLS = 35;
const DAY_OFFSET = 2; // day 1 lands on Wednesday, so the grid reads like a real month

function CalendarMock({ config }: { config: VerticalPageConfig }) {
  const { chips, dottedDays } = config.calendar;
  return (
    <div className="rounded-card border border-white/10 bg-white/[0.04] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-6">
      <div className="mb-4 flex items-center justify-between px-1">
        <span className="font-display text-[15px] font-semibold text-paper">This month</span>
        <span className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted-2">
          <span className="pulse-dot h-[7px] w-[7px] rounded-full bg-volt" />
          Live schedule
        </span>
      </div>
      <div className="mb-2 grid grid-cols-7 gap-1 px-1 text-center text-[11px] font-semibold text-muted-2">
        {WEEKDAYS.map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: CALENDAR_CELLS }, (_, i) => {
          const day = i - DAY_OFFSET + 1;
          const inMonth = day >= 1 && day <= 30;
          const chip = inMonth ? chips.find((c) => c.day === day) : undefined;
          const dotted = inMonth && !chip && dottedDays.includes(day);
          return (
            <div
              key={i}
              className={[
                'relative h-12 rounded-md border sm:h-14',
                inMonth ? 'border-white/[0.07] bg-white/[0.03]' : 'border-transparent',
              ].join(' ')}
            >
              {inMonth ? (
                <span className="absolute left-1.5 top-1 text-[10.5px] text-muted-2">{day}</span>
              ) : null}
              {dotted ? (
                <span className="absolute bottom-1.5 left-1/2 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-volt/80" />
              ) : null}
              {chip ? (
                <span
                  className={`absolute left-1 top-[22px] z-10 whitespace-nowrap rounded-full px-2 py-[3px] font-display text-[10px] font-bold sm:top-6 ${CHIP_TONES[chip.tone]}`}
                >
                  {chip.label}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CalendarSection({ config }: { config: VerticalPageConfig }) {
  const { vertical, calendar } = config;
  const bullets = [
    `Recurring ${vertical.nouns.event} schedules — set once, repeats every week`,
    'Waitlists that auto-fill cancellations',
    'QR check-in at the door — live attendance, no clipboard',
    'Auto-reminders that cut no-shows before they happen',
  ];
  return (
    <section className="relative isolate overflow-hidden bg-bg py-[120px]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_25%_40%,rgba(205,251,80,0.07),transparent_70%)]" />
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-2 lg:gap-[70px]">
        <Reveal>
          <span className={`${label} text-muted`}>Calendar-first, on purpose</span>
          <h2 className="mb-5 font-display text-[clamp(30px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            {calendar.heading}
          </h2>
          <p className="mb-8 max-w-[46ch] text-[16px] leading-[1.7] text-muted">{calendar.body}</p>
          <ul className="flex flex-col gap-3.5 text-[15px] text-paper/90">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-[11px]">
                <span className="mk-check" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={2}>
          <CalendarMock config={config} />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Publish once, promote everywhere                                    */
/* ------------------------------------------------------------------ */

const CHANNELS = ['Instagram', 'Facebook', 'X', 'LinkedIn', 'TikTok', 'WhatsApp'] as const;

function PromoteSection({ config }: { config: VerticalPageConfig }) {
  const { vertical } = config;
  return (
    <section className="bg-maroon py-[110px] text-paper">
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <Reveal>
          <span className={`${label} text-muted`}>Publish once, promote everywhere</span>
          <h2 className="mx-auto max-w-[20ch] font-display text-[clamp(30px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Every {vertical.nouns.event} promotes <em className="not-italic text-volt">itself.</em>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="mx-auto mt-6 max-w-[56ch] text-[16px] leading-[1.7] text-paper/[0.72]">
            The moment a {vertical.nouns.event} is published, RunOS auto-drafts the captions, the
            reminders, and the recap — for every channel you use. Review, tweak, and schedule the
            whole run from one queue.
          </p>
        </Reveal>
        <Reveal delay={2} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {CHANNELS.map((channel) => (
            <span
              key={channel}
              className="rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 font-display text-sm font-semibold text-paper/90 transition-colors duration-300 hover:border-volt/50 hover:text-volt"
            >
              {channel}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

function VerticalFaqSection({ config }: { config: VerticalPageConfig }) {
  const { vertical } = config;
  return (
    <section className="bg-maroon-2 py-[110px] text-paper" id="faq">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-[70px]">
        <Reveal>
          <span className={`${label} text-muted`}>Questions, answered straight</span>
          <h2 className="mb-5 font-display text-[clamp(32px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            The questions every {vertical.nouns.organizer} asks first.
          </h2>
          <p className="mb-[30px] max-w-[36ch] text-paper/[0.62]">
            The deal in plain language: you own your data, your {vertical.nouns.member}s never pay
            for the platform, and if you leave you take everything with you.
          </p>
          <Link href="/start" className={`group ${btnVolt}`}>
            Start free <span className={arr}>→</span>
          </Link>
        </Reveal>
        <Reveal delay={1}>
          <FaqAccordion items={config.faqs} />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA band                                                            */
/* ------------------------------------------------------------------ */

function VerticalCtaSection({ config }: { config: VerticalPageConfig }) {
  const { cta, ctaImage } = config;
  return (
    <section className="relative isolate overflow-hidden py-[150px] text-center" id="cta">
      {ctaImage ? (
        <ParallaxBg speed={0.12} className="absolute inset-x-0 -inset-y-[12%] -z-10 bg-gradient-to-br from-[#12170a] to-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ctaImage.src}
            alt={ctaImage.alt}
            loading="lazy"
            className="h-full w-full object-cover brightness-[0.34] saturate-[0.7]"
          />
        </ParallaxBg>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#12170a] to-bg" />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_65%_at_50%_100%,rgba(205,251,80,0.09),transparent_70%)]" />
        </>
      )}
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <h2 className="mx-auto mb-6 max-w-[18ch] font-display text-[clamp(36px,5.4vw,72px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            {cta.headline} <em className="not-italic text-volt">{cta.accent}</em>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="mx-auto mb-10 max-w-[52ch] text-[17px] text-muted">{cta.body}</p>
        </Reveal>
        <Reveal delay={2}>
          <Link href="/start" className={`group ${btnVolt} px-[38px] py-[17px] !text-[17px]`}>
            Start free today <span className={arr}>→</span>
          </Link>
          <Link
            href="/demo"
            className="mt-5 block text-[14.5px] text-muted underline underline-offset-4 transition-colors duration-300 hover:text-volt"
          >
            Or poke around the live demo first
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function VerticalPage({ config }: { config: VerticalPageConfig }) {
  return (
    <main className="overflow-x-clip bg-bg text-paper">
      <MarketingNav anchorPrefix="/" />
      <VerticalHero config={config} />
      <PainsSection config={config} />
      <HowItWorksSection config={config} />
      <FeaturesSection config={config} />
      <CraftBrowseSection config={config} />
      <CalendarSection config={config} />
      <PromoteSection config={config} />
      <PricingSection />
      <VerticalFaqSection config={config} />
      <VerticalCtaSection config={config} />
      <MarketingFooter anchorPrefix="/" />
    </main>
  );
}

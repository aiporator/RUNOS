import Link from 'next/link';
import MarketingNav from '@/components/marketing/nav';
import MarketingFooter from '@/components/marketing/footer';
import Reveal from '@/components/marketing/reveal';
import ParallaxBg from '@/components/marketing/parallax';
import Hero from '@/components/marketing/hero';
import StatsSection from '@/components/marketing/stats';
import SurfacesSection from '@/components/marketing/surfaces';
import PacerSection from '@/components/marketing/pacer-chat';
import PricingSection from '@/components/marketing/pricing-section';
import FaqAccordion from '@/components/marketing/faq';
import { FAQS, STEPS, TESTIMONIALS } from '@/components/marketing/data';
import { arr, btnGhost, btnVolt, label } from '@/components/marketing/styles';
import { VERTICALS } from '@/lib/verticals';

function StepsSection() {
  return (
    <section className="bg-paper py-[120px] text-ink">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-[70px] grid grid-cols-1 items-end gap-10 lg:grid-cols-2">
          <Reveal>
            <span className={`${label} text-muted-dark`}>From chaos to operating system</span>
            <h2 className="font-display text-[clamp(34px,4.4vw,58px)] font-semibold leading-[1.05] tracking-[-0.02em]">
              Live in a week. Growing by week two.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="max-w-[42ch] text-muted-dark lg:justify-self-end">
              Import what you have, wire it once, and let the journeys run every week without you.
              Most clubs are fully live within a week.
            </p>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-[26px] lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.num}
              delay={i === 0 ? undefined : (i as 1 | 2)}
              className="group overflow-hidden rounded-card border border-line-dark bg-white transition-all duration-500 ease-out-expo hover:-translate-y-2 hover:shadow-[0_26px_60px_rgba(16,18,8,0.14)]"
            >
              <article>
                <div className="relative h-[230px] overflow-hidden bg-gradient-to-br from-[#3c4a22] to-[#171a0e]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.img}
                    alt={step.alt}
                    loading="lazy"
                    className="h-full w-full object-cover saturate-[0.85] transition-transform duration-1000 ease-out-expo group-hover:scale-[1.07]"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-volt px-3.5 py-[7px] font-display text-[13px] font-bold text-ink">
                    {step.num}
                  </span>
                </div>
                <div className="p-7">
                  <h3 className="mb-2.5 font-display text-[23px] font-semibold leading-[1.05] tracking-[-0.02em]">
                    {step.title}
                  </h3>
                  <p className="text-[15px] text-muted-dark">{step.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function InstantEventsSection() {
  return (
    <section className="relative isolate overflow-hidden bg-bg py-[120px] text-paper" id="instant-events">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_50%_0%,rgba(205,251,80,0.07),transparent_70%)]" />
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <Reveal>
          <span className={`${label} text-muted`}>Instant events — no setup, no signup</span>
          <h2 className="mx-auto max-w-[18ch] font-display text-[clamp(32px,4.4vw,58px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Just need <em className="not-italic text-volt">one event page?</em>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="mx-auto mt-6 max-w-[52ch] text-[17px] text-muted">
            No club, no gym, no problem. Create a beautiful event page in 60 seconds — free up to
            20 people, no account needed. Workshops, birthdays, meetups, training sessions.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            {VERTICALS.map((v) => (
              <span
                key={v.id}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.045] px-4 py-2 text-[13.5px] font-medium text-paper/85 transition-colors duration-300 hover:border-volt/40"
              >
                <span aria-hidden>{v.emoji}</span>
                {v.label}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/new" className={`group ${btnVolt}`}>
              Create an event free <span className={arr}>→</span>
            </Link>
            <Link href="/e/ie_demo1" className={`group ${btnGhost}`}>
              See an example
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function QuoteBand() {
  return (
    <section className="relative isolate overflow-hidden py-[170px]">
      <ParallaxBg speed={0.16} className="absolute inset-x-0 -inset-y-[12%] -z-10 bg-gradient-to-br from-[#141a0c] to-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=2000&q=80"
          alt="Runner silhouette"
          loading="lazy"
          className="h-full w-full object-cover brightness-[0.42] saturate-[0.75]"
        />
      </ParallaxBg>
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <h2 className="mx-auto max-w-[22ch] text-center font-display text-[clamp(30px,4.6vw,58px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            &ldquo;I got my <em className="not-italic text-volt">Sunday nights</em> back.&rdquo;
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="mt-7 text-center text-[15px] text-muted">
            <strong className="font-semibold text-paper">Maya Okafor</strong> — founder, Lagos Road
            Runners · 450 members
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="bg-maroon py-[120px] text-paper">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-[60px] grid grid-cols-1 items-end gap-10 lg:grid-cols-[1fr_auto]">
          <Reveal>
            <h2 className="max-w-[16ch] font-display text-[clamp(32px,4.2vw,54px)] font-semibold leading-[1.05] tracking-[-0.02em]">
              Built with founding clubs in five cities.
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <span className={`${label} !mb-0 text-muted`}>
              Amsterdam · London · Berlin · NYC · Austin
            </span>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i === 0 ? undefined : (i as 1 | 2)}
              className="flex flex-col gap-[22px] rounded-card border border-white/10 bg-white/[0.045] px-[30px] py-[34px] transition-all duration-500 ease-out-expo hover:-translate-y-2 hover:border-volt/40 hover:bg-white/[0.075]"
            >
              <article className="flex flex-1 flex-col gap-[22px]">
                <div className="text-sm tracking-[4px] text-volt">★★★★★</div>
                <p className="text-base leading-[1.65] text-paper/90">{t.quote}</p>
                <div className="mt-auto flex items-center gap-3.5">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-volt font-display text-[15px] font-bold text-ink">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-display text-[15px] font-semibold">{t.name}</div>
                    <div className="text-[13px] text-paper/55">{t.role}</div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="bg-maroon-2 pb-[120px] pt-[110px] text-paper" id="faq">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-[70px]">
        <Reveal>
          <span className={`${label} text-muted`}>Questions, answered straight</span>
          <h2 className="mb-5 font-display text-[clamp(32px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            An OS you can&apos;t trust is just a liability with a login page.
          </h2>
          <p className="mb-[30px] max-w-[36ch] text-paper/[0.62]">
            The deal in plain language: the club owns its data, members control what&apos;s shared,
            and if you leave you take everything with you.
          </p>
          <Link href="/app" className={`group ${btnVolt}`}>
            Start free <span className={arr}>→</span>
          </Link>
        </Reveal>
        <Reveal delay={1}>
          <FaqAccordion items={FAQS} />
        </Reveal>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden py-[180px] text-center" id="cta">
      <ParallaxBg speed={0.12} className="absolute inset-x-0 -inset-y-[12%] -z-10 bg-gradient-to-br from-[#12170a] to-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=2000&q=80"
          alt="Runner resting at sunset"
          loading="lazy"
          className="h-full w-full object-cover brightness-[0.34] saturate-[0.7]"
        />
      </ParallaxBg>
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <h2 className="mx-auto mb-6 max-w-[16ch] font-display text-[clamp(38px,6vw,80px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Your club deserves better than a{' '}
            <em className="not-italic text-volt">spreadsheet.</em>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="mx-auto mb-10 max-w-[52ch] text-[17px] text-muted">
            You built something real. People show up in the dark and the rain because of what you
            made. Give it infrastructure to match. Set up your club in under ten minutes — free
            under 50 members, no credit card, no lock-in.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <Link href="/app" className={`group ${btnVolt} px-[38px] py-[17px] !text-[17px]`}>
            Start free today <span className={arr}>→</span>
          </Link>
          <Link
            href="#pacer"
            className="mt-5 block text-[14.5px] text-muted underline underline-offset-4 transition-colors duration-300 hover:text-volt"
          >
            Or book a 20-minute walkthrough
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="overflow-x-clip bg-bg text-paper">
      <MarketingNav />
      <Hero />
      <StatsSection />
      <SurfacesSection />
      <StepsSection />
      <InstantEventsSection />
      <QuoteBand />
      <PacerSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <MarketingFooter />
    </main>
  );
}

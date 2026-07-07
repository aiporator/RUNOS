import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingNav from '@/components/marketing/nav';
import MarketingFooter from '@/components/marketing/footer';
import Reveal from '@/components/marketing/reveal';
import PricingSection from '@/components/marketing/pricing-section';
import FoundingPartnersBand from '@/components/marketing/founding-partners';
import FaqAccordion from '@/components/marketing/faq';
import { PRICING_FAQS } from '@/components/marketing/data';
import { arr, btnVolt, label } from '@/components/marketing/styles';

export const metadata: Metadata = {
  title: 'Pricing — RunOS',
  description:
    'Pricing that scales with your club. Not against it. Members never pay — the club subscribes, and the platform fee shrinks as you grow.',
};

const FEES: Array<{ big: string; title: string; body: string }> = [
  {
    big: '2% → 1% → 0.5%',
    title: 'Platform fee that shrinks',
    body: 'Charged only when money actually moves — 2% on Starter, 1% on Club, 0.5% on Pro. Grow, and RunOS takes a smaller cut.',
  },
  {
    big: '2% + $0.30',
    title: 'Ticketing fee',
    body: 'Per paid ticket on Starter and Club — still a fraction of the ticketing tax elsewhere. Ticketing fees are waived on Pro and Network.',
  },
  {
    big: '$29/mo',
    title: 'Pacer AI add-on',
    body: 'Pacer is unlimited on Pro and Network. On Starter and Club, add your digital COO for $29/mo. Cancel the add-on anytime.',
  },
];

function PricingHero() {
  return (
    <header className="relative isolate overflow-hidden bg-bg pb-16 pt-[180px]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_70%_0%,rgba(205,251,80,0.08),transparent_70%)]" />
      <div className="mx-auto max-w-[1200px] px-6 text-center">
        <span className="mb-[22px] inline-flex items-center gap-2.5 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-volt before:h-[1.5px] before:w-[26px] before:bg-volt before:content-['']">
          Choose your operating level
        </span>
        <h1 className="mk-fade-up mx-auto max-w-[18ch] font-display text-[clamp(38px,5.6vw,76px)] font-semibold leading-[1.05] tracking-[-0.02em]">
          Pricing that scales with your club.{' '}
          <em className="not-italic text-volt">Not against it.</em>
        </h1>
        <p
          className="mk-fade-up mx-auto mt-6 max-w-[46ch] text-[clamp(16px,1.5vw,19px)] text-muted"
          style={{ animationDelay: '0.2s' }}
        >
          Members never pay. The club subscribes — and the platform fee shrinks as you grow.
        </p>
      </div>
    </header>
  );
}

function SoloBanner() {
  return (
    <section className="bg-bg pb-10">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="flex flex-col items-start justify-between gap-6 rounded-card border border-line bg-white/[0.035] px-7 py-6 transition-colors duration-300 hover:border-volt/40 md:flex-row md:items-center">
          <div>
            <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-lg font-semibold">Solo — one-off events</span>
              <span className="font-display text-lg font-semibold text-volt">Free</span>
            </div>
            <p className="max-w-[72ch] text-[14.5px] text-muted">
              Up to 20 people per event, unlimited events, no account. When you&apos;re ready for
              members, memberships, and automations, Starter is one click away.
            </p>
          </div>
          <Link href="/new" className={`group ${btnVolt} shrink-0`}>
            Create an event free <span className={arr}>→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function FeeExplainer() {
  return (
    <section className="bg-paper-2 py-[100px] text-ink">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="mb-[60px] max-w-[720px]">
          <span className={`${label} text-muted-dark`}>The fees, in plain language</span>
          <h2 className="font-display text-[clamp(30px,3.8vw,50px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            No hidden line items. Fees only when money moves.
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 border-t-[1.5px] border-ink md:grid-cols-3">
          {FEES.map((fee, i) => (
            <Reveal
              key={fee.title}
              delay={i === 0 ? undefined : (i as 1 | 2)}
              className="group relative border-b border-line-dark px-7 pb-11 pt-[38px] transition-colors duration-300 after:absolute after:left-0 after:top-0 after:h-[3px] after:w-full after:origin-left after:scale-x-0 after:bg-volt after:transition-transform after:duration-500 after:ease-out-expo after:content-[''] hover:bg-ink/[0.035] hover:after:scale-x-100 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <div className="font-display text-[clamp(28px,2.6vw,40px)] font-bold leading-none tracking-[-0.03em]">
                {fee.big}
              </div>
              <h3 className="mb-2 mt-5 font-display text-lg font-semibold">{fee.title}</h3>
              <p className="max-w-[36ch] text-[14.5px] text-muted-dark">{fee.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingFaq() {
  return (
    <section className="bg-maroon-2 py-[110px] text-paper" id="faq">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-[70px]">
        <Reveal>
          <span className={`${label} text-muted`}>Pricing questions, answered straight</span>
          <h2 className="mb-5 font-display text-[clamp(32px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            The fine print, without the fine print.
          </h2>
          <p className="mb-[30px] max-w-[36ch] text-paper/[0.62]">
            Members never pay, you can leave anytime with everything, and fees only apply when
            money actually moves.
          </p>
          <Link href="/app" className={`group ${btnVolt}`}>
            Start free <span className={arr}>→</span>
          </Link>
        </Reveal>
        <Reveal delay={1}>
          <FaqAccordion items={PRICING_FAQS} />
        </Reveal>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-bg py-[140px] text-center" id="cta">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <h2 className="mx-auto mb-6 max-w-[18ch] font-display text-[clamp(34px,5vw,68px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Start free. Upgrade when the club{' '}
            <em className="not-italic text-volt">outgrows you.</em>
          </h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="mx-auto mb-10 max-w-[52ch] text-[17px] text-muted">
            Free under 50 members, no credit card, no lock-in. Set up your club in under ten
            minutes — and cancel anytime with a full export.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <Link href="/app" className={`group ${btnVolt} px-[38px] py-[17px] !text-[17px]`}>
            Start free today <span className={arr}>→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <main className="overflow-x-clip bg-bg text-paper">
      <MarketingNav anchorPrefix="/" />
      <PricingHero />
      <FoundingPartnersBand anchorPrefix="/" showPricingLink={false} />
      <SoloBanner />
      <PricingSection full />
      <FeeExplainer />
      <PricingFaq />
      <FinalCta />
      <MarketingFooter anchorPrefix="/" />
    </main>
  );
}

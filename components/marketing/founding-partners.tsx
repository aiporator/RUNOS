import Link from 'next/link';
import Reveal from './reveal';
import { arr, btnVolt, label } from './styles';

const PILLARS: Array<{ title: string; body: string }> = [
  {
    title: 'Your internal OS, not another public app',
    body: 'RunOS runs behind the scenes for your organizers — members, money, and events behind one login. The public pages you share are the only thing anyone outside the club ever sees.',
  },
  {
    title: 'Free for our first 50 partners',
    body: 'The first 50 clubs, gyms, and studios that come on board get full access free, for as long as they stay a founding partner — not a trial that quietly expires.',
  },
  {
    title: 'Own your data, always',
    body: 'Every member record, every event, every export — yours. Full export in standard formats, anytime. Leave with everything. No hostage-taking.',
  },
  {
    title: 'Every page captures a lead',
    body: 'Public event pages, appointment booking, and the lead form all feed straight into your dashboard — so promotion turns into a name and an email, not a lost DM.',
  },
];

type FoundingPartnersBandProps = {
  /** '' on the homepage (in-page anchors), '/' on other pages (link back home). */
  anchorPrefix?: string;
  /** Show the secondary "See full pricing" link — skip it on the /pricing page itself. */
  showPricingLink?: boolean;
};

export default function FoundingPartnersBand({
  anchorPrefix = '',
  showPricingLink = true,
}: FoundingPartnersBandProps) {
  return (
    <section
      className="relative isolate overflow-hidden bg-ink py-[100px] text-paper"
      id="founding-partners"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_20%_0%,rgba(205,251,80,0.1),transparent_70%)]" />
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal className="mx-auto mb-14 max-w-[640px] text-center">
          <span className={`${label} text-volt`}>Founding partner program</span>
          <h2 className="mb-[18px] font-display text-[clamp(30px,4vw,50px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Free for our first 50 partners. Own your data. Get real leads.
          </h2>
          <p className="text-paper/70">
            RunOS is the internal operating system your club actually runs on — built with, and
            for, the organizers who sign on first.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i === 0 ? undefined : (Math.min(i, 3) as 1 | 2 | 3)}
              className="rounded-card border border-white/10 bg-white/[0.045] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-volt/40"
            >
              <h3 className="mb-2 font-display text-[15.5px] font-semibold text-volt">
                {p.title}
              </h3>
              <p className="text-[13.5px] leading-relaxed text-paper/70">{p.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={3} className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link href="/talk-to-us?source=founding_partner" className={`group ${btnVolt}`}>
            Claim a founding partner spot <span className={arr}>→</span>
          </Link>
          {showPricingLink ? (
            <Link
              href={`${anchorPrefix}#pricing`}
              className="text-[14.5px] text-muted underline underline-offset-4 transition-colors duration-300 hover:text-volt"
            >
              See full pricing
            </Link>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}

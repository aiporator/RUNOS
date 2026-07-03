import Link from 'next/link';
import { INTEGRATIONS } from './data';
import { arr, btnGhost, btnVolt } from './styles';

const HEADLINE_WORDS: Array<{ text: string; delay: string; highlight?: boolean; breakAfter?: boolean }> = [
  { text: 'Run the', delay: '0.1s' },
  { text: 'club.', delay: '0.2s', breakAfter: true },
  { text: 'Not the', delay: '0.34s' },
  { text: 'chaos.', delay: '0.46s', highlight: true },
];

function Marquee() {
  const items = [...INTEGRATIONS, ...INTEGRATIONS];
  return (
    <div
      className="mk-marquee-band relative z-[2] overflow-hidden border-y border-line bg-bg/60 py-5 backdrop-blur"
      aria-hidden="true"
    >
      <div className="mk-marquee">
        {items.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="flex items-center gap-[34px] whitespace-nowrap px-[34px] font-display text-[15px] font-medium text-muted after:h-1.5 after:w-1.5 after:rounded-full after:bg-volt after:opacity-75 after:content-['']"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <header className="relative isolate flex min-h-svh flex-col justify-end pt-[140px]" id="top">
      {/* background */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#1a2410] to-bg">
        <img
          src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=2000&q=80"
          alt="Runner at dusk"
          className="mk-kenburns h-full w-full object-cover [filter:saturate(0.85)_contrast(1.05)]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,13,10,0.55)_0%,rgba(12,13,10,0.25)_40%,rgba(12,13,10,0.92)_88%,#0c0d0a_100%)]" />
      </div>

      {/* scroll indicator */}
      <div className="absolute bottom-[150px] right-[34px] z-[3] hidden flex-col items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted [writing-mode:vertical-rl] lg:flex">
        <span>Scroll</span>
        <span className="mk-scroll-line" />
      </div>

      <div className="relative z-[2] mx-auto w-full max-w-[1200px] px-6 pb-16">
        <span className="mb-[22px] inline-flex items-center gap-2.5 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-volt before:h-[1.5px] before:w-[26px] before:bg-volt before:content-['']">
          The operating system for running communities
        </span>
        <h1
          aria-label="Run the club. Not the chaos."
          className="max-w-[12ch] font-display text-[clamp(46px,7.4vw,104px)] font-semibold leading-[1.05] tracking-[-0.02em]"
        >
          {HEADLINE_WORDS.map((w) => (
            <span key={w.text} aria-hidden="true">
              <span className={`mk-word ${w.highlight ? 'text-volt' : ''}`}>
                <span style={{ animationDelay: w.delay }}>{w.text}</span>
              </span>{' '}
              {w.breakAfter ? <br /> : null}
            </span>
          ))}
        </h1>
        <p
          className="mk-fade-up my-[26px] mb-[34px] max-w-[52ch] text-[clamp(16px,1.5vw,19px)] text-muted"
          style={{ animationDelay: '0.55s' }}
        >
          RunOS replaces the spreadsheet, the group chat sprawl, and the ticketing tax with one
          platform: members, events, money, sponsors, and an AI that plans your month. We run the
          boring stuff so you can run the club.
        </p>
        <div
          className="mk-fade-up flex flex-wrap items-center gap-4"
          style={{ animationDelay: '0.72s' }}
        >
          <Link href="/app" className={`group ${btnVolt}`}>
            Start free — under 10 minutes <span className={arr}>→</span>
          </Link>
          <Link href="#pacer" className={btnGhost}>
            Watch the 3-minute demo
          </Link>
        </div>
        <p className="mk-fade-up mt-3.5 text-[13px] text-muted" style={{ animationDelay: '0.9s' }}>
          Free for clubs under 50 members. No credit card.
        </p>
      </div>

      <Marquee />
    </header>
  );
}

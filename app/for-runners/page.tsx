import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingNav from '@/components/marketing/nav';
import MarketingFooter from '@/components/marketing/footer';
import Reveal from '@/components/marketing/reveal';
import ParallaxBg from '@/components/marketing/parallax';
import { arr, btnDark, btnVolt, label } from '@/components/marketing/styles';

export const metadata: Metadata = {
  title: 'RunOS for runners — find your people, run your life',
  description:
    'Discover open runs and clubs near you, RSVP in one tap with no account, and keep every run you\'ve joined in one place — your running life, not seven apps.',
};

const HOW_IT_WORKS: { title: string; body: string }[] = [
  {
    title: 'Browse what\'s actually happening',
    body: 'Filter by city and type on Discover — every open run, class, and workshop published on RunOS, not whatever a search engine or a Facebook group happens to surface.',
  },
  {
    title: 'RSVP in one tap, no account',
    body: 'Name and email, done. You get a confirmation that works at the door — no password to create, no app to download first.',
  },
  {
    title: 'It shows up on My Runs automatically',
    body: 'Every run you join or host is remembered in your browser the moment you RSVP — one view across every club, not just the one with your email.',
  },
];

const FEATURES: { title: string; body: string }[] = [
  {
    title: 'Discover, don\'t search',
    body: 'Every open run, class, and workshop published on RunOS, filterable by city and type — not buried in an Eventbrite search or a Facebook group nobody moderates.',
  },
  {
    title: 'RSVP in one tap',
    body: 'No account, no app download, no password. Name, email, done — you get a ticket that works at the door.',
  },
  {
    title: 'Your running life, in one place',
    body: 'Every run you\'ve joined or hosted shows up on My Runs automatically — across every club, not just the one that happens to have your email.',
  },
  {
    title: 'Connect at the start line, not in a feed',
    body: 'RunOS isn\'t a social network for runners. It\'s the thing that gets you standing next to other runners, in person, on time.',
  },
];

export default function ForRunnersPage() {
  return (
    <main className="overflow-x-clip bg-bg text-paper">
      <MarketingNav anchorPrefix="/" />

      <header className="relative isolate overflow-hidden pb-16 pt-[170px]">
        <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#1a2410] to-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=2000&q=80"
            alt="Runner silhouette"
            loading="eager"
            className="mk-kenburns h-full w-full object-cover [filter:saturate(0.85)_contrast(1.05)]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,13,10,0.6)_0%,rgba(12,13,10,0.35)_38%,rgba(12,13,10,0.94)_88%,#0c0d0a_100%)]" />
        </div>
        <div className="mx-auto max-w-[900px] px-6">
          <span className={`${label} text-volt`}>For runners</span>
          <h1 className="mb-6 font-display text-[clamp(34px,6vw,64px)] font-semibold leading-[1.03] tracking-[-0.02em]">
            Find your people. <span className="text-volt">Run your life.</span>
          </h1>
          <p className="max-w-[58ch] text-[17px] leading-relaxed text-muted">
            RunOS isn&apos;t just the software behind your club — it&apos;s a place to discover
            runs wherever you are, join one with a single tap, and keep every run you&apos;ve
            ever joined in one view. No account required to start.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/discover" className={`group ${btnVolt}`}>
              Discover runs near you <span className={arr}>→</span>
            </Link>
            <Link href="/my-runs" className={`group ${btnDark}`}>
              See your running life <span className={arr}>→</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-paper-2 py-[100px] text-ink">
        <div className="mx-auto max-w-[1000px] px-6">
          <Reveal className="mx-auto mb-[60px] max-w-[560px] text-center">
            <span className={`${label} text-muted-dark`}>How it works</span>
            <h2 className="font-display text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.05] tracking-[-0.02em]">
              Three taps between you and the start line.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={step.title} delay={i === 0 ? undefined : (i as 1 | 2)}>
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-ink font-display text-[17px] font-bold text-volt">
                  {i + 1}
                </div>
                <h3 className="mb-2.5 font-display text-[17px] font-semibold leading-[1.15] tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p className="max-w-[36ch] text-[14px] leading-[1.65] text-muted-dark">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[90px]">
        <div className="mx-auto max-w-[1000px] px-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <Reveal
                key={f.title}
                delay={i === 0 ? undefined : (Math.min(i, 4) as 1 | 2 | 3 | 4)}
                className="rounded-card border border-line bg-bg-2 p-7"
              >
                <h2 className="mb-2.5 font-display text-[17px] font-semibold">{f.title}</h2>
                <p className="text-[14px] leading-relaxed text-muted">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper-2 py-[90px] text-ink">
        <div className="mx-auto max-w-[760px] px-6">
          <Reveal>
            <span className={`${label} text-muted-dark`}>Honest maturity</span>
            <h2 className="mb-4 font-display text-[clamp(24px,3.2vw,34px)] font-semibold leading-tight tracking-[-0.01em]">
              My Runs lives in your browser, not an account. Yet.
            </h2>
            <p className="text-[14.5px] leading-relaxed text-muted-dark">
              Runner accounts that sync across every device are on the roadmap — today, when you
              RSVP or publish an event, it&apos;s remembered locally in the browser you used, so
              there&apos;s a real &quot;my running life&quot; view without asking you to sign up
              for anything. It&apos;s private to that device by design; nothing about it requires
              trusting us with a password.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative isolate overflow-hidden py-[130px] text-center">
        <ParallaxBg speed={0.12} className="absolute inset-x-0 -inset-y-[12%] -z-10 bg-gradient-to-br from-[#12170a] to-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=2000&q=80"
            alt="Athlete lacing up on track"
            loading="lazy"
            className="h-full w-full object-cover brightness-[0.34] saturate-[0.7]"
          />
        </ParallaxBg>
        <div className="mx-auto max-w-[700px] px-6">
          <Reveal>
            <h2 className="mx-auto mb-5 max-w-[20ch] font-display text-[clamp(28px,4vw,46px)] font-semibold leading-[1.08] tracking-[-0.02em]">
              Your next run is one tap away.
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/discover" className={`group ${btnVolt}`}>
                Discover runs <span className={arr}>→</span>
              </Link>
              <Link href="/cities" className="group inline-flex items-center gap-2 font-display text-[15px] font-semibold text-volt-deep">
                Browse by city <span className={arr}>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <MarketingFooter anchorPrefix="/" />
    </main>
  );
}

import Link from 'next/link';
import Reveal from './reveal';

type MarketingFooterProps = {
  /** '' on the homepage (in-page anchors), '/' on other pages. */
  anchorPrefix?: string;
};

export default function MarketingFooter({ anchorPrefix = '' }: MarketingFooterProps) {
  const colLink =
    'block py-1.5 text-[14.5px] text-paper/75 transition-all duration-200 hover:translate-x-1 hover:text-volt';
  const colHead =
    'mb-5 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-muted';

  return (
    <footer className="border-t border-line bg-bg pb-10 pt-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-[70px] grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="flex items-center gap-[9px] font-display text-[22px] font-bold tracking-[-0.02em]"
            >
              <span className="pulse-dot h-[11px] w-[11px] rounded-full bg-volt shadow-[0_0_14px_#cdfb50]" />
              RunOS
            </Link>
            <p className="mt-[18px] max-w-[30ch] text-[14.5px] text-muted">
              One login. One database. Your whole club. The operating system for running
              communities.
            </p>
          </div>
          <div>
            <h4 className={colHead}>Product</h4>
            <Link href={`${anchorPrefix}#surfaces`} className={colLink}>
              Eight surfaces
            </Link>
            <Link href={`${anchorPrefix}#pacer`} className={colLink}>
              Pacer AI
            </Link>
            <Link href="/pricing" className={colLink}>
              Pricing
            </Link>
            <Link href={`${anchorPrefix}#faq`} className={colLink}>
              Privacy commitment
            </Link>
          </div>
          <div>
            <h4 className={colHead}>For</h4>
            <Link href={`${anchorPrefix}#surfaces`} className={colLink}>
              Clubs
            </Link>
            <Link href="/for-gyms" className={colLink}>
              Gyms &amp; studios
            </Link>
            <Link href="/for-workshops" className={colLink}>
              Workshops &amp; courses
            </Link>
            <Link href={`${anchorPrefix}#surfaces`} className={colLink}>
              Members
            </Link>
            <Link href={`${anchorPrefix}#surfaces`} className={colLink}>
              Brands
            </Link>
            <Link href={`${anchorPrefix}#surfaces`} className={colLink}>
              Cities &amp; federations
            </Link>
          </div>
          <div>
            <h4 className={colHead}>Company</h4>
            <Link href="/" className={colLink}>
              Founding-club program
            </Link>
            <Link href="/" className={colLink}>
              Manifesto
            </Link>
            <Link href="/" className={colLink}>
              Careers
            </Link>
            <Link href="/talk-to-us" className={colLink}>
              Contact
            </Link>
          </div>
        </div>
        <Reveal className="mk-big-word mb-5 mt-[60px] text-center font-display text-[clamp(80px,15.5vw,230px)] font-bold leading-[0.9] tracking-[-0.04em]">
          RUNOS
        </Reveal>
        <div className="flex flex-wrap justify-between gap-5 border-t border-line pt-7 text-[13px] text-muted">
          <span>© 2026 RunOS. Built with founding clubs in five cities.</span>
          <span>Your data, your rules. Full export, no hostage-taking.</span>
        </div>
      </div>
    </footer>
  );
}

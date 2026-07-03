'use client';

import { useEffect, useRef } from 'react';
import Reveal from './reveal';
import { STATS } from './data';
import { label } from './styles';

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = String(to);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          const dur = 1400;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min((t - t0) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = String(Math.round(to * ease));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return <span ref={ref}>0</span>;
}

export default function StatsSection() {
  return (
    <section className="bg-paper pb-[100px] pt-[110px] text-ink">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-[72px] grid grid-cols-1 items-end gap-10 lg:grid-cols-2">
          <Reveal>
            <span className={`${label} text-muted-dark`}>Proven operating leverage</span>
            <h2 className="font-display text-[clamp(34px,4.4vw,58px)] font-semibold leading-[1.05] tracking-[-0.02em]">
              Your club runs on 7 apps and one exhausted volunteer.
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="max-w-[44ch] text-muted-dark lg:justify-self-end">
              Seven apps. Zero of them talk to each other. So one person — usually you — becomes
              the API. You don&apos;t need an eighth app. You need the layer underneath all of
              them.
            </p>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 border-t-[1.5px] border-ink lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i === 0 ? undefined : (Math.min(i, 4) as 1 | 2 | 3 | 4)}
              className="group relative border-b border-line-dark px-7 pb-11 pt-[38px] transition-colors duration-300 after:absolute after:left-0 after:top-0 after:h-[3px] after:w-full after:origin-left after:scale-x-0 after:bg-volt after:transition-transform after:duration-500 after:ease-out-expo after:content-[''] hover:bg-ink/[0.035] hover:after:scale-x-100 lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <div className="flex items-baseline font-display text-[clamp(48px,5.4vw,76px)] font-bold leading-none tracking-[-0.03em]">
                <CountUp to={s.to} />
                <span className="ml-0.5 text-[0.55em] text-volt-deep">{s.suffix}</span>
              </div>
              <p className="mt-3.5 max-w-[24ch] text-[14.5px] text-muted-dark">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

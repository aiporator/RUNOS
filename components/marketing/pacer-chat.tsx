'use client';

import { useEffect, useRef, useState } from 'react';
import Reveal from './reveal';
import { CHAT } from './data';
import { label } from './styles';

type Msg = {
  id: number;
  role: 'user' | 'ai';
  text: string;
  typing: boolean;
  dots: boolean;
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function ChatWindow() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Final state: render all three exchanges fully typed.
      setMsgs(
        CHAT.flatMap((c, i): Msg[] => [
          { id: i * 2, role: 'user', text: c.u, typing: false, dots: false },
          { id: i * 2 + 1, role: 'ai', text: c.a, typing: false, dots: false },
        ]),
      );
      return;
    }

    let cancelled = false;
    let idSeq = 0;
    let arr: Msg[] = [];

    const commit = () => setMsgs(arr);
    const push = (m: Msg) => {
      arr = [...arr, m];
      commit();
    };
    const patchLast = (patch: Partial<Msg>) => {
      arr = arr.map((m, j) => (j === arr.length - 1 ? { ...m, ...patch } : m));
      commit();
    };
    const typeText = async (text: string, speed: number) => {
      for (const ch of text) {
        if (cancelled) return;
        await wait(speed);
        arr = arr.map((m, j) => (j === arr.length - 1 ? { ...m, text: m.text + ch } : m));
        commit();
      }
    };

    const loop = async () => {
      for (let i = 0; !cancelled; i = (i + 1) % CHAT.length) {
        if (i === 0) {
          arr = [];
          commit();
        }
        const c = CHAT[i];
        push({ id: idSeq++, role: 'user', text: '', typing: true, dots: false });
        await typeText(c.u, 34);
        if (cancelled) return;
        patchLast({ typing: false });
        push({ id: idSeq++, role: 'ai', text: '', typing: false, dots: true });
        await wait(1100);
        if (cancelled) return;
        arr = arr.slice(0, -1); // remove typing-dots bubble
        push({ id: idSeq++, role: 'ai', text: '', typing: true, dots: false });
        await typeText(c.a, 9);
        if (cancelled) return;
        patchLast({ typing: false });
        await wait(2600);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          io.disconnect();
          void loop();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  return (
    <div className="relative rounded-3xl border border-line bg-bg-2 p-7 shadow-[0_40px_90px_rgba(0,0,0,0.45)]">
      <div className="mb-5 flex items-center gap-3 border-b border-line pb-[18px]">
        <div className="grid h-[38px] w-[38px] place-items-center rounded-full bg-volt font-display text-[15px] font-bold text-ink">
          P
        </div>
        <div className="font-display text-[15.5px] font-semibold">Pacer</div>
        <div className="ml-auto flex items-center gap-1.5 text-[12.5px] text-volt">
          <span className="pulse-dot h-[7px] w-[7px] rounded-full bg-volt" />
          online
        </div>
      </div>
      <div aria-live="polite" ref={rootRef} className="min-h-[240px]">
        {msgs.map((m) => (
          <div
            key={m.id}
            className={[
              'mk-panel-in mb-3.5 max-w-[88%] rounded-2xl px-[18px] py-3.5 text-[14.5px] leading-[1.55]',
              m.role === 'user'
                ? 'ml-auto rounded-br-[4px] bg-volt font-medium text-ink'
                : 'rounded-bl-[4px] border border-line bg-white/[0.06] text-paper/90',
            ].join(' ')}
          >
            {m.dots ? (
              <span className="mk-typing">
                <i />
                <i />
                <i />
              </span>
            ) : (
              <>
                {m.text}
                {m.typing ? <span className="mk-caret" /> : null}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PacerSection() {
  return (
    <section className="bg-bg py-[120px]" id="pacer">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-[70px]">
        <Reveal>
          <span className={`${label} text-volt`}>AI that does the work</span>
          <h2 className="mb-[22px] mt-[18px] font-display text-[clamp(34px,4.2vw,54px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Meet <em className="not-italic text-volt">Pacer</em>. Your club&apos;s digital COO.
          </h2>
          <p className="mb-4 text-[17px] text-muted">
            Pacer knows your club the way you do — who shows up, who&apos;s drifting, what worked
            last spring — because it works from your club&apos;s own data. It doesn&apos;t chat for
            the sake of chatting. It does the work.
          </p>
          <p className="mb-4 text-[17px] text-muted">
            Attendance forecasts. Churn-risk lists with drafted win-back messages. Sponsor
            proposals built on your verified numbers. Whole months planned on request.
          </p>
          <p className="mt-[26px] border-l-2 border-volt pl-4 text-sm text-muted">
            Unlimited on Pro. Available on Starter and Club with the AI add-on for $29/mo. Pacer
            never sees or exposes another club&apos;s raw data.
          </p>
        </Reveal>
        <Reveal delay={2}>
          <ChatWindow />
        </Reveal>
      </div>
    </section>
  );
}

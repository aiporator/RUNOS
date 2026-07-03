import { cn, initials } from '@/lib/utils';
import type { ReactNode } from 'react';

export function PageHeader({
  title, sub, actions, kicker,
}: { title: string; sub?: string; actions?: ReactNode; kicker?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 fade-up">
      <div>
        {kicker && (
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-volt">{kicker}</div>
        )}
        <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
        {sub && <p className="mt-1.5 max-w-xl text-sm text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export function Card({
  children, className, pad = true,
}: { children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <div className={cn('rounded-card border border-line bg-bg-2', pad && 'p-5', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="font-display text-[15px] font-semibold">{children}</h2>
      {action}
    </div>
  );
}

export function Stat({
  label, value, delta, deltaGood, sub,
}: { label: string; value: string; delta?: string; deltaGood?: boolean; sub?: string }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="text-[12px] font-medium text-muted">{label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-[32px] font-bold leading-none tracking-tight">{value}</span>
        {delta && (
          <span className={cn('text-[12px] font-semibold', deltaGood === false ? 'text-danger' : 'text-volt')}>
            {delta}
          </span>
        )}
      </div>
      {sub && <div className="mt-1.5 text-[12px] text-muted-2">{sub}</div>}
    </Card>
  );
}

const badgeTones: Record<string, string> = {
  volt: 'bg-volt/15 text-volt border-volt/25',
  ok: 'bg-ok/10 text-ok border-ok/25',
  warn: 'bg-warn/10 text-warn border-warn/25',
  danger: 'bg-danger/10 text-danger border-danger/25',
  info: 'bg-info/10 text-info border-info/25',
  muted: 'bg-white/5 text-muted border-line',
};

export function Badge({ children, tone = 'muted' }: { children: ReactNode; tone?: keyof typeof badgeTones }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold', badgeTones[tone])}>
      {children}
    </span>
  );
}

export function Avatar({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  return (
    <span
      className="inline-grid flex-none place-items-center rounded-full font-display font-bold text-ink"
      style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </span>
  );
}

export function ProgressBar({ value, tone = 'volt' }: { value: number; tone?: 'volt' | 'danger' | 'warn' | 'info' }) {
  const tones = { volt: 'bg-volt', danger: 'bg-danger', warn: 'bg-warn', info: 'bg-info' };
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
      <div className={cn('h-full rounded-full transition-all', tones[tone])} style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }} />
    </div>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="thin-scroll overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[11px] uppercase tracking-[0.1em] text-muted-2">
            {head.map((h) => (
              <th key={h} className="pb-3 pr-4 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60">{children}</tbody>
      </table>
    </div>
  );
}

export function EmptyState({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-card border border-dashed border-line py-14 text-center">
      <div>
        <div className="font-display text-[15px] font-semibold">{title}</div>
        {sub && <p className="mx-auto mt-1.5 max-w-sm text-[13px] text-muted">{sub}</p>}
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
}

export function Sparkline({
  data, width = 120, height = 36, stroke = '#cdfb50',
}: { data: number[]; width?: number; height?: number; stroke?: string }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${height - 3 - ((v - min) / span) * (height - 6)}`)
    .join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden className="overflow-visible">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function KV({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-muted">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}

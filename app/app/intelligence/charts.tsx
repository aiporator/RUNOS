'use client';

import { useEffect, useState } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { weeklyMetrics } from '@/lib/data';
import { Card, CardTitle } from '@/components/ui';

const VOLT = '#cdfb50';
const INFO = '#7db8ff';
const GRID = 'rgba(255,255,255,0.06)';

const axisTick = { fill: 'rgba(242,243,234,0.4)', fontSize: 11 } as const;

const tooltipStyle: React.CSSProperties = {
  background: '#12140f',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12,
  fontSize: 12.5,
  color: '#f2f3ea',
  boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
};

const legendStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'rgba(242,243,234,0.62)',
  paddingTop: 8,
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export function WacmAttendanceChart() {
  const reduced = usePrefersReducedMotion();
  return (
    <Card>
      <CardTitle action={<span className="text-[12px] text-muted">weekly, trailing 12</span>}>
        WACM &amp; attendance — 12 weeks
      </CardTitle>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyMetrics} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="week" tick={axisTick} axisLine={false} tickLine={false} interval={1} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} width={44} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'rgba(242,243,234,0.62)', marginBottom: 4 }} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
            <Legend wrapperStyle={legendStyle} iconType="circle" iconSize={8} />
            <Area
              type="monotone"
              dataKey="attendance"
              name="Event attendance"
              stroke={INFO}
              strokeWidth={1.5}
              fill={INFO}
              fillOpacity={0.08}
              isAnimationActive={!reduced}
            />
            <Area
              type="monotone"
              dataKey="wacm"
              name="WACM"
              stroke={VOLT}
              strokeWidth={2}
              fill={VOLT}
              fillOpacity={0.14}
              isAnimationActive={!reduced}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function RevenueChart() {
  const reduced = usePrefersReducedMotion();
  return (
    <Card>
      <CardTitle action={<span className="text-[12px] text-muted">€ per week</span>}>Weekly revenue</CardTitle>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyMetrics} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="week" tick={axisTick} axisLine={false} tickLine={false} interval={1} />
            <YAxis tick={axisTick} axisLine={false} tickLine={false} width={44} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: 'rgba(242,243,234,0.62)', marginBottom: 4 }}
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            />
            <Bar
              dataKey="revenue"
              name="Revenue (€)"
              fill={VOLT}
              radius={[4, 4, 0, 0]}
              maxBarSize={26}
              isAnimationActive={!reduced}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

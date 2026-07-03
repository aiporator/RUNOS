import { clsx, type ClassValue } from 'clsx';
import { TODAY } from './seed';

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function money(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: n % 1 ? 2 : 0 });
}

export function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'UTC' })}`;
}

export function relativeDays(iso: string): string {
  const diff = Math.round((new Date(iso).getTime() - TODAY.getTime()) / 86400000);
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff === -1) return 'yesterday';
  return diff > 0 ? `in ${diff}d` : `${-diff}d ago`;
}

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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Deterministic UTC formatting — identical on server and client (no locale/ICU drift).
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} · ${hh}:${mm}`;
}

export function relativeDays(iso: string): string {
  const diff = Math.round((new Date(iso).getTime() - TODAY.getTime()) / 86400000);
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff === -1) return 'yesterday';
  return diff > 0 ? `in ${diff}d` : `${-diff}d ago`;
}

'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Card } from '@/components/ui';
import type { ClubEvent, EventStatus, EventType } from '@/lib/types';

const EVENT_TYPES: EventType[] = ['long-run', 'tempo', 'social', 'race', 'track', 'trail'];
const EVENT_STATUSES: EventStatus[] = ['draft', 'published', 'live', 'completed'];

const inputCls =
  'w-full rounded-xl border border-line bg-bg-3 px-3.5 py-2.5 text-[13.5px] text-paper outline-none transition placeholder:text-muted-2 focus:border-volt/60';
const labelCls = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-muted';

function toLocalInputValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EventForm({ event }: { event?: ClubEvent }) {
  const router = useRouter();
  const isEdit = Boolean(event);
  const [title, setTitle] = useState(event?.title ?? '');
  const [type, setType] = useState<EventType>(event?.type ?? 'long-run');
  const [status, setStatus] = useState<EventStatus>(event?.status ?? 'draft');
  const [date, setDate] = useState(event ? toLocalInputValue(event.date) : '');
  const [location, setLocation] = useState(event?.location ?? '');
  const [routeName, setRouteName] = useState(event?.routeName ?? '');
  const [distanceKm, setDistanceKm] = useState(event ? String(event.distanceKm) : '');
  const [capacity, setCapacity] = useState(event ? String(event.capacity) : '50');
  const [price, setPrice] = useState(event ? String(event.price) : '0');
  const [description, setDescription] = useState(event?.description ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const body: Record<string, unknown> = {
      title,
      date: new Date(date).toISOString(),
      location: location || undefined,
      routeName: routeName || undefined,
      distanceKm: distanceKm ? Number(distanceKm) : undefined,
      capacity: capacity ? Number(capacity) : undefined,
      price: price ? Number(price) : undefined,
      description: description || undefined,
    };
    if (isEdit) {
      body.status = status;
    } else {
      body.type = type;
    }
    try {
      const res = await fetch(isEdit ? `/api/v1/events/${event!.id}` : '/api/v1/events', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'content-type': 'application/json', authorization: 'Bearer ros_demo' },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => null)) as { data?: { id: string }; error?: { message?: string } } | null;
      if (!res.ok || !json?.data) {
        setError(json?.error?.message ?? 'Something went wrong — try again.');
        setSubmitting(false);
        return;
      }
      router.push(`/app/events/${json.data.id}`);
      router.refresh();
    } catch {
      setError('Network hiccup — try again.');
      setSubmitting(false);
    }
  }

  return (
    <Card className="max-w-[720px] fade-up-1">
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
        <div>
          <label className={labelCls} htmlFor="ev-title">Title</label>
          <input id="ev-title" className={inputCls} required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Saturday Long Run — Harbor Loop" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="ev-type">Type</label>
            {isEdit ? (
              <div className={`${inputCls} bg-bg-3/60 text-muted`}>{event!.type}</div>
            ) : (
              <select id="ev-type" className={`${inputCls} appearance-none`} value={type} onChange={(e) => setType(e.target.value as EventType)}>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
          </div>
          {isEdit ? (
            <div>
              <label className={labelCls} htmlFor="ev-status">Status</label>
              <select id="ev-status" className={`${inputCls} appearance-none`} value={status} onChange={(e) => setStatus(e.target.value as EventStatus)}>
                {EVENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ) : (
            <div>
              <label className={labelCls} htmlFor="ev-date">Date &amp; time</label>
              <input id="ev-date" type="datetime-local" className={inputCls} required value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          )}
        </div>

        {isEdit ? (
          <div>
            <label className={labelCls} htmlFor="ev-date-edit">Date &amp; time</label>
            <input id="ev-date-edit" type="datetime-local" className={inputCls} required value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="ev-location">Location</label>
            <input id="ev-location" className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Central Pier, Harbor City" />
          </div>
          <div>
            <label className={labelCls} htmlFor="ev-route">Route name</label>
            <input id="ev-route" className={inputCls} value={routeName} onChange={(e) => setRouteName(e.target.value)} placeholder="Harbor Loop 16K" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className={labelCls} htmlFor="ev-distance">Distance (km)</label>
            <input id="ev-distance" type="number" min="0" step="0.1" className={inputCls} value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} placeholder="16" />
          </div>
          <div>
            <label className={labelCls} htmlFor="ev-capacity">Capacity</label>
            <input id="ev-capacity" type="number" min="1" className={inputCls} value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="ev-price">Price (USD)</label>
            <input id="ev-price" type="number" min="0" className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
        </div>

        <div>
          <label className={labelCls} htmlFor="ev-description">Description</label>
          <textarea id="ev-description" rows={3} className={`${inputCls} resize-y`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A rolling loop along the harbor — easy pace, coffee after." />
        </div>

        {error ? (
          <div className="rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-[12.5px] text-danger">{error}</div>
        ) : null}

        <div className="flex items-center justify-end gap-3 border-t border-line pt-5">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full px-4 py-2 text-[13px] font-semibold text-muted transition hover:text-paper"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-volt px-6 py-2.5 font-display text-[13.5px] font-semibold text-ink transition hover:shadow-[0_8px_28px_rgba(205,251,80,0.35)] disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create event'}
          </button>
        </div>
      </form>
    </Card>
  );
}

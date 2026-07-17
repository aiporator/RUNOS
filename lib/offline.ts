// Client-side offline mutation queue. When the browser is offline, dashboard
// mutations are parked in localStorage instead of failing; the shell flushes
// them in order as soon as connectivity returns.
const QUEUE_KEY = 'runos_offline_queue';
const AUTH_HEADERS = { 'content-type': 'application/json', authorization: 'Bearer ros_demo' };

export interface QueuedMutation {
  endpoint: string;
  method: string;
  body?: unknown;
}

export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

export function readOfflineQueue(): QueuedMutation[] {
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as QueuedMutation[]) : [];
  } catch {
    return [];
  }
}

export function enqueueOffline(mutation: QueuedMutation): number {
  const queue = readOfflineQueue();
  queue.push(mutation);
  try {
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // Storage full or unavailable — the caller already told the user the
    // change is queued; nothing better to do than drop silently here.
  }
  return queue.length;
}

/** Replays the queue in order. Anything that fails with a network error stays queued. */
export async function flushOfflineQueue(): Promise<{ sent: number; remaining: number }> {
  const queue = readOfflineQueue();
  if (queue.length === 0) return { sent: 0, remaining: 0 };
  const unsent: QueuedMutation[] = [];
  let sent = 0;
  for (const m of queue) {
    try {
      await fetch(m.endpoint, {
        method: m.method,
        headers: AUTH_HEADERS,
        body: m.body === undefined ? undefined : JSON.stringify(m.body),
      });
      sent += 1;
    } catch {
      unsent.push(m);
    }
  }
  try {
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(unsent));
  } catch {
    // Ignore — worst case the queue re-flushes already-sent items never.
  }
  return { sent, remaining: unsent.length };
}

'use client';

// Funnel analytics — PostHog (EU). The public project key is safe to ship client-side;
// override with NEXT_PUBLIC_POSTHOG_KEY / NEXT_PUBLIC_POSTHOG_HOST per environment.
import posthog from 'posthog-js';

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? 'phc_xmMQneHWug8LVcr94h4vt8pVzDKstBXrYmSgu2moVdE8';
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com';

let initialized = false;

export function initAnalytics(): void {
  if (initialized || typeof window === 'undefined' || !KEY) return;
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: false, // captured manually on route change for App Router accuracy
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
  });
  initialized = true;
}

export function trackPageview(path: string): void {
  if (!initialized) return;
  posthog.capture('$pageview', { $current_url: window.location.origin + path });
}

/**
 * Canonical funnel events — keep names stable, they feed the PostHog funnels:
 * demo_started, wizard_started, wizard_step_completed, wizard_completed,
 * lead_captured, event_published, promote_generated, promote_scheduled,
 * public_event_viewed, public_rsvp_submitted, pricing_viewed, cta_clicked
 */
export function track(event: string, props?: Record<string, string | number | boolean>): void {
  if (!initialized) return;
  posthog.capture(event, props);
}

export function identify(id: string, props?: Record<string, string | number | boolean>): void {
  if (!initialized) return;
  posthog.identify(id, props);
}

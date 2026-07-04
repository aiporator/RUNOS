import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Live mode backend. The anon key is a public client key by design — every row
// is protected by Postgres RLS (see supabase migration runos_pilot_schema).
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://srujvjjncrszhaaxepxf.supabase.co';
const ANON =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNydWp2ampuY3JzemhhYXhlcHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMjYzMDcsImV4cCI6MjA5MTkwMjMwN30.AYFCvIA6W_NQ6hUdFZ7ePl6OQ4HoO3wNqYIfUsXJMbI';

export const liveModeConfigured = Boolean(URL && ANON);

let browserClient: SupabaseClient | null = null;

/** Browser singleton — persists the auth session in localStorage. */
export function getSupabase(): SupabaseClient {
  if (!browserClient) {
    browserClient = createClient(URL, ANON, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return browserClient;
}

/** Stateless server client for public reads (RLS: anon role). */
export function getServerSupabase(): SupabaseClient {
  return createClient(URL, ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface LiveOrg {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  vertical: string;
  city: string | null;
  created_at: string;
}

export interface LiveEvent {
  id: string;
  org_id: string;
  title: string;
  type: string;
  starts_at: string;
  location: string | null;
  capacity: number;
  price_cents: number;
  description: string | null;
  published: boolean;
  created_at: string;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 48);
}

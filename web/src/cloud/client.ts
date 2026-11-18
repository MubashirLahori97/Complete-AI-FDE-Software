// Supabase client for FDE Academy cloud sync.
// The client is active only when the build has both env values set:
//   VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
// Keys are never written in code. They come from the build environment.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null | undefined;

function readEnv(name: string): string {
  try {
    return String((import.meta.env as Record<string, unknown>)[name] ?? '').trim();
  } catch {
    return '';
  }
}

/** True only when both Supabase env values are present. */
export function isCloudEnabled(): boolean {
  return readEnv('VITE_SUPABASE_URL').length > 0 && readEnv('VITE_SUPABASE_ANON_KEY').length > 0;
}

/**
 * The shared Supabase client, or null when cloud sync is not set up.
 * Safe to call often: the client is created once and reused.
 */
export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  if (!isCloudEnabled()) {
    cached = null;
    return cached;
  }
  cached = createClient(
    readEnv('VITE_SUPABASE_URL'),
    readEnv('VITE_SUPABASE_ANON_KEY'),
  );
  return cached;
}

/** Drop the cached client (tests and sign-out flows use this). */
export function resetSupabase(): void {
  cached = undefined;
}

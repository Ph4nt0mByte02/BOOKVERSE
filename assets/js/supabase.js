// Supabase client for browser-safe operations.
// Only the publishable key belongs in frontend code.
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://nkclxrkmnvxfadbynjgm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_hZHEg4eq8SlH13xyrm8zdQ_AIB1UUEE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export async function getAccessToken() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

export async function authHeaders() {
  const token = await getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

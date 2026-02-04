import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Tracking-specific backend client.
 *
 * Why this exists:
 * In some preview environments, Vite env vars can fail to hydrate, causing
 * the auto-generated client to fall back to placeholder values.
 *
 * This client uses hardcoded fallback credentials to ensure tracking
 * always works, even when environment variables fail to load.
 *
 * The publishable key is safe to ship to the browser.
 */

const FALLBACK_URL = "https://pydbejawnenjqgnyyonf.supabase.co";
const FALLBACK_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZGJlamF3bmVuanFnbnl5b25mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNzI2MzcsImV4cCI6MjA4NTc0ODYzN30.7of37Fz2TKO0NMKtt3kZ2zGLdavsCyAiG9GxBvlirH4";

const url = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_PUBLISHABLE_KEY;

export const trackingSupabase = createClient<Database>(url, key, {
  auth: {
    // Tracking doesn't need session persistence
    storage: undefined,
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const trackingBackendUrl = url;

export const trackingBackendIsPlaceholder =
  url.includes("placeholder.supabase.co") || key === "placeholder-key";

import { adminSupabase } from "@/lib/adminBackend";

/**
 * Partners CRM uses the same client as admin (shared Supabase auth session).
 * This file exists to make import sites explicit and to centralize any
 * partners-specific helpers later.
 */
export const partnersSupabase = adminSupabase;

export const PARTNERS_ALLOWED_ROLES = ["admin", "sdr"] as const;
export type PartnersRole = (typeof PARTNERS_ALLOWED_ROLES)[number];

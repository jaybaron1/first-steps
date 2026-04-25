import { useQuery } from "@tanstack/react-query";
import { partnersSupabase as supabase } from "@/lib/partnersBackend";
import type { Database } from "@/integrations/supabase/types";

export type Partner = Database["public"]["Tables"]["partners"]["Row"];
export type PartnerClient = Database["public"]["Tables"]["partner_clients"]["Row"];
export type CommercialEvent = Database["public"]["Tables"]["commercial_events"]["Row"];
export type ClientNote = Database["public"]["Tables"]["client_notes"]["Row"];

// ----- Partners -----
export const usePartners = () =>
  useQuery({
    queryKey: ["partners-crm", "partners"],
    queryFn: async (): Promise<Partner[]> => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const usePartner = (id: string | undefined) =>
  useQuery({
    queryKey: ["partners-crm", "partner", id],
    enabled: !!id,
    queryFn: async (): Promise<Partner | null> => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

// ----- Clients -----
export const useClients = () =>
  useQuery({
    queryKey: ["partners-crm", "clients"],
    queryFn: async (): Promise<(PartnerClient & { partner: Partner | null })[]> => {
      const { data, error } = await supabase
        .from("partner_clients")
        .select("*, partner:partners(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as (PartnerClient & { partner: Partner | null })[];
    },
  });

export const useClient = (id: string | undefined) =>
  useQuery({
    queryKey: ["partners-crm", "client", id],
    enabled: !!id,
    queryFn: async (): Promise<(PartnerClient & { partner: Partner | null }) | null> => {
      const { data, error } = await supabase
        .from("partner_clients")
        .select("*, partner:partners(*)")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data as (PartnerClient & { partner: Partner | null }) | null;
    },
  });

// ----- Commercial Events -----
export const useCommercialEvents = (clientId?: string) =>
  useQuery({
    queryKey: ["partners-crm", "events", clientId ?? "all"],
    queryFn: async (): Promise<(CommercialEvent & { client?: PartnerClient & { partner: Partner | null } })[]> => {
      let q = supabase
        .from("commercial_events")
        .select("*, client:partner_clients(*, partner:partners(*))")
        .order("event_date", { ascending: false });
      if (clientId) q = q.eq("client_id", clientId);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as (CommercialEvent & { client?: PartnerClient & { partner: Partner | null } })[];
    },
  });

// ----- Notes -----
export const useClientNotes = (clientId: string | undefined) =>
  useQuery({
    queryKey: ["partners-crm", "notes", clientId],
    enabled: !!clientId,
    queryFn: async (): Promise<ClientNote[]> => {
      const { data, error } = await supabase
        .from("client_notes")
        .select("*")
        .eq("client_id", clientId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

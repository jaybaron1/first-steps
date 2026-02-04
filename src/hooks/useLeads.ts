import { useState, useEffect, useCallback } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';

export interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  source: string | null;
  status: string | null;
  lead_score: number | null;
  session_id: string | null;
  metadata: unknown | null;
  created_at: string | null;
  sheets_synced_at: string | null;
  // Joined data from session
  page_views_count?: number;
  entry_page?: string;
  total_time_seconds?: number;
  company_name?: string | null;
  company_size?: string | null;
  company_industry?: string | null;
}

export interface UseLeadsOptions {
  status?: string[];
  source?: string[];
  dateRange?: { start: Date; end: Date };
  search?: string;
  sortBy?: 'created_at' | 'lead_score' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface UseLeadsResult {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  refetch: () => Promise<void>;
  updateLeadStatus: (leadId: string, status: string) => Promise<boolean>;
}

export function useLeads(options: UseLeadsOptions = {}): UseLeadsResult {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const {
    status,
    source,
    dateRange,
    search,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10,
  } = options;

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('leads')
        .select('*', { count: 'exact' });

      // Apply status filter
      if (status && status.length > 0) {
        query = query.in('status', status);
      }

      // Apply source filter
      if (source && source.length > 0) {
        query = query.in('source', source);
      }

      // Apply date range filter
      if (dateRange) {
        query = query
          .gte('created_at', dateRange.start.toISOString())
          .lte('created_at', dateRange.end.toISOString());
      }

      // Apply search filter
      if (search && search.trim()) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      // Enrich leads with session data
      const enrichedLeads = await Promise.all(
        (data || []).map(async (lead) => {
          if (!lead.session_id) return lead;

          // Get session info
          const { data: session } = await supabase
            .from('visitor_sessions')
            .select('page_views, total_time_seconds, company_name, company_size, company_industry')
            .eq('session_id', lead.session_id)
            .single();

          // Get entry page
          const { data: firstPage } = await supabase
            .from('page_views')
            .select('page_url')
            .eq('session_id', lead.session_id)
            .order('created_at', { ascending: true })
            .limit(1)
            .single();

          return {
            ...lead,
            page_views_count: session?.page_views || 0,
            total_time_seconds: session?.total_time_seconds || 0,
            entry_page: firstPage?.page_url || 'Direct',
            company_name: session?.company_name || null,
            company_size: session?.company_size || null,
            company_industry: session?.company_industry || null,
          };
        })
      );

      setLeads(enrichedLeads);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('[useLeads] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [status, source, dateRange, search, sortBy, sortOrder, page, pageSize]);

  const updateLeadStatus = useCallback(async (leadId: string, newStatus: string): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (updateError) throw updateError;

      // Update local state
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));

      return true;
    } catch (err) {
      console.error('[useLeads] Update error:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    loading,
    error,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize),
    refetch: fetchLeads,
    updateLeadStatus,
  };
}

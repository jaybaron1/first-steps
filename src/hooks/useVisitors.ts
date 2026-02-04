import { useState, useEffect, useCallback } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { subDays, subHours } from 'date-fns';

export interface Visitor {
  session_id: string;
  fingerprint_hash: string | null;
  ip_address: unknown;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  referrer: string | null;
  first_seen: string | null;
  last_seen: string | null;
  page_count: number;
  last_page: string | null;
  lead_score: number | null;
  page_views: number | null;
  total_time_seconds: number | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  company_name: string | null;
  company_size: string | null;
  company_industry: string | null;
  id: string;
}

export interface VisitorFilters {
  dateRange?: 'all' | '24h' | '7d' | '30d' | '90d';
  deviceType?: 'all' | 'desktop' | 'mobile' | 'tablet';
  country?: string;
}

export interface UseVisitorsOptions {
  page?: number;
  pageSize?: number;
  sortBy?: 'first_seen' | 'last_seen' | 'lead_score';
  sortOrder?: 'asc' | 'desc';
  filters?: VisitorFilters;
}

export interface UseVisitorsResult {
  visitors: Visitor[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  countries: string[];
  refetch: () => Promise<void>;
}

function getDateRangeStart(range: string): Date | null {
  const now = new Date();
  switch (range) {
    case '24h':
      return subHours(now, 24);
    case '7d':
      return subDays(now, 7);
    case '30d':
      return subDays(now, 30);
    case '90d':
      return subDays(now, 90);
    default:
      return null;
  }
}

export function useVisitors(options: UseVisitorsOptions = {}): UseVisitorsResult {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [countries, setCountries] = useState<string[]>([]);

  const {
    page = 1,
    pageSize = 10,
    sortBy = 'first_seen',
    sortOrder = 'desc',
    filters = {},
  } = options;

  const fetchCountries = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('visitor_sessions')
        .select('country')
        .not('country', 'is', null);

      if (data) {
        const uniqueCountries = [...new Set(data.map((d) => d.country).filter(Boolean))] as string[];
        setCountries(uniqueCountries.sort());
      }
    } catch (err) {
      console.error('[useVisitors] Error fetching countries:', err);
    }
  }, []);

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query with filters
      let countQuery = supabase.from('visitor_sessions').select('*', { count: 'exact', head: true });
      let dataQuery = supabase.from('visitor_sessions').select('*');

      // Apply date range filter
      if (filters.dateRange && filters.dateRange !== 'all') {
        const startDate = getDateRangeStart(filters.dateRange);
        if (startDate) {
          const isoDate = startDate.toISOString();
          countQuery = countQuery.gte('first_seen', isoDate);
          dataQuery = dataQuery.gte('first_seen', isoDate);
        }
      }

      // Apply device type filter
      if (filters.deviceType && filters.deviceType !== 'all') {
        countQuery = countQuery.eq('device_type', filters.deviceType);
        dataQuery = dataQuery.eq('device_type', filters.deviceType);
      }

      // Apply country filter
      if (filters.country) {
        countQuery = countQuery.eq('country', filters.country);
        dataQuery = dataQuery.eq('country', filters.country);
      }

      // Get total count
      const { count: total } = await countQuery;

      // Apply pagination and sorting
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data: sessions, error: sessionsError } = await dataQuery
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(from, to);

      if (sessionsError) throw sessionsError;

      // Get page counts for each session
      const sessionsWithPageCount = await Promise.all(
        (sessions || []).map(async (session) => {
          const { count } = await supabase
            .from('page_views')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.session_id);

          const { data: lastPage } = await supabase
            .from('page_views')
            .select('page_url')
            .eq('session_id', session.session_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            ...session,
            page_count: count || 0,
            last_page: lastPage?.page_url || null,
          };
        })
      );

      setVisitors(sessionsWithPageCount);
      setTotalCount(total || 0);
    } catch (err) {
      console.error('[useVisitors] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch visitors');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, sortOrder, filters.dateRange, filters.deviceType, filters.country]);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('visitors-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'visitor_sessions' },
        () => fetchVisitors()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchVisitors]);

  return {
    visitors,
    loading,
    error,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize),
    countries,
    refetch: fetchVisitors,
  };
}

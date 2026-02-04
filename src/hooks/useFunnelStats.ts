import { useState, useEffect, useCallback } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';

export interface FunnelStep {
  id: string;
  name: string;
  url_pattern: string;
  step_order: number;
  funnel_name: string;
  visitors: number;
  percentage: number;
  dropOffRate: number;
}

export interface FunnelMetrics {
  steps: FunnelStep[];
  totalConversionRate: number;
  totalVisitors: number;
  totalConverted: number;
}

export type TimeRange = '7d' | '30d' | '90d' | 'all';

export interface UseFunnelStatsOptions {
  funnelName?: string;
  timeRange?: TimeRange;
  utmSource?: string;
}

export interface UseFunnelStatsResult {
  metrics: FunnelMetrics;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function getDateFromRange(range: TimeRange): Date | null {
  const now = new Date();
  switch (range) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    case 'all':
    default:
      return null;
  }
}

export function useFunnelStats(options: UseFunnelStatsOptions = {}): UseFunnelStatsResult {
  const [metrics, setMetrics] = useState<FunnelMetrics>({
    steps: [],
    totalConversionRate: 0,
    totalVisitors: 0,
    totalConverted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { funnelName = 'default', timeRange = '30d', utmSource } = options;

  const fetchFunnelStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get funnel steps
      const { data: funnelSteps, error: stepsError } = await supabase
        .from('funnel_steps')
        .select('*')
        .eq('funnel_name', funnelName)
        .order('step_order', { ascending: true });

      if (stepsError) throw stepsError;

      if (!funnelSteps || funnelSteps.length === 0) {
        setMetrics({
          steps: [],
          totalConversionRate: 0,
          totalVisitors: 0,
          totalConverted: 0,
        });
        setLoading(false);
        return;
      }

      const startDate = getDateFromRange(timeRange);

      // Calculate visitors for each step
      const stepsWithVisitors = await Promise.all(
        funnelSteps.map(async (step) => {
          // Handle special patterns like 'calendly_booking_complete' (event-based)
          if (step.url_pattern.startsWith('calendly_')) {
            // This would be tracked as an event, not a page view
            let eventQuery = supabase
              .from('visitor_events')
              .select('session_id')
              .eq('event_type', step.url_pattern);

            if (startDate) {
              eventQuery = eventQuery.gte('created_at', startDate.toISOString());
            }

            const { data: eventData } = await eventQuery;
            const uniqueSessions = new Set(eventData?.map(e => e.session_id) || []);
            return {
              ...step,
              visitors: uniqueSessions.size,
              percentage: 0,
              dropOffRate: 0,
            };
          }

          // Build query for page views
          let query = supabase
            .from('page_views')
            .select('session_id, page_url');

          if (startDate) {
            query = query.gte('created_at', startDate.toISOString());
          }

          const { data: pageData } = await query;
          
          // Filter by URL pattern - normalize URLs by removing query strings for matching
          const matchingData = (pageData || []).filter(p => {
            // Extract path without query string
            let path = p.page_url;
            try {
              // Handle full URLs or paths with query strings
              if (path.includes('?')) {
                path = path.split('?')[0];
              }
              // Normalize trailing slashes
              if (path !== '/' && path.endsWith('/')) {
                path = path.slice(0, -1);
              }
            } catch {
              // Keep original path if parsing fails
            }

            // Match patterns
            if (step.url_pattern === '/') {
              return path === '/' || path === '';
            }
            
            // Convert SQL LIKE pattern to regex
            const pattern = step.url_pattern
              .replace(/%/g, '.*')
              .replace(/_/g, '.');
            const regex = new RegExp(`^${pattern}$`, 'i');
            return regex.test(path);
          });

          // Apply UTM source filter if specified
          let filteredData = matchingData;
          if (utmSource) {
            const { data: sessions } = await supabase
              .from('visitor_sessions')
              .select('session_id')
              .eq('utm_source', utmSource);
            
            const sessionIds = new Set(sessions?.map(s => s.session_id) || []);
            filteredData = matchingData.filter(p => p.session_id && sessionIds.has(p.session_id));
          }

          const uniqueSessions = new Set(filteredData.map(p => p.session_id).filter(Boolean));

          return {
            ...step,
            visitors: uniqueSessions.size,
            percentage: 0,
            dropOffRate: 0,
          };
        })
      );

      // Calculate percentages and drop-off rates
      const firstStepVisitors = stepsWithVisitors[0]?.visitors || 1;
      const enrichedSteps = stepsWithVisitors.map((step, index) => {
        const percentage = (step.visitors / firstStepVisitors) * 100;
        const prevVisitors = index > 0 ? stepsWithVisitors[index - 1].visitors : step.visitors;
        const dropOffRate = prevVisitors > 0 
          ? ((prevVisitors - step.visitors) / prevVisitors) * 100 
          : 0;

        return {
          ...step,
          percentage: Math.round(percentage * 10) / 10,
          dropOffRate: Math.round(dropOffRate * 10) / 10,
        };
      });

      const lastStep = enrichedSteps[enrichedSteps.length - 1];
      const totalConversionRate = firstStepVisitors > 0
        ? (lastStep.visitors / firstStepVisitors) * 100
        : 0;

      setMetrics({
        steps: enrichedSteps,
        totalConversionRate: Math.round(totalConversionRate * 100) / 100,
        totalVisitors: firstStepVisitors,
        totalConverted: lastStep.visitors,
      });
    } catch (err) {
      console.error('[useFunnelStats] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch funnel stats');
    } finally {
      setLoading(false);
    }
  }, [funnelName, timeRange, utmSource]);

  useEffect(() => {
    fetchFunnelStats();
  }, [fetchFunnelStats]);

  return {
    metrics,
    loading,
    error,
    refetch: fetchFunnelStats,
  };
}

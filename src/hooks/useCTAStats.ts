import { useState, useEffect, useCallback } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';

export interface CTAStat {
  ctaName: string;
  pageUrl: string;
  totalClicks: number;
  uniqueSessions: number;
  conversions: number;
  conversionRate: number;
  mobileClicks: number;
  desktopClicks: number;
  mobilePercentage: number;
  clicksByDay: { date: string; clicks: number }[];
}

export type CTATimeRange = '7d' | '30d' | '90d' | 'all';

export interface UseCTAStatsOptions {
  timeRange?: CTATimeRange;
  pageUrl?: string;
}

export interface UseCTAStatsResult {
  stats: CTAStat[];
  totalClicks: number;
  topPerformer: CTAStat | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function getDateFromRange(range: CTATimeRange): Date | null {
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

export function useCTAStats(options: UseCTAStatsOptions = {}): UseCTAStatsResult {
  const [stats, setStats] = useState<CTAStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { timeRange = '30d', pageUrl } = options;

  const fetchCTAStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const startDate = getDateFromRange(timeRange);

      // Get all CTA click events
      let query = supabase
        .from('visitor_events')
        .select('*')
        .eq('event_type', 'cta_click');

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }

      const { data: ctaEvents, error: eventsError } = await query;
      if (eventsError) throw eventsError;

      if (!ctaEvents || ctaEvents.length === 0) {
        setStats([]);
        setLoading(false);
        return;
      }

      // Get all leads to calculate conversions
      const { data: leads } = await supabase
        .from('leads')
        .select('session_id');
      
      const leadSessionIds = new Set(leads?.map(l => l.session_id) || []);

      // Get session device info
      const sessionIds = [...new Set(ctaEvents.map(e => e.session_id))];
      const { data: sessions } = await supabase
        .from('visitor_sessions')
        .select('session_id, device_type')
        .in('session_id', sessionIds);

      const sessionDeviceMap = new Map(sessions?.map(s => [s.session_id, s.device_type]) || []);

      // Group events by CTA name and page
      const ctaGroups = new Map<string, {
        events: typeof ctaEvents;
        sessions: Set<string>;
      }>();

      ctaEvents.forEach(event => {
        const eventData = event.event_data as { ctaName?: string; pageUrl?: string } | null;
        const ctaName = eventData?.ctaName || 'Unknown CTA';
        const eventPageUrl = eventData?.pageUrl || 'Unknown Page';
        
        // Filter by page if specified
        if (pageUrl && eventPageUrl !== pageUrl) return;

        const key = `${ctaName}|||${eventPageUrl}`;
        
        if (!ctaGroups.has(key)) {
          ctaGroups.set(key, { events: [], sessions: new Set() });
        }
        
        const group = ctaGroups.get(key)!;
        group.events.push(event);
        if (event.session_id) {
          group.sessions.add(event.session_id);
        }
      });

      // Calculate stats for each CTA
      const ctaStats: CTAStat[] = Array.from(ctaGroups.entries()).map(([key, group]) => {
        const [ctaName, ctaPageUrl] = key.split('|||');
        
        // Count conversions (sessions that became leads)
        const conversions = Array.from(group.sessions).filter(s => leadSessionIds.has(s)).length;
        
        // Count mobile vs desktop
        let mobileClicks = 0;
        let desktopClicks = 0;
        
        group.events.forEach(event => {
          const deviceType = sessionDeviceMap.get(event.session_id || '') || 'desktop';
          if (deviceType === 'mobile' || deviceType === 'tablet') {
            mobileClicks++;
          } else {
            desktopClicks++;
          }
        });

        // Group by day for trend
        const clicksByDayMap = new Map<string, number>();
        group.events.forEach(event => {
          if (event.created_at) {
            const date = event.created_at.split('T')[0];
            clicksByDayMap.set(date, (clicksByDayMap.get(date) || 0) + 1);
          }
        });

        const clicksByDay = Array.from(clicksByDayMap.entries())
          .map(([date, clicks]) => ({ date, clicks }))
          .sort((a, b) => a.date.localeCompare(b.date));

        return {
          ctaName,
          pageUrl: ctaPageUrl,
          totalClicks: group.events.length,
          uniqueSessions: group.sessions.size,
          conversions,
          conversionRate: group.sessions.size > 0 
            ? Math.round((conversions / group.sessions.size) * 1000) / 10 
            : 0,
          mobileClicks,
          desktopClicks,
          mobilePercentage: group.events.length > 0
            ? Math.round((mobileClicks / group.events.length) * 100)
            : 0,
          clicksByDay,
        };
      });

      // Sort by total clicks
      ctaStats.sort((a, b) => b.totalClicks - a.totalClicks);

      setStats(ctaStats);
    } catch (err) {
      console.error('[useCTAStats] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch CTA stats');
    } finally {
      setLoading(false);
    }
  }, [timeRange, pageUrl]);

  useEffect(() => {
    fetchCTAStats();
  }, [fetchCTAStats]);

  const totalClicks = stats.reduce((sum, s) => sum + s.totalClicks, 0);
  const topPerformer = stats.length > 0 
    ? stats.reduce((best, current) => 
        current.conversionRate > best.conversionRate ? current : best
      )
    : null;

  return {
    stats,
    totalClicks,
    topPerformer,
    loading,
    error,
    refetch: fetchCTAStats,
  };
}

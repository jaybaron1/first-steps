import { useState, useEffect } from 'react';
import { adminSupabase } from '@/lib/adminBackend';

export interface UTMBreakdown {
  value: string;
  count: number;
  percentage: number;
  conversions: number;
  conversionRate: number;
}

export interface UTMStats {
  sources: UTMBreakdown[];
  mediums: UTMBreakdown[];
  campaigns: UTMBreakdown[];
  terms: UTMBreakdown[];
  contents: UTMBreakdown[];
}

type TimeRange = 'today' | '7days' | '30days' | 'all';

export function useUTMStats(timeRange: TimeRange = '7days') {
  const [stats, setStats] = useState<UTMStats>({
    sources: [],
    mediums: [],
    campaigns: [],
    terms: [],
    contents: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalTagged, setTotalTagged] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = adminSupabase
          .from('visitor_sessions')
          .select('session_id, utm_source, utm_medium, utm_campaign, utm_term, utm_content');

        // Apply time filter
        const now = new Date();
        if (timeRange === 'today') {
          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          query = query.gte('created_at', startOfDay.toISOString());
        } else if (timeRange === '7days') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          query = query.gte('created_at', sevenDaysAgo.toISOString());
        } else if (timeRange === '30days') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          query = query.gte('created_at', thirtyDaysAgo.toISOString());
        }

        const { data: sessions, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        if (!sessions || sessions.length === 0) {
          setStats({ sources: [], mediums: [], campaigns: [], terms: [], contents: [] });
          setTotalTagged(0);
          setLoading(false);
          return;
        }

        // Get leads for conversion tracking
        const { data: leads } = await adminSupabase
          .from('leads')
          .select('session_id');

        const leadSessionIds = new Set((leads || []).map(l => l.session_id));

        // Filter to only UTM-tagged sessions
        const taggedSessions = sessions.filter(s => 
          s.utm_source || s.utm_medium || s.utm_campaign || s.utm_term || s.utm_content
        );
        setTotalTagged(taggedSessions.length);

        const aggregateField = (field: keyof typeof sessions[0]): UTMBreakdown[] => {
          const map = new Map<string, { count: number; conversions: number }>();
          
          sessions.forEach((session) => {
            const value = session[field] as string | null;
            if (value) {
              const existing = map.get(value) || { count: 0, conversions: 0 };
              const isConversion = leadSessionIds.has(session.session_id);
              map.set(value, {
                count: existing.count + 1,
                conversions: existing.conversions + (isConversion ? 1 : 0),
              });
            }
          });

          const total = Array.from(map.values()).reduce((sum, v) => sum + v.count, 0);

          return Array.from(map.entries())
            .map(([value, { count, conversions }]) => ({
              value,
              count,
              percentage: total > 0 ? Math.round((count / total) * 100) : 0,
              conversions,
              conversionRate: count > 0 ? Math.round((conversions / count) * 100) : 0,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        };

        setStats({
          sources: aggregateField('utm_source'),
          mediums: aggregateField('utm_medium'),
          campaigns: aggregateField('utm_campaign'),
          terms: aggregateField('utm_term'),
          contents: aggregateField('utm_content'),
        });
      } catch (err) {
        console.error('Error fetching UTM stats:', err);
        setError('Failed to load UTM data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  return { stats, loading, error, totalTagged };
}

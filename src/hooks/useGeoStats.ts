import { useState, useEffect } from 'react';
import { adminSupabase } from '@/lib/adminBackend';

export interface CountryStats {
  country: string;
  visitor_count: number;
  percentage: number;
  avg_time_on_site: number;
}

type TimeRange = 'today' | '7days' | '30days' | 'all';

export function useGeoStats(timeRange: TimeRange = '7days') {
  const [stats, setStats] = useState<CountryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVisitors, setTotalVisitors] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = adminSupabase
          .from('visitor_sessions')
          .select('country, total_time_seconds');

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

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        if (!data || data.length === 0) {
          setStats([]);
          setTotalVisitors(0);
          setLoading(false);
          return;
        }

        // Aggregate by country
        const countryMap = new Map<string, { count: number; totalTime: number }>();
        
        data.forEach((session) => {
          const country = session.country || 'Unknown';
          const existing = countryMap.get(country) || { count: 0, totalTime: 0 };
          countryMap.set(country, {
            count: existing.count + 1,
            totalTime: existing.totalTime + (session.total_time_seconds || 0),
          });
        });

        const total = data.length;
        setTotalVisitors(total);

        const aggregated: CountryStats[] = Array.from(countryMap.entries())
          .map(([country, { count, totalTime }]) => ({
            country,
            visitor_count: count,
            percentage: Math.round((count / total) * 100),
            avg_time_on_site: count > 0 ? Math.round(totalTime / count) : 0,
          }))
          .sort((a, b) => b.visitor_count - a.visitor_count);

        setStats(aggregated);
      } catch (err) {
        console.error('Error fetching geo stats:', err);
        setError('Failed to load geographic data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  return { stats, loading, error, totalVisitors };
}

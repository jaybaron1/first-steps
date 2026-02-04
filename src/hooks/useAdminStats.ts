import { useEffect, useState } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';

interface DashboardStats {
  activeVisitors: number;
  pageViewsToday: number;
  uniqueVisitorsToday: number;
  leadsToday: number;
  activeCampaigns: number;
  avgTimeOnSite: string;
  bounceRate: number;
}

export const useAdminStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeVisitors: 0,
    pageViewsToday: 0,
    uniqueVisitorsToday: 0,
    leadsToday: 0,
    activeCampaigns: 0,
    avgTimeOnSite: '0:00',
    bounceRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

        // Active visitors (last 5 minutes)
        const { count: activeCount } = await supabase
          .from('visitor_sessions')
          .select('*', { count: 'exact', head: true })
          .gte('last_seen', fiveMinutesAgo.toISOString());

        // Page views today
        const { count: pageViewsCount } = await supabase
          .from('page_views')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());

        // Unique visitors today
        const { count: uniqueVisitorsCount } = await supabase
          .from('visitor_sessions')
          .select('*', { count: 'exact', head: true })
          .gte('first_seen', today.toISOString());

        // Leads today
        const { count: leadsCount } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', today.toISOString());

        // Active campaigns
        const { count: campaignsCount } = await supabase
          .from('campaigns')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');

        // Average time on site (from today's sessions)
        const { data: sessionsData } = await supabase
          .from('visitor_sessions')
          .select('total_time_seconds')
          .gte('first_seen', today.toISOString())
          .not('total_time_seconds', 'is', null);

        let avgTimeOnSite = '0:00';
        if (sessionsData && sessionsData.length > 0) {
          const totalSeconds = sessionsData.reduce(
            (sum, s) => sum + (s.total_time_seconds || 0),
            0
          );
          const avgSeconds = Math.round(totalSeconds / sessionsData.length);
          const minutes = Math.floor(avgSeconds / 60);
          const seconds = avgSeconds % 60;
          avgTimeOnSite = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        // Bounce rate (sessions with only 1 page view)
        const { data: bounceData } = await supabase
          .from('visitor_sessions')
          .select('page_views')
          .gte('first_seen', today.toISOString());

        let bounceRate = 0;
        if (bounceData && bounceData.length > 0) {
          const bounces = bounceData.filter((s) => (s.page_views || 1) === 1).length;
          bounceRate = Math.round((bounces / bounceData.length) * 100);
        }

        setStats({
          activeVisitors: activeCount || 0,
          pageViewsToday: pageViewsCount || 0,
          uniqueVisitorsToday: uniqueVisitorsCount || 0,
          leadsToday: leadsCount || 0,
          activeCampaigns: campaignsCount || 0,
          avgTimeOnSite,
          bounceRate,
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
        setError('Failed to load dashboard statistics');
        setLoading(false);
      }
    };

    fetchStats();

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error };
};

export default useAdminStats;

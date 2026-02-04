import { useState, useEffect, useCallback } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, eachMonthOfInterval, subMonths } from 'date-fns';

export interface RevenueByPeriod {
  period: string;
  revenue: number;
  deals: number;
  cumulative: number;
}

export interface ForecastData {
  month: string;
  projected: number;
  actual: number;
  pipeline: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  mrr: number;
  arr: number;
  growthRate: number;
  revenueByDay: RevenueByPeriod[];
  revenueByMonth: RevenueByPeriod[];
  forecast: ForecastData[];
}

export function useRevenueMetrics() {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all revenue events
      const { data: revenueEvents, error: revenueError } = await supabase
        .from('revenue_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (revenueError) throw revenueError;

      // Fetch deals for pipeline and forecast
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('*');

      if (dealsError) throw dealsError;

      const now = new Date();
      const thisMonthStart = startOfMonth(now);
      const thisMonthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      // Calculate total revenue
      const totalRevenue = (revenueEvents || []).reduce((sum: number, e: any) => sum + Number(e.amount), 0);

      // Revenue this month
      const revenueThisMonth = (revenueEvents || [])
        .filter((e: any) => {
          const date = new Date(e.event_date);
          return date >= thisMonthStart && date <= thisMonthEnd;
        })
        .reduce((sum: number, e: any) => sum + Number(e.amount), 0);

      // Revenue last month
      const revenueLastMonth = (revenueEvents || [])
        .filter((e: any) => {
          const date = new Date(e.event_date);
          return date >= lastMonthStart && date <= lastMonthEnd;
        })
        .reduce((sum: number, e: any) => sum + Number(e.amount), 0);

      // Growth rate
      const growthRate = revenueLastMonth > 0 
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100 
        : 0;

      // Estimate MRR from recent recurring revenue (simplified)
      const last30Days = subDays(now, 30);
      const recentRevenue = (revenueEvents || [])
        .filter((e: any) => new Date(e.event_date) >= last30Days)
        .reduce((sum: number, e: any) => sum + Number(e.amount), 0);
      const mrr = recentRevenue;
      const arr = mrr * 12;

      // Revenue by day (last 30 days)
      const days = eachDayOfInterval({ start: subDays(now, 29), end: now });
      let cumulativeDay = 0;
      const revenueByDay: RevenueByPeriod[] = days.map(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const dayRevenue = (revenueEvents || [])
          .filter((e: any) => format(new Date(e.event_date), 'yyyy-MM-dd') === dayStr)
          .reduce((sum: number, e: any) => sum + Number(e.amount), 0);
        const dayDeals = (revenueEvents || [])
          .filter((e: any) => format(new Date(e.event_date), 'yyyy-MM-dd') === dayStr).length;
        cumulativeDay += dayRevenue;
        return {
          period: format(day, 'MMM d'),
          revenue: dayRevenue,
          deals: dayDeals,
          cumulative: cumulativeDay,
        };
      });

      // Revenue by month (last 12 months)
      const months = eachMonthOfInterval({ start: subMonths(now, 11), end: now });
      let cumulativeMonth = 0;
      const revenueByMonth: RevenueByPeriod[] = months.map(month => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const monthRevenue = (revenueEvents || [])
          .filter((e: any) => {
            const date = new Date(e.event_date);
            return date >= monthStart && date <= monthEnd;
          })
          .reduce((sum: number, e: any) => sum + Number(e.amount), 0);
        const monthDeals = new Set(
          (revenueEvents || [])
            .filter((e: any) => {
              const date = new Date(e.event_date);
              return date >= monthStart && date <= monthEnd;
            })
            .map((e: any) => e.deal_id)
        ).size;
        cumulativeMonth += monthRevenue;
        return {
          period: format(month, 'MMM yyyy'),
          revenue: monthRevenue,
          deals: monthDeals,
          cumulative: cumulativeMonth,
        };
      });

      // Forecast (next 6 months based on pipeline)
      const openDeals = (deals || []).filter((d: any) => !d.stage?.startsWith('closed'));
      const forecast: ForecastData[] = [];
      
      for (let i = 0; i < 6; i++) {
        const forecastMonth = subMonths(now, -i);
        const monthStr = format(forecastMonth, 'MMM yyyy');
        
        // Get actual revenue for past/current month
        const monthStart = startOfMonth(forecastMonth);
        const monthEnd = endOfMonth(forecastMonth);
        const actual = (revenueEvents || [])
          .filter((e: any) => {
            const date = new Date(e.event_date);
            return date >= monthStart && date <= monthEnd;
          })
          .reduce((sum: number, e: any) => sum + Number(e.amount), 0);

        // Calculate pipeline for this month based on expected close dates
        const pipeline = openDeals
          .filter((d: any) => {
            if (!d.expected_close_date) return false;
            const closeDate = new Date(d.expected_close_date);
            return closeDate >= monthStart && closeDate <= monthEnd;
          })
          .reduce((sum: number, d: any) => sum + (d.value * (d.probability || 50) / 100), 0);

        // Project based on historical average + pipeline
        const avgMonthlyRevenue = revenueByMonth.length > 0
          ? revenueByMonth.reduce((sum, m) => sum + m.revenue, 0) / revenueByMonth.length
          : 0;
        
        const projected = i === 0 ? actual : avgMonthlyRevenue + pipeline;

        forecast.push({
          month: monthStr,
          projected,
          actual: i === 0 ? actual : 0,
          pipeline,
        });
      }

      setMetrics({
        totalRevenue,
        revenueThisMonth,
        revenueLastMonth,
        mrr,
        arr,
        growthRate,
        revenueByDay,
        revenueByMonth,
        forecast,
      });

      setError(null);
    } catch (err) {
      console.error('[useRevenueMetrics] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch revenue metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
}

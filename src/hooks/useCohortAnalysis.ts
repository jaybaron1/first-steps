import { useState, useEffect, useCallback } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { format, subMonths, startOfMonth, differenceInMonths } from 'date-fns';

export interface CohortData {
  cohortMonth: string;
  totalCustomers: number;
  activeCustomers: number;
  churnedCustomers: number;
  retentionByMonth: number[]; // Retention % for months 0, 1, 2, 3...
  ltv: number;
  avgRevenue: number;
}

export interface ChurnMetrics {
  overallChurnRate: number;
  monthlyChurnRate: number;
  revenueAtRisk: number;
  churnedCustomers: number;
  activeCustomers: number;
  avgCustomerLifespan: number;
}

export interface CohortAnalysisMetrics {
  cohorts: CohortData[];
  churn: ChurnMetrics;
  retentionMatrix: number[][]; // [cohortIndex][monthIndex] = retention %
  yoyGrowth: number;
  momGrowth: number;
}

export function useCohortAnalysis() {
  const [metrics, setMetrics] = useState<CohortAnalysisMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch customer cohorts
      const { data: cohorts, error: cohortsError } = await supabase
        .from('customer_cohorts')
        .select('*')
        .order('cohort_month', { ascending: true });

      if (cohortsError) throw cohortsError;

      // Fetch revenue events for LTV per cohort
      const { data: revenueEvents, error: revenueError } = await supabase
        .from('revenue_events')
        .select('amount, deal_id, event_date');

      if (revenueError) throw revenueError;

      // Fetch deals to map revenue to cohorts
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('id, company, actual_close_date')
        .eq('stage', 'closed_won');

      if (dealsError) throw dealsError;

      const now = new Date();

      // Group cohorts by month
      const cohortsByMonth: Record<string, typeof cohorts> = {};
      (cohorts || []).forEach((c: any) => {
        const monthKey = format(new Date(c.cohort_month), 'yyyy-MM');
        if (!cohortsByMonth[monthKey]) {
          cohortsByMonth[monthKey] = [];
        }
        cohortsByMonth[monthKey].push(c);
      });

      // Build cohort data with retention curves
      const cohortData: CohortData[] = [];
      const retentionMatrix: number[][] = [];

      Object.keys(cohortsByMonth).sort().forEach((monthKey, cohortIndex) => {
        const monthCohort = cohortsByMonth[monthKey];
        const totalCustomers = monthCohort.length;
        const churnedCustomers = monthCohort.filter((c: any) => c.is_churned).length;
        const activeCustomers = totalCustomers - churnedCustomers;

        // Calculate LTV for this cohort
        const cohortLTV = monthCohort.reduce(
          (sum: number, c: any) => sum + Number(c.total_lifetime_value || 0),
          0
        );
        const avgRevenue = totalCustomers > 0 ? cohortLTV / totalCustomers : 0;

        // Calculate retention by month (simplified - based on is_churned and churned_at)
        const cohortStartDate = startOfMonth(new Date(monthKey + '-01'));
        const monthsSinceStart = differenceInMonths(now, cohortStartDate);

        const retentionByMonth: number[] = [];
        for (let m = 0; m <= Math.min(monthsSinceStart, 12); m++) {
          // For month 0, everyone is retained
          if (m === 0) {
            retentionByMonth.push(100);
            continue;
          }

          // Count customers still active at month m
          const retainedAtMonth = monthCohort.filter((c: any) => {
            if (!c.is_churned) return true;
            if (!c.churned_at) return true;
            const churnMonth = differenceInMonths(new Date(c.churned_at), cohortStartDate);
            return churnMonth >= m;
          }).length;

          retentionByMonth.push(
            totalCustomers > 0 ? (retainedAtMonth / totalCustomers) * 100 : 0
          );
        }

        cohortData.push({
          cohortMonth: monthKey,
          totalCustomers,
          activeCustomers,
          churnedCustomers,
          retentionByMonth,
          ltv: cohortLTV,
          avgRevenue,
        });

        retentionMatrix.push(retentionByMonth);
      });

      // Calculate overall churn metrics
      const totalCohortCustomers = (cohorts || []).length || 1;
      const totalChurned = (cohorts || []).filter((c: any) => c.is_churned).length;
      const totalActive = totalCohortCustomers - totalChurned;
      const overallChurnRate = (totalChurned / totalCohortCustomers) * 100;

      // Monthly churn rate (churned in last 30 days / active at start of period)
      const thirtyDaysAgo = subMonths(now, 1);
      const recentlyChurned = (cohorts || []).filter((c: any) => {
        if (!c.is_churned || !c.churned_at) return false;
        return new Date(c.churned_at) >= thirtyDaysAgo;
      }).length;
      const monthlyChurnRate = totalActive > 0 ? (recentlyChurned / (totalActive + recentlyChurned)) * 100 : 0;

      // Revenue at risk from active customers (potential churn)
      const avgLTV = (cohorts || []).reduce(
        (sum: number, c: any) => sum + Number(c.total_lifetime_value || 0),
        0
      ) / totalCohortCustomers;
      const revenueAtRisk = totalActive * avgLTV * (monthlyChurnRate / 100);

      // Calculate avg customer lifespan from churned customers
      const churnedWithDates = (cohorts || []).filter(
        (c: any) => c.is_churned && c.churned_at && c.first_revenue_date
      );
      const avgLifespan = churnedWithDates.length > 0
        ? churnedWithDates.reduce((sum: number, c: any) => {
            const months = differenceInMonths(
              new Date(c.churned_at),
              new Date(c.first_revenue_date)
            );
            return sum + months;
          }, 0) / churnedWithDates.length
        : 12; // Default 12 months if no data

      // Calculate YoY and MoM growth (based on revenue)
      const thisMonthRevenue = (revenueEvents || [])
        .filter((e: any) => {
          const date = new Date(e.event_date);
          return date >= startOfMonth(now);
        })
        .reduce((sum: number, e: any) => sum + Number(e.amount), 0);

      const lastMonthRevenue = (revenueEvents || [])
        .filter((e: any) => {
          const date = new Date(e.event_date);
          const lastMonth = startOfMonth(subMonths(now, 1));
          return date >= lastMonth && date < startOfMonth(now);
        })
        .reduce((sum: number, e: any) => sum + Number(e.amount), 0);

      const lastYearRevenue = (revenueEvents || [])
        .filter((e: any) => {
          const date = new Date(e.event_date);
          const lastYear = startOfMonth(subMonths(now, 12));
          return date >= lastYear && date < startOfMonth(subMonths(now, 11));
        })
        .reduce((sum: number, e: any) => sum + Number(e.amount), 0);

      const momGrowth = lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

      const yoyGrowth = lastYearRevenue > 0
        ? ((thisMonthRevenue - lastYearRevenue) / lastYearRevenue) * 100
        : 0;

      setMetrics({
        cohorts: cohortData,
        churn: {
          overallChurnRate,
          monthlyChurnRate,
          revenueAtRisk,
          churnedCustomers: totalChurned,
          activeCustomers: totalActive,
          avgCustomerLifespan: avgLifespan,
        },
        retentionMatrix,
        yoyGrowth,
        momGrowth,
      });

      setError(null);
    } catch (err) {
      console.error('[useCohortAnalysis] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cohort analysis');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
}

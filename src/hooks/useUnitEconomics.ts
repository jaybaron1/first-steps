import { useState, useEffect, useCallback } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';

export interface UnitEconomicsMetrics {
  ltv: number;
  cac: number;
  ltvCacRatio: number;
  paybackMonths: number;
  uniqueCustomers: number;
  totalRevenue: number;
  totalSpend: number;
  newCustomers: number;
  avgRevenuePerCustomer: number;
  monthlyChurnRate: number;
}

export function useUnitEconomics() {
  const [metrics, setMetrics] = useState<UnitEconomicsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all revenue events for LTV calculation
      const { data: revenueEvents, error: revenueError } = await supabase
        .from('revenue_events')
        .select('amount, deal_id');

      if (revenueError) throw revenueError;

      // Fetch campaigns for CAC calculation
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('budget, actual_spend');

      if (campaignsError) throw campaignsError;

      // Fetch customer cohorts for churn data
      const { data: cohorts, error: cohortsError } = await supabase
        .from('customer_cohorts')
        .select('*');

      if (cohortsError) throw cohortsError;

      // Fetch closed-won deals as "customers"
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('id, company, actual_close_date')
        .eq('stage', 'closed_won');

      if (dealsError) throw dealsError;

      // Calculate total revenue
      const totalRevenue = (revenueEvents || []).reduce(
        (sum, e) => sum + Number(e.amount),
        0
      );

      // Unique customers (by deal_id from revenue events)
      const uniqueCustomerIds = new Set(
        (revenueEvents || []).map((e) => e.deal_id)
      );
      const uniqueCustomers = uniqueCustomerIds.size || (deals || []).length || 1;

      // LTV = Total Revenue / Unique Customers
      const ltv = totalRevenue / uniqueCustomers;

      // Total marketing spend (use actual_spend if available, fallback to budget)
      const totalSpend = (campaigns || []).reduce(
        (sum, c) => sum + Number(c.actual_spend || c.budget || 0),
        0
      );

      // New customers in last 6 months (for CAC calculation)
      const sixMonthsAgo = subMonths(new Date(), 6);
      const recentCustomers = (deals || []).filter((d) => {
        if (!d.actual_close_date) return false;
        return new Date(d.actual_close_date) >= sixMonthsAgo;
      });
      const newCustomers = recentCustomers.length || 1;

      // CAC = Total Marketing Spend / New Customers
      const cac = totalSpend / newCustomers;

      // LTV:CAC Ratio (healthy is 3:1 or higher)
      const ltvCacRatio = cac > 0 ? ltv / cac : 0;

      // Calculate monthly churn rate from cohorts
      const totalCohortCustomers = (cohorts || []).length || 1;
      const churnedCustomers = (cohorts || []).filter((c) => c.is_churned).length;
      const monthlyChurnRate = (churnedCustomers / totalCohortCustomers) * 100;

      // Payback Period in months = CAC / (LTV / avg customer lifespan)
      // Simplified: Payback = CAC / Monthly Revenue per Customer
      const avgMonthlyRevenue = ltv / 12; // Assume 12-month avg lifespan
      const paybackMonths = avgMonthlyRevenue > 0 ? cac / avgMonthlyRevenue : 0;

      // Avg revenue per customer
      const avgRevenuePerCustomer = totalRevenue / uniqueCustomers;

      setMetrics({
        ltv,
        cac,
        ltvCacRatio,
        paybackMonths,
        uniqueCustomers,
        totalRevenue,
        totalSpend,
        newCustomers,
        avgRevenuePerCustomer,
        monthlyChurnRate,
      });

      setError(null);
    } catch (err) {
      console.error('[useUnitEconomics] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch unit economics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
}

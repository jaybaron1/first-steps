import { useEffect, useState, useCallback } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export interface PartnerRevenueRow {
  partner_id: string;
  partner_name: string;
  total_revenue: number;
  total_commission: number;
  client_count: number;
  this_month: number;
}

export interface PartnerRevenueMetrics {
  totalPartnerRevenue: number;
  partnerRevenueThisMonth: number;
  partnerRevenueLastMonth: number;
  totalCommissionsOwed: number;
  totalCommissionsPaid: number;
  topPartners: PartnerRevenueRow[];
  partnerSharePercent: number;
}

export function usePartnerRevenue() {
  const [metrics, setMetrics] = useState<PartnerRevenueMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);

      const [eventsRes, revenueRes, partnersRes, clientsRes] = await Promise.all([
        (supabase as any).from('commercial_events').select('*'),
        supabase.from('revenue_events').select('amount, source, event_date'),
        supabase.from('partners').select('id, name'),
        supabase.from('partner_clients').select('id, partner_id'),
      ]);

      if (eventsRes.error) throw eventsRes.error;
      if (revenueRes.error) throw revenueRes.error;
      if (partnersRes.error) throw partnersRes.error;
      if (clientsRes.error) throw clientsRes.error;

      const events = (eventsRes.data || []) as any[];
      const revenue = (revenueRes.data || []) as any[];
      const partners = (partnersRes.data || []) as any[];
      const clients = (clientsRes.data || []) as any[];

      const now = new Date();
      const thisStart = startOfMonth(now);
      const thisEnd = endOfMonth(now);
      const lastStart = startOfMonth(subMonths(now, 1));
      const lastEnd = endOfMonth(subMonths(now, 1));

      const totalRevenueAll = revenue.reduce((s, r) => s + Number(r.amount), 0);
      const partnerRevenueAll = revenue
        .filter((r) => r.source === 'partner')
        .reduce((s, r) => s + Number(r.amount), 0);
      const partnerRevenueThisMonth = revenue
        .filter((r) => {
          if (r.source !== 'partner') return false;
          const d = new Date(r.event_date);
          return d >= thisStart && d <= thisEnd;
        })
        .reduce((s, r) => s + Number(r.amount), 0);
      const partnerRevenueLastMonth = revenue
        .filter((r) => {
          if (r.source !== 'partner') return false;
          const d = new Date(r.event_date);
          return d >= lastStart && d <= lastEnd;
        })
        .reduce((s, r) => s + Number(r.amount), 0);

      const totalCommissionsOwed = events
        .filter((e) => e.payment_status === 'due')
        .reduce((s, e) => s + Number(e.commission_amount), 0);
      const totalCommissionsPaid = events
        .filter((e) => e.payment_status === 'paid')
        .reduce((s, e) => s + Number(e.commission_amount), 0);

      // Per-partner aggregation
      const clientToPartner = new Map(clients.map((c) => [c.id, c.partner_id]));
      const partnerMap = new Map<string, PartnerRevenueRow>();
      partners.forEach((p) =>
        partnerMap.set(p.id, {
          partner_id: p.id,
          partner_name: p.name,
          total_revenue: 0,
          total_commission: 0,
          client_count: 0,
          this_month: 0,
        }),
      );
      const clientCounts = new Map<string, Set<string>>();

      events.forEach((e) => {
        const pid = clientToPartner.get(e.client_id);
        if (!pid) return;
        const row = partnerMap.get(pid);
        if (!row) return;
        row.total_revenue += Number(e.amount_charged);
        row.total_commission += Number(e.commission_amount);
        const d = new Date(e.event_date);
        if (d >= thisStart && d <= thisEnd) row.this_month += Number(e.amount_charged);
        if (!clientCounts.has(pid)) clientCounts.set(pid, new Set());
        clientCounts.get(pid)!.add(e.client_id);
      });
      partnerMap.forEach((row, pid) => {
        row.client_count = clientCounts.get(pid)?.size || 0;
      });

      const topPartners = Array.from(partnerMap.values())
        .filter((r) => r.total_revenue > 0)
        .sort((a, b) => b.total_revenue - a.total_revenue)
        .slice(0, 10);

      setMetrics({
        totalPartnerRevenue: partnerRevenueAll,
        partnerRevenueThisMonth,
        partnerRevenueLastMonth,
        totalCommissionsOwed,
        totalCommissionsPaid,
        topPartners,
        partnerSharePercent: totalRevenueAll > 0 ? (partnerRevenueAll / totalRevenueAll) * 100 : 0,
      });
      setError(null);
    } catch (err) {
      console.error('[usePartnerRevenue]', err);
      setError(err instanceof Error ? err.message : 'Failed to load partner revenue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
}

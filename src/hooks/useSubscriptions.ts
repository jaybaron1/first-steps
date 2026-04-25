import { useEffect, useState, useCallback } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';

export interface ClientSubscription {
  id: string;
  client_id: string | null;
  client_name: string;
  monthly_amount: number;
  start_date: string;
  end_date: string | null;
  status: 'active' | 'paused' | 'churned';
  is_partner_sourced: boolean;
  partner_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionMetrics {
  mrr: number;
  arr: number;
  activeCount: number;
  partnerMrr: number;
  directMrr: number;
  churnedThisMonth: number;
}

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<ClientSubscription[]>([]);
  const [metrics, setMetrics] = useState<SubscriptionMetrics>({
    mrr: 0,
    arr: 0,
    activeCount: 0,
    partnerMrr: 0,
    directMrr: 0,
    churnedThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: err } = await (supabase as any)
        .from('client_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;

      const subs = (data || []) as ClientSubscription[];
      setSubscriptions(subs);

      const active = subs.filter((s) => s.status === 'active');
      const mrr = active.reduce((sum, s) => sum + Number(s.monthly_amount), 0);
      const partnerMrr = active
        .filter((s) => s.is_partner_sourced)
        .reduce((sum, s) => sum + Number(s.monthly_amount), 0);

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const churnedThisMonth = subs.filter(
        (s) => s.status === 'churned' && s.end_date && new Date(s.end_date) >= monthStart,
      ).length;

      setMetrics({
        mrr,
        arr: mrr * 12,
        activeCount: active.length,
        partnerMrr,
        directMrr: mrr - partnerMrr,
        churnedThisMonth,
      });
      setError(null);
    } catch (err) {
      console.error('[useSubscriptions]', err);
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const create = async (input: Partial<ClientSubscription>) => {
    const { error: err } = await (supabase as any).from('client_subscriptions').insert([input]);
    if (err) throw err;
    await fetchSubscriptions();
  };

  const update = async (id: string, input: Partial<ClientSubscription>) => {
    const { error: err } = await (supabase as any)
      .from('client_subscriptions')
      .update(input)
      .eq('id', id);
    if (err) throw err;
    await fetchSubscriptions();
  };

  const remove = async (id: string) => {
    const { error: err } = await (supabase as any)
      .from('client_subscriptions')
      .delete()
      .eq('id', id);
    if (err) throw err;
    await fetchSubscriptions();
  };

  const generateMonthly = async () => {
    const { data, error: err } = await (supabase as any).rpc('generate_subscription_revenue');
    if (err) throw err;
    return data as number;
  };

  return {
    subscriptions,
    metrics,
    loading,
    error,
    refetch: fetchSubscriptions,
    create,
    update,
    remove,
    generateMonthly,
  };
}

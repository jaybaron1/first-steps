import { useState, useEffect, useCallback } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import type { Json } from '@/integrations/supabase/types';

export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Deal {
  id: string;
  lead_id: string | null;
  name: string;
  company: string | null;
  value: number;
  stage: DealStage;
  probability: number;
  expected_close_date: string | null;
  actual_close_date: string | null;
  owner_email: string | null;
  notes: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface DealWithRevenue extends Deal {
  total_revenue: number;
  touchpoint_count: number;
}

export interface PipelineMetrics {
  totalPipeline: number;
  weightedPipeline: number;
  avgDealSize: number;
  winRate: number;
  avgDealCycle: number;
  byStage: Record<DealStage, { count: number; value: number }>;
}

const STAGE_ORDER: DealStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

export function useDeals() {
  const [deals, setDeals] = useState<DealWithRevenue[]>([]);
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch deals with revenue events and touchpoints count
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select(`
          *,
          revenue_events(amount),
          attribution_touchpoints(id)
        `)
        .order('created_at', { ascending: false });

      if (dealsError) throw dealsError;

      const enrichedDeals: DealWithRevenue[] = (dealsData || []).map((deal: any) => ({
        ...deal,
        total_revenue: (deal.revenue_events || []).reduce((sum: number, e: any) => sum + Number(e.amount), 0),
        touchpoint_count: (deal.attribution_touchpoints || []).length,
      }));

      setDeals(enrichedDeals);

      // Calculate pipeline metrics
      const closedWon = enrichedDeals.filter(d => d.stage === 'closed_won');
      const closedLost = enrichedDeals.filter(d => d.stage === 'closed_lost');
      const openDeals = enrichedDeals.filter(d => !d.stage.startsWith('closed'));

      const byStage = STAGE_ORDER.reduce((acc, stage) => {
        const stageDeals = enrichedDeals.filter(d => d.stage === stage);
        acc[stage] = {
          count: stageDeals.length,
          value: stageDeals.reduce((sum, d) => sum + d.value, 0),
        };
        return acc;
      }, {} as Record<DealStage, { count: number; value: number }>);

      const totalClosed = closedWon.length + closedLost.length;
      const winRate = totalClosed > 0 ? (closedWon.length / totalClosed) * 100 : 0;

      // Calculate average deal cycle (days from created to closed_won)
      const cycleDeals = closedWon.filter(d => d.actual_close_date);
      const avgCycle = cycleDeals.length > 0
        ? cycleDeals.reduce((sum, d) => {
            const created = new Date(d.created_at);
            const closed = new Date(d.actual_close_date!);
            return sum + (closed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          }, 0) / cycleDeals.length
        : 0;

      setMetrics({
        totalPipeline: openDeals.reduce((sum, d) => sum + d.value, 0),
        weightedPipeline: openDeals.reduce((sum, d) => sum + (d.value * d.probability / 100), 0),
        avgDealSize: enrichedDeals.length > 0 
          ? enrichedDeals.reduce((sum, d) => sum + d.value, 0) / enrichedDeals.length 
          : 0,
        winRate,
        avgDealCycle: avgCycle,
        byStage,
      });

      setError(null);
    } catch (err) {
      console.error('[useDeals] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDeal = async (deal: { name: string; value?: number; stage?: DealStage; [key: string]: unknown }) => {
    const { data, error } = await supabase
      .from('deals')
      .insert([deal as any])
      .select()
      .single();
    
    if (error) throw error;
    await fetchDeals();
    return data;
  };

  const updateDeal = async (id: string, updates: Partial<Omit<Deal, 'id' | 'created_at' | 'updated_at'>>) => {
    const { data, error } = await supabase
      .from('deals')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    await fetchDeals();
    return data;
  };

  const deleteDeal = async (id: string) => {
    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    await fetchDeals();
  };

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  return {
    deals,
    metrics,
    loading,
    error,
    refetch: fetchDeals,
    createDeal,
    updateDeal,
    deleteDeal,
  };
}

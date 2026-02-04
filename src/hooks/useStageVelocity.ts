import { useState, useEffect, useCallback } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import type { DealStage } from './useDeals';

export interface StageVelocity {
  stage: DealStage;
  avgHours: number;
  avgDays: number;
  count: number;
  minHours: number;
  maxHours: number;
}

export interface StageVelocityMetrics {
  byStage: Record<DealStage, StageVelocity>;
  overallAvgDays: number;
  fastestStage: DealStage | null;
  slowestStage: DealStage | null;
}

const STAGE_ORDER: DealStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

export function useStageVelocity() {
  const [metrics, setMetrics] = useState<StageVelocityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all stage history
      const { data: history, error: historyError } = await supabase
        .from('deal_stage_history')
        .select('*')
        .order('changed_at', { ascending: true });

      if (historyError) throw historyError;

      // Calculate velocity by stage
      const byStage: Record<DealStage, StageVelocity> = {} as Record<DealStage, StageVelocity>;

      STAGE_ORDER.forEach((stage) => {
        // Get all transitions FROM this stage (duration_hours represents time spent in from_stage)
        const stageTransitions = (history || []).filter(
          (h: any) => h.from_stage === stage && h.duration_hours != null
        );

        if (stageTransitions.length > 0) {
          const hours = stageTransitions.map((h: any) => Number(h.duration_hours));
          const avgHours = hours.reduce((a, b) => a + b, 0) / hours.length;

          byStage[stage] = {
            stage,
            avgHours,
            avgDays: avgHours / 24,
            count: stageTransitions.length,
            minHours: Math.min(...hours),
            maxHours: Math.max(...hours),
          };
        } else {
          // Default values if no history
          byStage[stage] = {
            stage,
            avgHours: 0,
            avgDays: 0,
            count: 0,
            minHours: 0,
            maxHours: 0,
          };
        }
      });

      // Calculate overall average (excluding closed stages)
      const openStages = ['lead', 'qualified', 'proposal', 'negotiation'] as DealStage[];
      const totalDays = openStages.reduce((sum, stage) => sum + byStage[stage].avgDays, 0);
      const stagesWithData = openStages.filter((s) => byStage[s].count > 0).length || 1;
      const overallAvgDays = totalDays / stagesWithData;

      // Find fastest and slowest stages
      const sortedBySpeed = openStages
        .filter((s) => byStage[s].count > 0)
        .sort((a, b) => byStage[a].avgDays - byStage[b].avgDays);

      const fastestStage = sortedBySpeed[0] || null;
      const slowestStage = sortedBySpeed[sortedBySpeed.length - 1] || null;

      setMetrics({
        byStage,
        overallAvgDays,
        fastestStage,
        slowestStage,
      });

      setError(null);
    } catch (err) {
      console.error('[useStageVelocity] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stage velocity');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
}

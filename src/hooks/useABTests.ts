import { useState, useEffect, useCallback } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';

export interface ABVariant {
  id: string;
  name: string;
  value: string;
  trafficPercent: number;
}

export interface ABExperiment {
  id: string;
  name: string;
  description: string | null;
  element_selector: string;
  variants: ABVariant[];
  traffic_percent: number;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  // Computed stats
  totalViews?: number;
  results?: ABVariantResult[];
}

export interface ABVariantResult {
  variantId: string;
  variantName: string;
  views: number;
  conversions: number;
  conversionRate: number;
  confidence: number;
  lift: number;
}

export interface UseABTestsResult {
  experiments: ABExperiment[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createExperiment: (experiment: Partial<ABExperiment>) => Promise<string | null>;
  updateExperiment: (id: string, updates: Partial<ABExperiment>) => Promise<boolean>;
  deleteExperiment: (id: string) => Promise<boolean>;
  getExperimentResults: (experimentId: string) => Promise<ABVariantResult[]>;
}

// Statistical significance calculation (Z-test approximation)
function calculateConfidence(controlRate: number, variantRate: number, controlN: number, variantN: number): number {
  if (controlN === 0 || variantN === 0) return 0;
  
  const pooledRate = (controlRate * controlN + variantRate * variantN) / (controlN + variantN);
  if (pooledRate === 0 || pooledRate === 1) return 0;
  
  const se = Math.sqrt(pooledRate * (1 - pooledRate) * (1/controlN + 1/variantN));
  if (se === 0) return 0;
  
  const z = Math.abs(variantRate - controlRate) / se;
  
  // Approximate normal CDF for confidence
  const confidence = 1 - 2 * (1 - normalCDF(z));
  return Math.round(confidence * 1000) / 10;
}

function normalCDF(z: number): number {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = z < 0 ? -1 : 1;
  z = Math.abs(z) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * z);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);

  return 0.5 * (1.0 + sign * y);
}

export function useABTests(): UseABTestsResult {
  const [experiments, setExperiments] = useState<ABExperiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('ab_experiments')
        .select('*')
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      // Parse variants from JSON
      const parsed = (data || []).map(exp => ({
        ...exp,
        variants: Array.isArray(exp.variants) ? (exp.variants as unknown as ABVariant[]) : [],
      }));

      setExperiments(parsed);
    } catch (err) {
      console.error('[useABTests] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch experiments');
    } finally {
      setLoading(false);
    }
  }, []);

  const createExperiment = useCallback(async (experiment: Partial<ABExperiment>): Promise<string | null> => {
    try {
      const insertData = {
        name: experiment.name || 'New Experiment',
        description: experiment.description || null,
        element_selector: experiment.element_selector || '',
        variants: JSON.stringify(experiment.variants || []),
        traffic_percent: experiment.traffic_percent || 100,
        status: experiment.status || 'draft',
        start_date: experiment.start_date || null,
        end_date: experiment.end_date || null,
      };

      const { data, error: insertError } = await supabase
        .from('ab_experiments')
        .insert([insertData] as never)
        .select('id')
        .single();

      if (insertError) throw insertError;

      await fetchExperiments();
      return data?.id || null;
    } catch (err) {
      console.error('[useABTests] Create error:', err);
      return null;
    }
  }, [fetchExperiments]);

  const updateExperiment = useCallback(async (id: string, updates: Partial<ABExperiment>): Promise<boolean> => {
    try {
      const updateData: Record<string, unknown> = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.element_selector !== undefined) updateData.element_selector = updates.element_selector;
      if (updates.variants !== undefined) updateData.variants = updates.variants as unknown as Record<string, unknown>[];
      if (updates.traffic_percent !== undefined) updateData.traffic_percent = updates.traffic_percent;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.start_date !== undefined) updateData.start_date = updates.start_date;
      if (updates.end_date !== undefined) updateData.end_date = updates.end_date;

      const { error: updateError } = await supabase
        .from('ab_experiments')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchExperiments();
      return true;
    } catch (err) {
      console.error('[useABTests] Update error:', err);
      return false;
    }
  }, [fetchExperiments]);

  const deleteExperiment = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('ab_experiments')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setExperiments(prev => prev.filter(e => e.id !== id));
      return true;
    } catch (err) {
      console.error('[useABTests] Delete error:', err);
      return false;
    }
  }, []);

  const getExperimentResults = useCallback(async (experimentId: string): Promise<ABVariantResult[]> => {
    try {
      // Get assignments
      const { data: assignments } = await supabase
        .from('ab_assignments')
        .select('variant_id, session_id')
        .eq('experiment_id', experimentId);

      // Get conversions
      const { data: conversions } = await supabase
        .from('ab_conversions')
        .select('variant_id, session_id')
        .eq('experiment_id', experimentId);

      if (!assignments || assignments.length === 0) return [];

      // Group by variant
      const variantStats = new Map<string, { views: Set<string>; conversions: Set<string> }>();
      
      assignments.forEach(a => {
        if (!variantStats.has(a.variant_id)) {
          variantStats.set(a.variant_id, { views: new Set(), conversions: new Set() });
        }
        variantStats.get(a.variant_id)!.views.add(a.session_id);
      });

      conversions?.forEach(c => {
        if (variantStats.has(c.variant_id)) {
          variantStats.get(c.variant_id)!.conversions.add(c.session_id);
        }
      });

      // Get experiment to match variant names
      const experiment = experiments.find(e => e.id === experimentId);
      const variantNames = new Map(experiment?.variants.map(v => [v.id, v.name]) || []);

      // Calculate results
      const results: ABVariantResult[] = Array.from(variantStats.entries()).map(([variantId, stats]) => {
        const views = stats.views.size;
        const convCount = stats.conversions.size;
        const conversionRate = views > 0 ? (convCount / views) * 100 : 0;

        return {
          variantId,
          variantName: variantNames.get(variantId) || variantId,
          views,
          conversions: convCount,
          conversionRate: Math.round(conversionRate * 100) / 100,
          confidence: 0,
          lift: 0,
        };
      });

      // Calculate confidence and lift relative to control (first variant)
      if (results.length > 1) {
        const control = results[0];
        results.forEach((r, i) => {
          if (i === 0) {
            r.confidence = 0; // Control is baseline
            r.lift = 0;
          } else {
            r.confidence = calculateConfidence(
              control.conversionRate / 100,
              r.conversionRate / 100,
              control.views,
              r.views
            );
            r.lift = control.conversionRate > 0
              ? Math.round(((r.conversionRate - control.conversionRate) / control.conversionRate) * 1000) / 10
              : 0;
          }
        });
      }

      return results;
    } catch (err) {
      console.error('[useABTests] Results error:', err);
      return [];
    }
  }, [experiments]);

  useEffect(() => {
    fetchExperiments();
  }, [fetchExperiments]);

  return {
    experiments,
    loading,
    error,
    refetch: fetchExperiments,
    createExperiment,
    updateExperiment,
    deleteExperiment,
    getExperimentResults,
  };
}

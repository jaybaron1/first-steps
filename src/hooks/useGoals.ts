import { useState, useEffect, useCallback } from 'react';
import { adminSupabase as supabase } from '@/lib/adminBackend';
import { Json } from '@/integrations/supabase/types';

export interface Goal {
  id: string;
  name: string;
  description: string | null;
  goal_type: 'url_visit' | 'event' | 'time_on_site' | 'scroll_depth' | 'page_count' | 'form_submit';
  goal_config: GoalConfig;
  value: number | null;
  status: 'active' | 'paused' | 'archived';
  created_at: string;
}

export interface GoalConfig {
  url_pattern?: string;
  min_time?: number;
  event_type?: string;
  [key: string]: string | number | Record<string, string> | undefined;
  event_filter?: Record<string, string>;
  min_seconds?: number;
  min_depth?: number;
  min_pages?: number;
  form_id?: string;
}

export interface GoalCompletion {
  id: string;
  goal_id: string;
  session_id: string;
  completed_at: string;
  metadata: Record<string, unknown>;
}

export interface GoalStats {
  goal: Goal;
  completions: number;
  completionsToday: number;
  conversionRate: number;
  trend: { date: string; count: number }[];
}

interface UseGoalsResult {
  goals: Goal[];
  goalStats: GoalStats[];
  loading: boolean;
  error: string | null;
  createGoal: (goal: Omit<Goal, 'id' | 'created_at'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useGoals(): UseGoalsResult {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalStats, setGoalStats] = useState<GoalStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('conversion_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;
      
      const typedGoals = (goalsData || []) as Goal[];
      setGoals(typedGoals);

      // Fetch completions for stats
      const goalIds = typedGoals.map(g => g.id);
      if (goalIds.length === 0) {
        setGoalStats([]);
        setLoading(false);
        return;
      }

      const { data: completions, error: completionsError } = await supabase
        .from('goal_completions')
        .select('*')
        .in('goal_id', goalIds);

      if (completionsError) throw completionsError;

      // Get total sessions for conversion rate
      const { count: totalSessions } = await supabase
        .from('visitor_sessions')
        .select('*', { count: 'exact', head: true });

      // Calculate stats for each goal
      const today = new Date().toISOString().split('T')[0];
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
      });

      const stats: GoalStats[] = typedGoals.map(goal => {
        const goalCompletions = (completions || []).filter(c => c.goal_id === goal.id);
        const completionsToday = goalCompletions.filter(c => 
          c.completed_at?.startsWith(today)
        ).length;

        // Calculate trend (last 7 days)
        const trendMap = new Map<string, number>();
        last7Days.forEach(date => trendMap.set(date, 0));
        goalCompletions.forEach(c => {
          const date = c.completed_at?.split('T')[0];
          if (date && trendMap.has(date)) {
            trendMap.set(date, (trendMap.get(date) || 0) + 1);
          }
        });

        const trend = Array.from(trendMap.entries())
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => a.date.localeCompare(b.date));

        return {
          goal,
          completions: goalCompletions.length,
          completionsToday,
          conversionRate: totalSessions && totalSessions > 0
            ? Math.round((goalCompletions.length / totalSessions) * 1000) / 10
            : 0,
          trend,
        };
      });

      setGoalStats(stats);
    } catch (err) {
      console.error('[useGoals] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch goals');
    } finally {
      setLoading(false);
    }
  }, []);

  const createGoal = useCallback(async (goal: Omit<Goal, 'id' | 'created_at'>) => {
    const { error } = await supabase
      .from('conversion_goals')
      .insert([{
        ...goal,
        goal_config: goal.goal_config as unknown as Json,
      }]);
    
    if (error) throw error;
    await fetchGoals();
  }, [fetchGoals]);

  const updateGoal = useCallback(async (id: string, updates: Partial<Goal>) => {
    const updateData = {
      ...updates,
      goal_config: updates.goal_config ? updates.goal_config as unknown as Json : undefined,
    };
    const { error } = await supabase
      .from('conversion_goals')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
    await fetchGoals();
  }, [fetchGoals]);

  const deleteGoal = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('conversion_goals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    await fetchGoals();
  }, [fetchGoals]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return {
    goals,
    goalStats,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals,
  };
}

// Hook for checking goal completion in frontend
export function useGoalChecker() {
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const fetchActiveGoals = async () => {
      const { data } = await supabase
        .from('conversion_goals')
        .select('*')
        .eq('status', 'active');
      
      setActiveGoals((data || []) as Goal[]);
    };

    fetchActiveGoals();
  }, []);

  const checkAndRecordGoal = useCallback(async (
    sessionId: string,
    context: {
      pageUrl?: string;
      eventType?: string;
      eventData?: Record<string, unknown>;
      totalTimeSeconds?: number;
      scrollDepth?: number;
      pageCount?: number;
    }
  ) => {
    for (const goal of activeGoals) {
      let matches = false;
      
      switch (goal.goal_type) {
        case 'url_visit':
          if (context.pageUrl && goal.goal_config.url_pattern) {
            const pattern = goal.goal_config.url_pattern.replace(/%/g, '.*');
            matches = new RegExp(`^${pattern}$`).test(context.pageUrl);
          }
          break;
          
        case 'event':
          if (context.eventType === goal.goal_config.event_type) {
            if (goal.goal_config.event_filter && context.eventData) {
              matches = Object.entries(goal.goal_config.event_filter).every(
                ([key, value]) => context.eventData?.[key] === value
              );
            } else {
              matches = true;
            }
          }
          break;
          
        case 'time_on_site':
          if (context.totalTimeSeconds && goal.goal_config.min_seconds) {
            matches = context.totalTimeSeconds >= goal.goal_config.min_seconds;
          }
          break;
          
        case 'scroll_depth':
          if (context.scrollDepth && goal.goal_config.min_depth) {
            matches = context.scrollDepth >= goal.goal_config.min_depth;
          }
          break;
          
        case 'page_count':
          if (context.pageCount && goal.goal_config.min_pages) {
            matches = context.pageCount >= goal.goal_config.min_pages;
          }
          break;
      }

      if (matches) {
        // Check if already completed for this session
        const { data: existing } = await supabase
          .from('goal_completions')
          .select('id')
          .eq('goal_id', goal.id)
          .eq('session_id', sessionId)
          .limit(1);

        if (!existing || existing.length === 0) {
          const metadataForInsert: Json = {
            pageUrl: context.pageUrl,
            eventType: context.eventType,
            totalTimeSeconds: context.totalTimeSeconds,
            scrollDepth: context.scrollDepth,
            pageCount: context.pageCount,
          };
          await supabase
            .from('goal_completions')
            .insert([{
              goal_id: goal.id,
              session_id: sessionId,
              metadata: metadataForInsert,
            }]);
          
          console.log(`[GoalChecker] Goal completed: ${goal.name}`);
        }
      }
    }
  }, [activeGoals]);

  return { checkAndRecordGoal, activeGoals };
}

import React from 'react';
import { useStageVelocity } from '@/hooks/useStageVelocity';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DealStage } from '@/hooks/useDeals';

const STAGE_LABELS: Record<DealStage, string> = {
  lead: 'Lead',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed_won: 'Won',
  closed_lost: 'Lost',
};

const STAGE_COLORS: Record<DealStage, string> = {
  lead: '#8C857A',
  qualified: '#B8956C',
  proposal: '#A67C52',
  negotiation: '#8B6914',
  closed_won: '#22c55e',
  closed_lost: '#ef4444',
};

const StageVelocityChart: React.FC = () => {
  const { metrics, loading, error } = useStageVelocity();

  if (loading) {
    return <Skeleton className="h-48 w-full rounded-lg" />;
  }

  if (error || !metrics) {
    return (
      <div className="text-center py-8 text-[#8C857A]">
        No velocity data available
      </div>
    );
  }

  // Prepare data for chart (exclude closed stages)
  const openStages: DealStage[] = ['lead', 'qualified', 'proposal', 'negotiation'];
  const chartData = openStages.map((stage) => ({
    stage: STAGE_LABELS[stage],
    stageKey: stage,
    days: metrics.byStage[stage]?.avgDays || 0,
    count: metrics.byStage[stage]?.count || 0,
    color: STAGE_COLORS[stage],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white border border-[#B8956C]/20 rounded-lg shadow-lg p-3">
        <p className="font-medium text-[#1A1915]">{data.stage}</p>
        <p className="text-sm text-[#8C857A]">
          Avg: <span className="font-semibold text-[#B8956C]">{data.days.toFixed(1)} days</span>
        </p>
        <p className="text-xs text-[#8C857A]">
          Based on {data.count} transition{data.count !== 1 ? 's' : ''}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="flex items-center justify-between text-sm">
        <div>
          <span className="text-[#8C857A]">Average Cycle: </span>
          <span className="font-semibold text-[#1A1915]">
            {metrics.overallAvgDays.toFixed(1)} days
          </span>
        </div>
        {metrics.fastestStage && metrics.slowestStage && (
          <div className="text-xs text-[#8C857A]">
            Fastest: {STAGE_LABELS[metrics.fastestStage]} · Slowest: {STAGE_LABELS[metrics.slowestStage]}
          </div>
        )}
      </div>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            tick={{ fontSize: 11, fill: '#8C857A' }}
            tickFormatter={(v) => `${v}d`}
          />
          <YAxis 
            type="category" 
            dataKey="stage" 
            tick={{ fontSize: 11, fill: '#1A1915' }}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="days" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StageVelocityChart;

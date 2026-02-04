import React from 'react';
import { useDeals, DealStage } from '@/hooks/useDeals';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const STAGE_CONFIG: Record<DealStage, { label: string; color: string; bgColor: string }> = {
  lead: { label: 'Lead', color: 'text-slate-600', bgColor: 'bg-slate-100' },
  qualified: { label: 'Qualified', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  proposal: { label: 'Proposal', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  negotiation: { label: 'Negotiation', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  closed_won: { label: 'Won', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  closed_lost: { label: 'Lost', color: 'text-red-600', bgColor: 'bg-red-100' },
};

const PIPELINE_STAGES: DealStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won'];

const SalesPipeline: React.FC = () => {
  const { deals, metrics, loading } = useDeals();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-24 flex-1" />
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-8 text-[#8C857A]">
        No pipeline data available
      </div>
    );
  }

  const maxStageValue = Math.max(
    ...PIPELINE_STAGES.map(stage => metrics.byStage[stage]?.value || 0),
    1
  );

  return (
    <div className="space-y-6">
      {/* Pipeline Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#F9F6F0] rounded-xl p-4">
          <p className="text-xs text-[#8C857A] mb-1">Total Pipeline</p>
          <p className="text-2xl font-display font-semibold text-[#1A1915]">
            ${metrics.totalPipeline.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#F9F6F0] rounded-xl p-4">
          <p className="text-xs text-[#8C857A] mb-1">Weighted Pipeline</p>
          <p className="text-2xl font-display font-semibold text-[#1A1915]">
            ${metrics.weightedPipeline.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#F9F6F0] rounded-xl p-4">
          <p className="text-xs text-[#8C857A] mb-1">Win Rate</p>
          <p className="text-2xl font-display font-semibold text-emerald-600">
            {metrics.winRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Pipeline Funnel */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[#4A4640]">Pipeline Stages</h4>
        <div className="flex gap-2 items-end h-32">
          {PIPELINE_STAGES.map((stage, index) => {
            const config = STAGE_CONFIG[stage];
            const stageData = metrics.byStage[stage];
            const heightPercent = maxStageValue > 0 
              ? (stageData?.value || 0) / maxStageValue * 100 
              : 0;

            return (
              <div key={stage} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className={cn(
                    'w-full rounded-t-lg transition-all duration-500',
                    config.bgColor
                  )}
                  style={{ height: `${Math.max(heightPercent, 10)}%` }}
                >
                  <div className="text-center pt-2">
                    <p className={cn('text-xs font-medium', config.color)}>
                      {stageData?.count || 0}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-[#4A4640]">{config.label}</p>
                  <p className="text-xs text-[#8C857A]">
                    ${((stageData?.value || 0) / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Deals */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-[#4A4640]">Recent Deals</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {deals.slice(0, 5).map(deal => {
            const config = STAGE_CONFIG[deal.stage];
            return (
              <div 
                key={deal.id} 
                className="flex items-center justify-between p-3 bg-[#F9F6F0] rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1915] truncate">
                    {deal.name}
                  </p>
                  <p className="text-xs text-[#8C857A]">
                    {deal.company || 'No company'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'px-2 py-1 rounded text-xs font-medium',
                    config.bgColor,
                    config.color
                  )}>
                    {config.label}
                  </span>
                  <span className="text-sm font-semibold text-[#1A1915]">
                    ${deal.value.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
          {deals.length === 0 && (
            <p className="text-sm text-[#8C857A] text-center py-4">
              No deals yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesPipeline;

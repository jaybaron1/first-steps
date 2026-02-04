import React from 'react';
import { AlertTriangle, Clock, Building2, DollarSign } from 'lucide-react';
import { useDeals, type DealStage } from '@/hooks/useDeals';
import { useStageVelocity } from '@/hooks/useStageVelocity';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const STAGE_THRESHOLDS: Record<DealStage, number> = {
  lead: 5,
  qualified: 7,
  proposal: 14,
  negotiation: 21,
  closed_won: 0,
  closed_lost: 0,
};

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

const AtRiskDealsPanel: React.FC = () => {
  const { deals, loading: dealsLoading } = useDeals();
  const { metrics: velocityMetrics, loading: velocityLoading } = useStageVelocity();

  const loading = dealsLoading || velocityLoading;

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  // Calculate at-risk deals
  const openStages: DealStage[] = ['lead', 'qualified', 'proposal', 'negotiation'];
  const openDeals = deals.filter((d) => openStages.includes(d.stage));

  const atRiskDeals = openDeals
    .map((deal) => {
      const daysInStage = (Date.now() - new Date(deal.updated_at).getTime()) / (1000 * 60 * 60 * 24);
      const avgDays = velocityMetrics?.byStage[deal.stage]?.avgDays || STAGE_THRESHOLDS[deal.stage];
      const threshold = avgDays * 1.5;
      const isAtRisk = daysInStage > threshold;
      const daysOverdue = daysInStage - threshold;

      return {
        ...deal,
        daysInStage,
        avgDays,
        threshold,
        isAtRisk,
        daysOverdue,
        riskScore: daysInStage / threshold,
      };
    })
    .filter((d) => d.isAtRisk)
    .sort((a, b) => b.riskScore - a.riskScore);

  const totalAtRiskValue = atRiskDeals.reduce((sum, d) => sum + d.value, 0);

  if (atRiskDeals.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Clock className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-[#8C857A] text-sm">All deals are progressing normally</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-sm font-medium text-red-800">
            {atRiskDeals.length} deal{atRiskDeals.length !== 1 ? 's' : ''} at risk
          </span>
        </div>
        <span className="text-sm font-bold text-red-800">
          {formatCurrency(totalAtRiskValue)}
        </span>
      </div>

      {/* At-risk deals list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {atRiskDeals.slice(0, 5).map((deal) => (
          <div
            key={deal.id}
            className="flex items-center justify-between p-3 bg-white border border-[#B8956C]/20 rounded-lg hover:border-red-300 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#1A1915] truncate">
                  {deal.name}
                </span>
                <Badge variant="outline" className="text-xs capitalize shrink-0">
                  {deal.stage.replace('_', ' ')}
                </Badge>
              </div>
              {deal.company && (
                <div className="flex items-center gap-1 text-xs text-[#8C857A] mt-1">
                  <Building2 className="w-3 h-3" />
                  {deal.company}
                </div>
              )}
            </div>

            <div className="text-right shrink-0 ml-4">
              <div className="font-semibold text-[#1A1915]">
                {formatCurrency(deal.value)}
              </div>
              <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                <Clock className="w-3 h-3" />
                {Math.round(deal.daysOverdue)}d overdue
              </div>
            </div>
          </div>
        ))}
      </div>

      {atRiskDeals.length > 5 && (
        <p className="text-center text-xs text-[#8C857A]">
          +{atRiskDeals.length - 5} more at-risk deals
        </p>
      )}
    </div>
  );
};

export default AtRiskDealsPanel;

import React from 'react';
import { AlertTriangle, Users, DollarSign, Calendar, TrendingDown } from 'lucide-react';
import { useCohortAnalysis } from '@/hooks/useCohortAnalysis';
import { Skeleton } from '@/components/ui/skeleton';

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

const ChurnAnalysisPanel: React.FC = () => {
  const { metrics, loading, error } = useCohortAnalysis();

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="text-center py-8 text-[#8C857A]">
        Unable to load churn analysis
      </div>
    );
  }

  const { churn, momGrowth, yoyGrowth } = metrics;

  // Determine health status
  const churnHealth = churn.monthlyChurnRate <= 2 ? 'healthy' : 
                      churn.monthlyChurnRate <= 5 ? 'warning' : 'critical';

  return (
    <div className="space-y-4">
      {/* Churn summary */}
      <div className={`p-4 rounded-lg border ${
        churnHealth === 'healthy' ? 'bg-green-50 border-green-200' :
        churnHealth === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className={`w-5 h-5 ${
              churnHealth === 'healthy' ? 'text-green-600' :
              churnHealth === 'warning' ? 'text-amber-600' : 'text-red-600'
            }`} />
            <span className={`font-medium ${
              churnHealth === 'healthy' ? 'text-green-800' :
              churnHealth === 'warning' ? 'text-amber-800' : 'text-red-800'
            }`}>
              Monthly Churn Rate
            </span>
          </div>
          <span className={`text-2xl font-bold ${
            churnHealth === 'healthy' ? 'text-green-700' :
            churnHealth === 'warning' ? 'text-amber-700' : 'text-red-700'
          }`}>
            {churn.monthlyChurnRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Revenue at Risk */}
        <div className="p-3 bg-white border border-[#B8956C]/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-red-500" />
            <span className="text-xs text-[#8C857A]">Revenue at Risk</span>
          </div>
          <span className="text-lg font-bold text-red-600">
            {formatCurrency(churn.revenueAtRisk)}
          </span>
        </div>

        {/* Avg Lifespan */}
        <div className="p-3 bg-white border border-[#B8956C]/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-[#B8956C]" />
            <span className="text-xs text-[#8C857A]">Avg Lifespan</span>
          </div>
          <span className="text-lg font-bold text-[#1A1915]">
            {churn.avgCustomerLifespan.toFixed(1)} mo
          </span>
        </div>

        {/* Active vs Churned */}
        <div className="p-3 bg-white border border-[#B8956C]/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-[#B8956C]" />
            <span className="text-xs text-[#8C857A]">Active Customers</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-green-600">
              {churn.activeCustomers}
            </span>
            <span className="text-xs text-[#8C857A]">
              / {churn.activeCustomers + churn.churnedCustomers} total
            </span>
          </div>
        </div>

        {/* Overall Churn */}
        <div className="p-3 bg-white border border-[#B8956C]/20 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-[#8C857A]">Overall Churn</span>
          </div>
          <span className="text-lg font-bold text-[#1A1915]">
            {churn.overallChurnRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Growth indicators */}
      <div className="flex items-center justify-between pt-2 border-t border-[#B8956C]/10">
        <div className="text-center flex-1">
          <div className="text-xs text-[#8C857A]">MoM Growth</div>
          <div className={`font-semibold ${momGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {momGrowth >= 0 ? '+' : ''}{momGrowth.toFixed(1)}%
          </div>
        </div>
        <div className="w-px h-8 bg-[#B8956C]/20" />
        <div className="text-center flex-1">
          <div className="text-xs text-[#8C857A]">YoY Growth</div>
          <div className={`font-semibold ${yoyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {yoyGrowth >= 0 ? '+' : ''}{yoyGrowth.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurnAnalysisPanel;

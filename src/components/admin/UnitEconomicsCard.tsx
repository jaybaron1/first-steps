import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Users, Clock, Target } from 'lucide-react';
import { useUnitEconomics } from '@/hooks/useUnitEconomics';
import { Skeleton } from '@/components/ui/skeleton';

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
};

const UnitEconomicsCard: React.FC = () => {
  const { metrics, loading, error } = useUnitEconomics();

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="text-center py-8 text-[#8C857A]">
        Unable to load unit economics
      </div>
    );
  }

  const { ltv, cac, ltvCacRatio, paybackMonths, monthlyChurnRate } = metrics;

  // Determine health indicators
  const ratioHealth = ltvCacRatio >= 3 ? 'healthy' : ltvCacRatio >= 1 ? 'warning' : 'critical';
  const paybackHealth = paybackMonths <= 12 ? 'healthy' : paybackMonths <= 18 ? 'warning' : 'critical';

  const healthColors = {
    healthy: 'text-green-600 bg-green-50',
    warning: 'text-amber-600 bg-amber-50',
    critical: 'text-red-600 bg-red-50',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* LTV */}
      <div className="bg-white border border-[#B8956C]/20 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-[#B8956C]/10">
            <DollarSign className="w-4 h-4 text-[#B8956C]" />
          </div>
          <span className="text-xs font-medium text-[#8C857A]">LTV</span>
        </div>
        <div className="text-2xl font-bold text-[#1A1915]">
          {formatCurrency(ltv)}
        </div>
        <div className="text-xs text-[#8C857A] mt-1">
          Lifetime Value
        </div>
      </div>

      {/* CAC */}
      <div className="bg-white border border-[#B8956C]/20 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-[#B8956C]/10">
            <Users className="w-4 h-4 text-[#B8956C]" />
          </div>
          <span className="text-xs font-medium text-[#8C857A]">CAC</span>
        </div>
        <div className="text-2xl font-bold text-[#1A1915]">
          {formatCurrency(cac)}
        </div>
        <div className="text-xs text-[#8C857A] mt-1">
          Acquisition Cost
        </div>
      </div>

      {/* LTV:CAC Ratio */}
      <div className="bg-white border border-[#B8956C]/20 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded-lg ${healthColors[ratioHealth]}`}>
            {ltvCacRatio >= 3 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>
          <span className="text-xs font-medium text-[#8C857A]">LTV:CAC</span>
        </div>
        <div className={`text-2xl font-bold ${
          ratioHealth === 'healthy' ? 'text-green-600' :
          ratioHealth === 'warning' ? 'text-amber-600' : 'text-red-600'
        }`}>
          {ltvCacRatio.toFixed(1)}:1
        </div>
        <div className="text-xs text-[#8C857A] mt-1">
          {ltvCacRatio >= 3 ? 'Healthy' : ltvCacRatio >= 1 ? 'Below Target' : 'Critical'}
        </div>
      </div>

      {/* Payback Period */}
      <div className="bg-white border border-[#B8956C]/20 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded-lg ${healthColors[paybackHealth]}`}>
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium text-[#8C857A]">Payback</span>
        </div>
        <div className={`text-2xl font-bold ${
          paybackHealth === 'healthy' ? 'text-green-600' :
          paybackHealth === 'warning' ? 'text-amber-600' : 'text-red-600'
        }`}>
          {paybackMonths.toFixed(1)}mo
        </div>
        <div className="text-xs text-[#8C857A] mt-1">
          Months to Recover
        </div>
      </div>
    </div>
  );
};

export default UnitEconomicsCard;

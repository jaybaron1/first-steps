import React from 'react';
import { useAttribution } from '@/hooks/useAttribution';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const CampaignROITable: React.FC = () => {
  const { data, loading, error } = useAttribution('linear');

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map(i => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-8 text-[#8C857A]">
        {error || 'No campaign data available'}
      </div>
    );
  }

  const campaigns = data.byCampaign;

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8 text-[#8C857A]">
        No campaigns with attributed revenue yet
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#B8956C]/20">
            <th className="text-left py-3 text-[#8C857A] font-medium">Campaign</th>
            <th className="text-left py-3 text-[#8C857A] font-medium">Source / Medium</th>
            <th className="text-right py-3 text-[#8C857A] font-medium">Spend</th>
            <th className="text-right py-3 text-[#8C857A] font-medium">Revenue</th>
            <th className="text-right py-3 text-[#8C857A] font-medium">Conversions</th>
            <th className="text-right py-3 text-[#8C857A] font-medium">ROI</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(campaign => {
            const roiPositive = campaign.roi > 0;
            const roiNegative = campaign.roi < 0;
            
            return (
              <tr key={campaign.campaign} className="border-b border-[#F3EDE4] hover:bg-[#F9F6F0]/50">
                <td className="py-3 font-medium text-[#1A1915]">
                  {campaign.campaign}
                </td>
                <td className="py-3 text-[#4A4640]">
                  {campaign.source || '-'} / {campaign.medium || '-'}
                </td>
                <td className="py-3 text-right text-[#4A4640]">
                  {campaign.spend > 0 ? `$${campaign.spend.toLocaleString()}` : '-'}
                </td>
                <td className="py-3 text-right font-medium text-[#1A1915]">
                  ${campaign.revenue.toLocaleString()}
                </td>
                <td className="py-3 text-right text-[#4A4640]">
                  {campaign.conversions}
                </td>
                <td className="py-3 text-right">
                  <div className={cn(
                    'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium',
                    roiPositive && 'bg-emerald-50 text-emerald-700',
                    roiNegative && 'bg-red-50 text-red-700',
                    !roiPositive && !roiNegative && 'bg-slate-50 text-slate-600'
                  )}>
                    {roiPositive && <TrendingUp className="w-3 h-3" />}
                    {roiNegative && <TrendingDown className="w-3 h-3" />}
                    {!roiPositive && !roiNegative && <Minus className="w-3 h-3" />}
                    {campaign.spend > 0 ? `${campaign.roi.toFixed(0)}%` : 'N/A'}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-[#B8956C]/20 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-[#8C857A]">Total Spend</p>
          <p className="text-lg font-semibold text-[#1A1915]">
            ${campaigns.reduce((sum, c) => sum + c.spend, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#8C857A]">Total Revenue</p>
          <p className="text-lg font-semibold text-[#1A1915]">
            ${campaigns.reduce((sum, c) => sum + c.revenue, 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#8C857A]">Avg ROI</p>
          {(() => {
            const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
            const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
            const avgRoi = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;
            return (
              <p className={cn(
                'text-lg font-semibold',
                avgRoi > 0 ? 'text-emerald-600' : avgRoi < 0 ? 'text-red-600' : 'text-[#1A1915]'
              )}>
                {totalSpend > 0 ? `${avgRoi.toFixed(0)}%` : 'N/A'}
              </p>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default CampaignROITable;
